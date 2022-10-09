<template>
  <div>
    <el-row :gutter="0" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <i class="el-icon-s-custom"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">Số nhân viên</div>
            <div class="card-panel-num">{{ employees }}</div>
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-device">
            <i class="el-icon-s-platform"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">Số máy chấm công</div>
            <div class="card-panel-num">{{ devices.length }}</div>
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-late-early">
            <i class="el-icon-s-custom"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">Số nhân viên vào trễ, ra sớm</div>
            <div class="card-panel-num">{{ tableData.length }}</div>
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-no-timekeeping">
            <i class="el-icon-s-custom"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">Số nhân viên không chấm công</div>
            <div class="card-panel-num">0</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-card class="mt-5">
      <h2 class="mt-0">Vào trễ, ra sớm trong ngày</h2>
      <el-table :data="paginationData" v-loading="loadingReport" border>
        <el-table-column type="index" width="50" align="center" label="STT" />
        <el-table-column label="Mã nhân viên">
          <template slot-scope="scope">
            {{ scope.row.employee.code }}
          </template>
        </el-table-column>
        <el-table-column label="Tên nhân viên">
          <template slot-scope="scope">
            {{ scope.row.employee.full_name }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="Ngày chấm công">
          <template slot-scope="scope">
            {{ scope.row.term | convertDateDefault }}
          </template>
        </el-table-column> -->
        <el-table-column label="Thời gian bắt đầu - kết thúc ca">
          <template slot-scope="scope">
            {{ scope.row.shift.started_at | parseTime }} -
            {{ scope.row.shift.ended_at | parseTime }}
          </template>
        </el-table-column>
        <el-table-column label="Thời gian vào trễ, ra sớm">
          <template slot-scope="scope">
            <p v-if="isLateTime(scope.row, scope.row.times[0])">
              Đi muộn:
              <span class="text-danger">
                {{ scope.row.times[0] }}
              </span>
            </p>
            <p v-if="isSoonTime(scope.row, scope.row.times.slice(-1)[0])">
              Về sớm:
              <span class="text-danger">
                {{ scope.row.times.slice(-1)[0] }}
              </span>
            </p>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="space-between" class="mt-3">
        <download-excel
          :data="jsonData"
          :name="`report-${dayjs().format('DD-MM-YYYY')}.xls`"
        >
          <el-button>Xuất file excel</el-button>
        </download-excel>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next"
          :total="total"
        />
      </el-row>
    </el-card>
  </div>
</template>

<script>
import dayjs from "dayjs";
import employeeServices from "@/services/employee";
import deviceServices from "@/services/device";
import Pagination from "@/mixins/pagination";
import timekeepingServices from "@/services/timekeeping";
import shiftUserServices from "@/services/shiftUser";
import { convertDateDefault } from "@/utils/filters";

export default {
  name: "Dashboard",
  data() {
    return {
      loadingEmployee: false,
      employees: 0,

      devices: [],

      callingAPI: false,
      allCheckinSoonLate: [],
      tableData: [],

      pageSizes: [10, 20, 50, 100],
      pageSize: 10,

      loadingReport: false,
      currentPage: 1,
    };
  },
  mixins: [Pagination],
  computed: {
    filteredData() {
      const currentDay = dayjs().format("YYYY-MM-DD");
      return this.tableData.filter((d) => d.term === currentDay);
    },
    excelHeader() {
      return ["Tên nhân viên", "Mã nhân viên", "Thời gian vào trễ, ra sớm"];
    },
    jsonData() {
      return this.tableData.map((d) => {
        const data = {};
        const late =
          d.times[0] && d.times[0].isLate
            ? `Đi muộn: ${convertDateDefault(d.times[0].checkin)}`
            : null;
        const soon =
          d.times[1] && d.times[1].isSoon
            ? `Về sớm: ${convertDateDefault(d.times[0].checkout)}`
            : null;
        data[this.excelHeader[0]] = d.employee.full_name;
        data[this.excelHeader[1]] = d.employee.code;
        data[this.excelHeader[2]] = [late, soon].filter(Boolean).join(", ");
        return data;
      });
    },
    total() {
      return this.tableData.length;
    },
  },
  beforeMount() {
    this.loadEmployees();
    this.loadDevices();
    this.loadData();
  },
  methods: {
    dayjs,
    loadEmployees() {
      this.loadingEmployee = true;
      employeeServices.count().then((response) => {
        this.employees = response;
        this.loadingEmployee = false;
      });
    },

    loadDevices() {
      const params = {
        _q: "",
      };
      deviceServices
        .list(params)
        .then((response) => {
          this.devices = response;
          this.callingAPI = false;
        })
        .catch(() => {
          this.callingAPI = false;
        });
    },

    async loadData() {
      this.loadingReport = true;
      const getTimeKeepings = await timekeepingServices.list();
      const getShiftUser = await shiftUserServices.list();

      await Promise.all([getTimeKeepings, getShiftUser])
        .then(([timekeepings, shiftUsers]) => {
          this.loadingReport = false;
          const terms = [...new Set(timekeepings.map((t) => t.term))];
          const employees = [
            ...new Set(timekeepings.map((t) => t.employee.id)),
          ].map((id) => ({
            data: timekeepings.find((t) => t.employee.id === id).employee,
            times: timekeepings
              .filter((t) => t.employee.id === id)
              .map((t) => ({ checkin: t.checkin.time, term: t.term })),
          }));
          const termGroups = [];
          terms.forEach((term) => {
            const employee = employees.find((e) =>
              e.times.find((t) => t.term === term)
            );
            if (employee) {
              termGroups.push({
                employee: employee.data,
                term: term,
                times: employee.times
                  .filter((t) => t.term === term)
                  .map((t) => t.checkin),
                shift: shiftUsers.find(
                  (sh) => sh.employee_id === employee.data.id
                ).shift,
              });
            }
          });
          this.tableData = termGroups
            .map((term) => ({
              ...term,
              late: this.isLateTime(term, term.times[0])
                ? `Đi muộn: ${term.times[0]}`
                : null,
              soon: this.isSoonTime(term, term.times.slice(-1)[0])
                ? `Đi muộn: ${term.times.slice(-1)[0]}`
                : null,
            }))
            .filter((term) => term.late || term.soon);
        })
        .catch(() => {
          this.loadingReport = false;
        });
    },

    isLateTime(row, time) {
      const startedAt = row.shift.started_at.split(".000")[0];
      // const endedAt = row.shift.ended_at.split('.000')[0]
      if (time > startedAt) {
        return true;
      }
      return false;
    },
    isSoonTime(row, time) {
      // const startedAt = row.shift.started_at.split('.000')[0]
      const endedAt = row.shift.ended_at.split(".000")[0];
      if (time < endedAt) {
        return true;
      }
      return false;
    },

    convertReport(type, shift, time) {
      if (type === "start") {
        if (time > shift.shift.started_at) {
          return true;
        }
        return false;
      }
      if (time < shift.shift.ended_at) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col {
    margin-bottom: 32px;
  }
  .card-panel {
    height: 98px;
    width: 330px;
    cursor: pointer;
    font-size: 16px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #0190fe;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
        background: #81fabb;
      }
      .icon-device {
        background: #dcec96;
      }
      .icon-late-early {
        background: #f4516c;
      }
      .icon-no-timekeeping {
        background: #5b5b5b;
      }
    }
    .icon-people {
      color: #81fabb;
    }
    .icon-device {
      color: #dcec96;
    }
    .icon-late-early {
      color: #f4516c;
    }
    .icon-no-timekeeping {
      color: #5b5b5b;
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: #fff;
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
        float: right;
        color: #fff;
      }
    }
  }
}
@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }
  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;
    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
