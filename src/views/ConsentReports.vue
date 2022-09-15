<template>
  <div>
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
      dataSource: []
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
    selectAll() {
      this.$refs.userDeviceTable && this.$refs.userDeviceTable.selectAll();
    }
  },
  async mounted () {
    await this.fetchReports();
  }
};
</script>
