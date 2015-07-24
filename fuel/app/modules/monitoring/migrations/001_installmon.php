<?php

/*
 * version 1.08
 * */

namespace Fuel\Migrations;

use Fuel\Core\Arr;

class Installmon {

    public function up() {


        /*         * *********************************************************************************************
          monitor_type
         * ********************************************************************************************* */
        $monitor_type = \DBUtil::checkIfExist('monitor_type');
        if (!$monitor_type) {
            \DBUtil::create_table('monitor_type', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'name' => array('constraint' => 250, 'type' => 'varchar'),
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            \DBUtil::truncate_table('monitor_type');
            // insert default connector type
            list($insert_id, $rows_affected) = \DB::insert('monitor_type')->columns(array('id', 'name'))->values(
                            array('1', 'Nagios')
                    )->execute();
        }

        /*         * *********************************************************************************************
          monitor_source
         * ********************************************************************************************* */
        $monitor_source = \DBUtil::checkIfExist('monitor_source');
        if (!$monitor_source) {
            \DBUtil::create_table('monitor_source', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'typeID' => array('constraint' => 11, 'type' => 'int'),
                'user' => array('constraint' => 250, 'type' => 'varchar'),
                'pass' => array('constraint' => 250, 'type' => 'varchar'),
                'content' => array('type' => 'text', 'null' => true),
                'meta_update_time' => array('constraint' => 11, 'type' => 'int', 'default' => '0'),
                'meta_update_user' => array('constraint' => 11, 'type' => 'int', 'default' => '0')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for wiki
            \DBUtil::create_index('monitor_source', 'typeID');
        }

        /*         * *********************************************************************************************
          monitoring
         * ********************************************************************************************* */
        $monitoring = \DBUtil::checkIfExist('monitoring');
        if (!$monitoring) {
            \DBUtil::create_table('monitoring', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'iconw' => array('constraint' => 11, 'type' => 'int'),
                'iconu' => array('constraint' => 11, 'type' => 'int'),
                'iconc' => array('constraint' => 11, 'type' => 'int'),
                'osdw' => array('constraint' => 11, 'type' => 'int'),
                'osdu' => array('constraint' => 11, 'type' => 'int'),
                'osdc' => array('constraint' => 11, 'type' => 'int'),
                'soundc' => array('constraint' => 11, 'type' => 'int'),
                'soundw' => array('constraint' => 11, 'type' => 'int'),
                'soundu' => array('constraint' => 11, 'type' => 'int'),
                'meta_update_user' => array('constraint' => 11, 'type' => 'int', 'default' => '0')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for wiki
            //\DBUtil::create_index('vps', 'masterID');

            \DBUtil::truncate_table('monitoring');
            // insert default connector type
            list($insert_id, $rows_affected) = \DB::insert('monitoring')->columns(array('id', 'iconw', 'iconu', 'iconc', 'osdw', 'osdu', 'osdc', 'soundc', 'soundw', 'soundu', 'meta_update_user'))->values(
                            array('1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1')
                    )->execute();
        }




        /*         * *********************************************************************************************
          FOREIGN KEYS
         * ********************************************************************************************* */

        //monitor
        if (!$monitor_source) {
            $query = \DB::query('ALTER TABLE `monitor_source`
				ADD CONSTRAINT `monitor_ibfk_1` FOREIGN KEY (`typeID`) REFERENCES `monitor_type` (`id`) 
				ON DELETE CASCADE ON UPDATE CASCADE')->execute();
        }



        /*
         * UPDATE version 
         * 
         * */
        $now = time();
        list($insert_id, $rows_affected) = \DB::insert('version')->columns(array('value', 'meta_update_time'))->values(
                        array('1.08', $now))->execute();
    }

    public function down() {
        
    }

}