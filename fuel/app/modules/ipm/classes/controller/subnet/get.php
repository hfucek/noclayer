<?php

namespace Ipm;

class Controller_Subnet_Get extends Controller_Subnet {



  private function isVPS($ip){
      $out=Array();
      //
      if($ip->type==3){
          $vps_port= \Basic\Model_Vps_Ports::query()->where('portID',$ip->id)->get_one();
          
          $vps=$vps_port->vps;
          $out=array(
              'name'=>$vps->hostname,
              'id'=>$vps->id,
              
          );
          
      }
      return $out;
      
  }

    public function action_index() {

        if ($this->type >= 0) {



            switch ($this->type) {
                default:
                    echo json_encode(array('nop' => 'ok'));
                    break;

                    break;

                case 0:
                    //get all 
                    $this->get_ip_usage('all');
                    break;

                case 1:
                case 2:
                    //get subnodes
                    $this->get_ip_usage($this->id);
                    break;

                //subnets    
                case 3:
                    $this->subnet = Model_Subnet::find($this->id);
                    if ($this->subnet) {

                        $used = $this->get_used($this->subnet['subnet']);
                        $parent=Model_Node::find($this->subnet->parent);

                        $ip_used = array();

                        foreach ($used as $ip) {

                            $device = $ip->network->device;
                            array_push($ip_used, array(
                                'id' => $ip['id'],
                                'ip' => $ip['ipv4'],
                                'device' => $device->hostname,
                                'did' => $device->id,
                                'vps'=>$this->isVPS($ip)    
                                    )
                            );
                        }

                        echo json_encode(
                                array(
                                    'used' => $ip_used,
                                    'parent'=>$parent['name']
                                )
                        );
                    }
                    break;



                //reserved ip-s
            }
        }
    }

}

?>
