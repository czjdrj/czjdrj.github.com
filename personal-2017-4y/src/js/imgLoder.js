/**
* @param {array} imgList 要加载的图片地址列表，['aa/asd.png','aa/xxx.png']
* @param {function} callback 每成功加载一个图片之后的回调，并传入“已加载的图片总数/要加载的图片总数”表示进度
* @param {number} timeout 每个图片加载的超时时间，默认为5s
*/

//图片预加载
var imgLoader = function (imgList, callback, timeout) {

    var isArray = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    timeout = timeout || 5000;
    imgList = isArray(imgList) && imgList || [];
    callback = typeof (callback) === 'function' && callback;

    var total = imgList.length,
        loaded = 0,
        imgages = [],
        _on = function () {
            loaded < total && (++loaded, callback && callback(loaded / total));
        };

    if (!total) {
        return callback && callback(1);
    }

    for (var i = 0; i < total; i++) {
        imgages[i] = new Image();
        imgages[i].onload = imgages[i].onerror = _on;
        imgages[i].src = imgList[i];
    }
	/**
	* 如果timeout * total时间范围内，仍有图片未加载出来（判断条件是loaded < total），通知外部环境所有图片均已加载
	* 目的是避免用户等待时间过长
	*/
    setTimeout(function () {
        loaded < total && (loaded = total, callback && callback(loaded / total));
    }, timeout * total);
}

//真实进度-如果浏览器有过一次缓存后就没有进度指示
//图片地址数组
var imgList = [
    //page1
    "https://testbk1-1255560305.cos.ap-guangzhou.myqcloud.com/personal/mobile_bg.jpg",
    "https://testbk1-1255560305.cos.ap-guangzhou.myqcloud.com/personal/head_pic.png",
    "https://testbk1-1255560305.cos.ap-guangzhou.myqcloud.com/personal/head_pic_2.png",
    "https://testbk1-1255560305.cos.ap-guangzhou.myqcloud.com/personal/qr_code.png",
    "https://testbk1-1255560305.cos.ap-guangzhou.myqcloud.com/personal/scroll_tips.png",
    //page2
    "https://testbk1-1255560305.cos.ap-guangzhou.myqcloud.com/personal/html5_1.png",
    "https://testbk1-1255560305.cos.ap-guangzhou.myqcloud.com/personal/javascript_2.png",
    "https://testbk1-1255560305.cos.ap-guangzhou.myqcloud.com/personal/jquery_3.png",
    "https://testbk1-1255560305.cos.ap-guangzhou.myqcloud.com/personal/nodejs_4.png",
    "https://testbk1-1255560305.cos.ap-guangzhou.myqcloud.com/personal/vuejs_5.png",
    "https://testbk1-1255560305.cos.ap-guangzhou.myqcloud.com/personal/react_6.png",
    //page3
    "https://testbk1-1255560305.cos.ap-guangzhou.myqcloud.com/personal/picture_arrow_left.png",
    "https://testbk1-1255560305.cos.ap-guangzhou.myqcloud.com/personal/picture_arrow_right.png",
    //page4
    "https://testbk1-1255560305.cos.ap-guangzhou.myqcloud.com/personal/mobile.png",
    "https://testbk1-1255560305.cos.ap-guangzhou.myqcloud.com/personal/wechat.png",
    "https://testbk1-1255560305.cos.ap-guangzhou.myqcloud.com/personal/qq.png",
    "https://testbk1-1255560305.cos.ap-guangzhou.myqcloud.com/personal/email.png",
    "https://testbk1-1255560305.cos.ap-guangzhou.myqcloud.com/personal/home.png",
    "https://testbk1-1255560305.cos.ap-guangzhou.myqcloud.com/personal/return.png"
    //web side test
    // "https://raw.githubusercontent.com/czjdrj/surge-test/master/images/%E6%88%AA%E5%9B%BE1.png",
    // "https://raw.githubusercontent.com/czjdrj/surge-test/master/images/%E6%88%AA%E5%9B%BE2.png",
    // "https://raw.githubusercontent.com/czjdrj/surge-test/master/images/%E6%88%AA%E5%9B%BE3.png",
    // "https://raw.githubusercontent.com/chenyaoyi88/myapp-admin/master/src/assets/images/avantar1.jpg",
    // "https://raw.githubusercontent.com/chenyaoyi88/myapp-admin/master/src/assets/images/avantar_default.png"
];
