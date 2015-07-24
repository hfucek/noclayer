<?php

namespace Ipm;

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

class Observer_Location extends \Orm\Observer {

    private function update_device($ip) {
        \Log::debug('cleanupLOC:' . $ip->ipv4);
        $this->update_history($ip);
        $this->update_ip($ip);
    }

    private function update_history($ip) {
        //insert disconnect state 


        $ipv4 = new \Ipm\Ipv4object($ip->ipv4);
        $ipv4Int = $ipv4->toInt();
        if ($ipv4Int > 0) {
            $q = array(
                'ip_dotted' => $ip->ipv4,
                'ip_int' => $ipv4Int,
                'time' => time(),
                'device' => 0,
                'user' => $this->user
            );
            $history = new \Ipm\Model_History($q);
            $history->save();
        }
    }

    private function update_ip($ip) {
        //erase ipv4 from network_ip_ports 
        $ip->ipv4 = '';
        $ip->addrint = 0;
        $ip->save();
    }

    private function locate($model) {
        $this->user = \Sentry::user()->get('id');

        $sub = $model->subnet;
        //\Log::debug('loc:[]'.$sub['id'].' >'.print_r($sub,true));
        if ($sub) {

            $ips = \Basic\Model_Network_Ip::find()->where('addrint', '<=', $sub['range_to'])->where('addrint', '>=', $sub['range_from'])->get();

            \Log::debug('ips:' . print_r($ips, true));


            //$ips=  \Basic\Model_Network_Ip::find()->where('addrint','<=',$sub['range_to'])->where('addrint','>=',$sub['range_from'])->get();
            //only rack
            if ($model->rack > 0) {

                foreach ($ips as $ip) {
                    $device = $ip->network->device;
                    if ($this->user == $device->meta_update_user) {
                        //check is device 
                        if ($device->rack == $model->rack) {
                            if ($device->rack_pos >= $model->pos_from and $device->rack_pos <= $model->pos_to) {
                                $this->update_device($ip);
                            }
                        }
                    }
                }
            } else {
                //room
                if ($model->room > 0) {

                    foreach ($ips as $ip) {
                        $device = $ip->network->device;
                        //check is device 
                        if ($this->user == $device->meta_update_user) {
                            $room = $device->racks->rooms;
                            if ($room->id == $model->room) {

                                $this->update_device($ip);
                            }
                        }
                    }
                } else {
                    //floor
                    if ($model->floor > 0) {
                        foreach ($ips as $ip) {
                            $device = $ip->network->device;
                            if ($this->user == $device->meta_update_user) {
                                //check is device 
                                $floor = $device->racks->rooms->floors;
                                if ($floor->id == $model->floor) {

                                    $this->update_device($ip);
                                }
                            }
                        }
                    } else {
                        //building    

                        foreach ($ips as $ip) {
                            $device = $ip->network->device;
                            //check is device 
                            if ($this->user == $device->meta_update_user) {
                                $building = $device->racks->rooms->floors->buildings;
                                if ($building->id == $model->building) {

                                    $this->update_device($ip);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    public function before_delete($model) {

        //get all ip from that location
        $this->locate($model);
        //\Log::debug('odlicno');
        \Log::debug('location:' . $model->id);
    }

}