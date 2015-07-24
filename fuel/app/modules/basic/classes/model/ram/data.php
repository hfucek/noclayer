<?php
namespace Basic;
class Model_Ram_Data  extends  \Orm\Model {



	protected static $_table_name = 'hardware_ram_data';

	protected static $_properties = array(
		'id',
		'hardware_ram',
		'model',
		'size',
		'port',
		'meta_update_time',
		'meta_update_user',
		'serial_number'
		
	);
	
}

?>	