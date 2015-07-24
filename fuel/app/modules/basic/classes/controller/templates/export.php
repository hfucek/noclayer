<?php
namespace Basic;
class Controller_Templates_Export extends Controller_Templates{
	public function before()
	{

		parent::before();
	}

	
	public function action_index(){
		
	
		
	}
	
	public function action_devices($id=null,$name=null){
	
		if($id and $name){
		
		$data['templates']=Model_Device_Template::find($id);
		
		$data=json_decode(\View::forge('template/export',$data));
		}
		
				//return \Response::forge(\View::forge('template/data',$data));
	
	}
	
	
	
	
	

}