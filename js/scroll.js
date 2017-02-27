/*
	面向对象原生滚动条
	点击、滚动、拖拽
 */
function customScrollBar(box,content,scrollBar){
	this.boxH = box.offsetHeight;
	this.content = content;
	this.contentH = content.scrollHeight;
	this.scrollBar = document.getElementById(scrollBar);
	this.scroll = this.scrollBar.getElementsByClassName('scroll')[0];
	
	this.disY = 0;
	
	if(this.boxH < this.contentH){ //滚动条要显示
		this.scrollBar.style.display = 'block';
		this.scaleBarH = (this.boxH/this.contentH).toFixed(1)*1;
		this.scrollH = this.scrollBar.offsetHeight;
		this.scroll.style.height = this.scrollH * this.scaleBarH + 'px';
		
		this.timer = null;
		this.init();
	}
}

customScrollBar.prototype.init = function(){
	var _this = this;
	this.scroll.addEventListener('mousedown',function(ev){
		_this.clickDown(ev);
	});
	this.scrollBar.addEventListener('mousedown',function(ev){
		_this.timeDown(ev);
	});
	this.addWheel(this.content,function(down){
		var t = _this.scroll.offsetTop;
		if(down){
			//向上
			t-=10;
		}else{
			//向下
			t+=10;
		}
		if(t < 0){
			t = 0;
		}else if(t > _this.scrollH-_this.scroll.offsetHeight){
			t = _this.scrollH-_this.scroll.offsetHeight;
		}
		_this.scroll.style.top = t + 'px';
		var scale = t/(_this.scrollH-_this.scroll.offsetHeight);
		_this.content.style.top = scale * (_this.boxH-_this.contentH) + 'px';
	})
}

customScrollBar.prototype.clickDown = function(ev){
	var _this = this;
	this.disY = ev.pageY - this.scroll.offsetTop;
	
	function move(ev){
		_this.fnMove(ev);
	}
	function up(ev){
		_this.fnUp(move,up);
	}
	
	document.addEventListener('mousemove',move);
	document.addEventListener('mouseup',up);
}

customScrollBar.prototype.fnMove = function(ev){
	var t = ev.pageY - this.disY;
	if(t < 0){
		t = 0;
	}else if(t > this.scrollH - this.scroll.offsetHeight){
		t = this.scrollH - this.scroll.offsetHeight;
	}
	this.scroll.style.top = t + 'px';

	var scale = t/(this.scrollH-this.scroll.offsetHeight);
	this.content.style.top = scale * (this.boxH-this.contentH) + 'px';
	
	ev.preventDefault();
}

customScrollBar.prototype.fnUp = function(move,up){
	document.removeEventListener('mousemove',move);
	document.removeEventListener('mouseup',up);
}

customScrollBar.prototype.timeDown = function(ev){
	var _this = this;
	this.timer = setInterval(function(){
		var y = ev.pageY - _this.scrollBar.getBoundingClientRect().top;
		var t = _this.scroll.offsetTop;
		if(y < t){
			t-=10;
		}else if(y > t+ _this.scroll.offsetHeight){
			t+=10;
		}else{
			clearInterval(_this.timer);
		}
		if(t < 0){
			t = 0;
		}else if(t > _this.scrollH-_this.scroll.offsetHeight){
			t = _this.scrollH-_this.scroll.offsetHeight;
		}
		_this.scroll.style.top = t + 'px';
		var scale = t/(_this.scrollH-_this.scroll.offsetHeight);
		_this.content.style.top = scale * (_this.boxH-_this.contentH) + 'px';
	},30);
	this.scrollBar.addEventListener('mouseup',function(){
		clearInterval(_this.timer);
	})
}

customScrollBar.prototype.addWheel = function(obj,fn){
	obj.addEventListener('mousewheel',fn1);
	obj.addEventListener('DOMMouseScroll',fn1);
	function fn1(ev){
		var down = true;
		if(ev.wheelDelta){
			down = ev.wheelDelta>0?true:false;
		}else{
			down = ev.detail<0?true:false;
		}
		
		fn && fn(down);
		ev.preventDefault();
	}
}