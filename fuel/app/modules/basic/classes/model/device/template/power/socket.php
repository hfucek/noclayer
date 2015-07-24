<?php
namespace Basic;
class Model_Device_Template_Power_Socket extends \Orm\Model{
	
	protected static $_table_name = 'device_temp_power_socket';
	
	protected static $_properties = array(
			'id',
			'powerID',
			'conn_type',
			'type'	
	);
	
	protected static $_belongs_to = array(
			    'power' => array(
			        'key_from' => 'powerID',
			        'model_to' => 'Basic\Model_Device_Template_Power',
			        'key_to' => 'id',
			        'cascade_save' => false,
			        'cascade_delete' => false,
	)
	);
	
	
	
	
	
}

?>