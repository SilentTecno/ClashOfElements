game.player = (function (parent) {
	player.prototype = new game.shape();
	player.prototype.constructor = player;

	function player(p) {
		if (p) {
			if (p.name) {
				this.name = p.name;
			}
		}
		this.cursor = new game.cursor();
		this.keys = new game.keySet();
		this.bullets = [];
		this.buildings = [];
		this.score = 0;
	}

	player.prototype.name = null;
	player.prototype.keys = null;
	player.prototype.cursor	 = null;
	player.prototype.bullets = null;
	player.prototype.buildings = null;
	player.prototype.score = null;

	player.prototype.init = function(p) {
		parent.prototype.init.call(this, p);
	};

	player.prototype.setKeys = function (pkeys) {
		this.keys = new game.keySet();
		this.keys.earth = pkeys.earth;
		this.keys.water = pkeys.water;
		this.keys.air = pkeys.air;
		this.keys.fire = pkeys.fire;
	};

	player.prototype.onKeyDown = function(p) {
		p.event = p.event || window.event;
		var key = p.event.keyCode || p.event.which,
			result = false,
			bullet = null,
			_type = null;

		switch(key) {
			case this.keys.earth:
				_type = 'earth'
			break;
			case this.keys.water:
				_type = 'water'
			break;
			case this.keys.fire:
				_type = 'fire'
			break;
			case this.keys.air:
				_type = 'air'
			break;
		}

		if (this.bullets.length < p._maxAmmo && _type) {

			bullet = new game.bullet({type: _type});
			bullet.init({
				x: this.x, y: this.y,
				width: this.height, height: this.height,
				fill: game.element[_type].fill,
				fillGradient: game.element[_type].fillGradient,
				border: game.element[_type].border,
				origin: { x: this.x, y: this.y },
				target: { x: this.cursor.x, y: this.cursor.y }, 
				limits: { x: this.limits.x, y: this.limits.y },
				parent: this, type:_type, speed: (Math.floor(Math.random() * 10) + 1)
			});
			this.bullets.push(bullet);
			console.log(bullet.speed);
			result = true;
		}

		return result;
	};

	player.prototype.onMouseMove = function(p) {
		if (p) {
			if (p.x) {
				this.cursor.x = p.x;
			}
			if (p.y) {
				this.cursor.y = p.y;
			}
			return true;
		}
		return false;
	};

	player.prototype.getCursor = function (p) {
		return this.cursor;
	}

	return player;
})(game.shape);
