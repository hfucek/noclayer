<?php

namespace Ipm;

class Model_Vps_Ports extends \Orm\Model {

    protected static $_table_name = 'vps_ports';
    protected static $_properties = array(
        'id',
        'vpsID',
        'portID',
        'type'
    );

}

