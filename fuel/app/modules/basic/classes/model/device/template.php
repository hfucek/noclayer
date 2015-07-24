<?php
namespace Basic;
class Model_Device_Template  extends  \Orm\Model {
	
	protected static $_table_name = 'device_template';
	
	protected static $_properties = array(
			'id',
			'name',
			'categoryID',
			'hidden',
			'meta_update_user',
			'rack_unit'		
	);
	
	protected static $_has_many = array(
		    'field' => array(
		        'key_from' => 'id',
		        'model_to' => 'Basic\Model_Device_Template_Field',
		        'key_to' => 'templateID',
		        'cascade_save' => true,
		        'cascade_delete' => true,
	)
	);

	protected static $_belongs_to = array(
		    'category' => array(
		        'key_from' => 'categoryID',
		        'model_to' => 'Basic\Model_Device_Category',
		        'key_to' => 'id',
		        'cascade_save' => false,
		        'cascade_delete' => false,
	)
	);
	
	
	
}