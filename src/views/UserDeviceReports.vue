<template>
  <div>
    <div class="py-2 container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="nav nav-pills p-2">
            <button class="bg-white text-center shadow border-radius-md d-flex align-items-center justify-content-center m-2 text-sm text-bold w-fit p-2 btn border-0 text-muted" @click="generateLatestReport">Generate Latest Report</button>
          </div>
        </div>
      </div>
    </div>
    <div class="py-2 container-fluid">
      <div class="row">
        <div class="col-12">
          <div>Unexported entries count: {{ unexportedRowsCount == null ? "Loading..." : unexportedRowsCount }}</div>
        </div>
      </div>
    </div>
    <div class="py-2 container-fluid">
      <div class="row">
        <div class="col-12">
          <generated-reports-table ref="generatedDeviceReportsTable" tableName="Device Shipping" :reportsData="dataSource"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/api";
import deviceReportGenerator from "@/utils/deviceReportGenerator"
// import { mapGetters, mapActions } from "vuex";
import GeneratedReportsTable from "@/components/cueband/GeneratedReportsTable.vue";

export default {
  name: "users-page",
  components: {
      GeneratedReportsTable,
  },
  computed: {
    // ...mapGetters(["allStudyData", "studyDataAwaitingDevice"]),
  },
  data() {
    return {
      dataSource: [],
      unexportedRowsCount: null,
    };
  },
  methods: {
    // ...mapActions(["fetchStudyData", "fetchMethodCounts"]),
    async fetchUnexportedDataCounts () {
      try {
        this.unexportedRowsCount = await api.GetUnexportedDeviceOrderCounts();
        console.log(this.unexportedRowsCount);
      } catch (err) {
        console.error(err);
      }
    },
    async fetchDeviceOrderReports () {
      try {
        this.dataSource = await api.getDeviceOrderReports();
        console.log(this.dataSource);
      } catch (err) {
        console.error(err);
      }
    },
    async generateLatestReport () {
      // date, name, address, tracking number (from the royal mail label)
      let reportObject = await deviceReportGenerator.generateDeviceOrderReport();
      if (!reportObject || !reportObject.get("csvFile") || !reportObject.get("csvFile").url()) return;
      let downloadUrl = document.createElement('a');
      downloadUrl.href = reportObject.get("csvFile").url();
      downloadUrl.setAttribute('download', reportObject.get("csvFile").name());
      downloadUrl.click();
      await this.fetchUnexportedDataCounts();
      await this.fetchDeviceOrderReports();
    },
  },
  async mounted() {
    await this.fetchUnexportedDataCounts();
    await this.fetchDeviceOrderReports();
  }
};
</script>
