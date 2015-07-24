<?php 

//initaial array setup
$racks_arr=array(
				"title"	=>	'Racks',
				"items"	=> array()	
);

//object that contain rooms equipment
$racks=$room->rack;

//main array items of rack 
$racks_data=array();

	foreach ($racks as $rack){
        
	//array with one rack equ
	$onerack_arr=array(
					"name"	=>	$rack['name'],
					"units"	=>      $rack['size'],
                                        "position" =>       $rack['position'],
                                        "order" => $rack['room_pos'],
					"id"	=>	$rack['id'],
					"equs"	=> array(),	
					"pdu"	=> Array()
	);
	
			
	
	
			//array with all devices in rack 
			$device_data=array();
			//object with devices
			$devices=$rack->device;
			
			foreach ($devices as $device){
				
				//one device array 
				$device_arr=array(
									"id"	=>	$device['id'],
									"position"	=>	$device['rack_pos'],
									"units"	=>	$device['rack_units'],
									"type"	=> $device['type'],
									"cat"   => $device['cat'],
									"host"  =>  $device['hostname'],
									"parent"  =>  $device['parent_device'],
									
				);
				
				
					$pdu=$device->power; 
					
					if($device->meta_default_data>0){
					array_push($onerack_arr['pdu'], Array(
					'id'=>$pdu->id,
					'current'=>$pdu->current,
					'input'=>$pdu->input,
					'output'=>$pdu->output,
					'ru'=>$pdu->ru,
					'pos'=>$pdu->pos,
					'cur'=>$pdu->current,
					'out'=>$pdu->output,
					'side'=>$device->meta_default_data,
					'devid'=>$device->id,
					'name'=>$device->hostname,
					'parent_device' => 0,
					'type' => $device->type
					));
					}
				
				//add device to array with others
				array_push($device_data, $device_arr);
			}
			
			$onerack_arr['equs']=$device_data;
	
	
	
	
	//add one rack to array with others
	//array_push($racks_data, $onerack_arr);
        $racks_data[$rack['room_pos']] = $onerack_arr;
	
	}
	
//main array items 
$racks_arr['items']=$racks_data;


$debug=array('debug' => 'Page rendered in {exec_time}s using {mem_usage}mb of memory.');
array_push($racks_arr, $debug);


//display json data
echo $json = json_encode($racks_arr);

