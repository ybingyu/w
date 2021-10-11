/*
function:   GapVerticalSlide
author:     jin
depends:    jquery.js(1.2.6~1.4.0)
			
firstTime:  2010-02-01
lastTime:   2010-05-24
*/
(function($) {
	$.fn.gvSlide=function(opt){
		//settings
		var settings=jQuery.extend(true,{
			isWinLoad:true,//是否window onload后加载
			productScrollWitch:"ul",//相对this选择器，产生滚动条的大div
			list:"ul > li",//相对this选择器，list对象
			column:1,//分组，即列数
			seeRow:1,//可视范围分行数目
			step:1,//滚动步长
			speed:"normal",//滚动速度
			orientation:"top",//自动轮播开启时会以设定方向滚动，否则只作为待滚定位，只有上下，top,bottom
			isAutoPlay:3000,//自动播放时间间隔
			isBtn:{
				top:"#top",//向上按钮
				bottom:"#bottom",//向下按钮
				isChangeState:true//按钮事件是否触发滚动方向状态
			},//按钮树配置
			bugD1Height:0//table布局情况下经常有取不到height值情况，针对此可进行的补丁操作,正常情况下无需启用该补丁
		},opt);
		//settings
		var isWinLoad=settings.isWinLoad,
			productScrollWitch=settings.productScrollWitch,
			list=settings.list,
			column=settings.column,
			seeRow=settings.seeRow,
			step=settings.step,
			speed=settings.speed,
			orientation=settings.orientation,
			isAutoPlay=settings.isAutoPlay,
			btn=settings.isBtn,
			btnTop=$(btn.top),
			btnBottom=$(btn.bottom),
			btnIsChangeState=btn.isChangeState,
			bugD1Height=settings.bugD1Height;
		//div
		var $this=$(this);
		var thisselector=$this.selector;
		var d1=$this,
			d2=d1.find(productScrollWitch),
			d3=d1.find(list);
		//d1Height
		var d1Height=d1.height();
		if(bugD1Height!=0){
			d1Height=bugD1Height;
		}else{
			if(d1Height==0){
				alert("Err:d1Height==0");
			}
		}
		//other height size ...
		var d3OldSize=d3.size();
		var d3Size=d3OldSize*3;
		var splitHeight=d1Height/seeRow;
		var stepHeight=step*splitHeight;
		var d2OldHeight=splitHeight*Math.ceil(d3OldSize/column);
		var d2Height=d2OldHeight*3;
		//fall short of nmuber,return false
		if(d2OldHeight<d1Height)return false;
		//clone for fill
		for(var i=0;i<d3OldSize;i++){
			d3.eq(i).clone().appendTo(d2);
			d3.eq(d3OldSize-i-1).clone().prependTo(d2);
		}
		//bear with
		d2.height(d2Height+100);
		//default scrolltop
		d1.scrollTop(d2OldHeight);
		//
		var flag=true;
		//top
		var top=function(e){
			if(!flag)return false;
			flag=false;
			if(btnIsChangeState){
				orientation="top";
			}
			d1.animate({scrollTop:d1.scrollTop()+stepHeight},speed,function(){
				for(i=1;i<=step*column;i++){
					d2.children().eq(0).appendTo(d2);
				}
				d1.scrollTop(d2OldHeight);
				flag=true;
			});
			return false;
		};
		//bottom
		var bottom=function(e){
			if(!flag)return false;
			flag=false;
			if(btnIsChangeState){
				orientation="bottom";
			}
			d1.animate({scrollTop:d1.scrollTop()-stepHeight},speed,function(){
				for(i=1;i<=step*column;i++){
					d2.children().eq(d3Size-1).prependTo(d2);
				}
				d1.scrollTop(d2OldHeight);
				flag=true;
			});
			return false;
		};
		//timer
		var timerID;
		var autoPlay=function(){
			switch(orientation)
			{
				case "top":timerID=window.setInterval(top,isAutoPlay);break;
				case "bottom":timerID=window.setInterval(bottom,isAutoPlay);break;
			}
			return false;
		};
		var autoStop = function(){
			window.clearInterval(timerID);
			return false;
		};
		if(isAutoPlay){
			//ready autoPlay
			if(isWinLoad){
				$(window).load(autoPlay);
			}else{
				autoPlay();
			}
			//
			$this.hover(autoStop,autoPlay);
			if(btn){
				btnTop.hover(autoStop,autoPlay);
				btnBottom.hover(autoStop,autoPlay);
			}
		}
		//btn
		if(btn){
			btnTop.click(top);
			btnBottom.click(bottom);
		}
		return $this;
	};
})(jQuery);