<?php 
namespace Basic;
class Controller_Network_Ip extends Controller_Network{
	
	public function before()
	{
		parent::before();
	}
	

	
	
	
	public function action_set(){
		
		$out=Array('status'=>'no');
	if(isset($this->field)){
		$out=Array('status'=>'ok');
		
		
		

			$val = \Validation::forge();
			
			
			$val->add_field('m', 'element num', 'required|min_length[1]|max_length[5]');
			$val->add_field('val', 'value', 'max_length[250]');
			$val->add_field('ip', 'ip_element id', 'required|min_length[1]|max_length[20]');
			if($val->run()){

				if($this->tmpl){
				
					$ip=Model_Device_Template_Network_Ip::find($val->validated('ip'));
				}else{
					
					$ip=Model_Network_Ip::find($val->validated('ip'));
				}
				
				
				
				
				if($ip){
					$out['ip']=$ip->id;
				$new_value=$val->validated('val');
				switch($val->validated('m')){
					case 1:
					//nic name	
						$ip->nic_name=$new_value;
					
					break;
					case 2:
					//ipv4
						if($this->isValidIP($new_value))
						$ip->ipv4=$new_value;
						else
						$out['status']='bad IP';
						$out['old']=$ip->ipv4;
					break;
					
					case 3:
					//conn type	
							
						$ip->conn_type=$new_value;
						
					break;
					case 4:
					//ipv6
						if($this->isValidIPv6($new_value))
						$ip->ipv6=$new_value;
						else
						$out['status']='bad IPv6';
						$out['old']=$ip->ipv6;
					break;
					case 5:
					//conn speed	
						$ip->conn_speed=$new_value;
					break;
								
					
					
					
				}
				
				$ip->save();
				
				

				
			}}
		
		
		}
		
		echo json_encode($out);
		
	}
	
	

}
	
	?>	