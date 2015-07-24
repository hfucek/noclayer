<?php

namespace Ipm;

class Controller_Test extends Ipm {

    private function ___IPv4_dotquadA_to_intA($ip) {

        echo $ip->ipv4;

        $split = explode('.', $ip->ipv4, 4);


        $myInt = (
                (int) ( $split[0]) * 16777216 /* 2^24 */
                + (int) ( $split[1]) * 65536 /* 2^16 */
                + (int) ( $split[2]) * 256 /* 2^8  */
                + (int) ( $split[3])
                );
        return $myInt;
    }

    private function c_class_from_Ipv4($ip) {
        $m = explode('.', $ip->ipv4);

        $m[3] = '0';
        $sub = implode('.', $m);
        return $sub . '/24';
    }

    private function update_location($sub, $ip) {

        $rack = $ip->network->device->racks;
        $room = $rack->rooms;
        $floor = $room->floors;
        $building = $floor->buildings;


        $loc = Model_Location::find()->where('rack', $rack['id'])->where('node', $sub->id)->get_one();

        if (!$loc) {

            $in = array(
                'node' => $sub->id,
                'type' => 0,
                'building' => $building['id'],
                'floor' => $floor['id'],
                'room' => $room['id'],
                'rack' => $rack['id'],
                'pos_from' => 1,
                'pos_to' => $rack['size']
            );

            $location = new Model_Location($in);

            $location->save();
        }
    }

    private function defualtNode() {

        $m = Model_Node::find()->where('name', 'Detected')->get_one();

        if ($m)
            return $m->id;

        $q = Array(
            'name' => 'Detected',
            'parent' => 0,
            'meta_update_user' => 1
        );
        $n = new Model_Node($q);
        $n->save();

        return $n->id;
    }

    private function updateSubnet($ip) {

        $ip_int = $this->___IPv4_dotquadA_to_intA($ip);

        $sub = Model_Subnet::find()->where('range_from', '<=', $ip_int)->where('range_to', '>=', $ip_int)->get_one();



        if ($sub) {

            return $sub;
        } else {
            $newsub = $this->c_class_from_Ipv4($ip);
            $ip_ob = new Ipv4($newsub);
            $ipdata = $ip_ob->get();

            $data = Array(
                'subnet' => $ipdata['subnet'],
                'alias' => '',
                'description' => '',
                'size' => $ipdata['hosts'],
                'mask' => $ipdata['mask'],
                'type' => 0,
                'vlan' => 0,
                'parent' => $this->defualtNode(),
                'meta_update_user' => 1,
                'range_from' => $ipdata['from'],
                'range_to' => $ipdata['to']
            );

            $sub = new Model_Subnet($data);
            $sub->save();
            return $sub;
            /*
              'subnet'=>$this->_subnet,
              'mask'=>$this->_maskbit,
              'from'=>$this->_intAddrFrom,
              'to'=>$this->_intAddrTo,
              'hosts'=>$this->_numberOfHosts,
              'network'=>$this->_network
             */
        }
    }

    private function updateIpv4() {

        //select * ip from database
        $ips = \Basic\Model_Network_Ip::find('all');

        foreach ($ips as $ip) {


            if ($ip->ipv4 != '') {

                $subnet = $this->updateSubnet($ip);

                $this->update_location($subnet, $ip);
            }
        }

        //check if subnet exist
    //
        
        
    }

    private function update_history($ip) {

        $ipv4 = new \Ipm\Ipv4object($ip->ipv4);
        $ipv4Int = $ipv4->toInt();
        $device = $ip->network->device;
        if (strlen($ip->ipv4) > 0) {
            $q = array(
                'ip_dotted' => $ip->ipv4,
                'ip_int' => $ipv4Int,
                'time' => time(),
                'device' => $device->id,
                'devname' => $device->hostname,
                'user' => 1
            );
            $history = new \Ipm\Model_History($q);
            $history->save();
        }
    }

    private function parse_vps_address() {


        \Fuel\Core\Module::load('basic', APPPATH . 'modules/basic/');
        \Fuel\Core\Module::load('ipm', APPPATH . 'modules/ipm/');
        //select * ip from database
        $ips = \Basic\Model_Vps_Ip::find('all');

        foreach ($ips as $ip) {


            $vps = \Basic\Model_Vps::find($ip->vpsID);

            $networks = $vps->device->network;

            foreach ($networks as $net) {
                
            }



            //print_r($net);
            $ipob = (object) array('ipv4' => $ip->data);




            if ($ip->data != '') {

                $ip_int = $this->___IPv4_dotquadA_to_intA($ipob);

                $ipvps = \Basic\Model_Network_Ip::find()->where('type', 3)->where('networkID', $net->id)->where('addrint', $ip_int)->get_one();

                if (!$ipvps) {
                    echo 'ok';
                    //make new ip input with type 3

                    $prop = Array(
                        'networkID' => $net->id,
                        'nic_name' => 'vps',
                        'ipv4' => $ip->data,
                        'ipv6' => '',
                        'conn_type' => 0,
                        'conn_speed' => 0,
                        'type' => 3, //vps ip
                        'addrint' => $ip_int
                    );

                    $ipv4 = new \Basic\Model_Network_Ip($prop);
                    $ipv4->save();




                    $subnet = $this->updateSubnet($ipv4);
                    $this->update_location($subnet, $ipv4);
                    $this->update_history($ipv4);
                }
            }
        }

        //check if subnet exist
//
    }

    public function action_index() {
        $this->parse_vps_address();

        //$this->updateIpv4();
    }

}

