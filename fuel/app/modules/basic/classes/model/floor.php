<?php

namespace Basic;

class Model_Floor extends \Orm\Model {

    protected static $_table_name = 'floor';
    protected static $_properties = array(
        'id',
        'name',
        'building',
        'has_rooms',
        'meta_default_data',
        'meta_update_time',
        'meta_update_user'
    );
    protected static $_has_many = array(
        'room' => array(
            'key_from' => 'id',
            'model_to' => 'Basic\Model_Room',
            'key_to' => 'floor',
            'cascade_save' => true,
            'cascade_delete' => false,
        )
    );
    protected static $_belongs_to = array(
        'buildings' => array(
            'key_from' => 'building',
            'model_to' => 'Basic\Model_Building',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
            ));

    /*
      protected static $_belongs_to  = array('building' => array(
      'model_to' => 'Model_Building',
      'key_from' => 'building',
      'key_to' => 'id',
      'cascade_save' => true,
      'cascade_delete' => false,
      // there are some more options for specific relation types
      ));
     */
    protected static $_observers = array(
        '\Modules' => array(
            'events' => array('before_delete'), // will only call Orm\Observer_CreatedOn at before_insert event
        )
    );

}

?>