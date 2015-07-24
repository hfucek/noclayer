<?php

namespace Monitoring;

class Model_Data extends \Orm\Model {

    protected static $_table_name = 'monitoring';
    protected static $_properties = array(
        'id',
        'iconw',
        'iconu',
        'iconc',
        'osdw',
        'osdu',
        'osdc',
        'soundc',
        'soundw',
        'soundu',
        'meta_update_user'
    );

}

?>	