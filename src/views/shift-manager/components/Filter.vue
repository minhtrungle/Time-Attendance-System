<template>
  <el-form :model="form" class="form-filter" :inline="true">
    <el-form-item>
      <el-input
        v-model="form.searchText"
        :clearable="true"
        placeholder="Nhập từ khóa để tìm kiếm"
      />
    </el-form-item>
    <el-button type="info">Tìm kiếm</el-button>
  </el-form>
</template>

<script>
export default {
  name: "FilterShiftManager",
  data() {
    return {
      form: {
        searchText: "",
      },
    };
  },
};
</script>
