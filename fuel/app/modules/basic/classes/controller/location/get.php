<?php

namespace Basic;

class Controller_Location_Get extends Controller_Location {


    public function action_index() {
        
if($this->id){
   $out=Array('type'=>$this->type,'data'=>array());
    switch($this->type){
        case 'build':
           
            
            array_push($out['data'],array('name'=>'All','id'=>'all'));    
            
            //return floors
            $building= \Basic\Model_Building::find($this->id);
         
            
             foreach($building->floor as $floor){
            array_push($out['data'],array('name'=>$floor['name'],'id'=>$floor['id']));    
                
            }
            
            break;
        case 'floor':
        array_push($out['data'],array('name'=>'All','id'=>'all'));
            //return rooms
            $data= \Basic\Model_Floor::find($this->id);
            
            foreach($data->room as $room){
            array_push($out['data'],array('name'=>$room['name'],'id'=>$room['id']));    
                
            }
            
            break;
        case 'room':
        array_push($out['data'],array('name'=>'All','id'=>'all'));
            //return racks
            $data= \Basic\Model_Room::find($this->id);
            
            foreach($data->rack as $rack){
            array_push($out['data'],array('name'=>$rack['name'],'id'=>$rack['id'],'size'=>$rack['size']));    
                
            }
            
            break;
        
        case 'rack':
        array_push($out['data'],array('name'=>'All','id'=>'all'));
            
            //return panels
            $data= \Basic\Model_Rack::find($this->id);
            
            if(count($data->device))
            foreach($data->device as $device){
                if($device['cat']==5)
                    array_push($out['data'],array('name'=>$device['hostname'],'id'=>$device['id'],'size'=>$device['size']));    
            
            }
            break;
            
        case 'rack2':
        array_push($out['data'],array('name'=>'All','id'=>'all'));
            
            //return panels
            $data= \Basic\Model_Rack::find($this->id);
            
            if(count($data->device))
            foreach($data->device as $device){
                    array_push($out['data'],array('name'=>$device['hostname'],'id'=>$device['id'],'size'=>$device['size']));    
            
            }
            break;
            
        case 'panel_int':
            
            //cable
            $cab= \Basic\Model_Cable::find($_POST['cab']);
            
            if($cab->port1==$this->id)
                $did=$cab->dev2;
            else
                $did = $cab->dev1;
            
            $device= \Basic\Model_Device::find()->where('id',$did)->get_one();
            $devices=\Basic\Model_Device::find()->where('rack',$device->rack)->get();
            
            $rack=\Basic\Model_Rack::find($device->rack);
            $racks=\Basic\Model_Rack::find()->where('room',$rack->room)->get();
            
            $data = array(
                        'racks' => array(),
                        'devices' => array()
                    );
                    
            foreach($devices as $device) {
                array_push($data['devices'],array(
                    'id'=>$device->id,
                    'name'=>$device->hostname
                ));
            }
            foreach($racks as $rack) {
                array_push($data['racks'],array(
                    'id'=>$rack->id,
                    'name'=>$rack->name
                ));
            }
            
            array_push($out['data'],$data);
            break;
        
        case 'panel_ext':
            
            //cable
            $cab= \Basic\Model_Cable::find($_POST['cab']);
            
            if($cab->port1==$this->id)
                $did=$cab->dev2;
            else
                $did = $cab->dev1;
            
            // devices
            $device= \Basic\Model_Device::find()->where('id',$did)->get_one();
            $devices= \Basic\Model_Device::find()->where('rack',$device->rack)->get();
            
            // rack
            $rack= \Basic\Model_Rack::find($device->rack);
            $racks= \Basic\Model_Rack::find()->where('room',$rack->room)->get();
            
            // room
            $room= \Basic\Model_Room::find($rack->room);
            $rooms= \Basic\Model_Room::find()->where('floor',$room->floor)->get();
            
            // floor
            $floor= \Basic\Model_Floor::find($room->floor);
            $floors= \Basic\Model_Floor::find()->where('building',$floor->building)->get();
            
            // building
            $buildings= \Basic\Model_Building::find('all');
            
            $data = array(
                        'buildings' => array(),
                        'floors' => array(),
                        'rooms' => array(),
                        'racks' => array(),
                        'devices' => array()
                    );
                    
            foreach($devices as $device) {
                array_push($data['devices'],array(
                    'id'=>$device->id,
                    'name'=>$device->hostname
                ));
            }
            
            foreach($racks as $rack) {
                array_push($data['racks'],array(
                    'id'=>$rack->id,
                    'name'=>$rack->name
                ));
            }
            
            foreach($rooms as $room) {
                array_push($data['rooms'],array(
                    'id'=>$room->id,
                    'name'=>$room->name
                ));
            }
            
            foreach($floors as $floor) {
                array_push($data['floors'],array(
                    'id'=>$floor->id,
                    'name'=>$floor->name
                ));
            }
            
            foreach($buildings as $building) {
                array_push($data['buildings'],array(
                    'id'=>$building->id,
                    'name'=>$building->name
                ));
            }
            
            array_push($out['data'],$data);
            break;
    }
    
    echo json_encode($out);
}
        
        
        
    
    }
}

?>
