/*
function:   $.fn.ueSelect(select美化版本)
author:     jin
depends:    jquery.js(1.2.6~1.4)
			
firstTime:  2010-03-25
lastTime:   2010-03-25
*/
(function($){
	$.fn.fmSelect=function(opt){
		//settings
		var settings=jQuery.extend(true,{
			template:
				'<div class="selectbtn" {selectbtn="true"}>'+
					'<span {selecttextbox="true"}>{selectText}</span>'+
					'<ul class="selectbox" {optionbox="true"} style="display:none;">{option}</ul>'+
				'</div>',//结构模板，大括号为模板标记
			optionWrap:'<li {option="true"} class="{optionSelectedCssName}">{text}</li>',//option循环包裹环境，支持多层包裹，大括号为模板标记
			selectStateIdName:"selectstate",//打开状态下selectbtn的id名称，只需保证不冲突即可
			selectStateCssName:"selectstate",//打开状态下selectbtn样式名，只需保证不冲突即可
			optionSelectedCssName:"optionselected",//选中样式，样式作用在{optionSelectedCssName}
			selBoxWidAdd:0,//宽度增幅，即程序自动计算select宽度后加上该值作为新对象的宽度
			optBoxWidAdd:0,//宽度增幅，即程序自动计算select宽度后加上该值作为新对象的宽度
			leftAdd:0,//left值偏移
			topAdd:18,//top值偏移
			openStar:function($sBtn,$opBox,w,val){},//点击打开或关闭前触发
			openEnd:function($sBtn,$opBox,w,val){},//点击打开或关闭后触发
			selectedFinish:function($sBtn,$opBox,w,val){},//回调，每次选择对应数据后所执行的函数
			finish:function($selectTextBox,val){},
			//反转
			rLeftAdd:0,//反转left值偏移
			rTopAdd:0,//反转top值偏移
			rSelectStateCssName:"selectstate2"//反转状态class
		},opt);
		var template=settings.template,
			optionWrap=settings.optionWrap,
			selectStateIdName=settings.selectStateIdName,
			selectStateCssName=settings.selectStateCssName,
			optionSelectedCssName=settings.optionSelectedCssName,
			leftAdd=settings.leftAdd,
			topAdd=settings.topAdd,
			selBoxWidAdd=settings.selBoxWidAdd,
			optBoxWidAdd=settings.optBoxWidAdd,
			openStar=settings.openStar,
			openEnd=settings.openEnd,
			selectedFinish=settings.selectedFinish,
			finish=settings.finish,
			rLeftAdd=settings.rLeftAdd,
			rTopAdd=settings.rTopAdd,
			rSelectStateCssName=settings.rSelectStateCssName;
		//this
		var $this=$(this);
		var keyListen=function(e){
			var list=e.data.list,
				hCss=e.data.hCss,
				boxHide=e.data.boxHide,
				size=list.size(),
				last=list.eq(size-1),
				first=list.eq(0);
				hList=list.filter("."+hCss),
				hSize=hList.size(),
				hNext=hList.next(),
				hPrev=hList.prev();
			if(e.keyCode==38){//上
				if(hSize==0){
					last.addClass(hCss);
				}else{
					hPrev.addClass(hCss);
					hList.removeClass(hCss);
				}
				return false;
			}else if(e.keyCode==40){//下
				if(hSize==0){
					first.addClass(hCss);
				}else{
					hNext.addClass(hCss);
					hList.removeClass(hCss);
				}
				return false;
			}else if(e.keyCode==13){//enter
				hList.click();
				return false;
			}else if(e.keyCode==27){//esc
				boxHide();
				return false;
			}
			e.stopPropagation();
			//don't return false is must kill other key
			//return false;
		};
		var addState=function($selectBtn){
			removeState();
			$selectBtn.addClass(selectStateCssName).attr("id",selectStateIdName);
			var $s=$("#"+selectStateIdName),
				$o=$s.find("[optionbox]");
			$o.show();
			$o.css('top', 0);
			if(($o.offset().top-$(window).scrollTop()+$o.height())>$(window).height()){
				var h=$o.height();
				$o.css({top:-(h)});
				if(rLeftAdd)
				$o.css({left:rLeftAdd});
				if(rTopAdd)
				$o.css({top:-(h+rTopAdd)});
				$s.addClass(rSelectStateCssName);
			}else{
				$o.css({top:0});
				if(leftAdd)
				$o.css({left:leftAdd});
				if(topAdd)
				$o.css({top:topAdd});
				$s.removeClass(rSelectStateCssName);
			}
//			if($o.offset().top<0){
//				$o.css({top:0});
//				if(leftAdd)
//				$o.css({left:leftAdd});
//				if(topAdd)
//				$o.css({top:topAdd});
//				$s.removeClass(rSelectStateCssName);
//			}
		};
		var removeState=function(){
			$("#"+selectStateIdName).find("[optionbox]").hide();
			$("#"+selectStateIdName).removeClass(selectStateCssName).removeAttr("id");
		};
		$this.each(function(_i){
			var _$this=$(this);
			_$this.hide();
			var __val=$(this).val();
			//template
			var laySelect="",
				layselectText="",
				layOption="";
			//layOption and layselectText
			_$this.children().each(function(i){
				layOption+=optionWrap.replace("{text}",$(this).text());
				if(i==_$this[0].selectedIndex){
					layselectText=$(this).text();
					layOption=layOption.replace("{optionSelectedCssName}",optionSelectedCssName);
				}else{
					layOption=layOption.replace("{optionSelectedCssName}","");
				}
			});
			//laySelect
			laySelect=template
				.replace('{option}',layOption).replace('{selectText}',layselectText)
				.replace(/\{/g,"").replace(/\}/g,"");
			//append
			if(_$this.next("[selectbtn]").size()>0)_$this.next("[selectbtn]").remove();
			_$this.after(laySelect);
			
			//select
			var $selectBtn=_$this.next("[selectbtn]");
			var	$selectTextBox=$selectBtn.find("[selecttextbox]");
			var	$optionBox=$selectBtn.find("[optionbox]"),
				$option=$selectBtn.find("[option]");
			finish($selectTextBox,__val);
			//settings
			var __w;
			function autoWidth(o){
				__w=_$this.width();
				//自动宽度获取失败
				if(0==__w)__w=parseInt(_$this.css("width"));
				if(!o){
					if(isNaN(__w)){
						setTimeout(function(){
							autoWidth(true);
							return false;
						},1000);
					}else{
						$selectBtn.width(__w+selBoxWidAdd);
						$optionBox.width(__w+optBoxWidAdd);
					}
				}else{
					if(isNaN(__w))__w=20;
					$selectBtn.width(__w+selBoxWidAdd);
					$optionBox.width(__w+optBoxWidAdd);
				}
			}autoWidth();
			var optionBoxShow=function(){
				addState($selectBtn);
				$(document).bind("keydown",{list:$option,hCss:optionSelectedCssName,boxHide:optionBoxHide},keyListen);
			};
			var optionBoxHide=function(){
				removeState();
				$(document).unbind("keydown",keyListen);
			};
			$selectBtn.click(function(e){
				openStar($selectBtn,$optionBox,__w,__val);
				if($optionBox.css("display")=="none"){
					optionBoxShow();
				}else{
					optionBoxHide();
				}
				openEnd($selectBtn,$optionBox,__w,__val);
				e.stopPropagation();
				return false;
			});
			$option.hover(
				function(){
					$(this).addClass(optionSelectedCssName);
				},function(){
					$(this).removeClass(optionSelectedCssName);
				}
			).click(function(e){
				optionBoxHide();
				$selectTextBox.html($(this).html());
				_$this[0].selectedIndex=$option.index($(this));
				autoWidth();
				selectedFinish(_$this,$selectBtn,$optionBox,__w,_$this.val());
				_$this.change();
				e.stopPropagation();
			});
			$(document).click(optionBoxHide);
		});
		//return
		return $this;
  	};
})(jQuery);
