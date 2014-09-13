game.sound = (function() {

	function sound() {
		this.context = null;
		this.bufferLoader = null;

		this.init = function() {

			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			this.context = new AudioContext();

			this.bufferLoader = new BufferLoader(
				this.context,
				{
					shootAir: 'sfx/shootAir.mp3',
					shootFire: 'sfx/shootFire.mp3',
					shootEarth: 'sfx/shootEarth.mp3',
					shootWater: 'sfx/shootWater.mp3',
				},
				finishedLoading
			);
			this.bufferLoader.load();

		};

		this.play = function(sfxName) {
			var sfx = this.context.createBufferSource();

			sfx.buffer = this.bufferLoader.bufferList[sfxName];

			sfx.connect(this.context.destination);
			sfx.start(0);
		};

	}

	function finishedLoading(bufferList) {
		console.log('Sfx Loaded');
	}


	return sound;
})();