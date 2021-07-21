import { 
    apiPostLoginRequest, 
    apiPostLogoutRequest, 
    apiPostUserPwChange, 
    apiPostUserChange, 
    apiPostUserList, 
    apiPostUserData,
    apiPostUserListAdd,
    apiPostUserListGet,
    apiPostUserListGetChange,
    apiPostUserListGetPwReset,
    apiPostUserListGetDelete,
} from "../api";
// state
export const state = () => ({
    isLogin: false,
    name: "",
    number: "",
    username: "",
    value: "",
    admin: null,
    // ---------
    users:[],
    editItem: [],
    // ---------
    message:'clear',
    err_message: 'clear',
});

// actions
export const actions = {
    handIsLogin({ commit }, bool){
        commit("handIsLogin", bool);
    },
    handClearMsg({ commit }, msg){
        commit("handClearMsg", msg);
    },
    handClearErrMsg({ commit }, errmsg){
        commit("handClearErrMsg", errmsg);
    },
    LogoutClear({ commit }){
        commit("LogoutClear");
    },
    async handAuth({ commit }, payload){
        const { account, password } = payload;
        try {
            const res = await apiPostLoginRequest({ account, password });
            commit('LoginAuth',res);
        } catch (error) {
            console.log(error);
        }
    },
    async handDataChange({ commit }, payload){
        const { token, username, number, name } = payload;
        try {
            const res = await apiPostUserChange({ token, username, number, name });
            commit('ChangeData',res);
        } catch (error) {
            console.log(error);
        }
    },
    async handPwChange({ commit }, payload){
        const { token, old_pw, new_pw, new_pw_check } = payload;
        try {
            const res = await apiPostUserPwChange({ token, old_pw, new_pw, new_pw_check });
            commit('ChangePw',res);
        } catch (error) {
            console.log(error);
        }
    },
    async handUserList({ commit }, payload){
        const { token } = payload;
        try {
            const res = await apiPostUserList({ token });
            commit('UserData',res);
        } catch (error) {
            console.log(error);
        }
    },
    async handUserData({ commit }, payload){
        const { token } = payload;
        try {
            const res = await apiPostUserData({ token });
            commit('UserGetData',res);
        } catch (error) {
            console.log(error);
        }
    },
    async handUserListAdd({ commit }, payload){
        const { token, username, password, number, name, disable, admin } = payload;
        try {
            const res = await apiPostUserListAdd({ token, username, password, number, name, disable, admin });
            commit('UserListAdd',res);
        } catch (error) {
            console.log(error);
        }
    },
    async handUserListGet({ commit }, payload){
        const { token, id } = payload;
        try {
            const res = await apiPostUserListGet({ token, id });
            commit('UserListGet',res);
        } catch (error) {
            console.log(error);
        }
    },
    async handUserListGetChange({ commit }, payload){
        const { token, id, username, password, number, name, disable, admin } = payload;
        try {
            const res = await apiPostUserListGetChange({ token, id, username, password, number, name, disable, admin });
            commit('UserListGetChange',res);
        } catch (error) {
            console.log(error);
        }
    },
    async handUserListGetPwReset({ commit }, payload){
        const { token, id } = payload;
        try {
            const res = await apiPostUserListGetPwReset({ token, id });
            commit('UserListGetPwReset',res);
        } catch (error) {
            console.log(error);
        }
    },
    async handUserListDeleted({ commit }, payload){
        const { token, id } = payload;
        try {
            const res = await apiPostUserListGetDelete({ token, id });
            commit('UserListDeleted',res);
        } catch (error) {
            console.log(error);
        }
    },
    async Logout({ commit }, payload){
        const { token } = payload;
        try {
            const res = await apiPostLogoutRequest({ token });
            commit('Logout',res);
        } catch (error) {
            console.log(error);
        }
    },
};

// mutations
export const mutations = {
    LoginAuth(state, res){
        console.log(res.data);
        if(res.data.success == true){
            this.$cookies.set("auth", { token: res.data.datas[0].token });
            state.isLogin = true;
            state.name = res.data.datas[0].name; 
            state.number = res.data.datas[0].number; 
            state.username = res.data.datas[0].username; 
            state.value = res.data.datas[0].value;  
            state.admin = res.data.datas[0].admin;
            if (res.data.status == 201) {
                state.message = res.data.message;
            }
            this.$router.push('/dashboard'); 
        }
        else{
            console.log(res.data.message);
            if (res.data.status == 401) {
                state.err_message = res.data.message;
            }
        }
    },
    Logout(state, res){
        console.log(res.data);
        if(res.data.success == true){
            // state.isLogin = false;
            // state.name = ""; 
            // state.number = ""; 
            // state.username = ""; 
            // state.value = "";  
            // state.admin = null;
            if (res.data.status == 201) {
                state.message = res.data.message;
            }
            this.$router.push('/'); 
            // this.$cookies.removeAll();
        }
        else{
            if (res.data.status == 401) {
                state.err_message = res.data.message;
            }
        }
    },
    LogoutClear(state){
        state.isLogin = false;
        state.name = ""; 
        state.number = ""; 
        state.username = ""; 
        state.value = "";  
        state.admin = null;
        this.$cookies.removeAll();
    },
    ChangePw(state, res){
        console.log(res.data);
        if(res.data.success == true){
            console.log(res.data.message);
            if (res.data.status == 201) {
                state.message = res.data.message;
            }
        }
        else{
            if (res.data.status == 401) {
                state.err_message = res.data.message;
            }
        }
    },
    ChangeData(state, res){
        console.log(res.data);
        if(res.data.success == true){
            state.name = res.data.datas[0].name; 
            state.number = res.data.datas[0].number; 
            state.username = res.data.datas[0].username; 
            state.value = res.data.datas[0].value;
            if (res.data.status == 201) {
                state.message = res.data.message;
                console.log("msg change",state.message);
            }
        }
        else{
            if (res.data.status == 401) {
                state.err_message = res.data.message;
            }
        }
    },
    UserData(state, res){
        console.log("hello",res.data);
        if(res.data.success == true){
            console.log(res.data.datas[0].disable);
            for (let idx = 0; idx < res.data.datas.length; idx++) {
                if (res.data.datas[idx].disable == 0) {
                    res.data.datas[idx].disable = "啟用";
                } 
                else {
                    res.data.datas[idx].disable = "禁用";
                }
                if (res.data.datas[idx].admin == 0) {
                    res.data.datas[idx].admin = "一般員工";
                } 
                else {
                    res.data.datas[idx].admin = "管理員";
                }
            }
            state.users = res.data.datas;
            if (res.data.status == 201) {
                state.message = res.data.message;
            }
        }
        else{
            if (res.data.status == 401) {
                state.err_message = res.data.message;
            }
        }
    },
    UserGetData(state, res){
        console.log(res.data);
        if(res.data.success == true){
            state.name = res.data.datas[0].name; 
            state.number = res.data.datas[0].number; 
            state.username = res.data.datas[0].username; 
            state.value = res.data.datas[0].value;  
            if (res.data.status == 201) {
                state.message = res.data.message;
            }
        }
        else{
            if (res.data.status == 401) {
                state.err_message = res.data.message;
            }
        }
    },
    UserListAdd(state, res){
        console.log(res.data);
        if(res.data.success == true){
            // console.log("success",res.data);
            for (let idx = 0; idx < res.data.datas.length; idx++) {
                if (res.data.datas[idx].disable == 0) {
                    res.data.datas[idx].disable = "啟用";
                } 
                else {
                    res.data.datas[idx].disable = "禁用";
                }
                if (res.data.datas[idx].admin == 0) {
                    res.data.datas[idx].admin = "一般員工";
                } 
                else {
                    res.data.datas[idx].admin = "管理員";
                }
            }
            state.users = res.data.datas
            if (res.data.status == 201) {
                state.message = res.data.message;
            }
        }
        else{
            if (res.data.status == 401) {
                state.err_message = res.data.message;
                console.log(state.err_message);
            }
        }
    },
    UserListGet(state, res){
        if(res.data.success == true){
            // console.log("success",res.data);
            state.editItem = res.data.datas[0]
            if (res.data.status == 201) {
                state.message = res.data.message;
            }
        }
        else{
            if (res.data.status == 401) {
                state.err_message = res.data.message;
            }
        }
    },
    UserListGetChange(state, res){
        if(res.data.success == true){
            console.log("success",res.data);
            for (let idx = 0; idx < res.data.datas.length; idx++) {
                if (res.data.datas[idx].disable == 0) {
                    res.data.datas[idx].disable = "啟用";
                } 
                else {
                    res.data.datas[idx].disable = "禁用";
                }
                if (res.data.datas[idx].admin == 0) {
                    res.data.datas[idx].admin = "一般員工";
                } 
                else {
                    res.data.datas[idx].admin = "管理員";
                }
            }
            state.users = res.data.datas
            if (res.data.status == 201) {
                state.message = res.data.message;
            }
        }
        else{
            if (res.data.status == 401) {
                state.err_message = res.data.message;
            }
        }
    },
    UserListGetPwReset(state, res){
        if(res.data.success == true){
            console.log("success",res.data);
            // state.users = res.data.datas
            if (res.data.status == 201) {
                state.message = res.data.message;
            }
        }
        else{
            if (res.data.status == 401) {
                state.err_message = res.data.message;
            }
        }
    },
    UserListDeleted(state, res){
        if(res.data.success == true){
            // console.log("success",res.data);
            for (let idx = 0; idx < res.data.datas.length; idx++) {
                if (res.data.datas[idx].disable == 0) {
                    res.data.datas[idx].disable = "啟用";
                } 
                else {
                    res.data.datas[idx].disable = "禁用";
                }
                if (res.data.datas[idx].admin == 0) {
                    res.data.datas[idx].admin = "一般員工";
                } 
                else {
                    res.data.datas[idx].admin = "管理員";
                }
            }
            state.users = res.data.datas
            if (res.data.status == 201) {
                state.message = res.data.message;
            }
        }
        else{
            if (res.data.status == 401) {
                state.err_message = res.data.message;
            }
        }
    },
    handIsLogin(state, bool, username, name, number){
        state.isLogin = bool;
        state.username = username;
        state.name = name;
        state.number = number;
    },
    handClearMsg(state, msg){
        state.message = msg;
    },
    handClearErrMsg(state, errmsg){
        state.err_message = errmsg;
    },
};

// getters
export const getters = {
    loginState: state => state.isLogin,
    loginName: state => state.name,
    loginNumber: state => state.number,
    loginUsername: state => state.username,
    loginValue: state => state.value,
    loginAdmin: state => state.admin,
    UserList: state => state.users,
    EditItem: state => state.editItem,
    Message: state => state.message,
    ErrMessage: state => state.err_message,
};
