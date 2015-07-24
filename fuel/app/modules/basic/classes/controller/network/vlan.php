<?php 
namespace Basic;
class Controller_Network_Vlan extends Controller_Network{
	public function before()
	{
	
		
		parent::before();
	}
	
	/**
	 * 
	 * Update database update mac/conn device/ vlan/ configdata
	 */
	
	
	
	
public function action_index(){
	if(isset($this->field)){
			
		
		$out['status']='ok';
			
			
		$val = \Validation::forge();
	
	
		$val->add_field('act', 'action id', 'required|min_length[1]|max_length[20]');
		$val->add_field('val', 'value', 'required|min_length[1]');
		
		if($val->run()){
			$new_val=$val->validated('val');
			
			
			
			switch($val->validated('act')){
				
			case 'add':

				if(!$this->tmpl){	
				
			$prop=Array(
			'name'=>$new_val,
			'networkID'=>$this->field->network->id
			);	

			$vlan=new Model_Network_Vlan($prop);
			
				}else{
					
			$prop=Array(
			'name'=>$new_val,
			'tempnetID'=>$this->field->network->id
			);
					
			$vlan=new Model_Device_Template_Network_Vlan($prop);					
					
				}
			
			$vlan->save();
				
			break;
			case 'rem':
				if(!$this->tmpl){
				$vlan=Model_Network_Vlan::find($new_val);
				}else{
					$vlan=Model_Device_Template_Network_Vlan::find($new_val);
					
				}
			
			if($vlan) 
			$vlan->delete();	
				
			break;
			case 'ren':
				
			break;
					
					
			}
				

			$data=$this->data();
			
			return \Response::forge(\View::forge('network/vlans',$data));
			
			
			}
			
			
			
		
		
		
	echo json_encode($out);	
		
	}
	
	
}
	
	
}	
	