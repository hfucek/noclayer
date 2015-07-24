<?php

/*
 * version 1.0
 * */

namespace Fuel\Migrations;

use Fuel\Core\Arr;

class Installipm {

    private function ___IPv4_dotquadA_to_intA($ip) {



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


        $loc = \Ipm\Model_Location::find()->where('rack', $rack['id'])->where('node', $sub->id)->get_one();

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

            $location = new \Ipm\Model_Location($in);

            $location->save();
        }
    }

    private function defualtNode() {

        $m = \Ipm\Model_Node::find()->where('name', 'Detected')->get_one();

        if ($m)
            return $m->id;

        $q = Array(
            'name' => 'Detected',
            'parent' => 0,
            'meta_update_user' => 1
        );
        $n = new \Ipm\Model_Node($q);
        $n->save();

        return $n->id;
    }

    private function updateSubnet($ip) {

        $ip_int = $this->___IPv4_dotquadA_to_intA($ip);

        $sub = \Ipm\Model_Subnet::find()->where('range_from', '<=', $ip_int)->where('range_to', '>=', $ip_int)->get_one();



        if ($sub) {

            return $sub;
        } else {
            $newsub = $this->c_class_from_Ipv4($ip);
            $ip_ob = new \Ipm\Ipv4($newsub);
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

            $sub = new \Ipm\Model_Subnet($data);
            $sub->save();
            return $sub;
        }
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

    private function updateIpv4() {


        \Fuel\Core\Module::load('basic', APPPATH . 'modules/basic/');
        \Fuel\Core\Module::load('ipm', APPPATH . 'modules/ipm/');
        //select * ip from database
        $ips = \Basic\Model_Network_Ip::find('all');

        foreach ($ips as $ip) {


            if ($ip->ipv4 != '') {

                $subnet = $this->updateSubnet($ip);

                $this->update_location($subnet, $ip);

                $this->update_history($ip);
            }
        }

        //check if subnet exist
    //
        
        
    }

    public function up() {


        /*         * *********************************************************************************************
          ipm_subnet
         * ********************************************************************************************* */

        $ipm_subnet = \DBUtil::checkIfExist('ipm_subnet');
        if (!$ipm_subnet) {
            \DBUtil::create_table('ipm_subnet', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'subnet' => array('constraint' => 250, 'type' => 'varchar'),
                'alias' => array('constraint' => 250, 'type' => 'varchar'),
                'size' => array('constraint' => 11, 'type' => 'int'),
                'mask' => array('constraint' => 50, 'type' => 'varchar'),
                'description' => array('type' => 'text', 'null' => true),
                'vlan' => array('constraint' => 11, 'type' => 'int', 'null' => true),
                'type' => array('constraint' => 11, 'type' => 'int', 'null' => true),
                'parent' => array('constraint' => 11, 'type' => 'int'),
                'meta_update_user' => array('constraint' => 11, 'type' => 'int'),
                'range_from' => array('type' => 'double'),
                'range_to' => array('type' => 'double')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );
        }

        /*         * *********************************************************************************************
          ipm_node
         * ********************************************************************************************* */

        $ipm_node = \DBUtil::checkIfExist('ipm_node');
        if (!$ipm_node) {
            \DBUtil::create_table('ipm_node', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'name' => array('constraint' => 250, 'type' => 'varchar'),
                'parent' => array('constraint' => 11, 'type' => 'int'),
                'meta_update_user' => array('constraint' => 11, 'type' => 'int')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );
        }

        /*         * *********************************************************************************************
          ipm_location
         * ********************************************************************************************* */

        $ipm_location = \DBUtil::checkIfExist('ipm_location');
        if (!$ipm_location) {
            \DBUtil::create_table('ipm_location', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'node' => array('constraint' => 11, 'type' => 'int'),
                'type' => array('constraint' => 11, 'type' => 'int'),
                'building' => array('constraint' => 11, 'type' => 'int'),
                'floor' => array('constraint' => 11, 'type' => 'int'),
                'room' => array('constraint' => 11, 'type' => 'int'),
                'rack' => array('constraint' => 11, 'type' => 'int'),
                'pos_from' => array('constraint' => 11, 'type' => 'int'),
                'pos_to' => array('constraint' => 11, 'type' => 'int')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for location
            \DBUtil::create_index('ipm_location', 'node');
            \DBUtil::create_index('ipm_location', 'building');
            \DBUtil::create_index('ipm_location', 'floor');
            \DBUtil::create_index('ipm_location', 'room');
            \DBUtil::create_index('ipm_location', 'rack');
        }

        /*         * *********************************************************************************************
          ipm_history
         * ********************************************************************************************* */

        $ipm_history = \DBUtil::checkIfExist('ipm_history');
        if (!$ipm_history) {
            \DBUtil::create_table('ipm_history', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'ip_dotted' => array('constraint' => 16, 'type' => 'varchar'),
                'ip_int' => array('type' => 'double'),
                'time' => array('constraint' => 11, 'type' => 'int'),
                'device' => array('constraint' => 11, 'type' => 'int'),
                'devname' => array('constraint' => 220, 'type' => 'varchar', 'null' => true),
                'user' => array('constraint' => 11, 'type' => 'int')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for location
            \DBUtil::create_index('ipm_history', 'device');
            \DBUtil::create_index('ipm_history', 'ip_int');
        }


        //make subnets
        $this->updateIpv4();


        /*         * *********************************************************************************************
          monitor_source
         * *********************************************************************************************
          $monitor_source=\DBUtil::checkIfExist('monitor_source');
          if(!$monitor_source){
          \DBUtil::create_table('monitor_source',array(
          'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
          'typeID' => array('constraint' => 11, 'type' => 'int'),
          'user' => array('constraint' => 250, 'type' => 'varchar'),
          'pass' => array('constraint' => 250, 'type' => 'varchar'),
          'content' => array('type' => 'text','null'=>true),
          'meta_update_time' => array('constraint' => 11, 'type' => 'int','default'=>'0'),
          'meta_update_user' => array('constraint' => 11, 'type' => 'int','default'=>'0')
          ),
          array('id'), true, 'InnoDB', 'utf8_unicode_ci'
          );

          //create indexes for wiki
          \DBUtil::create_index('monitor_source', 'typeID');
          }

         */
    }

    public function down() {
        
    }

}