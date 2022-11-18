<template>
  <div>
    <div class="py-2 container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="nav nav-pills p-2">
            <button class="bg-white text-center shadow border-radius-md d-flex align-items-center justify-content-center m-2 text-sm text-bold w-fit p-2 btn border-0 text-muted" @click="generateConsentReport" :disabled="buttonEnabled === 'false'">{{ buttonText }}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="py-2 container-fluid">
      <div class="row">
        <div class="col-12">
          <generated-reports-table ref="consentReportsTable" tableName="User Consent" :reportsData="dataSource"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/api";
// import { mapGetters, mapActions } from "vuex";
import GeneratedReportsTable from "@/components/cueband/GeneratedReportsTable.vue";

export default {
  name: "users-page",
  components: {
      GeneratedReportsTable,
  },
  computed: {
    // ...mapGetters(["c", "studyDataAwaitingDevice"]),
  },
  data() {
    return {
      dataSource: [],
      buttonText: "Generate Consent Report",
      buttonEnabled: "true",
    };
  },
  methods: {
    // ...mapActions(["fetchStudyData", "fetchMethodCounts"]),
    async fetchReports () {
      try {
        this.dataSource = await api.getConsentReports();
        console.log(this.dataSource);
      } catch (err) {
        console.error(err);
      }
    },
    async generateConsentReport() {
      this.buttonText = "Generating Consent Report..."
      this.buttonEnabled = "false";
      await api.GenerateConsentReport();
      this.buttonText ="Generate Consent Report";
      this.buttonEnabled ="true";
    }
  },
  async mounted () {
    await this.fetchReports();
  }
};
</script>
