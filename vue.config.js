"use strict";
const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: "/",
  configureWebpack: {
    name: "Vue Base admin",
    resolve: {
      alias: {
        "@": resolve("src"),
      },
    },
  },
};
