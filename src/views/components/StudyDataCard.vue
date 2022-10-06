<template>
  <div class="card mb-3">
    <div class="p-3 pb-0 card-header">
      <div class="row">
        <div class="col-md-8 d-flex align-items-center">
          <h6 class="mb-0">Study Data</h6>
        </div>
      </div>
    </div>
    <div class="p-3 card-body">
      <ul class="list-group">
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Trial: </strong> &nbsp;
          {{ info.studyDataObject.get("selectBranchesChooseTrial") }}
        </li>

        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Free Living: </strong> &nbsp;
          {{ info.studyDataObject.get("selectBranchesChooseFreeLiving") }}
        </li>

        <!-- <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Has Parkinsons: </strong> &nbsp;
          {{ info.demographicsDataObject.get("parkinsons") }}
        </li>

        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Experiences Drooling: </strong> &nbsp;
          {{ info.demographicsDataObject.get("drooling") }}
        </li> -->

        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Client Last Update:</strong> &nbsp;
          {{ info.studyDataObject.get("clientLastUpdate") }}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Server Last Update:</strong> &nbsp;
          {{ info.studyDataObject.get("serverLastUpdate") }}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Created At:</strong> &nbsp;
          {{ info.studyDataObject.createdAt }}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Updated At:</strong> &nbsp;
          {{ info.studyDataObject.updatedAt }}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Local Id:</strong> &nbsp;
          {{ info.studyDataObject.get("localId") }}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Study Branch:</strong> &nbsp;
          {{ info.studyDataObject.get("studyBranch") }}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Current State:</strong> &nbsp;
          {{ info.studyDataObject.get("currentState")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Previous State:</strong> &nbsp;
          {{ info.studyDataObject.get("previousState")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Cueing Enabled:</strong> &nbsp;
          {{ info.studyDataObject.get("cueingEnabled")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Cueing Method 1:</strong> &nbsp;
          {{ info.studyDataObject.get("cueingMethod1")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Cueing Method 2:</strong> &nbsp;
          {{ info.studyDataObject.get("cueingMethod2")}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  name: "StudyDataCard",
  components: {
  
  },
  props: {
    info: {
      studyDataObject: {},
    },
  },
};
</script>
