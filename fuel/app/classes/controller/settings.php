<?php 
use Fuel\Controller;
class Controller_Settings extends Controller_Login{
	public function before()
	{

		parent::before();
		
	}

	public function action_set(){
		if($_POST){
		
			$val = \Validation::forge();
			$val->add_field('el', 'element name', 'required|min_length[1]|max_length[20]');
			$val->add_field('val', 'value', 'required|min_length[1]');
		
			if($val->run()){
			$settings=Model_Settings::find()->where('name',$val->validated('el'))->where('meta_update_user',$this->user)->get_one();
			
			if($settings){
			$settings->value=$val->validated('val');
			$settings->save();
			}
			
			}
			
			echo json_encode(array('status'=>'ok'));
		
	}
	}
	
	
}

?>