/**
* @param {string} id:id 【必填】
* @param {number} progress:进度 0-100 【选填】
* @param {number} w:宽度 单位rem 【选填】
* @param {number} h:高度 单位rem 【选填】
* @param {string} inside:内圈颜色 【选填】
* @param {string} outside:外圈颜色 【选填】
* @param {string} fontColor:字体颜色 【选填】
* @param {boolean} isAni:true/false 是否需要动画 【必填】
* @param {number} dur:动画时长 单位秒 【选填】
* @param {number} delay:动画延时 单位秒 【选填】
*/
//圆形进度条
var cc = function(id,options){
	options = options || {};
	options.progress = options.progress <= 100 ? options.progress : 100;
	options.w = options.w || 2;
	options.h = options.h || 2;
	options.inside = options.inside || "#ccc";
	options.outside = options.outside || "#333";
	options.fontColor = options.fontColor || "#333";
	options.isAni = options.isAni;

	//选择器
	var sel = function(dom){
		return document.querySelector(dom);
	}

	var selAll = function(doms){
		return document.querySelectorAll(doms);
	}

	//取样式
    var getStyle = function(dom,name){
        return Math.ceil(getComputedStyle(dom,false)[name].split("px")[0]);
    }

	//百分比
	var percent = function(full,n){
		if(n <= 95){
			return full / 100 * n;
		}else{
			//由于圆角的关系，进度条>90并且差不多100时，会被圆角填满到100，造成错觉，所以要适当减去一点百分比
			return (full / 100 * n) - 4;
		}
	}

	//数字运动
	var numberRun = function(obj,target,time){
		if(time === 0){
			return obj.textContent = target + "%";
		}

		var start = 0,
			dis = target - start,
			count = Math.floor(time / 30),
			n = 0;
		
		clearInterval(obj.timer);
		obj.timer = setInterval(function(){
			n++;
			//去掉小数点、加上百分比
			obj.textContent = (start + n * (dis / count)).toFixed(0) + "%";
			if(n == count){
				clearInterval(obj.timer);
			}
		},30);
	}

	//rem
	var fz = document.documentElement.style.fontSize.split("px")[0];

	//创建
	var createDom = function(domWrap){
		var svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
		svg.id = id + "-svg";
		svg.style["width"] = "100%";
		svg.style["height"] = "100%";
		svg.style["-webkit-transform"] = "rotateZ(-90deg)";//ios下旋转circle元素会失效，要把外部容器逆时针旋转90°，确保起始位置在正上方
		svg.innerHTML = '<circle fill="none" stroke-linecap="round" stroke-width="'+(0.2*fz)+'" stroke="'+options.inside+'" class="'+id+'-cc '+id+'-c1"></circle>\
						<circle fill="none" stroke-linecap="round" stroke-width="'+(0.2*fz)+'" stroke="'+options.outside+'" class="'+id+'-cc '+id+'-c2"></circle>';
		domWrap.appendChild(svg);

		var span = document.createElement("span");
		span.id = id + "-span";
		span.style["position"] = "absolute";
		span.style["left"] = "50%";
		span.style["top"] = "50%";
		span.style["fontSize"] = (options.w/4) + "rem";
		span.style["color"] = options.fontColor;
		span.style["-webkit-transform"] = "translate(-50%,-50%)";
		span.innerHTML = "0%";
		domWrap.appendChild(span);
	}

	//创建svg
	var wrap = sel("#"+id);

	wrap.style["position"] = "relative";
	wrap.style["width"] = options.w + "rem";
	wrap.style["height"] = options.h + "rem";

	if(!wrap.children.length){
		createDom(wrap);
	}else{
		wrap.removeChild(wrap.children[0]);
		wrap.removeChild(wrap.children[0]);
		createDom(wrap);
	}

	//dom
	var aCc = selAll("."+id+"-cc"),
		iC2 = sel("."+id+"-c2"),
		iSpan = sel("#"+id+"-span");

	//动态设置circle标签的位置
	var svgW = getStyle(wrap,"width"),
		svgH = getStyle(wrap,"height");

	var cx = svgW / 2,
		cy = svgH / 2,
		r = cx-10 || cy-10,
		aroundLong = 2 * Math.PI * r;//2 * π * r = 周长

	aCc.forEach(function(ele,index){
		ele.setAttribute("cx",cx);
		ele.setAttribute("cy",cy);
		ele.setAttribute("r",r);
	});

	//初始化进度 stroke-dasharray的实线=0，间隔=周长
	iC2.style["stroke-dasharray"] = "0," + aroundLong;
	iSpan.textContent = "0%";

	//动画原理：
	//stroke-dasharray样式是把一条实线切割成虚线，可传多个参数，依次为实线长度和间隔长度
	//0%时，stroke-dasharray的实线=0，间隔=周长
	//100%时，stroke-dasharray的实线=实际进度，间隔=周长-实际进度
	var initProgress = percent(aroundLong,options.progress);//进度
	var leaveProgress = aroundLong - percent(aroundLong,options.progress);//剩下的进度

	if(options.isAni){//是有需要动画
		options.dur = options.dur || 1;
		options.delay = options.delay || 0;

		//动态添加@keyframes，设定动态的stroke-dasharray动画
		var css = document.createElement("style");
		css.id = id + "-css";
		css.type = "text/css";
		css.textContent = '@-webkit-keyframes '+id+'-load{\n0%{stroke-dasharray:0,'+aroundLong+';}\n100%{stroke-dasharray:'+initProgress+','+leaveProgress+';}}\n.'+id+'-load{\n-webkit-animation:'+id+'-load '+options.dur+'s '+options.delay+'s ease forwards;\n}';

		var iHead = sel("head");

		//添加css动画类
		if(!sel("#"+id+"-css")){
			iHead.appendChild(css);
		}
		iC2.classList.add(id+"-load");

		//和数字运动的时间同步
		setTimeout(function(){
			numberRun(iSpan,options.progress,options.dur *1000);
		},options.delay*1000);

		//动画完毕清除css动画类
		iC2.addEventListener("webkitAnimationEnd",function(){
			iHead.removeChild(sel("#"+id+"-css"));
			this.classList.remove(id+"-load");
			this.style["stroke-dasharray"] = initProgress+","+leaveProgress;
		},false);
	}else{
		options.dur = 0;
		iC2.style["stroke-dasharray"] = initProgress+","+leaveProgress;
		numberRun(iSpan,options.progress,options.dur);
	}
}

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
	callback = typeof(callback) === 'function' && callback;

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

//选择器
var sel = function(dom){
	return document.querySelector(dom);
}

var selAll = function(doms){
	return document.querySelectorAll(doms);
}

//取样式
var getStyle = function(dom,name){
    return Math.ceil(getComputedStyle(dom,false)[name].split("px")[0]);
}

//动态添加负margin
var fixedCenter = function(dom){
    var bdTop = getStyle(dom,"border-top-width"),
    	bdBottom = getStyle(dom,"border-bottom-width"),
    	bdLeft = getStyle(dom,"border-left-width"),
    	bdRight = getStyle(dom,"border-right-width"),
    	pdTop = getStyle(dom,"padding-top"),
    	pdBottom = getStyle(dom,"padding-bottom"),
    	pdLeft = getStyle(dom,"padding-left"),
    	pdRight = getStyle(dom,"padding-right"),
    	width = getStyle(dom,"width"),
    	height = getStyle(dom,"height");

    var halfW = (bdLeft + bdRight + pdLeft + pdRight + width) / 2,
    	halfH = (bdTop + bdBottom + pdTop + pdBottom + height) / 2;

    dom.style.marginLeft = -halfW + "PX";
    dom.style.marginTop = -halfH + "PX";
}

//dom
var oH5 = sel("#h5"),
	oPage1Pic = sel("#page1Pic"),
	oPage1Qrcode = sel("#page1Qrcode"),
	aCenter = selAll(".center"),
	oLogo = sel("#logo"),
	oReturnTop = sel("#returnTop"),
	aMsgBox = selAll(".page3-msg");

//头像点击逻辑
var rotatePic = function(str){
	if(typeof str != "string") return;

	if(str == "turn"){
		console.log("turn");
		oPage1Pic.classList.add("turn");
		oPage1Pic.classList.remove("return");
		oPage1Qrcode.classList.add("page1-qrcode-ani-in");
		oPage1Qrcode.classList.remove("page1-qrcode-ani-out");
		oPage1Qrcode.style.zIndex = "10004";
	}
	if(str == "return"){
		console.log("return");
		oPage1Pic.classList.add("return");
		oPage1Pic.classList.remove("turn");
		oPage1Qrcode.classList.add("page1-qrcode-ani-out");
		oPage1Qrcode.classList.remove("page1-qrcode-ani-in");
		// oPage1Qrcode.style.zIndex = "-1";//这个要在动画完结后再做
	}
	if(str == "reset"){
		console.log("reset turn or return~");
		oPage1Pic.classList.remove("turn");
		oPage1Pic.classList.remove("return");
		oPage1Qrcode.classList.remove("page1-qrcode-ani-in");
		oPage1Qrcode.classList.remove("page1-qrcode-ani-out");
		oPage1Qrcode.style.zIndex = "-1";
	}
	//动画完结后将二维码放回底部，免得手指长按可以识别到原本透明的二维码
	oPage1Qrcode.addEventListener("webkitAnimationEnd",function(e){
		// console.log(e.animationName);
		if(e.animationName === "page4-contact-item-ani-out"){
			oPage1Qrcode.style.zIndex = "-1";
		}
	},false);
}

//拿出page3内最高的msg，给所有msg设置一样的高度
var getHeighestAndSet = function(){
	var heightArr = [],
		maxHeight = null;

	//拿所有msg高度
	for(var i=0; i<aMsgBox.length; i++){
		var noPx = parseInt(getComputedStyle(aMsgBox[i], false)["height"].split("px")[0]);
		// console.log(noPx);
		heightArr.push(noPx);
	}

	//拿最高的
	maxHeight = Math.max.apply(null, heightArr);

	//给所有msg使用
	for(var i=0; i<aMsgBox.length; i++){
		aMsgBox[i].style.height = maxHeight + "px";
	}
}

//初始化page3的swiper
var initTimeLine = function(){
	return new Swiper('#timeLineSwiper', {
		direction: 'horizontal',
		// pagination: {
		// 	el: '.timeline-point',
		// 	dynamicBullets: false
		// },
		// navigation: {
		// 	prevEl: '.timeline-prev',
		// 	nextEl: '.timeline-next'
		// },
		effect: 'flip',
		on: {
			init: function(){
				console.log("timeLine is inited，here is page",this.activeIndex + 1);
				//设置page3-msg高度
				getHeighestAndSet();
			}
		}
	});
}

//初始化h5
var initH5 = function(){
	var fullPage = new Swiper('#h5Swiper', {
		direction: 'vertical',
		// pagination: {
		// 	el: '.h5-point',
		// 	dynamicBullets: true
		// },
		on: {
			init: function(){
				//初始化page3内的Swiper
				initTimeLine();

				console.log("h5 is inited，here is page",this.activeIndex + 1);

				//添加负margin
				aCenter.forEach(function(ele,index){
					fixedCenter(ele);
				});

				//禁用微信内下滑
				oH5.addEventListener("touchmove",function(ev){
					ev.preventDefault();
				}, {passive: false});

				//刷新页面
				oLogo.addEventListener("click",function(){
					window.location.reload();
				},false);

				//跳转到第几页
				//swiper.slideTo(index, speed, runCallbacks);
				oReturnTop.addEventListener("click",function(ev){
					fullPage.slideTo(0, 500);
				},false);
				
				//头像点击逻辑...
				if(this.activeIndex === 0){
					oPage1Pic.addEventListener("click",function(ev){
						if(this.classList.contains("turn")){
							rotatePic("return");
						}else{
							rotatePic("turn");
						}
					},false);
				}
			},
			slideChangeTransitionEnd: function(e){
				console.log("h5 is changed，here is page",this.activeIndex + 1);
				//还原头像
				if(this.activeIndex != 0){
					rotatePic("reset");
				}
			}
		}
	});
}

//真实进度-如果浏览器有过一次缓存后就没有进度指示
//图片地址数组
var imgList = [
	//page1
	"../src/images/mobile_bg.jpg",
	"../src/images/head_pic.png",
	"../src/images/head_pic_2.png",
	"../src/images/qr_code.png",
	"../src/images/scroll_tips.png",
	//page2
	"../src/images/html5_1.png",
	"../src/images/javascript_2.png",
	"../src/images/jquery_3.png",
	"../src/images/nodejs_4.png",
	"../src/images/vuejs_5.png",
	"../src/images/react_6.png",
	//page3
	"../src/images/picture_arrow_left.png",
	"../src/images/picture_arrow_right.png",
	//page4
	"../src/images/mobile.png",
	"../src/images/wechat.png",
	"../src/images/qq.png",
	"../src/images/email.png",
	"../src/images/home.png",
	"../src/images/return.png"
	//web side test
	// "https://raw.githubusercontent.com/czjdrj/surge-test/master/images/%E6%88%AA%E5%9B%BE1.png",
	// "https://raw.githubusercontent.com/czjdrj/surge-test/master/images/%E6%88%AA%E5%9B%BE2.png",
	// "https://raw.githubusercontent.com/czjdrj/surge-test/master/images/%E6%88%AA%E5%9B%BE3.png",
	// "https://raw.githubusercontent.com/chenyaoyi88/myapp-admin/master/src/assets/images/avantar1.jpg",
	// "https://raw.githubusercontent.com/chenyaoyi88/myapp-admin/master/src/assets/images/avantar_default.png"
];

//展示加载图片的进度
imgLoader(imgList,function(percentage){
	var percentT = percentage * 100;
	console.log("图片加载进度：",percentT.toFixed(0) + "%");
	
	cc("persent",{
		progress: parseInt(percentT),
		w: 2,
		h: 2,
		inside: "#e9e9e9",
		outside: "#333",
		fontColor: "#333",
		isAni: false,
		dur: 0,
		delay: 0
	});

	if (percentage === 1){
		// sel("body").removeChild(sel("#cover"));
		// initH5();
	}
});
