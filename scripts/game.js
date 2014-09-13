var game = (function () {
	var thatGame = this;
	
	function game() {
		thatGame = this;
		
		this.canvas = null;
		this.bodyElement = null;
		this.step = 40;
		this.buildings_on_stage = 22;
		this.max_player_bullets = 5;
		this.CPU = null;
		this.sound = null;

		/* Public Methods */
		
		this.init = function (p) {
			this.bodyElement = dq('body')[0];
			this.CPU = new game.CPU();
			this.canvas = this.initCanvas(p, this.CPU);
			this.canvas.players = this.initPlayers();
			
			this.sound = new game.sound();
			this.initBuildings();
			this.canvas.showPresentation();
			this.bindPresentation();
		};
		
		this.initCanvas = function (p, cpu) {
			var newCanvas = new game.canvas();
			newCanvas.init({
				canvasId: p.canvasId, 
				canvasWrapper: p.canvasWrapper, 
				step: this.step,
				cpu: cpu
			});
			return newCanvas;
		};

		this.initPlayers = function () {
			var _players = [],
				player1 = new game.player({name: '1'});
			player1.setKeys({
	            earth :81, water :87, air :69, fire :82
			});
			player1.init({
				x: 0, y: 0,
				width: 60, height: this.step,
				fill: '#FFF', border: '#000',
				limits : {x: this.canvas.x, y: this.canvas.y},
				imageSrc : 'images/player.png',
				angle: 45
			});
			player1.cursor = new game.cursor();
			_players.push(player1);
			
			var player2 = new game.player({name: '2'});
			player2.setKeys({
		        earth :81, water :87, air :69, fire :82
			});
			player2.init({
				x: this.canvas.x - this.step, y: this.canvas.y - this.step,
				width: 60, height: this.step,
				fill: '#000', border: '#FFF',
				limits : {x: this.canvas.x, y: this.canvas.y},
				imageSrc : 'images/player.png',
				angle: -135
			});
			//player2.cursor = new game.cursor();
			_players.push(player2);
			return _players;
		};

		this.initBuildings = function () {
			for (var player in this.canvas.players)
				if (!isNaN(player)) {
					var j = 1, altura = 0; base = 3;
					for (var i = 0; i < (this.buildings_on_stage/2); i++) {
						var randN = Math.floor((Math.random() * 2) + (2 * player));
						var building_ = new game.building({type: game.element.types[randN]});
						building_.typeNumber = randN;
						var player_ = this.canvas.players[player];

						if (Number(player) == 0) {
							building_.init({
								x: (2 * player_.width) + (2 * player_.width * i) - ((2*base+altura) * player_.width * altura),
								y: (2 * player_.height) + (2 * player_.height * altura),
								width: this.step, height: this.step,
								parent: player,
								imageSrc: 'images/builds.png',
							});
						} else {

							building_.init({
								// x: (this.canvas.x - player_.width) - ((2 * player_.width) + (2 * player_.width * i)),
								x: (this.canvas.x - player_.width) - ((2 * player_.width) + (2 * player_.width * i)) + ((2*base+altura) * player_.width * altura),
								y: (this.canvas.y - player_.height) - (2 * player_.height) - (2 * player_.height * altura),
								width: this.step, height: this.step,
								parent: player,
								imageSrc: 'images/builds.png',
							});
						}
						this.canvas.players[player].buildings.push(building_);
						if (j++ == base){ base--; altura++; j = 1;}
					}
				}
		}

		this.bindEvents = function () {
			//this.bodyElement.addEventListener("mousemove", this.mouseMoveManagement, false);
			this.bodyElement.onkeydown = this.keysManagment;
			this.bodyElement.onmousemove = this.mouseMoveManagement;
		};

		this.keysManagment = function (pEvent) {
			if (pEvent.keyCode == 87 || pEvent.keyCode == 82) {
				var result = false,
					onKeyDownObject = {
						event: pEvent,
						_maxAmmo: thatGame.max_player_bullets
					};
		
				result = thatGame.canvas.players[0].onKeyDown(onKeyDownObject);
		
				if (result && result === true && typeof result === 'boolean') {
					var soundFxName = 'shoot' + ((pEvent.keyCode == 87) ? 'Water' : 'Fire');
					thatGame.sound.play(soundFxName);
					 if (thatGame.canvas.animatable === false) {
					 	thatGame.canvas.animatable = true
					 	thatGame.canvas.animate(true);
					 }
				}
			}
		};

		this.mouseMoveManagement = function (pEvent) {
			var _player = thatGame.canvas.players[0];
			_player.onMouseMove(thatGame.getMousePosition(pEvent));
			_player.getAngle(_player.getCursor().x, _player.getCursor().y);
			thatGame.canvas.draw(false);
		};

		this.getMousePosition = function (pEvent) {
			return {
				x : (pEvent.clientX || pEvent.pageX)  - this.canvas.canvasElement.offsetLeft,
				y : (pEvent.clientY || pEvent.pageY)  - this.canvas.canvasElement.offsetTop
			};
		};

		this.bindPresentation = function (p) {
			this.bodyElement.onclick = function (){
				thatGame.bindEvents();
				thatGame.canvas.draw();
				thatGame.sound.init();			
				thatGame.CPU.start({
					canvas: thatGame.canvas, 
					initial_timer: 4500, 
					final_timer: 500, 
					refresh: 28000, 
					maxAmmo: thatGame.max_player_bullets,
					sound: thatGame.sound
				});
			};
		};
	}
	return game;
})();