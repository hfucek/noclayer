<?php

namespace Graphing;

class Model_Munin extends \Orm\Model {

    protected static $_table_name = 'munin';
    protected static $_properties = array(
        'id',
        'url',
        'deviceID',
        'user',
        'pass',
        'meta_update_user'
    );
    protected static $_belongs_to = array(
        'device' => array(
            'key_from' => 'deviceID',
            'model_to' => '\Basic\Model_Device',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        )
    );

}

?>	