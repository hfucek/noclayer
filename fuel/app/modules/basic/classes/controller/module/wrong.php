<?php
namespace Basic;
class Controller_Module_Wrong extends Controller{
	
	public function action_index(){
		
		
		return \View::forge('module/wrong');
		
	}
	
} 