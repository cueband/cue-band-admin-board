<template>
  <div class="py-4 container-fluid">
    <div class="row" v-if="error">
      <span class="bold text-sm text-red">{{error}}</span>
    </div>
    <div class="row" v-if="currentView == this.views.WAITING_FOR_INPUT">
      <span>Scan a code to get started</span>
    </div>
    <div class="row" v-if="currentView == this.views.TRACKING_VIEW">
      <span>Tracking code: {{ trackingCode }}</span>
    </div>
    <div class="row" v-if="currentView == this.views.LABEL_VIEW">
      <span>Label code: {{ labelCode }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "scanner-mode",
  props: ["userList"],
  components: {

  },
  computed: {

  },
  data() {
    return {
      modes: {
        WAITING_FOR_INPUT: 0,
        WAITING_FOR_TRACKING_CODE: 1,
        WAITING_FOR_LABEL_CODE: 2
      },
      views: {
        WAITING_FOR_INPUT: 0,
        LABEL_VIEW: 1,
        TRACKING_VIEW: 2
      },
      currentMode: 0,
      currentView: 0,
      lastKeypress: 0,
      keypressDelay: 30,
      scannerInputText: "",
      trackingCode: null,
      labelCode: null,
      scannerPaused: false,
      error: null
    };
  },
  methods: {
    // if the key pressed now is more than 30ms(?) delay from previous keypress then consider it a new input
    // capture first scan - ?

    scannerListener(event) {
      // if target is editable then the input field should handle the event
      // TODO: find a better way to check which inputs should handle text - the current method will also return true for radio buttons and check boxes
      if (event.target && event.target.readOnly === false) return;
      if (this.scannerPaused) return;

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
      return (barcode.indexOf('cue') == 0);
    },
    async enterLabelMode (barcode) {
      this.user = {};
      this.labelCode = null;
      this.trackingCode = null;
      this.error = null;
      if (this.isLabelCode(barcode)) {
        this.labelCode = barcode;
        this.user = await this.fetchLabelUser(barcode);
        this.currentView = this.views.LABEL_VIEW;
        if (this.user) {
          this.currentMode = this.modes.WAITING_FOR_TRACKING_CODE;
        } else {
          this.error = "Box code isn't assigned to a user. Assign from user device page.";
          this.currentMode = this.modes.WAITING_FOR_INPUT;
        }
      } else {
        this.trackingCode = barcode;
        this.user = await this.fetchTrackingCodeUser(barcode);
        this.currentView = this.views.TRACKING_VIEW;
        if (this.user) {
          this.error = "Tracking code used. Unlink to reuse.";
          this.currentMode = this.modes.WAITING_FOR_INPUT;
        } else {
          this.currentMode = this.modes.WAITING_FOR_LABEL_CODE;
        }
      }
    },
    async fetchLabelUser() {
      return await Math.round(Math.random()) ? {} : false;
    },
    async fetchTrackingCodeUser() {
      return await Math.round(Math.random()) ? {} : false;
    },
    tryAttachTrackingCodeToLabel() {

    },
    tryAttachLabelCodeToUser() {

    },
    handleScannerTextInput () {
      let barcode = this.scannerInputText;
      this.scannerInputText = "";

      switch(this.currentMode) {
        case this.modes.WAITING_FOR_INPUT:
          this.enterLabelMode(barcode);
          break;
        case this.modes.WAITING_FOR_TRACKING_CODE:
          // if the barcode is another label code then load new barcode
          if (this.isLabelCode(barcode)) this.enterLabelMode(barcode);
          this.tryAttachTrackingCodeToLabel(barcode);
          break;
        case this.modes.WAITING_FOR_LABEL_CODE:
          // if the barcode is another tracking code then load new barcode
          if (!this.isLabelCode(barcode)) this.enterLabelMode(barcode);
          this.tryAttachLabelCodeToUser(barcode);
          break;
      }
    }
  },
  mounted() {
    document.addEventListener("keydown", this.scannerListener);
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.scannerListener);
  }
};
</script>
