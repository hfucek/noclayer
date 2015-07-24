<?php

namespace Basic;

class Model_Device extends \Orm\Model {

    protected static $_table_name = 'device';
    protected static $_properties = array(
        'id',
        'hostname',
        'type',
        'cat',
        'rack',
        'rack_pos',
        'rack_units',
        'parent_device',
        'meta_default_data',
        'meta_update_time',
        'meta_update_user'
    );
    protected static $_has_many = array(
        'fields' => array(
            'key_from' => 'id',
            'model_to' => 'Basic\Model_Device_Fieldset',
            'key_to' => 'deviceID',
            'cascade_save' => true,
            'cascade_delete' => true,
        ),
        'vps' => array(
            'key_from' => 'id',
            'model_to' => 'Basic\Model_Vps',
            'key_to' => 'masterID',
            'cascade_save' => true,
            'cascade_delete' => true,
        ),
        'network' => array(
            'key_from' => 'id',
            'model_to' => 'Basic\Model_Device_Network',
            'key_to' => 'deviceID',
            'cascade_save' => true,
            'cascade_delete' => true,
        )
    );
    protected static $_has_one = array(
        'power' => array(
            'key_from' => 'id',
            'model_to' => 'Basic\Model_Device_Power',
            'key_to' => 'deviceID',
            'cascade_save' => true,
            'cascade_delete' => true,
        ),
        'kvm' => array(
            'key_from' => 'id',
            'model_to' => 'Basic\Model_Device_Kvm',
            'key_to' => 'deviceID',
            'cascade_save' => true,
            'cascade_delete' => true,
        )
    );
    protected static $_belongs_to = array(
        'template' => array(
            'key_from' => 'type',
            'model_to' => 'Basic\Model_Device_Template',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
        'racks' => array(
            'key_from' => 'rack',
            'model_to' => 'Basic\Model_Rack',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
        'category' => array(
            'key_from' => 'cat',
            'model_to' => 'Basic\Model_Device_Category',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
    );
    protected static $_observers = array(
        '\Modules' => array(
            'events' => array('before_update'), // will only call Orm\Observer_CreatedOn at before_insert event
        )
    );

    public function save($cascade = null, $use_transtation = false) {

        parent::save();
    }

}