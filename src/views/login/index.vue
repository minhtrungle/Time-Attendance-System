<template>
  <div class="login-container">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      class="login-form"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">HỆ THỐNG QUẢN LÝ CHẤM CÔNG</h3>
      </div>
      <el-form-item prop="email">
        <span class="svg-container">
          <i class="el-icon-message"></i>
        </span>
        <el-input
          v-model="form.email"
          placeholder="Nhập tài khoản"
          :disabled="loading"
          type="text"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <i class="el-icon-lock"></i>
        </span>
        <el-input
          v-model="form.password"
          type="password"
          show-password
          placeholder="Nhập mật khẩu"
          :disabled="loading"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>
      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click="handleLogin"
      >
        Đăng nhập
      </el-button>
    </el-form>
  </div>
</template>

<script>
import authServices from "@/services/auth";
export default {
  name: "Login",
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      rules: {
        email: [
          { required: true, message: "Vui lòng không để trống tài khoản!" },
        ],
        password: [
          { required: true, message: "Vui lòng không để trống mật khẩu!" },
        ],
      },
      loading: false,
      capsTooltipAccount: false,
      capsTooltipPassword: false,
    };
  },
  beforeMount() {
    authServices.logout();
  },
  methods: {
    checkCapslockAccount(e) {
      const { key } = e;
      this.capsTooltipAccount =
        key && key.length === 1 && key >= "A" && key <= "Z";
    },
    checkCapslockPassword(e) {
      const { key } = e;
      this.capsTooltipPassword =
        key && key.length === 1 && key >= "A" && key <= "Z";
    },

    handleLogin() {
      this.loading = true;
      const data = {
        identifier: this.form.email,
        password: this.form.password,
      };
      authServices
        .login(data)
        .then((response) => {
          authServices.updateLoginInfo(response);
          this.$notify({
            title: "Thành công",
            message: "Đăng nhập thành công",
            type: "success",
          });
          this.$router.push({ name: "Dashboard" });
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 50px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-input.is-disabled .el-input__inner {
    background-color: transparent;
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    margin-bottom: 40px;
  }
}
</style>
<style lang="scss" scoped>
@import "./style.scss";
</style>
