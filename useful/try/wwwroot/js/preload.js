var preload = function() {};
var Config = {
	imgPath: '../image/',
	audioPath: '../audio/'
};
preload.prototype.load = function(source, fnBack, fnProgress) {
	var self = this;
	self.nLoaded = 0;
	audio = {};

	var resource = [];
	self.fnProgress = fnProgress || function() {};
	var postaction = fnBack || function() {};
	//var source = (typeof source != "object") ? [source] : source; 确保都是数组

	function loadPost() {
		self.nLoaded++;
		if (self.fnProgress) {
			self.fnProgress(self.nLoaded, source.length);
		}
		if (self.nLoaded == source.length) {
			console.log("加载完成");
			self.fnProgress(self.nLoaded, source.length);
			// 延迟1s调用结束函数
			setTimeout(function(){postaction(resource);},1000);
		}
	}

	for (var i = 0, len = source.length; i < len; i++) {
		switch (source[i][0]) {
			case 'img':
				resource[i] = new Image();
				resource[i].onload = function() {
					this.onload = null;
					loadPost();
				}
				resource[i].onerror = function() {
					loadPost();
				}
				resource[i].src = Config.imgPath + source[i][1];
				break;
			case 'audio':
				var a = new Audio();
				a.addEventListener('canplaythrough', function() {
					this.removeEventListener('canplaythrough');
					loadPost();
				})
				a.onerror = function() {
					loadPost();
				}
				a.src = Config.audioPath + source[i][1];
				resource[i] = a;
				audio[source[i][1]] = a;
				a.load();
				break;
			default:
				self.nLoaded++;
				console.log('source[' + i+ '] preload type error:' + source[i][0]);
				break;
		}
	}
	return {
		// done: function(f) {
		// 	postaction = f || postaction;
		// },
		audio: audio
	};
}
