<?php
namespace Cables;
class Controller_Get extends Controller_Cables{

	public function before()
	{

		parent::before();
	}

	public function action_index(){
		
		if($_POST){
			$val = \Validation::forge();
			$val->add_field('room', 'Room id', 'required|min_length[1]|max_length[20]');
			if($val->run()){
                \Fuel\Core\Module::load('basic');
		$room=\Basic\Model_Room::find($val->validated('room'));
		
		if($room){
			
			$query = \DB::query('select distinct cables.id  from cables, rack, device where rack.room='.$room->id.' and device.rack=rack.id and (device.id=cables.dev1 or device.id=cables.dev2)');
		
			$cables=$query->as_object()->execute();
			
			$cabledata=Array();
				foreach($cables as $c){
                                    
                                    $cab= \Basic\Model_Cable::find($c->id);
                                    
                                    $dev1= \Basic\Model_Device::find($cab->dev1);
                                    $dev2= \Basic\Model_Device::find($cab->dev2);
                                    
                                    array_push($cabledata, Array(
                                        'id' => $cab->id,
                                        'dev1' => $cab->dev1,
                                        'port1' => $cab->port1,
                                        'dev2' => $cab->dev2,
                                        'port2' => $cab->port2,
                                        'name1' => $cab->name1,
                                        'name2' => $cab->name2,
                                        'type' => $cab->type,
                                        'hostname1' => $dev1->hostname,
                                        'hostname2' => $dev2->hostname,
                                    ));
                                }
			
			$data['cabledata']=$cabledata;
			$data['room']=$room;
			return \Response::forge(\View::forge('rack',$data));
		}
		
		
		
		
		
		
	}
		
		}}
                
                public function action_cable() {

                    if ($_POST) {

                        $val = \Validation::forge();
                        $val->add_field('mid', 'Cable id', 'required|min_length[1]|max_length[20]');
                        if ($val->run()) {
                           
                            $cab = \Cables\Model_Cable::find()->where('port1',$val->validated('mid'))->or_where('port2',$val->validated('mid'))->get_one();
                            $data = array('status' => 'ok', 'data' => array());
                            
                            print_r($cab);
                            
                            if($cab) {
                                
                                array_push($data['data'],
                                array(
                                    'status' => 'ok',
                                    'id' => $cab->id,
                                    'dev1' => $cab->dev1,
                                    'port1' => $cab->port1,
                                    'dev2' => $cab->dev2,
                                    'port2' => $cab->port2,
                                    'name1' => $cab->name1,
                                    'name2' => $cab->name2,
                                    'type' => $cab->type
                                ));
                            }
                            echo json_encode($data);
                        }
                    }
                }
                
}