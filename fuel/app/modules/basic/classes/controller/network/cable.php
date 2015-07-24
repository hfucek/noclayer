<?php 
namespace Basic;
class Controller_Network_Cable extends Controller_Network{
	
	public function before()
	{
	
		parent::before();
	}

	
 
	public function action_remove(){
		
		
		if($_POST){
				
				
			$val = \Validation::forge();
			$val->add_field('cab', 'CABLE id', 'required|min_length[1]|max_length[20]');
			
			if($val->run()){
			//$cable=Model_Cable::find($val->validated('cab'));
                        $cable = \DB::query('delete from `cables` where id='.$val->validated('cab'));
			if($cable->execute()){
			//$cable->delete();
			echo json_encode(Array('id'=>$val->validated('cab')));
			}
				
				
			}}
		
	
}
	
	
	public function action_index(){
		
		if($_POST){
			
			
			$val = \Validation::forge();
			$val->add_field('dev1', 'Device id', 'required|min_length[1]|max_length[20]');
			$val->add_field('dev2', 'Device id', 'required|min_length[1]|max_length[20]');
			$val->add_field('port1', 'Device id', 'required|min_length[1]|max_length[20]');
			$val->add_field('port2', 'Device id', 'required|min_length[1]|max_length[20]');
			$val->add_field('name1', 'Device id', 'required|min_length[1]|max_length[20]');
			$val->add_field('name2', 'Device id', 'required|min_length[1]|max_length[20]');
			$val->add_field('cab', 'Existing cable id', 'required|min_length[1]|max_length[20]');
			$val->add_field('type', 'UTP, power...', 'required|min_length[1]|max_length[20]');
			if($val->run()){
				
			//if user reconnect use existing cable

				if($val->validated('cab')>0){
				$cable=Model_Cable::find($val->validated('cab'));	
				
				$cable->dev1=$val->validated('dev1');
				$cable->port1=$val->validated('port1');
				$cable->port2=$val->validated('port2');
				$cable->dev2=$val->validated('dev2');
				$cable->name1=$val->validated('name1');
				$cable->name2=$val->validated('name2');
				$cable->type=$val->validated('type');
				$cable->meta_update_time=time();
				}else{
				

			$props=Array(
			'dev1'=>$val->validated('dev1'),
			'port1'=>$val->validated('port1'),
			'dev2'=>$val->validated('dev2'),
			'port2'=>$val->validated('port2'),
			'name1'=>$val->validated('name1'),
			'name2'=>$val->validated('name2'),
			'type'=>$val->validated('type'),
			'meta_update_time'=>time(),
			'meta_update_user'=>$this->user
			);	
				
			
				
			$cable=new Model_Cable($props);
				}
			
			$cable->save();
				
			$out=Array('cable'=>Array());	
			
			$m=Array(
					'id'=>$cable->id,
					'dev1'=>$cable->dev1,
					'port1'=>$cable->port1,
					'port2'=>$cable->port2,
					'dev2'=>$cable->dev2,
					'name1'=>$cable->name1,
					'name2'=>$cable->name2,
					'type'=>$cable->type
			);
			array_push($out['cable'], $m);
			
			echo json_encode($out);
			
		
		}}
		/*

		if(isset($this->field)){
		
					if(!$this->field->network){
						$prop=Array(
						'fieldsetID'=>$this->field->id,
						'deviceID'=>$this->field->device->id,
						'nics'=>0,
						'vports'=>0,
						'ports'=>0,
						'uplinks'=>0,
						'config_data'=>'',
						'type'=>$this->net_type
						);
						
						$this->network=new Model_Device_Network($prop);
						$this->network->save();
						
					}
					
					
					
					$data=$this->data();
					
					return \Response::forge(\View::forge('network/windata',$data));
					
					
					
			
					
					
				}
				
		
		*/
		
	}
	
}