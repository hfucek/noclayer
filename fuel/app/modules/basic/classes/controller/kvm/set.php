<?php 
namespace Basic;
class Controller_Kvm_Set extends Controller_Kvm{
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
				$pdu_data=Model_Device_Template_Kvm_Socket::find()->where('kvmID',$this->field->kvm->id)->where('type',$type)->limit($dif)->order_by('id','desc')->get();
			}else{
				$pdu_data=Model_Device_Kvm_Socket::find()->where('kvmID',$this->field->kvm->id)->where('type',$type)->limit($dif)->order_by('id','desc')->get();
			}
				
		
			foreach ($pdu_data as $socket)
			{
				if(!$this->tmpl){
				//erase cables connected to that ip port as dev1:port1
				$cable=Model_Cable::find()->where('dev1',$socket->kvm->deviceID)->where('type',3)->where('port1',$socket->id)->get();
				foreach ($cable as $cab){
					$cab->delete();
				}
					
				//erase cables connected to that ip port as dev2:port2
				$cable=Model_Cable::find()->where('dev2',$socket->kvm->deviceID)->where('type',3)->where('port2',$socket->id)->get();
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
					'kvmID'=> $this->field->kvm->id,
					'conn_type'=>1,
					'type' =>$type
					);
					
					
					if($this->tmpl){
							
					$socket=new Model_Device_Template_Kvm_Socket($prop);						
					}else{
										
					$socket=new Model_Device_Kvm_Socket($prop);
					}
					$socket->save();
					
					
					
				}}}
	
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
					$kvm=$this->field->kvm;
					
					if($this->tmpl) $data['cables']=Array(); else
					$data['cables']=Model_Cable::find()->where('type',2)->where('dev1',$this->field->deviceID)->or_where('dev2',$this->field->deviceID)->get();
					
					
					switch($val->validated('act')){
						
						
					case 'act1':
						
						//current
						//$pdu->current=$size;
						
						break;
					case 'act2':
						//input sockets
						
						if($this->tmpl){
							$ip_q=Model_Device_Template_Kvm_Socket::find()->where('kvmID',$kvm->id)->where('type',1);
						}else{
							$ip_q=Model_Device_Kvm_Socket::find()->where('kvmID',$kvm->id)->where('type',1);
						}
						
						$this->fix_fields($size, $ip_q->count(),1);
						
						
						$kvm->input=$size;
						
						
						break;
					
					case 'act3':
						//output sockets
						if($this->tmpl){
							$ip_q=Model_Device_Template_Kvm_Socket::find()->where('kvmID',$kvm->id)->where('type',2);
						}else{
							$ip_q=Model_Device_Kvm_Socket::find()->where('kvmID',$kvm->id)->where('type',2);
						}
					
						//if($this->check_boundary($pdu, $size)){
							$this->fix_fields($size, $ip_q->count(),2);
						
						$kvm->output=$size;
						
						break;
								

				}
					$kvm->save();
				
				$out=true;
				
				if($out){
				$data['kvm']=$this->field->kvm;
					
				if($this->isKVM()){
			return \Response::forge(\View::forge('kvm/supply',$data));
			}else{
			return \Response::forge(\View::forge('kvm/consumer',$data));
			}
				}
				
				
				}			
			
			
			
		}
		
	}

}	
	