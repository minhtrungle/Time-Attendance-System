<template>
  <el-form :model="form" :inline="true">
    <el-form-item>
      <el-input
        v-model="form.searchText"
        :clearable="true"
        placeholder="Tìm kiếm"
      />
    </el-form-item>
    <el-button icon="el-icon-search" circle @click="handleSearch"></el-button>
  </el-form>
</template>

<script>
export default {
  name: "FilterDeviceManager",
  data() {
    return {
      form: {
        searchText: "",
      },
    };
  },
  methods: {
    handleSearch() {
      this.$emit("search", this.form.searchText);
    },
  },
};
</script>
