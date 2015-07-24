<?php 
	$out=Array(
		'route'=>4,
		'items'=>Array()
	);

foreach($notes as $note){
	
	
	$d=Model_Users::find($note['meta_update_user']);
	
	
	$n=Array(
	'id'=>$note['id'],
	'txt'=>$note['txt'],
	'user'=>$d->username,
	'time'=>$note['meta_update_time'],
	
	
	);
	array_push($out['items'], $n);
	
}	

echo json_encode($out);

?>