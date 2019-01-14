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

//展示加载图片的进度
imgLoader(imgList,function(percentage){
	var percentT = percentage * 100;
	console.log("图片加载进度：",percentT.toFixed(0) + "%");

	//进度文字
	// document.querySelector("#persent").textContent = percentT.toFixed(0) + "%";

	//进度条
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
		setTimeout(function(){
			sel("body").removeChild(sel("#cover"));
			initH5();
		}, 500);
	}
});
