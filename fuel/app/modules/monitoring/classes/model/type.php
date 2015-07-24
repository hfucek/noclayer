<?php

namespace Monitoring;

class Model_Type extends \Orm\Model {

    protected static $_table_name = 'monitor_type';
    protected static $_properties = array(
        'id',
        'name'
    );

}

?>	