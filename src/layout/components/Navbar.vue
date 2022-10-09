<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      class="hamburger-container"
      :is-active="opened"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <i class="el-icon-message"></i>
          <span class="mr-2"></span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            Email: {{ adminInfo ? adminInfo.user.email : "" }}
          </el-dropdown-item>
          <el-dropdown-item @click.native="$emit('changePassword')">
            Đổi mật khẩu
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block" class="text-danger">LogOut</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Breadcrumb from "./Breadcumb/index";
import Hamburger from "./Hamburger/index";
import authServices from "@/services/auth";

export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  computed: {
    ...mapState({
      opened: (state) => state.sidebar.opened,
      withoutAnimation: (state) => state.sidebar.withoutAnimation,
    }),
    adminInfo() {
      return authServices.loginInfo();
    },
  },
  methods: {
    logout() {
      authServices.logout();
      this.$router.push({ name: "Login" });
    },

    toggleSideBar() {
      this.$store.dispatch("sidebar/toggleSideBar");
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 31px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
    .avatar-wrapper {
      font-size: 14px;
    }
    .el-icon-message {
      font-size: 28px;
      color: #409eff;
      padding-top: 0px;
    }
  }
}
</style>
