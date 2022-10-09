import router from "./router";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import authServices from "@/services/auth";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

// get admin info + notifycation + refresh token

router.beforeEach(async (to, from, next) => {
  window.scroll(0, 0);
  // start progress bar
  NProgress.start();
  // set page title
  if (
    to.meta.auth &&
    !authServices.loginInfo() &&
    to.name !== "Login" &&
    to.name !== "TimekeepingForm"
  ) {
    router.push("/login");
  } else {
    next();
  }
  NProgress.done();
});
