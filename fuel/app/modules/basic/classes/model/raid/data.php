<?php
namespace Basic;
class Model_Raid_Data  extends  \Orm\Model {



	protected static $_table_name = 'hardware_raid_data';

	protected static $_properties = array(
		'id',
		'hardware_raid',
		'model',
		'size',
		'vport',
		'meta_update_time',
		'meta_update_user',
		'serial_number'
		
	);
	
}

?>	