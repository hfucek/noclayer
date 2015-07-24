<?php

namespace Basic;

class Model_Version extends \Orm\Model {

    protected static $_table_name = 'version';
    protected static $_properties = array(
        'id',
        'value',
        'meta_update_time'
    );

}