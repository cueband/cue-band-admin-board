<template>
    <div class="py-4 container-fluid">
        <!-- <div class="row">
            <div class="col-12">
                <users-table />
            </div>
        </div> -->
        <div class="row">
            <div class="col-12">
               <study-data-table/>
            </div>
        </div>
  </div>
</template>
<script>

// import UsersTable from "../components/cueband/UsersTable.vue";
import StudyDataTable from '@/components/cueband/StudyDataTable.vue';
import {
  faUsers,
} from "@fortawesome/free-solid-svg-icons";




export default {
  name: "users-page",
  data() {
    return {
      iconBackground: "bg-gradient-success",
      faUsers,
    };
  },
  components: {
      // UsersTable,
      StudyDataTable
  },
};
</script>
