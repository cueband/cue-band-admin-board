<template>
  <div class="card" style="border: black; border-style: dotted;">
    <div class="p-3 pb-0 card-header">
      <div class="row">
        <div class="col-md-8 d-flex align-items-center">
          <h6 class="mb-0">Select Branch</h6>
        </div>
      </div>
    </div>
    <div class="p-3 card-body">
        <div style="margin-bottom: 30px">
            <strong class="text-dark" style="margin-right: 20px; text-align: center;" >Study Branch:</strong>
            <input type="radio" id="studyBranchTrial" name="studyBranch" value="Trial" @click="showCueingOptions"/>
            <label for="studyBranchTrial" style="margin-right: 20px">Trial</label>
            <input type="radio" id="studyBranchFreeLiving" name="studyBranch" value="Free Living" @click="hideCueingOptions"/>
            <label for="studyBranchFreeLiving" style="margin-right: 20px">Free-Living</label>
            <input type="radio" id="studyBranchNoStudy" name="studyBranch" value="noStudy" @click="hideCueingOptions"/>
            <label for="studyBranchNoStudy">No Study</label>
        </div>
        <div id="cueingMethods" style="display: none">
            <div style="margin-bottom: 30px">
                <strong class="text-dark" style="margin-right: 20px">Cueing Method 1:</strong>
                <input type="radio" id="CueingMethod1Phone" name="cueingMethod1" value="Phone"/>
                <label for="CueingMethod1Phone" style="margin-right: 20px">Phone</label>
                <input type="radio" id="CueingMethod1CueBand" name="cueingMethod1" value="CueBand"/>
                <label for="CueingMethod1CueBand">CueBand</label>
            </div>
            <div style="margin-bottom: 30px">
                <strong class="text-dark" style="margin-right: 20px">Cueing Method 2:</strong>
                <input type="radio" id="CueingMethod2Phone" name="cueingMethod2" value="Phone"/>
                <label for="CueingMethod2Phone" style="margin-right: 20px">Phone</label>
                <input type="radio" id="CueingMethod2CueBand" name="cueingMethod2" value="CueBand"/>
                <label for="CueingMethod2CueBand">CueBand</label>
            </div>
            <div style="display: flex;justify-content: center;margin-bottom: 30px">
                <button class="btn bg-gradient-success" @click="selectCueingMethodRandomly">Randomise Cueing Methods</button>
            </div>
        </div>

        <div style="display: flex;justify-content: center;">
            <button class="btn btn-white" @click="saveBranchInfo">Save</button>
        </div>
    </div>
  </div>
</template>
<script>

import api from "../../api"
export default {
    name: "SelectBranchCard",
    props: {
        info: {
                studyDataObject: {},
            },
    },
    methods: {
        selectCueingMethodRandomly() {
            var randomSelection = Math.round(Math.random());
            if(randomSelection == 0) {
                const radioButtonCueingMethod1Phone = document.getElementById("CueingMethod1Phone");
                radioButtonCueingMethod1Phone.checked = true;
                const radioButtonCueingMethod2CueBand = document.getElementById("CueingMethod2CueBand");
                radioButtonCueingMethod2CueBand.checked = true;
            } else if(randomSelection == 1) {
                const radioButtonCueingMethod1CueBand = document.getElementById("CueingMethod1CueBand");
                radioButtonCueingMethod1CueBand.checked = true;
                const radioButtonCueingMethod2Phone = document.getElementById("CueingMethod2Phone");
                radioButtonCueingMethod2Phone.checked = true;
            }
        },
        showCueingOptions() {
            document.getElementById('cueingMethods').style.display = 'block';
        },
        hideCueingOptions() {
            document.getElementById('cueingMethods').style.display ='none';
        },
        async saveBranchInfo() {
            const trialButton = document.getElementById("studyBranchTrial");
            const freeLivingButton = document.getElementById("studyBranchFreeLiving");
            const noStudyButton = document.getElementById("studyBranchNoStudy");

            if(trialButton.checked) {
                const radioButtonCueingMethod1Phone = document.getElementById("CueingMethod1Phone");
                const radioButtonCueingMethod2Phone = document.getElementById("CueingMethod2Phone");
                const radioButtonCueingMethod1CueBand = document.getElementById("CueingMethod1CueBand");
                const radioButtonCueingMethod2CueBand = document.getElementById("CueingMethod2CueBand");
   
                var cueingMethod1 = "";
                if(radioButtonCueingMethod1Phone.checked) {
                    cueingMethod1 = "phone";
                }
                if(radioButtonCueingMethod1CueBand.checked) {
                    cueingMethod1 = "cueband";
                }

                 var cueingMethod2 = "";
                if(radioButtonCueingMethod2Phone.checked) {
                    cueingMethod2 = "phone";
                }
                if(radioButtonCueingMethod2CueBand.checked) {
                    cueingMethod2 = "cueband";
                }

                var result = await api.SaveStudyDataState(this.info.studyDataObject, "Trial", cueingMethod1, cueingMethod2);
                console.log(result);

                const email = this.info.studyDataObject["insertTokenEmail"];

                await api.SendConfirmationEmail(email);

            } else if(freeLivingButton.checked) {
                var resultFreeLiving = await api.SaveStudyDataState(this.info.studyDataObject, "FreeLiving", null, null);
                console.log(resultFreeLiving);
            } else if(noStudyButton.checked) {
                var resultNoStudy = await api.SaveStudyDataState(this.info.studyDataObject, "NoStudy", null, null);
                 console.log(resultNoStudy);
            }
        },

    }
};
</script>
