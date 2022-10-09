<template>
  <el-dialog
    :visible="visible"
    width="600px"
    top="90px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @open="loadData"
    @close="handleClose"
  >
    <p class="my-0" slot="title">
      Cập nhật máy chấm công <b>{{ device.summary ? device.summary : "" }}</b>
    </p>
    <el-form :model="form" :rules="rules" ref="form" v-loading="callingAPI">
      <el-form-item label="Tên máy chấm công" prop="summary">
        <el-input v-model="form.summary" placeholder="Nhập tên máy chấm công" />
      </el-form-item>
      <el-form-item label="Loại máy chấm công" prop="type">
        <el-input v-model="form.type" placeholder="Nhập loại máy chấm công" />
      </el-form-item>
      <el-form-item label="Seri máy chấm công" prop="imei">
        <el-input v-model="form.imei" placeholder="Nhập seri máy chấm công" />
      </el-form-item>
      <el-form-item label="Địa điểm đặt máy chấm công" prop="part_time">
        <el-select v-model="form.department" class="w-100">
          <el-option
            v-for="item in departments"
            :key="item.id"
            :label="item.summary"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" @click="handleClose" :disabled="callingAPI"
        >Hủy</el-button
      >
      <el-button
        type="primary"
        :loading="callingAPI"
        @click="handleUpdateDevice"
      >
        Xác nhận
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import departmentServices from "@/services/department";
import deviceServices from "@/services/device";
export default {
  name: "AddDevice",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    device: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      callingAPI: false,

      form: {
        summary: "",
        type: "",
        imei: "",
        department: "",
      },
      rules: {
        summary: [
          {
            required: true,
            message: "Tên máy chấm công không được để trống",
            trigger: ["blur", "change"],
          },
        ],
        type: [
          {
            required: true,
            message: "Loại máy chấm công không được để trống",
            trigger: ["blur", "change"],
          },
        ],
        imei: [
          {
            required: true,
            message: "Seri máy chấm công không được để trống",
            trigger: ["blur", "change"],
          },
        ],
        department: [
          {
            required: true,
            message: "Địa điểm đặt máy chấm công không được để trống",
            trigger: ["blur", "change"],
          },
        ],
      },
      departments: [],
    };
  },
  beforeMount() {
    this.loadDepartments();
  },
  methods: {
    loadData() {
      this.form.summary = this.device.summary || "";
      this.form.type = this.device.type || "";
      this.form.imei = this.device.imei || "";
      this.form.department = this.device.department.id || "";
    },
    loadDepartments() {
      this.callingAPI = true;
      departmentServices
        .list()
        .then((response) => {
          this.departments = response;
          this.callingAPI = false;
        })
        .catch(() => {
          this.callingAPI = false;
        });
    },

    handleUpdateDevice() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.callingAPI = true;
          const data = {
            ...this.form,
            department: this.departments.find(
              (d) => d.id === this.form.department
            ),
          };
          deviceServices
            .update(data, this.device.id)
            .then(() => {
              this.$notify.success({
                title: "Thông báo",
                message: "Cập nhật máy chấm công thành công.",
              });
              this.$emit("reload");
              this.handleClose();
              this.callingAPI = false;
            })
            .catch(() => {
              this.callingAPI = false;
            });
        }
      });
    },

    handleClose() {
      this.$refs.form.resetFields();
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped></style>
