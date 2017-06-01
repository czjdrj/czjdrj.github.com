// JavaScript Document
//在不同宽度的终端下计算根的font-size
(function(win,doc){
	function change(){
		//屏幕宽度/320*20 = font-size
		doc.documentElement.style.fontSize=doc.documentElement.clientWidth/320*20+"px";
		console.log("根字体大小："+doc.documentElement.style.fontSize);
	}
	change();
	//因为window公有对象，用事件绑定
	win.addEventListener("resize",change,false);
})(window,document);//传入window和document

//判断是否PC端
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
//打开pc端页面
if(isMobile()==false){
	//alert("pc端");
	window.open("personal.html","_self");
}else{
	//alert("移动端");
}