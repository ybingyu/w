var Slide = function(opt, callback) {
	var settings = $.extend({
		cur: 0,
		curClass: "on",
		TabTi: ".tab_ti li",
		TabCont: ".tab_cont li",
		func: "click",
		fade: false,
		fadeTime: 400,
		isAutoPlay: {
			play: false,
			timer: null
		},
		isBtn: {
			next: "#nextBtn",
			pre: "#preBtn"
		}
	}, opt);
	var cur = settings.cur,
		curClass = settings.curClass,
		TabTi = settings.TabTi,
		TabCont = settings.TabCont,
		$TabTi = $(settings.TabTi),
		$TabCont = $(settings.TabCont),
		func = settings.func,
		auTo = settings.isAutoPlay.play,
		Time = settings.isAutoPlay.timer,
		fade = settings.fade,
		$isBtnNext = $(settings.isBtn.next),
		$isBtnPre = $(settings.isBtn.pre),
		callBack = settings.callBack,
		fadeTime = settings.fadeTime,
		index = 0,
		timeId, flag, size = $TabCont.size();
	/* $TabTi.eq(cur).addClass(curClass); */
	flag = cur;
	var run = function() {
		if ($TabTi.eq(cur).hasClass(curClass)) {
			return ;
		} else {
			$TabTi.eq(cur).addClass(curClass).siblings(TabTi).removeClass(curClass);
			if (fade) {
				$TabCont.eq(cur).css("z-index", 2);
				$TabCont.eq(flag).animate({
					"opacity": 0
				}, fadeTime, function() {
					$(this).css({
						"z-index": 1,
						"opacity": 1
					});
					$TabCont.eq(cur).css("z-index", 5);
				});
			} else {
				$TabCont.eq(cur).show().siblings(TabCont).hide();
			}
			flag = cur;
			if (callback) {
				callback(cur);
			}
		}
	};
	if (size > 1) {
		if (auTo) {
			$TabTi.each(function() {
				$(this).bind(func, function() {
					stopPlay();
					cur = $(this).index(TabTi);
					run();
					auToPlay();
				});
			});
		} else {
			$TabTi.each(function() {
				$(this).bind(func, function() {
					cur = $(this).index(TabTi);
					run();
				});
			});
		}
	}
	if (!fade) {
		run();
	}
	var auToPlay = function() {
		timeId = setInterval(next, Time);
	};
	var stopPlay = function() {
		clearInterval(timeId);
	};
	var next = function() {
		stopPlay();
		cur++;
		if (cur >= $TabCont.size()) {
			cur = 0;
		}
		run();
		auToPlay();
	};
	var prev = function() {
		stopPlay();
		cur--;
		if (cur < 0) {
			cur = $TabCont.size() - 1;
		}
		run();
		auToPlay();
	};
	if (size > 1) {
		if (auTo) {
			auToPlay();
			$TabCont.hover(stopPlay, auToPlay);
		}
		$isBtnNext.bind("click", next);
		$isBtnPre.bind("click", prev);
	}
};