import { 
    postLoginRequest, 
    postLogoutRequest, 
    postTestToken, 
    postUserPwChange, 
    postUserChange, 
    postUserList, 
    postUserData,
    postUserListAdd, 
    postUserListGet,
    postUserListGetChange,
    postUserListGetPwReset,
    postUserListGetDelete,
} from "./authRequest.js";

export const apiPostLoginRequest = postLoginRequest;
export const apiPostTestToken = postTestToken;
export const apiPostUserPwChange = postUserPwChange;
export const apiPostUserChange = postUserChange;
export const apiPostUserList = postUserList;
export const apiPostUserData = postUserData;
export const apiPostLogoutRequest = postLogoutRequest;
export const apiPostUserListAdd = postUserListAdd;
export const apiPostUserListGet = postUserListGet;
export const apiPostUserListGetChange = postUserListGetChange;
export const apiPostUserListGetPwReset = postUserListGetPwReset;
export const apiPostUserListGetDelete = postUserListGetDelete;
