<template>
  <div>
    <div class="py-2 container-fluid">
      <div class="row">
        <div class="col-12" v-if="userCounts">
          <div>Study start email has been sent to <strong>{{ userCounts.total.studyEmailUserCount }} ({{ userStudyEmailPercentage }}%) users</strong> out of a total of {{ userCounts.total.totalUserCount }} users.</div>
          <div>&nbsp;</div>
          <div><strong>{{ userCounts.android.studyEmailUserCount }} Android users</strong> have been sent the study start email ({{ androidUserStudyEmailPercentage }}% of all users) out of a total of {{ userCounts.android.totalUserCount }} Android users.</div>
          <div>&nbsp;</div>
          <div><strong>{{ userCounts.ios.studyEmailUserCount }} iOS users</strong> have been sent the study start email ({{ iOSUserStudyEmailPercentage }}% of all users) out of a total of {{ userCounts.ios.totalUserCount }} iOS users.</div>
        </div>
      </div>
    </div>
    <div class="py-2 container-fluid" v-if="userCounts">
      <div class="row">
        <div class="col-12">
          <span>Send an email to </span>
          <span><input type="number" name="user-email-percentage" :max="100 - userStudyEmailPercentage" min="0" v-model="selectedPercentage"/>% OR <input type="number" name="user-email-percentage" :max="userCounts.total.totalUserCount - userCounts.total.studyEmailUserCount" min="0" v-model="selectedCount"/> of 
          <select>
            <option val="all">All</option>
            <option val="android">Android</option>
            <option val="ios">iOS</option>
            </select> users.</span>
        </div>
        <div class="col-12">
          <button class="bg-white text-center shadow border-radius-md d-flex align-items-center justify-content-center m-2 text-sm text-bold w-fit p-2 btn border-0 text-muted">Generate Latest Report</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/api";
// import { mapGetters, mapActions } from "vuex";

export default {
  name: "users-page",
  components: {
  },
  computed: {
    // ...mapGetters(["allStudyData", "studyDataAwaitingDevice"]),
    userStudyEmailPercentage () {
      if (!this.userCounts || this.userCounts.total.totalUserCount == 0) return 0
      return this.userCounts.total.studyEmailUserCount * 100 / this.userCounts.total.totalUserCount 
    },
    androidUserStudyEmailPercentage () {
      if (!this.userCounts || this.userCounts.android.totalUserCount == 0) return 0
      return this.userCounts.android.studyEmailUserCount * 100 / this.userCounts.android.totalUserCount 
    },
    iOSUserStudyEmailPercentage () {
      if (!this.userCounts || this.userCounts.ios.totalUserCount == 0) return 0
      return this.userCounts.ios.studyEmailUserCount * 100 / this.userCounts.ios.totalUserCount 
    }
  },
  data() {
    return {
      userCounts: null
    };
  },
  methods: {
    // ...mapActions(["fetchStudyData", "fetchMethodCounts"]),
    async fetchCounts () {
      try {
        this.userCounts = await api.GetUserStudyEmailCounts();
        console.log(this.userCounts);
      } catch (err) {
        console.error(err);
      }
    },
    async generateLatestReport () {
      /* // date, name, address, tracking number (from the royal mail label)
      let reportObject = await deviceReportGenerator.generateDeviceOrderReport();
      if (!reportObject || !reportObject.get("csvFile") || !reportObject.get("csvFile").url()) return;
      let downloadUrl = document.createElement('a');
      downloadUrl.href = reportObject.get("csvFile").url();
      downloadUrl.setAttribute('download', reportObject.get("csvFile").name());
      downloadUrl.click();
      await this.fetchUnexportedDataCounts();
      await this.fetchDeviceOrderReports(); */
    },
  },
  async mounted() {
    await this.fetchCounts();
  }
};
</script>
