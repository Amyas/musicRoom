/*
	数据创建
 */
function musiListHTML(data){
	var html = '';
	for (var i = 0; i < 30; i++) {
		var playTime = data[i].bMusic.playTime;
		var musicDate = formatDate(playTime);
		html += '<li data-mp3="'+data[i].mp3Url.replace('m','p')+'">'+
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
