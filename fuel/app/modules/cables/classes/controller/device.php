<?php
namespace Cables;
class Controller_Device extends Controller_Cables{

	
	public function before()
	{
	
		parent::before();
	}
	
	public function action_index(){
		
		if($_POST){
		
		
			$val = Validation::forge();
			
			$val->add_field('dev', 'Device', 'required|min_length[1]|max_length[20]');
			if($val->run())
			{
				

				$out=Array(
				'pins'=>Array(
				Array('port'=>1,'dev'=>18),
				Array('port'=>2,'dev'=>19),
				Array('port'=>3,'dev'=>22),
				Array('port'=>4,'dev'=>23),
				Array('port'=>5,'dev'=>31),
				Array('port'=>6,'dev'=>32),
				Array('port'=>7,'dev'=>130),
				Array('port'=>8,'dev'=>128),
				Array('port'=>19,'dev'=>133),
				Array('port'=>20,'dev'=>134),
				Array('port'=>21,'dev'=>116),
				Array('port'=>23,'dev'=>110),
				Array('port'=>14,'dev'=>28),
				Array('port'=>31,'dev'=>81),
				Array('port'=>32,'dev'=>89),
				Array('port'=>34,'dev'=>82),
				Array('port'=>37,'dev'=>83),
				Array('port'=>40,'dev'=>86)
				),
				'ports'=>48
				
				);
				
				echo json_encode($out); 
				
				
			}}
		
		
		
	}
	
}	