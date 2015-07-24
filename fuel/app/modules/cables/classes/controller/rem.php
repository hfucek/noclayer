<?php
namespace Cables;
class Controller_Rem extends Controller_Cables{

	public function before()
	{

		parent::before();
	}
	
	public function action_index(){
		
		if($_POST){
			$val = \Validation::forge();
			$val->add_field('id', 'id', 'required|min_length[1]|max_length[20]');
			//print_r($_POST);
			
			if($val->run()){
				
				$cable=Model_Cable::find($val->validated('id'));
				
				if($cable){
				$cable->delete();
				echo json_encode(Array('save'=>'true'));
				}
			
			
			
			
			}}}	
				
				
	
}	