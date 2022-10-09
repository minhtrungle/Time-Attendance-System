import request from "@/utils/request";
import ENDPOINT from "@/config/endpoint";

function list(params) {
  return request({
    url: ENDPOINT.DEVICES,
    method: "get",
    params,
  });
}

function count() {
  return request({
    url: `${ENDPOINT.DEVICES}/count`,
    method: "get",
  });
}

function create(data) {
  return request({
    url: ENDPOINT.DEVICES,
    method: "post",
    data,
  });
}

function update(data, id) {
  return request({
    url: `${ENDPOINT.DEVICES}/${id}`,
    method: "put",
    data,
  });
}

function remove(id) {
  return request({
    url: `${ENDPOINT.DEVICES}/${id}`,
    method: "delete",
  });
}

export default {
  list,
  count,
  create,
  update,
  remove,
};
