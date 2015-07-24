<?php
use Fuel\Core\Controller;

class Controller_Password extends Controller{
	
	public function before()
	{
	
		parent::before();
	}
	
	public function action_index(){
		
		Config::load('password',true);
		$reset=Config::get('password.reset');
		
		$data['instaled']=true;
		
		$data['errors']='';
		
		if($reset){

			$data['pass1']='';
			$data['pass2']='';
			
			
			
			
		if($_POST){
		$data=$_POST;
		$data['errors']=Array();
		$data['instaled']=true;
		$val = Validation::forge('users');
		$val->add_field('pass1', 'New Password', 'required|min_length[4]|max_length[40]');
		$val->add_field('pass2', 'Repeat', 'required|min_length[4]|max_length[40]');
		if($val->run()){
			
		if($val->validated('pass1')!=$val->validated('pass2')){
			
			$data['errors']=Array('New password and confirmation password do not match!');
		}else{
			Config::load('install',true);
			
			$name=Config::get('install.user');
			
			$user = \Sentry::user($name);
			
			$update = $user->update(array(
			        'password' => $val->validated('pass2')
			));
			
			
			
			Config::delete('password.reset');
			
			Config::save('password','password');
			
			return Response::forge(View::forge('install/newpass',$data));
			
		}	
			
			
			
		}else{
		
		$data['errors']=$val->error();
		}	
			
			
		}	
			
		
			
		
		return Response::forge(View::forge('install/reset',$data));
			
		}else{
		 return Response::forge(View::forge('noclayer/404'), 404);	
			
		}
		
		
	}
	
	
}