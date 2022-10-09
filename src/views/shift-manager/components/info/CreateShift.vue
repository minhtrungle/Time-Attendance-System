<template>
  <el-dialog
    title="Thêm ca làm việc mới"
    :visible="visible"
    width="500px"
    top="90px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="form" v-loading="callingAPI">
      <el-form-item label="Ca làm việc" prop="summary">
        <el-input v-model="form.summary" placeholder="Nhập ca làm việc" />
      </el-form-item>
      <el-form-item label="Thời gian bắt đầu ca" prop="started_at">
        <el-time-select
          class="w-100"
          v-model="form.started_at"
          :picker-options="{
            start: '00:00',
            step: '00:30',
            end: '23:30',
          }"
          placeholder="Thời gian bắt đầu ca"
        >
        </el-time-select>
      </el-form-item>
      <el-form-item label="Thời gian kết thúc ca" prop="ended_at">
        <el-time-select
          v-model="form.ended_at"
          class="w-100"
          :picker-options="{
            start: '00:00',
            step: '00:30',
            end: '23:30',
            minTime: form.started_at,
          }"
          placeholder="Thời gian kết thúc ca"
        >
        </el-time-select>
      </el-form-item>
      <el-form-item label="Full time/ Part time" prop="part_time">
        <el-radio-group v-model="form.part_time" class="w-100">
          <el-radio :label="false" border>Full</el-radio>
          <el-radio :label="true" border>Part</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="danger"
        @click="handleClose"
        :disabled="callingAPI || loadingCreate"
      >
        Hủy
      </el-button>
      <el-button
        type="primary"
        :loading="callingAPI || loadingCreate"
        @click="handleCreateShift"
      >
        Hoàn thành
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import dayjs from "dayjs";
import shiftServices from "@/services/shift";
export default {
  name: "CreateShiftPopup",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    shift: {
      type: Object,
    },
  },
  data() {
    return {
      callingAPI: false,
      loadingCreate: false,
      form: {
        summary: "",
        started_at: "",
        ended_at: "",
        part_time: false,
      },
      rules: {
        summary: [
          {
            required: true,
            message: "Tên ca không được để trống",
            trigger: ["blur", "change"],
          },
        ],
        started_at: [
          {
            required: true,
            message: "Thời gian bắt đầu không được để trống",
            trigger: ["blur", "change"],
          },
        ],
        ended_at: [
          {
            required: true,
            message: "Thời gian kết thúc không được để trống",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  methods: {
    handleCreateShift() {
      this.loadingCreate = true;
      const data = {
        summary: this.form.summary,
        started_at: `${this.form.started_at}:00.000`,
        ended_at: `${this.form.ended_at}:00.000`,
        part_time: this.form.part_time,
      };
      if (this.form.day) {
        data.day = this.form.day
          ? dayjs(this.form.day).format("YYYY-MM-DD")
          : "";
      }
      shiftServices
        .create(data)
        .then(() => {
          this.loadingCreate = false;
          this.$notify.success({
            title: "Thông báo",
            message: "Thêm mới ca làm việc thành công",
          });
          this.$emit("reload");
          this.handleClose();
        })
        .catch(() => {
          this.loadingCreate = true;
        });
    },
    handleClose() {
      this.$emit("close");
      this.$refs.form.resetFields();
    },
  },
};
</script>

<style lang="scss" scoped></style>
