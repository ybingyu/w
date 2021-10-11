/*
 * Author: candy(930227)
 * Version: 0.1.0
 * Compile Date: 2018-05-24 17:52
*/ 
var myhd = function () {
    // 手机匹配
    var ua = navigator.userAgent.toLowerCase();
    var tablet_match = /ipad|kindle|xoom|GT-P1000|Streak|playbook|Tablet|flyer|SGH-T849|TouchPad|SHW-M180S|silk|Android 3/i;
    var phone_match = /iphone|ipod|ios|adroid|linux|nokia|Windows Phone OS|blackberry|webos|MeeGo|smartphone|symbian|s60|Series60|ucweb|uc brower|opera mini|opera mobi|mini 9.5|320x320|240x320|176x220|320*480|480*320|240*320|320*320|176*220|vx1000|lge|m800|e860|u940|ux840|compal|wireless|mobi|ahong|lg380|lgku|lgu900|lg210|lg47|lg920|lg840|lg370|sam-r|mg50|s55|g83|t66|vx400|mk99|d615|d763|el370|sl900|mp500|samu3|samu4|vx10|xda_|samu5|samu6|samu7|samu9|a615|b832|m881|s920|n210|s700|c-810|_h797|mob-x|sk16d|848b|mowser|s580|r800|471x|v120|rim8|c500foma:|160x|x160|480x|x640|t503|w839|i250|sprint|w398samr810|m5252|c7100|mt126|x225|s5330|s820|htil-g1|fly v71|s302|-x113|novarra|k610i|-three|8325rc|8352rc|sanyo|vx54|c888|nx250|n120|mtk |c5588|s710|t880|c5005|i;458x|p404i|s210|c5100|teleca|s940|c500|s590|foma|samsu|vx8|vx9|a1000|_mms|myx|a700|gu1100|bc831|e300|ems100|me701|me702m-three|sd588|s800|8325rc|ac831|mw200|brew |d88|htc\/|htc_touch|355x|m50|km100|d736|p-9521|telco|sl74|ktouch|m4u\/|me702|8325rc|kddi|phone|lg |sonyericsson|samsung|240x|x320|vx10|nokia|sony cmd|motorola|up.browser|up.link|mmp|symbian|smartphone|midp|wap|vodafone|o2|pocket|mobile|psp|treo/i;
    // 选择器
    var $lotteryMod = $('#lotteryMod'),
        $loading = $('#loading'),
        $phoneIndex = $('#phoneIndex');
    //图片预加载
    var imgUrl = "img/";//图片目录
    var imgList = [
        "p-bg.jpg",
        "slogan-left.png",
        "slogan-right.png",
        "slogan-peo.png",
        "slogan-dot.png",
        "p-sidebar-bg.png",
    ];
    //加载图片
    var loadImg = function (l, c) {
        var tnum = l.length;
        var overnum = 0;
        for (var i = 0; i < tnum; i++) {
            var img = new Image();
            img.onload = function () {
                overnum++;
                $("#loadingPercent").html(Math.floor(overnum * 100 / tnum) - 1 + "%");
                overnum == tnum && c();
            };
            img.src = imgUrl + l[i];
        }
    };
    //加载成功
    var loadingSuc = function () {
        $loading.hide();
        // setTimeout(function () {
        $phoneIndex.addClass('on');
        // }, 1000);
    };
    var lotteryFn = function () {
        $lotteryMod.on('mouseenter', function (e) {
            $(this).removeClass('on');
        }).on('mouseleave', function (e) {
            $(this).addClass('on');
        })
    };
    //tabChange
    var tabChange = function (tab, tabCont, tabCell) {
        $(tab).on('click', 'a', function (e) {
            e.preventDefault();
            var index = $(this).index();
            $(this).addClass('on').siblings().removeClass('on');
            $(tabCont).find(tabCell).eq(index).addClass('on').siblings().removeClass('on');
        });
        $(tab).find('a').eq(0).trigger('click');
    };
    //判断是否在手机上
    var isPhone = function () {
        if ($('#phoneIndex')[0]) {
            loadImg(imgList, loadingSuc);
        }
    };
    //pop show
    var popShow = function (btn, pop) {
        $(btn).on('click', function (event) {
            event.preventDefault();
            $(pop).show();
        });
    };
    //close pop
    var popClose = function () {
        $('.pop-box').on('click', '.pop-close, .mask', function (event) {
            event.preventDefault();
            $(this).parents('.pop-box').hide();
        });
    };
    var init = function () {
        lotteryFn();
        popClose();
        isPhone();
    };
    return {
        init: init,
        isPhone: isPhone
    }
}();
myhd.init();