/**
 * 管理用户相关的接口封装
 */

import request from '@/helpers/request.js';

const URL = {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    GET_INFO: '/auth'
}

export default {
    register: function(options){
        options = options || {};
        options.username = options.username;
        options.password = options.password;
        return request(URL.REGISTER, 'POST', options);
    },
    login: function (options) {
        options = options || {};
        options.username = options.username;
        options.password = options.password;
        return request(URL.LOGIN, 'POST', options);
    },
    logout: function () {
        return request(URL.LOGOUT, 'GET');
    },
    getInfo: function () {
        return request(URL.GET_INFO, 'GET');
    }
}