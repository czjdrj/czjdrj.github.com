// JavaScript Document
//滚轮事件
function addMouseWheel(obj,fn){
	var firefox=window.navigator.userAgent.toLowerCase().indexOf('firefox');
	if(firefox!=-1){
		obj.addEventListener('DOMMouseScroll',fnWheel,false);	
	}else{
		obj.addEventListener('mousewheel',fnWheel,false);		
	}
	function fnWheel(ev){
		var oEvt=ev||event;
		var down=false;
		if(oEvt.wheelDelta){
			down = oEvt.wheelDelta<0?true:false;
		}else if(oEvt.detail){
			down = oEvt.detail>0?true:false;
		}
		fn(down);
		if(oEvt.preventDefault){
			oEvt.preventDefault();
		}
		return false;
	}
}
//判断是否移动端
function isMobile(){
    var sUserAgent=window.navigator.userAgent.toLowerCase();
    var bIsMobile=sUserAgent.match(/mobile/i)=="mobile";
    var bIsIphone=sUserAgent.match(/iphone/i)=="iphone";
    var bIsIpad=sUserAgent.match(/ipad/i)=="ipad";
    var bIsAndroid=sUserAgent.match(/android/i)=="android";
    var bIsWP=sUserAgent.match(/windows phone/i)=="windows phone";
    var bIsBB=sUserAgent.match(/bb10/i)=="bb10";
	
    if (bIsMobile || bIsIphone || bIsIpad || bIsAndroid || bIsWP || bIsBB) {
        return true;
    }
    return false;
}
//window.onload
window.onload=function(){
	//判断移动端还是PC端
	if(isMobile()){
		//alert("移动端,现在为您跳转页面");
		window.open("mobile.html","_self");
		return;
	}else{
		//alert("PC端");
		//判断PC端是否支持CSS3
		var ua=window.navigator.userAgent.toLowerCase();
		//console.log(ua);
		//判断PC端是否支持CSS3
		if (!(ua.indexOf("rv:11.0")!=-1
		  ||ua.indexOf("msie 10.0")!=-1
		  ||ua.indexOf("chrome")!=-1
		  ||ua.indexOf("firefox")!=-1)){
			//alert("不支持CSS3，去升级");
			//浏览器版本过低，提示用户升级
			document.write("抱歉，您使用的浏览器版本过低，建议升级后再浏览本页面，谢谢! ");
			var oA=document.createElement("a");
			oA.innerHTML="【点击升级】";
			oA.href="https://www.baidu.com/link?url=VVumYGjvDXe4f1VoxrNEW8i8zkuqrY3XvJYH3NK3Ne9HeuNR1jaFVph8XVhJK46NvKwmEq1PjetAtZdnuZjIvCexKfs6f3eSd7q8zaS7eJK&wd=&eqid=c0d158fc000e87ff0000000357ac8877";
			document.body.appendChild(oA);
			return;		  
		}
		//alert("支持CSS3,开始读取代码");
		//加载内容 获取对象
		var windowW=window.screen.width;
		var windowH=window.screen.height;
		
		var oPageBox=document.querySelector("#page_box");
		var aPageBtn=document.querySelectorAll("#page_btn li a");
		var oPageContent=document.querySelector("#page_content");
		var oScrTips=document.querySelector("#scr_tips");
		var oScrTipsText=document.querySelector("#scr_tips_text");
		var aLi=oPageContent.children;
		var oLogo=document.querySelector("#logo");
		
		var sNow=0;//工作经历里面的now,做成局部的话每次跳转到工作经历都会还原成0，所以要做全局
		
		//logo刷新
		oLogo.onclick=function(){
			window.location.reload();
		}
		//获取当前城市天气
		function getWeather(){
			var oScr=document.createElement("script");
			var oHead=document.getElementsByTagName("head")[0];
			oScr.src="http://php.weather.sina.com.cn/iframe/index/w_cl.php?code=js&day=0&city=&dfc=1&charset=utf-8";
			oHead.appendChild(oScr);
			
			oScr.onload=function(){
				var myCity="";
				var info=null;
				var show=null;
				
				for(myCity in window.SWther.w){
					show=SWther.w[myCity][0];
					info={
						city:myCity,
						date:window.SWther.add.now,
						day_weather:show.s1,
						day_weather_py:show.f1,
						night_weather:show.s2,
						night_weather_py:show.f2,
						day_temp:show.t1,
						night_temp:show.t2,
						day_wind:show.p1,
						night_wind:show.p2
					}
					//console.log(info);
					//获取当前时间
					var oTime=parseInt(info.date.split(" ")[1].substring(0,2));
					//判断白天还是晚上
					
				}
				var oWeather=document.querySelector("#weather");
				var oWeatherList=document.querySelector(".weather_list");
				oWeather.innerHTML="城市:"+info.city+"";
				oWeatherList.innerHTML="<li>白天:"+info.day_temp+"°"+"</li><li>夜间:"+info.night_temp+"°"+"</li><li>白天:"+info.day_weather+"</li><li>夜间:"+info.night_weather+"</li>";
				oWeather.onmouseover=function(){
					oWeatherList.style.transition="0.5s all ease";
					oWeatherList.style.opacity=1;
					oWeatherList.style.transform="translateX(0px)";
				}
				oWeather.onmouseout=function(){
					oWeatherList.style.transition="0.5s all ease";
					oWeatherList.style.opacity=0;
					oWeatherList.style.transform="translateX(-108px)";
				}
			}
			//销毁标签
			setTimeout(function(){
				oHead.removeChild(oScr);
				//alert("时间到，销毁标签！");
			},5000);
		}
		getWeather();
		
		//重置高度
		function changeH(){
			var clientH=document.documentElement.clientHeight;
			//容器、ul、li的高度
			if(windowW<=1366&&windowH<=768){
				//alert("低于1366");
				oPageBox.style.height=clientH+"px";
				for(var i=0;i<aLi.length;i++){
					aLi[i].style.height=clientH+"px";
				}
				oPageContent.style.height=aLi[0].offsetHeight*aLi.length;
			}else{
				//alert("高于1366");
				oPageBox.style.height=768+"px";
				for(var i=0;i<aLi.length;i++){
					aLi[i].style.height=768+"px";
				}
				oPageContent.style.height=aLi[0].offsetHeight*aLi.length;
			}
		}
		changeH();
		window.onresize=changeH;

		//选项卡
		var now=0;
		var ready=true;
		for(var i=0;i<aPageBtn.length;i++){
			aPageBtn[i].index=i;
			aPageBtn[i].onclick=function(){
				now=this.index;
				tab();
			}
		}
		
		//编写每个页面的单独函数
		function page0(){//第一页
			var oPage1Front1=oPageContent.children[now].children[0];
			var oPage1Front2=oPageContent.children[now].children[1];
			var oPage1Pic=oPageContent.children[now].children[2];
			var oPage1Msg=oPageContent.children[now].children[3];
			oPage1Front1.classList.add("moveFront1");
			oPage1Front2.classList.add("moveFront2");
			
			oPage1Front2.addEventListener("animationend",function(){
				oPage1Pic.style.transition="0.6s all ease";
				oPage1Pic.style.transform="translateY(0px)";
				oPage1Msg.style.transition="2s all ease";
				oPage1Msg.style.transform="translateY(0px)";
				oPage1Msg.style.opacity=1;
			},false);
			
			oPage1Pic.onmouseover=function(){
				this.style.transition="none";
				this.style.background="url(img/pic2.jpg)";
				this.style.backgroundSize="100% 100%";
			}
			oPage1Pic.onmouseout=function(){
				this.style.background="url(img/pic1.jpg) 50% 50%";
				this.style.backgroundSize="100% 100%";
			}
		}
		
		function page1(){//第二页 专业技能
			var oFront=document.querySelector("#front");
			var oScale=document.querySelector("#scale");
			var aScaleDiv=oScale.children;
			var oSkill=document.querySelector("#skill_box");
			var oSkillUl=oSkill.children[0];
			var aSkillLi=oSkillUl.children;
						
			var arr=[0.8,0.75,0.65,0.7];
			
			oFront.classList.add("moveFront3");
			oFront.style.opacity=1;
			
			oSkill.classList.add("moveFront4");
			oSkill.style.opacity=1;
			oSkill.style.marginLeft="-"+(oSkill.offsetWidth/2-20)+"px";
			oSkill.style.marginTop="-"+oSkill.offsetHeight/2+"px";
			
			oFront.addEventListener("animationend",function(){
				for(var i=0;i<aScaleDiv.length;i++){
					var oSpan=aScaleDiv[i].children[0];
					
					oSpan.style.color="rgba(0,0,0,1)";
					//反向呈现span
					oSpan.style.transition=""+((aScaleDiv.length+1)-(i+1))+"s all ease";
					//每个span的目标高度
					oSpan.style.height=(1-arr[i])*oSpan.offsetHeight+"px";
					//oSpan.innerHTML=(1-((1-arr[i])*aScaleDiv[i].offsetHeight/aScaleDiv[i].offsetHeight))*100+"%";
					//调用数字运动函数
					numberRun(
						//对象
						oSpan,
						//目标位置
						//总高度假设:1 
						//每个遮罩的路程比值 已走路程/总路程:(1-arr[i])*aScaleDiv[i].offsetHeight/aScaleDiv[i].offsetHeight)
						//每个遮罩剩下的路程 (1-((1-arr[i])*aScaleDiv[i].offsetHeight/aScaleDiv[i].offsetHeight))*100
						//(1-((1-arr[i])*aScaleDiv[i].offsetHeight/aScaleDiv[i].offsetHeight))*100,
						//(1-(1-arr[i])*1)*100,
						arr[i]*100,
						//耗时
						((aScaleDiv.length+1)-(i+1))*1000
					);
					
					aScaleDiv[i].style.color="rgba(0,153,102,1)";
					aScaleDiv[i].style.opacity=1;
					//反向呈现透明度	
					aScaleDiv[i].style.transition=""+((aScaleDiv.length+1)-(i+1))+"s all ease";
				}
			},false);
			
			//数字运动
			function numberRun(obj,target,time){
				var start=parseFloat(obj.innerHTML);
				var dis=target-start;
				var count=Math.floor(time/30);
				var n=0;
				
				clearInterval(obj.timer);
				obj.timer=setInterval(function(){
					n++;
					//去掉小数点
					obj.innerHTML=(start+n*(dis/count)).toFixed(0)+"%";
					if(n==count){
						clearInterval(obj.timer);
					}
				},30);
			}
			//专业技能 选项卡
			for(var i=0;i<aScaleDiv.length;i++){
				aScaleDiv[i].index=i;
				aScaleDiv[i].onclick=function(){
					for(var i=0;i<aScaleDiv.length;i++){
						aScaleDiv[i].classList.remove("active");
						aSkillLi[i].style.transition="none"
						aSkillLi[i].style.opacity=0;
					}
					this.classList.add("active");
					oSkillUl.style.transition="0.3s all ease";
					oSkillUl.style.transform="translateY(-"+(this.index*oSkillUl.children[0].offsetHeight+this.index*20)+"px)";
					aSkillLi[this.index].style.transition="1.8s all ease"
					aSkillLi[this.index].style.opacity=1;
				}
				//阻止系统默认
				aScaleDiv[i].onmousedown=function(){
					return false;
				}
			}
		}
		
		function page2(){//第三页 积累沉淀
			var oTab=document.querySelector("#tab");
			var oNav=document.querySelector("#nav");
			var oWindow=document.querySelector("#window");
			var oContent=document.querySelector("#ulContent");
			var aBtn=document.querySelectorAll("#nav a");		
			var oMsg3=document.querySelector("#msg3");		
			
			oTab.style.transition="1.5s all ease";
			oTab.style.transform="translate(0px,0px)";
			oTab.style.opacity=1;
		
			oNav.style.transition="2s all ease";
			oNav.style.transform="translate(0px,0px)";
	
			oMsg3.classList.add("moveFront5");
			oMsg3.style.opacity=1;
	
			for(var i=0;i<aBtn.length;i++){
				aBtn[i].index=i;
				aBtn[i].onclick=function(){
					for(var i=0;i<aBtn.length;i++){
						aBtn[i].classList.remove("active");
					}
					this.classList.add("active");
					this.classList.add("click");
					this.addEventListener("animationend",function(){
						this.classList.remove("click");
					},false);
					oContent.style.transition="1s all ease";
					oContent.style.transform="translateX("+(-this.index*(oContent.offsetWidth/aBtn.length))+"px)";
				}
			}
		}
		
		function page3(){//第四页 联系方式
			var oFront=document.querySelector("#page4_front1");
			var aIcon=document.querySelectorAll("#contact .icon");
			var oFront2=document.querySelector("#page4_front2");
			var oCodeBox=document.querySelector("#code_box");
			var oBtnM=document.querySelector("#btn_m");
			var oPicM=document.querySelector("#pic_m");
			
			oFront.classList.add("moveFront6");
			oFront.style.opacity=1;
			oFront.addEventListener("animationend",function(){
				//反向呈现icon
				for(var i=0;i<aIcon.length;i++){
					aIcon[i].style.transition=""+((aIcon.length+1)*0.3-(i+1)*0.3)+"s all ease";
					aIcon[i].style.transform="translate(0px,0px)";
					aIcon[i].style.opacity=1;
					//展开联系方式
					aIcon[i].addEventListener("transitionend",function(){
						this.style.transition="none";
						var oFrontBox=this.children[2];
						var oFront=this.children[2].children[0];
						oFrontBox.style.transition="0.3s all ease";
						oFrontBox.style.width="200px";
						oFrontBox.style.opacity=1;
						
						oFront.style.transition="0.6s all ease";
						oFront.style.transform="translate(0px,0px)";
						oFront.style.opacity=1;
					},false);
				}
			},false);
			
			oFront2.style.transition="4s all ease";
			oFront2.style.transform="translate(0,0)";
			oFront2.style.opacity=1;
			
			oBtnM.onclick=function(){
				if(getComputedStyle(oPicM,false).display=="none"){
					oPicM.style.display="block";
				}else{
					oPicM.style.display="none";
				}
			}
			
			oCodeBox.onmouseover=function(ev){
				var oCode=document.createElement("div");
				oCode.style.width="200px";
				oCode.style.height="200px";
				oCode.style.background="url(img/code.jpg)";
				oCode.style.backgroundSize="100% 100%";
				oCode.style.border="4px solid #fff";
				document.body.appendChild(oCode);
				
				oCodeBox.onmousemove=function(ev){
					oCode.style.position="absolute";
					
					//var windowW=window.screen.width;
					//var windowH=window.screen.height;
					if(windowW<=1366&&windowH<=768){
						//alert("低于1366");
						oCode.style.left=ev.clientX+20+"px";
						oCode.style.top=ev.clientY+20+"px";
					}else{
						//alert("高于1366");
						oCode.style.left=(ev.clientX-((document.documentElement.clientWidth-1366)/2))+20+"px";
						oCode.style.top=(ev.clientY-((document.documentElement.clientHeight-768)/2))+20+"px";
					}
					
				}
				oCodeBox.onmouseout=function(){
					document.body.removeChild(oCode);
				}
			}
		}
		
		function page4(){//第五页 工作经历
			var oFront=document.querySelector("#page5_front1");
			var oWorkBox=document.querySelector("#page5_work_box");
			var oUl=document.querySelector("#page5_work_ul");
			var aContent=document.querySelectorAll("#page5_work_ul li");
			var oBtnBox=document.querySelector("#page5_work_btnBox");
			var aBtn=document.querySelectorAll("#page5_work_btnBox li");
			var oPrev=document.querySelector("#prev");
			var oNext=document.querySelector("#next");
			var aBg=document.querySelectorAll("#page5_work_ul li .bg");
			//var sNow=0;//每次跳转在工作经历都会还原成0，所以要做全局
			//标题 盒子 运动
			oFront.classList.add("moveFront6");
			oFront.style.opacity=1;
			oFront.addEventListener("animationend",function(){
				oWorkBox.style.transition="1s all ease";
				oWorkBox.style.width="800px";
				oWorkBox.style.opacity=1;
			},false);
			
			oWorkBox.onmouseover=function(){
				oBtnBox.style.display="block";
				oPrev.style.display="block";
				oNext.style.display="block";
			}
			oWorkBox.onmouseout=function(){
				oBtnBox.style.display="none";
				oPrev.style.display="none";
				oNext.style.display="none";
			}
			//页内选项卡
			for(var i=0;i<aBtn.length;i++){
				aBtn[i].index=i;
				aBtn[i].onclick=function(){
					sNow=this.index;
					sTab();
				}
			}
			function sTab(){
				for(var i=0;i<aBtn.length;i++){
					aBtn[i].classList.remove("active");
				}
				aBtn[sNow].classList.add("active");
				oUl.style.transition="1s all ease";
				oUl.style.transform="translateY("+-sNow*aContent[0].offsetHeight+"px)";
			}
			oPrev.onclick=function(){
				sNow--;
				if(sNow==-1){
					sNow=0;
					aBg[sNow].classList.add("top2");
					aBg[sNow].addEventListener("animationend",function(){
						aBg[sNow].classList.remove("top2");
					},false);
				}else{
					sTab();
				}
			}
			oPrev.onmousedown=function(){
				return false;
			}
			oNext.onclick=function(){
				sNow++;
				if(sNow==aBtn.length){
					sNow=aBtn.length-1;
					aBg[sNow].classList.add("bottom2");
					aBg[sNow].addEventListener("animationend",function(){
						aBg[sNow].classList.remove("bottom2");
					},false);
				}else{
					sTab();
				}
			}
			oNext.onmousedown=function(){
				return false;
			}
			//3D卡体
			for(var i=0;i<aBg.length;i++){
				press3D(aBg[i]);
			}
						
			function press3D(obj){
				obj.onmouseenter=function(){
					//记录页面边距 宽高
					
					//var windowW=window.screen.width;
					//var windowH=window.screen.height;
					if(windowW<=1366&&windowH<=768){
						//alert("低于1366");
						var thisLeft=getPos(obj).left;
						//写死一个上边距
						var thisTop=220;
					}else{
						//alert("高于1366");
						var thisLeft=getPos(obj).left+(document.documentElement.clientWidth-1366)/2;
						//写死一个上边距
						var thisTop=220+(document.documentElement.clientHeight-768)/2;
					}
					//console.log("左边距:"+thisLeft,"上边距:"+thisTop);
					
					obj.onmousemove=function(ev){
						//记录鼠标X Y
						var X=ev.clientX-thisLeft;
						var Y=ev.clientY-thisTop;
						//初始化旋转角度
						var rotateX=0;
						var rotateY=0;
						//console.log(X,Y);
						
						//计算Y轴 X轴旋转角度
						if(X>obj.offsetWidth/2){
							rotateY=X-obj.offsetWidth/2;
						}else{
							rotateY=X-obj.offsetWidth/2;
						}
						if(Y>obj.offsetHeight/2){
							rotateX=-(Y-obj.offsetHeight/2);
						}else{
							rotateX=-(Y-obj.offsetHeight/2);
						}
						//console.log(rotateX,rotateY);
						//使用旋转角度
						obj.style.transform="perspective(800px) rotateY("+rotateY/40+"deg) rotateX("+rotateX/20+"deg)";
					}
					//还原角度
					obj.onmouseleave=function(){
						obj.style.transform="perspective(800px) rotateX(0deg) rotateY(0deg)";
					}
				}
			}
			//到页面的距离
			function getPos(obj){
				var l=0;
				var t=0;
				while(obj){
					l+=obj.offsetLeft;//累加
					t+=obj.offsetTop;
					obj=obj.offsetParent;//更新参考点
				}
				return {left:l,top:t};
			}
		}
		
		//页面加载就运行tab()
		function tab(){
			for(var i=0;i<aPageBtn.length;i++){
				aPageBtn[i].classList.remove("active");
			}
			aPageBtn[now].classList.add("active");
			oPageContent.style.transition="1s all ease";
			oPageContent.style.transform="translateY("+(-now*(oPageContent.offsetHeight/aPageBtn.length))+"px)";		
			
			//调用页面函数
			if(now==0){
				page0();
				oScrTips.style.display="block";
				oScrTipsText.style.display="block";
			}else{
				oScrTips.style.display="none";
				oScrTipsText.style.display="none";
			}
			
			if(now==1){
				page1();
			}
			
			if(now==2){//后面插了一页工作经历
				page4();
			}
			
			if(now==3){
				page2();
			}
			
			if(now==4){
				page3();
			}
			
			//页面运动结束时解除事件监听,开关打开
			oPageContent.addEventListener("transitionend",moveEnd,false);
			function moveEnd(){
				oPageContent.removeEventListener("transitionend",moveEnd,false);
				ready=true;
				console.log("运动完毕 | ready:"+ready);
			}
		}
		tab();
		
		//滚动事件,开关
		addMouseWheel(document,function(down){
			if(ready==false)return;
			ready=false;
			console.log("鼠标滚动 | ready:"+ready);
			if(down){
				now++;
				if(now==aPageBtn.length){
					now=aPageBtn.length-1;
					aLi[now].classList.add("bottom");
					aLi[now].addEventListener("animationend",function(){
						aLi[now].classList.remove("bottom");
						ready=true;
						console.log("到底了 | ready:"+ready);
					},false);
				}else{
					tab();
				}
			}else{
				now--;
				if(now==-1){
					now=0;
					aLi[now].classList.add("top");
					aLi[now].addEventListener("animationend",function(){
						aLi[now].classList.remove("top");
						ready=true;
						console.log("到顶了 | ready:"+ready);
					},false);
				}else{
					tab();
				}
			}
		});
	}
}
