window.onload = function(){
	

//左侧音乐列表
var musicList = document.getElementById('musicList');
var musicListUl = musicList.getElementsByTagName('ul')[0];
var musicListLis = null;
var musicListContent = musicList.getElementsByClassName('content')[0];
var MusicScrollBar = document.getElementById('MusicScrollBar');
var MusicScroll = MusicScrollBar.getElementsByClassName('scroll')[0];

//左下音乐详情
var musicDetail = document.getElementById('musicDetail');
var musicDetailMask = musicDetail.getElementsByClassName('musicDetail-mask')[0];

//右下聊天室
var talk = document.getElementById('talk');

//中上搜索框
var musicSearch = document.getElementById('musicSearch');
var musicSearchInp = musicSearch.getElementsByTagName('input')[0];

//中下音乐功能
var musicFunction = document.getElementById('musicFunction');

//音乐对象
var y = null;



//进场动画
	move(musicSearch,{top:30},1,'linear',function(){
		musicSearchInp.select();
	});
	move(musicList,{height:window.innerHeight,opacity:1},50,'linear');
	move(musicDetailMask,{top:0,opacity:1},30,'linear');
	
//音乐可视化
	var Canvas = new AudioCanvas('canvas');
	Canvas.draw();
	

	
	
	
//数据调取
	function AjaxApi(parameter,val){
		this.parameter = parameter;
		this.val = val ? val : null;
		this.request();
	}

	AjaxApi.prototype.request = function(){
		this.xhr = new XMLHttpRequest;
		if(this.val) {
			this.xhr.open('GET','api.php?parameter=' + this.parameter + '&' + this.parameter + '=' + this.val);
		} else {
			this.xhr.open('GET','api.php?parameter=' + this.parameter);
		}
		this.xhr.send();
	}
	
	
	//排行榜列表渲染
	var api = new AjaxApi('toplist');
	api.xhr.onreadystatechange = function(){
		if (api.xhr.readyState == 4) {
			if ( api.xhr.status == 200 ) {
				//数据
				var data = JSON.parse(api.xhr.responseText).result.tracks;
				//音乐列表
				musicListUl.innerHTML = musiListHTML(data);
				//滚动条
				var scroll = new customScrollBar(musicListContent,musicListUl,'MusicScrollBar');
				//音乐功能对象
				y = new Music(musicListUl);
				//音乐初始化
				y.init();
				//音乐公用功能
				y.fn();
			}
		}
	}
	
	//搜索列表渲染
	musicSearchInp.onkeydown = function(ev){
		if (ev.keyCode == 13 && ev.keyCode != '') {
			var api = new AjaxApi('search',this.value);
			api.xhr.onreadystatechange = function(){
				if (api.xhr.readyState == 4) {
					if ( api.xhr.status == 200 ) {
						//数据
						var data = JSON.parse(api.xhr.responseText).result.songs;
						//音乐列表
						musicListUl.innerHTML = musiListHTML(data);
						//滚动条
						var scroll = new customScrollBar(musicListContent,musicListUl,'MusicScrollBar');
						//删除临时文件
						y.musicDel();
						//音乐功能对象
						y = new Music(musicListUl);
						y.init();
					}
				}
			}
		}
	}
	
	//音乐功能对象
	function Music(musicUl){
		//音乐列表
		this.musicLis = musicUl.getElementsByTagName('li');
		
		//音乐播放器
		this.oAudio = document.getElementById('oAudio');
		
		//上下一曲、暂停
		this.musicFunction = document.getElementById('musicFunction');
		this.prevBtn = this.musicFunction.getElementsByClassName('music-prev-btn')[0];
		this.playBtn = this.musicFunction.getElementsByClassName('music-play-btn')[0];
		this.nextBtn = this.musicFunction.getElementsByClassName('music-next-btn')[0];
		
		//播放模式
		this.musicMode = document.getElementById('musicPlayMode');
		this.musicMode.mode = 'loop';
		
		//歌词
		this.lyric = document.getElementById('lyric');
		this.lyricUl = this.lyric.getElementsByClassName('lyric-list')[0];
		
		//音乐索引
		this.musicIndex = 0;
		
		//临时文件
		this.temp = [];
	}
	Music.prototype = {
		constructor:Music,
		
		//音乐对象初始化
		init:function(){
			var _this = this;
			//点击播放歌曲
			this.musicClick();
		},
		
		//公用功能
		fn:function(){
			var _this = this;
			//播放模式
			this.musicMode.addEventListener('click',function(){
				_this.musicPlayMode();
			})
			//上一曲
			this.prevBtn.addEventListener('click',function(){
				_this.musicPrev();
			})
			//下一曲
			this.nextBtn.addEventListener('click',function(){
				_this.musicNext();
			})
			//播放、暂停
			this.playBtn.addEventListener('click',function(){
				_this.playOnOff();
			})
		},
		
		//每首歌单击时触发的方法
		musicClick:function(){
			var _this = this;
			for (var i = 0; i < this.musicLis.length; i++) {
				_this.musicLis[i].index = i;
				//每个li点击的点击事件
				_this.musicLis[i].addEventListener('click',function(){
					//音乐索引
					_this.musicIndex = this.index;
					//音乐加载
					_this.musicPlay(this);
				})
			}
		},
		
		//音乐加载
		musicPlay:function(li){
			var _this = this;
			//创建时间戳
			var oData = new Date().getTime();
			//存储时间戳(服务器下载文件)
			this.temp.push(oData);
			var xhr = new XMLHttpRequest;
			xhr.onreadystatechange = function(){
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						//清除音乐进度/歌词进度定时器
						clearInterval(_this.timer);
						clearInterval(_this.lycTimer);
						//歌词定位初始化
						if (_this.lyricUl) {
							_this.lyricUl.style.top = 0;
						}
						//播放音乐
						_this.oAudio.src = location.href + xhr.responseText;
						//音乐详情渲染
						_this.musicDetail(li);
						//音乐进度渲染
						_this.musicCurrent();
						//播放按钮
						_this.oAudio.play();
						_this.playBtn.className = 'music-play-btn play';
						//音乐进度拖拽
						_this.musicDrag();
						//歌词加载
						_this.lyricLoad(li.dataset.songid);
					}
				}
			}
			xhr.open('GET','down.php?url=' + li.dataset.mp3 + '&dir=' + oData);
			xhr.send();
		},
		
		//歌词加载
		lyricLoad:function(songid){
			var _this = this;
			var api = new AjaxApi('lyric',songid);
			api.xhr.onreadystatechange = function(){
				if (api.xhr.readyState == 4) {
					if ( api.xhr.status == 200 ) {
						//歌词数据
						var lyricData = JSON.parse(api.xhr.responseText).lrc.lyric;
						//歌词渲染
						_this.lyricHTML(lyricData);
					}
				}
			}
		},
		
		//歌词渲染
		lyricHTML:function(data){
			var arr = data.match(/\[.+\n/g);
			for (var i = 0; i < arr.length; i++) {
				if (/^\[\d/.test(arr[i])) {
					if (arr[i].match(/\[[^\]]+\]/)[0]) {
						var time = arr[i].match(/\[[^\]]+\]/)[0];
					}
					if (arr[i].match(/\].+\n/)) {
						var lyc = arr[i].match(/\].+\n/)[0].substring(1);
					}
					arr[i] = [time,lyc];
				}
			}
			
			
			//渲染结构
			this.lyricUl.innerHTML = lyrHTML(arr);
			this.lyricLis = this.lyricUl.getElementsByTagName('li');
			
			//歌词同步
			this.lyricCurrent();
			
			//歌词拖拽
			this.lyrDrag();
		},
		
		//歌词同步
		lyricCurrent:function(){
			var _this = this;
			this.lycTimer = null;
			//歌词同步
			this.lycTimer = setInterval(function(){
				var currentTime = _this.oAudio.currentTime.toFixed(2);
				var arr = [];
				for (var i = 0; i < _this.lyricLis.length; i++) {
					if (Number(_this.lyricLis[i].dataset.time) <= Number(currentTime)) {
						arr.push(_this.lyricLis[i]);
					}
				}
				if (arr.length) {
					for (var i = 0; i < _this.lyricLis.length; i++) {
						_this.lyricLis[i].className = '';
					}
					if (arr.length > 6) {
						_this.lyricUl.style.top = -(arr.length - 6) * 24 + 'px';
					}
					arr[arr.length - 1].className = 'active';
				}
			},1000);
		},
		
		//歌词拖拽
		lyrDrag:function(){
			var _this = this;
			
			this.lycLine = document.getElementById('lycCurrent');
			
			this.lyricUl.addEventListener('mousedown',function(ev){
				clearInterval(_this.lycTimer);
				_this.lyricUl.style.transition = 'inherit';
				_this.lycLine.style.display = 'block';
				_this.disY = ev.pageY;
				_this.disT = parseInt(_this.lyricUl.style.top);
				var arr = [];
				document.onmousemove = function(ev){
					if (!_this.disT) {
						_this.disT = 0;
					}
					var t = _this.disT + (ev.pageY - _this.disY);
					_this.lyricUl.style.top = t + 'px';
					for (var i = 0; i < _this.lyricLis.length; i++) {
						if (_this.lyricLis[i].getBoundingClientRect().bottom < _this.lycLine.getBoundingClientRect().top) {
							arr.push(_this.lyricLis[i]);
						}
					}
					for (var i = 0; i < arr.length; i++) {
						arr[i].className = '';
					}
					if (arr.length) {
						arr[arr.length - 1].className = 'active';
					} else {
						_this.lyricLis[0].className = 'active';
					}
					
				}
				document.onmouseup = function(){
					if (arr != '') {
						if (arr[arr.length - 1] == _this.lyricLis[0]) {
							_this.lyricUl.style.top = 0;
						}
						var time = arr[arr.length - 1].dataset.time;
						_this.oAudio.currentTime = time;
					}
					//歌词同步
					_this.lyricCurrent();
					_this.lyricUl.style.transition = '';
					_this.lycLine.style.display = 'none';
					document.onmousemove = document.onmouseup = null;
				}
				ev.preventDefault();
			})
		},
		
		//音乐删除
		musicDel:function(){
			var _this = this;
			var n = _this.temp.length;
			var str = '';
			for (var i = 0; i < _this.temp.length; i++) {
				str += 'temp' + i + '=' + _this.temp[i] + '&';
			}
			str += 'length=' + n;
			var xhr = new XMLHttpRequest;
			xhr.open('GET','close.php?' + str);
			xhr.send();
		},
		
		//音乐详情
		musicDetail:function(li){
			var _this = this;
	
			var musicDetail = document.getElementById('musicDetail');
			this.cover = musicDetail.getElementsByTagName('img')[0];
			this.songTitle = musicDetail.getElementsByClassName('song')[0];
			this.songTitles = this.songTitle.getElementsByTagName('span');
			this.singer = musicDetail.getElementsByClassName('singer')[0];
			this.songTime = musicDetail.getElementsByClassName('song-time')[0];
	
			var liImg = li.getElementsByTagName('img')[0];
			var liSongTitles = li.getElementsByClassName('text')[0];
			var liSinger = li.getElementsByClassName('singer')[0];
			var liSongTime = li.getElementsByClassName('song-time')[0];
	
			//歌曲信息加载
			this.cover.src = liImg.src;
			this.songTitles[0].innerHTML = this.songTitles[1].innerHTML = liSongTitles.innerHTML;
			this.singer.innerHTML = liSinger.innerHTML;
			this.songTime.innerHTML = '<span>00:00</span> / ' + liSongTime.innerHTML;
		},
		
		//音乐进度/时间同步
		musicCurrent:function(){
			var _this = this;
			this.progressMusic = document.getElementById('progressMusic');
			this.progress = this.progressMusic.getElementsByClassName('progress')[0];
			this.progressMask = this.progressMusic.getElementsByClassName('progress-mask')[0];
			var time = this.songTime.getElementsByTagName('span')[0];
			
			this.timer = null;
			
			var n = 0;
			
			this.timer = setInterval(function(){
				//音乐详情时间渲染
				var current = formatDate(this.oAudio.currentTime * 1000);
				time.innerHTML = current.m + ':' + current.s;
	
				//歌曲进度渲染
				var scale = _this.oAudio.currentTime / _this.oAudio.duration;
				_this.progress.style.width = scale * _this.progressMask.offsetWidth + 'px';
				
				//歌曲结束后做的事
				if (_this.oAudio.ended) {
					clearInterval(_this.timer);
					_this.musicNext();
				}
			},1000);
		},
		
		//音乐进度拖拽
		musicDrag:function(){
			var _this = this;
			this.progressMask.addEventListener('click',function(ev){
				var scale = ev.pageX / this.offsetWidth;
				_this.oAudio.currentTime = scale * _this.oAudio.duration;
			})
		},
		
		//音乐播放暂停功能
		playOnOff:function(){
			if (this.oAudio.currentSrc) {
				if ( this.oAudio.paused ) {
					this.oAudio.play();
					this.playBtn.className = 'music-play-btn play';
				} else {
					this.oAudio.pause();
					this.playBtn.className = 'music-play-btn';
				}
			}
		},
		
		//音乐播放模式
		musicPlayMode:function(){
			switch (this.musicMode.mode){
				case 'loop':
					this.musicMode.className = 'music-play-shuffle';
					this.musicMode.mode = 'shuffle';
					break;
				case 'shuffle':
					this.musicMode.className = 'music-play-one';
					this.musicMode.mode = 'one';
					break;
				case 'one':
					this.musicMode.className = 'music-play-loop';
					this.musicMode.mode = 'loop';
					break;
			}
		},
		
		//音乐上一曲
		musicPrev:function(){
			switch (this.musicMode.mode){
				case 'loop':
					if ( this.musicLis[this.musicIndex - 1] ) {
						this.musicPlay(this.musicLis[this.musicIndex - 1]);
						this.musicIndex--;
					} else {
						this.musicPlay(this.musicLis[this.musicLis.length - 1]);
						this.musicIndex = this.musicLis.length - 1;
					}
					
					break;
				case 'shuffle':
					var shuffle = Math.round(Math.random()*this.musicLis.length);
					this.musicPlay(this.musicLis[this.musicIndex]);
					this.musicIndex = shuffle;
					break;
				case 'one':
					if ( this.musicLis[this.musicIndex - 1] ) {
						this.musicPlay(this.musicLis[this.musicIndex - 1]);
						this.musicIndex--;
					} else {
						this.musicPlay(this.musicLis[this.musicLis.length - 1]);
						this.musicIndex = this.musicLis.length - 1;
					}
					this.musicIndex--;
					break;
			}
		},
		
		//音乐下一曲
		musicNext:function(){
			switch (this.musicMode.mode){
				case 'loop':
					if ( this.musicLis[this.musicIndex + 1] ) {
						this.musicPlay(this.musicLis[this.musicIndex + 1]);
						this.musicIndex++;
					} else {
						this.musicPlay(this.musicLis[0]);
						this.musicIndex = 0;
					}
					
					break;
				case 'shuffle':
					var shuffle = Math.round(Math.random()*this.musicLis.length);
					this.musicIndex = shuffle;
					this.musicPlay(this.musicLis[this.musicIndex]);
					break;
				case 'one':
					if ( this.musicLis[this.musicIndex + 1] ) {
						this.musicPlay(this.musicLis[this.musicIndex + 1]);
						this.musicIndex++;
					} else {
						this.musicPlay(this.musicLis[0]);
						this.musicIndex = 0;
					}
					this.musicIndex++;
					break;
			}
		},
	}
	
	//浏览器关闭时(删除所听音乐时间戳文件)
	window.onbeforeunload = function(event){
		y.musicDel();
	}








	
	
	
}
