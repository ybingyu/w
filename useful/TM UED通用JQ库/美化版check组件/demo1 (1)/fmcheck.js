/*
function:   $.fn.fmCheck(input check美化版本)
author:     jin
depends:    jquery.js(1.2.6~1.4)
			
firstTime:  2010-05-19
lastTime:   2010-07-14
*/
$.fn.fmCheck=function(opt){
	//settings
	var settings=jQuery.extend(true,{
		checkImg:"checkCheck.gif",//check状态下的图片地址
		unCheckImg:"checkUnCheck.gif",//uncheck状态下的图片地址
		finish:function($this){}//执行完毕回调
	},opt);
	var checkImg=settings.checkImg,
		unCheckImg=settings.unCheckImg,
		finish=settings.finish;
	//this
	var $this=$(this);
	$this.each(function(){
		var _$this=$(this);
		_$this.hide();
		_$this.next("[checkCheck]").remove();
		if(_$this[0].checked){
			_$this.after('<img checkCheck="true" src="'+checkImg+'" align="baseline" />');
		}else{
			_$this.after('<img checkCheck="true" src="'+unCheckImg+'" align="baseline" />');
		}
		var check=function(_this){
			if(_this.prev()[0].checked){
				_this.attr("src",checkImg);
			}else{
				_this.attr("src",unCheckImg);
			}
		};
		_$this.next().click(function(e){
			_$this.click();
			check($(this));
			finish(_$this);
			e.stopPropagation();
		});
	});
	//return
	return $this;
};
