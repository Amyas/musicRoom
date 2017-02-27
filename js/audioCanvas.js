/*
	原声AudioContext音乐可视化对象
 */
function AudioCanvas(cav){
	this.oCanvas = document.getElementById(cav);
	this.ac = new (window.AudioContext || window.webkitAudioContext )();

	this.gainNode = this.ac[this.ac.createGain ? "createGain" : "createGainNode"]();
	this.gainNode.connect(this.ac.destination);
	
	this.analyser = this.ac.createAnalyser();
	this.size = 50;
	this.analyser.fftSize = 512;
	this.analyser.connect(this.gainNode);
	
	this.source = null;
	this.count = 0;
	this.bufferSource = null;
	
	this.bufferSource = this.ac.createMediaElementSource(oAudio);
	this.bufferSource.connect(this.analyser);
	this.analyser.connect(this.ac.destination);
	this.width = null;
	this.height = null;
	this.canvas = document.createElement('canvas');
	this.ctx = this.canvas.getContext('2d');
	this.oCanvas.appendChild(this.canvas);
	
	this.width = this.oCanvas.clientWidth;
	this.height = this.oCanvas.clientHeight;
	
	this.canvas.width = this.width;
	this.canvas.height = this.height;
	
	this.line = this.ctx.createLinearGradient(0,0,0,this.height);
	this.line.addColorStop(0,'#8dffe3');
	this.ctx.fillStyle = this.line;
	
	this.visualizer();
}

AudioCanvas.prototype.draw = function(){
	this.ctx.clearRect(0,0,this.width,this.height);
	var w = this.width / this.size;
	for (var i = 0; i < this.size; i++) {
		var h = this.arr[i] / 256 * this.height;
		this.ctx.fillRect(w * i,0,w * 0.6,h);
	}
}

AudioCanvas.prototype.visualizer = function(){
	var _this = this;
	this.arr = new Uint8Array(this.analyser.frequencyBinCount);
	requestAnimationFrame = window.requestAnimationFrame ||
							window.webkitRequestAnimationFrame ||
							window.mozRequestAnimationFrame;
	function v(){
		_this.analyser.getByteFrequencyData(_this.arr);
		_this.draw(_this.arr);
		requestAnimationFrame(v);
	}
	requestAnimationFrame(v);
}