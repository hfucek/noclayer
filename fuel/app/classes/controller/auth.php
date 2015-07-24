<?php
/**
 * 
 * This is main controller/router for frontend
 * @author hrvoje
 *
 */

class Controller_Auth extends Controller_Login{
 	
	public function before()
	{
		
	

		parent::before();
	}

	


 	
 	public function action_index(){

 	//	Migrate::latest('default', 'app');
		
		//default data
		//$this->install_default($data);
		
		
		//install modules
	//	$this->migrate_modules();
 		#########
 	}
 	

 	
 	public function action_logout(){
 		if (Sentry::check())
 		{
 			Sentry::logout();
 			
 			echo json_encode(Array('status'=>'ok'));
 		}
 	
 	}
 	protected function default_settings($user){
 			$props=Array(
		'name'=>'background',
		'value'=>'2',
		'meta_update_user'=>$user
		);
		$set0=new Model_Settings($props);
		$set0->save();
		
		$props2=Array(
				'name'=>'tutorials',
				'value'=>'0',
				'meta_update_user'=>$user
		);
		$set=new Model_Settings($props2);
		$set->save();
		
		return $set0;
 	
 	}
 	
 	public function action_upgrade(){
 		
 		$mig=Migrate::latest();
 		
 	
 		
 		$version=Model_Version::find('last', array('order_by' => array('meta_update_time'=>'desc')));
 		
 	
 		Config::load('install', true);
 		Config::set('install.version', $version['value']);
 		Config::save('install','install');
 		
 		
 		echo json_encode(Array('status'=>true,'ver'=>$version['value'],'dat'=>Date('d/m/Y',$version['meta_update_time'])));
 		
 	}
 	
 	private function parse_settings(){
 	
 		//when no user loged in, defualt background
 		$a=Array(Array('name'=>'background','value'=>'2'),Array('name'=>'tutorials','value'=>'0'));
 	
 	
 		if (Sentry::check())
 		{
 			$a=Array();
 			$user=Sentry::user()->get('id');
 	
 			$query=Model_Settings::find()->where('meta_update_user',$user);
 	
 			$data=$query->get();
 	
 			if($query->count()==0){
 				// user (demo) loged first time, make defualt settings
 				$this->default_settings($user);
 				$query=Model_Settings::find()->where('meta_update_user',$user);
 				
 				$data=$query->get();
 				
 			}
 	
 	
 	
 			foreach ($data as $s){
 				$m=array('name'=>$s->name,'value'=>$s->value);
 					
 				array_push($a, $m);
 			}
 	
 		}
 		return $a;
 	}
 	
 	public function action_login(){

 		
 		if($_POST){
 			
 			Config::load('sentry',true);
 			$login_metod=Config::get('sentry.login_column');
 				
 			
 			$val = Validation::forge('users');
 			if($login_metod=='email'){
 					
 				$val->add_field('n', 'Your email', 'required|valid_email');
 				$val->add_field('p', 'Your email', 'required|valid_email');
 			}
 			else{
 				$val->add_field('n', 'Your username', 'required|min_length[4]|max_length[20]');
 				$val->add_field('p', 'Your password', 'required|min_length[4]|max_length[20]');
 			}
 			
		if($val->run())
		{	
			
			
			try
			{
							
				// log the user in
			$valid_login = Sentry::login($val->validated('n'), $val->validated('p'), true);
			
			
				}
			
			
			catch (SentryAuthException $e)
			{
				// issue logging in via Sentry - lets catch the sentry error thrown
				// store/set and display caught exceptions such as a suspended user with limit attempts feature.
				//$errors = $e->getMessage();
			
				
				//if(isset($_SERVER['HTTP_NOC_ENV'])){if($_SERVER['HTTP_NOC_ENV']=='demo'){include 'demo/user.php';}}
			
			}
			
			
			
			
			
			
			
			}
			
			
			
			
		
			
			
 		}
 		
 		$data['settings']=$this->parse_settings();
 
 		
 		return Response::forge(View::forge('auth/login',$data));
 		
 		
 			
 	}
 	
 	
 	
 	
 	/**
 	 * 
 	 * simple function for check is set post variable and 
 	 * then return value, else return false
 	 * @param unknown_type $var
 	 * @return unknown|boolean
 	 */
 	private function isPost($var){
 		if(isset($_POST[$var])) return $_POST[$var];
 		return false;
 	}
 	
 	
 	public function action_test(){
 		echo'test';
 		
 	}
 	
 	
 	
 	
 	
 }