<?php 
namespace Basic;
class Controller_Power_Socket_Set extends Controller_Power{
	public function before()
	{
	
		
		parent::before();
	}
	
	
	public function action_index(){
		
		$val=\Validation::forge();
		$val->add_field('eid','rack id','required|min_length[1]|max_length[20]');
		$val->add_field('soc','position left|right','required|min_length[1]|max_length[20]');
		$val->add_field('tmpl','position left|right','required|min_length[1]|max_length[20]');
		$val->add_field('val','position left|right','required|min_length[1]|max_length[20]');
		if($val->run()){
			
			if($val->validated('tmpl')=="true")
			$socket=Model_Device_Template_Power_Socket::find($val->validated('soc'));
			else
			$socket=Model_Device_Power_Socket::find($val->validated('soc'));
			
			if($socket){
				$socket->conn_type=$val->validated('val');
				$socket->save();
			echo json_encode(Array('status'=>'ok'));	
			}
			
			
			
		}
		
	}

}	
	