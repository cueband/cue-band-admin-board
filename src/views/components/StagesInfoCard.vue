<template>
  <div class="card h-100">
    <div class="p-3 pb-0 card-header">
      <div class="row">
        <div class="col-md-8 d-flex align-items-center">
          <h6 class="mb-0">Study Stages</h6>
        </div>
      </div>
    </div>
    <div class="p-3 card-body">
      <ul class="list-group">

        <!--AppStartedFirstTime-->
         <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">AppStartedFirstTime</strong>
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Started:</strong> &nbsp;
          {{ info.studyDataObject.get("appStartedFirstTimeDateStarted")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Finished:</strong> &nbsp;
          {{ info.studyDataObject.get("appStartedFirstTimeDateFinished")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Reached:</strong> &nbsp;
          {{ info.studyDataObject.get("appStartedFirstTimeReached")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">ProgressCondition:</strong> &nbsp;
          {{ info.studyDataObject.get("appStartedFirstTimeProgressCondition")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Done:</strong> &nbsp;
          {{ info.studyDataObject.get("appStartedFirstTimeDone")}}
        </li>

        <!--InterestedInParticipating-->
        <li class="pt-0 text-sm border-0 list-group-item ps-0" style="margin-top: 20px;">
          <strong class="text-dark">InterestedInParticipating</strong>
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Started:</strong> &nbsp;
          {{ info.studyDataObject.get("interestedInParticipatingDateStarted")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Finished:</strong> &nbsp;
          {{ info.studyDataObject.get("interestedInParticipatingDateFinished")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Reached:</strong> &nbsp;
          {{ info.studyDataObject.get("interestedInParticipatingReached")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">ProgressCondition:</strong> &nbsp;
          {{ info.studyDataObject.get("interestedInParticipatingProgressCondition")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Done:</strong> &nbsp;
          {{ info.studyDataObject.get("interestedInParticipatingDone")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Answered Yes:</strong> &nbsp;
          {{ info.studyDataObject.get("interestedInParticipatingAnsweredYes")}}
        </li>

        <!--GiveConsent-->
         <li class="pt-0 text-sm border-0 list-group-item ps-0" style="margin-top: 20px;">
          <strong class="text-dark">GiveConsent</strong>
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Started:</strong> &nbsp;
          {{ info.studyDataObject.get("giveConsentDateStarted")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Finished:</strong> &nbsp;
          {{ info.studyDataObject.get("giveConsentDateFinished")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Reached:</strong> &nbsp;
          {{ info.studyDataObject.get("giveConsentReached")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">ProgressCondition:</strong> &nbsp;
          {{ info.studyDataObject.get("giveConsentProgressCondition")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Done:</strong> &nbsp;
          {{ info.studyDataObject.get("giveConsentDone")}}
        </li>

        <!--InsertToken-->
        <li class="pt-0 text-sm border-0 list-group-item ps-0" style="margin-top: 20px;">
          <strong class="text-dark">InsertToken</strong>
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Started:</strong> &nbsp;
          {{ info.studyDataObject.get("insertTokenDateStarted")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Finished:</strong> &nbsp;
          {{ info.studyDataObject.get("insertTokenDateFinished")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Reached:</strong> &nbsp;
          {{ info.studyDataObject.get("insertTokenReached")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">ProgressCondition:</strong> &nbsp;
          {{ info.studyDataObject.get("insertTokenProgressCondition")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Done:</strong> &nbsp;
          {{ info.studyDataObject.get("insertTokenDone")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Has Token:</strong> &nbsp;
          {{ info.studyDataObject.get("insertTokenHasToken")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Token:</strong> &nbsp;
          {{ info.studyDataObject.get("insertTokenToken")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Is Token Expired:</strong> &nbsp;
          {{ info.studyDataObject.get("insertTokenIsTokenExpired")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Smartphone Type:</strong> &nbsp;
          {{ info.studyDataObject.get("insertTokenSmartphoneType")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Email:</strong> &nbsp;
          {{ info.studyDataObject.get("insertTokenEmail")}}
        </li>

        <!--SelectBranches-->
        <li class="pt-0 text-sm border-0 list-group-item ps-0" style="margin-top: 20px;">
          <strong class="text-dark">SelectBranches</strong>
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Started:</strong> &nbsp;
          {{ info.studyDataObject.get("selectBranchesDateStarted")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Finished:</strong> &nbsp;
          {{ info.studyDataObject.get("selectBranchesDateFinished")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Reached:</strong> &nbsp;
          {{ info.studyDataObject.get("selectBranchesReached")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">ProgressCondition:</strong> &nbsp;
          {{ info.studyDataObject.get("selectBranchesProgressCondition")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Done:</strong> &nbsp;
          {{ info.studyDataObject.get("selectBranchesDone")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Choose Trial:</strong> &nbsp;
          {{ info.studyDataObject.get("selectBranchesChooseTrial")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Choose Free Living:</strong> &nbsp;
          {{ info.studyDataObject.get("selectBranchesChooseFreeLiving")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Device:</strong> &nbsp;
          {{ info.studyDataObject.get("selectBranchesDevice")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Manufacturer:</strong> &nbsp;
          {{ info.studyDataObject.get("selectBranchesManufacturer")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Device Name:</strong> &nbsp;
          {{ info.studyDataObject.get("selectBranchesDeviceName")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Version:</strong> &nbsp;
          {{ info.studyDataObject.get("selectBranchesVersion")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Platform:</strong> &nbsp;
          {{ info.studyDataObject.get("selectBranchesPlatform")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Idiom:</strong> &nbsp;
          {{ info.studyDataObject.get("selectBranchesIdiom")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Device Type:</strong> &nbsp;
          {{ info.studyDataObject.get("selectBranchesDeviceType")}}
        </li>

        <!--CreateAccount-->
        <li class="pt-0 text-sm border-0 list-group-item ps-0" style="margin-top: 20px;">
          <strong class="text-dark">CreateAccount</strong>
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Started:</strong> &nbsp;
          {{ info.studyDataObject.get("createAccountDateStarted")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Finished:</strong> &nbsp;
          {{ info.studyDataObject.get("createAccountDateFinished")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Reached:</strong> &nbsp;
          {{ info.studyDataObject.get("createAccountReached")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">ProgressCondition:</strong> &nbsp;
          {{ info.studyDataObject.get("createAccountProgressCondition")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Done:</strong> &nbsp;
          {{ info.studyDataObject.get("createAccountDone")}}
        </li>

        <!--PartialAssessment-->
        <li class="pt-0 text-sm border-0 list-group-item ps-0" style="margin-top: 20px;">
          <strong class="text-dark">PartialAssessment</strong>
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Started:</strong> &nbsp;
          {{ info.studyDataObject.get("partialAssessmentDateStarted")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Finished:</strong> &nbsp;
          {{ info.studyDataObject.get("partialAssessmentDateFinished")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Reached:</strong> &nbsp;
          {{ info.studyDataObject.get("partialAssessmentReached")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">ProgressCondition:</strong> &nbsp;
          {{ info.studyDataObject.get("partialAssessmentProgressCondition")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Done:</strong> &nbsp;
          {{ info.studyDataObject.get("partialAssessmentDone")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Key:</strong> &nbsp;
          {{ info.studyDataObject.get("partialAssessmentKey")}}
        </li>

        <!--WaitingForBranchApproval-->
        <li class="pt-0 text-sm border-0 list-group-item ps-0" style="margin-top: 20px;">
          <strong class="text-dark">WaitingForBranchApproval</strong>
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Started:</strong> &nbsp;
          {{ info.studyDataObject.get("waitingForBranchApprovalDateStarted")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Finished:</strong> &nbsp;
          {{ info.studyDataObject.get("waitingForBranchApprovalDateFinished")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Reached:</strong> &nbsp;
          {{ info.studyDataObject.get("waitingForBranchApprovalReached")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">ProgressCondition:</strong> &nbsp;
          {{ info.studyDataObject.get("waitingForBranchApprovalProgressCondition")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Done:</strong> &nbsp;
          {{ info.studyDataObject.get("waitingForBranchApprovalDone")}}
        </li>

        <!--AskDeliveryInfo-->
        <li class="pt-0 text-sm border-0 list-group-item ps-0" style="margin-top: 20px;">
          <strong class="text-dark">AskDeliveryInfo</strong>
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Started:</strong> &nbsp;
          {{ info.studyDataObject.get("askDeliveryInfoDateStarted")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Finished:</strong> &nbsp;
          {{ info.studyDataObject.get("askDeliveryInfoDateFinished")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Reached:</strong> &nbsp;
          {{ info.studyDataObject.get("askDeliveryInfoReached")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">ProgressCondition:</strong> &nbsp;
          {{ info.studyDataObject.get("askDeliveryInfoProgressCondition")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Done:</strong> &nbsp;
          {{ info.studyDataObject.get("askDeliveryInfoDone")}}
        </li>

        <!--WaitingForDevice-->
        <li class="pt-0 text-sm border-0 list-group-item ps-0" style="margin-top: 20px;">
          <strong class="text-dark">WaitingForDevice</strong>
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Started:</strong> &nbsp;
          {{ info.studyDataObject.get("waitingForDeviceDateStarted")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Finished:</strong> &nbsp;
          {{ info.studyDataObject.get("waitingForDeviceDateFinished")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Reached:</strong> &nbsp;
          {{ info.studyDataObject.get("waitingForDeviceReached")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">ProgressCondition:</strong> &nbsp;
          {{ info.studyDataObject.get("waitingForDeviceProgressCondition")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Done:</strong> &nbsp;
          {{ info.studyDataObject.get("waitingForDeviceDone")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Delivery Progress:</strong> &nbsp;
          {{ info.studyDataObject.get("deliveryProgress")}}
        </li>

        <!--Assessment1-->
        <li class="pt-0 text-sm border-0 list-group-item ps-0" style="margin-top: 20px;">
          <strong class="text-dark">Assessment1</strong>
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Started:</strong> &nbsp;
          {{ info.studyDataObject.get("assessment1DateStarted")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Finished:</strong> &nbsp;
          {{ info.studyDataObject.get("assessment1DateFinished")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Reached:</strong> &nbsp;
          {{ info.studyDataObject.get("assessment1Reached")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">ProgressCondition:</strong> &nbsp;
          {{ info.studyDataObject.get("assessment1ProgressCondition")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Done:</strong> &nbsp;
          {{ info.studyDataObject.get("assessment1Done")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Key:</strong> &nbsp;
          {{ info.studyDataObject.get("assessment1Key")}}
        </li>

        <!--CreateSchedule-->
        <li class="pt-0 text-sm border-0 list-group-item ps-0" style="margin-top: 20px;">
          <strong class="text-dark">CreateSchedule</strong>
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Started:</strong> &nbsp;
          {{ info.studyDataObject.get("createScheduleDateStarted")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Finished:</strong> &nbsp;
          {{ info.studyDataObject.get("createScheduleDateFinished")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Reached:</strong> &nbsp;
          {{ info.studyDataObject.get("createScheduleReached")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">ProgressCondition:</strong> &nbsp;
          {{ info.studyDataObject.get("createScheduleProgressCondition")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Done:</strong> &nbsp;
          {{ info.studyDataObject.get("createScheduleDone")}}
        </li>

        <!--SetCueingSettings-->
        <li class="pt-0 text-sm border-0 list-group-item ps-0" style="margin-top: 20px;">
          <strong class="text-dark">SetCueingSettings</strong>
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Started:</strong> &nbsp;
          {{ info.studyDataObject.get("setCueingSettingsDateStarted")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Finished:</strong> &nbsp;
          {{ info.studyDataObject.get("setCueingSettingsDateFinished")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Reached:</strong> &nbsp;
          {{ info.studyDataObject.get("setCueingSettingsReached")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">ProgressCondition:</strong> &nbsp;
          {{ info.studyDataObject.get("setCueingSettingsProgressCondition")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Done:</strong> &nbsp;
          {{ info.studyDataObject.get("setCueingSettingsDone")}}
        </li>

        <!--CueingMethod1-->
        <li class="pt-0 text-sm border-0 list-group-item ps-0" style="margin-top: 20px;">
          <strong class="text-dark">CueingMethod1</strong>
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Started:</strong> &nbsp;
          {{ info.studyDataObject.get("cueingMethod1DateStarted")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Finished:</strong> &nbsp;
          {{ info.studyDataObject.get("cueingMethod1DateFinished")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Reached:</strong> &nbsp;
          {{ info.studyDataObject.get("cueingMethod1Reached")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">ProgressCondition:</strong> &nbsp;
          {{ info.studyDataObject.get("cueingMethod1ProgressCondition")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Done:</strong> &nbsp;
          {{ info.studyDataObject.get("cueingMethod1Done")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Finishing Date:</strong> &nbsp;
          {{ info.studyDataObject.get("cueingMethod1FinishingDate")}}
        </li>

        <!--Assessment2-->
        <li class="pt-0 text-sm border-0 list-group-item ps-0" style="margin-top: 20px;">
          <strong class="text-dark">Assessment2</strong>
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Started:</strong> &nbsp;
          {{ info.studyDataObject.get("assessment2DateStarted")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Finished:</strong> &nbsp;
          {{ info.studyDataObject.get("assessment2DateFinished")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Reached:</strong> &nbsp;
          {{ info.studyDataObject.get("assessment2Reached")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">ProgressCondition:</strong> &nbsp;
          {{ info.studyDataObject.get("assessment2ProgressCondition")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Done:</strong> &nbsp;
          {{ info.studyDataObject.get("assessment2Done")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Key:</strong> &nbsp;
          {{ info.studyDataObject.get("assessment2Key")}}
        </li>

        <!--WashoutPeriod-->
        <li class="pt-0 text-sm border-0 list-group-item ps-0" style="margin-top: 20px;">
          <strong class="text-dark">WashoutPeriod</strong>
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Started:</strong> &nbsp;
          {{ info.studyDataObject.get("washoutPeriodDateStarted")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Finished:</strong> &nbsp;
          {{ info.studyDataObject.get("washoutPeriodDateFinished")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Reached:</strong> &nbsp;
          {{ info.studyDataObject.get("washoutPeriodReached")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">ProgressCondition:</strong> &nbsp;
          {{ info.studyDataObject.get("washoutPeriodProgressCondition")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Done:</strong> &nbsp;
          {{ info.studyDataObject.get("washoutPeriodDone")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Finishing Date:</strong> &nbsp;
          {{ info.studyDataObject.get("washoutPeriodFinishingDate")}}
        </li>

        <!--Assessment3-->
        <li class="pt-0 text-sm border-0 list-group-item ps-0" style="margin-top: 20px;">
          <strong class="text-dark">Assessment3</strong>
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Started:</strong> &nbsp;
          {{ info.studyDataObject.get("assessment3DateStarted")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Finished:</strong> &nbsp;
          {{ info.studyDataObject.get("assessment3DateFinished")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Reached:</strong> &nbsp;
          {{ info.studyDataObject.get("assessment3Reached")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">ProgressCondition:</strong> &nbsp;
          {{ info.studyDataObject.get("assessment3ProgressCondition")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Done:</strong> &nbsp;
          {{ info.studyDataObject.get("assessment3Done")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Key:</strong> &nbsp;
          {{ info.studyDataObject.get("assessment3Key")}}
        </li>

        <!--CueingMethod2-->
        <li class="pt-0 text-sm border-0 list-group-item ps-0" style="margin-top: 20px;">
          <strong class="text-dark">CueingMethod2</strong>
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Started:</strong> &nbsp;
          {{ info.studyDataObject.get("cueingMethod2DateStarted")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Finished:</strong> &nbsp;
          {{ info.studyDataObject.get("cueingMethod2DateFinished")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Reached:</strong> &nbsp;
          {{ info.studyDataObject.get("cueingMethod2Reached")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">ProgressCondition:</strong> &nbsp;
          {{ info.studyDataObject.get("cueingMethod2ProgressCondition")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Done:</strong> &nbsp;
          {{ info.studyDataObject.get("cueingMethod2Done")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Finishing Date:</strong> &nbsp;
          {{ info.studyDataObject.get("cueingMethod2FinishingDate")}}
        </li>

        <!--Assessment4-->
        <li class="pt-0 text-sm border-0 list-group-item ps-0" style="margin-top: 20px;">
          <strong class="text-dark">Assessment4</strong>
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Started:</strong> &nbsp;
          {{ info.studyDataObject.get("assessment4DateStarted")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Finished:</strong> &nbsp;
          {{ info.studyDataObject.get("assessment4DateFinished")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Reached:</strong> &nbsp;
          {{ info.studyDataObject.get("assessment4Reached")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">ProgressCondition:</strong> &nbsp;
          {{ info.studyDataObject.get("assessment4ProgressCondition")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Done:</strong> &nbsp;
          {{ info.studyDataObject.get("assessment4Done")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Key:</strong> &nbsp;
          {{ info.studyDataObject.get("assessment4Key")}}
        </li>

        <!--PostStudy-->
        <li class="pt-0 text-sm border-0 list-group-item ps-0" style="margin-top: 20px;">
          <strong class="text-dark">PostStudy</strong>
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Finished:</strong> &nbsp;
          {{ info.studyDataObject.get("postStudyDateFinished")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Reached:</strong> &nbsp;
          {{ info.studyDataObject.get("postStudyReached")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">ProgressCondition:</strong> &nbsp;
          {{ info.studyDataObject.get("postStudyProgressCondition")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Done:</strong> &nbsp;
          {{ info.studyDataObject.get("postStudyDone")}}
        </li>

        <!--NoStudy-->
        <li class="pt-0 text-sm border-0 list-group-item ps-0" style="margin-top: 20px;">
          <strong class="text-dark">NoStudy</strong>
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Started:</strong> &nbsp;
          {{ info.studyDataObject.get("noStudyDateStarted")}}
        </li>

        <!--FreeLiving-->
        <li class="pt-0 text-sm border-0 list-group-item ps-0" style="margin-top: 20px;">
          <strong class="text-dark">FreeLiving</strong>
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Started:</strong> &nbsp;
          {{ info.studyDataObject.get("freeLivingDateStarted")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Date Finished:</strong> &nbsp;
          {{ info.studyDataObject.get("freeLivingDateFinished")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Reached:</strong> &nbsp;
          {{ info.studyDataObject.get("freeLivingReached")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">ProgressCondition:</strong> &nbsp;
          {{ info.studyDataObject.get("freeLivingProgressCondition")}}
        </li>
        <li class="pt-0 text-sm border-0 list-group-item ps-0">
          <strong class="text-dark">Done:</strong> &nbsp;
          {{ info.studyDataObject.get("freeLivingDone")}}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>

export default {
  name: "StagesInfoCard",
  props: {
    info: {
      studyDataObject: {},
    },
  },
};
</script>
