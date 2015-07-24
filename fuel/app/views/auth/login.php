<?php 


if(Sentry::check()){
	
	$out=Array(
	'log'=>true,
	'lname'=>Sentry::user()->get('username'),
	'ltyp'=>0,
	'settings'=>$settings
	);
}else{
	$out=Array(
		'log'=>false);
	
	
}


echo json_encode($out);


?>