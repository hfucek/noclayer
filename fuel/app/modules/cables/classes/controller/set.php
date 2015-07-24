<?php
namespace Cables;
class Controller_Set extends Controller_Cables{

	public function before()
	{
                \Fuel\Core\Module::load('basic');
		parent::before();
	}

	/*
	 * numerical value of port into id from db 
	 * 
	 * */

	private function getDevicePort($dev,$num, $type){
	
		
		
                
		$network=\Basic\Model_Device_Network::find()->where('deviceID',$dev->id)->get_one();
		
		//echo $network->id; 
		
		switch($dev->cat){
			case 2: //switch
 			case 8: //FC switch
 			case 3: //router
 		$ports=\Basic\Model_Network_Mac::find()->where('networkID',$network->id)->offset($num-1)->get_one();
 		break;	
                        case 5:
                            
                            $ext=array();
                            $int=array();
                            $ports = new \stdClass();
                            
                            // get all device ports
                            $ps=\Basic\Model_Network_Mac::find()->where('networkID',$network->id)->get();
                            
                            // split utp and patch ports
                            foreach($ps as $port) {
                                if($port->type == 3) 
                                    array_push($ext, $port->id);
                                
                                if($port->type == 1)
                                    array_push($int, $port->id);
                            }
                            
                            if($type == 4)
                                $ports->id = $ext[$num-1];
                            
                            if($type == 1)
                                $ports->id = $int[$num-1];
                            
                            
                            break;
 		default:
 		$ports=\Basic\Model_Network_Ip::find()->where('networkID',$network->id)->offset($num-1)->get_one();
		break;
		}
		
		
		
		return $ports->id;
		
		
		
	
	}
	
	public function action_test(){
	$dev=\Basic\Model_Device::find(16);
		
	
	
	$this->getDevicePort($dev, 1, false);
	
	}
	
	
	public function action_index(){
		
		if($_POST){
			
			
			$val = \Validation::forge();
			$val->add_field('dev1', 'dev1', 'required|min_length[1]|max_length[20]');
			$val->add_field('dev2', 'dev2', 'required|min_length[1]|max_length[20]');
			$val->add_field('name1', 'name1', 'required|min_length[1]|max_length[200]');
			$val->add_field('name2', 'name2', 'required|min_length[1]|max_length[200]');
			$val->add_field('port1', 'name1', 'required|min_length[1]|max_length[200]');
			$val->add_field('port2', 'name2', 'required|min_length[1]|max_length[200]');
			$val->add_field('type', 'type', 'required|min_length[1]|max_length[3]');
			$val->add_field('act', 'action', 'required|min_length[1]|max_length[30]');
			$val->add_field('cab', 'action', 'max_length[30]');
			
			
			//print_r($_POST);
			
			if($val->run()){
				
                                \Log::debug("port1 ".$val->validated('port1'));
                                \Log::debug("port2 ".$val->validated('port2'));
				
				$device1=\Basic\Model_Device::find($val->validated('dev1'));
				
				$device2=\Basic\Model_Device::find($val->validated('dev2'));
				
				
				switch($val->validated('type')){
					//network
					case 1:
                                        case 4:
					//if()
						
						$port1=$this->getDevicePort($device1, $val->validated('name1'), $val->validated('type'));
						$port2=$this->getDevicePort($device2, $val->validated('name2'), $val->validated('type'));
							
						
						
					break;
					case 2:
					case 3:	
						$port1= $val->validated('port1');
						$port2=$val->validated('port2');
						
						break;
				}

					
				
			
			//$cable->save();
				
				
				
				
				
				
			switch($val->validated('act')){
			
				case 'connect':

					
					$props=Array(
			'dev1'=>$val->validated('dev1'),
			'port1'=>$port1,
			'dev2'=>$val->validated('dev2'),
			'port2'=>$port2,
			'name1'=>$val->validated('name1'),
			'name2'=>$val->validated('name2'),
			'type'=>$val->validated('type'),
			'meta_update_time'=>time(),
			'meta_update_user'=>$this->user
			);	
				
			
				
			$cable=new Model_Cable($props);
			
			$cable->save();
			
		
			
			$m=Array(
					'id'=>$cable->id,
					'dev1'=>$cable->dev1,
					'port1'=>$cable->port1,
					'port2'=>$cable->port2,
					'dev2'=>$cable->dev2,
					'name1'=>$cable->name1,
					'name2'=>$cable->name2,
					'type'=>$cable->type,
                                        'hostname1'=>$device1->hostname,
                                        'hostname2'=>$device2->hostname
			);
			
			echo json_encode(Array('cable'=>$m));
			
			
			
					
				break;
				
				case 'move':
					
				//print_r($_POST);	
					
				$cable=Model_Cable::find($val->validated('cab'));

				if($cable){
				$cable->dev1=$val->validated('dev1');
			$cable->port1=$port1;
			$cable->dev2=$val->validated('dev2');
			$cable->port2=$port2;
			$cable->name1=$val->validated('name1');
			$cable->name2=$val->validated('name2');
			$cable->meta_update_time=time();
			$cable->save();
				
				$m=Array(
					'id'=>$cable->id,
					'dev1'=>$cable->dev1,
					'port1'=>$cable->port1,
					'port2'=>$cable->port2,
					'dev2'=>$cable->dev2,
					'name1'=>$cable->name1,
					'name2'=>$cable->name2,
					'type'=>$cable->type,
                                        'hostname1'=>$device1->hostname,
                                        'hostname2'=>$device2->hostname
			);
					echo json_encode(Array('cable'=>$m));
				}
				
			
					
					
					
				break;
			
			
			}	
				
				
				
		/*
				$room=Model_Room::find($val->validated('room'));
		
		if($room){
			
			$query = DB::query('select distinct cables.* from cables, rack, device where rack.room='.$room->id.' and device.rack=rack.id and (device.id=cables.dev1 or device.id=cables.dev2)');
		
			$cables=$query->as_object()->execute();
			
			$cabledata=Array();
				foreach($cables as $cab){
					array_push($cabledata,Array(
				 				'id'=>$cab->id,
				 				'dev1'=>$cab->dev1,
				 				'port1'=>$cab->port1,
				 				'dev2'=>$cab->dev2,
				 				'port2'=>$cab->port2,
				 				'name1'=>$cab->name1,
				 				'name2'=>$cab->name2,
								'type'=>$cab->type
				
					));
				
				}
				
			
			
			$data['cabledata']=$cabledata;
			$data['room']=$room;
			return \Response::forge(View::forge('cables/rack',$data));
		}
		
		
		*/
		
		
		
	}
		
		}}}