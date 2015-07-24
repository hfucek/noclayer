<?php

namespace Basic;

class Model_Rack extends \Orm\Model {

    protected static $_table_name = 'rack';
    protected static $_properties = array(
        'room_pos',
        'id',
        'name',
        'room',
        'hidden_rack',
        'size',
        'position',
        'notes',
        'meta_default_data',
        'meta_update_time',
        'meta_update_user'
    );
    protected static $_has_many = array(
        'device' => array(
            'key_from' => 'id',
            'model_to' => 'Basic\Model_Device',
            'key_to' => 'rack',
            'cascade_save' => true,
            'cascade_delete' => false,
        )
    );
    protected static $_belongs_to = array(
        'rooms' => array(
            'key_from' => 'room',
            'model_to' => 'Basic\Model_Room',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
            ));
    protected static $_observers = array(
        '\Modules' => array(
            'events' => array('before_delete'), // will only call Orm\Observer_CreatedOn at before_insert event
        )
    );

}