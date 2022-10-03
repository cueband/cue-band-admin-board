<template>
  <div class="card mb-3">
    <div class="p-3 pb-0 card-header">
      <div class="row">
        <div class="col-md-8 d-flex align-items-center">
          <h6 class="mb-0">Demographics Data</h6>
        </div>
      </div>
    </div>
    <div class="p-3 card-body">
      <ul class="list-group">
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Token:</strong> &nbsp;
          {{ info.demographicsDataObject.get("token") }}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Age Range:</strong> &nbsp;
          {{ info.demographicsDataObject.get("ageRange") }}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Live On Uk:</strong> &nbsp;
          {{ info.demographicsDataObject.get("liveOnUk") }}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Ethnicity:</strong> &nbsp;
          {{ info.demographicsDataObject.get("ethnicity") }}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Ethnic Group:</strong> &nbsp;
          {{ info.demographicsDataObject.get("ethnicGroup") }}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Gender:</strong> &nbsp;
          {{ info.demographicsDataObject.get("gender")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Has Parkinsons: </strong> &nbsp;
          {{ info.demographicsDataObject.get("parkinsons")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Has Drooling: </strong> &nbsp;
          {{ info.demographicsDataObject.get("drooling")}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "DemographicsDataCard",
  props: {
    info: {
      demographicsDataObject: {},
    },
  },
};
</script>
