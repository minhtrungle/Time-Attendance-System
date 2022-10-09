<template>
  <el-card>
    <el-row type="flex" align="middle" justify="space-between" slot="header">
      <h2 class="my-0">{{ $route.meta.title || "" }}</h2>
    </el-row>
    <filter-timekeeping-report @change="changeMonth" />
    <el-row type="flex" justify="end" align="middle">
      <el-row
        type="flex"
        align="middle"
        class="desc"
        v-for="item in comments"
        :key="item.type"
      >
        <span>{{ item.title }}</span>
        <span></span>
        <div class="desc__cricle" :class="item.type" />
      </el-row>
    </el-row>
    <list-timekeeping-report
      :data="tableData"
      :listDay="listDayOfMonth"
      :selectedMonth="selectedMonth"
      v-loading="callingAPI"
      class="mb-4"
    />
    <download-excel
      :data="jsonData"
      :name="`timekeeping-${dayjs().format('DD-MM-YYYY')}.xls`"
    >
      <el-button :disabled="callingAPI">Xuất file excel</el-button>
    </download-excel>
  </el-card>
</template>

<script>
import dayjs from "dayjs";
import { getDaysInMonth } from "@/utils/filters";
import FilterTimekeepingReport from "./components/Filter";
import ListTimekeepingReport from "./components/List";
import employeeServices from "@/services/employee";
import timekeepingServices from "@/services/timekeeping";
import shiftUserServices from "@/services/shiftUser";
export default {
  name: "TimekeepingReport",
  components: {
    FilterTimekeepingReport,
    ListTimekeepingReport,
  },
  data() {
    return {
      selectedMonth: dayjs().get("month"),
      callingAPI: false,

      tableData: [],

      comments: [
        {
          title: "Không chấm công",
          type: "notinfor",
        },
        {
          title: "Chấm công đúng giờ",
          type: "success",
        },
        {
          title: "Vào trễ, ra sớm",
          type: "warning",
        },
        {
          title: "Chưa vào ca/ra ca",
          type: "danger",
        },
      ],
    };
  },
  computed: {
    //Xuất file excel
    excelHeader() {
      return ["Tên nhân viên", "Mã nhân viên", "Thời gian chấm công"];
    },
    listDayOfMonth() {
      return this.getDaysInMonth(this.selectedMonth, 2022);
    },
    jsonData() {
      console.log(this.tableData);
      return this.tableData.map((d) => {
        const data = {};
        data[this.excelHeader[0]] = d.full_name;
        data[this.excelHeader[1]] = d.code;
        data[this.excelHeader[2]] = d.timekeepings
          .filter((t) => t.length)
          .map((time, index) => {
            return JSON.stringify({
              Ngay: index + 1,
              "Thời gian": `${time[0].checkin.time} - ${
                time[time.length - 1].checkin.time
              }`,
            });
          });
        return data;
      });
    },
  },
  beforeMount() {
    this.loadData();
  },
  methods: {
    getDaysInMonth,
    dayjs,

    changeMonth(month) {
      this.selectedMonth = month;
      this.loadData();
    },

    async loadData() {
      this.callingAPI = true;
      const getEmployees = await employeeServices.list();
      const getTimeKeepings = await timekeepingServices.list();
      const getShiftUser = await shiftUserServices.list();
      await Promise.all([getEmployees, getTimeKeepings, getShiftUser])
        .then(([employees, timekeepings, shiftUsers]) => {
          this.tableData = employees.map((e) => ({
            ...e,
            timekeepings: this.listDayOfMonth.map((day) => {
              return (
                timekeepings.filter(
                  (t) =>
                    t.term === dayjs(day).format("YYYY-MM-DD") &&
                    t.employee.id === e.id
                ) || null
              );
            }),
            shiftUsers: shiftUsers.filter((s) => s.employee.id === e.id),
          }));
          this.callingAPI = false;
        })
        .catch(() => {
          this.callingAPI = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.desc {
  margin: 10px;
  &__cricle {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    &.success {
      background-color: #67c23a;
    }
    &.warning {
      background-color: #ffaa00;
    }
    &.danger {
      background-color: #e71313;
    }
    &.notinfor {
      background-color: #6a6a6a;
    }
  }
  span {
    margin-right: 3px;
    font-size: 13px;
    font-weight: 700;
  }
}
</style>
