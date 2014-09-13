game.cursor = (function (parent) {
	cursor.prototype = new game.shape();
	cursor.prototype.constructor = cursor;
	
	function cursor() {
		this.x = 0;
		this.y = 0;
	}
	
	return cursor;
})(game.shape);