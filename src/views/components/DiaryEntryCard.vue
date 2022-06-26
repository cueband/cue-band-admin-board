<template>
  <div class="card">
    <div class="p-3 pb-0 card-header">
      <div class="row">
        <div class="col-md-8 d-flex align-items-center">
          <h6 class="mb-0">Diary Entry</h6>
        </div>
      </div>
    </div>
    <div class="p-3 card-body">
      <ul class="list-group">
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Local ID:</strong> &nbsp;
          {{ info.diaryEntryObject.get("localId")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Recorded Time:</strong> &nbsp;
          {{ info.diaryEntryObject.get("recordedTime")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Day Date:</strong> &nbsp;
          {{ info.diaryEntryObject.get("dayDate")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Drooling Duration:</strong> &nbsp;
          {{ info.diaryEntryObject.get("duration")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Drooling Frequency:</strong> &nbsp;
          {{ info.diaryEntryObject.get("frequency")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Drooling Severity:</strong> &nbsp;
          {{ info.diaryEntryObject.get("severity")}}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>

export default {
  name: "DiaryEntryCard",
  props: {
    info: {
      diaryEntryObject: {},
    },
  },
};
</script>
