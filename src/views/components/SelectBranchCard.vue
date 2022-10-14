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
            <input type="radio" id="studyBranchTrial" name="studyBranch" value="Trial" v-model="selectedStudyBranch"/>
            <label for="studyBranchTrial" style="margin-right: 20px">Trial</label>
            <input type="radio" id="studyBranchFreeLiving" name="studyBranch" value="FreeLiving" v-model="selectedStudyBranch"/>
            <label for="studyBranchFreeLiving" style="margin-right: 20px">Free-Living</label>
            <input type="radio" id="studyBranchNoStudy" name="studyBranch" value="NoStudy" v-model="selectedStudyBranch"/>
            <label for="studyBranchNoStudy">No Study</label>
        </div>
        <div id="cueingMethods" v-if="selectedStudyBranch === 'Trial'">
            <div v-if="methodCounts" class="mb-4">
                <div>
                    <strong>Phone-Cueband:</strong> {{methodCounts.phoneCueband}}
                </div>
                <div>
                    <strong>Cueband-Phone:</strong> {{methodCounts.cuebandPhone}}
                </div>
                 <div>
                    <strong>Random Allocation Order:</strong> {{randomAllocationOrder}}
                </div>
            </div>
            <div style="margin-bottom: 30px">
                <strong class="text-dark" style="margin-right: 20px">Cueing Method 1:</strong>
                <input type="radio" id="CueingMethod1Phone" name="cueingMethod1" value="phone" v-model="selectedCueingMethod1" disabled/>
                <label for="CueingMethod1Phone" style="margin-right: 20px">Phone</label>
                <input type="radio" id="CueingMethod1CueBand" name="cueingMethod1" value="cueband" v-model="selectedCueingMethod1" disabled/>
                <label for="CueingMethod1CueBand">CueBand</label>
            </div>
            <div style="margin-bottom: 30px">
                <strong class="text-dark" style="margin-right: 20px">Cueing Method 2:</strong>
                <input type="radio" id="CueingMethod2Phone" name="cueingMethod2" value="phone" v-model="selectedCueingMethod2" disabled/>
                <label for="CueingMethod2Phone" style="margin-right: 20px">Phone</label>
                <input type="radio" id="CueingMethod2CueBand" name="cueingMethod2" value="cueband" v-model="selectedCueingMethod2" disabled/>
                <label for="CueingMethod2CueBand">CueBand</label>
            </div>
            <!--div style="display: flex;justify-content: center;margin-bottom: 30px">
                <button class="btn bg-gradient-success" @click="selectCueingMethodRandomly">Randomise Cueing Methods</button>
            </div-->
        </div>

        <div style="display: flex;justify-content: center;">
            <button class="btn btn-white" @click="saveBranchInfo">Save</button>
        </div>
        <soft-alert :color="isSavedSuccessfully ? 'success' : 'danger'" :class="{show: alertTimer}" class="alert-dismissible fade" style="position: absolute; top: 5px; left: 10px; right: 10px;" :style="{'pointer-events': alertTimer? 'all' : 'none'}" >
            {{ saveMessage }}
        </soft-alert>
    </div>
  </div>
</template>
<script>
import SoftAlert from "@/components/VsudAlert.vue";
import { mapGetters, mapActions } from "vuex";

import api from "@/api"
export default {
    name: "SelectBranchCard",
    components: { SoftAlert },
    props: {
        info: {
            studyDataObject: {},
        },
    },
    data() {
        return {
            currentRandomAllocation: null,
            selectedStudyBranch: null,
            selectedCueingMethod1: null,
            selectedCueingMethod2: null,
            saveMessage: null,
            isSavedSuccessfully: false,
            alertTimer: null,
            alertTimeoutPeriod: 3000,
            randomAllocationOrder: -1,
        }
    },
    mounted () {
        try {
            this.selectedStudyBranch = this.info.studyDataObject.get("studyBranch");
            this.selectedCueingMethod1 = this.info.studyDataObject.get("cueingMethod1");
            this.selectedCueingMethod2 = this.info.studyDataObject.get("cueingMethod2");
            this.getRandomAllocation();
        } catch (error) {
            // TODO: handle error properly
            return;
        }
    },
    computed: mapGetters(['methodCounts']),
    methods: {
        ...mapActions(['fetchMethodCounts']),
        showAlert(isSuccessful, message) {
            if (this.alertTimer) {
                clearTimeout(this.alertTimer)
                this.alertTimer = null
            }

            this.saveMessage = message;
            this.isSavedSuccessfully = isSuccessful;

            this.alertTimer = setTimeout(() => {
                this.saveMessage = null;
                this.alertTimer = null;
            }, this.alertTimeoutPeriod)
        },
        onSaveError(errorMessage) {
            this.showAlert(false, errorMessage);
        },
        onSaveSuccessful() {
            this.fetchMethodCounts();
            this.showAlert(true, "Changes saved sucessfully!");
            // TODO: update user data in UI on save
        },
        selectCueingMethodRandomly() {
            var randomSelection = Math.round(Math.random());
            if(randomSelection == 0) {
                this.selectedCueingMethod1 = "phone";
                this.selectedCueingMethod2 = "cueband";
            } else if(randomSelection == 1) {
                this.selectedCueingMethod1 = "cueband";
                this.selectedCueingMethod2 = "phone";
            }
        },
        async saveBranchInfo() {
            try {
                const email = this.info.studyDataObject.get("insertTokenEmail");
                let result;
                let confirmationEmailSuccess = true;
                switch (this.selectedStudyBranch) {
                    case 'Trial':
                        var userHasBeenAllocated = await api.UserHasBeenAllocated(this.info.studyDataObject.get('user'));
                        if(userHasBeenAllocated) {
                            result = false;
                            console.log(userHasBeenAllocated);
                        } else {
                            console.log(userHasBeenAllocated);
                            result = await api.SaveStudyDataState(this.info.studyDataObject, this.selectedStudyBranch, this.selectedCueingMethod1, this.selectedCueingMethod2);
                            if(result) {
                                confirmationEmailSuccess = await api.SendBranchEmail(email, "trial");
                                result = await api.SaveRandomAllocation(this.info.studyDataObject.get('user'), this.currentRandomAllocation);
                            }
                        }
                        break;

                    case 'FreeLiving': 
                        result = await api.SaveStudyDataState(this.info.studyDataObject, this.selectedStudyBranch, null, null);
                        confirmationEmailSuccess = await api.SendBranchEmail(email, "freeliving");
                        break;

                    case 'NoStudy':
                        result = await api.SaveStudyDataState(this.info.studyDataObject, this.selectedStudyBranch, null, null);
                        confirmationEmailSuccess = await api.SendNotAcceptedEmail(email);
                        break;

                    default:
                        this.onSaveError("Please select a study branch");
                }
                if (result && confirmationEmailSuccess) this.onSaveSuccessful();
                else if (!result) this.onSaveError("An error occured while saving changes.");
                else if (!confirmationEmailSuccess) this.onSaveError("Email could not be sent.");

                await this.getRandomAllocation();

            } catch (error) {
                this.onSaveError(`An error occured: ${error.message}`);
            }
        },
        async getRandomAllocation() {
            try {
                let randomAllocation = await api.GetNextFreeRandomAllocation();
                if(randomAllocation == null) {
                    const numberOfExistingAllocations = await api.GetRandomAllocationCount();
                    let nextRandomAllocationResult = await api.GenerateNextRandomAllocation(numberOfExistingAllocations == 0 ? 300 : 100);
                    console.log(nextRandomAllocationResult);
                    if(nextRandomAllocationResult) {
                        console.log("A");
                        randomAllocation = await api.GetNextFreeRandomAllocation();
                    } else {
                        console.log("C");
                        return "false";
                    }
                }

                console.log("B");

                this.currentRandomAllocation = randomAllocation;
                
                let type = this.currentRandomAllocation.get('type');
                console.log(type);
                type = type.toLowerCase();
                const splitTypes = type.split("-");
                this.selectedCueingMethod1 = splitTypes[0];
                this.selectedCueingMethod2 = splitTypes[1];
                this.randomAllocationOrder = this.currentRandomAllocation.get('order');
            
            } catch(error) {
                this.onSaveError(`An error occured: ${error.message}`);
            }
        }

    }
};
</script>
