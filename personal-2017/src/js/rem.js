(function (win, doc) {
    function rem() {
        //屏幕宽度/375*50 = font-size
        doc.documentElement.style.fontSize = doc.documentElement.clientWidth / 375 * 50 + "px";
        console.log("屏幕宽度：" + doc.documentElement.clientWidth);
        console.log("根字体大小：" + doc.documentElement.style.fontSize);
    }
    rem();
    win.addEventListener("resize", rem, false);
})(window, document);
