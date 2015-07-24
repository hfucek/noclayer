<?php
namespace Basic;
class Model_Network_Mac extends \Orm\Model{
	
	protected static $_table_name = 'network_mac_ports';
	
	protected static $_properties = array(
			'id', 
			'networkID',
			'mac_address',
			'conn_device',
			'vlan',
			'type'
		
	);
	
	protected static $_has_one = array(
           
			'vlans' => array(
			        'key_from' => 'vlan',
			        'model_to' => 'Basic\Model_Network_Vlan',
			        'key_to' => 'id',
			        'cascade_save' => false,
			        'cascade_delete' => false,
			),	
			
	);
	
	protected static $_belongs_to = array(
		    'net' => array(
		        'key_from' => 'networkID',
		        'model_to' => 'Basic\Model_Device_Network',
		        'key_to' => 'id',
		        'cascade_save' => false,
		        'cascade_delete' => false,
	)
	);
	
}

?>