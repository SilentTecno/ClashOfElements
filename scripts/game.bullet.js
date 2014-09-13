game.bullet = (function(parent){
	bullet.prototype = new game.shape();
	bullet.prototype.constructor = bullet;

	bullet.prototype.origin = null;
	bullet.prototype.target = null;
	bullet.prototype.direction = null;
	bullet.prototype.speed = null;

	function bullet () {
		this.origin = {x: 0, y: 0};
		this.target = {x: 0, y: 0};
		this.direction = {x: 0, y: 0};
	}

	bullet.prototype.init = function (p) {
		parent.prototype.init.call(this, p);
		if (p) {
			if (p.origin) {
				this.origin = p.origin;		
			}
			if (p.target) {
				this.target = p.target;		
			}
			if (p.speed) {
				this.speed = p.speed;
			}
		}
		this.calculateDirection();
	};

	bullet.prototype.calculateDirection = function () {
		var angle = this.getAngle(this.target.x, this.target.y),
			radians = angle * Math.PI/ 180;
		this.direction.x = Math.cos(radians);
	    this.direction.y = Math.sin(radians);
	};

	bullet.prototype.move = function (pSpeed) {
		var pSpeed = pSpeed ? pSpeed : (this.speed ? this.speed : 1),
			newX = this.x + (this.direction.x * pSpeed),
			newY = this.y + (this.direction.y * pSpeed),
			moved = false;

		if ((newX >= 0 && newX <= this.limits.x) && (newY >= 0 && newY < this.limits.y)) {
			if (newX <= this.limits.x) {
				this.x = newX;
			}

			if (newY <= this.limits.y) {
				this.y = newY;
			}	
			moved = true;
		}
		else {
			moved = false;
		}
		return moved;
	}

	return bullet;
})(game.element);