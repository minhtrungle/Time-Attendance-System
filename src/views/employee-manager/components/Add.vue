<template>
  <el-dialog
    title="Thêm nhân viên mới"
    :visible="visible"
    width="600px"
    top="90px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="form" v-loading="callingAPI">
      <el-form-item label="Mã nhân viên" prop="code">
        <el-input v-model="form.code" placeholder="Nhập mã nhân viên" />
      </el-form-item>
      <el-form-item label="Họ tên nhân viên" prop="full_name">
        <el-input
          v-model="form.full_name"
          placeholder="Nhập họ tên nhân viên"
        />
      </el-form-item>
      <el-form-item label="Số điện thoại" prop="phone_number">
        <el-input
          v-model="form.phone_number"
          placeholder="Nhập số điện thoại"
        />
      </el-form-item>

      <el-form-item label="Phòng ban" prop="department">
        <el-input v-model="form.location" placeholder="Nhập phòng ban" />
      </el-form-item>

      <el-form-item label="Chức danh" prop="title">
        <el-input v-model="form.title" placeholder="Nhập chức danh" />
      </el-form-item>

      <el-form-item label="Full time/ Part time" prop="part_time">
        <el-radio-group v-model="form.part_time" class="w-100">
          <el-radio :label="false" border>Full</el-radio>
          <el-radio :label="true" border>Part</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" @click="handleClose" :disabled="callingAPI"
        >Hủy</el-button
      >
      <el-button
        type="primary"
        :loading="callingAPI"
        @click="handleCreateEmployee"
      >
        Hoàn thành
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import employeeServices from "@/services/employee";
export default {
  name: "AddEmployee",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      callingAPI: false,

      form: {
        full_name: "",
        phone_number: "",
        code: "",
        location: "",
        title: "",
        part_time: false,
      },
      rules: {
        full_name: [
          {
            required: true,
            message: "Vui lòng không được để trống",
            trigger: ["blur", "change"],
          },
        ],
        code: [
          {
            required: true,
            message: "Vui lòng không được để trống",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  methods: {
    handleCreateEmployee() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.callingAPI = true;
          const data = {
            full_name: this.form.full_name,
            code: this.form.code,
            phone_number: this.form.phone_number,
            location: this.form.location,
            title: this.form.title,
            part_time: this.form.part_time,
          };
          employeeServices
            .create(data)
            .then(() => {
              this.$notify.success({
                titles: "Thông báo",
                message: "Thêm nhân viên thành công.",
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
