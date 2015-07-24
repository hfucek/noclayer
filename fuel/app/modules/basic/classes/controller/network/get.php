<?php 
namespace Basic;
class Controller_Network_Get extends Controller_Network{
	
	public function before()
	{
	
		parent::before();
	}

	
 
	
	public function action_index(){
		
		if(isset($this->field)){
                                
					if(!$this->field->network){
						$prop=Array(
						'fieldsetID'=>$this->field->id,
						'deviceID'=>$this->field->device->id,
						'nics'=>0,
						'vports'=>0,
						'ports'=>0,
						'uplinks'=>0,
						'config_data'=>'',
						'type'=>$this->net_type
						);
						
						$this->network=new Model_Device_Network($prop);
						$this->network->save();
						
					}
					
					
					
					$data=$this->data();
                                        
					return \Response::forge(\View::forge('network/windata',$data));
					
					
					
			
					
					
				}
				
		
		
		
	}
	
}