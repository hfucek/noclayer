<?php

/*
 * version 1.08
 * */

namespace Fuel\Migrations;

use Fuel\Core\Arr;

class Installgraph {

    public function up() {


        /*         * *********************************************************************************************
          graphing
         * ********************************************************************************************* */
        $graphing = \DBUtil::checkIfExist('graphing');
        if (!$graphing) {
            \DBUtil::create_table('graphing', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'name' => array('constraint' => 250, 'type' => 'varchar'),
                'value' => array('constraint' => 250, 'type' => 'varchar'),
                'meta_update_user' => array('constraint' => 11, 'type' => 'int', 'default' => '0')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            \DBUtil::truncate_table('graphing');
            // insert default connector type
            list($insert_id, $rows_affected) = \DB::insert('graphing')->columns(array('id', 'name', 'value', 'meta_update_user'))->values(
                            array('1', 'cacti_size', '1', '1')
                    )->execute();
        }


        /*         * *********************************************************************************************
          graphing_type
         * ********************************************************************************************* */
        $graphing_type = \DBUtil::checkIfExist('graphing_type');
        if (!$graphing_type) {
            \DBUtil::create_table('graphing_type', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'name' => array('constraint' => 250, 'type' => 'varchar'),
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            \DBUtil::truncate_table('graphing_type');
            // insert default connector type
            list($insert_id, $rows_affected) = \DB::insert('graphing_type')->columns(array('id', 'name'))->values(
                            array('1', 'Cacti')
                    )->execute();
        }

        /*         * *********************************************************************************************
          graphing_source
         * ********************************************************************************************* */
        $graphing_source = \DBUtil::checkIfExist('graphing_source');
        if (!$graphing_source) {
            \DBUtil::create_table('graphing_source', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'typeID' => array('constraint' => 11, 'type' => 'int'),
                'user' => array('constraint' => 250, 'type' => 'varchar'),
                'pass' => array('constraint' => 250, 'type' => 'varchar'),
                'content' => array('type' => 'text', 'null' => true),
                'meta_update_time' => array('constraint' => 11, 'type' => 'int', 'default' => '0'),
                'meta_update_user' => array('constraint' => 11, 'type' => 'int', 'default' => '0')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for graphing
            \DBUtil::create_index('graphing_source', 'typeID');
        }



        /*         * *********************************************************************************************
          graphing_cacti
         * ********************************************************************************************* */
        $graphing_cacti = \DBUtil::checkIfExist('graphing_cacti');
        if (!$graphing_cacti) {
            \DBUtil::create_table('graphing_cacti', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'sourceID' => array('constraint' => 11, 'type' => 'int'),
                'name' => array('constraint' => 250, 'type' => 'varchar'),
                'num' => array('constraint' => 250, 'type' => 'varchar'),
                'macID' => array('constraint' => 11, 'type' => 'int'),
                'graphID' => array('constraint' => 11, 'type' => 'int'),
                'meta_update_time' => array('constraint' => 11, 'type' => 'int', 'default' => '0'),
                'meta_update_user' => array('constraint' => 11, 'type' => 'int', 'default' => '0'),
                'deviceID' => array('constraint' => 11, 'type' => 'int'),
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for graphing
            \DBUtil::create_index('graphing_cacti', 'deviceID');
            \DBUtil::create_index('graphing_cacti', 'sourceID');
            \DBUtil::create_index('graphing_cacti', 'macID');
        }









        /*         * *********************************************************************************************
          FOREIGN KEYS
         * ********************************************************************************************* */

        //graphing
        if (!$graphing_source) {
            $query = \DB::query('ALTER TABLE `graphing_source`
					ADD CONSTRAINT `graphing_ibfk_1` FOREIGN KEY (`typeID`) REFERENCES `graphing_type` (`id`)
					ON DELETE CASCADE ON UPDATE CASCADE')->execute();
        }

        //graphing_cacti
        if (!$graphing_cacti) {
            $query = \DB::query('ALTER TABLE `graphing_cacti`
					ADD CONSTRAINT `graphing_cacti_ibfk_1` FOREIGN KEY (`sourceID`) REFERENCES `graphing_source` (`id`)
					ON DELETE CASCADE ON UPDATE CASCADE')->execute();
            /*
              $query = \DB::query('ALTER TABLE `graphing_cacti`
              ADD CONSTRAINT `graphing_cacti_ibfk_2` FOREIGN KEY (`macID`) REFERENCES `network_mac_ports` (`id`)
              ON DELETE CASCADE ON UPDATE CASCADE')->execute();
             */

            $query = \DB::query('ALTER TABLE `graphing_cacti`
					ADD CONSTRAINT `graphing_cacti_ibfk_3` FOREIGN KEY (`deviceID`) REFERENCES `device` (`id`)
					ON DELETE CASCADE ON UPDATE CASCADE')->execute();
        }

        /*
         * UPDATE version
         *
         * */
        $now = time();
        list($insert_id, $rows_affected) = \DB::insert('version')->columns(array('value', 'meta_update_time'))->values(
                        array('1.09', $now))->execute();
    }

    public function down() {
        
    }

}