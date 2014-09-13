game.collisionHelper = (function (){
	function collisionHelper () {
		
		this.processCollision = function(pPlayers) {
			var items = fillItemSet(pPlayers),
				itemsCollided = getItemsCollided(items),
				playerWinner = null;

			for (var i = 0; i < itemsCollided.length; i++) {
				var collision = itemsCollided[i],
					winner = null;
				
				if (getCollitionType(collision, 'bullet', 'build')) {
					winner = whoWin(collision.item1, collision.item2)
					if (collision.item1.is === 'bullet') {
						if (winner.id == collision.item1.id) {
							rmBuilding(collision.item2);
							rmBullet(collision.item1);
							collision.item1.parent.src.score++;
						} 
						else if (winner.id == collision.item2.id) {
							rmBullet(collision.item1);
						}
					} 
					else if (collision.item1.is === 'build') {
						if (winner.id == collision.item1.id) {
							rmBullet(collision.item2);
						} 
						else if (winner.id == collision.item2.id) {
							rmBuilding(collision.item1);
							rmBullet(collision.item2);
							collision.item2.parent.src.score++;
						}
					} 
				}

				if (getCollitionType(collision, 'bullet', 'bullet'))
				{
					winner = whoWin(collision.item1, collision.item2)
					if (winner.id == collision.item1.id) {
						rmBullet(collision.item2);
					}
					else if (winner.id == collision.item2.id) {
						rmBullet(collision.item1);
					}
				}

				if (getCollitionType(collision, 'bullet', 'player'))
				{
					if (collision.item1.is === 'bullet') {
						if (collision.item2.src.buildings.length == 0) {
							playerWinner = collision.item1.parent;
						}
						rmBullet(collision.item1);
					} 
					if (collision.item2.is === 'bullet') {
						if (collision.item1.src.buildings.length == 0) {
							playerWinner = collision.item2.parent;	
						}
						rmBuilding(collision.item2);
					}
				}
			};
			return playerWinner;
		};

		function fillItemSet(pPlayers) {
			var items = [];
			//items = items.concat(getItemsFromArray(pPlayers, 'player', null));
			for (var i = 0, t = pPlayers.length; i < t; i++) {
				var itemPlayer = getItem({
					item: pPlayers[i], is: 'player', i: i, parent: null
				});
				
				items.push(itemPlayer);

				items = items.concat(getItemsFromArray({ 
					items: pPlayers[i].bullets, is: 'bullet', parent: itemPlayer 
				}));

				items = items.concat(getItemsFromArray({ 
					items: pPlayers[i].buildings, is: 'build', parent: itemPlayer 
				}));
			};
			return items;
		}

		// p { items, is, parent }
		function getItemsFromArray(p) {
			var items = [];
			for (var i = 0, t = p.items.length; i < t; i++) {
				items.push(getItem({ 
					item: p.items[i], is: p.is, i: i, parent: p.parent, type: p.items[i].type
				}));
			};
			return items;
		}

		// p { item, is. i. parent }
		function getItem(p) {
			return {
				x: p.item.x, y: p.item.y, 
				width: p.item.width, height: p.item.height,
				is: p.is, 
				index: p.i,
				parent: p.parent,
				id: p.item.id,
				type: p.type,
				src: p.item
			};
		}

		function getItemsCollided (pItems) {
			var collidedItems = [], 
				collidedItem = [];
			
			for (var i = 0, t = pItems.length; i < t; i++) {
				var item = pItems[i];
				collidedItem = dq.grep(pItems, function(e) { 
				    return intersec(item, e) // Insersection
				    && (e.id != item.id) // Don't be the same item
				    && ((item.parent == null || e.parent == null) || (item.parent.id != e.parent.id)) // Don't belongs to the same parent
				    && (e.parent == null || (item.id != e.parent.id))
					&& (item.parent == null || (e.id != item.parent.id)); // One aren't parent of the other
				})[0];
				if (collidedItem) {
					if (dq.grep(collidedItems, function (e) { return e.item1.id === item.id || e.item1.id === collidedItem.id || e.item2.id === item.id || e.item2.id === collidedItem.id}).length === 0)
					{
						collidedItems.push({ item1: item, item2: collidedItem });
					}
				}
			};
			return collidedItems;
		}

		function intersec (e1, e2) {
			var circle1 = {
				radius: e1.height / 2, 
				x: e1.x + (e1.width / 2), 
				y: e1.y + (e1.height / 2)
			},
			circle2 = {
				radius: e2.height / 2, 
				x: e2.x + (e2.width / 2), 
				y: e2.y + (e2.height / 2)
			};

			var dx = circle1.x - circle2.x;
			var dy = circle1.y - circle2.y;
			var distance = Math.sqrt(dx * dx + dy * dy);

			return (distance < circle1.radius + circle2.radius);
		}

		function getCollitionType (pcollision, pType1, pType2) {
			return (pcollision.item1.is == pType1 && pcollision.item2.is == pType2 
				|| pcollision.item1.is == pType2 && pcollision.item2.is == pType1)
		}

		function rmBullet (item) {
			if (item && item.parent) {
				for (var i = 0, t = item.parent.src.bullets.length; i < t; i++) {
					if (item.parent.src.bullets[i] && item.parent.src.bullets[i].id === item.id) {
						item.parent.src.bullets.splice(i, 1);
					}
				};
			}
		}

		function rmBuilding (item) {
			if (item && item.parent) {
				for (var i = 0, t = item.parent.src.buildings.length; i < t; i++) {
					if (item.parent.src.buildings[i] && item.parent.src.buildings[i].id === item.id) {
						item.parent.src.buildings.splice(i, 1);
					}
				};
			}
		}

		function whoWin(item1, item2) {
			if ((item1.type === 'earth' && item2.type === 'fire') 
				|| (item1.type === 'water' && item2.type === 'earth')	
				|| (item1.type === 'air' && item2.type === 'water')
				|| (item1.type === 'fire' && item2.type === 'air')) {
				return item1;
			} 
			else if ((item2.type === 'earth' && item1.type === 'fire') 
				|| (item2.type === 'water' && item1.type === 'earth')	
				|| (item2.type === 'air' && item1.type === 'water')
				|| (item2.type === 'fire' && item1.type === 'air')) {
				return item2;
			}
		}
	}

	return collisionHelper;
})();