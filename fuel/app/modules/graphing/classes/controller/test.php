<?php
namespace Graphing;
use Orm\Model;

class Controller_Test extends Graphing{
	

	
	public function action_index()
	{
		
		if($_POST){
			
			
			$val = \Validation::forge();
			$val->add_field('type', 'Action', 'required|min_length[1]|max_length[20]');
			$val->add_field('url', 'Value', 'required|min_length[1]');
			$val->add_field('usr', 'Value', 'max_length[200]');
			$val->add_field('pwd', 'Value', 'max_length[200]');
			$val->add_field('auth', 'Value', 'max_length[200]');
			if($val->run()){
				
				//cacti
				if($val->validated('type')==1){
					
				$cacti=new \Cacti($val->validated('url'));
				$code=$cacti->testConnection($val->validated('usr'), $val->validated('pwd'));
					
				
					
				
				
				}

				//munin
				if($val->validated('type')==2){
						
				$munin=new \Munin($val->validated('url'),$val->validated('auth'));
				$code=$munin->testConnection($val->validated('usr'), $val->validated('pwd'));
					
                                    
				
				
				}
				
				
				
				
				echo json_encode(array('code'=>$code));
				
				
				
			}
			
		}
	}

}
		