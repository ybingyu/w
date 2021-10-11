/*
function:   $.fn.ueFetch
author:     jin
depends:    jquery-1.4.pack.js
			
firstTime:  2010-03-25
lastTime:   2010-07-14
*/
var fetchCxToNum=function(opt){
	//settings		
	var settings=jQuery.extend(true,{
		arithmetic:{
			minPx:0,//最小像素限定
			maxPx:200,//最大像素限定
			jumpNum:1,//每次跳格数值
			jumpPx:1//每次跳格像素
		},//算法配置
		cx:0,//当前坐标
		returnNum:-1//返回数值
	},opt);
	var minPx=settings.arithmetic.minPx,
		maxPx=settings.arithmetic.maxPx,
		jumpNum=settings.arithmetic.jumpNum,
		jumpPx=settings.arithmetic.jumpPx,
		cx=settings.cx,
		returnNum=settings.returnNum;
	if(cx<minPx){
		cx=minPx;
	}else if(cx>maxPx){
		cx=maxPx;
	}
	var lenx=cx-minPx;
	lenx=lenx-(lenx%jumpPx);
	returnNum=(lenx/jumpPx)*jumpNum;
	settings.cx=cx;
	settings.returnNum=returnNum;
	return settings;
};
var fetchNumToCx=function(opt){
	//settings		
	var settings=jQuery.extend(true,{
		arithmetic:{
			minPx:0,//最小像素限定
			maxPx:200,//最大像素限定
			jumpNum:1,//每次跳格数值
			jumpPx:1//每次跳格像素
		},//算法配置
		num:-1,//数值
		returnCx:0//对应坐标
	},opt);
	var minPx=settings.arithmetic.minPx,
		maxPx=settings.arithmetic.maxPx,
		jumpNum=settings.arithmetic.jumpNum,
		jumpPx=settings.arithmetic.jumpPx,
		num=settings.num,
		returnCx=settings.returnCx;
	num=num-(num%jumpNum);
	var lenx=(num/jumpNum)*jumpPx;
	returnCx=(lenx+minPx);
	settings.num=num;
	settings.returnCx=returnCx;
	return settings;
};
$.fn.dragDrop=function(opt){
	//settings
	var settings=jQuery.extend(true,{
		onOff:false,//开关
		mouseDownExecute:function($this){},
		mouseMoveExecute:function($this,nx,ny){},
		mouseUpExecute:function($this){},
		noMoveExecute:function($this){}
	},opt);
	if(!settings.onOff)return false;		
	// old x and y
	var ox=0;oy=0;
	//this x and y
	var tx=0,ty=0;
	//currently x and y
	var cx=0,cy=0;
	//drop x and y
	var dx=0,dy=0;
	//now x and y
	var nx=0,ny=0;
	//init
	var $this=$(this);
	//move state 
	var moveState=false;
	//start
	var startExecute=function(e){
		ox=e.pageX;
		oy=e.pageY;
		tx=$this.position().left;
		ty=$this.position().top;
		$(document).mousemove(moveExecute);
		$(document).mouseup(stopExecute);
		settings.mouseDownExecute($this);
		if($.browser.msie){$this[0].setCapture();}
		//stopPropagation
		//e.stopPropagation();
		return false;
	};
	$this.css({cursor:"move"});
	$this.mousedown(startExecute);
	//moveExecute
	var moveExecute=function(e){
		cx=e.pageX;
		cy=e.pageY;
		dx=cx-ox;
		dy=cy-oy;
		nx=tx+dx;
		ny=ty+dy;
		settings.mouseMoveExecute($this,nx,ny);
		return false;
	};
	//stopExecute
	var stopExecute=function(e){
		$(document).unbind("mousemove",moveExecute);
		$(document).unbind("mouseup",stopExecute);
		if($.browser.msie){$this[0].releaseCapture();}
		settings.mouseUpExecute($this);
		if(ox==cx && oy==cy){
			settings.noMoveExecute();
		}
		return false;
	};
	//stopPropagation
	$this.click(function(e){e.stopPropagation();});
	return false;
};
$.fn.fmFetch=function(opt){
	//settings
	var settings=jQuery.extend(true,{
		template:
			'<div {fetchBox="true"} class="fetchBox">'+
			'	<div {bar="true"} class="bar">'+
			'		<div {control="true"} class="control"></div>'+
			'	</div>'+
			'	<div {returnNum="true"} class="returnNum">0</div>'+
			'</div>',//结构模板，大括号为模板标记
		controlStateIdName:"controlStateId",//状态id，只需保证不冲突即可
		controlStateCssName:"controlStateNow",//状态样式
		controlOnOff:true,//调节开关
		arithmetic:{
			minPx:0,//最小像素限定
			maxPx:200,//最大像素限定
			jumpNum:1,//每次跳格数值
			jumpPx:1//每次跳格像素
		}//算法配置
	},opt);
	var template=settings.template,
		controlStateIdName=settings.controlStateIdName,
		controlStateCssName=settings.controlStateCssName,
		controlOnOff=settings.controlOnOff,
		arithmetic=settings.arithmetic,
			minPx=arithmetic.minPx,
			maxPx=arithmetic.maxPx,
			jumpNum=arithmetic.jumpNum,
			jumpPx=arithmetic.jumpPx;
	var allPx=maxPx-minPx;
	var allNum=(allPx/jumpPx)*jumpNum;
	var halfPx=Math.floor(allPx/2);
	var halfNum=Math.floor(allNum/2);
	template=template.replace(/\{/g,"").replace(/\}/g,"");
	//this
	var $this=$(this);
	$this.each(function(){
		var _$this=$(this);
		//_$this.hide();
		_$this.next("[fetchBox]").remove();
		_$this.after(template);
		var $fetchBox=_$this.next();
		var $returnNum=$fetchBox.find("[returnNum]"),
			$control=$fetchBox.find("[control]"),
			$bar=$fetchBox.find("[bar]");
		//state 获得焦点
		var getState=function(){
			$("#"+controlStateIdName).removeClass(controlStateCssName).removeAttr("id");
			$control.attr("id",controlStateIdName).addClass(controlStateCssName);
			return false;
		};
		//numToCx
		var numToCx=function(val){
			var _fetchNumToCx=fetchNumToCx({
				arithmetic:arithmetic,
				num:parseInt(val) || 0
			});
			var _fetchCxToNum=fetchCxToNum({
				arithmetic:arithmetic,
				cx:_fetchNumToCx.returnCx
			});
			$control.css({left:_fetchCxToNum.cx});
			$returnNum.html(_fetchCxToNum.returnNum);
			_$this.val(_fetchCxToNum.returnNum);
			return false;
		};
		//cxToNum
		var cxToNum=function(val){
			var _fetchCxToNum=fetchCxToNum({
				arithmetic:arithmetic,
				cx:parseInt(val) || 0
			});
			$control.css({left:_fetchCxToNum.cx});
			$returnNum.html(_fetchCxToNum.returnNum);
			_$this.val(_fetchCxToNum.returnNum);
			return false;
		};
		//on
		if(controlOnOff){
			//bar
			$bar.click(function(e){
				var barLeft=parseInt($bar.offset().left),
					cx=e.pageX;
				var nx=cx-barLeft-5;
				//赋值操作
				cxToNum(nx);
				getState();
			});
			//control dragdrop
			$control.dragDrop({
				onOff:true,
				mouseDownExecute:getState,
				mouseMoveExecute:function($this,nx,ny){
					cxToNum(nx);
					return false;
				}
			});
			//dblclick
			$control.dblclick(function(){
				cxToNum(halfPx);
			}).attr("title","双击50%自动调整");
			//input event
			_$this.change(function(){
				numToCx(_$this.val());
				getState();
			}).keydown(function(e){
				if(e.keyCode==13){
					numToCx(_$this.val());
					getState();
				}
			});
		}else{
			$control.attr("title","调节锁定");
		}
		//default value
		numToCx(_$this.val());
	});
	//keydown
	$(document).keydown(function(e){
		if(e.keyCode==38 || e.keyCode==39){//上 vs 右
			if($("#"+controlStateIdName)){
				var $control=$("#"+controlStateIdName);
				var left=parseInt($control.css("left"));
				var _fetchCxToNum=fetchCxToNum({
					arithmetic:arithmetic,
					cx:left+jumpPx
				});
				$control.css({left:_fetchCxToNum.cx});
				var $fetchBox=$control.closest("[fetchBox]");
				var $returnNum=$fetchBox.find("[returnNum]");
				$returnNum.html(_fetchCxToNum.returnNum);
				$fetchBox.prev("input").val(_fetchCxToNum.returnNum);
			}
			return false;
		}else if(e.keyCode==40 || e.keyCode==37){//下 vs 左
			if($("#"+controlStateIdName)){
				var $control=$("#"+controlStateIdName);
				var left=parseInt($control.css("left"));
				var _fetchCxToNum=fetchCxToNum({
					arithmetic:arithmetic,
					cx:left-jumpPx
				});
				$control.css({left:_fetchCxToNum.cx});
				var $fetchBox=$control.closest("[fetchBox]");
				var $returnNum=$fetchBox.find("[returnNum]");
				$returnNum.html(_fetchCxToNum.returnNum);
				$fetchBox.prev("input").val(_fetchCxToNum.returnNum);
			}
			return false;
		}
		//don't return false
		//return false;
	});
	//return
	return $this;
};
/*
function:	自动调用
depends:    $.fn.fmFetch
readme:		请务必保证maxLeft-minLeft可以整除jumpPx
*/
//$(window).load(function(){
//	$("input").fmFetch({
//		template:
//			'<div {fetchBox="true"} class="fetchBox">'+
//			'	<div {bar="true"} class="bar">'+
//			'		<div {control="true"} class="control"></div>'+
//			'	</div>'+
//			'	<div {returnNum="true"} class="returnNum">0</div>'+
//			'</div>',//结构模板，大括号为模板标记
//		controlStateIdName:"controlState",//状态id，只需保证不冲突即可
//		controlStateCssName:"controlState",//状态样式
//		controlOnOff:true,//调节开关
//		arithmetic:{
//			minPx:-1,//最小像素限定
//			maxPx:199,//最大像素限定
//			jumpNum:1,//每次跳格数值
//			jumpPx:2//每次跳格像素
//		}//算法配置
//	});
////	//二次更新
////	$("input").eq(0).val(50).change();
////	$("input").eq(1).val(50).change();
//});