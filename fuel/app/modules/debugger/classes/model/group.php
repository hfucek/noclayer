<?php

namespace Debugger;

class Model_Group extends \Orm\Model {
protected static $_connection = 'debugger';
    protected static $_table_name = 'debug_group';
    protected static $_properties = array(
        'id',
        'name',
        'description',
        'meta_update_time',
        'meta_update_user'
    );
    
    protected static $_has_many = array(
        'test' => array(
            'key_from' => 'id',
            'model_to' => 'Debugger\Model_Test',
            'key_to' => 'group_id',
            'cascade_save' => true,
            'cascade_delete' => false,
        )
    );
}

?>