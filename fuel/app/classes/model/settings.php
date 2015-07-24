<?php
class Model_Settings  extends  Orm\Model {
	
	protected static $_table_name = 'settings';
	
	protected static $_properties = array(
		'id',
		'name',
		'value',
		'meta_update_user'
	);
	
	
}