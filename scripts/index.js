window.onload = function () {
    var gameObject = new game();
	
	gameObject.init({
		canvasWrapper: 'canvasWrapper',
		canvasId: 'canvasGame'
	});
};

// if (window.opera)     
// {
//    document.documentElement.className += ' opera';
// }
