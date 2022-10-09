<template>
  <el-card>
    <el-row type="flex" align="middle" justify="space-between" slot="header">
      <h2 class="my-0">{{ $route.meta.title || "" }}</h2>
      <el-button
        type="primary"
        class="ml-2"
        plain
        @click="visibleCreate = true"
      >
        Thêm máy chấm công
      </el-button>
    </el-row>
    <filter-form @search="loadData" />
    <el-table :data="tableData" v-loading="callingAPI" border>
      <el-table-column type="index" width="50" align="center" label="STT" />
      <el-table-column label="Tên máy">
        <template slot-scope="scope">
          {{ scope.row.summary }}
        </template>
      </el-table-column>
      <el-table-column label="Loại">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column label="Seri">
        <template slot-scope="scope">
          {{ scope.row.Seri }}
        </template>
      </el-table-column>
      <el-table-column label="Phòng ban">
        <template slot-scope="scope">
          {{ scope.row.department ? scope.row.department.summary : "" }}
        </template>
      </el-table-column>
      <el-table-column label="Đang hoạt động" width="130" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            @change="handleChangeStatus(scope)"
          />
        </template>
      </el-table-column>
      <el-table-column label="Sửa" width="100" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            @click="handleUpdateDevice(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
      <el-table-column label="Xóa" width="100" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            @click="handleRemoveDevice(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="space-between" class="mt-3">
      <download-excel
        :data="jsonData"
        :name="`devices-${dayjs().format('DD-MM-YYYY')}.xls`"
      >
        <el-button :disabled="callingAPI">Xuất file excel</el-button>
      </download-excel>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
      />
    </el-row>
    <add-device-popup
      :visible="visibleCreate"
      @reload="loadData"
      @close="visibleCreate = false"
    />
    <update-device-popup
      :visible="visibleUpdate"
      :device="selectedDevice"
      @reload="loadData"
      @close="visibleUpdate = false"
    />
  </el-card>
</template>

<script>
import dayjs from "dayjs";
import FilterForm from "./components/Filter";
import deviceServices from "@/services/device";
import AddDevicePopup from "./components/Add";
import UpdateDevicePopup from "./components/Update";
export default {
  name: "DeviceManager",
  components: {
    AddDevicePopup,
    UpdateDevicePopup,
    FilterForm,
  },
  data() {
    return {
      tableData: [],
      callingAPI: false,

      visibleCreate: false,
      visibleUpdate: false,

      selectedDevice: {},

      pageSizes: [10, 20, 50, 100],
      pageSize: 10,
      page: 1,
      total: 0,

      currentPage: 1,
    };
  },
  computed: {
    excelHeader() {
      return [
        "Tên máy chấm công",
        "Loại",
        "Seri",
        "Phòng ban",
        "Dang hoạt động",
      ];
    },
    jsonData() {
      return this.tableData.map((d) => {
        const data = {};
        data[this.excelHeader[0]] = d.summary;
        data[this.excelHeader[1]] = d.type;
        data[this.excelHeader[2]] = d.Seri;
        data[this.excelHeader[3]] = d.department ? d.department.summary : "";
        data[this.excelHeader[4]] = d.status ? "On" : "Off";
        return data;
      });
    },
  },
  beforeMount() {
    this.loadCount();
    this.loadData();
  },
  methods: {
    dayjs,
    loadCount() {
      deviceServices.count().then((response) => {
        this.total = response;
      });
    },

    loadData(searchText) {
      this.callingAPI = true;
      const params = {
        _start: this.page * 10 - 10,
        _limit: this.pageSize,
        _q: searchText,
      };
      deviceServices
        .list(params)
        .then((response) => {
          this.tableData = response;
          this.callingAPI = false;
        })
        .catch(() => {
          this.callingAPI = false;
        });
    },

    handleUpdateDevice(row) {
      this.selectedDevice = row;
      this.visibleUpdate = true;
    },

    handleChangeStatus(scope) {
      if (scope.row.status) {
        scope.row.status = false;
      } else {
        scope.row.status = true;
      }
      this.$confirm(
        `Chắc chắn muốn ${
          scope.row.status ? "TẮT" : "BẬT"
        } máy chấm công. Tiếp tục?`,
        "Cảnh báo",
        {
          confirmButtonText: "Xác nhận",
          cancelButtonText: "Hủy",
          type: "warning",
        }
      )
        .then(() => {
          const data = {
            status: !scope.row.status,
          };
          this.callingAPI = true;
          deviceServices
            .update(data, scope.row.id)
            .then(() => {
              this.$notify.success({
                title: "Thông báo",
                message: scope.row.status
                  ? "Tắt máy chấm công thành công"
                  : "Bật máy chấm công thành công",
              });
              scope.row.status = !scope.row.status;
              this.callingAPI = false;
            })
            .catch(() => {
              this.callingAPI = false;
            });
        })
        .catch(() => {
          if (scope.row.status) {
            scope.row.status = true;
          } else {
            scope.row.status = false;
          }
        });
    },

    async handleRemoveDevice(row) {
      this.$confirm("Chắc chắn muốn xóa máy chấm công. Tiếp tục?", "Cảnh báo", {
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Hủy",
        type: "warning",
      })
        .then(() => {
          this.callingAPI = true;
          deviceServices.remove(row.id).then(async () => {
            await this.loadData();
            this.$notify.success({
              title: "Thông báo",
              message: "Xóa máy chấm công thành công.",
            });
          });
        })
        .catch(() => {
          this.callingAPI = false;
        });
    },

    handleSizeChange(size) {
      this.pageSize = size;
      this.loadData();
    },

    handlePageChange(page) {
      this.page = page;
      this.loadData();
    },
  },
};
</script>

<style lang="scss" scoped></style>
