<?php
namespace Basic;
class Controller_Kvm_Get extends Controller_Kvm{

	public function before()
	{

		parent::before();
	
	}




	public function action_index(){
		
		if(isset($this->field)){
			
			$data=Array();
			
			$data['kvm']=$this->field->kvm;
			
			
			if($this->tmpl) $data['cables']=Array(); else 
			$data['cables']=Model_Cable::find()->where('type',3)->where('dev1',$this->field->deviceID)->or_where('dev2',$this->field->deviceID)->get();
			
			
			$data['err']='';
			
			
			if($this->isKVM()){
			return \Response::forge(\View::forge('kvm/supply',$data));
			}else{
			return \Response::forge(\View::forge('kvm/consumer',$data));
			}
		}
		
		
		
	}
}	