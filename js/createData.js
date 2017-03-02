/*
	数据创建
 */
//音乐列表
function musiListHTML(data){
	var html = '';
	for (var i = 0; i < 3; i++) {
		var playTime = data[i].bMusic.playTime;
		var musicDate = formatDate(playTime);
		html += '<li data-songid="'+data[i].id+'" data-mp3="'+data[i].mp3Url.replace('m','p')+'">'+
					'<div class="cover">'+
						'<img src="'+data[i].album.picUrl+'"/>'+
					'</div>'+
					'<div class="song-info">'+
						'<p class="song">'+
							'<span class="text">'+data[i].name+'</span>'+
						'</p>'+
						'<p class="singer">'+data[i].album.artists[0].name+'</span></p>'+
						'<p class="song-time">'+musicDate.m+':'+musicDate.s+'</p>';
		if (data[i].mvid != 0) {
			html += '<div class="song-mv" data-mvid="'+data[i].mvid+'"></div>';
		}
		html += '</div>'+
				'<div class="play-btn">'+
					'<span class="play-icon"></span>'+
				'</div>'+
			'</li>';
	}
	return html;
}


//歌词
function lyrHTML(data){
	var html = '';
	for (var i = 0; i < data.length; i++) {
		data[i][0] = data[i][0].substring(1,data[i][0].length - 1);
		var m = Number(data[i][0].substring(0,2)) * 60;
		var s = Number(data[i][0].substring(3,5));
		var s1 = Number(data[i][0].substring(6));
		var str = (m+s) + '.' + String(s1);
		html += '<li data-time="'+str+'">'+data[i][1]+'</li>';
	}
	return html;
}



//时间格式化
function formatDate(n){
	var m = toZero(Math.floor(n/1000/60));
	var s = toZero(Math.floor(n/1000%60));
	return {
		m : m,
		s : s
	};
}


//补0
function toZero(n){
	return n < 10 ? '0' + n : '' + n;
}
