import Vue from "vue";
import VueRouter from "vue-router";

// Layout
import Layout from "@/layout";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index"),
        name: "Dashboard",
        meta: {
          title: "Trang chủ",
          icon: "el-icon-s-home",
          affix: true,
          auth: true,
        },
      },
    ],
  },
  {
    path: "/employee-manager",
    component: Layout,
    children: [
      {
        path: "",
        component: () => import("@/views/employee-manager/index"),
        name: "StaffManager",
        meta: {
          title: "Nhân sự",
          icon: "el-icon-s-custom",
          affix: false,
          auth: true,
        },
      },
    ],
  },
  {
    path: "/timekeeping-report",
    component: Layout,
    children: [
      {
        path: "",
        component: () => import("@/views/timekeeping-report/index"),
        name: "TimekeepingReport",
        meta: {
          title: "Chấm công",
          icon: "el-icon-s-claim",
          affix: false,
          auth: true,
        },
      },
    ],
  },
  {
    path: "/shift-manager",
    component: Layout,
    children: [
      {
        path: "",
        component: () => import("@/views/shift-manager/index"),
        name: "ShiftManager",
        meta: {
          title: "Ca làm việc",
          icon: "el-icon-s-cooperation",
          affix: false,
          auth: true,
        },
      },
    ],
  },
  {
    path: "/history-in-out",
    component: Layout,
    children: [
      {
        path: "",
        component: () => import("@/views/history-in-out/index"),
        name: "HistoriesInOut",
        meta: {
          title: "Lịch sử vào ra",
          icon: "el-icon-s-order",
          affix: false,
          auth: true,
        },
      },
    ],
  },
  {
    path: "/tardiness-report",
    component: Layout,
    children: [
      {
        path: "",
        component: () => import("@/views/tardiness-report/index"),
        name: "TardinessReport",
        meta: {
          title: "Vào trễ, ra sớm",
          icon: "el-icon-s-release",
          affix: true,
          auth: true,
        },
      },
    ],
  },
  {
    path: "/device-manager",
    component: Layout,
    children: [
      {
        path: "",
        component: () => import("@/views/device-manager/index"),
        name: "DeviceManager",
        meta: {
          title: "Máy chấm công",
          icon: "el-icon-s-platform",
          affix: false,
          auth: true,
        },
      },
    ],
  },
  // AUTH PAGE
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
    name: "Login",
    meta: { auth: false, title: "Đăng nhập" },
  },
  {
    path: "/timekeeping-form",
    component: () => import("@/views/timekeeping/index"),
    hidden: true,
    name: "TimekeepingForm",
    meta: { auth: false, title: "Form chấm công" },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
//
export default router;
