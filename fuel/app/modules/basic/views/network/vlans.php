<?php
$vlandata=Array('data'=>Array());
foreach ($vlans as $vlan){

	$dd=Array(
	'id'=>$vlan->id,
	'name'=>$vlan->name
	);
	array_push($vlandata['data'], $dd);
		
}
echo json_encode($vlandata);



?>