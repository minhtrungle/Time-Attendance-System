import request from "@/utils/request";
import ENDPOINT from "@/config/endpoint";

function list(params) {
  return request({
    url: `${ENDPOINT.EMPLOYEES}`,
    method: "get",
    params,
  });
}

function count() {
  return request({
    url: `${ENDPOINT.EMPLOYEES}/count`,
    method: "get",
  });
}

function create(data) {
  return request({
    url: ENDPOINT.EMPLOYEES,
    method: "post",
    data,
  });
}

function update(data, id) {
  return request({
    url: `${ENDPOINT.EMPLOYEES}/${id}`,
    method: "put",
    data,
  });
}

function remove(id) {
  return request({
    url: `${ENDPOINT.EMPLOYEES}/${id}`,
    method: "delete",
  });
}

export default {
  count,
  list,
  create,
  update,
  remove,
};
