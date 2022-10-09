<template>
  <div class="list-employee">
    <el-table :data="data" style="width: 100%" border>
      <el-table-column type="index" width="50" align="center" label="STT" />
      <el-table-column prop="code" label="Mã nhân viên" />
      <el-table-column prop="full_name" label="Tên nhân viên" />
      <el-table-column prop="phone_number" label="Số điện thoại" />
      <el-table-column prop="location" label="Phòng ban">
        <!-- <template slot-scope="scope">
          {{ scope.row.department ? scope.row.department.summary : "" }}
        </template> -->
      </el-table-column>
      <el-table-column prop="title" label="Chức danh" />
      <el-table-column label="Full time/ Part time ">
        <template slot-scope="scope">
          {{ scope.row.part_time ? "Part time" : "Full time" }}
        </template>
      </el-table-column>
      <el-table-column label="Sửa" width="100" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            @click="$emit('update', scope.row)"
          ></el-button>
        </template>
      </el-table-column>
      <el-table-column label="Xóa" width="100" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            @click="handleRemoveEmployee(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="space-between" class="mt-3">
      <download-excel
        :data="jsonData"
        :name="`employees-${dayjs().format('DD-MM-YYYY')}.xls`"
      >
        <el-button>Xuất file excel</el-button>
      </download-excel>
      <el-pagination
        background
        @size-change="handleChangeSize"
        @current-change="handleChangePage"
        :current-page="page"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
      />
    </el-row>
  </div>
</template>

<script>
import dayjs from "dayjs";
import employeeServices from "@/services/employee";
export default {
  name: "ListEmployee",
  props: {
    data: Array,
    total: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      pageSizes: [10, 20, 50, 100],
      pageSize: 10,
      page: 1,
    };
  },
  computed: {
    excelHeader() {
      return [
        "Mã nhân viên",
        "Tên nhân viên",
        "Số điện thoại",
        "Phòng ban",
        "Chức danh",
        "Hình thức",
      ];
    },
    jsonData() {
      return this.data.map((d) => {
        const data = {};
        data[this.excelHeader[0]] = d.code;
        data[this.excelHeader[1]] = d.full_name;
        data[this.excelHeader[2]] = d.phone_number;
        // data[this.excelHeader[3]] = d.department ? d.department.summary : "";
        data[this.excelHeader[3]] = d.location;
        data[this.excelHeader[4]] = d.title;
        data[this.excelHeader[5]] = d.part_time ? "Part time" : "Full time";
        return data;
      });
    },
  },
  methods: {
    dayjs,
    handleRemoveEmployee(row) {
      this.$confirm("Chắc chắn muốn xóa nhân viên. Tiếp tục?", "Cảnh báo", {
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Hủy",
        type: "warning",
      })
        .then(() => {
          employeeServices.remove(row.id).then(() => {
            this.$emit("reload");
            this.$notify.success({
              titles: "Thông báo",
              message: "Xóa nhân viên thành công.",
            });
          });
        })
        .catch(() => {});
    },
    handleChangePage(page) {
      this.$emit("load", page);
    },
    handleChangeSize(size) {
      this.$emit("load", size);
    },
  },
};
</script>

<style lang="scss" scoped></style>
