<?php

namespace Ipm;

class Model_Location extends \Orm\Model {

    protected static $_table_name = 'ipm_location';
    protected static $_properties = array(
        'id',
        'node',
        'type',
        'building',
        'floor',
        'room',
        'rack',
        'pos_from',
        'pos_to'
    );
    protected static $_belongs_to = array(
        'subnet' => array(
            'key_from' => 'node',
            'model_to' => '\Ipm\Model_Subnet',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
            ));
    protected static $_observers = array(
        '\Ipm\Observer_Location' => array(
            'events' => array('before_delete'),
        )
    );

}

?>	