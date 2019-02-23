/**
 * 管理博客相关的共享数据、共享方法，可是根本不需要共享博客的相关方法到其他组件，所以根本没有写！！！
 * 下面都是一些测试vuex的代码，无视之~
 */

// import axios from 'axios';

const state = {
    // name: 'Puzzle'
}

const mutations = {
    // setName: function (state, newName) {
    //     state.name = newName;
    // }
}

const getters = {
    // name: function (state) {
    //     return state.name;
    // }
}

const actions = {//仅仅返回Promise对象 不能用回调函数
    // chengeName: function (store, { username, password }) {
    //     return new Promise(function(resolve, reject){
    //         axios({
    //             method: "post",
    //             url: 'http://blog-server.hunger-valley.com//auth/login',
    //             headers: {
    //                 "Content-Type": "application/json;charset=UTF-8"//'application/x-www-form-urlencoded'
    //             },
    //             data: { username, password }
    //         }).then(function (res) {
    //             if (res.data.status === 'ok') {
    //                 console.log(res.data);
    //                 store.commit('setName', res.data.data.username);
    //                 resolve(res.data);
    //             } else {
    //                 console.log(res.data.msg);
    //                 reject(res.data);
    //             }
    //         }).catch(function (err) {
    //             console.log(err);
    //         });
    //     });
    // }
}

export default {
    state: state,
    mutations: mutations,
    getters: getters,
    actions: actions
}