import request from "@/utils/request";
import ENDPOINT from "@/config/endpoint";

function list() {
  return request({
    url: ENDPOINT.SHIFT_USERS,
    method: "get",
  });
}

function create(data) {
  return request({
    url: ENDPOINT.SHIFT_USERS,
    method: "post",
    data,
  });
}

function update(data, id) {
  return request({
    url: `${ENDPOINT.SHIFT_USERS}/${id}`,
    method: "put",
    data,
  });
}

function remove(id) {
  return request({
    url: `${ENDPOINT.SHIFT_USERS}/${id}`,
    method: "delete",
  });
}

export default {
  list,
  create,
  update,
  remove,
};
