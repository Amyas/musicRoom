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


//动画对象
function MoveFn(){
	//搜索框
	this.search = document.getElementById('musicSearch');
	this.searchInp = this.search.getElementsByTagName('input')[0];

	//音乐列表
	this.musicList = document.getElementById('musicList');
	this.musicList.onOff = false;
	this.musicListClose = this.musicList.getElementsByClassName('close')[0];

	//音乐详情
	this.musicDetail = document.getElementById('musicDetail');
	this.musicDetailMask = this.musicDetail.getElementsByClassName('musicDetail-mask')[0];
	this.musicListOnOff = this.musicDetail.getElementsByClassName('music-list-btn')[0];
	this.lyricOnOff = this.musicDetail.getElementsByClassName('lyric-btn')[0];

	//歌词
	this.lyric = document.getElementById('lyric');
	this.lyric.onOff = false;
}

MoveFn.prototype = {
	constructor:MoveFn,

	//初始化
	init:function(){
		var _this = this;
		//进场动画
		this.startAm();
		//关闭音乐列表
		this.musicListClose.addEventListener('click',function(){
			_this.closeMusicList();
		})
		//音乐列表/音乐详情开关
		this.musicListOnOff.addEventListener('click',function(){
			_this.musicListToggle();
		})
		//歌词显示关闭
		this.lyricOnOff.addEventListener('click',function(){
			_this.lyricToggle();
		})
	},

	//进场动画
	startAm:function(){
		var _this = this;
		//搜索框显示
		move(this.search,{top:30},500,'linear',function(){
			_this.searchInp.select();
		});
		//音乐列表显示
		move(this.musicList,{height:window.innerHeight,opacity:1},1000,'easeOut');
		//音乐详情显示
		move(this.musicDetailMask,{top:0,opacity:1},1000,'easeOut');

		//音乐列表已开启
		this.musicList.onOff = true;
	},

	//关闭音乐列表/音乐详情
	closeMusicList:function(){
		move(this.musicList,{height:0,opacity:0},500,'easeOut');
		move(this.musicDetailMask,{top:256,opacity:0},500,'easeOut');
		this.musicList.onOff = false;
	},

	//音乐列表开关
	musicListToggle:function(){
		if (this.musicList.onOff) {
			move(this.musicList,{height:0,opacity:0},500,'easeOut');
			move(this.musicDetailMask,{top:256,opacity:0},500,'easeOut');
			this.musicList.onOff = false;
		} else {
			move(this.musicList,{height:window.innerHeight,opacity:1},500,'easeOut');
			move(this.musicDetailMask,{top:0,opacity:1},500,'easeOut');
			this.musicList.onOff = true;
		}
	},

	//歌词开关
	lyricToggle:function(){
		var audioSrc = document.getElementById('oAudio').currentSrc;
		if (audioSrc) {
			if (this.lyric.onOff) {
				move(this.lyric,{opacity:0},500,'easeOut',function(){
					this.lyric.style.display = 'none';
					this.lyric.onOff = false;
				});
			} else {
				this.lyric.style.display = 'block';
				move(this.lyric,{opacity:1},500,'easeOut',function(){
					this.lyric.onOff = true;
				});
			}
		}
	}

}

var am = new MoveFn();
am.init();

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
			y.musicEvents();
			//MV公共功能
			y.mvEvents();
		}
	}
}

//搜索列表渲染
musicSearchInp.onkeydown = function(ev){
	if (ev.keyCode == 13 && this.value != '') {
		var api = new AjaxApi('search',this.value);
		api.xhr.onreadystatechange = function(){
			if (api.xhr.readyState == 4) {
				if ( api.xhr.status == 200 ) {
					//数据
					if (JSON.parse(api.xhr.responseText).result.songs) {
						var data = JSON.parse(api.xhr.responseText).result.songs;
					} else {
						alert('暂无歌单');
						return;
					}
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

	//MV
	this.musicMv = document.getElementById('musicMV');
	this.video = this.musicMv.getElementsByTagName('video')[0];
	//MV遮罩层
	this.videoMask = this.musicMv.getElementsByClassName('mv-mask')[0];
	//MV播放功能
	this.mvPlayBtn = document.getElementById('mvPlay');
	//MV缓存进度
	this.mvCache = this.musicMv.getElementsByClassName('progress-cache')[0];
	//MV当前进度
	this.mvCurrent = this.musicMv.getElementsByClassName('progress-current')[0];
	//MV当前进度span
	this.mvCurrentSpan = null;
	//MV进度遮罩层
	this.mvMask = this.musicMv.getElementsByClassName('progress-mask')[0];
	//MV滑块
	this.mvSlider = this.musicMv.getElementsByClassName('mv-slider')[0];
	//MV时间
	this.mvTime = this.musicMv.getElementsByClassName('mv-time')[0];
	//MV音量功能
	this.mvVolume = this.musicMv.getElementsByClassName('icon-volume')[0];
	//MV最大音量
	this.mvVolMax = this.musicMv.getElementsByClassName('volume-size')[0];
	//MV当前音量
	this.mvVolumeCurrent = this.musicMv.getElementsByClassName('volume-current')[0];
	//MV全屏
	this.fullscreen = document.getElementById('fullscreen');

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

		//点击播放MV
		this.mvClick();
	},

	//公用功能
	musicEvents:function(){
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
				//如果MV在播放就暂停MV
				if (!_this.video.paused) {
					_this.video.pause();
					_this.mvPlayBtn.className = 'mv-play';
				}
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
					var data = JSON.parse(api.xhr.responseText);
					if (data.lrc) {
						var lyricData = data.lrc.lyric;
						//歌词渲染
						_this.lyricHTML(lyricData);
					} else {
						_this.lyricUl.innerHTML = '暂无歌词';
					}
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

			//歌曲未加载成功解决方案
			if (_this.oAudio.error) {
				alert('网络错误,重新加载歌曲');
				_this.oAudio.load();
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
				this.video.pause();
				this.mvPlayBtn.className = 'mv-play';
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

	//MV点击
	mvClick:function(){
		var _this = this;
		for (var i = 0; i < this.musicLis.length; i++) {
			var mv = this.musicLis[i].getElementsByClassName('song-mv')[0];
			if (mv) {
				mv.addEventListener('click',function(ev){
					//暂停歌曲播放
					_this.playOnOff();
					//获取mvid
					var mvid = this.dataset.mvid;
					//mv加载
					_this.mvURL(mvid);
					//阻止冒泡
					ev.stopPropagation();
				})
			}
		}
	},

	//MV地址获取
	mvURL:function(mvid){
		var _this = this;
		var api = new AjaxApi('mv',mvid);
		api.xhr.onreadystatechange = function(){
			if (api.xhr.readyState == 4) {
				if ( api.xhr.status == 200 ) {
					//MV地址
					var url = JSON.stringify(JSON.parse(api.xhr.responseText).data.brs);
					url = url.match(/http[^,]+mp4/)[0];
					//MV加载
					_this.mvPlay(url);
				}
			}
		}
	},

	//MV加载
	mvPlay:function(url){
		var _this = this;
		var oData = new Date().getTime();
		//存储时间戳(服务器下载文件)
		this.temp.push(oData);
		var xhr = new XMLHttpRequest;
		xhr.onreadystatechange = function(){
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					//清除mv定时器
					clearInterval(_this.mvTimer);
					//如果歌曲在播放就暂停歌曲
					if (!_this.oAudio.paused) {
						_this.oAudio.pause();
						_this.playBtn.className = 'music-play-btn';
					}
					//mv进度清空
					_this.mvCurrent.style.width = 0;
					//mv缓存进度清空
					_this.mvCache.style.width = 0;
					//mv滑块初始化
					_this.mvSlider.style.left = 0;
					//显示MV播放器
					_this.musicMv.style.display = 'block';
					//播放MV
					_this.video.src = location.href + xhr.responseText;
					//播放功能开启
					_this.mvPlayBtn.className = 'mv-pause';
					//mv进度/缓存进度同步
					_this.mvSync(true);
					//MV拖拽
					_this.mvDrag();
				}
			}
		}
		xhr.open('GET','down.php?url=' + url + '&dir=' + oData);
		xhr.send();
	},

	//MV事件调用
	mvEvents:function(){
		var _this = this;
		//MV播放功能
		this.mvPlayBtn.addEventListener('click',function(){
			//播放MV
			_this.mvPlayOnOff();
		})
		//MV静音
		this.mvVolume.addEventListener('click',function(){
			_this.mvVol();
		})
		//MV音量改变
		this.mvChange();
		//MV滑块拖拽
		this.mvSliderDrag();
		//MV全屏
		this.fullscreen.addEventListener('click',function(){
			_this.mvFullScreen();
		})
	},

	//MV播放事件
	mvPlayOnOff:function(){
		if (this.video.currentSrc) {
			if ( this.video.paused ) {
				if (this.video.ended) {//如果MV已经结束就重新加载
					this.video.load();
					this.mvPlayBtn.className = 'mv-pause';
				} else {
					this.video.play();
					this.mvPlayBtn.className = 'mv-pause';
					this.oAudio.pause();
					this.playBtn.className = 'music-play-btn';
				}
			} else {
				this.video.pause();
				this.mvPlayBtn.className = 'mv-play';
			}
		}
	},

	//MV进度同步
	mvSync:function(onOff){
		var _this = this;
		//mv定时器
		this.mvTimer = null;
		//mv时间初始化
		this.mvCurrentSpan = null; //当前时间span
		setTimeout(function(){
			var duration = formatDate(_this.video.duration * 1000);
			if (onOff) {
				_this.mvTime.innerHTML = '<span>00:00</span> / ' + duration.m + ':' + duration.s;
			}
			_this.mvCurrentSpan = _this.mvTime.getElementsByTagName('span')[0];
		},500);

		this.mvTimer = setInterval(function(){
			//缓存同步
			var cache = _this.video.buffered.end(0);
			var cacheScale = cache / _this.video.duration;
			_this.mvCache.style.width = cacheScale * _this.mvMask.offsetWidth + 'px';

			//进度同步
			var scale = _this.video.currentTime / _this.video.duration;
			_this.mvCurrent.style.width = scale * _this.mvMask.offsetWidth + 'px';

			//滑块同步
			_this.mvSlider.style.left = scale * _this.mvMask.offsetWidth + 'px';

			//时间同步
			var currentTime = formatDate(_this.video.currentTime * 1000);
			_this.mvCurrentSpan.innerHTML = currentTime.m + ':' + currentTime.s;

			//MV播放结束
			if (_this.video.ended) {
				_this.mvPlayBtn.className = 'mv-play';
			}
		},500);
	},

	//MV滑块拖拽
	mvSliderDrag:function(){
		var _this = this;
		this.mvSlider.addEventListener('mousedown',function(ev){
			clearInterval(_this.mvTimer);
			var disX = ev.pageX - this.getBoundingClientRect().left;
			document.onmousemove = function(ev){
				var l = ev.pageX - disX - _this.mvMask.getBoundingClientRect().left;
				var maxL = _this.mvCache.offsetWidth;
				if (l < 0) {
					l = 0;
				} else if (l > maxL) {
					l = maxL;
				}
				_this.mvSlider.style.left = l + 'px';

				//拖拽当前时间渲染
				var scale = parseInt(getComputedStyle(_this.mvSlider).left) / _this.mvMask.offsetWidth;
				var currentTime = formatDate((scale * _this.video.duration) * 1000);
				_this.mvCurrentSpan.innerHTML = currentTime.m + ':' + currentTime.s;

				_this.video.currentTime = scale * _this.video.duration;
			}
			document.onmouseup = function(){
				//mv进度/缓存进度同步
				_this.mvSync(false);
				if (_this.video.error) {
					alert('网络错误,重新加载MV')
					_this.video.load();
				}
				document.onmousemove = document.onmouseup = null;
			}
			ev.preventDefault();
		})
	},

	//MV音量改变
	mvChange:function(){
		var _this = this;
		addWheel(this.videoMask,function(down){
			var vol = _this.video.volume;
			if(down){
				//向上
				vol+=0.1;
			}else{
				//向下
				vol-=0.1;
			}
			if (vol > 1) {
				vol = 1;
			} else if (vol <= 0) {
				vol = 0;
				_this.mvVolume.className = 'icon-volume mute';
			} else {
				_this.mvVolume.className = 'icon-volume';
			}
			//改变MV音量
			_this.video.volume = vol;
			//改变高度
			var scale = _this.video.volume / 1;
			_this.mvVolumeCurrent.style.height = scale * _this.mvVolMax.offsetHeight + 'px';
		});
	},

	//MV拖拽
	mvDrag:function(){
		if (!(document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen)) {
			var _this = this;
			this.videoMask.addEventListener('mousedown',function(ev){
				var disX = ev.pageX - this.getBoundingClientRect().left;
				var disY = ev.pageY - this.getBoundingClientRect().top;
				document.onmousemove = function(ev){
					var l = ev.pageX - disX;
					var t = ev.pageY - disY;
					var maxL = window.innerWidth - _this.videoMask.offsetWidth;
					var maxT = window.innerHeight - _this.videoMask.offsetHeight;
					if (l < 0) {
						l = 0;
					} else if (l > maxL) {
						l = maxL;
					}
					if (t < 0) {
						t = 0
					} else if (t > maxT) {
						t = maxT;
					}
					_this.musicMv.style.left = l + 'px';
					_this.musicMv.style.top = t + 'px';
				}
				document.onmouseup = function(){
					document.onmousemove = document.onmouseup = null;
				}
				ev.preventDefault();
			},true)
		}
	},

	//音量事件
	mvVol:function(){
		if (this.video.currentSrc) {
				if (this.video.volume > 0) {
					this.video.volume = 0;
					this.mvVolumeCurrent.style.height = 0;
					this.mvVolume.className = 'icon-volume mute';
				} else {
					this.video.volume = 1;
					this.mvVolumeCurrent.style.height = '100%';
					this.mvVolume.className = 'icon-volume';
				}
		}
	},

	//MV全屏
	mvFullScreen:function(){
		if (document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen) {//退出全屏
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if(document.oRequestFullscreen){
				document.oCancelFullScreen();
			}else if (document.webkitExitFullscreen){
				document.webkitExitFullscreen();
			}
			this.fullscreen.className = '';
		} else {//进入全屏
			if(document.documentElement.requestFullscreen) {
				document.documentElement.requestFullscreen();
			} else if(document.documentElement.mozRequestFullScreen) {
				document.documentElement.mozRequestFullScreen();
			} else if(document.documentElement.msRequestFullscreen){
				document.documentElement.msRequestFullscreen();
			} else if(document.documentElement.oRequestFullscreen){
				document.documentElement.oRequestFullscreen();
			} else if(document.documentElement.webkitRequestFullscreen){
				document.documentElement.webkitRequestFullScreen();
			}
			this.fullscreen.className = 'default';
		}
	}

}

//浏览器关闭时(删除所听音乐时间戳文件)
window.onbeforeunload = function(event){
	y.musicDel();
}

//MV是否全屏检测
document.onfullscreenchange = document.onmozfullscreenchange = document.onmsfullscreenchange = document.onwebkitfullscreenchange = function(){
	if (document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen) {
		y.fullscreen.className = 'default';
	} else {
		y.fullscreen.className = '';
	}
};












}
