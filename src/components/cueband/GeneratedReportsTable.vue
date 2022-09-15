<template>
  <div class="card mb-4">
    <div class="card-header pb-0">
      <h6>Generated Reports{{tableName && `: ${ tableName }`}}</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center justify-content-center mb-0">
          <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                <a @click="() => toggleSortColumn('csvFile')" class="column-title">File Name</a>
                <span class="sort-indicator" v-if="selectedSortColumn == 'csvFile'">
                  {{ selectedSortDirection == sortDirections.ASC ? ' ▼' : ' ▲' }}
                </span>
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                <a @click="() => toggleSortColumn('startDate')" class="column-title">Start Date</a>
                <span class="sort-indicator" v-if="selectedSortColumn == 'startDate'">
                  {{ selectedSortDirection == sortDirections.ASC ? ' ▼' : ' ▲' }}
                </span>
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                <a @click="() => toggleSortColumn('endDate')" class="column-title">End Date</a>
                <span class="sort-indicator" v-if="selectedSortColumn == 'endDate'">
                  {{ selectedSortDirection == sortDirections.ASC ? ' ▼' : ' ▲' }}
                </span>
              </th>
            </tr>
          </thead>
          <tbody v-if="sortedData.length > 0">
            <tr v-for="report in sortedData" v-bind:key="report.id">
              <td>
                <div class="d-flex px-2">
                  <div class="my-auto">
                    <h6 class="mb-0 text-sm"><a :href="report.get('csvFile').url()">{{report.get("csvFile").name()}}</a></h6>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-sm font-weight-bold mb-0">{{report.get("startDate")}}</p>
              </td>
              <td>
                <span class="text-sm font-weight-bold">{{report.get("endDate")}}</span>
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
      reportsData: {type: Array, required: true}
    },
    data () {
      return {
        sortDirections: {
          ASC: 1,
          DESC: -1
        },
        selectedSortColumn: null,
        selectedSortDirection: null,
      }
    },
    computed: {
      sortedData () {
        if (!this.selectedSortColumn || !this.selectedSortDirection) {
          return [...this.reportsData]
        }

        return this.reportsData.map(e => e).sort((a, b) => {
          if (typeof a.get(this.selectedSortColumn) == "string" || typeof b.get(this.selectedSortColumn) == "string" ) {
            return a.get(this.selectedSortColumn).localeCompare(b.get(this.selectedSortColumn)) * this.selectedSortDirection;
          }
          if (b.get(this.selectedSortColumn) > a.get(this.selectedSortColumn)) {
            return 1 * this.selectedSortDirection;
          }
          return -1 * this.selectedSortDirection;
        })
      }
    },
    methods: {
      download(id) {
        this.$router.push(`/studydata/${id}`);
      },
      toggleSortColumn(column) {
        if (this.selectedSortColumn != column) {
          this.selectedSortColumn = column;
          this.selectedSortDirection = this.sortDirections.ASC;
        } else if (this.selectedSortDirection == this.sortDirections.ASC) {
          this.selectedSortDirection = this.sortDirections.DESC;
        } else if (this.selectedSortDirection == this.sortDirections.DESC) {
          this.selectedSortColumn = null;
          this.selectedSortDirection = null;
        } else {
          this.selectedSortDirection = this.sortDirections.ASC;
        }
      }
    }
};
</script>
<style scoped>
.column-title {
  cursor: pointer;
  user-select: none;
}
.sort-indicator {
  user-select: none;
}
</style>
