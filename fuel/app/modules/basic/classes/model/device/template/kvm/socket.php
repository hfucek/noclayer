<?php
namespace Basic;
class Model_Device_Template_Kvm_Socket extends \Orm\Model{
	
	protected static $_table_name = 'device_temp_kvm_socket';
	
	protected static $_properties = array(
			'id',
			'kvmID',
			'conn_type',
			'type'	
	);
	/*
	protected static $_belongs_to = array(
			    'kvm' => array(
			        'key_from' => 'kvmID',
			        'model_to' => 'Model_Device_Template_Kvm',
			        'key_to' => 'id',
			        'cascade_save' => true,
			        'cascade_delete' => true,
	)
	);
	*/
	
	
	
	
}

?>