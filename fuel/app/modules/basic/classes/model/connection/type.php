<?php
namespace Basic;

class Model_Connection_Type  extends  \Orm\Model {
	
	protected static $_table_name = 'connector_type';
	
	protected static $_properties = array(
		'id',
		'name',
	);
	
	
}

?>