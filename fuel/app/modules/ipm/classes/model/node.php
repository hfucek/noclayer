<?php

namespace Ipm;

class Model_Node extends \Orm\Model {

    protected static $_table_name = 'ipm_node';
    protected static $_properties = array(
        'id',
        'name',
        'parent',
        'meta_update_user'
    );
    protected static $_has_many = array(
        'subnets' => array(
            'key_from' => 'id',
            'model_to' => '\Ipm\Model_Subnet',
            'key_to' => 'parent',
            'cascade_save' => true,
            'cascade_delete' => true,
            ));

    /*
      protected static $_has_one = array(

      'parent_node' => array(
      'key_from' => 'parent',
      'model_to' => '\Ipm\Model_Node',
      'key_to' => 'id',
      'cascade_save' => false,
      'cascade_delete' => false,
      ));
     */
}

?>	