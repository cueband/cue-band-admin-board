<template>
  <div class="card mb-3">
    <div class="p-3 pb-0 card-header">
      <div class="row">
        <div class="col-md-8 d-flex align-items-center">
          <h6 class="mb-0">Highlights</h6>
        </div>
      </div>
    </div>
    <div class="p-3 card-body">
      <ul class="list-group">
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Name:</strong> &nbsp;
          {{ info.name }}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Email:</strong> &nbsp;
          {{ info.email }}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0" :class="getColorClass(info.hasFullConsent)">
          <strong>Full Consent:</strong> &nbsp;
          {{ info.hasFullConsent == null ? "?" : (info.hasFullConsent ? "Yes" : "No" ) }}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0" :class="getColorClass(info.hasParkinsons)">
          <strong>Has Parkinsons:</strong> &nbsp;
          {{ info.hasParkinsons == null ?  "?" : info.hasParkinsons }}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0" :class="getColorClass(info.hasDrooling)">
          <strong>Has Drooling:</strong> &nbsp;
          {{ info.hasDrooling == null ?  "?" : info.hasDrooling }}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0" :class="getColorClass(info.isTrial)">
          <strong>In Trial:</strong> &nbsp;
          {{ info.isTrial == null ?  "?" : (info.isTrial ? "Yes" : "No" ) }}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0" :class="getColorClass(info.isFreeLiving)">
          <strong>In Free-Living:</strong> &nbsp;
          {{ info.isFreeLiving == null ?  "?" : (info.isFreeLiving ? "Yes" : "No" ) }}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Platform:</strong> &nbsp;
          {{ info.platform }} <span class="text-xs text-bold text-secondary">({{info.deviceName}})</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  name: "ConsentCard",
  props: {
    info: {
      consentObject: {},
    },
  },
  methods: {
    getColorClass (value) {
      if (value == null) return "text-coral";
      if (!value) return "text-danger";
      else return "text-dark"
    }
  }
};
</script>
