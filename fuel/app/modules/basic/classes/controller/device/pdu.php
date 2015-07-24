<?php
namespace Basic;
class Controller_Device_Pdu extends Controller_Device{

	public function before(){

		parent::before();


	}

	public function action_index(){

	echo 'ok';
	
	}
	
	private function empty_space($pds,$size){
	
		
		$h=$size*18-36;
		$n=floor($h/14);
		
		$space=array_fill(0, $n, 0);
		
		foreach ($pds as $dev){

			$pdu=$dev->power;
			//print_r($pdu);
			$uk=$pdu->pos+$pdu->output+1;
			
			for($i=$pdu->pos;$i<=$uk;$i++){
				$space[$i]=1;
			}
			
						
					}
					
		//print_r($space);			
		$m=count($space);			
		$count=0;
		for($i=0;$i<$m;$i++){
		if($space[$i]==0) $count++;else $count=0;

		
		
		if($count>9){ return $i-9;break;}
		
		}			
					
						
	return -1;	
	}
	private function get_side($p){
		if($p=='l') return 1; else return 2;
		
	}
	
	public function action_update(){
		
		if($_POST){
		
		
			$val=\Validation::forge();
			$val->add_field('rack','rack id','required|min_length[1]|max_length[20]');
			$val->add_field('p','position left|right','required|min_length[1]|max_length[20]');
			$val->add_field('pid','dev id','required|min_length[1]|max_length[20]');
			$val->add_field('n','position ru','required|min_length[1]|max_length[20]');
			if($val->run()){
		
				$pdu=Model_Device_Power::find($val->validated('pid'));
				
				if($pdu){
				$device=$pdu->device;//Model_Device::find($pdu->deviceID);
				
				$device->rack=$val->validated('rack');
				$device->meta_default_data=$this->get_side($val->validated('p'));
				$device->save();
				
				$pdu->pos=$val->validated('n')-3;
				
				$pdu->save();	
				
				}}}
		
		
	}
	
	
	public function action_new(){
		$out=0;
		if($_POST){
		
	
			$val=\Validation::forge();
			$val->add_field('rack','rack id','required|min_length[1]|max_length[20]');
			$val->add_field('p','position left|right','required|min_length[1]|max_length[20]');
			if($val->run()){
				
				$rack=Model_Rack::find($val->validated('rack'));
				
				if($rack){
					
					$size=$rack->size;
					//left or right side pdu
					if($val->validated('p')=='l'){$m=1;}else{$m=2;}
					
					$devs=Model_Device::find()->where('rack',$rack->id)->where('cat',4)->where('meta_default_data',$m)->get();
					
					$pos=$this->empty_space($devs,$rack->size);
					
					if($pos>=0){
					
					
					$props = array(
						'hostname' => 'vertical pdu',
						'type' => 0,
						'cat' => 4,
					 	'rack' => $rack->id,
						'rack_pos' => 0,
						'rack_units' => 0,
						'parent_device' => 0,
						'meta_default_data' => $m,
						'meta_update_time' => time(),
						'meta_update_user' => $this->user
					 							);
						//print_r($props);
					 						
						$dev = new Model_Device($props);
					 						
						$dev->save();
				
						
						$this->add_device_default_fields($dev);
						
						
						
						
					$power=Model_Device_Power::find()->where('deviceID',$dev->id)->get_one();
						
					$this->tmpl=false;
					$power->pos=$pos;
					$power->input=1;
					$power->output=8;
					$power->save();
						
					
					
						
						
					for($i=1;$i<=7;$i++){
							
						$prop=Array(
						'powerID'=> $power->id,
						'conn_type'=>1,
						'type' =>2
						);
							
							
						if($this->tmpl){
								
							$socket=new Model_Device_Template_Pdu_Socket($prop);
						}else{
					
							$socket=new Model_Device_Power_Socket($prop);
						}
						
						$socket->save();
							
							
							
					}
									
									
									$out=Array(
									'id'=>$power->id,
									'ru'=>8,
									'pos'=>$pos,
									'devid'=>$dev->id,
									'name'=>$dev->hostname,
									'parent_device' => 0,
									'out'=>$power['output'],
									'cur'=>$power['current']
									);
									
						
						
					}
				}
				
				
			}}
		
		
		echo json_encode(Array('data'=>$out));
	}
	
	public function add_device_default_fields($device){
 		
 		//adding default field depends of device category

 		//manufacturer
 		$this->insertStaticField('Manufacturer','input',1,$device,1);
 		
 		//model
 		$this->insertStaticField('Model','input',1,$device,1);
 		
 		
 		switch($device->cat){
 			
 			case 1: //server
 			case 2: // switch
 			case 3: // router
 			case 4: //PDU
 			case 6: //KVM switch
 			case 7: //APC ATS
 			case 8: // FC switch
 			case 10: // UPS
 				//ip address
 				$this->insertStaticField('Admin url','input',2,$device,1);
 				
 				// network field
 				$this->insertStaticField('Ports','network',2,$device,1);
 				
 				
 			break;
 			
 			default:
 			//ip address
 			$this->insertStaticField('Admin url','input',2,$device,1);
 				
 			break;	
 			
 		}
 		
 		//$this->insertStaticField('KVM settings','kvm_in',2,$device,1);
 		
 		
 		switch($device->cat){
 			case 4: //PDU
 			case 7: //APC ATS
 			case 10: // UPS
 				$this->insertStaticField('Power distribution','power_out',5,$device,1);
 				break;
 					
 			case 1: //server
 			case 2: // switch
 			case 3: // router
 				
 			case 6: //KVM switch
 				
 			case 8: // FC switch
 			case 9: // UPS
 				$this->insertStaticField('Power supply','power_in',5,$device,1);
 				break;
 					
 		}
 		
 		//images
 		$this->insertStaticField('Images','img',3,$device,0);
 		
 		
 		//export to pdf
 		$this->insertStaticField('Export to pdf','print',3,$device,0);
 		
 		
 		
 	}
 	
	
	public function insertStaticField($name,$type,$tab,$device,$static){
	
		
		
		$field=New Model_Device_Fieldset();
		$field->name=$name;
		$field->type=$type;
		$field->static=$static;
		$field->deviceID=$device->id;
		$field->tab=$tab;
		$field->save();
	
	
	
	}
	
}	