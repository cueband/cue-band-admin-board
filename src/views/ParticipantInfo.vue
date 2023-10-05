<template>
  <div v-if="editingMode == editingModes.USER_SELECT">
    <div class="py-2 container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="nav nav-pills p-2" style="display: flex; flex-direction: column">
            <input type="text" class="form-control" placeholder="Search" style="margin-bottom: 10px" v-model="searchTerm" />
            <div style="display: flex; flex-direction: row; gap: 20px;"> 
              <div>
                <input type="radio" id="email" value="email" name="searchType" v-model="searchMode"/>
                <label for="email">E-mail</label>
              </div>
              <div>
                <input type="radio" id="name" value="name" name="searchType" v-model="searchMode"/>
                <label for="name">Name</label>
              </div>
              <div>
                <input type="radio" id="address" value="address" name="searchType" v-model="searchMode"/>
                <label for="address">Address</label>
              </div>
            </div>
            <button class="bg-white text-center shadow border-radius-md d-flex align-items-center justify-content-center m-2 text-sm text-bold w-fit p-2 btn border-0 text-muted" @click="onSearch" :disabled="searching">Search</button>
          </div>
        </div>
      </div>
    </div>
    <div class="py-2 container-fluid">
      <div class="row">
        <div class="col-12">
          <study-data-table ref="userDeviceTable" tableName="Users" :allStudyData="searchResults" :isSelectable="false" @change="onUsersSelected"/>
        </div>
      </div>
    </div>
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

export default {
  name: "users-page",
  components: {
      StudyDataTable,
      // ScannerMode
  },
  computed: {
    ...mapGetters(["getSearchResult"]),
    dataSource () {
      return this.selectedTab && this[this.selectedTab.dataSource] || [];
    },
    isGeneratingBtnDisabled () {
      return this.isGeneratingLabels || this.selectedUsers.length == 0;
    }
  },
  data() {
    return {
      searchMode: "email",
      searchTerm: "",
      searchResults: [],
      searching: false,

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
      requiresTrackingCode: true,
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
    ...mapActions(["setSearchResult"]),
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
    },
    async onSearch() {
      if(!this.searchTerm || this.searchTerm == '') return;

      this.searching = true;

      console.log("search")
      if(this.searchMode == "email") {
        this.searchResults = await api.SearchByEmailAddress(this.searchTerm);
        //this.setResult(this.searchResults);
      } else if(this.searchMode == "name") {
        this.searchResults = await api.SearchByName(this.searchTerm);
        //this.setResult(this.searchResults);
      } else if(this.searchMode == "address") {
        this.searchResults = await api.SearchByAddress(this.searchTerm);
        //this.setResult(this.searchResults);
      }

      this.searching = false;
    }
  },
  created() {
    this.pillTabsMap = new Map(this.pillTabs.map(o => ([o.id, o])));
    ///this.searchResults =  getSearchResult;
  }
};
</script>
