<?php

namespace Basic;

class Model_Raid extends \Orm\Model {

    protected static $_table_name = 'hardware_raid';
    protected static $_properties = array(
        'id',
        'fieldsetID',
        'raid_type',
        'size',
        'total',
        'meta_update_time',
        'meta_update_user',
        'tempfieldID'
    );
    protected static $_has_many = array(
        'rows' => array(
            'key_from' => 'id',
            'model_to' => 'Basic\Model_Raid_Data',
            'key_to' => 'hardware_raid',
            'cascade_save' => true,
            'cascade_delete' => true,
        )
    );

}

?>	