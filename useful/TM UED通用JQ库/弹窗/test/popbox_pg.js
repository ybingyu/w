/*
function:   popBox-v2.5.1
author:     jin
times:  	2009-8-2;2010-05-11;2010-07-15;2010-09-20;2010-12-01
*/
//弹窗插件
$.fn.popBox=function(opt){
	//settings 配置
	var settings=jQuery.extend(true,{
		mask:{
			attrName:"pbMask",
			idName:"pbMask",
			alpha:50,
			zIndex:99,
			bg:"#000000"//"url(mask.gif)"
		},//遮罩，取消该功能请设置false
		drag:{
			handle:"[pbDrag]",//拖拽对象
			winLimit:true//是否窗口限定
		},//拖曳配置
		closes:"[close]",//关闭属性
		zIndex:100,//z-index
		autoPosition:{
			xAdd:0,//弹窗定位x轴偏移量
			yAdd:0,//弹窗定位y轴偏移量
			scrollP:true,//scroll触发自动定位开关
			resizeP:true//resize触发自动定位开关
		},//滚动或改变窗口大小时自动定位并偏移，取消该功能请设置false
		isFixed:true,//是否position:fixed，默认启用，遇到ie6自动失效，如果取消全部浏览器，请直接设置false
		openFinish:function($self,$mask){},//弹窗触发时回调
		closeFinish:function($self,$mask){}//关闭触发时回调
	},opt);
	//对象赋值
	var $self=$(this);
	return {
		execute:function(){
			//对象初始化
			var self=this;
			$self.click(function(e){e.stopPropagation();});
			//初始化window规格状态并保存
			$.wState();
			//如果启用fiex定位则ie6兼容判断
			var isFixed=settings.isFixed;
			if(isFixed){isFixed=$.wBase.supportFixed();}
			if(isFixed){
				$self.css({zIndex:settings.zIndex,position:"fixed"});
			}else{
				$self.css({zIndex:settings.zIndex,position:"absolute"});
			}
			//刷新this对象的宽高值
			self.refurTSize=function(){
				self.tWidth=$self.outerWidth();
				self.tHeight=$self.outerHeight();
			};
			//拖曳
			self.pbDragDrop=function(){
				if(settings.drag){
					return $.dragDrop({
						$self:$self,
						handle:settings.drag.handle,
						mouseMoveExecute:function(opt){
							var tx=opt.tx,ty=opt.ty;
							if(settings.drag.winLimit){
								$.dragLimit({
									dragW:self.tWidth,
									dragH:self.tHeight,
									L:$.wLimit().l,
									T:$.wLimit().t,
									R:$.wLimit().r,
									B:$.wLimit().b,
									tx:tx,
									ty:ty,
									callback:function(tx,ty){
										if(isFixed){
											$self.css({left:(tx-$.wScrollLeft())+"px",top:(ty-$.wScrollTop())+"px"});
										}else{
											$self.css({left:tx+"px",top:ty+"px"});
										}
									}
								});
							}else{
								if(isFixed){
									$self.css({left:(tx-$.wScrollLeft())+"px",top:(ty-$.wScrollTop())+"px"});
								}else{
									$self.css({left:tx+"px",top:ty+"px"});
								}
							}
						},
						mouseUpExecute:function($self){},
						noMoveExecute:function($self){}
					});
				}
			}
			if(settings.drag){
				self.pbDragDrop();
			}
			//创建遮罩层
			function createMask(){
				var maskwidth=Math.max($.wState().sw,$.wState().cw),
					maskheight=Math.max($.wState().sh,$.wState().ch);
				if($("#"+settings.mask.idName).size()<1){
					$("body").append(
						'<div id="'+settings.mask.idName+'" '+settings.mask.attrName+'="true" style="position:absolute;width:'+maskwidth+'px;height:'+maskheight+
						'px;left:0;top:0;right:0;bottom:0;background:'+settings.mask.bg+';filter:alpha(opacity='+
						settings.mask.alpha+');opacity:'+(settings.mask.alpha/100)+
						';/*-moz-user-select:none;-khtml-user-select:none;user-select:none;*/z-index:'+settings.mask.zIndex+';display:none;"></div>'
					);
				}
				self.mask=$("#"+settings.mask.idName);
			}
			//resize监听函数
			function pbResize(){
				$.wState(true);//刷新window规格状态并保存
				if(self.mask){
					//先获取小值再timeout延迟获取大值，否则ie下还原按钮缩小窗口时遮罩层将无法缩小
					self.mask.width(Math.min($.wState().sw,$.wState().cw));
					self.mask.height(Math.min($.wState().sh,$.wState().ch));
					setTimeout(function(){
						$.wState(true);
						self.mask.width(Math.max($.wState().sw,$.wState().cw));
						self.mask.height(Math.max($.wState().sh,$.wState().ch));
					},100);
				}
				if(settings.autoPosition?settings.autoPosition.resizeP:false){self.pbPositionMiddle();}
				return false;
			}
			//popbox positionMiddle 弹窗居中定位
			//@callback:function(nx,ny){return{nx:nx,ny:ny}}
			self.pbPositionMiddle=function(callback){
				if(settings.autoPosition){
					var nx=($.wState().cw/2-self.tWidth/2+settings.autoPosition.xAdd),
						ny=($.wState().ch/2-self.tHeight/2+settings.autoPosition.yAdd);
					if(!isFixed){
						nx=nx+$.wScrollLeft();
						ny=ny+$.wScrollTop();
					}
					if(typeof callback=="function"){
						var t=callback(nx,ny);
						nx=t.nx;
						ny=t.ny;
					}
					$self.css({left:nx+"px",top:ny+"px"});
				}
				return false;
			}
			//关闭弹窗
			self.pbClose=function(){
				$self.hide();
				if(settings.mask){
					self.mask.hide();
				}
				if(settings.autoPosition?settings.autoPosition.scrollP:false){
					$(window).unbind("scroll",self.pbPositionMiddle);
				}
				$(window).unbind("resize",pbResize);
				settings.closeFinish($self,self.mask);
				return false;
			}
			//打开弹窗
			self.pbOpen=function(){
				//遮罩层
				if(settings.mask){
					createMask();
					$("#"+settings.mask.idName).show();
				}
				//显示弹窗
				$self.show();
				//刷新this size数据前请先执行$self.show();以保证数据获取的是可视效果下的值
				self.refurTSize();
				//局中监听
				if(settings.autoPosition?settings.autoPosition.scrollP:false){
					$(window).bind("scroll",self.pbPositionMiddle);
				}
				//局中，局中运行前请先执行$self.show();，为此干脆连监听一起移动到下面来
				if(settings.autoPosition){
					self.pbPositionMiddle();
				}
				//resize 监听之前得保证已经运行了createMask();，为此干脆连监听一起移动到下面来
				$(window).bind("resize",pbResize);pbResize();
				//关闭功能
				$self.find(settings.closes).one("click",function(e){
					self.pbClose();
					return false;
				});
				//回调
				settings.openFinish($self,self.mask);
			}
			
		},//入口
		self:$self,//自身
		mask:false,//遮罩
		tWidth:0,//弹窗宽度
		tHeight:0,//弹窗高度
		refurTSize:function(){},//刷新弹窗规格
		pbOpen:function(){},//弹窗打开
		pbPositionMiddle:function(){},//弹窗局中
		pbDragDrop:function(){},//弹窗拖拽
		pbClose:function(){}//弹窗关闭
	}
};
$.extend({
	wBase:{//窗体基本状态保存
		_supportFixed:false,//是否支持fiex状态（缓存区）
		supportFixed:function(){//是否支持fiex状态
			if(!this._supportFixed){
				if($.browser.msie && $.browser.version=="6.0"){
					this._supportFixed=false;
				}else{
					this._supportFixed=true;
				}
			}
			return this._supportFixed;
		}
	},
	_wLimit:false,//window限定规格保存（缓存区）
	wLimit:function(){//window限定规格保存
		if(!this._wLimit){
			this._wLimit={
				l:0,
				r:this.wState().sw,
				t:0,
				b:this.wState().sh
			}
		}
		return this._wLimit;
	},
	_wBody:false,//body对象临（缓存区）
	wBody:function(){//body对象
		if(!this._wBody){
			this._wBody=(document.compatMode && document.compatMode!="BackCompat")?document.documentElement:document.body;
		}
		return this._wBody;
	},
	wScrollTop:function(){return document.all?this.wBody().scrollTop:window.pageYOffset;},//scrolltop
	wScrollLeft:function(){return document.all?this.wBody().scrollLeft:window.pageXOffset;},//scrollleft
	_wState:false,//window规格状态保存（缓存区）
	wState:function(r){//window规格状态保存@r:是否刷新当前数据
		if(!this._wState || r){
			this._wState={
				sw:this.wBody().scrollWidth,//scrollWidth
				sh:this.wBody().scrollHeight,//scrollHeight
				cw:this.wBody().clientWidth,//clientWidth
				ch:this.wBody().clientHeight//clientHeight
			}
		}
		return this._wState;
	},
	dragLimit:function(opt){//拖曳限定
		var settings=jQuery.extend(false,{
			dragW:dragW,
			dragH:dragH,
			L:L,
			T:T,
			R:R,
			B:B,
			tx:tx,
			ty:ty,
			callback:function(tx,ty){}
		},opt);
		var dragW=settings.dragW,
			dragH=settings.dragH,
			L=settings.L,
			T=settings.T,
			R=settings.R,
			B=settings.B,
			tx=settings.tx,
			ty=settings.ty,
			callback=settings.callback;
		var oRight=tx+dragW-R,
			oBottom=ty+dragH-B;
		if(oRight>0)tx-=oRight;					
		if(oBottom>0)ty-=oBottom;
		if(L>tx)tx=L;
		if(T>ty)ty=T;
		callback(tx,ty);
		return false;
	},
	dragDropMouseDwonBindState:true,//document的mousedown绑定状态
	dragDrop:function(opt){//拖曳功能函数
		var self=this;
		//settings
		var settings=jQuery.extend(false,{
			$self:false,
			handle:false,
			mouseDownExecute:function(opt){},
			mouseMoveExecute:function(opt){},
			mouseUpExecute:function(opt){},
			noMoveExecute:function(opt){
				var $self=opt.$self,cxOld=opt.cxOld,cyOld=opt.cyOld,cx=opt.cx,cy=opt.cy,
					txOld=opt.txOld,tyOld=opt.tyOld,tx=opt.tx,ty=opt.ty,dx=opt.dx,dy=opt.dy;
			}
		},opt);
		// old x and y
		var cxOld=0;cyOld=0;
		//currently x and y
		var cx=0,cy=0;
		//this x and y
		var tx=0,ty=0;
		//now x and y
		var txOld=0,tyOld=0;
		//drop x and y
		var dx=0,dy=0;
		//init
		var $self=settings.$self;
		//start
		function startExecute(e){
			cxOld=e.pageX;
			cyOld=e.pageY;
			cx=cxOld;
			cy=cyOld;
			txOld=$self.position().left;
			tyOld=$self.position().top;
			tx=txOld;
			ty=tyOld;
			$(document).mousemove(moveExecute);
			$(document).mouseup(stopExecute);
			settings.mouseDownExecute({$self:$self,cxOld:cxOld,cyOld:cyOld,cx:cx,cy:cy,txOld:txOld,tyOld:tyOld,tx:tx,ty:ty,dx:dx,dy:dy});
			if($self[0].setCapture)$self[0].setCapture();
			//else if(window.captureEvents)window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);  
			return false;
		}
		var handle=settings.handle;
		if(handle){//alert("1");
			$self.find(handle).css({cursor:"move"});
			$self.find(handle).mousedown(startExecute);
		}else{//alert("2");
			$self.css({cursor:"move"});
			$self.mousedown(startExecute);
		}
		function unbind(){
			if(handle){
				$self.find(handle).css({cursor:"default"});
				$self.find(handle).unbind("mousedown",startExecute);
			}else{
				$self.css({cursor:"default"});
				$self.unbind("mousedown",startExecute);
			}
		}
		//moveExecute
		function moveExecute(e){
			cx=e.pageX;
			cy=e.pageY;
			dx=cx-cxOld;
			dy=cy-cyOld;
			tx=txOld+dx;
			ty=tyOld+dy;
			settings.mouseMoveExecute({$self:$self,cxOld:cxOld,cyOld:cyOld,cx:cx,cy:cy,txOld:txOld,tyOld:tyOld,tx:tx,ty:ty,dx:dx,dy:dy});
			return false;
		}
		//stopExecute
		function stopExecute(e){
			$(document).unbind("mousemove",moveExecute);
			$(document).unbind("mouseup",stopExecute);
			settings.mouseUpExecute({$self:$self,cxOld:cxOld,cyOld:cyOld,cx:cx,cy:cy,txOld:txOld,tyOld:tyOld,tx:tx,ty:ty,dx:dx,dy:dy});
			if(cxOld==cx && cyOld==cy){
				settings.noMoveExecute({$self:$self,cxOld:cxOld,cyOld:cyOld,cx:cx,cy:cy,txOld:txOld,tyOld:tyOld,tx:tx,ty:ty,dx:dx,dy:dy});
			}
			if($self[0].releaseCapture)$self[0].releaseCapture();
			//else if(window.releaseEvents)window.releaseEvents(Event.MOUSEMOVE|Event.MOUSEUP);  
			return false;//个别情况下return false会使得鼠标脱离捕获对象后捕获对象丢失即window.captureEvents失效
		}
		//stopPropagation
		//$self.click(function(e){e.stopPropagation();});
		return {$self:$self,unbind:unbind};
	}
});

//弹窗ui层
var tmdUi={
	pbSimple:{
		settings:{
			mask:{
				attrName:"popBoxMask",
				idName:"popBoxMask",
				alpha:50,
				zIndex:99,
				bg:"#000000"//"url(images/pb/mask.gif)"
			},//遮罩
			drag:{
				handle:"[header]",
				winLimit:true
			},//拖拽
			zIndex:100
		},
		pbHmtl:
			'<div id="popBox1" class="popBox">'+
			'	<div header="true" class="pbHeader"><div headerTxt="true" class="pbHeaderTxt">lightboxTitle</div><a close="true" class="pbClose" href="#">×</a></div>'+
			'	<div main="true" class="pbMain">lightboxContentTxt</div>'+
			'	<div btn="true" class="pbBtn"><input type="button" ok="true" value="确定" /><input cancel="true" close="true" type="button" value="取消" /></div>'+
			'</div>',//弹窗html
		execute:function(opt){},//调用
		//以下配置一般不需要修改和使用
		popbox1:false,//弹窗对象
		pbHeaderTxt:false,//标题头
		pbMain:false,//主体
		pbBtnOK:false,//ok按钮
		pbBtnCancel:false,//取消按钮
		init:true//初始化状态，默认true激活状态，执行过一次置为死亡状态
	}
};
tmdUi.pbSimple.execute=function(opt){
	//如果尚未初始化，或者带有动态settings值，则，重建弹窗
	var settings=$.extend(true,{btnOKShow:true,btnCancelShow:true},opt);
	if(tmdUi.pbSimple.init || settings.settings){
		$("body").append(tmdUi.pbSimple.pbHmtl);
		tmdUi.pbSimple.popbox1=$('#popBox1').popBox(jQuery.extend(true,tmdUi.pbSimple.settings,settings.settings));
		tmdUi.pbSimple.popbox1.execute();
		tmdUi.pbSimple.pbHeaderTxt=tmdUi.pbSimple.popbox1.self.find("[headerTxt]"),
		tmdUi.pbSimple.pbMain=tmdUi.pbSimple.popbox1.self.find("[main]");
		tmdUi.pbSimple.pbBtnOK=tmdUi.pbSimple.popbox1.self.find("[ok]");
		tmdUi.pbSimple.pbBtnCancel=tmdUi.pbSimple.popbox1.self.find("[cancel]");
		if(settings.btnOKShow)
		{
			if(settings.btnOKClick){
				tmdUi.pbSimple.pbBtnOK.click(settings.btnOKClick);
			}
		}else{
			tmdUi.pbSimple.pbBtnOK.remove();
		}
		if(!settings.btnCancelShow){
			tmdUi.pbSimple.pbBtnCancel.remove();
		}
		tmdUi.pbSimple.init=false;
	}
	tmdUi.pbSimple.pbHeaderTxt.html(settings.title);
	tmdUi.pbSimple.pbMain.html(settings.content);
	tmdUi.pbSimple.popbox1.pbOpen();
	return {pbClose:function(){tmdUi.pbSimple.popbox1.pbClose();}}
};