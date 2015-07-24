<?php
namespace Basic;
class Model_Device_Template_Network extends \Orm\Model{

	protected static $_table_name = 'device_temp_network';

	protected static $_properties = array(
			'id',
			'fieldID',
			'templateID',
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
		'model_to' => 'Basic\Model_Device_Template_Network_Ip',
		'key_to' => 'tempnetID',
		'cascade_save' => true,
		'cascade_delete' => true,
				),
	'mac' => array(
		'key_from' => 'id',
		'model_to' => 'Basic\Model_Device_Template_Network_Mac',
		'key_to' => 'tempnetID',
		'cascade_save' => true,
		'cascade_delete' => true,
	),
	'vlan' => array(
		'key_from' => 'id',
		'model_to' => 'Basic\Model_Device_Template_Network_Vlan',
		'key_to' => 'tempnetID',
		'cascade_save' => true,
		'cascade_delete' => true,
			)
		
		
		);
	
}	