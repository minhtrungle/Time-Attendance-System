<template>
  <div class="shift-info">
    <el-table :data="data" style="width: 100%" border>
      <el-table-column type="index" width="50" align="center" label="STT" />
      <el-table-column prop="summary" label="Tên ca làm việc"></el-table-column>
      <el-table-column label="Thời gian bắt đầu ca ">
        <template slot-scope="scope">
          {{ scope.row.started_at | parseTime }}
        </template>
      </el-table-column>
      <el-table-column label="Thời gian kết thúc ca">
        <template slot-scope="scope">
          {{ scope.row.ended_at | parseTime }}
        </template>
      </el-table-column>
      <el-table-column label="Sửa" width="100" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            @click="updateShift(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
      <el-table-column label="Xóa" width="100" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            @click="handleRemoveShift(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <update-shift-popup
      v-if="visibleUpdate"
      :visible="visibleUpdate"
      :shift="selectedShift"
      @close="visibleUpdate = false"
    />
  </div>
</template>

<script>
import shiftServices from "@/services/shift";
import UpdateShiftPopup from "./components/info/UpdateShift";
export default {
  name: "ShiftInfo",
  props: {
    data: Array,
  },
  components: {
    UpdateShiftPopup,
  },
  data() {
    return {
      visibleUpdate: false,
      selectedShift: {},
    };
  },
  methods: {
    updateShift(row) {
      this.selectedShift = row;
      this.visibleUpdate = true;
    },

    handleRemoveShift(row) {
      this.$confirm("Chắc chắn muốn xóa ca làm việc. Tiếp tục?", "Cảnh báo", {
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Hủy",
        type: "warning",
      })
        .then(() => {
          shiftServices.remove(row.id).then(() => {
            this.$emit("reload");
            this.$notify.success({
              title: "Thông báo",
              message: "Xóa ca làm việc thành công.",
            });
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped></style>
