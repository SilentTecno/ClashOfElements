game.common = {
	getBrowserLimits : function() {
		var documentElement = document.documentElement,
			bodyElement = dq('body')[0],
			layoutWidth = window.innerWidth || documentElement.clientWidth || bodyElement.clientWidth,
			layoutHeight = window.innerHeight || documentElement.clientHeight || bodyElement.clientHeight;
		return {width: layoutWidth, height: layoutHeight};
	}
};

/*Array.prototype.found = function (obj) {
	var result = false,
		resultItem = false,
        i = 0,
        t = 0,
        name = null;
	for (i = 0, t = this.length; i < t; i++) {
		resultItem = true;
		for (name in obj) {
            if (typeof this[i][name] !== 'undefined' && typeof obj[name] !== 'undefined') {
                if (this[i][name] !== obj[name]) {
					resultItem = false;
					break;
				}
			}
		}
		if(resultItem) {
			result = resultItem;
			break;
		}
	}
	return result;
};*/

window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

var dq = (function(){
	function dq (p) {
		var search = null;
		if (p && typeof p === 'string') {
			if (p.length > 1) {
				if (p[0] === '#') {
					search = p.substring(1, p.length);
					return document.getElementById(search);
				}
				else if (p[0] === '.') {
					search = p.substring(1, p.length);
					return document.getElementsByClassName(search);
				}
				else {
					return document.getElementsByTagName(p);	
				}
			}
			else if (p.length > 0) {
				return document.getElementsByTagName(p);
			}
		}
	}
	return dq;
})();

var GUID = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  };
})();

/*
window.document.body.addEventListener("keydown", function(e){
	e = e || window.event;
	var keyInfo = e.keyIdentifier + ' ' + (e.keyCode || e.which).toString();
	if (dq('#debug')) {
		dq('#debug').textContent = keyInfo;
	}
	else {
		console.log(keyInfo);	
	}
}, false);
*/

/*
	Function extracted from the source of jQuery (http://jquery.com/)
*/
dq.grep = function (elems, callback, invert) {
	var callbackInverse,
		matches = [],
		i = 0,
		length = elems.length,
		callbackExpect = !invert;

	for (; i < length; i++ ) {
		callbackInverse = !callback( elems[ i ], i );
		if ( callbackInverse !== callbackExpect ) {
			matches.push( elems[ i ] );
		}
	};
	return matches;
};