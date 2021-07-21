import axios from "axios";

const authRequest = axios.create({
  baseURL: "localhost:3000"
});

export const postLoginRequest = data => authRequest.post("/login", data);

export const postLogoutRequest = data => authRequest.post("/logout", data);

export const postUserData = data => authRequest.post("/users/data", data);

export const postUserPwChange = data => authRequest.post("/users/data/pw_change", data);

export const postUserChange = data => authRequest.post("/users/data/change", data);

export const postUserList = data => authRequest.post("/users/list", data);

export const postUserListAdd = data => authRequest.post("/users/list/add", data);

export const postUserListGet = data => authRequest.post("/users/list/get", data);

export const postUserListGetChange = data => authRequest.post("/users/list/get/change", data);

export const postUserListGetPwReset = data => authRequest.post("/users/list/get/pw_reset", data);

export const postUserListGetDelete = data => authRequest.post("/users/list/get/delete", data);



export const postTestToken = (token) => {
  authRequest.defaults.headers.common['Authorization'] = token;
  return authRequest.post("/testToken")
};
