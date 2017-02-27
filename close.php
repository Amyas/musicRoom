<?php
$length = $_GET['length'];

//多条数据解决方案
for($x = 0;$x < $length;$x++){
	$temps = $_GET['temp'.$x];
	deldir($temps);
}


//删除文件夹内文件后删除文件
function deldir($dir) { 
	//先删除目录下的文件： 
	$dh=opendir($dir); 
	while ($file=readdir($dh)) { 
		if($file!="." && $file!="..") { 
			$fullpath=$dir."/".$file; 
			if(!is_dir($fullpath)) { 
				unlink($fullpath); 
			} else { 
				deldir($fullpath); 
			} 
		} 
	} 
	closedir($dh); 
	//删除当前文件夹： 
	if(rmdir($dir)) { 
		return true; 
	} else { 
		return false; 
	} 
} 
?>