/*
 	运动函数(时间版)
 		move(obj,attrs,duration,fx,endFn)
 		参数：
 		obj:要运动的元素，object
 		attrs:要运动的多个样式,object，{left:400},即使只运动一个样式，也要写成对象形式
 		duration:运动持续时间，毫秒不带单位，number
 		fx:运动形式，string，linear匀速easeIn加速easeOut减速backIn回退渐入
 		endFn:回调函数，function
 * */

/*
 	抖动函数：
 * 		shake(obj,attr,endFn)
 * 	参数：
 * 	 obj：要抖动的元素，object
 * 	attr：抖动的属性（left,top）,string
 * endFn：回调函数,function
 * 
 * */
function move(obj,attrs,duration,fx,endFn){
	//运动开始的时间
	var old = new Date();
	var oldTime = old.getTime();
	//duration运动持续时间
	var d = duration;
	//接收传入的要运动的属性和值
	var j = {};
	//遍历传入的对象，获取要运动的属性和值
	for(var attr in attrs){
		j[attr] = {}
		//起始位置
		j[attr].b =  parseFloat(getComputedStyle(obj)[attr]);
		//运动距离
		j[attr].c = attrs[attr] - j[attr].b;
	}
	clearInterval(obj.timer);
	//一个定时器可以控制多个属性运动，方便定时器管理
	obj.timer = setInterval(function(){
		//监测时间
		var New = new Date();
		var NewTime = New.getTime();
		//算出已过时间
		var t = NewTime - oldTime;
		//已经运动的时间等于设置的运动时间，就证明到目标点了
		if(t >= d){
			t = d;	
		}
		//遍历对象，操作多个属性运动
		for(var attr in j){
			var b = j[attr].b;
			var c = j[attr].c;
			//运动形式设置
			var v = Tween[fx](t,b,c,d);
			if(attr == 'opacity'){
				obj.style[attr] = v;
			}else{
				obj.style[attr] = v +'px';
			}
		}
		if(t >= d){
			clearInterval(obj.timer);
			//回调函数，运动完要执行的代码，写在回调函数里传入
			if(typeof endFn == 'function'){
				endFn && endFn();
			}
		}	
	},20)			
}
/*
 	t:已运动时间（需要计算）
 	b:起始位置（直接获取）
 	c:要运动距离（需要计算）
 	d:运动时间(传入)
 * */
var Tween = {
    linear: function (t, b, c, d){  //匀速
        return c*t/d + b;
    },
    easeIn: function(t, b, c, d){  //加速曲线
        return c*(t/=d)*t + b;
    },
    easeOut: function(t, b, c, d){  //减速曲线
        return -c *(t/=d)*(t-2) + b;
    },
    easeBoth: function(t, b, c, d){  //加速减速曲线
        if ((t/=d/2) < 1) {
            return c/2*t*t + b;
        }
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    easeInStrong: function(t, b, c, d){  //加加速曲线
        return c*(t/=d)*t*t*t + b;
    },
    easeOutStrong: function(t, b, c, d){  //减减速曲线
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
        if ((t/=d/2) < 1) {
            return c/2*t*t*t*t + b;
        }
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },
    elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
        if (t === 0) {
            return b;
        }
        if ( (t /= d) == 1 ) {
            return b+c;
        }
        if (!p) {
            p=d*0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p/4;
        } else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },
    elasticOut: function(t, b, c, d, a, p){    //正弦增强曲线（弹动渐出）
        if (t === 0) {
            return b;
        }
        if ( (t /= d) == 1 ) {
            return b+c;
        }
        if (!p) {
            p=d*0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    },
    elasticBoth: function(t, b, c, d, a, p){
        if (t === 0) {
            return b;
        }
        if ( (t /= d/2) == 2 ) {
            return b+c;
        }
        if (!p) {
            p = d*(0.3*1.5);
        }
        if ( !a || a < Math.abs(c) ) {
            a = c;
            var s = p/4;
        }
        else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        if (t < 1) {
            return - 0.5*(a*Math.pow(2,10*(t-=1)) *
                Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        }
        return a*Math.pow(2,-10*(t-=1)) *
            Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
    },
    backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        return c*(t/=d)*t*((s+1)*t - s) + b;
    },
    backOut: function(t, b, c, d, s){
        if (typeof s == 'undefined') {
            s = 3.70158;  //回缩的距离
        }
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },
    backBoth: function(t, b, c, d, s){
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        if ((t /= d/2 ) < 1) {
            return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        }
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },
    bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
        return c - Tween['bounceOut'](d-t, 0, c, d) + b;
    },
    bounceOut: function(t, b, c, d){
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
        }
        return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
    },
    bounceBoth: function(t, b, c, d){
        if (t < d/2) {
            return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
        }
        return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
    }
}
//抖动函数
function shake(obj,attr,endFn){
    var arr=[];
    var timer=null;
    var n=0;
    if(!obj.num){
        obj.num=parseFloat(getComputedStyle(obj)[attr]);
    }
    //拿到一组数字，抖动的幅度。
    for(var i=20;i>0;i-=2){
        arr.push(i,-i);
    }
    arr.push(0);
    //用定时器来实现抖动效果。
    clearInterval(timer);
    timer=setInterval(function(){
        n++;
        if(n>arr.length-1){
            clearInterval(timer);
            endFn&&endFn();
        }
        obj.style[attr]=arr[n]+obj.num+'px';
    },30);
}