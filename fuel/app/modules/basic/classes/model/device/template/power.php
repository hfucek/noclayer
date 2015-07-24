<?php
namespace Basic;
class Model_Device_Template_Power extends \Orm\Model{
	
	protected static $_table_name = 'device_temp_power';
	
	protected static $_properties = array(
			'id',
			'templateID',
			'fieldsetID',
			'current',
			'input',
			'output',
			'ru',
			'pos',
			'type'
	);
	
	protected static $_has_many = array(
			    'socket' => array(
			        'key_from' => 'id',
			        'model_to' => 'Basic\Model_Device_Template_Power_Socket',
			        'key_to' => 'powerID',
			        'cascade_save' => true,
			        'cascade_delete' => true,
	));
	
	/*
	protected static $_has_many = array(
		    'ip' => array(
		        'key_from' => 'id',
		        'model_to' => 'Model_Network_Ip',
		        'key_to' => 'networkID',
		        'cascade_save' => true,
		        'cascade_delete' => false,
			),
			'mac' => array(
			        'key_from' => 'id',
			        'model_to' => 'Model_Network_Mac',
			        'key_to' => 'networkID',
			        'cascade_save' => true,
			        'cascade_delete' => false,
			),
			'vlan' => array(
				        'key_from' => 'id',
				        'model_to' => 'Model_Network_Vlan',
				        'key_to' => 'networkID',
				        'cascade_save' => true,
				        'cascade_delete' => false,
		)
	
	
	);
	*/
	protected static $_belongs_to = array(
			    'template' => array(
			        'key_from' => 'templateID',
			        'model_to' => 'Basic\Model_Device_Template',
			        'key_to' => 'id',
			        'cascade_save' => false,
			        'cascade_delete' => false,
	)
	);
	
}