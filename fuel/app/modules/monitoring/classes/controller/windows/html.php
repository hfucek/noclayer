<?php
namespace Monitoring;

class Controller_Windows_Html extends Monitoring{
	
	public function before(){
		
	
		
	}
	
	
	public function action_index(){
		$data=Array();
		/*
		//device types
		$data['d_type']=Model_Device_Category::find('all',array( 'order_by' => array('id' => 'asc')));
		
		//raid types
		$data['raids']=Model_Raid_Type::find('all',array( 'order_by' => array('id' => 'asc')));
		
		//ram types
		$data['rams']=Model_Ram_Type::find('all',array( 'order_by' => array('id' => 'asc')));
		*/
		return \Response::forge(\View::forge('windows',$data));
		
	}
	
	
}