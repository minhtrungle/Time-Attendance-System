//slidebar
import Cookies from "js-cookie";

const state = {
  opened: true,
  withoutAnimation: false,
};

const getters = {
  opened(state) {
    return state.opened;
  },
  withoutAnimation(state) {
    return state.withoutAnimation;
  },
};

const mutations = {
  TOGGLE_SIDEBAR: (state) => {
    state.opened = !state.opened;
    state.withoutAnimation = false;
    if (state.opened) {
      Cookies.set("sidebarStatus", 1);
    } else {
      Cookies.set("sidebarStatus", 0);
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set("sidebarStatus", 0);
    state.opened = false;
    state.withoutAnimation = withoutAnimation;
  },
};

const actions = {
  toggleSideBar({ commit }) {
    commit("TOGGLE_SIDEBAR");
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit("CLOSE_SIDEBAR", withoutAnimation);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
