<?php

namespace Basic;

class Model_Network_Ip extends \Orm\Model {

    protected static $_table_name = 'network_ip_ports';
    protected static $_properties = array(
        'id',
        'networkID',
        'nic_name',
        'ipv4',
        'ipv6',
        'conn_type',
        'conn_speed',
        'type',
        'addrint'
    );
    protected static $_belongs_to = array(
        'network' => array(
            'key_from' => 'networkID',
            'model_to' => 'Basic\Model_Device_Network',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        )
    );
    protected static $_has_one = array(
        'ctype' => array(
            'key_from' => 'conn_type',
            'model_to' => 'Basic\Model_Connection_Type',
            'key_to' => 'id',
            'cascade_save' => true,
            'cascade_delete' => true,
        ),
        'cspeed' => array(
            'key_from' => 'conn_speed',
            'model_to' => 'Basic\Model_Connection_Speed',
            'key_to' => 'id',
            'cascade_save' => true,
            'cascade_delete' => true,
        )
    );
    protected static $_observers = array(
        '\Basic\Observer_Ip' => array(
            'events' => array('before_insert', 'before_save'), // will only call Orm\Observer_CreatedOn at before_insert event
        ),
        '\Modules' => array(
            'events' => array('before_save', 'before_delete'), // will only call Orm\Observer_CreatedOn at before_insert event
        )
    );

}

?>