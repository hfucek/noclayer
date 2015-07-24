<?php

namespace Basic;

class Model_Vps extends \Orm\Model {

    protected static $_table_name = 'vps';
    protected static $_properties = array(
        'id',
        'masterID',
        'hostname',
        'cpu',
        'ram',
        'storage'
    );
    protected static $_belongs_to = array(
        'device' => array(
            'key_from' => 'masterID',
            'model_to' => 'Basic\Model_Device',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
            ));
    protected static $_has_many = array(
        'ips' => array(
            'key_from' => 'id',
            'model_to' => 'Basic\Model_Vps_Ports',
            'key_to' => 'vpsID',
            'cascade_save' => true,
            'cascade_delete' => true,
        )
    );

}