game.element = (function (parent) {
    element.prototype = new game.shape();
	element.prototype.constructor = element;
    
    function element(p) {
    	if(p){
    		if(p.type) {
    			this.type = p.type;
    		}
    	}
    }
    
	element.prototype.type = null;

	element.prototype.init = function(p) {
		parent.prototype.init.call(this, p);
		if (p){
			if (p.type) {
				this.type = p.type;
			}
		}
	};

	element.earth = {fill: '#7c4f37', border: '#000000', fillGradient: ['#D08787', '#7F4343']};
	element.water = {fill: '#022bff', border: '#000000', fillGradient: ['#8080FF', '#0101B0']};
	element.air = {fill: '#5ce3e3', border: '#000000', fillGradient: ['#ABABAB', '#555555']};
	element.fire = {fill: '#ff0202', border: '#000000', fillGradient: ['#FE9A2E', '#FE2E2E']};

	element.types = ['water', 'fire', 'earth', 'air'];

    return element;
})(game.shape);