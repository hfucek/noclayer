<?php 
namespace Basic;
class Controller_Network_Mac extends Controller_Network{
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
		$val->add_field('mid', 'mac port id', 'required|min_length[1]|max_length[20]');
		if($val->run()){
			$new_val=$val->validated('val');
			
			
			
			if($this->tmpl){
				$macport=Model_Device_Template_Network_Mac::find($val->validated('mid'));
				
			}else{
				$macport=Model_Network_Mac::find($val->validated('mid'));
				
			}
			
			
			if($macport){
			switch($val->validated('act')){
				
			case 'macset':
				if($this->isValidMAC($new_val))
				$macport->mac_address=$new_val;
				else{
				$out['old']=$macport->mac_address;
				$out['status']='no';
				}
				
			break;
			case 'connect':
				$dev=Model_Device::find($new_val);
				if($dev)
				$macport->conn_device=$dev->id;
				
				
			break;
			case 'disconnect':
				$macport->conn_device=0;
			break;
			case 'vlanset':
				if($new_val==0){
					$macport->vlan=0;
				}else{
				
					
					if($this->tmpl){
						$vlan=Model_Device_Template_Network_Vlan::find($new_val);
						
					}else{
						$vlan=Model_Network_Vlan::find($new_val);
					}
					
					
					
				$macport->vlan=$vlan->id;
				}
			break;
					
					
			}
			$macport->save();	
				
			}
			
			
			
		}
		
		
	echo json_encode($out);	
		
	}
	
	
}

public function action_set() {

        $out['status']='ok';
    
        $val = \Validation::forge();

        $val->add_field('m', 'element num', 'required|min_length[1]|max_length[5]');
        $val->add_field('val', 'value', 'max_length[250]');
        $val->add_field('mid', 'mac port id', 'required|min_length[1]|max_length[20]');

        if ($val->run()) {
            $new_val = $val->validated('val');

            if ($this->tmpl) {
                $macport = Model_Device_Template_Network_Mac::find($val->validated('mid'));
            } else {
                $macport = Model_Network_Mac::find($val->validated('mid'));
            }

            if ($macport) {
                switch ($val->validated('m')) {
                    case 3:
                        //pach panels
                        $macport->vlan=$new_val;
                        break;
                }
                $macport->save();
            }
            echo json_encode($out);
        }
    }

}

