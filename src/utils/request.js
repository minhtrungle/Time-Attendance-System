import axios from "axios";
// import store from '@/store'
import { handleResponseErrorMessage } from "./response";
import authServices from "@/services/auth";

// create an axios instance
const service = axios.create({
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 60000, // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    config.headers["Content-Type"] = "application/json";
    if (authServices.loginInfo()) {
      config.headers["Authorization"] = `Bearer ${
        authServices.loginInfo() ? authServices.loginInfo().jwt : ""
      }`;
    }
    return config;
  },
  (error) => {
    // do something with request error
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data;
    // Add logic to check response here
    // For example: logout when account is logged on different device, backend can send custom code here
    return res;
  },
  (error) => {
    return Promise.reject(handleResponseErrorMessage(error));
  }
);

export default service;
