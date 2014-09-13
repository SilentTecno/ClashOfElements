game.canvas = (function () {
	var thatCanvas = thatCanvas,
		context = null;

	/* Public Methods */

	function canvas() {
		this.canvasElement = null;
		this.x = null;
		this.y = null;
		this.players = null;
		this.elements = null;
		this.cursor = null;
		this.animatable = false;
		this.collisionHelper = null;
		this.cpu = null;
	
		this.init = function (p){
			thatCanvas = this;
			thatCanvas.canvasElement = dq('#' + p.canvasId);
			thatCanvas.expand(p.canvasWrapper, p.step);
			thatCanvas.x = thatCanvas.canvasElement.width;
			thatCanvas.y = thatCanvas.canvasElement.height;
			thatCanvas.players = [];
			thatCanvas.elements = [];
			thatCanvas.cpu = p.cpu;
			context = thatCanvas.canvasElement.getContext('2d');
			thatCanvas.collisionHelper = new game.collisionHelper();	
		};

		this.draw = function (pMove) {
			var i = 0, ti = 0,
				j = 0, tj = 0,
				moved = false,
				bulletsToDelete = [],
				bulletToDelete = null,
				itemsCollided = null,
				winner = null;
			
			clear();
			for (i = 0, ti = thatCanvas.players.length; i < ti; i++) {
				drawPlayer(thatCanvas.players[i]);
				for (j = 0, tj = thatCanvas.players[i].buildings.length; j < tj; j++) {
					drawBuilding(thatCanvas.players[i].buildings[j]);
				};
				for (j = 0, tj = thatCanvas.players[i].bullets.length; j < tj; j++) {
					drawBullet(thatCanvas.players[i].bullets[j]);
					if (pMove === true) {
						moved = thatCanvas.players[i].bullets[j].move();
						if (!moved) {
							bulletsToDelete.push({p:i, b:j});
						}
					}
				};
				for (j = 0, tj = bulletsToDelete.length; j < tj; j++) {
					bulletToDelete = bulletsToDelete[j];
					thatCanvas.players[bulletToDelete.p].bullets.splice(bulletToDelete.b,1);
				};
				bulletsToDelete = [];
			};

			if (pMove && !moved){
				this.animatable = false;
			}

			winner = thatCanvas.collisionHelper.processCollision(thatCanvas.players);
			if (winner) {
				this.animatable = false;
				thatCanvas.cpu.stop();
				thatCanvas.showWinner(winner.src.name == "1");
				window.document.body.onkeydown = undefined;
				window.document.body.onmousemove = undefined;
				window.document.body.onclick = function (){ location.reload();};
			}

			dq('#score').textContent = 'Score: ' + thatCanvas.players[0].score + ' - ' + thatCanvas.players[1].score;
		};

		this.expand = function (pCanvasWrapper, pStep) {
			var canvasWidth = game.common.getBrowserLimits().width * 0.9,
				canvasHeight = game.common.getBrowserLimits().height * 0.9,
				mainWrapper = dq('#mainWrapper');
			
			canvasHeight -= canvasHeight % pStep;
			canvasWidth -= canvasWidth % pStep;

			dq('#' + pCanvasWrapper).style.width = canvasWidth + 'px';
			dq('#' + pCanvasWrapper).style.height = canvasHeight + 'px';
			
			thatCanvas.canvasElement.width = canvasWidth;
			thatCanvas.canvasElement.height = canvasHeight;

			thatCanvas.canvasElement.style.width = canvasWidth + 'px';
			thatCanvas.canvasElement.style.height = canvasHeight + 'px';
			
			mainWrapper.style.width = canvasWidth + 'px';
			mainWrapper.style.height = canvasHeight + 'px';
		}

		this.animate = function (pMove) {
			thatCanvas.draw(pMove);
			if (thatCanvas.animatable === true) {
				window.requestAnimFrame(function () { thatCanvas.animate(pMove); });
				//setInterval(function () { thatCanvas.animate(pMove); }, 500);
			}
			// else {
			// 	clearInterval();
			// }
		}

		this.showPresentation = function (){
			var textPosX = this.canvasElement.width / 2,
				texts = [];

			texts.push({text: '[ Clash of Elements ]', size :'32', posY: 0.15});
			texts.push({text: 'RULES:', size:'24', posY: 0.25});
			texts.push({text: 'You will fight (from the left top corner) with a gun against your enemy', posY: 0.35});
			texts.push({text: 'in the opposite corner, your objective is demolish all', posY: 0.39});
			texts.push({text: 'their buildings (made of earth and air) with the elements (water, fire)', posY: 0.43});
			texts.push({text: 'using your keys (W, R) respectively, and the mouse to aim, ', posY: 0.47});
			texts.push({text: 'you can only fire 5 bullets at time, ', posY: 0.51});
			texts.push({text: 'and then, when no enemy buildings, attack directly to win :D', posY: 0.55});

			texts.push({text: 'Where:', posY: 0.65});
			texts.push({text: '[earth] get over [fire]', posY: 0.69});
			texts.push({text: '[water] get over [earth]', posY: 0.73});
			texts.push({text: '[air] get over [water]', posY: 0.77});
			texts.push({text: '[fire] get over [air]', posY: 0.81});

			context.fillStyle = "white";
			context.textAlign = 'center';
			for (var i = 0; i < texts.length; i++) {
				context.font = texts[i].size + 'px Arial';	
				context.fillText(texts[i].text, textPosX, this.canvasElement.height * texts[i].posY);
			};
			
		};

		this.showWinner = function (pWinner) {
			var textPosX = this.canvasElement.width / 2,
				texts = [];

			if (pWinner) {
				texts.push({text: 'YOU WIN !', size :'32', posY: 0.40});
			}
			else {
				texts.push({text: 'YOU LOOSE !', size :'32', posY: 0.40});	
			}
			texts.push({text: 'Do you want to play again ?', size: '32', posY: 0.50});
			texts.push({text: 'Click here to re-start', posY: 0.60});

			context.fillStyle = "yellow";
			context.textAlign = 'center';
			for (var i = 0; i < texts.length; i++) {
				context.font = texts[i].size + 'px Arial';	
				context.fillText(texts[i].text, textPosX, this.canvasElement.height * texts[i].posY);
			};
		};
	}

	/* Private Methods */

 	function clear() {
        context.clearRect(0, 0, thatCanvas.canvasElement.width, thatCanvas.canvasElement.height);
    }

	function drawPlayer (pPlayer) {
		var axisX = (pPlayer.height / 2) ,
			axisY = (pPlayer.height / 2) ;

		context.save();
        context.translate(pPlayer.x + axisX, pPlayer.y + axisY);
    	context.rotate(pPlayer.angle * Math.PI/180);
        
        if (pPlayer.imageSrc) {
			context.drawImage(pPlayer.getImage(),	// img
				0, 									// sx
				0, 									// sy
				pPlayer.width, 						// swidth
				pPlayer.height, 					// sheight
				-axisX, 							// x
				-axisY, 							// y
				pPlayer.width, 						// width
				pPlayer.height 						// height
			);
        }
        else {
			drawSquare(p);
        }
		context.restore();
	}
	
	function drawBuilding(pBuiling) {
		if (pBuiling.imageSrc) {
			context.drawImage(
				pBuiling.getImage(),
				pBuiling.width * pBuiling.typeNumber,
				0,
				pBuiling.width,
				pBuiling.height,
				pBuiling.x,
				pBuiling.y,
				pBuiling.width,
				pBuiling.height);
		} 
		else {
			drawSquare(pBuiling);
		}
	}

	function drawBullet (p) {
		drawCircle(p);
	}

	function drawSquare (p) {
		context.beginPath();
        context.rect(-axisX, -axisY, pPlayer.width, pPlayer.height);
        context.fillStyle = pPlayer.fill;
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = pPlayer.border;
        context.stroke();
	}

	function drawCircle (p) {
		context.beginPath();
        context.arc(p.x + (p.width / 2), p.y + (p.height / 2), p.width / 2, 0, 2 * Math.PI, false);
        if (p.fillGradient) {
        	var radgrad = context.createRadialGradient(p.x + (p.width / 2), p.y + (p.height / 2), 0, p.x + (p.width / 2), p.y + (p.height / 2), p.width / 2);
			radgrad.addColorStop(0, p.fillGradient[0]);
    		radgrad.addColorStop(1, p.fillGradient[1]);
    		context.fillStyle = radgrad;
        }
        else {
        	context.fillStyle = p.fill;
        }
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = p.border;
        context.stroke();
	}

	return canvas;
})();