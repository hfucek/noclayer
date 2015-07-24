<?php
namespace Basic;
class Model_Device_Category extends \Orm\Model{
	
	protected static $_table_name = 'device_category';
	
	protected static $_properties = array(
			'id',
			'name'
			
	);
	
	protected static $_has_many = array(
		    'template' => array(
		        'key_from' => 'id',
		        'model_to' => 'Basic\Model_Device_Template',
		        'key_to' => 'categoryID',
		        'cascade_save' => true,
		        'cascade_delete' => false,
	)
	);
	
	
}