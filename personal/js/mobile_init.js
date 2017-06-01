// JavaScript Document
$(function(){
	//储存根字体大小（带px）
	var fontZ=document.documentElement.style.fontSize;	
	//alert("根字体大小"+fontZ);
	
	//全局变量存起来
	var oTips=$("#scr_tips");//翻页提示
	var oTipsText=$("#scr_tips_text");//提示文字
	var oP1Pic=$(".page1_pic");//头像
	var oQrCod=$(".qr_code");//二维码
	
	var oPageBox=$("#page_box");//简历盒子
	var oPageContent=$("#page_content");//简历的ul
	var aPage=$(".page_content>li");//每个页面的li
	
	//logo刷新
	$("#logo").on("singleTap",function(){
		window.location.reload();
	});
	
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
			}
			var oWeather=document.querySelector("#weather");
			var oWeatherList=document.querySelector(".weather_list");
			oWeather.innerHTML="城市:"+info.city+"";
			oWeatherList.innerHTML="<li>白天:"+info.day_temp+"°"+"</li><li>夜间:"+info.night_temp+"°";
		}
		//销毁标签
		setTimeout(function(){
			oHead.removeChild(oScr);
			//alert("时间到，销毁标签！");
		},5000);
	}
	getWeather();
	
	//初始化选项卡元素的高度
	function changeH(){
		//获取屏幕高度
		var clientH=$(document).height();
		//计算选项卡盒子，每个li和ul的高度
		oPageBox.css("height",clientH);
		oPageContent.children().each(function(){
			$(this).css("height",clientH);
		});
		oPageContent.css("height",clientH*oPageContent.children().length);
	}
	changeH();
	
	//选项卡
	var now=0;
	var ready=true;
	var aPageBtn=$("#page_btn").children();
	var oPage=$("#page_content").children()[0];
	//console.log(aPageBtn[now]);
	aPageBtn.each(function(){
		$(this).on("singleTap",function(){
			console.log("点击按钮 | ready:"+ready);
			now=$(this).index();
			tab();
		});
	});
	
	//编写每个页面的单独函数
	function page1(){//第一页
		var oP1Title=$("#page1_title");//第一页标题
		var oP1Msg=$(".page1_msg");//第一页简介
		
		oP1Title.addClass("move_title").on("webkitAnimationEnd",p1TitleEnd);
		function p1TitleEnd(){
			oP1Title.off("webkitAnimationEnd",p1TitleEnd);
			oP1Pic.css({
				"-webkit-transition":"0.6s all ease",
				"-webkit-transform":"translateY(0)"
			});
			oP1Msg.css({
				"-webkit-transition":"2s all ease",
				"-webkit-transform":"translateY(0)",
				"opacity":"1"
			});
			//头像旋转
			oP1Pic.on("singleTap",function(){
				if($(this).hasClass("turn")){
					$(this).removeClass("turn").addClass("return");
					oQrCod.css({
						"-webkit-transform":"translateY(-22rem)",
						"opacity":"0"
					});
				}else{
					$(this).removeClass("return").addClass("turn");
					oQrCod.css({
						"-webkit-transition":"0.6s all ease",
						"-webkit-transform":"translateY(0rem)",
						"opacity":"1"
					});
				}
			});
		}
	}
	
	function page2(){//第二页				
		var oP2Title=$("#page2_title");
		var aScaleDiv=$("#scale>div");
		var oSkillBox=$("#skill_box");
		var oSkill=$("#skill_box .skill");
		var aSkillLi=$("#skill_box .skill>li");
		
		//技能盒子的数值
		var arr=[0.8,0.75,0.65,0.7];
		
		//第二页标题运动+信息盒子运动
		oSkillBox.addClass("move_skill").css("opacity","1");
		oP2Title.addClass("move_title").on("webkitAnimationEnd",p2TitleEnd);
		function p2TitleEnd(){
			oP2Title.off("webkitAnimationEnd",p2TitleEnd);
			aScaleDiv.each(function(){
				var oSpan=aScaleDiv.eq($(this).index()).children().eq(0);
				oSpan.css({
					//字体颜色
					"color":"rgba(0,0,0,1)",
					//倒序展示技能盒子
					"-webkit-transition":""+((aScaleDiv.length+1)*0.6-($(this).index()+1)*0.6)+"s all ease",
					//每个span的目标高度
					"height":((1-arr[$(this).index()])*oSpan.height())/fontZ.replace("px","")+"rem"
				});
				//调用数字运动函数
				numberRun(
					//对象
					oSpan,
					//目标位置
					arr[$(this).index()]*100,
					//耗时
					((aScaleDiv.length+1)*0.6-($(this).index()+1)*0.6)*1000
				);
			});
			aScaleDiv.css({
				"color":"rgba(0,153,102,1)",
				"opacity":"1",
				//每个div的过渡时间
				"-webkit-transition":""+((aScaleDiv.length+1)*0.6-($(this).index()+1)*0.6)+"s all ease"
			});
		}
			
		//数字运动
		function numberRun(obj,target,time){
			var start=parseFloat(obj.html());
			var dis=target-start;
			var count=Math.floor(time/30);
			var n=0;
			
			clearInterval(obj.timer);
			obj.timer=setInterval(function(){
				n++;
				//去掉小数点、加上百分比
				obj.html(""+(start+n*(dis/count)).toFixed(0)+"%")
				if(n==count){
					clearInterval(obj.timer);
				}
			},30);
		}			
		
		//专业技能 选项卡
		aScaleDiv.on("singleTap",function(){
			aScaleDiv.removeClass("active");
			$(this).addClass("active");
			//取消所有li的过渡，立即透明
			aSkillLi.css({
				"-webkit-transition":"none",
				"opacity":"0"
			});
			//增加当前li的过渡，慢慢浮现
			aSkillLi.eq($(this).index()).css({
				"-webkit-transition":"1s all ease",
				"opacity":"1"
			});
			//计算ul的目标位置
			oSkill.css({
				"-webkit-transition":"0.3s all ease",
				"-webkit-transform":"translateY(-"+(($(this).index()*aSkillLi.eq(0).height())/fontZ.replace("px",""))+"rem)"
			});
		});
	}
	
	function page3(){//第三页
		var oP3Title=$("#page3_title");
		var oP3WorkUl=$("#page3_work_ul");
		var aP3WorkLi=$("#page3_work_ul>li");
		
		oP3Title.addClass("move_title").on("webkitAnimationEnd",p3TitleEnd);
		function p3TitleEnd(){
			oP3Title.off("webkitAnimationEnd",p3TitleEnd);
			oP3WorkUl.css({
				"-webkit-transition":"1s all ease",
				"width":"15rem",
				"-webkit-transform":"translateX(0rem)",
				"opacity":"1"
			});
		}
		//点击动画
		aP3WorkLi.on("singleTap",function(){
			$(this).addClass("shake").on("webkitAnimationEnd",p2ShakeEnd);
			function p2ShakeEnd(){
				$(this).removeClass("shake").off("webkitAnimationEnd",p2ShakeEnd);
			}
		});
	}
	
	function page4(){//第四页
		var oP4Title=$("#page4_title");
		var aP4Icon=$("#contact .icon");
		var oP4BtMsg=$("#page4_front2");
		var aP4OpaBox=aP4Icon.find(".opa_box");
		var aP4FrontBox=aP4Icon.find(".front_box");
		var aP4Front=aP4FrontBox.find(".front");
		
		aP4Front.eq(0).html("13570949332");
		aP4Front.eq(1).html("C13570949332");
		aP4Front.eq(2).html("381835346");
		aP4Front.eq(3).html("czjdrj@163.com");
		
		oP4Title.addClass("move_title").on("webkitAnimationEnd",p4TitleEnd);
		function p4TitleEnd(){
			oP4Title.off("webkitAnimationEnd",p4TitleEnd);
			//倒序掉落icon
			aP4Icon.each(function(){
				$(this).css({
					"-webkit-transition":""+((aP4Icon.length+1)*0.3-($(this).index()+1)*0.3)+"s all ease",
					"-webkit-transform":"translateY(0)",
					"opacity":"1"
				}).on("webkitTransitionEnd",p3IconEnd);
				//每个icon掉落完毕时,展开联系方式
				function p3IconEnd(){
					$(this).css("-webkit-transition","none").off("webkitTransitionEnd",p3IconEnd);
					var oFrontBox=$(this).children().eq(2);
					var oFront=oFrontBox.children().eq(0);
					oFrontBox.css({
						"-webkit-transition":"0.3s all ease",
						"width":"8rem",
						"opacity":"1"
					});
					oFront.css({
						"-webkit-transition":"0.6s all ease",
						"-webkit-transform":"translateX(0)",
						"opacity":"1",
					});
				}
			});
			//致谢
			oP4BtMsg.css({
				"-webkit-transition":"4s all ease",
				"-webkit-transform":"translateY(0)",
				"opacity":"1"
			});
		}
		
		//点击事件 加、减类名
		aP4Icon.on("singleTap",function(){
			aP4Icon.removeClass("icon_effect");
			$(this).addClass("icon_effect");
			aP4OpaBox.removeClass("opa_effect");
			$(this).find(".opa_box").addClass("opa_effect");
			aP4FrontBox.removeClass("front_box_effect");
			$(this).find(".front_box").addClass("front_box_effect");
		});
	}
	
	function tab(){
		aPageBtn.removeClass("active").eq(now).addClass("active");
		oPageContent.css({
			"-webkit-transition":"0.6s all ease",
			"-webkit-transform":"translateY("+((-now*oPage.offsetHeight)/fontZ.replace("px",""))+"rem)"
		});

		//调用每个页面的函数
		if(now==0){
			page1();
			oTips.css("display","block");
			oTipsText.css("display","block");
		}else{
			oTips.css("display","none");
			oTipsText.css("display","none");
			oP1Pic.removeClass("turn").addClass("return");
			oQrCod.css({
				"-webkit-transform":"translateY(-22rem)",
				"opacity":"0"
			});
		}
		
		if(now==1){
			page2();
		}
		
		if(now==2){
			page3();
		}
		
		if(now==3){
			page4();
		}
		
		//页面运动结束时,解除事件绑定,开关打开
		oPageContent.on("webkitTransitionEnd",moveEnd);
		function moveEnd(){
			oPageContent.off("webkitTransitionEnd",moveEnd);
			ready=true;
			console.log("运动完毕 | ready:"+ready);
		}
	}
	tab();
	
	//阻止默认-例如微信的默认下滑
	oPageBox.on("touchstart",function(ev){
		ev.preventDefault();
	});
	//手指上下滑动事件
	oPageBox.on("swipeDown",function(){
		if(ready==false)return;
		ready=false;
		console.log("滑动 | ready:"+ready);
		now--;
		if(now==-1){
			now=0;
			aPage.eq(now).addClass("top").on("webkitAnimationEnd",topEnd);
			function topEnd(){
				aPage.eq(now).removeClass("top").off("webkitAnimationEnd",topEnd);
				ready=true;
				console.log("【到顶了】 | ready:"+ready);
			}
		}else{
			tab();
		}
	});
	oPageBox.on("swipeUp",function(){
		if(ready==false)return;
		ready=false;
		console.log("滑动 | ready:"+ready);
		now++;
		if(now==aPageBtn.length){
			now=aPageBtn.length-1;
			aPage.eq(now).addClass("bottom").on("webkitAnimationEnd",bottomEnd);
			function bottomEnd(){
				aPage.eq(now).removeClass("bottom").off("webkitAnimationEnd",bottomEnd);
				ready=true;
				console.log("【到底了】 | ready:"+ready);
			}
		}else{
			tab();
		}		
	});
})
