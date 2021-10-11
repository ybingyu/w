/*
function:   cTip-v2.0
author:     jin
depends:    jquery.js(1.2.6~1.4)
times:  	2009-09-09;2010-07-09;2010-10-17
*/
$.fn.cTip=function(opt){
	//settings
	var settings=jQuery.extend(true,{
		isMouseMove:true,//是否随鼠标移动
		tipBoxIdName:"tipBox",//tipbox的id名
		tipBoxCssName:"tipBox",//tipbox的css名
		tipConAttr:"[tipCon]",//内容查找
		tipXAdd:15,//x轴偏移量
		tipYAdd:20,//y轴偏移量
		//tipXAdd:function($this,$tip,w){return -80;},//x轴偏移量
		//tipYAdd:function($this,$tip,h){return 20;},//y轴偏移量
		limit:{
			tag:"body",//限制对象
			isResizeUpdate:false,
			padL:0,//向内填充
			padR:0,//向内填充
			padB:0,//向内填充
			padT:0,//向内填充
			overLeftAdd:20,//越界反向方后偏移量
			overRightAdd:-30,//越界反向方后偏移量
			overTopAdd:20,//越界反向方后偏移量
			overBottomAdd:-20//越界反向方后偏移量
		},//限定
		tipCon:function(settings,$tip,$this,i){
			$tip.empty();
			var tipCon=settings.tipConAttr;
			var $tipCon=$this.eq(i).find(tipCon);
			if($tipCon.size()<1)$tipCon=$this.eq(i).next(tipCon);
			if($tipCon.size()>0){
				$tipCon.clone().appendTo($tip);
				$tip.find(tipCon).show();
				return true;
			}else{
				return false;
			}
		}//内容赋值;$tip:tip对象;$this:事件源对象;i:事件源下标;
	},opt);
	var $this=$(this);
	var isMouseMove=settings.isMouseMove,
		tipBoxIdName=settings.tipBoxIdName,
		tipBoxCssName=settings.tipBoxCssName,
		tipConAttr=settings.tipConAttr,
		tipXAdd=settings.tipXAdd,
		tipYAdd=settings.tipYAdd,
		limit=settings.limit,
		limTag=limit.tag,
		limIsResizeUpdate=limit.isResizeUpdate,
		limPadL=limit.padL,
		limPadR=limit.padR,
		limPadB=limit.padB,
		limPadT=limit.padT,
		limOverLeftAdd=limit.overLeftAdd,
		limOverRightAdd=limit.overRightAdd,
		limOverTopAdd=limit.overTopAdd,
		limOverBottomAdd=limit.overBottomAdd,
		tipCon=settings.tipCon;
	var $tip=false,tipWidth=0,tipHeight=0,limitL=0,limitR=0,limitT=0,limitB=0;
	//$tip
	if($("#"+tipBoxIdName).size()<1){
		$("body").append("<div id='"+tipBoxIdName+"' class='"+tipBoxCssName+"' style='position:absolute;display:none;'></div>");
	}$tip=$("#"+tipBoxIdName);
	//window resize
	function resizeFn(){
		var limitofset=$(limTag).offset();
		limitL=limitofset.left;
		limitR=limitL+$(limTag).width();
		limitT=limitofset.top;
		limitB=limitT+$(limTag).height();
		limitL=limitL-limPadL;
		limitR=limitR-limPadR;
		limitT=limitT-limPadT;
		limitB=limitB-limPadB;
	};resizeFn();
	if(limIsResizeUpdate)$(window).unbind("resize",resizeFn).bind("resize",resizeFn);
	function position(e){
		var cx=e.pageX;cy=e.pageY,tXAdd=tipXAdd,tYAdd=tipYAdd;
		if(typeof(tipXAdd)=="function")tXAdd=tipXAdd($tip,tipWidth);
		if(typeof(tipYAdd)=="function")tYAdd=tipYAdd($tip,tipHeight);
		//tip坐标
		var nx=cx+tXAdd,ny=cy+tYAdd;
		var _nx=nx,_ny=ny;
		//tip规格
		var tipStartX=nx;
		var tipEndX=tipStartX+tipWidth;
		var tipStartY=ny;
		var tipEndY=tipStartY+tipHeight;
		//超越方向
		var lOverWay="right",vOverWay="bottom";
		//逻辑处理
		function vShrink(){//垂直收缩
			if(vOverWay=="top"){//向上超越
				ny=limitT;
			}else if(vOverWay=="bottom"){//向下超越
				ny=ny-(tipEndY-limitB);
			}
		}
		function lShrink(){//水平收缩
			if(lOverWay=="left"){//向左超越
				nx=limitL;
			}else if(lOverWay=="right"){//向右超越
				nx=nx-(tipEndX-limitR);
			}
		}
		function unV(){//垂方向修改回滚
			ny=_ny;
		}
		function unL(){//水平方向修改回滚
			nx=_nx;
		}
		function vTurn(){//垂直翻转
			if(vOverWay=="top"){//向上超越
				ny=cy+limOverTopAdd;
			}else if(vOverWay=="bottom"){//向下超越
				ny=cy-tipHeight+limOverBottomAdd;
			}
		}
		function lTurn(){//水平翻转
			if(lOverWay=="left"){//向左超越
				nx=cx+limOverLeftAdd;
			}else if(lOverWay=="right"){//向右超越
				nx=cx-tipWidth+limOverRightAdd;
			}
		}
		function vShrinkElseTurn(finishTurn/*发生翻转时回调*/){//垂直收缩否则翻转
			vShrink();//垂直收缩
			if(nx<=cx && cx<=tipEndX){//鼠标水平方向进入tip区域
				unV();//垂直方向修改回滚
				vTurn();//垂直翻转
				if(typeof finishTurn!="undefined"){
					finishTurn();//翻转时回调
				}
				return false;
			}
			return true;
		}
		function lShrinkElseTurn(finishTurn/*发生翻转时回调*/){//水平收缩否则翻转
			lShrink();//水平收缩
			if(ny<=cy && cy<=tipEndY){//鼠标垂直方向进入tip区域
				unL();//水平方向修改回滚
				lTurn();//水平翻转
				if(typeof finishTurn!="undefined"){
					finishTurn();//翻转时回调
				}
				return false;
			}
			return true;
		}
		function isLOver(){//是否水平超越
			if(tipEndX>limitR){//向右超越
				lOverWay="right";
				return true;
			}else if(tipStartX<limitL){//向左超越
				lOverWay="left";
				return true;
			}else{
				return false;
			}
		}
		function isVOver(){//是否垂直超越
			if(tipEndY>limitB){//向下超越
				vOverWay="bottom";
				return true;
			}else if(tipStartY<limitT){//向上超越
				vOverWay="top";
				return true;
			}else{
				return false;
			}
		}
		if(isLOver()){//水平超越（可能还发生垂直超越）
			if(isVOver()){//垂直超越（即发生了垂直超越还发生了水平超越，所谓的双向超越）
				//双向翻转
				var flag=lShrinkElseTurn(//水平收缩否则翻转
					function(){//水平收缩失败会启用的回调，回调启用前已经发生水平翻转
						vShrinkElseTurn();//垂直收缩否则翻转
					}
				);
				//一下必须遵守，双向超越情况下，其中一边发生收缩，另外一边一定得翻转
				if(flag){//水平收缩成功
					vTurn();//垂直翻转
					if(isVOver()){//如果垂直超越
						unV();//垂直方向修改回滚
						var flag2=vShrinkElseTurn();//垂直收缩否则翻转						
						if(flag2){//如果垂直收缩成功
							unL();//水平方向修改回滚
							lTurn();//水平翻转
						}
					}
					//如果垂直翻转再发生垂直超越那就无能为力了，所以这里不再做其他判断
				}
			}else{//仅仅发生水平超越
				lShrinkElseTurn();//水平收缩否则翻转
			}
		}else if(isVOver()){//如果只发生垂直超越
			vShrinkElseTurn();//垂直收缩否则翻转
		}
		$tip.css({left:nx,top:ny}).show();
	}
	function show(e,html){
		e=$.event.fix(e);
		if(html){
			$tip.html(html);
			tipWidth=$tip.width();
			tipHeight=$tip.height();
			position(e);
		}else{
			$tip.hide();
		}
	}
	function hide(){
		$tip.hide();
	}
	//each
	if($this){
		$this.each(function(i){
			$(this).hover(function(e){
				$tip.html("loading...");
				tipWidth=$tip.width();
				tipHeight=$tip.height();
				position(e);
				if(isMouseMove){
					$(this).bind("mousemove",position);
				}else{
					position(e);
				}
				//重新赋值内容故也应重新取值width值并重新定位
				if(tipCon(settings,$tip,$this,i)){
					tipWidth=$tip.width();
					tipHeight=$tip.height();
					position(e);
				}else{
					$tip.hide();
				}
			},function(e){
				$tip.hide();
				if(isMouseMove){
					$(this).unbind("mousemove",position);
				}
			});
		});
	}
	return {show:show,hide:hide};
};
