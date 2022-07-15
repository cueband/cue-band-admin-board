<template>
  <div class="py-4 container-fluid">
    <soft-alert :color="'danger'" class="alert-dismissible" v-if="error || labelError || trackingError">
    {{error || labelError || trackingError}}
    </soft-alert>

    <soft-alert color="warning" class="alert-dismissible" style="" v-if="warning">
    {{warning}}
    </soft-alert>

    <div class="row" v-if="doneGenerating">
      <div class="text-center text-3xl p-6">All labels have been generated.</div>
    </div>

    <div class="row" v-if="preparingScan">
      <div class="text-center text-3xl p-6">Fetching user addresses...</div>
    </div>
    <div class="row" v-else>
      <div class="text-center text-3xl p-6" v-if="isNewInput && !doneGenerating">Scan a code to get started</div>
    </div>
    
    <div class="row" v-if="!preparingScan && !doneGenerating">
      <div class="col-6">
        <div class="row my-4">
          <label class="text-lg">Tracking Code: 
            <input type="text" v-model="trackingCode"/>
          </label> 
        </div>

        <div class="row my-4">
          <label class="text-lg">Box Number: 
            <input type="text" v-model="boxNumber" ref="boxNum2" :disabled="!saveButtonDisabled && (this.error || this.trackingError)"/>
          </label> 
        </div>

        <div class="row p-4">
          <button class="btn text-lg" :disabled="saveButtonDisabled" @click="saveValues()" :class="saveButtonClass">
            {{ saveButtonText }}
            <br v-show="!saveButtonDisabled"><img v-show="!saveButtonDisabled" src="@/assets/img/savecode.png"/>
          </button> 
        </div>

      </div>
      <div class="col-6">
        <label class="text-lg">User Data:</label>
        <div class="row my-2" v-if="selectedUsersData && selectedUsersData[currentIndex]">
          <strong>User Id: </strong><span>{{selectedUsersData[currentIndex].get('user').id}}</span> 
        </div>
        <div class="row my-2" v-if="selectedUsersData && selectedUsersData[currentIndex]">
          <strong>Address: </strong>
          <span class="pre-wrap">{{selectedUsersData[currentIndex].get('name')}}</span><br>
          <span class="pre-wrap">{{selectedUsersData[currentIndex].get('addressLine1')}}</span><br>
          <span class="pre-wrap">{{selectedUsersData[currentIndex].get('addressLine2')}}</span><br>
          <span class="pre-wrap">{{selectedUsersData[currentIndex].get('city')}}</span><br>
          <span class="pre-wrap">{{selectedUsersData[currentIndex].get('postcode')}}</span><br>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/api";
import SoftAlert from "@/components/VsudAlert.vue";
import labelGenerator from "@/labelGenerator/";

export default {
  name: "scanner-mode",
  components: {
    SoftAlert
  },
  props: ['selectedUsers'],
  computed: {
    doneGenerating () {
      return this.selectedUsers && (this.currentIndex >= this.selectedUsers.length);
    },
    saveButtonDisabled() {
      if (this.trackingError) return false;
      return this.saving || this.scannerPaused || !(this.trackingCode && this.boxNumber && this.isValidBoxNumber(this.boxNumber));
    },
    saveButtonText() {
      if (this.saving) {
        return "Generating...";
      }

      if (this.error || this.trackingError || this.labelError) {
        return "Clear Values & Start Over";
      }
      if (this.isNewInput) {
        return "Scan a code...";
      }

      if (!this.trackingCode) {
        return "Scan tracking code...";
      }

      if (this.trackingCode && (!this.boxNumber || !this.isValidBoxNumber(this.boxNumber))) {
        return "Enter box number...";
      }
      return "Print Label & Continue Scanning";
    },
    saveButtonClass() {
      if (this.saving) {
        return "blue text-white";
      }

      if (this.error || this.trackingError) {
        return "red text-white";
      }
      if (this.isNewInput) {
        return "";
      }

      if (!this.trackingCode) {
        return "";
      }

      if (this.trackingCode && (!this.boxNumber || !this.isValidBoxNumber(this.boxNumber))) {
        return "";
      }
      return "green text-white";
    }

  },
  watch: {
    async trackingCode(newVal, oldVal) {
      if (newVal == oldVal) return;
      if (newVal && newVal != "") this.isNewInput = false;
      this.trackingError = null;
      if (!newVal && !this.boxNumber) {
        this.isNewInput = true;
        return
      }
      this.warning = null;
      if (this.isLabelCode(newVal)) {
        this.warning = "The code you're trying to enter is a cueband label code."
      }
      let trackingData = await this.fetchTrackingCodeUser(newVal);
      if (trackingData && trackingData.length > 0) {
        this.trackingData = trackingData[0];
        if (this.trackingData) this.trackingError = "Tracking code is already in use.";
      }

      if (this.trackingCode && !this.boxNumber && !this.trackingError) {
        this.$refs.boxNum2.focus();
      }
    },
    async boxNumber(newVal, oldVal) {
      if (newVal == oldVal) return;
      if (newVal && newVal != "") this.isNewInput = false;
      if (!newVal && !this.trackingCode) this.isNewInput = true;
      this.warning = null;
      if (!this.isValidBoxNumber(newVal)) {
        this.boxData = null;
        return;
      }
      let boxData = await api.getDeviceBoxByBoxNumber(newVal);
      if (boxData && boxData.length > 0) {
        this.boxData = boxData[0];
        if (this.boxData.get('user').id != this.selectedUsersData[this.currentIndex].get('user').id) this.warning = "This box number is already assigned to a different user.";
        else if (this.boxData.get('user').id == this.selectedUsersData[this.currentIndex].get('user').id) this.warning = "The box number has been assigned to this user before.";
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
      saving: false,
      selectedUsersData: null,
      preparingScan: false,
      currentIndex: 0,
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
    async enterTrackingMode (barcode) {
      this.isNewInput = false;
      if (this.isValidBoxNumber(barcode)) {
        this.boxNumber = barcode;
      } else {
        this.trackingCode = barcode;
      }

      if (this.trackingCode && this.boxNumber && !this.scannerPaused) {
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
      if ( this.error || this.trackingError ) {
        this.startNewInput();
        return;
      }
      this.saving = true;
      try {
        let result = await labelGenerator.generateLabelFromTrackingCode(this.selectedUsersData[this.currentIndex], this.boxNumber, this.trackingCode);

        if (result) {
          console.log(result)
          this.startNewInput()
          this.currentIndex += 1;
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
      } else this.enterTrackingMode(barcode);
    },
    startNewInput () {
      document.activeElement.blur();
      this.scannerInputText = "";
      this.boxData = null;
      this.trackingData = null;
      this.labelCode = null;
      this.trackingCode = null;
      this.boxNumber = null;
      this.error = null;
      this.labelError = null;
      this.trackingError = null;
      this.warning = null;
    },
    async getUserAdresses() {
      this.preparingScan = true;
      try {
        const selectedUsersIds = this.selectedUsers.map(s => this.$store.getters.getStudyDataById(s).get('user').id);
        this.selectedUsersData = await api.GetUsersDeliveryInfoByIdArr(selectedUsersIds);
        console.log(this.selectedUsersData);
      } catch (err) {
        console.error(err);
      } finally {
        this.preparingScan = false;
      }
    },
  },
  mounted() {
    document.addEventListener("keypress", this.scannerListener);
    this.getUserAdresses();
  },
  beforeUnmount() {
    document.removeEventListener("keypress", this.scannerListener);
  }
};
</script>
