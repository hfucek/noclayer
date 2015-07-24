<?php
namespace Basic;
class Controller_Device_Export extends Controller_Device{

	public function before(){
		
		parent::before();
		
		
	}
	
	public function action_index(){
		
	}
	
	public function action_devices($id=null,$name=null){
		
	
		
		if($id and $name){
			
			$device=Model_Device::find($id);
			
			
			if($device){
				
				$fields=$device->fields;
				$h=Array('title'=>$device->hostname.'X',
						 'category'=>$device->cat,
						 'items'=>Array()
				
				);
				$a=array();
				
				
				
			$file = tempnam(DOCROOT."images","zip");
				
				
				$zip = new \ZipArchive();
				$m=$zip->open($file, \ZipArchive::OVERWRITE);
				
				//images
				
				$zip->addEmptyDir('images');
				
				$zip->addEmptyDir('images/tumb');
				
				
				foreach($fields as $field){
				$val='';
	if($field['value']!=null){
		$val=htmlspecialchars_decode($field['value']);
	}
	
	$a=Array(
						'name'=> $field['name'],
						//'id' => $field['id'],
						'tab'	=>$field['tab'],
						'value' =>  $val,			
						'element'=>$field['type'] ,
						'static'	=>$field['static'],
						'extra'	=>$field['extra'],
						'class'=> "",
						'items'=>null
	);
	
	
	//get hdd into array
	
	if($field['type']=='hdd'){
		
		$a['items']=Array();
		
		
	$hdds=$field->hdd;	
		
	$a['raid_type']=$hdds->raid_type;
	$a['size']=$hdds->size;
	$a['total']=$hdds->total;
	
	foreach($hdds->rows as $hdd){
		
		$m=Array(
		'model'=> $hdd['model'],
		'size' => $hdd['size'],
		'vport'	=>$hdd['vport'],
		'serial_number' =>  $hdd['serial_number']									
		);
		array_push($a['items'], $m);
		
		
	}}
	
	//get ram into array
	
	if($field['type']=='ram'){
	
		$a['items']=Array();
	
	
		$rams=$field->ram;
        $a['ram_type']=$rams->ram_type;	
        $a['size']=$rams->size;
        $a['total']=$rams->total;
        
		foreach($rams->rows as $ram){
	
			$m=Array(
				'model'=> $ram['model'],
				'size' => $ram['size'],
				'port'	=>$ram['port'],
				'serial_number' =>  $ram['serial_number']									
			);
			array_push($a['items'], $m);
	
	
		}
	}	
	
	
	
	//get images into array
	if($field['type']=='img'){
		
		
		$imagedir = DOCROOT.'images/';
		
		
		
		
		$a['items']=Array();
		$imgs=$field->images;
	
		foreach($imgs as $img){
			
			if(is_file($imagedir.$img->id.'.png')){
			$zip->addFile($imagedir.$img->id.'.png','images/'.$img->id.'.png');
			}
			if(is_file($imagedir.'tumb/'.$img->id.'.png')){
			$zip->addFile($imagedir.'tumb/'.$img->id.'.png','images/tumb/'.$img->id.'.png');
			}
			
			$im=Array('type'=>$img->type,'tmpl'=>'true','w'=>$img->width,'h'=>$img->height);
	
			array_push($a['items'], $im);
		}
	
	
	
	}
	
		
		
		
	if($field['type']=='power_in'){
		$a['element']='none';
		$a['nolegend']='ok';
		$a['special']='inpowerfield';
	
		$pdu=$field->power;
		$a['data']=Array(
				//'id'=>$pdu->id,
				'input'=>$pdu->input,
				'current'=>$pdu->current,
				'output'=>$pdu->output,
				'type'=>$pdu->type,
				'sockets'=>Array()
		);
	
		foreach($pdu->socket as $socket){
			array_push($a['data']['sockets'],Array(
				//'id'=>$socket->id,
				'type'=>$socket->type,
				'conn_type'=>$socket->conn_type,
			));
	
		}
	
	}
	
	
	
	
	
	if($field['type']=='power_out'){
		$a['element']='none';
		$a['nolegend']='ok';
		$a['special']='powerfield';
	
		$pdu=$field->power;
		$a['data']=Array(
			//'id'=>$pdu->id,
			'input'=>$pdu->input,
			'current'=>$pdu->current,
			'output'=>$pdu->output,
			'type'=>$pdu->type,
			'sockets'=>Array()
		);
	
		foreach($pdu->socket as $socket){
			array_push($a['data']['sockets'],Array(
			//'id'=>$socket->id,
			'type'=>$socket->type,
			'conn_type'=>$socket->conn_type,
			));
				
		}
	
	}
	
	/*
	 * KVM distribution
	* */
	
	if($field['type']=='kvm_in'){
		$a['element']='none';
		$a['nolegend']='ok';
		$a['special']='inkvmfield';
	
		$kvm=$field->kvm;
		$a['data']=Array(
						//'id'=>$kvm->id,
						'input'=>$kvm->input,
						'output'=>$kvm->output,
						'sockets'=>Array()
		);
	
		foreach($kvm->socket as $socket){
			array_push($a['data']['sockets'],Array(
						'id'=>$socket->id,
						'type'=>$socket->type,
						'conn_type'=>$socket->conn_type,
			));
	
		}
	
	}
	
	
	if($field['type']=='kvm_out'){
		$a['element']='none';
		$a['nolegend']='ok';
		$a['special']='kvmfield';
	
		$kvm=$field->kvm;
		$a['data']=Array(
				//'id'=>$kvm->id,
				'input'=>$kvm->input,
				'output'=>$kvm->output,
				'sockets'=>Array()
		);
	
		foreach($kvm->socket as $socket){
			array_push($a['data']['sockets'],Array(
				///'id'=>$socket->id,
				'type'=>$socket->type,
				'conn_type'=>$socket->conn_type,
			));
	
		}
	
	}
	
	if($field['type']=='network'){
	
	
		$a['element']='none';
		$a['data']=Array();
		
		
	
                echo $field['type'];
		if($field->network){
	
			$a['extra']=Array(
			'type'=>$field->network->type,
			'nics'=>$field->network->nics,
			'vports'=>$field->network->vports,
			'ports'=>$field->network->ports,
			'uplinks'=>$field->network->uplinks,
			'config_data'=>$field->network->config_data,
			);
                        
			$a['type']=$field->network->type;
			switch($field->network->type){
				case 1:
					//server ip tables
	
					$a['special']='ipfield';
	
					$i=1;
					
					foreach ($field->network->ip as $ip)
					{
	
						array_push($a['data'],Array('port'=> Array(
						//'id'=>$ip->id,
						'n'=>$i,
						'name'=>$ip->nic_name,
						'ipv4'=>$ip->ipv4,
						'ipv6'=>$ip->ipv6,
						'conn_type'=>$ip->conn_type,
						'conn_speed'=>$ip->conn_speed,
						'type'=>$ip->type
						)));
						$i++;
					}
					
	
					break;
	
				case 2:
	
					$a['special']='macfield';
					$a['vlans']=Array();
	
	
					$i=1;
					foreach ($field->network->mac as $mac){
	
						$d=Array(
										'n'=>$i,
										//'id'=>$mac->id,
										'mac_addr'=>$mac->mac_address,
										'conn_dev'=>$mac->conn_device,
										'vlan'=>$mac->vlan,
										'type'=>$mac->type
						);
						array_push($a['data'], $d);
						$i++;
					}
	
	
					foreach ($field->network->vlan as $vlan){
	
						$d=Array(
														'id'=>$vlan->id,
														'name'=>$vlan->name
							
						);
						array_push($a['vlans'], $d);
	
					}
	
	
					break;
                                        
                                case 3:
                                        
                                        
                                        $a['special'] = 'panelfield';

                                        $i = 1;
                                        foreach ($field->network->mac as $mac) {

                                            $d = Array(
                                                'n' => $i,
                                                'id' => $mac->id,
                                                'mac_addr' => $mac->mac_address,
                                                'conn_dev' => $mac->conn_device,
                                                'vlan' => $mac->vlan,
                                                'type' => $mac->type
                                            );
                                            array_push($a['data'], $d);
                                            $i++;
                                        }

                                        break;
			}
		}
	
	
	
	
	
	}
	
	
	array_push($h['items'], $a);	
	
	
	
}




$json= json_encode($h);



//data
$zip->addFromString('data.json', $json);


$zip->close();

ob_clean();
header('Content-Type: application/zip');
header("Content-Length: " . filesize($file));
header('Content-Disposition: attachment; filename="'.str_replace(' ','_', $device->hostname).'.zip"');
readfile($file);
exit;






//unlink($file);
				
				
			}
			
			
			
			
		
		
		
		}
		
		
		
	}

}