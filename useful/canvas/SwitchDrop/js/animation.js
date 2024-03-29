/**
 * redefine requestAnimationFrame
 * @return requestAnimationFrame function 
 */
window.requestAnimationFrame = (function(){
    return window.requestAnimationFrame      ||
           window.webkitRequestAnimationFrame||
           window.mozRequestAnimationFrame   ||
           function(callback){
                window.setTimeout(callback,1000 / 60);
           };
})();
