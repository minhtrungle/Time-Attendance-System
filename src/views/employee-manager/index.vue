<template>
  <el-card>
    <el-row type="flex" align="middle" justify="space-between" slot="header">
      <h2 class="my-0">{{ $route.meta.title || "" }}</h2>
      <el-button
        type="primary"
        class="ml-2"
        plain
        @click="visibleCreate = true"
      >
        Thêm nhân viên
      </el-button>
    </el-row>
    <filter-form @search="loadData" />
    <list-employee
      v-loading="loadingData"
      @reload="loadData"
      :data="employees"
      :total="total"
      @update="updateStaff"
    />
    <add-employee-popup
      :visible="visibleCreate"
      @reload="loadData"
      @close="visibleCreate = false"
    />
    <update-employee-popup
      :visible="visibleUpdate"
      :data="selectedStaff"
      @reload="loadData"
      @close="visibleUpdate = false"
    />
  </el-card>
</template>

<script>
import employeeServices from "@/services/employee";
import FilterForm from "./components/Filter";
import ListEmployee from "./components/List";
import AddEmployeePopup from "./components/Add";
import UpdateEmployeePopup from "./components/Update";
export default {
  name: "EmployeeManager",
  components: {
    FilterForm,
    ListEmployee,
    AddEmployeePopup,
    UpdateEmployeePopup,
  },
  data() {
    return {
      loadingData: false,
      visibleCreate: false,
      visibleUpdate: false,

      employees: [],
      pageSize: 10,
      total: 10,

      selectedStaff: null,
    };
  },
  beforeMount() {
    this.loadData();
    this.loadCount();
  },
  methods: {
    loadCount() {
      employeeServices.count().then((response) => {
        this.total = response;
      });
    },

    loadData(searchText) {
      this.loadingData = true;
      const params = {
        _start: 0,
        _limit: this.pageSize,
        _q: searchText,
      };
      employeeServices
        .list(params)
        .then((response) => {
          this.employees = response;
          this.loadingData = false;
        })
        .catch(() => {
          this.loadingData = false;
        });
    },

    updateStaff(data) {
      this.selectedStaff = data;
      this.visibleUpdate = true;
    },
  },
};
</script>

<style lang="scss" scoped></style>
