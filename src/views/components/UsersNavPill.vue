<template>
  <div class="nav-wrapper position-relative end-0">
    <ul class="nav nav-pills nav-fill p-1" role="tablist">
      <li class="nav-item" v-for="tab in tabs" :key="`tab-${tab.id}`">
        <a
          class="nav-link mb-0 px-0 py-1 active active cursor-pointer"
          data-bs-toggle="tab"
          role="tab"
          @click="() => onTabSelected(tab.id)"
          :aria-selected="currentTab == tab.id"
          >{{tab.name}}</a
        >
      </li>
    </ul>
  </div>
</template>

<script>
import setNavPills from "@/assets/js/nav-pills.js";

export default {
  name: "users-nav-pill",
  props: {
    tabs: {type: Array, required: true}
  },
  data() {
    return {
      currentTab: null
    }
  },
  mounted() {
    setNavPills();
    if (!this.currentTab) this.onTabSelected(this.tabs[0].id);
  },
  methods: {
    onTabSelected(tabId) {
      if (this.currentTab == tabId) return;
      this.currentTab = tabId;
      this.$emit('tabChanged', { tabId })
    }
  }
};
</script>
