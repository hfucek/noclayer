<?php

namespace Basic;

class Model_Room extends \Orm\Model {

    protected static $_table_name = 'room';
    protected static $_properties = array(
        'id',
        'name',
        'floor',
        'has_racks',
        'meta_default_data',
        'meta_update_time',
        'meta_update_user'
    );
    protected static $_has_many = array(
        'rack' => array(
            'key_from' => 'id',
            'model_to' => 'Basic\Model_Rack',
            'key_to' => 'room',
            'cascade_save' => true,
            'cascade_delete' => false,
        )
    );
    protected static $_belongs_to = array(
        'floors' => array(
            'key_from' => 'floor',
            'model_to' => 'Basic\Model_Floor',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
            ));
    protected static $_observers = array(
        '\Modules' => array(
            'events' => array('before_delete'), // will only call Orm\Observer_CreatedOn at before_insert event
        )
    );

    /*
      protected static $_belongs_to  = array('floor' => array(
      'model_to' => 'Model_Floor',
      'key_from' => 'id',
      'key_to' => 'id',
      'cascade_save' => true,
      'cascade_delete' => false,
      // there are some more options for specific relation types
      ));
     */
}

?>
