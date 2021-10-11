/*
function:   menu(无限级别下拉菜单)
author:     jin
depends:    jquery-1.4.pack.js
			
firstTime:  2009-9-10
lastTime:   2010-03-16
warring：	li部分position:relative请使用position:static替代，程序将自动判断合适时间替换该值，否则将出现叠放顺序问题bug
*/
(function($){
	$.fn.UE_menu=function(opt){
		//settings
		var settings=jQuery.extend(
			{
				mUlAutoWidth:true,//菜单（普通模式路径：ul）是否自动设定宽度，此设置针对二级以上菜单
				mUlAutoWidthLeftOver:0,//菜单（普通模式路径：ul）自动设定宽度时，菜单默认left为父级宽度，你可以在此基础增减left值
				mUlLiAOnCss:"on",//二级以上菜单当前菜单状态保持的css，该css同时作用在（普通模式路径：ul > li和ul > li >a）上面
				mFirstSelector:" > li",//第一级菜单，选择器，链接selector组合选择器
				mParent:"li",//this find选择器，事件增加对象
				mSub:"ul",//this children选择器，将要展开的ul子集
				mBugIdLayerWidth:function($ul,_w){
					if($ul.children("li").css("width")=="auto"){
						$ul.children("li").width(w-0);
					}
					if($ul.children("li").children("a").css("width")=="auto"){
						$ul.children("li").children("a").width(w-0);
					}
				},
				//ie 6,7下存在的（普通模式路径：li）宽度无法自适应宽度大小的bug补充，
				//如果你的ie6也出现这样的情况请开启该功能，该功能的开启有一定的性能损失，关闭该功能直接把值设置为false即可。
				mBugFirstIeLayerNextMarginTop:-4,//与下面相同，适用首项bug。
				mBugIeLayerNextMarginTop:-4 //ie 7下，存在的有子集情况，元素底部跳空bug，根据布局不同可能出现的像素差也不一样，
											//请手工设置该值，将next元素margin top设置一个负值即可。
											//该功能的开启有一定的性能损失，关闭该功能直接把值设置为false即可。
			},
			opt
		);
		var $this=$(this);
		//main
		main($this,settings);
		//return
		return $this;
    };
    //autoplay
	var main=function($this,settings){
		//settings
		var mFirstLiBind=settings.mFirstLiBind,
			mUlAutoWidth=settings.mUlAutoWidth,
			mUlAutoWidthLeftOver=settings.mUlAutoWidthLeftOver,
			mUlLiAOnCss=settings.mUlLiAOnCss,
			mFirstSelector=settings.mFirstSelector,
			mParent=settings.mParent,
			mSub=settings.mSub,
			mBugIdLayerWidth=settings.mBugIdLayerWidth,
			mBugFirstIeLayerNextMarginTop=settings.mBugFirstIeLayerNextMarginTop,
			mBugIeLayerNextMarginTop=settings.mBugIeLayerNextMarginTop;
		//bind  针对第一级
		var selector=$this.selector;
		var li=$(selector+mFirstSelector);
		li.hover(
			function(){
				//position
				//{
					$(this).css("position","relative");
				//}
				//css
				//{
					$(this).addClass(mUlLiAOnCss);
					$(this).children("a").addClass(mUlLiAOnCss);
				//}
				//width
				//{
					//修补，ie 7 下不自动扩展到ul宽度--star
					var $ul=$(this).children(mSub);
					if(mBugIdLayerWidth){
						mBugIdLayerWidth($ul,$ul.width());
					}
					//修补，ie 7 下不自动扩展到ul宽度--end
					//修补，ie6 ie7 4像素空白-star
					if(mBugFirstIeLayerNextMarginTop){
						if($.browser.msie){
							if($.browser.version=="6.0" ||　$.browser.version=="7.0"){
								if($ul.size()>0){
									$(this).css("margin-bottom",mBugFirstIeLayerNextMarginTop+"px");
								}
							}
						}
					}
					//修补，ie6 ie7 4像素空白-end
				//}
				//show
				//{
					$(this).children(mSub).show();
				//}
			},
			function(){
				//position
				//{
					$(this).css("position","static");
				//}
				//css
				//{
					$(this).removeClass(mUlLiAOnCss);
					$(this).children("a").removeClass(mUlLiAOnCss);
				//}
				//width
				//{
					//修补，ie6 ie7 4像素空白-star
					var $ul=$(this).children(mSub);
					if(mBugFirstIeLayerNextMarginTop){
						if($.browser.msie){
							if($.browser.version=="6.0" ||　$.browser.version=="7.0"){
								if($ul.size()>0){
									$(this).css("margin-bottom","0");
								}
							}
						}
					}
					//修补，ie6 ie7 4像素空白-end
				//}
				//hide
				//{
					$(this).children(mSub).hide();
				//}
			}
		);
		//第二级之后
		li.find(mParent).hover(
			function(){
				//z-index
				//{
					$(this).css("position","relative");
				//}
				//css
				//{
					$(this).addClass(mUlLiAOnCss);
					$(this).children("a").addClass(mUlLiAOnCss);
				//}
				//width
				//{
					var $ul=$(this).children(mSub);
					//修补，ie 7 下不自动扩展到ul宽度--star
					if(mBugIdLayerWidth){
						mBugIdLayerWidth($ul,$ul.width());
					}
					//修补，ie 7 下不自动扩展到ul宽度--end
					if(mUlAutoWidth){
						if($ul.attr("jsLeft")!="true"){
							var width=parseInt($(this).closest(mSub).innerWidth());
							$ul.css("left",(width+mUlAutoWidthLeftOver)+"px").attr("jsLeft","true");
						}
					}
					//修补，ie6 ie7 4像素空白-star
					if(mBugIeLayerNextMarginTop){
						if($.browser.msie){
							if($.browser.version=="6.0" ||　$.browser.version=="7.0"){
								if($ul.size()>0){
									$(this).css("margin-bottom",mBugIeLayerNextMarginTop+"px");
								}
							}
						}
					}
					//修补，ie6 ie7 4像素空白-end
				//}
				//show
				//{
					$(this).children(mSub).show();
				//}
			},
			function(){
				//z-index
				//{
					$(this).css("position","static");
				//}
				//css
				//{
					$(this).removeClass(mUlLiAOnCss);
					$(this).children("a").removeClass(mUlLiAOnCss);
				//}
				//width
				//{
					//修补，ie6 ie7 4像素空白-star
					var $ul=$(this).children(mSub);
					if(mBugIeLayerNextMarginTop){
						if($.browser.msie){
							if($.browser.version=="6.0" ||　$.browser.version=="7.0"){
								if($ul.size()>0){
									$(this).css("margin-bottom","0");
								}
							}
						}
					}
					//修补，ie6 ie7 4像素空白-end
				//}
				//hide
				//{
					$(this).children(mSub).hide();
				//}
			}
		);
		//return main
		return false;
	};
})(jQuery);