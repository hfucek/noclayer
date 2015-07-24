<!--
###################################################################################################
-->
<div id="win_mask"></div>
<!--
###################################################################################################
-->
<?php 



    $demo=false;
    if(isset($_SERVER['HTTP_NOC_ENV'])){if($_SERVER['HTTP_NOC_ENV']=='demo'){
    $demo=true;    
foreach(glob(APPPATH.'/views/demo/windows/*.php') as $win_name) {

	include $win_name;
	
}        
    }}
    
    if(!$demo){

foreach(glob(APPPATH.'/views/noclayer/windows/*.php') as $win_name) {

	include $win_name;
	
}
    }

foreach ($manifest->modules as $module){
	
echo Request::forge($module.'/windows/html')->execute();
}


?>
