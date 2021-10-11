/*
function:   RescrollGapLevelSlide
author:     jin
depends:    jquery.js(1.2.6~1.4.0)
			
firstTime:  2009-11-19
lastTime:   2010-05-24
*/
(function($) {
	$.fn.rglSlide=function(opt){
		//settings
		var settings=jQuery.extend(true,{
			isWinLoad:true,//是否window onload后加载
			productScrollWitch:"ul",//相对this选择器，产生滚动条的大div
			list:"ul > li",//相对this选择器，list对象
			row:1,//分组，即行数（垂直滚动的地方用到，之里只为保持代码同步，所以请先修改垂直滚动）
			seeColumn:1,//可视范围分列数目
			step:1,//滚动步长
			speed:"normal",//滚动速度
			orientation:"left",//自动轮播开启时会以设定方向滚动，否则只作为待滚定位，只有左右，left,right
			isAutoPlay:{
				timer:3000,//间隔时间
				rescrollTime:2000,//回滚时间
				reboundState:true//回弹状态，默认回滚开启时自动关闭回弹事件，回滚关闭时自动开启回弹事件，如果要同时关闭请手工关闭
			},//自动播放树配置，false时禁用自动播放功能
			isBtn:{
				left:"#left",//向左按钮
				right:"#right",//向右按钮
				disableCss:"disable",//按钮失效css
				isChangeState:true//按钮事件是否触发滚动方向状态
			},//按钮树配置，false时禁用按钮控制功能
			bugD1Width:0,//table布局情况下经常有取不到width值情况，针对此可进行的补丁操作,正常情况下无需启用该补丁
			callback:false
		},opt);
		//settings
		var isWinLoad=settings.isWinLoad,
			productScrollWitch=settings.productScrollWitch,
			list=settings.list,
			row=settings.row,
			seeColumn=settings.seeColumn,
			step=settings.step,
			speed=settings.speed,
			orientation=settings.orientation,
			aut=settings.isAutoPlay,
			autTimer=aut.timer,
			autRescrollTime=aut.rescrollTime,
			autReboundState=aut.reboundState,
			btn=settings.isBtn,
			btnLeft=$(btn.left),
			btnRight=$(btn.right),
			btnDisableCss=btn.disableCss,
			btnIsChangeState=btn.isChangeState,
			bugD1Width=settings.bugD1Width,
			callback=settings.callback;
		//div
		var $this=$(this);
		var thisselector=$this.selector;
		var d1=$this,
			d2=d1.find(productScrollWitch),
			d3=d1.find(list);
		//d1Width
		var d1Width=d1.width();
		if(bugD1Width!=0){
			d1Width=bugD1Width;
		}else{
			if(d1Width==0){
				alert("Err:d1Width==0");
			}
		}
		//other width size ...
		var d3Size=d3.size();
		var splitWidth=d1Width/seeColumn;
		var stepWidth=step*splitWidth;
		var d2Width=splitWidth*Math.ceil(d3Size/row);
		//fall short of nmuber,return false
		if(d2Width<d1Width)return false;
		//bear with
		d2.width(d2Width+100);
		//
		var flag=true;
		//left
		var left=function(e){
			if(!flag)return false;
			flag=false;
			if(btnIsChangeState){
				orientation="left";
			}
			if((d1Width+d1.scrollLeft())==d2Width){
				btnLeft.addClass(btnDisableCss);
				if(e){
					flag=true;
				}else{
					if(autRescrollTime){
						d1.animate({scrollLeft:0},autRescrollTime,function(){
							btnLeft.removeClass(btnDisableCss);
							btnRight.addClass(btnDisableCss);
							if(callback)callback($this,0);
							flag=true;
						});
					}else{
						if(autReboundState){
							orientation="right";
							if(aut){
								autoStop();
								autoPlay();
							}
						}
						flag=true;
					}
				}
			}else if(stepWidth+d1.scrollLeft()>=d2Width-d1Width){
				d1.animate({scrollLeft:d2Width-d1Width},speed,function(){
					btnLeft.addClass(btnDisableCss);
					btnRight.removeClass(btnDisableCss);
					if(callback)callback($this,d2Width-d1Width);
					flag=true;
				});
			}else{
				d1.animate({scrollLeft:d1.scrollLeft()+stepWidth},speed,function(){
					btnRight.removeClass(btnDisableCss);
					if(callback)callback($this,d1.scrollLeft());
					flag=true;
				});
			}
			return false;
		};
		//right
		var right=function(e){
			if(!flag)return false;
			flag=false;
			if(btnIsChangeState){
				orientation="right";
			}
			if(d1.scrollLeft()==0){
				btnRight.addClass(btnDisableCss);
				if(e){
					flag=true;
				}else{
					if(autRescrollTime){
						d1.animate({scrollLeft:d2Width-d1Width},autRescrollTime,function(){
							btnRight.removeClass(btnDisableCss);
							btnLeft.addClass(btnDisableCss);
							if(callback)callback($this,d2Width-d1Width);
							flag=true;
						});
					}else{
						if(autReboundState){
							orientation="left";
							if(aut){
								autoStop();
								autoPlay();
							}
						}
						flag=true;
					}
				}
			}else if((d1.scrollLeft())<=stepWidth){
				d1.animate({scrollLeft:0},speed,function(){
					btnRight.addClass(btnDisableCss);
					btnLeft.removeClass(btnDisableCss);
					if(callback)callback($this,0);
					flag=true;
				});
			}else{
				d1.animate({scrollLeft:d1.scrollLeft()-stepWidth},speed,function(){
					btnLeft.removeClass(btnDisableCss);
					if(callback)callback($this,d1.scrollLeft());
					flag=true;
				});
			}
			return false;
		};
		//gotoscroll
		var gotoscroll=function(xy){
			if(!flag)return false;
			flag=false;
			d1.animate({scrollLeft:xy},speed,function(){
				if(callback)callback($this,xy);
				flag=true;
			});
			return false;
		};
		//timer
		var timerID;
		var autoPlay=function(){
			switch(orientation)
			{
				case "left":timerID=window.setInterval(left,autTimer);break;
				case "right":timerID=window.setInterval(right,autTimer);break;
			}
			return false;
		};
		var autoStop = function(){
			window.clearInterval(timerID);
			return false;
		};
		if(aut){
			//ready autoPlay
			if(isWinLoad){
				$(window).load(autoPlay);
			}else{
				autoPlay();
			}
			//
			$this.hover(autoStop,autoPlay);
			if(btn){
				btnLeft.hover(autoStop,autoPlay);
				btnRight.hover(autoStop,autoPlay);
			}
		}
		//btn
		if(btn){
			btnLeft.click(left);
			btnRight.click(right);
			switch(orientation)
			{
				case "left":
					d1.scrollLeft(0);
					btnRight.addClass(btnDisableCss);
					break;
				case "right":
					d1.scrollLeft(d2Width-d1Width);
					btnLeft.addClass(btnDisableCss);
					break;
			}
		}
		if(!aut){
			return {$this:$this,autoStop:false,autoPlay:false,gotoscroll:gotoscroll};
		}
		return {$this:$this,autoStop:autoStop,autoPlay:autoPlay,gotoscroll:gotoscroll};
	};
})(jQuery);