/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2014-12-10 14:24:57
 * @version $Id$
 */
function $id(id){ return document.getElementById(id);}  
function $c(tagName){ return document.createElement(tagName);}  
window.onload = function(){  
imageLoad( {  
    url:function(v){  
        v = [];  
        for(var i=1; i<=100; i++){  
            v[v.length] = 'http://www.landgame.com.cn/images/game/slg_pic/GifBorder_'+i+'.gif?_='+(new Date).getTime();  
        }  
        return v;  
    },  
    oncomplete: function(s){  
         $id('status').innerHTML = '正在加载...'+s.complete+'/'+s.total;  
         $id('processing').innerHTML = this.src;  
    },  
    complete:function(imgs, s){  
        var $r = $c('div');  
        $r.id = 'result';  
        $r.innerHTML = '计划加载:'+s.total+', 加载成功:'+s.load+'错误:'+s.error;  
        document.body.appendChild($r);  
        for(var i=0, l=imgs.length, $m; i<l; i++){  
              $m = $c('div');  
              $m.innerHTML = (imgs[i].loaded?'加载成功:':'加载失败:')+ imgs[i].src;  
              document.body.appendChild($m);  
        }  
    }  
  });  
};  

// 复杂的批量加载
function imgsLoad(s){
    var urlset = [],
        undefined,
        toString = Object.prototype.toString;
    switch( toString.apply(s.url)){
        case '[object String]'://str urlset加一个
            urlset[urlset.length] = s.url; 
            break;
        case '[object Array]'://arr urlset = s.url
            if(!s.url.length){
                return false;
            }
            urlset = s.url;
            break;
        case '[object Function]'://fn 执行fn后得到s.url
            s.url = s.url();
            return imgsLoad(s);
    }

    var arrImgs = [],//图片集
        r = {//结果统计
            total:urlset.length,
            load:0,
            error:0,
            abort:0,
            complete:0,
            currentIndex:0
        },
        timer,
        _defaults = {
            url:'',
            onload:'function',
            onerror:'function',
            oncomplete:'function',
            ready:'function',
            timeout:15
        };

    //jquery 里的 extend(default)
    for(var v in _defaults){
        s[v] = s[v] === undefined ? _defaults:s[v];
    }
    s.timeout = parseInt(s.timerout) || _defaults.timeout;
    timer = setTimeout(_callback,s.timerout*1000);
    // 生成 image 对象数组  
    for(var i=0,l=urlset.length,img;i<l;i++){
        img = new Image();
        img.loaded = false;
        arrImgs[arrImgs.length] = img;
    }

    // onload & onerror 绑定 
    for( i = 0,l = arrImgs.length;i<l;i++ ){
        arrImgs[i].onload = function(){
            _imageHandle.call(this,'load',i);
        };
        arrImgs[i].onerror = function(){
            _imageHandle.call(this,'error',i);
        };
        arrImgs[i].onabort = function(){
            _imageHandle.acll(this.'abort',i);
        };
        arrImgs[i].src = '' + urlset[i];
    }
    // ready 事件回调  
    if(_isFn(s.ready)){
        s.ready.call({},arrImgs,r);
    }
    // onload & onerror 句柄  
    function _imageHandle(handle,index){
        r.currentIndex = index;
        switch(handle){
            case 'load':
                this.onload = null;
                this.loaded = true;
                r.load++;
                // onload 事件回调  
                if(_isFn(s.onload)){
                    s.onload.call(this,r);
                }
                break;
            case 'error':
                r.error++;
                // onerror 事件回调  
                if(_isFn(s.onerror)){
                    s.onerror.call(this,r);
                }
                break;
            case 'abort':
                r.abort++;
                break;
        }
        r.complete++;
        // oncomplete 事件回调 
        if(_isFn(s.oncomplete)){
            s.oncomplete.call(this,r);
        } 
        // 判断全局加载  
        if(r.complete === arrImgs.length){
            _callback();
        }
    }

    function _callback(){
        clearTimeout(timer);
        if(_isFn(s.complete)){
            s.complete.call({},arrImgs,r);
        }
    }
    function _isFn(fn){
        return toString.apply(fn)==='[object Function]';
    }
    return false;
} 

// end复杂的批量加载
//------------------------------------------------------------------------------------------------------------  