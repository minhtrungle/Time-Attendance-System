<template>
  <el-dialog
    :visible="visible"
    width="650px"
    top="90px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleClose"
  >
    <p slot="title" class="my-0">
      Thêm ca làm việc mới cho nhân viên
      <b>{{ employee ? employee.employee.full_name : "" }}</b>
    </p>
    <el-form
      :model="form"
      :rules="rules"
      :label-position="'top'"
      ref="form"
      v-loading="callingAPI"
    >
      <el-form-item label="Nhân viên" prop="employee_id">
        <el-select
          v-model="form.employee_id"
          class="w-100"
          @change="changeEmployee"
          :disabled="!!(employee && employee.employee_id)"
          clearable
        >
          <el-option
            v-for="item in employees"
            :key="item.id"
            :value="item.id"
            :label="item.full_name"
            :disabled="
              shiftUsers
                .filter((e) => e.employee_id === item.id)
                .map((em) => em.shift_id)
                .includes(form.shift_id)
            "
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Chọn ca làm việc" class="w-100" prop="shift_id">
        <el-select
          v-model="form.shift_id"
          @change="changeShift"
          :disabled="!form.employee_id"
          class="w-100"
          clearable
        >
          <el-option
            v-for="shift in filteredShifts"
            :key="shift.id"
            :value="shift.id"
            :label="shift.summary"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="Chọn ngày làm việc"
        v-if="selectedEmployee.part_time"
      >
        <div class="w-100">
          <el-date-picker
            type="dates"
            class="w-100"
            v-model="form.dates"
            :disabled="!form.employee_id || !form.shift_id"
            placeholder="Chọn ngày làm việc"
          />
          <small class="w-100 block">
            <span class="text-danger">*</span>
            Lưu ý: Nếu không chọn ngày nào. Ca làm của nhân viên mặc định là tất
            cả các ngày làm việc theo quy định
          </small>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="danger"
        @click="handleClose"
        :disabled="callingAPI || loadingCreate"
      >
        Hủy
      </el-button>
      <el-button
        type="primary"
        :loading="callingAPI || loadingCreate"
        @click="handleAdd"
      >
        Hoàn thành
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
// import dayjs from "dayjs";
import employeeServices from "@/services/employee";
import shiftServices from "@/services/shift";
import shiftUserServices from "@/services/shiftUser";
export default {
  name: "AddShiftEmployeePopup",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    employee: {
      type: Object,
      default: () => {},
    },
    shiftUsers: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      callingAPI: false,
      loadingCreate: false,
      form: {
        employee_id: "",
        shift_id: "",
        dates: [],
      },
      rules: {
        employee_id: [
          {
            required: true,
            message: "Nhân viên không được để trống",
            trigger: ["blur", "change"],
          },
        ],
        shift_id: [
          {
            required: true,
            message: "ca làm việc không được để trống",
            trigger: ["blur", "change"],
          },
        ],
      },
      selectedShift: {},
      selectedEmployee: {},
      employees: [],
      shifts: [],
    };
  },
  computed: {
    filteredShifts() {
      const employee = this.employees.find(
        (e) => e.id === this.form.employee_id
      );
      if (employee && employee.part_time) {
        return this.shifts.filter((s) => s.part_time);
      } else {
        return this.shifts.filter((s) => !s.part_time);
      }
    },
  },
  beforeMount() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.callingAPI = true;
      await this.loadEmployees();
      await this.loadShifts();
      this.callingAPI = false;
    },

    async loadEmployees() {
      const employees = await employeeServices.list();
      this.employees = employees;
      if (this.employee && this.visible) {
        this.form.employee_id = this.employee.employee_id;
      }
    },

    async loadShifts() {
      const shifts = await shiftServices.list();
      this.shifts = shifts;
    },

    changeEmployee() {
      this.selectedEmployee = this.employees.find(
        (e) => e.id === this.form.employee_id
      );
    },

    changeShift() {
      this.selectedShift = this.shifts.find((s) => s.id === this.form.shift_id);
    },

    async handleAdd() {
      if (this.selectedEmployee.part_time && !this.form.dates.length) {
        this.$notify.warning({
          title: "Cảnh báo",
          message: "Cần thêm ngày làm việc cho nhân viên",
        });
        return;
      }
      this.loadingCreate = true;
      let data = {
        employee_id: this.form.employee_id,
        shift_id: this.form.shift_id,
        employee: this.employees.find((e) => e.id === this.form.employee_id),
        shift: this.shifts.find((s) => s.id === this.form.shift_id),
      };
      if (this.selectedEmployee.part_time && this.form.dates.length) {
        data.work_dates = this.form.dates;
      } else {
        data.work_dates = [];
      }
      shiftUserServices.create(data).then(() => {
        this.$notify.success({
          title: "Thành công",
          message: "Thêm ca làm việc thành công",
        });
        this.$emit("reload");
        this.handleClose();
        this.loadingCreate = false;
      });
    },
    handleClose() {
      this.$refs.form.resetFields();
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped></style>
