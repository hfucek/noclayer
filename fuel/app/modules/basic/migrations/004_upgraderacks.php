<?php

/*
 * version 1.0
 * */

namespace Fuel\Migrations;

use Fuel\Core\Arr;

class Upgraderacks {

    protected function __update_rack_position() {



        $rooms = \DB::select('id')->from('room')->execute()->as_array();



        foreach ($rooms as $room) {

            //echo $room['id'];
            //$rack_num = count($room->rack);
            // $rooms = \DB::select('id')->from('room')->execute()->as_array();

            $z = \DB::select('id')->from('rack')->where('room_pos', '0')->where('room', $room['id'])->execute()->as_array();
            $zero = count($z);

            $num = 1;
            if ($zero >= 1) {
                $racks = \DB::select('id')->from('rack')->where('room', $room['id'])->execute()->as_array();
                foreach ($racks as $rack) {


                    $result = \DB::update('rack')
                            ->value("room_pos", $num)
                            ->where('id', '=', $rack['id'])
                            ->execute();
                    $num++;
                }
            }
        }
    }

    public
            function up() {


        $user = \DB::select('id')->from('users')->limit(1)->execute()->current();

        /*         * ********************************************************************************************
          update rack position
         * ********************************************************************************************* */
        $israck = \DBUtil::checkIfExist('rack');
        if ($israck) {


            if (!\DBUtil::field_exists('rack', array('position'))) {
                // Fields don't exist

                \DBUtil::add_fields('rack', array(
                    'position' => array('constraint' => 11, 'type' => 'int'
                )));
            }
        }
        /*         * ********************************************************************************************
          add room height to settings
         * ********************************************************************************************* */

        $settings = \DB::select('value')->from('settings')->where('name', 'room_height')->as_object()->execute();

        if (!isset($settings[0])) {
            // insert default building
            list($set_id, $rows_affected) = \DB::insert('settings')->columns(
                            array(
                                'id',
                                'name',
                                'value',
                                'meta_update_user'
                    ))->values(
                            array('', 'room_height', '2500', $user['id'])
                    )->execute();
        }

        $settings = \DB::select('value')->from('settings')->where('name', 'tutorials')->as_object()->execute();

        if (!isset($settings[0])) {
            // insert default building
            list($set_id, $rows_affected) = \DB::insert('settings')->columns(
                            array(
                                'id',
                                'name',
                                'value',
                                'meta_update_user'
                    ))->values(
                            array('', 'tutorials', '0', $user['id'])
                    )->execute();
        }
        $settings = \DB::select('value')->from('settings')->where('name', 'background')->as_object()->execute();

        if (!isset($settings[0])) {
            // insert default building
            list($set_id, $rows_affected) = \DB::insert('settings')->columns(
                            array(
                                'id',
                                'name',
                                'value',
                                'meta_update_user'
                    ))->values(
                            array('', 'background', '2', $user['id'])
                    )->execute();
        }
        /*         * ********************************************************************************************
          fix zero position for racks into rooms
         * ********************************************************************************************* */

        $this->__update_rack_position();
    }

    public
            function down() {
        
    }

}