<template>
  <div v-if="editingMode == editingModes.USER_SELECT">
    <div class="py-2 container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="nav nav-pills p-2">
            <button class="bg-white text-center shadow border-radius-md d-flex align-items-center justify-content-center m-2 text-sm text-bold w-fit p-2 btn border-0 text-muted" @click="selectAll">Select All</button>
            <button class="bg-white text-center shadow border-radius-md d-flex align-items-center justify-content-center m-2 text-sm text-bold w-fit p-2 btn border-0 text-muted" @click="deselectAll">Deselect All</button>
            <button class="bg-white text-center shadow border-radius-md d-flex align-items-center justify-content-center m-2 text-sm text-bold w-fit p-2 btn border-0 text-muted" @click="generateLabels" :disabled="isGeneratingBtnDisabled">{{ isGeneratingLabels ? 'Generating Labels...' : 'Generate Labels'}}</button>
            <!-- <div class="w-fit px-4 border-0"> </div> -->
            <button class="bg-white text-center shadow border-radius-md d-flex align-items-center justify-content-center m-2 text-sm text-bold w-fit p-2 btn border-0 text-muted" @click="switchToScanTracking" :disabled="isGeneratingBtnDisabled">{{preparingScan ? 'Preparing Scan...' : 'Scan & Generate'}}</button>
            <button class="bg-white text-center shadow border-radius-md d-flex align-items-center justify-content-center m-2 text-sm text-bold w-fit p-2 btn border-0 text-muted" @click="switchToScanLabels">Scan Pre-generated Labels</button>
          </div>
        </div>
      </div>
    </div>
    <div class="py-2 container-fluid">
      <div class="row">
        <div class="col-12">
          <study-data-table ref="userDeviceTable" tableName="User Devices" :allStudyData="dataSource" :isSelectable="true" @change="onUsersSelected"/>
        </div>
      </div>
    </div>
  </div>
  <div v-if="editingMode == editingModes.SCANNER_PRE_GENERATED">
    <div class="py-2 container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="nav nav-pills p-2 d-flex justify-content-end">
            <button class="bg-white text-center shadow border-radius-md d-flex align-items-center justify-content-center m-2 text-sm text-bold w-fit p-2 btn border-0 text-muted" @click="startOverPregeneratedScan">Clear Values & Start Over</button>
            <button class="bg-white text-center shadow border-radius-md d-flex align-items-center justify-content-center m-2 text-sm text-bold w-fit p-2 btn border-0 text-muted" @click="switchToUserSelectionMode">Exit Scanning Mode</button>
          </div>
        </div>
      </div>
    </div>
    <scanner-pre-generated ref="labelScanner"/>
  </div>
  <div v-if="editingMode == editingModes.SCANNER_TRACKING">
    <div class="py-2 container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="nav nav-pills p-2 d-flex justify-content-end">
            <button class="bg-white text-center shadow border-radius-md d-flex align-items-center justify-content-center m-2 text-sm text-bold w-fit p-2 btn border-0 text-muted" @click="startOverPregeneratedScan">Clear Values & Start Over</button>
            <button class="bg-white text-center shadow border-radius-md d-flex align-items-center justify-content-center m-2 text-sm text-bold w-fit p-2 btn border-0 text-muted" @click="switchToUserSelectionMode">Exit Scanning Mode</button>
          </div>
        </div>
      </div>
    </div>
    <scanner-generate-labels ref="labelScanner" :selectedUsers="selectedUsers"/>
  </div>
</template>
<script>
import api from "@/api";
import labelGenerator from "@/utils/labelGenerator/";
import { mapGetters, mapActions } from "vuex";
import StudyDataTable from "@/components/cueband/StudyDataTable.vue";
import {
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import ScannerPreGenerated from "@/views/components/ScannerPreGenerated.vue";
import ScannerGenerateLabels from "@/views/components/ScannerGenerateLabels.vue";
// import ScannerMode from "@/views/components/ScannerMode.vue";

export default {
  name: "users-page",
  components: {
      StudyDataTable,
      ScannerPreGenerated,
      ScannerGenerateLabels
      // ScannerMode
  },
  computed: {
    ...mapGetters(["allStudyData", "studyDataAwaitingDevice"]),
    dataSource () {
      return this.selectedTab && this[this.selectedTab.dataSource] || [];
    },
    isGeneratingBtnDisabled () {
      return this.isGeneratingLabels || this.selectedUsers.length == 0;
    }
  },
  data() {
    return {
      editingModes: {
        USER_SELECT: 0,
        SCANNER_PRE_GENERATED: 1,
        SCANNER_TRACKING: 2
      },
      editingMode: 0,
      iconBackground: "bg-gradient-success",
      faUsers,
      isGeneratingLabels: false,
      preparingScan: false,
      selectedUsers: [],
      pillTabs: [
        {
          name: "All Users",
          id: "allusers", 
          dataSource: "allStudyData"
        }, {
          name: "Awaiting Device",
          id: "awaitingdevice",
          dataSource: "studyDataAwaitingDevice"
        }
      ],
      pillTabsMap: null,
      selectedTab: {
        name: "Awaiting Device",
        id: "awaitingdevice", 
        dataSource: "studyDataAwaitingDevice"
      },
    };
  },
  methods: {
    ...mapActions(["fetchStudyData", "fetchMethodCounts"]),
    handleTabChange(event) {
      this.selectedTab = this.pillTabsMap.get(event.tabId);
    },
    onUsersSelected(usersString) {
      if (!usersString || usersString == "") this.selectedUsers = [];
      else this.selectedUsers = usersString.split(',');
    },
    selectAll() {
      this.$refs.userDeviceTable && this.$refs.userDeviceTable.selectAll();
    },
    deselectAll() {
      this.$refs.userDeviceTable && this.$refs.userDeviceTable.deselectAll();
    },
    async generateLabels() {
      this.isGeneratingLabels = true;
      try {
        const selectedUsersIds = this.selectedUsers.map(s => this.$store.getters.getStudyDataById(s).get('user').id);
        console.log(selectedUsersIds);
  
        const selectedUsersData = await api.GetUsersDeliveryInfoByIdArr(selectedUsersIds);
        console.log(selectedUsersData);
        await labelGenerator.generateLabels(selectedUsersData);
      } catch (err) {
        console.error(err);
      } finally {
        this.isGeneratingLabels = false;
      }
    },
    switchToScanLabels() {
      this.editingMode = this.editingModes.SCANNER_PRE_GENERATED;
    },
    switchToScanTracking() {
      this.editingMode = this.editingModes.SCANNER_TRACKING;
    },
    switchToUserSelectionMode() {
      this.selectedUsers = [];
      this.fetchStudyData();
      this.fetchMethodCounts();
      this.editingMode = this.editingModes.USER_SELECT;
    },
    startOverPregeneratedScan() {
      this.$refs.labelScanner && this.$refs.labelScanner.startNewInput()
    }
  },
  created() {
    this.pillTabsMap = new Map(this.pillTabs.map(o => ([o.id, o])));
    this.fetchStudyData();
    this.fetchMethodCounts();
  }
};
</script>
