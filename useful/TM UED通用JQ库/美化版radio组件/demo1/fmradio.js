/*
function:   $.fn.fmRadio(input radio美化版本)
author:     jin
depends:    jquery.js(1.2.6~1.4)
			
firstTime:  2010-05-19
lastTime:   2010-07-14
*/
$.fn.fmRadio=function(opt){
	//settings
	var settings=jQuery.extend(true,{
		checkImg:"radioCheck.gif",//check状态下的图片地址
		unCheckImg:"radioUnCheck.gif",//uncheck状态下的图片地址
		checkStateIdName:false,//checkStateIdName:"radioChecked",//选中状态下check图片id，false时将进行随即命名
		finish:function($this){}//选择状态下进行的回调操作
	},opt);
	var checkImg=settings.checkImg,
		unCheckImg=settings.unCheckImg,
		checkStateIdName=settings.checkStateIdName,
		finish=settings.finish;
	if(!checkStateIdName)checkStateIdName="S"+new Date().getTime()
	//this
	var $this=$(this);
	$this.each(function(){
		var _$this=$(this);
		_$this.hide();
		_$this.next("[checkRadio]").remove();
		if(_$this[0].checked){
			_$this.after('<img checkRadio="true" src="'+checkImg+'" align="baseline" />');
			_$this.next().attr("id",checkStateIdName);
		}else{
			_$this.after('<img checkRadio="true" src="'+unCheckImg+'" align="baseline" />');
		}
		var check=function(_this){
			$("#"+checkStateIdName).attr("src",unCheckImg).removeAttr("id");
			_this.attr("src",checkImg).attr("id",checkStateIdName);
			$("#"+checkStateIdName).prev()[0].checked=true;
		};
		_$this.next().click(function(e){
			check($(this));
			finish(_$this);
			_$this.click();
			e.stopPropagation();
		});
	});
	//return
	return $this;
};