<?php

namespace Ipm;

class Model_Subnet extends \Orm\Model {

    protected static $_table_name = 'ipm_subnet';
    protected static $_properties = array(
        'id',
        'subnet',
        'alias',
        'size',
        'mask',
        'description',
        'vlan',
        'type',
        'parent',
        'meta_update_user',
        'range_from',
        'range_to'
    );
    protected static $_has_many = array(
        'locations' => array(
            'key_from' => 'id',
            'model_to' => '\Ipm\Model_Location',
            'key_to' => 'node',
            'cascade_save' => true,
            'cascade_delete' => true, // location data will observer delete
            ));
    protected static $_observers = array(
        '\Ipm\Observer_Subnet' => array(
            'events' => array('before_delete'),
        )
    );

}

?>	