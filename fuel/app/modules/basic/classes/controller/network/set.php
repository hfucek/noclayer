<?php 
namespace Basic;
class Controller_Network_Set extends Controller_Network{
	public function before()
	{
	
		
		parent::before();
	}
	
	/**
	 * 
	 * Update database insert/remove mac rows
	 * @param unknown_type $new_size
	 * @param unknown_type $total
	 * @param unknown_type $type
	 */
	
	private function fix_MACfields($new_size,$total,$type){
                
                $panel=$type;
                        
		if($new_size<$total){
			$dif=$total-$new_size;
		}else{
			$dif=$new_size-$total;
		}
			
		
		if($total>$new_size){
			//delete overage fileds
			if($this->tmpl){
                            
                            // split for patch panels
                            if($panel==3) {
                                
                                $ext=Model_Device_Template_Network_Mac::find()->where('tempnetID',$this->field->network->id)->where('type',3)->limit($dif/2,$dif/2)->order_by('id','desc')->get();
                                
                                $int=Model_Device_Template_Network_Mac::find()->where('tempnetID',$this->field->network->id)->where('type',1)->limit($dif/2,$dif/2)->order_by('id','desc')->get();
                                
                                $mac_data=array_merge($ext, $int);
                            
                                
                            }else  
                                $mac_data=Model_Device_Template_Network_Mac::find()->where('tempnetID',$this->field->network->id)->where('type',$type)->limit($dif)->order_by('id','desc')->get();
                            
                            foreach ($mac_data as $mac)
                                $mac->delete();
                            
			}else{
                            if($panel==3) {
                                
                                $ext=Model_Network_Mac::find()->where('networkID',$this->field->network->id)->where('type',3)->limit($dif/2,$dif/2)->order_by('id','desc')->get();
                                
                                $int=Model_Network_Mac::find()->where('networkID',$this->field->network->id)->where('type',1)->limit($dif/2,$dif/2)->order_by('id','desc')->get();
                                
                                $mac_data=array_merge($ext, $int);
                            
                                
                            }else
                                $mac_data=Model_Network_Mac::find()->where('networkID',$this->field->network->id)->where('type',$type)->limit($dif)->order_by('id','desc')->get();
                            
                            foreach ($mac_data as $mac)
                            {
                                    $cabels = Model_Cable::query()->where('dev1', $mac->net->deviceID)->where('port1', $mac->id)->and_where_open()->where('type', '=', 1)->or_where('type', '=', 3)->and_where_close()->get();
                                    
                                    foreach ($cabels as $cab){
                                            $c = Model_Cable::find(cab-id);
                                            $c->delete();
                                    }

                                    $cabels = Model_Cable::query()->where('dev2', $mac->net->deviceID)->where('port2', $mac->id)->and_where_open()->where('type', '=', 1)->or_where('type', '=', 3)->and_where_close()->get();
                                    
                                    foreach ($cabels as $cab){
                                            $c = Model_Cable::find($cab-id);
                                            $c->delete();
                                    }

                                    //error if not set on 0, for existing vlan	
                                    
                                    $mac->vlan=0;
                                    $mac->vlans=false;
                                    $mac->delete();

                            }
                        }
	
		}else{      
                    
			//add new empty fields (diference)
			if($total<$new_size){
	
				for($i=0;$i<$dif;$i++){
                                        
                                        
                                        //split for patch panel
                                        if ($panel==3) {
                                            if ($i<($dif/2))
                                                $type=1;
                                            else
                                                $type=3;
                                        }
                                    
					if($this->tmpl){	
					$prop=Array(
						 	 'tempnetID'=> $this->field->network->id,
						 	 'mac_address'=>'',
						 	 'conn_device'=>0,
						 	 'vlan'=>0,
							 'type' =>$type
					);
						
					$mac=new Model_Device_Template_Network_Mac($prop);
					}else{
					$prop=Array(
							 'networkID'=> $this->field->network->id,
						 	 'mac_address'=>'',
						 	 'conn_device'=>0,
						 	 'vlan'=>0,
					  		 'type' =>$type
					);
						
					$mac=new Model_Network_Mac($prop);
							
						
					}	
					$mac->save();
						
						
						
				}
			}
		}
	
	
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
				$ip_data=Model_Device_Template_Network_Ip::find()->where('tempnetID',$this->field->network->id)->where('type',$type)->limit($dif)->order_by('id','desc')->get();
			}else{
				$ip_data=Model_Network_Ip::find()->where('networkID',$this->field->network->id)->where('type',$type)->limit($dif)->order_by('id','desc')->get();
			}
			
		
			foreach ($ip_data as $ip)
			{
			
				//erase cables connected to that ip port as dev1:port1
				$cable=Model_Cable::find()->where('dev1',$ip->network->deviceID)->where('type',1)->where('port1',$ip->id)->get();
				foreach ($cable as $cab){
					$cab->delete();
				}
					
				//erase cables connected to that ip port as dev2:port2
				$cable=Model_Cable::find()->where('dev2',$ip->network->deviceID)->where('type',1)->where('port2',$ip->id)->get();
				foreach ($cable as $cab){
					$cab->delete();
				}	
				
				
				$ip->delete();
				
				
			}
		
		}else{
		
			//add new empty fields (diference)
			if($total<$new_size){
		
				for($i=0;$i<$dif;$i++){
					
					if($this->tmpl){
						$prop=Array(
						'tempnetID'=> $this->field->network->id,
						'nic_name'=>'',
						'ipv4'=>'',
						'ipv6'=>'',
						'conn_type'=>0,
						'conn_speed'=>0,
						'type' =>$type
						
						);
							
						$ip=new Model_Device_Template_Network_Ip($prop);						
					}else{
					$prop=Array(
					 	 'networkID'=> $this->field->network->id,
					 	 'nic_name'=>'',
					 	 'ipv4'=>'',
					 	 'ipv6'=>'',
					 	 'conn_type'=>0,
					 	 'conn_speed'=>0,
					 	 'type' =>$type

					);
					
					$ip=new Model_Network_Ip($prop);
					}
					$ip->save();
					
					
					
				}}}
		
		
	}
	
	
	public function action_index(){
		
		if(isset($this->field)){
			
			
				$val = \Validation::forge();
				
				$out=true;
				
				$val->add_field('act', 'action id', 'required|min_length[1]|max_length[20]');
				$val->add_field('val', 'value', 'required|min_length[1]');
				
				if($val->run()){	
					
					$size=$val->validated('val');
					switch($val->validated('act')){
						
					case 'act1':
						
						//number of NIC
						if($this->tmpl){
							$ip_q=Model_Device_Template_Network_Ip::find()->where('tempnetID',$this->field->network->id)->where('type',1);
						}else{
							$ip_q=Model_Network_Ip::find()->where('networkID',$this->field->network->id)->where('type',1);
						}
						
						
						$this->fix_fields($size, $ip_q->count(),1);
						
						$this->field->network->nics=$size;
						$this->field->network->save();
						
						
						break;
					case 'act2':
						//number of virtual ports
						if($this->tmpl){
						$ip_q=Model_Device_Template_Network_Ip::find()->where('tempnetID',$this->field->network->id)->where('type',2);
							
						}else{
						$ip_q=Model_Network_Ip::find()->where('networkID',$this->field->network->id)->where('type',2);
						}
						$this->fix_fields($size, $ip_q->count(),2);
						
						$this->field->network->vports=$size;
						$this->field->network->save();
						
						break;
						
					
					case 'act3':
						
						//number of ports(switch)
						if($this->tmpl){
						$ip_q=Model_Device_Template_Network_Mac::find()->where('tempnetID',$this->field->network->id)->where('type',1);
						}else{
						$ip_q=Model_Network_Mac::find()->where('networkID',$this->field->network->id)->where('type',1);
						}
						$this->fix_MACfields($size, $ip_q->count(),1);
					
						$this->field->network->ports=$size;
						$this->field->network->save();
						
						
						break;
								
					case 'act4':
						
						//number of uplinks(switch)
						
						if($this->tmpl){
						$ip_q=Model_Device_Template_Network_Mac::find()->where('tempnetID',$this->field->network->id)->where('type',2);
						}else{
						$ip_q=Model_Network_Mac::find()->where('networkID',$this->field->network->id)->where('type',2);
						}
					
						$this->fix_MACfields($size, $ip_q->count(),2);
							
						$this->field->network->uplinks=$size;
						$this->field->network->save();
						
						
						break;
						
						
					case 'act5':
						
						//number of uplinks(switch)
						$out=false;
						$this->field->network->config_data=$size;
						$this->field->network->save();
						
						
						break;
								
                                        case 'act6':
                                            
                                            // pach panel ports
						
						if($this->tmpl){
						$ip_q=Model_Device_Template_Network_Mac::find()->where('tempnetID',$this->field->network->id);
						}else{
						$ip_q=Model_Network_Mac::find()->where('networkID',$this->field->network->id);
						}
						$this->fix_MACfields($size, $ip_q->count(),3);
					
						$this->field->network->ports=$size;
						$this->field->network->save();
						
						break;
					
				}	
				if($out){
				$data=$this->data();
					
				return \Response::forge(\View::forge('network/windata',$data));
				}
				
				
				}			
			
			
			
		}
		
	}

}	
	