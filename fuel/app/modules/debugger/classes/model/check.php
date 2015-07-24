<?php

namespace Debugger;

class Model_Check extends \Orm\Model {
protected static $_connection = 'debugger';
    protected static $_table_name = 'debug_checks';
    protected static $_properties = array(
        'id',
        'test_id',
        'time_taken',
        'cpu',
        'ram',
        'status',
        'meta_update_time',
        'meta_update_user'
    );

}

?>