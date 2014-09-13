game.CPU = (function() {
	var thatCPU = thatCPU;

	function CPU() {
		var thatCPU = this;
		this.cpu_interval = null,
		this.initial_timer = null,
		this.current_timer = null,
		this.final_timer = null,
		this.refresh = null;

		this.start = function (p) {
			if (p) {
				thatCPU.current_timer = p.initial_timer;
				thatCPU.final_timer = p.final_timer;
				thatCPU.refresh = p.refresh;
			}
			thatCPU.cpu_interval = setInterval(function() {cpuAction(p);}, thatCPU.current_timer);

			setInterval(function() {

				if (thatCPU.current_timer > thatCPU.final_timer) {
					thatCPU.current_timer -= 500;
					clearInterval(thatCPU.cpu_interval);
					thatCPU.cpu_interval = setInterval(function() {cpuAction(p)}, thatCPU.current_timer);
				}
			}, thatCPU.refresh);
		};

		this.stop = function() {
			clearInterval(thatCPU.cpu_interval);
		}
	};
	function cpuAction(p) {

		var _cpu = p.canvas.players[1];
		var _human = p.canvas.players[0];

		// selecting a target from posible targets (from player's buildings)
		var target = _human.buildings[Math.floor((Math.random() * _human.buildings.length))];


		if (target) {
			// sending target coordinates..
			_cpu.onMouseMove({
				x: target.x,
				y: target.y
			});
		}
		else {
			_cpu.onMouseMove({
				x: _human.x,
				y: _human.y
			});	
		}
		_cpu.getAngle(_cpu.getCursor().x, _cpu.getCursor().y);
		p.canvas.draw(false);

		// This "rolls a dice" to decide whether to shoot or not
		var shouldIShoot = Math.floor((Math.random() * 4) + 1);
		var soundFxName = null;
		if (shouldIShoot == 1 || shouldIShoot == 4 || shouldIShoot == 3 || shouldIShoot == 2) {
			var what_shouldIShoot = Math.floor((Math.random() * 5) + 1);
			if (what_shouldIShoot == 3 || what_shouldIShoot == 5) {
				what_shouldIShoot = _cpu.keys.earth;
				soundFxName = 'shootEarth';
			} else {
				what_shouldIShoot = _cpu.keys.air;
				soundFxName = 'shootAir';
			}

			result = _cpu.onKeyDown({event:{keyCode: what_shouldIShoot}, _maxAmmo: p.maxAmmo});

			if (result && result === true && typeof result === 'boolean') {

				 p.sound.play(soundFxName);
				 if (p.canvas.animatable === false) {
				 	p.canvas.animatable = true
				 	p.canvas.animate(true);
				 }
			}
		}
	};

	return CPU;
})();