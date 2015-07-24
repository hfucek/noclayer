<?php 

namespace Graphing;
use Cacti\Cacti;

class Controller_Graph extends Graphing{
	
	public function before(){
		
		\Fuel\Core\Module::load('basic');
                \Fuel\Core\Package::load('cacti');
	}
	
	
	public function action_index($id=null){
		
	
		
		
		
		
		
		
	}
	
	
	public function action_rem(){
	
		if($_POST){
			/*
				'eid':eid,
			'num':num,
			'did':CACTI.did,
			'sour':$('#cacti_source').val(),
			'graph':$('#cacti_graph').val()
			*/
			$this->user=\Sentry::user()->get('id');
				
			$val = \Validation::forge();
			$val->add_field('eid', 'Action', 'required|min_length[1]|max_length[20]');
			$val->add_field('did', 'Action', 'required|min_length[1]|max_length[20]');
			$val->add_field('type', 'Value', 'required|max_length[200]');
			if($val->run()){
	
				if($val->validated('type')=='custom'){
					$cacti=Model_Cacti::find($val->validated('eid'));
					
				}else{
					$mac=\Basic\Model_Network_Mac::find($val->validated('eid'));
					$cacti=Model_Cacti::find()->where('macID',$mac->id)->get_one();
                                        
					
				}
				
				$cacti->delete();
				echo json_encode(array('stat'=>'ok'));
				
			}
		
		
		}}
	
	public function action_set(){
		
		if($_POST){
			/*
			'eid':eid,
			'num':num,
			'did':CACTI.did,
			'sour':$('#cacti_source').val(),
			'graph':$('#cacti_graph').val()
				*/
			$this->user=\Sentry::user()->get('id');
			
			$val = \Validation::forge();
			$val->add_field('eid', 'Action', 'required|min_length[1]|max_length[20]');
			$val->add_field('did', 'Action', 'required|min_length[1]|max_length[20]');
			$val->add_field('sour', 'Value', 'required|min_length[1]');
			$val->add_field('graph', 'Value', 'required|min_length[1]|max_length[200]');
			$val->add_field('num', 'Value', 'required|max_length[200]');
			$val->add_field('type', 'Value', 'required|max_length[200]');
			$val->add_field('name', 'Value', 'required|max_length[200]');
			if($val->run()){
				
				
				
				if($val->validated('type')=='custom'){

				$cacti=Model_Cacti::find($val->validated('eid'));	
					
				if(!$cacti){
				
					
					$query=Array(
							'sourceID'=>$val->validated('sour'),
							'name'=>$val->validated('name'),
							'num'=>'0',
							'macID'=>'0',
							'graphID'=>$val->validated('graph'),
							'meta_update_time'=>time(),
							'meta_update_user'=>$this->user,
							'deviceID'=>$val->validated('did')
							);
					
					$cacti=new Model_Cacti($query);
					
				}else{
					
					$cacti->sourceID=$val->validated('sour');
					$cacti->graphID=$val->validated('graph');
					$cacti->meta_update_time=time();
					$cacti->name=$val->validated('name');
				}
					
					$cacti->save();
					
					
				}
				elseif($val->validated('type')=='port'){
					
                                    
                                   
                                    
					$mac=\Basic\Model_Network_Mac::find($val->validated('eid'));
					
					$cacti=Model_Cacti::find()->where('macID',$mac->id)->get_one();
					
					
					if(!$cacti){
					
					
					$query=Array(
							'sourceID'=>$val->validated('sour'),
							'name'=>$val->validated('name'),
							'num'=>$val->validated('num'),
							'macID'=>$val->validated('eid'),
							'graphID'=>$val->validated('graph'),
							'meta_update_time'=>time(),
							'meta_update_user'=>$this->user,
							'deviceID'=>$val->validated('did')
					);
						
					$cacti=new Model_Cacti($query);
					}else{
						
						$cacti->sourceID=$val->validated('sour');
						$cacti->graphID=$val->validated('graph');
						$cacti->meta_update_time=time();
							
						
					}
					
					$cacti->save();
						
					
				}
				echo json_encode(
						array(
								'id'=>$cacti->id,
								'name'=>$cacti->name,
								's'=>$cacti->sourceID,
								'g'=>$cacti->graphID
						));
				
			}
				
				
			
		}
		
	}
	
	
	private function resize($img,$size){
		
		$img = imagecreatefromstring($img);
		
		
		$oh=260;
		$ow=595;

		$om=$oh/$ow;
		$sizes=Array(0,350,425, 600);
		
		$w=$sizes[$size];
		
		$h=floor($om*$w);
		
		$im2 = imagecreatetruecolor($w,$h);
		
		imagecopyresampled($im2,$img , 0,0,0,0,$w,$h,$ow,$oh);
						
		
		imagepng($im2);
		imagedestroy($img);
		imagedestroy($im2);
		
	}
	
	public function action_get($sourceID=null,$id=null,$size,$rd){
		
		ob_start();
		
	
		$source=Model_Source::find($sourceID);
		
		if($source){
			
			$cacti=new \Cacti($source->content);
			$code=$cacti->authentication($source->user, $source->pass);
			
	
	    	if($code==200){
			
			
			$graph=$cacti->graph($id,$size,$rd);
			ob_end_clean();
			
			
			header('Content-Type: image/png');
		echo $graph['ret'];
			//$this->resize($graph['ret'],$size);
			
			//
			//
			
			//echo ;
		}}
		//
		
	
	}
	
	
	
}


?>
