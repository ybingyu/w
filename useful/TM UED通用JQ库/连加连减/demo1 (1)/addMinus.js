/*
function:   $.fn.addMinus(连加连减工具)
author:     jin
depends:	jquery.js(1.2.6~1.4)
			
firstTime:  2010-05-19
lastTime:   2010-07-14
*/
$.fn.addMinus=function(opt){
	//settings
	var settings=jQuery.extend(false,{
		btnAdd:"#add",//add按钮
		btnMinus:"#minus",//minus按钮
		minNum:-10000,//最小数值
		maxNum:10000,//最大数值
		step:1,//步长
		speed:40,//速度
		callbackbefor:function($this,way,val,step){return true;},//加减前回调
		callbackafter:function($this,way,val,step){return true;},//加减后回调
		callbackmouseup:function($this,way,val,step){return true;}//鼠标弹起后回调
	},opt);
	var btnAdd=settings.btnAdd,
		btnMinus=settings.btnMinus,
		minNum=settings.minNum,
		maxNum=settings.maxNum,
		step=settings.step,
		speed=settings.speed,
		callbackbefor=settings.callbackbefor,
		callbackafter=settings.callbackafter,
		callbackmouseup=settings.callbackmouseup;
	//this
	var $this=$(this);
	var timeId,timeId2;
	var add=function(){
		var val=parseInt($this.val());
		val=val?val:0;
		if((val+step)<=maxNum && callbackbefor($this,"add",val,step)){
			$this.val(val+step);
			callbackafter($this,"add",val,step);
		}else{
			clearInterval(timeId);
			clearTimeout(timeId2);
		}
	};
	var minus=function(){
		var val=parseInt($this.val());
		if($this.val().indexOf("-")==0 && val>0){
			val=-val;
		}
		val=val?val:0;
		if((val-step)>=minNum && callbackbefor($this,"minus",val,step)){
			$this.val(val-step);
			callbackafter($this,"add",val,step);
		}else{
			clearInterval(timeId);
			clearTimeout(timeId2);
		}
	};
	var _dAdd=function(){
		add();
		timeId2=setTimeout(function(){
			timeId=setInterval(add,speed);
		},300);
	};
	$(btnAdd).unbind("mousedown",_dAdd).bind("mousedown",_dAdd);
	var _dMinus=function(){
		minus();
		timeId2=setTimeout(function(){
			timeId=setInterval(minus,speed);
		},300);
	};
	$(btnMinus).unbind("mousedown",_dMinus).bind("mousedown",_dMinus);
	var _uAdd=function(){
		clearInterval(timeId);
		clearTimeout(timeId2);
		callbackmouseup($this,"add");
	};
	$(btnAdd).unbind("mouseup",_uAdd).bind("mouseup",_uAdd);
	var _oAdd=function(){
		clearInterval(timeId);
		clearTimeout(timeId2);
		callbackmouseup($this,"add");
	};
	$(btnAdd).unbind("mouseout",_oAdd).bind("mouseout",_oAdd);
	var _uMinus=function(){
		clearInterval(timeId);
		clearTimeout(timeId2);
		callbackmouseup($this,"minus");
	};
	$(btnMinus).unbind("mouseup",_uMinus).bind("mouseup",_uMinus);
	var _oMinus=function(){
		clearInterval(timeId);
		clearTimeout(timeId2);
		callbackmouseup($this,"minus");
	};
	$(btnMinus).unbind("mouseout",_oMinus).bind("mouseout",_oMinus);
	//return
	return $this;
};