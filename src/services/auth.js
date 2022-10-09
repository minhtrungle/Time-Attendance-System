import request from "@/utils/request";
import ENDPOINT from "@/config/endpoint";
import Cookies from "js-cookie";

function login(data) {
  return request({
    url: `${ENDPOINT.AUTH}/local`,
    method: "post",
    data,
  });
}

function changePassword(data) {
  return request({
    url: `${ENDPOINT.AUTH}/reset-password`,
    method: "post",
    data,
  });
}

function updateLoginInfo(data) {
  Cookies.set("login_info", JSON.stringify(data));
}

function loginInfo() {
  try {
    return JSON.parse(Cookies.get("login_info"));
  } catch (_) {
    return null;
  }
}

function logout() {
  Cookies.remove("login_info");
}

export default {
  login,
  changePassword,
  updateLoginInfo,
  loginInfo,
  logout,
};
