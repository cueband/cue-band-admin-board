<template>
  <div class="card mb-3">
    <div class="p-3 pb-0 card-header">
      <div class="row">
        <div class="col-md-8 d-flex align-items-center">
          <h6 class="mb-0">Consent</h6>
        </div>
      </div>
    </div>
    <div class="p-3 card-body">
      <ul class="list-group">
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Token:</strong> &nbsp;
          {{ info.consentObject.get("token") }}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Question 1:</strong> &nbsp;
          {{ info.consentObject.get("question1Answer") }}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Question 2:</strong> &nbsp;
          {{ info.consentObject.get("question2Answer") }}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Question 3:</strong> &nbsp;
          {{ info.consentObject.get("question3Answer") }}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Question 4:</strong> &nbsp;
          {{ info.consentObject.get("question4Answer") }}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Question 5:</strong> &nbsp;
          {{ info.consentObject.get("question5Answer") }}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Question 6:</strong> &nbsp;
          {{ info.consentObject.get("question6Answer")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Question 7:</strong> &nbsp;
          {{ info.consentObject.get("question7Answer")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Question 8:</strong> &nbsp;
          {{ info.consentObject.get("question8Answer")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Question 9:</strong> &nbsp;
          {{ info.consentObject.get("question9Answer")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Name:</strong> &nbsp;
          {{ info.consentObject.get("name")}}
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
};
</script>
