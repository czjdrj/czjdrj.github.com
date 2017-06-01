// JavaScript Document
"use strict"
function getStyle(obj,sName){
	return (obj.currentStyle||getComputedStyle(obj,false))[sName];
}
function move(obj,json,options){
	options=options||{};
	options.time=options.time||300;
	options.easing=options.easing||"linear";
	options.fn=options.fn||null;
	//整理可选参数
	var start={};
	var dis={};
	//同时修改多样式，此时start和dis都会有多个，要用json来存放
	for(var name in json){
		start[name]=parseFloat(getStyle(obj,name));
		if(isNaN(start[name])){
			switch(name){
				case 'top':
					start[name] = obj.offsetTop;
					break;
				case 'left':
					start[name] = obj.offsetLeft;
					break;
				case 'width':
					start[name] = obj.offsetWidth;
					break;
				case 'height':
					start[name] = obj.offsetHeight;
					break;
				case 'opacity':
					start[name] = 1;
					break;
				case 'borderWidth':
					start[name] = 0;
					break;
				//marginLeft,paddingLeft,borderWidth...
			}
		}
		dis[name]=json[name]-start[name];
		//json[name]就是用户传进来的参数
	}
	var count=Math.floor(options.time/30);
	var n=0;
	
	clearInterval(obj.timer);
	obj.timer=setInterval(function(){
		//这里的定时器是obj的自定义属性,清除的时候是相应对象自身的
		n++;
		
		for(var name in json){
			switch(options.easing){
				case "linear":
					//匀速
					var cur=start[name]+dis[name]*(n/count);
					break;
				case "ease-in":
					//减速
					var a=n/count;
					var cur=start[name]+dis[name]*(a*a*a);
					break;
				case "ease-out":
					//加速
					var a=1-(n/count);
					var cur=start[name]+dis[name]*(1-a*a*a);
					break;
			}
			//判断运动方式
			if(name=="opacity"){
				obj.style.opacity=cur;
				obj.style.filter="alpha(opacity:"+(cur*100)+")";
			}else{
				obj.style[name]=cur+"px";
			}
		}
		//对json内的样式逐个进行计算
		if(n==count){
			clearInterval(obj.timer);
			options.fn&&options.fn();
		}
	},16);
}
