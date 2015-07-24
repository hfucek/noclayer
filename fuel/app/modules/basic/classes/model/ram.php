<?php

namespace Basic;

class Model_Ram extends \Orm\Model {

    protected static $_table_name = 'hardware_ram';
    protected static $_properties = array(
        'id',
        'fieldsetID',
        'ram_type',
        'size',
        'total',
        'meta_update_time',
        'meta_update_user',
        'tempfieldID'
    );
    protected static $_has_many = array(
        'rows' => array(
            'key_from' => 'id',
            'model_to' => 'Basic\Model_Ram_Data',
            'key_to' => 'hardware_ram',
            'cascade_save' => true,
            'cascade_delete' => true,
        )
    );

}

?>	