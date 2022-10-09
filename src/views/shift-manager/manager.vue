<template>
  <div class="list-shift">
    <el-table :data="filteredData" style="width: 100%" border>
      <el-table-column type="index" width="50" align="center" label="STT" />
      <el-table-column label="Mã nhân viên" width="120">
        <template slot-scope="scope">
          {{ scope.row.employee ? scope.row.employee.code : "" }}
        </template>
      </el-table-column>
      <el-table-column label="Tên nhân viên">
        <template slot-scope="scope">
          {{ scope.row.employee ? scope.row.employee.full_name : "" }}
        </template>
      </el-table-column>
      <el-table-column label="Ca làm việc" align="center">
        <template slot-scope="scope">
          <el-tag type="success">
            {{ scope.row.shift ? scope.row.shift.summary : "" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Thời gian bắt đầu - kết thúc ca" width="230">
        <template slot-scope="scope">
          <el-row type="flex" align="middle">
            <span>
              {{
                scope.row.shift ? scope.row.shift.started_at : "" | parseTime
              }}
            </span>
            <span class="mx-1">-</span>
            <span>
              {{ scope.row.shift ? scope.row.shift.ended_at : "" | parseTime }}
            </span>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="Thời gian làm việc">
        <template slot-scope="scope">
          <div v-if="scope.row.work_dates.length">
            <p v-for="item in scope.row.work_dates" :key="item" class="my-0">
              {{ item | convertDate }}
            </p>
          </div>
          <span v-else> Tất cả các ngày </span>
        </template>
      </el-table-column>
      <el-table-column label="Thêm" width="80" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-plus"
            circle
            @click="addShiftEmployee(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
      <el-table-column label="Xóa" width="80" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            @click="deleteShiftUser(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="space-between" class="mt-3">
      <download-excel
        :data="jsonData"
        :name="`manager-${dayjs().format('DD-MM-YYYY')}.xls`"
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
    <add-shift-employee-popup
      :shiftUsers="data"
      :employee="selectedEmployee"
      :visible="visibleAddShift"
      @reload="$emit('reload')"
      @close="visibleAddShift = false"
    />
  </div>
</template>

<script>
import dayjs from "dayjs";
import Pagination from "@/mixins/pagination";
import AddShiftEmployeePopup from "./components/manager/AddShift";
import shiftUserServices from "@/services/shiftUser";
import { parseTime } from "@/utils/filters";

export default {
  name: "ManageShift",
  props: {
    data: Array,
    total: {
      type: Number,
      default: 0,
    },
  },
  components: {
    AddShiftEmployeePopup,
  },
  data() {
    return {
      visibleAddShift: false,
      selectedEmployee: null,

      pageSizes: [10, 20, 50, 100],
      pageSize: 10,
      page: 1,

      form: {
        searchText: "",
      },
    };
  },
  mixins: [Pagination],
  computed: {
    filteredData() {
      return this.data;
    },
    excelHeader() {
      return [
        "Mã nhân viên",
        "Họ và tên",
        "Ca làm việc",
        "Thời gian bắt đầu - kết thúc ca",
        "Ngày làm việc",
      ];
    },
    jsonData() {
      return this.data.map((d) => {
        const data = {};
        data[this.excelHeader[0]] = d.employee ? d.employee.code : "";
        data[this.excelHeader[1]] = d.employee ? d.employee.full_name : "";
        data[this.excelHeader[2]] = d.shift ? d.shift.summary : "";
        data[this.excelHeader[3]] = `${parseTime(
          d.shift ? d.shift.started_at : ""
        )} - ${parseTime(d.shift ? d.shift.ended_at : "")}`;
        data[this.excelHeader[4]] = d.date ? d.date : "Tất cả các ngày";
        return data;
      });
    },
  },
  methods: {
    dayjs,
    addShiftEmployee(row) {
      this.selectedEmployee = row;
      this.visibleAddShift = true;
    },

    deleteShiftUser(row) {
      const h = this.$createElement;
      this.$msgbox({
        title: "Xác nhận xóa",
        message: h("p", null, [
          h(
            "span",
            null,
            "Bạn chắc chắn muốn xóa ca làm việc này của nhân viên "
          ),
          h("b", { style: "color: red" }, `${row.employee.full_name}`),
        ]),
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Hủy",
        type: "warning",
      })
        .then(() => {
          shiftUserServices.remove(row.id).then(() => {
            this.$emit("reload");
            this.$notify.success({
              title: "Thông báo",
              message: "Xóa ca làm việc thành công.",
            });
          });
        })
        .catch(() => {});
    },

    handleSizeChange(size) {
      this.pageSize = size;
    },
  },
};
</script>

<style lang="scss" scoped></style>
