//Vào trễ ra sớm
<template>
  <el-card>
    <h2 class="mt-0">{{ $route.meta.title || "" }}</h2>
    <el-table :data="paginationData" v-loading="callingAPI" border>
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
      <el-table-column label="Ngày chấm công">
        <template slot-scope="scope">
          {{ scope.row.term | convertDateDefault }}
        </template>
      </el-table-column>
      <el-table-column label="Thời gian bắt đầu - kết thúc ca">
        <template slot-scope="scope">
          {{ scope.row.shift.started_at | parseTime }} -
          {{ scope.row.shift.ended_at | parseTime }}
        </template>
      </el-table-column>
      <el-table-column label="Thời gian vào trễ, ra sớm">
        <template slot-scope="scope">
          <p v-if="isLateTime(scope.row, scope.row.times[0])">
            Vào trễ:
            <span class="text-danger">
              {{ scope.row.times[0] }}
            </span>
          </p>
          <p v-if="isSoonTime(scope.row, scope.row.times.slice(-1)[0])">
            Ra sớm:
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
        :name="`late_early-${dayjs().format('DD-MM-YYYY')}.xls`"
      >
        <el-button :disabled="callingAPI">Xuất file excel</el-button>
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
</template>

<script>
import dayjs from "dayjs";
import Pagination from "@/mixins/pagination";
import timekeepingServices from "@/services/timekeeping";
import shiftUserServices from "@/services/shiftUser";
import { convertDateDefault, parseTime } from "@/utils/filters";

export default {
  name: "DardinessReport",
  data() {
    return {
      callingAPI: false,
      tableData: [],

      pageSizes: [10, 20, 50, 100],
      pageSize: 10,

      currentPage: 1,
    };
  },
  mixins: [Pagination],
  computed: {
    filteredData() {
      return this.tableData;
    },
    excelHeader() {
      return [
        "Tên nhân viên",
        "Mã nhân viên",
        "Ngày chấm công",
        "Thời gian bắt đầu - kết thúc ca",
        "Thời gian vào trễ, ra sớm",
      ];
    },
    jsonData() {
      return this.tableData.map((d) => {
        const data = {};
        data[this.excelHeader[0]] = d.employee.full_name;
        data[this.excelHeader[1]] = d.employee.code;
        data[this.excelHeader[2]] = convertDateDefault(d.term);
        data[this.excelHeader[3]] = `${parseTime(
          d.shift.started_at
        )} - ${parseTime(d.shift.ended_at)}`;
        data[this.excelHeader[4]] = [d.late, d.soon].filter(Boolean).join(", ");
        return data;
      });
    },
    total() {
      return this.filteredData.length;
    },
  },
  beforeMount() {
    this.loadData();
  },
  methods: {
    dayjs,
    async loadData() {
      this.callingAPI = true;
      const getTimeKeepings = await timekeepingServices.list();
      const getShiftUser = await shiftUserServices.list();

      await Promise.all([getTimeKeepings, getShiftUser])
        .then(([timekeepings, shiftUsers]) => {
          this.callingAPI = false;
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
          this.callingAPI = false;
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

<style lang="scss" scoped></style>
