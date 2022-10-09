<template>
  <el-form :model="form" :inline="true">
    <el-form-item>
      <el-date-picker
        v-model="form.selectedMonth"
        type="month"
        format="MM-yyyy"
        placeholder="Chọn tháng"
      />
    </el-form-item>
    <el-button icon="el-icon-search" circle @click="changeMonth"></el-button>
  </el-form>
</template>

<script>
import dayjs from "dayjs";
export default {
  name: "FilterTimekeepingReport",
  data() {
    return {
      form: {
        selectedMonth: dayjs(),
      },
    };
  },
  methods: {
    changeMonth() {
      const month = dayjs(this.form.selectedMonth).get("month");
      this.$emit("change", month);
    },
  },
};
</script>
