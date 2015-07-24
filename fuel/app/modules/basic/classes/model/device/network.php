<?php
namespace Basic;
class Model_Device_Network extends \Orm\Model{
	
	protected static $_table_name = 'device_network';
	
	protected static $_properties = array(
			'id',
			'fieldsetID',
			'deviceID',
			'nics',
			'vports',
			'ports',
			'uplinks',
			'config_data',
			'type'	
	);
        
	protected static $_has_many = array(
		    'ip' => array(
		        'key_from' => 'id',
		        'model_to' => 'Basic\Model_Network_Ip',
		        'key_to' => 'networkID',
		        'cascade_save' => true,
		        'cascade_delete' => true,
			),
			'mac' => array(
			        'key_from' => 'id',
			        'model_to' => 'Basic\Model_Network_Mac',
			        'key_to' => 'networkID',
			        'cascade_save' => true,
			        'cascade_delete' => true,
			),
			'vlan' => array(
				        'key_from' => 'id',
				        'model_to' => 'Basic\Model_Network_Vlan',
				        'key_to' => 'networkID',
				        'cascade_save' => true,
				        'cascade_delete' => true,
		)
	
	
	);
	protected static $_belongs_to = array(
			    'device' => array(
			        'key_from' => 'deviceID',
			        'model_to' => 'Basic\Model_Device',
			        'key_to' => 'id',
			        'cascade_save' => false,
			        'cascade_delete' => false,
	)
	);
	
}