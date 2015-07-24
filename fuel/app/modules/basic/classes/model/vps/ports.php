<?php

namespace Basic;

class Model_Vps_Ports extends \Orm\Model {

    protected static $_table_name = 'vps_ports';
    protected static $_properties = array(
        'id',
        'vpsID',
        'portID',
        'type'
    );
    protected static $_has_one = array(
        'ip' => array(
            'key_from' => 'portID',
            'model_to' => '\Basic\Model_Network_Ip',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        )
    );
     protected static $_belongs_to = array(
        'vps' => array(
            'key_from' => 'vpsID',
            'model_to' => 'Basic\Model_Vps',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
            ));
    

}

