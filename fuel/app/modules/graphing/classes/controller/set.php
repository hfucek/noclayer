<?php 
namespace Graphing;
use Cacti\Cacti;


class Controller_Set extends Graphing{
	
	
	public function action_index(){
		
		
	}
	
	public function action_data(){
	
		if($_POST){
		
		
				
		
			$val=\Validation::forge();
			$val->add_field('type','type ','required|min_length[1]|max_length[20]');
			$val->add_field('val','val ','required|min_length[1]|max_length[20]');
			if($val->run()){
				
				$data=Model_Data::find()->where('name',$val->validated('type'))->get_one();
				
				if($data){
					
					$data->value=$val->validated('val');
					$data->save();
				}
				
				
			}}
			
			echo json_encode(array('stat'=>'ok'));
		
		
	}
	
	
}