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
var cc = function (id, options) {
    options = options || {};
    options.progress = options.progress <= 100 ? options.progress : 100;
    options.w = options.w || 2;
    options.h = options.h || 2;
    options.inside = options.inside || "#ccc";
    options.outside = options.outside || "#333";
    options.fontColor = options.fontColor || "#333";
    options.isAni = options.isAni;

    //选择器
    var sel = function (dom) {
        return document.querySelector(dom);
    }

    var selAll = function (doms) {
        return document.querySelectorAll(doms);
    }

    //取样式
    var getStyle = function (dom, name) {
        return Math.ceil(getComputedStyle(dom, false)[name].split("px")[0]);
    }

    //百分比
    var percent = function (full, n) {
        if (n <= 95) {
            return full / 100 * n;
        } else {
            //由于圆角的关系，进度条>90并且差不多100时，会被圆角填满到100，造成错觉，所以要适当减去一点百分比
            return (full / 100 * n) - 4;
        }
    }

    //数字运动
    var numberRun = function (obj, target, time) {
        if (time === 0) {
            return obj.textContent = target + "%";
        }

        var start = 0,
            dis = target - start,
            count = Math.floor(time / 30),
            n = 0;

        clearInterval(obj.timer);
        obj.timer = setInterval(function () {
            n++;
            //去掉小数点、加上百分比
            obj.textContent = (start + n * (dis / count)).toFixed(0) + "%";
            if (n == count) {
                clearInterval(obj.timer);
            }
        }, 30);
    }

    //rem
    var fz = document.documentElement.style.fontSize.split("px")[0];

    //创建
    var createDom = function (domWrap) {
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.id = id + "-svg";
        svg.style["width"] = "100%";
        svg.style["height"] = "100%";
        svg.style["-webkit-transform"] = "rotateZ(-90deg)";//ios下旋转circle元素会失效，要把外部容器逆时针旋转90°，确保起始位置在正上方
        svg.innerHTML = '<circle fill="none" stroke-linecap="round" stroke-width="' + (0.2 * fz) + '" stroke="' + options.inside + '" class="' + id + '-cc ' + id + '-c1"></circle>\
						<circle fill="none" stroke-linecap="round" stroke-width="'+ (0.2 * fz) + '" stroke="' + options.outside + '" class="' + id + '-cc ' + id + '-c2"></circle>';
        domWrap.appendChild(svg);

        var span = document.createElement("span");
        span.id = id + "-span";
        span.style["position"] = "absolute";
        span.style["left"] = "50%";
        span.style["top"] = "50%";
        span.style["fontSize"] = (options.w / 4) + "rem";
        span.style["color"] = options.fontColor;
        span.style["-webkit-transform"] = "translate(-50%,-50%)";
        span.innerHTML = "0%";
        domWrap.appendChild(span);
    }

    //创建svg
    var wrap = sel("#" + id);

    wrap.style["position"] = "relative";
    wrap.style["width"] = options.w + "rem";
    wrap.style["height"] = options.h + "rem";

    if (!wrap.children.length) {
        createDom(wrap);
    } else {
        wrap.removeChild(wrap.children[0]);
        wrap.removeChild(wrap.children[0]);
        createDom(wrap);
    }

    //dom
    var aCc = selAll("." + id + "-cc"),
        iC2 = sel("." + id + "-c2"),
        iSpan = sel("#" + id + "-span");

    //动态设置circle标签的位置
    var svgW = getStyle(wrap, "width"),
        svgH = getStyle(wrap, "height");

    var cx = svgW / 2,
        cy = svgH / 2,
        r = cx - 10 || cy - 10,
        aroundLong = 2 * Math.PI * r;//2 * π * r = 周长

    aCc.forEach(function (ele, index) {
        ele.setAttribute("cx", cx);
        ele.setAttribute("cy", cy);
        ele.setAttribute("r", r);
    });

    //初始化进度 stroke-dasharray的实线=0，间隔=周长
    iC2.style["stroke-dasharray"] = "0," + aroundLong;
    iSpan.textContent = "0%";

    //动画原理：
    //stroke-dasharray样式是把一条实线切割成虚线，可传多个参数，依次为实线长度和间隔长度
    //0%时，stroke-dasharray的实线=0，间隔=周长
    //100%时，stroke-dasharray的实线=实际进度，间隔=周长-实际进度
    var initProgress = percent(aroundLong, options.progress);//进度
    var leaveProgress = aroundLong - percent(aroundLong, options.progress);//剩下的进度

    if (options.isAni) {//是有需要动画
        options.dur = options.dur || 1;
        options.delay = options.delay || 0;

        //动态添加@keyframes，设定动态的stroke-dasharray动画
        var css = document.createElement("style");
        css.id = id + "-css";
        css.type = "text/css";
        css.textContent = '@-webkit-keyframes ' + id + '-load{\n0%{stroke-dasharray:0,' + aroundLong + ';}\n100%{stroke-dasharray:' + initProgress + ',' + leaveProgress + ';}}\n.' + id + '-load{\n-webkit-animation:' + id + '-load ' + options.dur + 's ' + options.delay + 's ease forwards;\n}';

        var iHead = sel("head");

        //添加css动画类
        if (!sel("#" + id + "-css")) {
            iHead.appendChild(css);
        }
        iC2.classList.add(id + "-load");

        //和数字运动的时间同步
        setTimeout(function () {
            numberRun(iSpan, options.progress, options.dur * 1000);
        }, options.delay * 1000);

        //动画完毕清除css动画类
        iC2.addEventListener("webkitAnimationEnd", function () {
            iHead.removeChild(sel("#" + id + "-css"));
            this.classList.remove(id + "-load");
            this.style["stroke-dasharray"] = initProgress + "," + leaveProgress;
        }, false);
    } else {
        options.dur = 0;
        iC2.style["stroke-dasharray"] = initProgress + "," + leaveProgress;
        numberRun(iSpan, options.progress, options.dur);
    }
}
