<?php
namespace Basic;
class Controller_Power_Get extends Controller_Power{

	public function before()
	{

		parent::before();
	
	}




	public function action_index(){
		
		
		if(isset($this->field)){
			
			$data=Array();
			
			$data['pdu']=$this->field->power;
			
			
			if($this->tmpl) $data['cables']=Array(); else 
			$data['cables']=Model_Cable::find()->where('type',2)->where('dev1',$this->field->deviceID)->or_where('dev2',$this->field->deviceID)->get();
			
			
			$data['err']='';
			
			
			if($this->isSuplly()){
				$data['maxout']=42;
				
				if(!$this->tmpl){
				if($this->field->device->meta_default_data>0) 
				$data['maxout']=42;else $data['maxout']=24; 
				}
				return \Response::forge(\View::forge('power/supply',$data));
			
			
			
			}else{
			return \Response::forge(\View::forge('power/consumer',$data));
			}
			
		}
		
		
		
	}
}	