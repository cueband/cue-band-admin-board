<template>
  <div class="py-4 container-fluid">
    <soft-alert :color="'danger'" class="alert-dismissible" v-if="error || labelError || trackingError">
    {{error || labelError || trackingError}}
    </soft-alert>

    <soft-alert color="warning" class="alert-dismissible" style="" v-if="warning">
    {{warning}}
    </soft-alert>

    <div class="row">
      <div class="text-center text-3xl p-6" v-if="isNewInput">Scan a code to get started</div>
    </div>
    <div class="row">
      <div class="col-6">

        <div class="row mb-4">
          <label class="text-lg">Label Code: 
            <input type="text" v-model="labelCode"/>
          </label> 
        </div>

        <div class="row my-4">
          <label class="text-lg">Tracking Code: 
            <input type="text" v-model="trackingCode"/>
          </label> 
        </div>

        <div class="row my-4">
          <label class="text-lg">Box Number: 
            <input type="text" v-model="boxNumber" ref="boxNum"/>
          </label> 
        </div>

        <div class="row p-4">
          <button class="btn text-lg" :disabled="saveButtonDisabled" @click="saveValues()" :class="saveButtonClass">
            {{ saveButtonText }}
            <canvas ref="saveButtonCanvas" v-show="!saveButtonDisabled"></canvas>
          </button> 
        </div>

      </div>
      <div class="col-6">
        <label class="text-lg">Box Data:</label>
        <div class="row my-2" v-if="labelData">
          <strong>User Id: </strong><span>{{labelData.get('user').id}}</span> 
        </div>
        <div class="row my-2" v-if="labelData">
          <strong>Address: </strong><span class="pre-wrap">{{labelData.get('address')}}</span>
        </div>
        <div class="row my-2" v-if="labelData"> 
          <strong>Created At: </strong><span>{{labelData.get('createdAt')}}</span> 
        </div>
      </div>
    </div>
    
    <!-- <div class="row" v-if="currentView == this.views.TRACKING_VIEW">
      <span>Tracking code: {{ trackingCode }}</span>
    </div>
    <div class="row" v-if="currentView == this.views.LABEL_VIEW">
      <span>Label code: {{ labelCode }}</span>
    </div> -->
  </div>
</template>
<script>
import api from "@/api";
import JsBarcode from "jsbarcode";
import SoftAlert from "@/components/VsudAlert.vue";

export default {
  name: "scanner-mode",
  components: {
    SoftAlert
  },
  computed: {
    saveButtonDisabled() {
      if (this.labelError || this.trackingError) return false;
      return this.saving || this.scannerPaused || !(this.labelCode && this.trackingCode && this.boxNumber && this.isValidBoxNumber(this.boxNumber));
    },
    saveButtonText() {
      if (this.saving) {
        return "Saving...";
      }

      if (this.error || this.trackingError || this.labelError) {
        return "Clear Values & Start Over";
      }
      if (this.isNewInput) {
        return "Scan a code...";
      }

      if (this.labelCode && !this.trackingCode) {
        return "Scan tracking code...";
      }

      if (!this.labelCode && this.trackingCode) {
        return "Scan label code...";
      }

      if (this.labelCode && this.trackingCode && (!this.boxNumber || !this.isValidBoxNumber(this.boxNumber))) {
        return "Enter box number...";
      }
      return "Save & Continue scanning";
    },
    saveButtonClass() {
      if (this.saving) {
        return "blue text-white";
      }

      if (this.error || this.trackingError || this.labelError) {
        return "red text-white";
      }
      if (this.isNewInput) {
        return "";
      }

      if (this.labelCode && !this.trackingCode) {
        return "";
      }

      if (!this.labelCode && this.trackingCode) {
        return "";
      }

      if (this.labelCode && this.trackingCode && (!this.boxNumber || !this.isValidBoxNumber(this.boxNumber))) {
        return "";
      }
      return "green text-white";
    }

  },
  watch: {
    async labelCode(newVal, oldVal) {
      if (newVal == oldVal) return;
      if (newVal && newVal != "") this.isNewInput = false;
      if (this.labelError == "This label is already assigned a tracking code." || this.trackingError == "Tracking code is already in use." || this.labelError == "Box label is invalid or has been removed.") {
        this.labelData = {};
        this.trackingCode = null;
        this.boxNumber = null;
        this.error = null;
      };
      if (!newVal && !this.trackingCode && !this.boxNumber) this.isNewInput = true;
      this.labelError = null;
      if (!this.isLabelCode(newVal)) {
        this.labelData = null;
        return;
      }
      let labelData = await this.fetchLabelUser(newVal);
      if (labelData && labelData.length > 0) {
        this.labelData = labelData[0]
        let boxData = await this.fetchDeviceBox(this.labelData.get('deviceBox'));
        if (boxData) this.boxNumber = boxData.get('boxNumber');
        if (this.labelData.get('trackingCode')) {
          this.trackingCode = this.labelData.get('trackingCode');
          this.labelError = "This label is already assigned a tracking code."
        }
      } else {
        this.labelError = "Box label is invalid or has been removed.";
        this.isNewInput = true;
      }

      if (this.labelCode && this.trackingCode && !this.boxNumber  && !this.labelError && !this.trackingError) {
        this.$refs.boxNum.focus();
      }
    },
    async trackingCode(newVal, oldVal) {
      if (newVal == oldVal) return;
      if (newVal && newVal != "") this.isNewInput = false;
      if (this.labelError == "Box label is invalid or has been removed.") {
        this.labelCode = null;
        this.trackingData = {};
        this.boxNumber = null;
        this.error = null;
      };
      if (!newVal && !this.labelCode && !this.boxNumber) this.isNewInput = true;
      this.trackingError = null;

      let trackingData = await this.fetchTrackingCodeUser(newVal);
      if (trackingData && trackingData.length > 0) {
        this.trackingData = trackingData[0];
        if (this.labelData && this.trackingData.id != this.labelData.id) this.trackingError = "Tracking code is already in use.";
        else if (!this.labelData) this.labelCode = `cue${this.trackingData.id}`;
      }

      if (this.labelCode && this.isLabelCode(this.labelCode) && this.trackingCode && !this.boxNumber && !this.labelError && !this.trackingError) {
        this.$refs.boxNum.focus();
      }
    },
    async boxNumber(newVal, oldVal) {
      if (newVal == oldVal) return;
      if (newVal && newVal != "") this.isNewInput = false;
      if (!newVal && !this.labelCode && !this.trackingCode) this.isNewInput = true;
      this.warning = null;
      if (!this.isValidBoxNumber(newVal)) {
        this.boxData = null;
        return;
      }
      let boxData = await api.getDeviceBoxByBoxNumber(newVal);
      if (boxData && boxData.length > 0) {
        this.boxData = boxData[0];
        if (this.labelData && this.boxData.get('user').id != this.labelData.get('user').id) this.warning = "This box number is assigned to a different user.";
      }
    }
  },
  data() {
    return {
      lastKeypress: 0,
      keypressDelay: 60,
      scannerInputText: "",
      trackingCode: null,
      labelCode: null,
      boxData: null,
      boxNumber: null,
      scannerPaused: false,
      error: null,
      labelError: null,
      trackingError: null,
      isNewInput: true,
      labelData: null,
      trackingData: null,
      warning: null,
      saving: false
    };
  },
  methods: {
    // if the key pressed now is more than 30ms(?) delay from previous keypress then consider it a new input
    // capture first scan - ?

    scannerListener(event) {
      // if target is editable then the input field should handle the event
      // TODO: find a better way to check which inputs should handle text - the current method will also return true for radio buttons and check boxes
      if (this.scannerInputText == "" && event.key == "%") {
        event.preventDefault();
        this.scannerInputText = "%";
        this.lastKeypress = event.timeStamp;
        return false;
      }
      if (event.target && event.target.readOnly === false && !(this.scannerInputText && this.scannerInputText[0] == '%')) return;
      if (this.scannerPaused && !(this.scannerInputText && this.scannerInputText[0] == '%')) return;
      if (this.scannerInputText && this.scannerInputText[0] == '%') {
        event.preventDefault();
      }
      // if the key is pressed after a pause, treat it as a start for a new input and discard the previous
      if (event.timeStamp - this.lastKeypress > this.keypressDelay) this.scannerInputText = "";
      this.lastKeypress = event.timeStamp;

      // Ignore all keys aside from space, enter, tab and single character keys. 
      if (event.key.length > 1 && (event.key != "Enter" && event.key != "Space" && event.key !== "Tab")) return;

      // if Enter is pressed handle what has been input so far
      if (event.which == 13) {
        this.handleScannerTextInput()
        return;
      }
      this.scannerInputText += event.key;
    },
    isLabelCode(barcode) {
      return (barcode && barcode.indexOf('cue') == 0 && barcode.length == 13);
    },
    isValidBoxNumber(text) {
      return (/^\d+$/.test(text) && text.length == 4);
    },
    async enterLabelMode (barcode) {
      this.isNewInput = false;
      if (this.isLabelCode(barcode)) {
        this.labelCode = barcode;
      } else {
        this.trackingCode = barcode;
      }

      if (this.labelCode && this.trackingCode && this.boxNumber && !this.scannerPaused) {
        console.log('success');
      }
    },
    async fetchLabelUser(barcode) {
      return await api.getDeviceOrderByLabel(barcode);
    },
    async fetchTrackingCodeUser(barcode) {
      return await api.getDeviceOrderByTrackingCode(barcode);
    },
    async fetchDeviceBox(deviceBox) {
      if (deviceBox) {
        let boxData = await api.getDeviceBoxById(deviceBox);
        if (boxData.length > 0) {
          return boxData[0];
        }
      } else {
        return;
      }
    },
    async saveValues() {
      if (this.saveButtonDisabled) return;
      if ( this.error || this.trackingError || this.labelError ) {
        this.startNewInput();
        return;
      }
      this.saving = true;
      try {
        let result = await api.saveLabelTrackingCodeData({
          labelObject: this.labelData,
          trackingCode: this.trackingCode,
          boxNumber: this.boxNumber
        })

        if (result) {
          this.startNewInput()
        } else {
          this.error = "Failed to save values."
        }
      } catch (err) {
        console.log(err);
        this.error = err.message;
      } finally {
          this.saving = false;
      }
    },
    handleScannerTextInput () {
      let barcode = this.scannerInputText;
      this.scannerInputText = "";
      if (barcode == "%-save") {
        this.saveValues();
      } else this.enterLabelMode(barcode);
    },
    startNewInput () {
      document.activeElement.blur();
      this.scannerInputText = "";
      this.boxData = null;
      this.labelData = null;
      this.trackingData = null;
      this.labelCode = null;
      this.trackingCode = null;
      this.boxNumber = null;
      this.error = null;
      this.labelError = null;
      this.trackingError = null;
      this.warning = null;
    }
  },
  mounted() {
    document.addEventListener("keypress", this.scannerListener);
    this.$refs.saveButtonCanvas && JsBarcode(this.$refs.saveButtonCanvas, `%-save`, {
      height: 100,
      width: 2,
      displayValue: false
    });
  },
  beforeUnmount() {
    document.removeEventListener("keypress", this.scannerListener);
  }
};
</script>
