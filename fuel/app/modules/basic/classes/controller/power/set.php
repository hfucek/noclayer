<?php 
namespace Basic;
class Controller_Power_Set extends Controller_Power{
	public function before()
	{
	
		
		parent::before();
	}
	
	private function fix_fields($new_size,$total,$type){
	
		if($new_size<$total){
			$dif=$total-$new_size;
		}else{
			$dif=$new_size-$total;
		}
		
		
	if($total>$new_size){
			//delete overage fileds
		
			if($this->tmpl){
				$pdu_data=Model_Device_Template_Power_Socket::find()->where('powerID',$this->field->power->id)->where('type',$type)->limit($dif)->order_by('id','desc')->get();
			}else{
				$pdu_data=Model_Device_Power_Socket::find()->where('powerID',$this->field->power->id)->where('type',$type)->limit($dif)->order_by('id','desc')->get();
			}
				
		
			foreach ($pdu_data as $socket)
			{
				if(!$this->tmpl){
				//erase cables connected to that ip port as dev1:port1
				$cable=Model_Cable::find()->where('dev1',$socket->power->deviceID)->where('type',2)->where('port1',$socket->id)->get();
				foreach ($cable as $cab){
					$cab->delete();
				}
					
				//erase cables connected to that ip port as dev2:port2
				$cable=Model_Cable::find()->where('dev2',$socket->power->deviceID)->where('type',2)->where('port2',$socket->id)->get();
				foreach ($cable as $cab){
					$cab->delete();
				}
				}
		
				$socket->delete();
		
		
			}
		
		}else{
		
			//add new empty fields (diference)
			if($total<$new_size){
		
				for($i=0;$i<$dif;$i++){
					
					$prop=Array(
					'powerID'=> $this->field->power->id,
					'conn_type'=>1,
					'type' =>$type
					);
					
					
					if($this->tmpl){
							
					$socket=new Model_Device_Template_Power_Socket($prop);						
					}else{
										
					$socket=new Model_Device_Power_Socket($prop);
					}
					$socket->save();
					
					
					
				}}}
	
	}
	
	
	private function check_boundary($pdu,$size){
		
		
		//template dont have boundary 
		if($this->tmpl) return true;
		
		//this dev
		$meDev=$pdu->device;
		
		//devices below
		$DevBelows=Model_Device::find()->where('rack',$meDev->rack)->where('cat',$meDev->cat)->where('id','!=',$meDev->id)->where('meta_default_data',$meDev->meta_default_data)->get();
		
		$boundary=$pdu->pos+$size+1;
		//get all devices in rack and see if they have pos < then boundary
		foreach($DevBelows as $down){
			$pdu2=$down->power;
				
			if($pdu2->pos>$pdu->pos and $pdu2->pos<=$boundary){
					return false;
					
			}
				
		}
		
		return true;
	}
	
	public function action_index(){
		
		if(isset($this->field)){
			
			
				$val = \Validation::forge();
				
				$out=true;
				
				$val->add_field('act', 'action id', 'required|min_length[1]|max_length[20]');
				$val->add_field('val', 'value', 'required|min_length[1]');
				
				if($val->run()){	
					$data['err']='';
					$size=$val->validated('val');
					$pdu=$this->field->power;
					
					if($this->tmpl) $data['cables']=Array(); else
					$data['cables']=Model_Cable::find()->where('type',2)->where('dev1',$this->field->deviceID)->or_where('dev2',$this->field->deviceID)->get();
					
					
					switch($val->validated('act')){
						
						
					case 'act1':
						
						//current
						$pdu->current=$size;
						
						break;
					case 'act2':
						//input sockets
						
						if($this->tmpl){
							$ip_q=Model_Device_Template_Power_Socket::find()->where('powerID',$pdu->id)->where('type',1);
						}else{
							$ip_q=Model_Device_Power_Socket::find()->where('powerID',$pdu->id)->where('type',1);
						}
						
						$this->fix_fields($size, $ip_q->count(),1);
						
						
						$pdu->input=$size;
						
						
						break;
					
					case 'act3':
						//output sockets
						if($this->tmpl){
							$ip_q=Model_Device_Template_Power_Socket::find()->where('powerID',$pdu->id)->where('type',2);
						}else{
							$ip_q=Model_Device_Power_Socket::find()->where('powerID',$pdu->id)->where('type',2);
						}
					
						if($this->check_boundary($pdu, $size)){
							$this->fix_fields($size, $ip_q->count(),2);
						
						$pdu->output=$size;
						}else{
							
							$data['err']='Output number of sockets is to large for rack, there is no enough empty space in rack!';
						}
						break;
								

				}
					$pdu->save();
				
				$out=true;
				
				if($out){
				$data['pdu']=$this->field->power;
					
				if($this->isSuplly()){
				$data['maxout']=42;
				
				if(!$this->tmpl){
				if($this->field->device->meta_default_data>0) 
				$data['maxout']=42;else $data['maxout']=24; 
				}
					
			return \Response::forge(\View::forge('power/supply',$data));
			}else{
			return \Response::forge(\View::forge('power/consumer',$data));
			}
				}
				
				
				}			
			
			
			
		}
		
	}

}	
	