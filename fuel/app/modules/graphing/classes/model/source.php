<?php
namespace Graphing;
class Model_Source  extends  \Orm\Model {



	protected static $_table_name = 'graphing_source';

	protected static $_properties = array(
		'id',
		'typeID',
		'user',
		'pass',
		'content',
		'meta_update_time',
		'meta_update_user'
		
	);
	/*
	protected static $_has_one = array(
		'type' => array(
			'key_from' => 'typeID',
			'model_to' => 'Model_Monitoring_Type',
			'key_to' => 'id',
			'cascade_save' => false,
			'cascade_delete' => false,
		));
		
	*/	
}

?>	