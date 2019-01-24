/**
 * 管理用户相关的共享数据、共享方法
 */

import auth from '@/api/auth.js';

const state = {
    user: null,//用户信息
    isLogin: false//登录状态
}

const mutations = {
    setUser: function (state, respone) {//设置用户信息
        state.user = respone;
    },
    setLogin: function (state, respone) {//设置登录状态
        state.isLogin = respone;
    }
}

const getters = {
    user: function(state){//获取用户信息
        return state.user;
    },
    isLogin: function(state){//获取登录状态
        return state.isLogin;
    }
}

const actions = {//actions仅仅返回Promise对象 不能用回调函数
    login: function (store, { username, password }) {//异步登录后 commit定义好的mutations 改变store内的信息
        return auth.login({ username, password }).then(function (res) {
            store.commit('setUser', res.data);
            store.commit('setLogin', true);
        });
    },
    register: function (store, { username, password }) {
        return auth.register({ username, password }).then(function (res) {
            store.commit('setUser', res.data);
            store.commit('setLogin', true);
        });
    },
    logout: function(store){
        return auth.logout().then(function (res) {
            store.commit('setUser', null);
            store.commit('setLogin', false);
        });
    },
    checkLogin: async function(store){
        //如果 登录状态中 返回
        if(store.state.isLogin) return true;
        //否侧 等待查看用户状态的请求
        let res = await auth.getInfo();
        //提交此时的登录状态
        store.commit('setLogin', res.isLogin);
        //如果 登出状态中 返回
        if(!res.isLogin) return false;
        //否则 提交用户信息
        store.commit('setUser', res.data);
        //返回
        return true;
    }
}

export default {
    state: state,
    mutations: mutations,
    getters: getters,
    actions: actions
}