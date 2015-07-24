<?php

namespace Ipm;

class Observer {

    public static function IsValidLocation($sub, $device, $ip) {
        $valid = false;
        $locations = \Ipm\Model_Location::find()->where('node', $sub->id)->get();

        \Log::debug('isvalid ::');

        $device = $ip->network->device;

        $data = Array(
            $device->racks->rooms->id,
            $device->racks->rooms->floors->id,
            $device->racks->rooms->floors->buildings->id
        );



        foreach ($locations as $loc) {

            if ($loc->rack > 0) {

                //different racks
                if ($loc->rack == $device->racks->id) {


                    if ($device->rack_pos >= $loc->pos_from and $device->rack_pos <= $loc->pos_to) {
                        \Log::debug('rack ok::' . $ip->ipv4);
                        $valid = true;
                    }
                }
            } else {


                $fields = array('room', 'floor', 'building');

                for ($i = 0; $i <= 2; $i++) {



                    if ($loc[$fields[$i]] > 0) {

                        if ($loc[$fields[$i]] == $data[$i]) {
                            $valid = true;
                            \Log::debug($fields[$i] . '::' . $ip->ipv4);
                        }
                    }
                }
            }
        }

        if (!$valid) {
            \Log::debug('clean ip port::' . $ip->ipv4);

            $ipv4 = new \Ipm\Ipv4object($ip->ipv4);
            $ipv4Int = $ipv4->toInt();
            if ($ipv4Int > 0) {
                $q = array(
                    'ip_dotted' => $ip->ipv4,
                    'ip_int' => $ipv4Int,
                    'time' => time(),
                    'device' => 0,
                    'devname' => '',
                    'user' => 1
                );
                if ($ipv4Int > 0) {
                    $history = new \Ipm\Model_History($q);
                    $history->save();
                }
            }
            $ip->ipv4 = '';
            $ip->save();
        }
    }

    //add history
    public static function Device($model, $method) {

        if ($method == 'before_update') {
            //\Log::debug('device update'.$model->hostname);
            $old_data = \DB::select('rack', 'rack_pos')->from('device')->where('id', $model->id)->as_object()->execute();

            if (count($old_data) > 0) {
                $rack = $old_data[0]->rack;
                $pos = $old_data[0]->rack_pos;

                if ($rack != $model->rack or $pos != $model->rack_pos) {
                    \Log::debug('device update' . $model->hostname);
                    $network = $model->network;



                    foreach ($network as $net) {


                        $ips = \Basic\Model_Network_Ip::find()->where('networkID', $net->id)->get();



                        foreach ($ips as $ip) {

                            // \Log::debug('ip::'.print_r($ip,true));  
                            $sub = \Ipm\Model_Subnet::find()->where('range_from', '<=', $ip->addrint)->where('range_to', '>=', $ip->addrint)->get_one();

                            if ($sub)
                                \Ipm\Observer::IsValidLocation($sub, $model, $ip);
                        }
                    }
                }
            }
        }
    }

    //delete from locations
    public static function Rack($model, $method) {


        if ($method == 'before_delete') {
            $locations = Model_Location::find()->where('rack', $model->id)->get();
            foreach ($locations as $loc)
                $loc->delete();
        }
    }

    public static function Room($model, $method) {
        if ($method == 'before_delete') {
            $locations = Model_Location::find()->where('room', $model->id)->get();
            foreach ($locations as $loc)
                $loc->delete();
        }
    }

    public static function Floor($model, $method) {

        if ($method == 'before_delete') {

            $locations = Model_Location::find()->where('floor', $model->id)->get();
            foreach ($locations as $loc)
                $loc->delete();
        }
    }

    //add history
    public static function Network_Ip($model, $method) {


        $ipm_history = \DBUtil::checkIfExist('ipm_history');
        if ($ipm_history) {


            if ($method == 'before_delete') {
                $ipv4 = new Ipv4object($model->ipv4);
                $ipv4Int = $ipv4->toInt();
                if ($ipv4Int > 0) {
                    $q = array(
                        'ip_dotted' => $model->ipv4,
                        'ip_int' => $ipv4Int,
                        'time' => time(),
                        'device' => 0,
                        'devname' => '',
                        'user' => 1
                    );
                    $history = new \Ipm\Model_History($q);
                    $history->save();
                }
            }


            if ($method == 'before_save') {




                $oldipv4 = '';
                $old_data = \DB::select('ipv4')->from('network_ip_ports')->where('id', $model->id)->as_object()->execute();
                if (count($old_data) > 0)
                    $oldipv4 = $old_data[0]->ipv4;



                if (strlen($model->ipv4) > 0) {



                    $ipv4 = new Ipv4object($model->ipv4);
                    $ipv4Int = $ipv4->toInt();
                    $device = $model->network->device->id;
                    $hist = \Ipm\Model_History::find('last');
                    $up = true;

                    if ($hist) {
                        if ($hist['ip_int'] == $ipv4Int and $hist['device'] == $device) {
                            $up = false;
                        }
                    }
                    //update new location for ip
                    if ($up) {
                        $q = array(
                            'ip_dotted' => $model->ipv4,
                            'ip_int' => $ipv4Int,
                            'time' => time(),
                            'device' => $device,
                            'devname' => $model->network->device->hostname,
                            'user' => 1
                        );
                        $history = new \Ipm\Model_History($q);
                        $history->save();
                    }

                    if (strlen($oldipv4) > 0) {
                        //set old ip to undefined(device = 0)
                        if ($oldipv4 != $model->ipv4) {
                            $ipv42 = new Ipv4object($oldipv4);
                            $ipv4Int2 = $ipv42->toInt();

                            $q = array(
                                'ip_dotted' => $oldipv4,
                                'ip_int' => $ipv4Int2,
                                'time' => time(),
                                'device' => 0,
                                'devname' => '',
                                'user' => 1
                            );
                            $history2 = new \Ipm\Model_History($q);
                            $history2->save();
                        }
                    }
                }
            }
        }
    }

}

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
?>
