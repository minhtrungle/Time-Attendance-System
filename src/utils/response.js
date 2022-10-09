import router from "@/router";

export function handleResponseErrorMessage(err) {
  if (err.response === undefined) {
    return err;
  } else if (err.response.status === 404) {
    router.push({ name: "PageNotFound" });
  } else if (err.response.status === 500) {
    router.push({ name: "ServerError" });
  } else if (err.response.status === 403) {
    router.push({ name: "Login" });
  } else {
    return err;
  }
}
