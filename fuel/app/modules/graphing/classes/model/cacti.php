<?php
namespace Graphing;
class Model_Cacti  extends  \Orm\Model {



	protected static $_table_name = 'graphing_cacti';

	protected static $_properties = array(
		'id',
		'sourceID',
		'name',
		'num',	
		'macID',
		'graphID',
		'meta_update_time',
		'meta_update_user',
		'deviceID'	
	);
	

	protected static $_belongs_to = array(
			'mac' => array(
					'key_from' => 'macID',
					'model_to' => '\Basic\Model_Network_Mac',
					'key_to' => 'id',
					'cascade_save' => false,
					'cascade_delete' => false,
			)
	);	
	


}

?>	