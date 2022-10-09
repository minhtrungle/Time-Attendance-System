<template>
  <el-form :model="form" :inline="true">
    <el-form-item>
      <el-input
        v-model="form.searchText"
        :clearable="true"
        placeholder="Tìm kiếm nhân viên"
      />
    </el-form-item>
    <el-button icon="el-icon-search" circle @click="handleSearch"></el-button>
  </el-form>
</template>

<script>
export default {
  name: "FilterEmployeeManager",
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
