game.shape = (function(){
	function shape() {
		this.limits = {x: null, y: null};
	}

	shape.prototype.x = null;
	shape.prototype.y = null;
	shape.prototype.width = null;
	shape.prototype.height = null;
	shape.prototype.fill = null;
	shape.prototype.fillGradient = null;
	shape.prototype.border = null;
	shape.prototype.limits = null;
	shape.prototype.imageSrc = null;
	shape.prototype.image = null;
	shape.prototype.angle = 0;
	shape.prototype.parent = null;
	shape.prototype.id = null;

	shape.prototype.init = function (p) {
		if (p) {
			if (p.x || p.x == 0) {
				this.x = p.x;
			}
			if (p.y || p.y == 0) {
				this.y = p.y;
			}
			if (p.width) {
				this.width = p.width;
			}
			if (p.height) {
				this.height = p.height;
			}
			if (p.fill) {
				this.fill = p.fill;
			}
			if (p.border) {
				this.border = p.border;
			}
			if (p.limits) {
				this.limits = p.limits;
			}
			if (p.imageSrc) {
				this.imageSrc = p.imageSrc;
			}
			if (p.angle || p.angle == 0) {
				this.angle = p.angle;
			}
			if (p.parent) {
				this.parent = p.parent;
			}
			if (p.fillGradient) {
				this.fillGradient = p.fillGradient;
			}
			this.id = GUID();
		}
	};
	
	shape.prototype.getImage = function() {
		if (!this.image) {
			this.image = new Image();
			this.image.src = this.imageSrc;
		}
		return this.image;
	};

	shape.prototype.getAngle = function(pTargetX , pTargetY){
		if (pTargetX && pTargetY) {
			this.angle = Math.atan2(pTargetY - this.y, pTargetX - this.x) * 180 / Math.PI;
		}
		return this.angle;
	};

	return shape;
})();
