<template>
  <div class="card mb-4">
    <div class="card-header pb-0">
      <h6>Study Data Table{{tableName && `: ${ tableName }`}}</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center justify-content-center mb-0">
          <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                User ID
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                Study Data ID
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                Study Branch
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder text-center opacity-7 ps-2">
                Study State
              </th>
              <th>

              </th>
            </tr>
          </thead>
          <tbody v-if="allStudyData.length > 0">
            <tr v-for="studyData in allStudyData" v-bind:key="studyData.id">
              <td>
                <div class="d-flex px-2">
                  <div class="my-auto">
                    <h6 class="mb-0 text-sm">{{studyData.get("user").id}}</h6>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-sm font-weight-bold mb-0">{{studyData.id}}</p>
              </td>
              <td>
                <span class="text-xs font-weight-bold">{{studyData.get("studyBranch")}}</span>
              </td>
              <td class="align-middle text-center">
                <div class="d-flex align-items-center justify-content-center">
                  <span class="me-2 text-xs font-weight-bold">{{studyData.get("currentState")}}</span>
                </div>
              </td>
              <td class="align-middle">
                <button class="btn btn-link text-secondary mb-0" @click.once="goToStudyDataPage(studyData.id)">
                  Show More
                </button>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="100%" class="align-middle text-center">
                <span class="text-sm text-secondary opacity-7 font-weight-bold">No records found</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: "study-data-table",
    props: {
      tableName: {type: String},
      allStudyData: {type: Array, required: true},
    },
    methods: {
      goToStudyDataPage(id) {
        this.$router.push(`/studydata/${id}`);
      }
    }
};
</script>
