<?php

namespace Ipm;

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
         
            
    }
    
    echo json_encode($out);
}
        
        
        
    
    }
}

?>
