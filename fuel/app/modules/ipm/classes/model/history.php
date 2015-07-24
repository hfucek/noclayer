<?php

namespace Ipm;

class Model_History extends \Orm\Model {

    protected static $_table_name = 'ipm_history';
    protected static $_properties = array(
        'id',
        'ip_dotted',
        'ip_int',
        'time',
        'device',
        'devname',
        'user'
    );
    protected static $_belongs_to = array(
        'dev' => array(
            'key_from' => 'device',
            'model_to' => '\Basic\Model_Device',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        )
    );

}

?>	