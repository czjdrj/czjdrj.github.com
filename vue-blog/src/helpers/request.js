/**
 * 封装axios，引入element-ui的message做提示
 */

import axios from 'axios';
import { Message, MessageBox } from 'element-ui';

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.baseURL = 'https://blog-server.hunger-valley.com';
axios.defaults.withCredentials = true;//允许跨域

export default function request(url, type = 'GET', data = {}) {
    return new Promise((resolve, reject) => {
        let option = {
            url: url,
            method: type
        }

        if (type.toLowerCase() === 'get') {
            option.params = data;
        } else {
            option.data = data;
        }

        // MessageBox.alert(axios.defaults.baseURL, 'baseURL', {
        //     confirmButtonText: '确定',
        // });

        axios(option).then((res) => {
            if (res.data.status === 'ok') {
                console.log(res.data);
                resolve(res.data);
            } else {
                Message.error(res.data.msg);
                reject(res.data);
            }
        }).catch((err) => {
            Message.error('网络异常');
            reject({
                msg: '网络异常'
            })
        })
    });
}
