<?php

namespace Debugger;

class Model_Test extends \Orm\Model {
    protected static $_connection = 'debugger';
    protected static $_table_name = 'debug_test';
    protected static $_properties = array(
        'id',
        'name',
        'description',
        'group_id',
        'priority',
        'meta_update_time',
        'meta_update_user'
    );
    
    protected static $_has_many = array(
        'record' => array(
            'key_from' => 'id',
            'model_to' => 'Debugger\Model_Record',
            'key_to' => 'id',
            'cascade_save' => true,
            'cascade_delete' => false,
        )
    );
    
    protected static $_belongs_to = array(
        'group' => array(
            'key_from' => 'group_id',
            'model_to' => 'Debugger\Model_Group',
            'key_to' => 'id',
            'cascade_save' => true,
            'cascade_delete' => false,
    ));

}