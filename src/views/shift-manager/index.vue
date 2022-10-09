<template>
  <el-card>
    <el-row type="flex" align="middle" justify="space-between" slot="header">
      <h2 class="my-0">{{ $route.meta.title || "" }}</h2>
      <el-button
        type="primary"
        class="ml-2"
        v-if="activeTab === 'info'"
        plain
        @click="visibleCreateShift = true"
      >
        Thêm ca làm việc
      </el-button>
      <el-button
        type="primary"
        class="ml-2"
        v-else
        plain
        @click="visibleAddShift = true"
      >
        Thêm ca làm việc cho nhân viên
      </el-button>
    </el-row>
    <el-tabs v-model="activeTab" type="card" @tab-click="loadData">
      <el-tab-pane name="manager" label="Ca làm việc">
        <shift-manager
          v-loading="callingAPI"
          @reload="loadShiftManager"
          :data="listShiftUser"
          :total="listShiftUser.length"
        />
      </el-tab-pane>
      <el-tab-pane name="info" label="Thông tin các ca làm việc">
        <shift-info
          @reload="loadData"
          :data="listShift"
          :total="listShift.length"
          v-loading="callingAPI"
        />
      </el-tab-pane>
    </el-tabs>
    <create-shift-popup
      :visible="visibleCreateShift"
      @reload="loadShiftInfo"
      @close="visibleCreateShift = false"
    />
    <add-shift-employee-popup
      :visible="visibleAddShift"
      :shiftUsers="listShiftUser"
      @reload="loadShiftManager"
      @close="visibleAddShift = false"
    />
  </el-card>
</template>

<script>
import ShiftManager from "./manager";
import ShiftInfo from "./info";
import CreateShiftPopup from "./components/info/CreateShift";
import shiftServices from "@/services/shift";
import shiftUserServices from "@/services/shiftUser";
import AddShiftEmployeePopup from "./components/manager/AddShift";

export default {
  name: "ShiftManagerIndex",
  components: {
    ShiftManager,
    ShiftInfo,
    CreateShiftPopup,
    AddShiftEmployeePopup,
  },
  data() {
    return {
      activeTab: "manager",

      callingAPI: false,
      listShift: [],

      listShiftUser: [],

      visibleCreateShift: false,
      visibleAddShift: false,
    };
  },
  beforeMount() {
    this.loadData();
  },
  methods: {
    loadData() {
      if (this.activeTab == "manager") {
        this.loadShiftManager();
      } else {
        this.loadShiftInfo();
      }
    },

    loadShiftManager() {
      this.callingAPI = true;
      shiftUserServices
        .list()
        .then((response) => {
          this.listShiftUser = response;
          this.callingAPI = false;
        })
        .catch(() => {
          this.callingAPI = false;
        });
    },

    loadShiftInfo() {
      this.callingAPI = true;
      shiftServices
        .list()
        .then((response) => {
          this.listShift = response;
          this.callingAPI = false;
        })
        .catch(() => {
          this.callingAPI = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
