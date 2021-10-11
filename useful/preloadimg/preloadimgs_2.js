/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2014-12-09 17:58:26
 * @version $Id$
 */
// 单张加载
function loadImage(url,fnCallBack){
    var img = new Image();//创建一个Image对象，实现图片的预下载
    if(img.complete){// 如果图片已经存在于浏览器缓存，直接调用回调函数 
        fnCallBack.call(img);
        return; // 直接返回，不用再处理onload事件  
    }

    img.onload = function(){ //图片下载完毕时异步调用callback函数
        img.onload = null;//gif等动态图片，这些动态图片可能会多次触发onload。onload创建了一个临时匿名函数来作为图片的onload事件处理函数，形成了闭包,null解决内存泄漏的问题
        fnCallBack.call(img); //将回调函数的this替换为Image对象  
    }

    img.src = url;
}
// end单张加载
