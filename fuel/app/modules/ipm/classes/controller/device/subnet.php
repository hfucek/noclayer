<?php
namespace Ipm;

class Controller_Device_Subnet extends Controller_Device {

    public function getSubnets(){
        $device=  \Basic\Model_Device::find($this->id);
        $rack=$device->racks;
        $room=$rack->rooms;
        $floor=$room->floors;
        $building=$floor->buildings;
        
        $location= Model_Location_Extra::find()->where('building',$building->id)->get();
        
        $valid=array();
        foreach ($location as $sub){
          
            //distinct rack
            if($sub['rack']==$rack->id) array_push($valid,$sub);
            
            //same room
            if($sub['rack']==0 and $sub['room']==$room->id ) array_push($valid,$sub);
            
            //same floor
            if($sub['rack']==0 and $sub['room']==0 and $sub['floor']==$floor->id ) array_push($valid,$sub);
           
            //same building
            if($sub['rack']==0 and $sub['room']==0 and $sub['floor']==0 and $sub['building']==$building->id ) array_push($valid,$sub);
            
            
            
        }
        
       
        
        return $valid;
    }
  public function ipaddres($subnet){
     
      $used=$this->get_used($subnet);
      
      $out=array();
      
      foreach ($used as $ip) {
      
          array_push($out,$ip->ipv4);
      }
      return $out;
      
  }

    public function action_index() {

        if($this->id){
            
            $out=array('data'=>array());
            
            $locs=$this->getSubnets();
            
            
            
            
            foreach ($locs as $loc)
            {
            
                
                $sub=$loc->subnet_name;
                
                if($sub){
                
                array_push($out['data'],array(
                    'id'=>$sub['id'],
                    'subnet'=>$sub['subnet'],
                    'used'=>$this->ipaddres($sub['subnet'])
                ));
                
                }else{
                //TODO:
                    //location error?
                    
                }
            }
            
            echo json_encode($out);
            
        }


}


}
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
?>
