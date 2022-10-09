<template>
  <el-card>
    <h2 class="mt-0">{{ $route.meta.title || "" }}</h2>
    <el-form :model="form" :inline="true">
      <el-form-item>
        <el-input
          v-model="form.searchText"
          :clearable="true"
          placeholder="Tìm kiếm"
        />
      </el-form-item>
      <el-button icon="el-icon-search" circle @click="handleSearch"></el-button>
    </el-form>
    <el-table :data="tableData" v-loading="callingAPI" border>
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
      <el-table-column label="Thời gian vào ra">
        <template slot-scope="scope">
          {{ scope.row.checkin.time }}
        </template>
      </el-table-column>
      <el-table-column label="Ngày vào ra">
        <template slot-scope="scope">
          {{ scope.row.term }}
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="space-between" class="mt-3">
      <download-excel
        :data="jsonData"
        :name="`history-${dayjs().format('DD-MM-YYYY')}.xls`"
      >
        <el-button>Xuất file excel</el-button>
      </download-excel>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        :current-page="page"
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
import timekeepingServices from "@/services/timekeeping";
export default {
  name: "HistoryInOut",
  data() {
    return {
      tableData: [],
      callingAPI: false,

      pageSizes: [10, 20, 50, 100],
      pageSize: 10,
      total: 0,
      page: 1,

      form: {
        searchText: "",
      },
    };
  },
  beforeMount() {
    this.loadCount();
    this.loadData();
  },
  computed: {
    excelHeader() {
      return ["Thời gian", "Ngày ra vào", "Tên nhân viên", "Mã nhân viên"];
    },
    jsonData() {
      return this.tableData.map((d) => {
        const data = {};
        data[this.excelHeader[0]] = d.checkin.time;
        data[this.excelHeader[1]] = d.term;
        data[this.excelHeader[2]] = d.employee.full_name;
        data[this.excelHeader[3]] = d.employee.code;
        return data;
      });
    },
  },
  methods: {
    dayjs,

    loadCount() {
      timekeepingServices.count().then((response) => {
        this.total = response;
      });
    },

    loadData() {
      this.callingAPI = true;
      const params = {
        _start: this.page * 10 - 10,
        _limit: this.pageSize,
      };
      if (this.form.searchText) {
        params["_start"] = 1;
        params["_q"] = this.form.searchText;
      }
      timekeepingServices
        .list(params)
        .then((response) => {
          this.tableData = response;
          this.callingAPI = false;
        })
        .catch(() => {
          this.callingAPI = false;
        });
    },

    handlePageChange(page) {
      this.page = page;
      this.loadData();
    },

    handleSizeChange(size) {
      this.pageSize = size;
      this.loadData();
    },

    handleSearch() {
      this.loadData();
    },
  },
};
</script>

<style lang="scss" scoped></style>
