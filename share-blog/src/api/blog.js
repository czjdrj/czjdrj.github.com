/**
 * 管理博客文章相关的接口封装
 */

import request from '@/helpers/request.js';

const URL = {
    GET_LIST: '/blog',
    GET_DETAIL: '/blog/:blogId',
    CREATE: '/blog',
    UPDATE: '/blog/:blogId',
    DELETE: '/blog/:blogId'
}

export default {
    getBlogs: function (options) {
        options = options || {};
        options.page = options.page || 1;
        options.userId = options.userId || '';
        options.atIndex = options.atIndex || '';
        return request(URL.GET_LIST, 'GET', options);
    },
    getIndexBlogs: function (options) {
        options = options || {};
        options.page = options.page || 1;
        options.atIndex = true;
        return this.getBlogs(options);
    },
    getBlogsByUserId: function (id, options) {
        if (!id) return false;
        options = options || {};
        options.page = options.page || 1;
        options.userId = id;
        options.atIndex = options.atIndex || '';
        return this.getBlogs(options);
    },
    getDetail: function (options) {
        options = options || {};
        options.blogId = options.blogId;
        if (!options.blogId) return false;
        return request(URL.GET_DETAIL.replace(':blogId', options.blogId), 'GET');
    },
    createBlog: function (options) {
        options = options || {};
        options.title = options.title || '';
        options.content = options.content || '';
        options.description = options.description || '';
        options.atIndex = options.atIndex || 'true';
        return request(URL.CREATE, 'POST', options);
    },
    updateBlog: function (options1, options2) {
        options1 = options1 || {};
        options1.blogId = options1.blogId;
        options2 = options2 || {};
        options2.title = options2.title;
        options2.content = options2.content;
        options2.description = options2.description;
        options2.atIndex = options2.atIndex;
        return request(URL.UPDATE.replace(':blogId', options1.blogId), 'PATCH', options2);
    },
    deleteBlog: function (options) {
        options = options || {};
        options.blogId = options.blogId;
        return request(URL.DELETE.replace(':blogId', options.blogId), 'DELETE');
    }
}