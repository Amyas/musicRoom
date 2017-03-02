<?php

$parameter = $_GET['parameter'];

switch ($parameter) {
	case 'toplist'://排行榜
		$data = array('id'=>3778678,'updateTime'=>-1);  //定义参数  
		$data = @http_build_query($data);  //把参数转换成URL数据  
		$aContext = array('http' => array('method' => 'POST',  
		'header'  => 'Content-type: application/x-www-form-urlencoded',  
		'header'  => 'Referer: http://music.163.com/',  
		'content' => $data ));
		$cxContext  = stream_context_create($aContext);  
		$sUrl = 'http://music.163.com/api/playlist/detail?'; //此处必须为完整路径 
		$d = @file_get_contents($sUrl,false,$cxContext);  
		print_r($d);
		break;
	case 'search'://搜索内容
		$searchVal = $_GET['search'];
		$data = array('limit'=>30,'offset'=>0,'s'=>$searchVal,'type'=>1);  //定义参数  
		$data = @http_build_query($data);  //把参数转换成URL数据  
		$aContext = array('http' => array('method' => 'POST',  
		'header'  => 'Content-type: application/x-www-form-urlencoded',  
		'header'  => 'Referer: http://music.163.com/',  
		'content' => $data ));
		$cxContext  = stream_context_create($aContext);  
		$sUrl = 'http://music.163.com/api/search/pc'; //此处必须为完整路径 
		$d = @file_get_contents($sUrl,false,$cxContext);  
		print_r($d);
		break;
	case 'lyric'://歌词
		$songid = $_GET['lyric'];
		$data = array('os'=>'pc','id'=>$songid,'lv'=>-1,'kv'=>-1,'tv'=>-1);  //定义参数  
		$data = @http_build_query($data);  //把参数转换成URL数据  
		$aContext = array('http' => array('method' => 'POST',  
		'header'  => 'Content-type: application/x-www-form-urlencoded',  
		'header'  => 'Referer: http://music.163.com/',  
		'content' => $data ));
		$cxContext  = stream_context_create($aContext);  
		$sUrl = 'http://music.163.com/api/song/lyric?'; //此处必须为完整路径 
		$d = @file_get_contents($sUrl,false,$cxContext);  
		print_r($d);
		break;
	
	default:
		
		break;
}
	
?>