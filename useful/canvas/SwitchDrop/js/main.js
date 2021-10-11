ROW = 6;//每行个数
PADDINGH = 0.1;//水平的padding
COLOR = ['#cf4231','#d8850f','#29ad57', '#23698d','#894b8e']; // 颜色

var gameControl = null;
window.onload = function () {
	gameControl = new GameControl();
	gameControl.init();
	(function animloop(){
		requestAnimationFrame(animloop);

		gameControl.drawBg();
		// gameControl.drawDrop();
	})();
};

/**
 * [GameControl description]
 */
function GameControl(){}
GameControl.prototype.init = function(){
	var canvas = document.getElementById('canvas');
	canvas.setAttribute('width',screen.width);
	canvas.setAttribute('height',screen.height);
	this.ctx = null;

	if (canvas.getContext) {
	    this.ctx = canvas.getContext('2d');
	}
	this.sw = screen.width;
	this.sh = screen.height;
	this.squareSize = this.sw * (1 - PADDINGH * 2) / ROW;//每个小方块的宽度
	this.verticalCount = Math.floor( this.sh / this.squareSize);//小方块纵向的个数

	this.drawBg();

	this.dropArray = new DropArray();
	this.drawDrop();
};

/**
 * 绘制背景
 * @param  {context} ctx context
 * @param  {num} w             屏幕宽
 * @param  {num} h             屏幕高
 * @param  {num} squareSize    方块宽度
 * @param  {num} verticalCount 小放块纵向个数
 */
GameControl.prototype.drawBg = function(){
	this.ctx.clearRect(0,0,this.sw,this.sh);
	var size = this.squareSize * 0.3;//背景小方框的大小

	for(var i = 0; i < this.verticalCount ; i++){
		for(var j = 0; j < ROW ; j++){
			var x = this.sw * PADDINGH + this.squareSize * j + this.squareSize / 2 - size/2,
				y = this.sh - (i * this.squareSize + this.squareSize / 2 + size);
			this.ctx.fillStyle = '#d1c8b7';
			this.ctx.fillRect(x, y, size, size);
		}
	}
};

GameControl.prototype.drawDrop = function(){
	this.dropArray.draw(this.ctx,this.sw,this.squareSize);
};
