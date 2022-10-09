<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div :class="{ hasTagsView: true }" class="main-container">
      <div class="fixed-header">
        <navbar @changePassword="changePassword" />
        <tags-view />
      </div>
      <app-main />
    </div>
    <change-password-popup
      :visible="visibleChangePassword"
      @close="visibleChangePassword = false"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import AppMain from "./components/AppMain";
import Sidebar from "./components/Sidebar/index";
import Navbar from "./components/Navbar";
import TagsView from "./components/TagsView";
import ChangePasswordPopup from "@/components/ChangePassword";
export default {
  name: "Layout",
  components: {
    AppMain,
    Sidebar,
    Navbar,
    TagsView,
    ChangePasswordPopup,
  },
  data() {
    return {
      visibleChangePassword: false,
    };
  },
  computed: {
    ...mapState({
      opened: (state) => state.sidebar.opened,
      withoutAnimation: (state) => state.sidebar.withoutAnimation,
    }),
    classObj() {
      return {
        hideSidebar: !this.opened,
        openSidebar: this.opened,
        withoutAnimation: this.withoutAnimation,
      };
    },
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("sidebar/closeSideBar", { withoutAnimation: false });
    },

    changePassword() {
      this.visibleChangePassword = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}
</style>
