// 传设计稿的宽度即可
(function(psdw) {
    // 设置布局视口宽度=设备宽度
    var meta = window.document.createElement('meta');
    var metaContent = 'width=device-width';
    meta.name = 'viewport';
    meta.content = metaContent;
    var child = window.document.head.children[0];
    document.head.insertBefore(meta, child);

    // 布局视口宽度
    var el = window.document.documentElement;
    var width = el.clientWidth;

    // 缩放比例   
    var scale = width / psdw;
    scale = scale > 1 ? 1 : scale;
    metaContent += ",initial-scale=" + scale + ",minimum-scale=" + scale + ",maximum-scale=" + scale + ",user-scalable=0";
    meta.content = metaContent;
    // font-size
    var rem = (width / 10) / scale;
    el.style = "font-size:" + rem + "px!important";
    dpr = window.devicePixelRatio || 1;
    el.setAttribute('data-drp', dpr);
    return rem
})(require("./config.js").PSWD)
