import request from "@/utils/request";
import ENDPOINT from "@/config/endpoint";

function list(params) {
  return request({
    url: ENDPOINT.TIMEKEEPING,
    method: "get",
    params,
  });
}

function count() {
  return request({
    url: `${ENDPOINT.TIMEKEEPING}/count`,
    method: "get",
  });
}

function create(data) {
  return request({
    url: ENDPOINT.TIMEKEEPING,
    method: "post",
    data,
  });
}

function update(data, id) {
  return request({
    url: `${ENDPOINT.TIMEKEEPING}/${id}`,
    method: "put",
    data,
  });
}

function remove(id) {
  return request({
    url: `${ENDPOINT.TIMEKEEPING}/${id}`,
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
