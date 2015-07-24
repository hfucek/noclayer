<?php
namespace Basic;
class Model_Device_Template_Network_Ip extends \Orm\Model{
	
	protected static $_table_name = 'temp_network_ip_ports';
	
	protected static $_properties = array(
			'id',
			'tempnetID',
			'nic_name',
			'ipv4',
			'ipv6',
			'conn_type',
			'conn_speed',
			'type'	
	);
	
	protected static $_belongs_to = array(
			    'network' => array(
			        'key_from' => 'tempnetID',
			        'model_to' => 'Basic\Model_Device_Template_Network',
			        'key_to' => 'id',
			        'cascade_save' => false,
			        'cascade_delete' => false,
	)
	);
	
	protected static $_has_one = array(
		'ctype' => array(
							'key_from' => 'conn_type',
							'model_to' => 'Basic\Model_Connection_Type',
							'key_to' => 'id',
							'cascade_save' => true,
							'cascade_delete' => true,
		),
		'cspeed' => array(
								'key_from' => 'conn_speed',
								'model_to' => 'Basic\Model_Connection_Speed',
								'key_to' => 'id',
								'cascade_save' => true,
								'cascade_delete' => true,
		)
	
	);
	
	
	
}

?>