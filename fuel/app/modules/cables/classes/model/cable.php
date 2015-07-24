<?php
namespace Cables;
class Model_Cable  extends  \Orm\Model {

	protected static $_table_name = 'cables';
	
	protected static $_properties = array(
		'id',
		'dev1',
		'port1',
		'dev2',
		'port2',
		'name1',
		'name2',
		'type',
		'meta_update_time',
		'meta_update_user'
		
	);
	
	/*
	protected static $_has_many = array(
	    'floor' => array(
	        'key_from' => 'id',
	        'model_to' => 'Model_Floor',
	        'key_to' => 'building',
	        'cascade_save' => true,
	        'cascade_delete' => false,
	)
	);
	*/
}

?>