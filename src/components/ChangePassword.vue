<template>
  <el-dialog
    title="Đổi mật khẩu"
    :visible="visible"
    width="600px"
    @close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="Nhập mật khẩu cũ" prop="oldPassword">
        <el-input v-model="form.oldPassword" placeholder="Hhập mật khẩu cũ" />
      </el-form-item>
      <el-form-item label="Nhập mật khẩu mới" prop="newPassword">
        <el-input
          v-model="form.newPassword"
          placeholder="Hãy nhập mật khẩu mới"
        />
      </el-form-item>
      <el-form-item label="Nhập lại mật khẩu mới" prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          placeholder="Hãy nhập lại mật khẩu mới"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" @click="handleClose">Hủy</el-button>
      <el-button type="primary" @click="changePassword">Hoàn thành</el-button>
    </span>
  </el-dialog>
</template>

<script>
import authServices from "@/services/auth";
export default {
  name: "ChangePasswordPopup",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      rules: {
        oldPassword: [
          {
            required: true,
            message: "Mật khẩu không được để trống",
            trigger: ["change", "blur"],
          },
        ],
        newPassword: [
          {
            required: true,
            message: "Mật khẩu không được để trống",
            trigger: ["change", "blur"],
          },
        ],
        confirmPassword: [
          {
            required: true,
            message: "Mật khẩu không được để trống",
            trigger: ["change", "blur"],
          },
        ],
      },
    };
  },
  methods: {
    changePassword() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const data = {
            code: "12313213",
            password: this.form.oldPassword,
            passwordConfirmation: this.form.newPassword,
          };
          authServices.changePassword(data).then(() => {
            this.$router.push({ name: "Login" });
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
