<?php
namespace Graphing;
use Cacti\Cacti;


class Controller_Source extends Graphing{
	

	
	public function action_rem(){
		if($_POST){
			
			
			$val = \Validation::forge();
			$val->add_field('type', 'Action', 'required|min_length[1]|max_length[20]');
			$val->add_field('url', 'Value', 'required|min_length[1]');
			if($val->run()){

				$graph=Model_Source::find()->where('content',$val->validated('url'))->where('meta_update_user',$this->user)->get_one();
				if($graph){
					
				$graph->delete();
				}
				
				echo json_encode(array('stat'=>'ok'));
			
			}
		
		}}
	
	
	public function action_edit(){
		if($_POST){
			
			
			$val = \Validation::forge();
			$val->add_field('type', 'Action', 'required|min_length[1]|max_length[20]');
			$val->add_field('url', 'Value', 'required|min_length[1]');
			$val->add_field('usr', 'Value', 'max_length[200]');
			$val->add_field('pwd', 'Value', 'max_length[200]');
			$val->add_field('eid', 'Value', 'max_length[200]');
			if($val->run()){
				
				// add munin later...
				
				$cacti=new \Cacti($val->validated('url'));
				$code=$cacti->testConnection($val->validated('usr'), $val->validated('pwd'));
				
				
				
				if($code==200){
				
				$graph=Model_Source::find($val->validated('eid'));
					
				if($graph){
				
				
				//$graph->'typeID'=>$val->validated('type');
				$graph->user=$val->validated('usr');
				$graph->pass=$val->validated('pwd');
				$graph->content=$val->validated('url');
				$graph->meta_update_time=time();
				//'meta_update_user'=>$this->user
				//);	

				//$source=new Model_Graphing_Source($q);
				$graph->save();
				
				$code='ok';
				}else{
				$code='no';
				}
				
					
				}
				
				
				
			echo json_encode(array('code'=>$code,'data'=>array('name'=>'Cacti','content'=>$val->validated('url'))));	
				
				
			}
			
		}
	
	}
	
	
	public function action_index()
	{
		
		
		
		if($_POST){
			
			
			$val = \Validation::forge();
			$val->add_field('id', 'Action', 'required|min_length[1]|max_length[20]');
			$val->add_field('action', 'Value', 'required|min_length[1]|max_length[20]');
			
			if($val->run()){

			$source=Model_Source::find($val->validated('id'));	
				
				
			if($val->validated('action')=='get'){
			$type=Model_Type::find($source->typeID);
			
			$out=array(
		'id'=>$source['id'],
		'type'=>array('id'=>$source->typeID,'name'=>$type->name),
		'user'=>$source['user'],
		'pass'=>$source['pass'],
		'content'=>$source['content']	
		);
		
				
			}
			
			
			if($val->validated('action')=='remove'){
			
			}
			
				
			echo json_encode(array('source'=>$out));	
				
				
				
			}}
		
		
		
		
			
		
	}
}	