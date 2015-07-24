<?php

namespace Basic;

class Model_Notes extends \Orm\Model {

    protected static $_table_name = 'notes';
    protected static $_properties = array(
        'id',
        'deviceID',
        'txt',
        'meta_update_user',
        'meta_update_time'
    );
    protected static $_belongs_to = array(
        'device' => array(
            'key_from' => 'deviceID',
            'model_to' => 'Basic\Model_Device',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
            ));

}