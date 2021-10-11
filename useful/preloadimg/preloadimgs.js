/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2014-12-09 17:58:26
 * @version $Id$
 */
// 批量加载
function preLoadImgs(arr){
    var arrNewImgs=[],
        nLoadedImgs=0
        fnCallBack=function(){};
    var arr=(typeof arr!="object")?[arr] : arr;//确保都是数组

    function ImgsLoadPost(){
        nLoadedImgs++;
        if(nLoadedImgs == arr.length){
            //do something 
            alert("图片已经加载完成");
            fnCallBack(arrNewImgs);
        }
    }
    for(var i = 0; i < arr.length ; i++){
        arrNewImgs[i] = new Image();
        arrNewImgs[i].onload = function(){
            this.onload = null;
            ImgsLoadPost();
        }
        arrNewImgs[i].onerror = function(){
            ImgsLoadPost();
        }
        arrNewImgs[i].src = arr[i];
    }

    return {
        done:function(fn){
            fnCallBack = fn || fnCallBack;
        }
    }
}

preLoadImgs(['img/1.jpg', 'img/2.jpg','img/3.jpg', 'img/4.jpg']).done(function(images){
    alert(images.length) //alerts 3
    alert(images[0].src+" "+images[0].width) //alerts '1.gif 220'
})
// end批量加载
