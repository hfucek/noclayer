<?php

namespace Basic;

class Model_Building extends \Orm\Model {

    protected static $_table_name = 'building';
    protected static $_properties = array(
        'id',
        'name',
        'name_short',
        'notes',
        'meta_default_data',
        'meta_update_time',
        'meta_update_user'
    );
    protected static $_has_many = array(
        'floor' => array(
            'key_from' => 'id',
            'model_to' => 'Basic\Model_Floor',
            'key_to' => 'building',
            'cascade_save' => true,
            'cascade_delete' => false,
        )
    );

}

?>