/*
function:   标签切换
author:     jin
depends:    jquery.js(1.2.6~1.4.0)
			
firstTime:  2009-8-13
lastTime:   2010-05-24
*/
var cTab=function(opt){
	//settings
	var settings=jQuery.extend({
		tabHandleList:"#tabHnadle > li",//标签头
		tabBodyList:"#tabBody > li",//标签内容体序列
		isAutoPlay:false,//是否自动播放
		bind:"click",//标签绑定事件
		defIndex:0,//默认选中标签下标
		tabOnCssList:"#tabHnadle > li",//标签on样式添加点
		tabOnCssName:"tabon",//选中标签样式
		callBack:false//回调
	},opt);
	var isAutoPlay=settings.isAutoPlay,
		bind=settings.bind,
		defIndex=settings.defIndex,
		$tabHandleList=$(settings.tabHandleList),
		tabOnCssName=settings.tabOnCssName,
		$tabOnCssList=$(settings.tabOnCssList),
		$tabBodyList=$(settings.tabBodyList);
		callBack=settings.callBack;
	var maxSize=$tabHandleList.size();
	var gotoIndex=function(i){
		if(i>=maxSize){i=0;}else if(i<0){i=maxSize-1;}
		$tabOnCssList.eq(defIndex).removeClass(tabOnCssName);
		$tabOnCssList.eq(i).addClass(tabOnCssName);
		$tabBodyList.eq(defIndex).hide();
		$tabBodyList.eq(i).show();
		defIndex=i;
		if(callBack) callBack(i);
		return false;
	};
	gotoIndex(defIndex);
	$tabHandleList.each(function(i){
		$(this).bind(bind,function(){gotoIndex(i);});
	});
	//auto
	var timerID;
	var autoPlay=function(){
		timerID=window.setInterval(function(){
			var temp=defIndex+1;
			gotoIndex(temp);
		},1000);
	};
	var autoStop=function(){
		window.clearInterval(timerID);
	};
	if(isAutoPlay){
		autoPlay();
		$tabHandleList.hover(autoStop,autoPlay);
		$tabBodyList.hover(autoStop,autoPlay);
	}
	//return
	return {gotoIndex:gotoIndex,defIndex:defIndex};
};
