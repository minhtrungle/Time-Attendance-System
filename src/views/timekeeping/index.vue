<template>
  <div class="form-container">
    <h2 class="text-center">Mô phỏng chấm công</h2>
    <el-form :model="form" v-loading="callingAPI">
      <el-form-item label="Nhân viên chấm công">
        <el-select v-model="form.employee_id" class="w-100" clearable>
          <el-option
            v-for="item in employees"
            :key="item.id"
            :value="item.id"
            :label="item.full_name"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Thời gian chấm công">
        <el-time-picker
          v-model="form.time"
          placeholder="Chọn thời gian"
          class="w-100"
        >
        </el-time-picker>
      </el-form-item>
      <el-row type="flex" justify="center">
        <el-button type="primary" :loading="false" @click="handleSubmit"
          >Chấm công</el-button
        >
      </el-row>
    </el-form>
  </div>
</template>

<script>
import dayjs from "dayjs";
import employeeServices from "@/services/employee";
import timekeepingServices from "@/services/timekeeping";
export default {
  name: "FormTimeKeeping",
  data() {
    return {
      callingAPI: false,
      loading: false,
      form: {
        employee_id: "",
        time: "",
      },
      employees: [],
    };
  },
  beforeMount() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.callingAPI = true;
      employeeServices.list().then((response) => {
        this.callingAPI = false;
        this.employees = response;
      });
    },
    handleSubmit() {
      this.loading = true;
      const data = {
        employee: this.form.employee_id,
        term: dayjs().format("YYYY-MM-DD"),
        checkin: {
          time: dayjs().format("HH:mm:ss"),
        },
      };
      timekeepingServices.create(data).then(() => {
        this.loading = false;
        this.$notify.success({
          title: "Thông báo",
          message: "Chấm công thành công.",
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.form-container {
  width: 500px;
  margin: 0 auto;
}
</style>
