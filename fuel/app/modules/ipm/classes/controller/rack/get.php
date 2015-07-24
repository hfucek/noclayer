<?php

namespace Ipm;

class Controller_Rack_Get extends Controller_Rack {

    public function action_index() {
        
        $rack=  \Basic\Model_Rack::find($this->id);
        //print_r($rack);
        $devs=$rack->device;
        
        $out=Array();
        foreach ($devs as $dev){
            $nets=$dev->network;
            
            foreach ($nets as $net){
              
          
                $ips=$net->ip;
                $port=1;
                foreach ($ips as $ip){
                    $ct=($ip->ctype)?$ip->ctype->name:'-';
                    
                    array_push($out, array('port'=>$port,'ipv4'=>$ip->ipv4,'hostname'=>$dev->hostname,'conn_type'=>$ct));
                    $port++;
                    
                }
                
            }
            
            
        }
    
        echo json_encode($out);
    }
    
}
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
?>
