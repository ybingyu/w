/**
 * TMUED imageLazyload
 * @creator jlw 2011-06-22
 * @depends jQuery
*/
(function($){
	$.fn.imageLazyload = function(opt){
		
		//setting
		var settings = jQuery.extend({
			srcData:"srcData", //图片源标签属性名
			diff:200, // 图片离当前屏幕多少像素开始加载
			fadeIn:true, //是否淡入效果
			fadeInSpeed:"slow", //淡入效果速度
			spaceHoder: "http://img0.mmo.mmo4arab.com/global/img/lib/spaceball.gif" //占位图片
		},opt);
		
		//参数赋值
		var filterImgs = this,
			srcData = settings.srcData,
			diff = settings.diff,
			fadeIn = settings.fadeIn;
			fadeInSpeed = settings.fadeInSpeed;
			spaceHoder = settings.spaceHoder;
		
		var _remain = [],
			clientHeight = document.documentElement.clientHeight||document.body.clientHeight;
		
		//添加图片占位
		filterImgs.each(function(){
			if($(this).attr(srcData) && !($(this).attr("src"))){
				$(this).attr("src", spaceHoder);
				_remain.push(this);
			}
		});
		filterImgs = $(_remain)
		
		//页面滚动高度
		var pageTop = function(){
			return clientHeight + (document.documentElement.scrollTop || document.body.scrollTop);
		}
		
		//读取已在加载范围内的图片
		var loadImgs = function(){
			if(filterImgs.size() == 0){
				$(window).unbind("scroll");
				return;
			}
			var _$this, data, imgTop;
			_remain = [];
			filterImgs.each(function(){
				_$this = $(this);
				data = _$this.attr(srcData);
				imgTop = _$this.offset().top;
				if(imgTop < (pageTop() + diff)){
					_$this.attr("src", data)
						  .removeAttr(srcData);
					if(fadeIn){
						_$this.hide()
							  .fadeIn(fadeInSpeed);
					}
				}else{
					_remain.push(this);
				}
			});
			//过滤已加载的图片
			filterImgs = $(_remain);
		}
		
		if(filterImgs.size() > 0){
			//第一屏图片加载
			loadImgs();			
			//事件绑定
			$(window).bind("scroll", loadImgs);
		}
		
	}
})(jQuery);