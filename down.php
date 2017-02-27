<?php
$url = $_GET['url'];
$dir = $_GET['dir'];
getImage($url,$dir);
function getImage($url,$save_dir='',$filename='',$type=0){ 
    if(trim($url)==''){ 
        return array('file_name'=>'','save_path'=>'','error'=>1); 
    } 
    if(trim($save_dir)==''){ 
        $save_dir='./'; 
    } 
    if(trim($filename)==''){//保存文件名 
        $ext=strrchr($url,'.'); 
        $filename=time().$ext; 
    } 
    if(0!==strrpos($save_dir,'/')){ 
        $save_dir.='/'; 
    } 
    //创建保存目录 
    if(!file_exists($save_dir)&&!mkdir($save_dir,0777,true)){ 
        return array('file_name'=>'','save_path'=>'','error'=>5); 
    } 
    //获取远程文件所采用的方法  
    if($type){ 
        $ch=curl_init(); 
        $timeout=5; 
        curl_setopt($ch,CURLOPT_URL,$url); 
        curl_setopt($ch,CURLOPT_RETURNTRANSFER,1); 
        curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,$timeout); 
        $img=curl_exec($ch); 
        curl_close($ch); 
    }else{ 
        ob_start();  
        readfile($url); 
        $img=ob_get_contents();  
        ob_end_clean();  
    } 
    //文件大小  
    $fp2=@fopen($save_dir.$filename,'a'); 
    fwrite($fp2,$img); 
    fclose($fp2); 
    unset($img,$url); 
	echo $save_dir.$filename;
}
?>