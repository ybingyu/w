/*
function:   VerticalSlide-v1.0
author:     jin
depends:    jquery.js(1.2.6~1.4)
times:  	2009-7-26;2010-05-24;2010-10-18
*/
(function($) {
	$.fn.vSlide=function(opt){
		//settings
		var settings=jQuery.extend(true,{
			productBigAreaWitch:"ul",//相对this选择器，产生滚动条的大div
			list:"ul > li",//相对this选择器，list对象
			column:1,//分组，即列数
			seeRow:1,//可视范围分行数目
			step:1,//滚动步长，步长越值越小滚动越平滑速度越慢，步长越大滚动越不平滑速度越快
			speed:25,//滚动间隔时间，间隔时间越短速度越快滚动越平滑，本设置效果非常微小系统已经自动设置最佳值尽量不做修改
			orientation:"top",//自动轮播开启时会以设定方向滚动，只有上下，top,bottom
			isBtn:{
				top:"#top",//向上按钮
				bottom:"#bottom",//向下按钮
				isChangeState:true,//按钮事件是否触发滚动方向状态
				step:10,//滚动步长，步长越值越小滚动越平滑速度越慢，步长越大滚动越不平滑速度越快
				speed:20//滚动间隔时间，间隔时间越短速度越快滚动越平滑，本设置效果非常微小系统已经自动设置最佳值尽量不做修改
			},//按钮树配置
			bugD1Height:0//table布局情况下经常有取不到height值情况，针对此可进行的补丁操作,正常情况下无需启用该补丁
		},opt);
		//settings
		var productBigAreaWitch=settings.productBigAreaWitch,
			list=settings.list,
			column=settings.column,
			seeRow=settings.seeRow,
			step=settings.step,
			speed=settings.speed,
			orientation=settings.orientation,
			btn=settings.isBtn,
			btnTop=$(btn.top),
			btnBottom=$(btn.bottom),
			btnIsChangeState=btn.isChangeState,
			btnStep=btn.step,
			btnSpeed=btn.speed,
			bugD1Height=settings.bugD1Height;
		//div
		var $this=$(this);
		var d1=$this,
			d2=d1.find(productBigAreaWitch),
			d3=d1.find(list);
		//d1Height
		var d1Height=d1.height();
		if(bugD1Height!=0){
			d1Height=bugD1Height;
		}else{
			if(d1Height==0){
				d1Height=parseInt(d1.css("height"));
				if(d1Height==0){//还有其他值情况应用中发现问题即时补充
					alert("Err:d1Height==0");
				}
			}
		}
		//other height size ...
		var d3OldSize=d3.size();
		var d3Size=d3OldSize*3;
		var splitHeight=d1Height/seeRow;
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
		//default top
		var __top=d2OldHeight;
		d2.css("top",-__top);
		//
		var flag=true;
		//top
		var top=function(e){
			if(!flag)return false;
			flag=false;
			if(btnIsChangeState){
				orientation="top";
			}
			__top+=step;
			d2.css("top",-__top);
			if(__top>=d2OldHeight+splitHeight){
				for(i=1;i<=column;i++){
					d2.children().eq(0).appendTo(d2);
				}
				__top=d2OldHeight;
				d2.css("top",-__top);
			}
			flag=true;
			return false;
		};
		//bottom
		var bottom=function(e){
			if(!flag)return false;
			flag=false;
			if(btnIsChangeState){
				orientation="bottom";
			}
			__top-=step;
			d2.css("top",-__top);
			if(__top<=d2OldHeight-splitHeight){
				for(i=1;i<=column;i++){
					d2.children().eq(d3Size-1).prependTo(d2);
				}
				__top=d2OldHeight;
				d2.css("top",-__top);
			}
			flag=true;
			return false;
		};
		//timer
		var timerID;
		var autoPlay=function(){
			switch(orientation)
			{
				case "top":timerID=window.setInterval(top,speed);break;
				case "bottom":timerID=window.setInterval(bottom,speed);break;
			}
			return false;
		};
		var autoStop = function(){
			window.clearInterval(timerID);
			return false;
		};
		//ready autoPlay
		autoPlay();
		//
		$this.hover(autoStop,autoPlay);
		//btn
		if(btn){
			btnTop.hover(autoStop,autoPlay);
			btnBottom.hover(autoStop,autoPlay);
			//add speed btn
			var _timeId;
			btnTop.mousedown(function(){
				step=btnStep;
				_timeId=setInterval(top,btnSpeed);
				$(document).mousemove(function(){
					clearInterval(_timeId);
					step=settings.step;
				});
				return false;
			});
			btnBottom.mousedown(function(){
				step=btnStep;
				_timeId=setInterval(bottom,btnSpeed);
				$(document).mousemove(function(){
					clearInterval(_timeId);
					step=settings.step;
				});
				return false;
			});
			$(document).mouseup(function(){
				clearInterval(_timeId);
				step=settings.step;
				return false;
			});
		}
		return $this;
	};
})(jQuery);