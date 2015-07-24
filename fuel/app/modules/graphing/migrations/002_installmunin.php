<?php

/*
 * version 1.2.1
 * */

namespace Fuel\Migrations;

use Fuel\Core\Arr;

class Installmunin {

    public function up() {


        /*         * *********************************************************************************************
          munin
         * ********************************************************************************************* */
        $munin = \DBUtil::checkIfExist('munin');
        if (!$munin) {
            \DBUtil::create_table('munin', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'url' => array('constraint' => 250, 'type' => 'varchar'),
                'deviceID' => array('constraint' => 11, 'type' => 'int'),
                'user' => array('constraint' => 250, 'type' => 'varchar'),
                'pass' => array('constraint' => 250, 'type' => 'varchar'),
                'meta_update_user' => array('constraint' => 11, 'type' => 'int', 'default' => '0')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for graphing
            \DBUtil::create_index('munin', 'deviceID');
        }

        //graphing
        if (!$munin) {
            $query = \DB::query('ALTER TABLE `munin`
					ADD CONSTRAINT `munin_ibfk_1` FOREIGN KEY (`deviceID`) REFERENCES `device` (`id`)
					ON DELETE CASCADE ON UPDATE CASCADE')->execute();
        }
    }

    public function down() {
        
    }

}