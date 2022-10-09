<template>
  <el-table :data="data">
    <el-table-column type="index" label="STT" width="50" />
    <el-table-column prop="code" label="Mã nhân viên" width="120">
      <template slot-scope="scope">
        {{ scope.row.code }}
      </template>
    </el-table-column>
    <el-table-column prop="name" label="Tên nhân viên" width="170">
      <template slot-scope="scope">
        {{ scope.row.full_name }}
      </template>
    </el-table-column>
    <el-table-column :label="`Tháng ${selectedMonth + 1}`">
      <el-table-column
        v-for="(item, index) in listDay"
        :key="`${item.id ? item.id : Math.random()}`"
        :label="`${index + 1}`"
        min-width="125"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="[0, 6].includes(parseDayOfWeek(item))"></span>
          <div v-else-if="scope.row.timekeepings[index].length">
            <div v-if="!scope.row.part_time">
              <div
                v-for="(timekeeping, i) in scope.row.timekeepings[index]"
                :key="timekeeping.id"
              >
                <el-tag
                  class="mb-1"
                  size="small"
                  v-if="
                    i === 0 || i === scope.row.timekeepings[index].length - 1
                  "
                  :type="
                    checkinFullTime(
                      timekeeping.checkin.time,
                      scope.row.timekeepings[index],
                      i
                    )
                  "
                >
                  {{ timekeeping.checkin.time }}
                </el-tag>
              </div>
            </div>
            <div v-else>
              <el-row
                type="flex"
                align="middle"
                class="mb-3"
                v-for="shiftUser in parseShiftOfDay(scope.row.shiftUsers, item)"
                :key="shiftUser.id"
              >
                <div class="mr-2">{{ shiftUser.shift.summary }}:</div>
                <div>
                  <div
                    v-for="(timekeeping, i) in scope.row.timekeepings[index]"
                    :key="timekeeping.id"
                  >
                    <el-tag
                      class="mb-1"
                      size="small"
                      v-if="
                        i === 0 ||
                        i === scope.row.timekeepings[index].length - 1
                      "
                      :type="
                        checkinPartTime(
                          shiftUser,
                          timekeeping.checkin.time,
                          scope.row.timekeepings[index],
                          i
                        )
                      "
                    >
                      {{ timekeeping.checkin.time }}
                    </el-tag>
                  </div>
                </div>
              </el-row>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table-column>
  </el-table>
</template>

<script>
import dayjs from "dayjs";
import { getDaysInMonth } from "@/utils/filters";
export default {
  name: "ListTimekeepingReport",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    listDay: {
      type: Array,
      default: () => [],
    },
    selectedMonth: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {};
  },
  computed: {
    currentDay() {
      return dayjs().format("YYYY-MM-DD");
    },
  },
  methods: {
    getDaysInMonth,

    parseDayOfWeek(date) {
      const newDate = new Date(date);
      const typeDate = newDate.getDay();
      return typeDate;
    },

    parseShiftOfDay(shiftUsers, date) {
      const data = shiftUsers.filter((s) =>
        s.work_dates
          .map((d) => dayjs(d).format("YYYY-MM-DD"))
          .includes(dayjs(date).format("YYYY-MM-DD"))
      );
      return data;
    },

    checkinFullTime(time, timekeepings, index) {
      if (index === 0 && timekeepings.length > 1 && time > "08:30:00") {
        return "warning";
      }
      if (index === timekeepings.length - 1 && time < "17:30:00") {
        return "warning";
      }
      return "success";
    },

    checkinPartTime(shiftUser, time, timekeepings, index) {
      const startedAt = shiftUser.shift.started_at.split(".000")[0];
      const endedAt = shiftUser.shift.ended_at.split(".000")[0];
      if (index === 0 && timekeepings.length > 1 && time > startedAt) {
        return "warning";
      }
      if (index === timekeepings.length - 1 && time < endedAt) {
        return "warning";
      }
      return "success";
    },
  },
};
</script>

<style lang="scss" scoped></style>
