/*参数：
*id:id 【string】【必填】
*progress:进度 0-100 【number】【选填】
*w:宽度 单位rem 【number】【选填】
*h:高度 单位rem 【number】【选填】
*inside:内圈颜色 【string】【选填】
*outside:外圈颜色 【string】【选填】
*fontColor:字体颜色 【string】【选填】
*isAni:true/false 是否需要动画 【boolean】【必填】
*dur:动画时长 单位秒 【number】【选填】
*delay:动画延时 单位秒 【number】【选填】
*/

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
* @param imgList 要加载的图片地址列表，['aa/asd.png','aa/xxx.png']
* @param callback 每成功加载一个图片之后的回调，并传入“已加载的图片总数/要加载的图片总数”表示进度
* @param timeout 每个图片加载的超时时间，默认为5s
*/
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

//初始化h5
var initH5 = function(){
	var swiper = new Swiper('#h5 .swiper-container', {
		direction: 'vertical',
		pagination: {
			el: '.swiper-pagination',
			// clickable: true,
			dynamicBullets: true
		},
		on: {
			init: function(){
				console.log(this.activeIndex);
				console.log("h5 is inited");

				//添加负margin
				selAll(".center").forEach(function(ele,index){
					fixedCenter(ele);
				});

				//禁用微信内下滑
				sel("#h5").addEventListener("touchmove",function(ev){
					ev.preventDefault();
				},false);

				//swiper.slideTo(index, speed, runCallbacks);
				sel("#jump-2").addEventListener("click",function(){
					swiper.slideTo(0,500,true);
				},false);

				//各种逻辑...
			},
			slideChangeTransitionEnd: function(){
				console.log(this.activeIndex);
				console.log("h5 is changed");
			}
		}
	});
}

//真实进度-如果浏览器有过一次缓存后就没有进度指示
//图片地址数组
var imgList = ["../src/images/mobile_bg.jpg"];

//imgLoader调用
imgLoader(imgList,function(percentage){
	console.log("图片加载进度：",percentage);
	var percentT = percentage * 100;
	
	cc("persent",{
		progress: parseInt(percentT),
		w: 2,
		h: 2,
		inside: "#ccc",
		outside: "#666",
		fontColor: "#666",
		isAni: false,
		dur: 0,
		delay: 0
	});

	if (percentage === 1){
		sel("body").removeChild(sel("#cover"));
		initH5();
		//do something...
	}
});
