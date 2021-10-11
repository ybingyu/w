/**
 * 掉落方块
 */
function DropArray(){
	this.init();
}
DropArray.prototype.init = function(){
	this.dropSquareArray = new Array();
	this.posY = 0;
	for(var i = 0; i < ROW ;i ++){
		this.dropSquareArray.push(new Square());
	}
};
/**
 * 绘制
 * @param  {content} ctx
 * @param  {num} w          屏幕宽度
 * @param  {num} squareSize 方块宽度
 */
DropArray.prototype.draw = function(ctx,w,squareSize){
	this.posY += 1;
	for(var i = 0; i < ROW ; i ++){
		var x = w * PADDINGH + squareSize * i;
		this.dropSquareArray[i].draw(ctx,x,this.posY,squareSize);
	}
};

/**
 * 方块列表
 */
function SquareArray(){}
SquareArray.prototype.init = function(){
	this.squareArray = new Array();
};
SquareArray.prototype.draw = function(ctx){
	var row = this.squareArray.length;
	for(var i = 0;i < row ; i++){
		var col = this.squareArray[i].length;
		for(var j = 0; j < col; j++){
			this.squareArray[i][j].draw(ctx);
		}
	}
};

/**
 * 方块
 */
function Square(){
	this.init();
}

Square.prototype.init = function(){
	var colorIndex = Math.floor(Math.random() * COLOR.length);
	this.colorType = colorIndex;
};
Square.prototype.draw = function(ctx,x,y,w){
	var padding = 5;
	ctx.fillStyle = COLOR[this.colorType];
	ctx.fillRect(x + padding,y + padding,w - padding*2,w - padding*2);
};
