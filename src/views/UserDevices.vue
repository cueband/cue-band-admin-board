<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <study-data-table :tableName="selectedTab && selectedTab.name" :allStudyData="dataSource" :key="`study-table-${this.selectedTab.id}`"/>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import StudyDataTable from "@/components/cueband/StudyDataTable.vue";
import {
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
// import ScannerMode from "@/views/components/ScannerMode.vue";

export default {
  name: "users-page",
  components: {
      StudyDataTable,
      // ScannerMode
  },
  computed: {
    ...mapGetters(["allStudyData", "studyDataAwaitingApproval", "studyDataAwaitingDevice", "studyDataNoStudy", "studyDataTrial", "studyDataFreeLiving", "studyDataFreeLivingFromTrial"]),
    dataSource () {
      return this.selectedTab && this[this.selectedTab.dataSource] || [];
    }
  },
  data() {
    return {
      iconBackground: "bg-gradient-success",
      faUsers,
      pillTabs: [
        {
          name: "All Users",
          id: "allusers", 
          dataSource: "allStudyData"
        }, {
          name: "Awaiting Approval",
          id: "awaitingapproval",
          dataSource: "studyDataAwaitingApproval"
        }, {
          name: "Awaiting Device",
          id: "awaitingdevice",
          dataSource: "studyDataAwaitingDevice"
        }, {
          name: "No Study",
          id: "nostudy",
          dataSource: "studyDataNoStudy"
        }, {
          name: "Trial",
          id: "trial",
          dataSource: "studyDataTrial"
        }, {
          name: "FreeLiving",
          id: "freeliving",
          dataSource: "studyDataFreeLiving"
        }, {
          name: "FreeLivingFromTrial",
          id: "freelivingfromtrial",
          dataSource: "studyDataFreeLivingFromTrial"
        }
      ],
      pillTabsMap: null,
      selectedTab: {},
    };
  },
  methods: {
    ...mapActions(["fetchStudyData", "fetchMethodCounts"]),
    handleTabChange(event) {
      this.selectedTab = this.pillTabsMap.get(event.tabId);
    }
  },
  created() {
    this.pillTabsMap = new Map(this.pillTabs.map(o => ([o.id, o])));
    this.fetchStudyData();
    this.fetchMethodCounts();
  }
};
</script>
