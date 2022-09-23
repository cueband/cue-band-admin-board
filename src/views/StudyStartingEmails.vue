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
          <div><label class="text-sm">Percentage of users to email</label><input type="number" name="user-email-percentage" :max="100 - userStudyEmailPercentage" v-model="selectedPercentage"/>%
          </div>
          <div><label class="text-sm">Number of users to email</label>
          <input type="number" name="user-email-percentage" :max="userCounts.total.totalUserCount - userCounts.total.studyEmailUserCount" min="0" v-model="selectedCount"/></div>
          <div><label class="text-sm">Type of users to email</label><select v-model="selectedUserType">
            <option value="all">All</option>
            <option value="android">Android</option>
            <option value="ios">iOS</option>
            </select></div>
        </div>
        <div class="col-12">
          <button class="bg-white text-center shadow border-radius-md d-flex align-items-center justify-content-center m-2 text-sm text-bold w-fit p-2 btn border-0 text-muted" @click="sendEmail()" :disabled="!selectedCount || loading">{{ loading ? 'Loading...' : 'Send Email'}}</button>
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
      userCounts: null,
      selectedPercentage: 0,
      selectedCount: 0,
      selectedUserType: 'all',
      loading: false
    };
  },
  watch: {
    selectedCount(val, oldVal) {
      if (val == oldVal) return;
      let selectedPercentage = val * 100 / this.userCounts.total.totalUserCount;
      if (this.selectedPercentage != selectedPercentage) this.selectedPercentage = selectedPercentage;
    },
    selectedPercentage(val, oldVal) {
      if (val == oldVal) return;
      let selectedCount = Math.round(val * this.userCounts.total.totalUserCount / 100);
      if (this.selectedCount != selectedCount) this.selectedCount = selectedCount;
    }
  },
  methods: {
    // ...mapActions(["fetchStudyData", "fetchMethodCounts"]),
    async fetchCounts () {
      try {
        this.userCounts = await api.GetUserStudyEmailCounts();
      } catch (err) {
        console.error(err);
      }
    },
    async sendEmail () {
      try {
        this.loading = true;
        let selectedUsers = await api.GetUserForFirstStudyEmail(this.selectedUserType, this.selectedCount);
        if (selectedUsers.length == 0) {
          alert("Sorry, no matching users found.")
          return;
        }
        this.selectedCount = selectedUsers.length;
        if (confirm(`Found ${selectedUsers.length} matching users. Are you sure you want to send an email to ${selectedUsers.length} of ${this.selectedUserType} users?`)) {
          await api.sendUserStartEmail(selectedUsers); 
          await this.fetchCounts();
        } else {
          console.log('cancelled')
        }
        this.loading = false;
      } catch (e) {
        console.log(e);
        this.loading = false;
      }
  }
  },
  async mounted() {
    await this.fetchCounts();
  },
};
</script>
<style scoped>
input[type="number"], select {
  width: 100px;
  margin: 0 5px;
}
</style>
