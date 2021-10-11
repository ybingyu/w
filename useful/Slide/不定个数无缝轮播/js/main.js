LEN = 10;
PREV = 3;
$(function () {
    var htm = '';
    var preHtm = '';
    var nextHtm = '';
    var prev = $('#prev');
    var next = $('#next');
    var list = $('#swiper .swiper-wrapper');
    var index = 1;// [1,10]
    var w = 0;

    // 输出dom
    for(var i = 0;i<LEN;i++){
        htm += '<div class="swiper-slide" data-key="' +(i + 1)+ '"><div class="head">' +(i + 1)+ '</div></div>';
        // 复制前3后3
        if(i<PREV){
            nextHtm += '<div class="swiper-slide" data-key="' +(i + 1)+ '"><div class="head">' +(i + 1)+ '</div></div>';
        }else if (i>=LEN - PREV){
            preHtm += '<div class="swiper-slide" data-key="' +(i + 1)+ '"><div class="head">' +(i + 1)+ '</div></div>';
        }
    }
    list.html(preHtm + htm + nextHtm);
    w = list.find('.swiper-slide').outerWidth(true);
    list.css('width',w * (LEN + PREV * 2));

/*dir = -1 往左 next; 1 往右 prev*/
    function animate (dir) {
        if (list.is(':animated')) {
            return;
        }
        index += dir;
        if (index > LEN) {
            index = 1;
        }
        else if(index <= 0){
            index = LEN;
        }
        console.log(index);

        var offset = w;
        var left = parseInt(list.css('margin-left')) - offset * dir;
        console.log('left',left)
        list.animate({'margin-left': left}, 300, function () {
            if(left < (w * (1 - LEN))) {
                list.css('margin-left', 0);
            }
            if(left > 20){
                list.css('margin-left', (1 - LEN) * w);
            }
        });
    }


    next.bind('click', function () {
        animate(1);
    });

    prev.bind('click', function () {
        animate(-1);
    });
})