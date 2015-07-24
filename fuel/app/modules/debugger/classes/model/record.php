<?php

namespace Debugger;

class Model_Record extends \Orm\Model {
protected static $_connection = 'debugger';
    protected static $_table_name = 'debug_record';
    protected static $_properties = array(
        'id',
        'type',
        'action',
        'object',
        'test_id',
        'meta_update_time',
        'meta_update_user'
    );
    
    protected static $_belongs_to = array(
        'tests' => array(
            'key_from' => 'test_id',
            'model_to' => 'Debugger\Model_Test',
            'key_to' => 'id',
            'cascade_save' => true,
            'cascade_delete' => false,
    ));

}

?>