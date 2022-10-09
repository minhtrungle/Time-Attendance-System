<template>
  <el-dialog
    title="Cập nhật thông tin nhân viên"
    :visible="visible"
    width="600px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    top="50px"
    @close="handleClose"
    @open="loadData"
  >
    <el-form :model="form" :rules="rules" ref="form" v-loading="callingAPI">
      <el-form-item label="Mã nhân viên" prop="code">
        <el-input v-model="form.code" placeholder="Nhập mã nhân viên" />
      </el-form-item>
      <el-form-item label="Họ tên nhân viên" prop="full_name">
        <el-input
          v-model="form.full_name"
          placeholder="Nhập họ tên nhân viên"
        />
      </el-form-item>
      <el-form-item label="Số điện thoại" prop="phone_number">
        <el-input
          v-model="form.phone_number"
          placeholder="Nhập số điện thoại"
        />
      </el-form-item>
      <el-form-item label="Phòng ban" prop="location">
        <el-input v-model="form.location" placeholder="Nhập phòng ban">
          <!-- <template slot-scope="scope">
            {{ scope.row.department ? scope.row.department.summary : "" }}
          </template> -->
        </el-input>
      </el-form-item>
      <el-form-item label="Chức danh" prop="title">
        <el-input v-model="form.title" placeholder="Nhập chức danh"></el-input>
      </el-form-item>
      <el-form-item label="Full time/ Part time" prop="part_time">
        <el-radio-group v-model="form.part_time" class="w-100">
          <el-radio :label="false" border>Full</el-radio>
          <el-radio :label="true" border>Part</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" @click="handleClose" :disabled="callingAPI"
        >Hủy</el-button
      >
      <el-button
        type="primary"
        :loading="callingAPI"
        @click="handleUpdateStaff"
      >
        Hoàn thành
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import employeeServices from "@/services/employee";
export default {
  name: "UpdateStaff",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      callingAPI: false,

      form: {
        full_name: "",
        phone_number: "",
        code: "",
        location: "",
        title: "",
        part_time: false,
      },
      rules: {
        full_name: [
          {
            required: true,
            message: "Vui lòng không được để trống",
            trigger: ["blur", "change"],
          },
        ],
        code: [
          {
            required: true,
            message: "Vui lòng không được để trống",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  methods: {
    loadData() {
      this.form.full_name = this.data.full_name || "";
      this.form.code = this.data.code || "";
      this.form.phone_number = this.data.phone_number || "";
      this.form.location = this.data.location || "";
      this.form.title = this.data.title || "";
      this.form.part_time = this.data.part_time || false;
    },

    handleUpdateStaff() {
      this.callingAPI = true;
      this.$refs.form.validate((valid) => {
        if (valid) {
          const data = {
            full_name: this.form.full_name,
            code: this.form.code,
            phone_number: this.form.phone_number,
            location: this.form.location,
            title: this.form.title,
            part_time: this.form.part_time,
          };
          employeeServices
            .update(data, this.data.id)
            .then(() => {
              this.$notify.success({
                title: "Thông báo",
                message: "Cập nhật nhân viên thành công.",
              });
              this.$emit("reload");
              this.handleClose();
              this.callingAPI = false;
            })
            .catch(() => {
              this.callingAPI = false;
            });
        }
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
