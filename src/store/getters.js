//getter
const getters = {
  opened: (state) => state.sidebar.opened,
  withoutAnimation: (state) => state.sidebar.withoutAnimation,
  visitedViews: (state) => state.tagsView.visitedViews,
  cachedViews: (state) => state.tagsView.cachedViews,
};
export default getters;

