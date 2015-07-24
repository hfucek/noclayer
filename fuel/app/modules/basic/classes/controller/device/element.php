<?php
namespace Basic;
class Controller_Device_Element extends Controller_Device{

	public function before(){

		parent::before();
		
		$this->val = \Validation::forge('elements');
		
		
	}
	
	
	private function elements($id){
	
		$el=Array('input','textarea','checkbox','hdd','ram','img','print','network');
		return $el[$id];
	}
	
	
	public function action_remove(){
		if($_POST){
			$this->val->add_field('fid', 'fieldset id', 'required|min_length[1]|max_length[20]');
			if($this->val->run()){
		
				$field=Model_Device_Fieldset::find($this->val->validated('fid'));
				$status=$field->delete();
				
				
				$a=Array('status'=>$status);
				echo json_encode($a);
			
			}
			
		}
	
	}
	
	public function action_new(){
		$a=array('stat'=>'no');
		
		if($_POST){
			$this->val->add_field('tid', 'template id', 'required|min_length[1]|max_length[20]');
			$this->val->add_field('name', 'element name', 'required|min_length[1]|max_length[250]');
			$this->val->add_field('type', 'element type', 'required|min_length[1]|max_length[20]');
			$this->val->add_field('tab', 'window tab', 'required|min_length[1]|max_length[20]');

			
			if($this->val->run()){
			
				$device=Model_Device::find($this->val->validated('tid'));
				
			if($device){
					
				$field_props=Array(
					'type'	=>	$this->elements($this->val->validated('type')),
					'name'	=>	$this->val->validated('name'),
					'static'=> 0,
					'deviceID'	=>$device->id,
					'tab'	=> $this->val->validated('tab')
					
				);
					
					
				$field=new Model_Device_Fieldset($field_props);
				$field->save();
					
				
				$a=Array(
				'id'=> $field->id
				);
				
				
			}		
			
			
		}
		
	
	}
	
	echo json_encode($a);
	}
	
	public function action_rename(){
		if($_POST){
			$this->val->add_field('fid', 'fieldset id', 'required|min_length[1]|max_length[20]');
			$this->val->add_field('name', 'fieldset new name', 'required|min_length[1]|max_length[250]');
			if($this->val->run()){
				
				$field=Model_Device_Fieldset::find($this->val->validated('fid'));
				
				$status=false;
				if($field){

					$field->name=$this->val->validated('name');
					$status=$field->save();

					
					
				}
				$a=Array('status'=>$status);
				echo json_encode($a);
				
			}
			
		}
	
	}
}