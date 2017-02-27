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
	
	
//列表渲染
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
				var y = new Music(musicListUl);
				y.init();
			}
		}
	}
	
	
	//音乐功能对象
	function Music(musicUl){
		this.musicLis = musicUl.getElementsByTagName('li');
		this.oAudio = document.getElementById('oAudio');
		this.temp = [];
	}
	
	//音乐对象初始化
	Music.prototype.init = function(){
		//点击播放歌曲(服务器代理下载与删除)
		this.musicClick();
	}
	
	//每首歌单击时触发的方法
	Music.prototype.musicClick = function(){
		var _this = this;
		for (var i = 0; i < this.musicLis.length; i++) {
			//每个li点击的点击事件
			this.musicLis[i].addEventListener('click',function(){
				//创建时间戳
				var oData = new Date().getTime();
				//存储时间戳(服务器下载文件)
				_this.temp.push(oData);
				var xhr = new XMLHttpRequest;
				xhr.onreadystatechange = function(){
					if (xhr.readyState == 4) {
						if (xhr.status == 200) {
							//播放音乐
							_this.oAudio.src = location.href + xhr.responseText;
						}
					}
				}
				xhr.open('GET','down.php?url=' + this.dataset.mp3 + '&dir=' + oData);
				xhr.send();
			})
		}
		//硫烟气关闭时(删除所听音乐时间戳文件)
		window.onbeforeunload = function(event){
			var n = _this.temp.length;
			var str = '';
			for (var i = 0; i < _this.temp.length; i++) {
				str += 'temp' + i + '=' + _this.temp[i] + '&';
			}
			str += 'length=' + n;
			var xhr = new XMLHttpRequest;
			xhr.open('GET','close.php?' + str);
			xhr.send();
		}
	}

	
	











	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}
