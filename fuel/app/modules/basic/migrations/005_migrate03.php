<?php

namespace Fuel\Migrations;

class Migrate03 {

    function down() {
        
    }

    function up() {
        $user = \DB::select('id')->from('users')->limit(1)->execute()->current();
        $settings = \DB::select('value')->from('settings')->where('name', 'rack_heights')->as_object()->execute();

        if (!isset($settings[0])) {
            // insert default building
            list($set_id, $rows_affected) = \DB::insert('settings')->columns(
                            array(
                                'id',
                                'name',
                                'value',
                                'meta_update_user'
                    ))->values(
                            array('', 'rack_heights', '8,12,16,18,24,27,30,42,48', $user['id'])
                    )->execute();
        }
    }

}