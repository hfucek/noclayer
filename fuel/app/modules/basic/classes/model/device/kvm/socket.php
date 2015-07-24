<?php
namespace Basic;
class Model_Device_Kvm_Socket extends \Orm\Model{
	
	protected static $_table_name = 'device_kvm_socket';
	
	protected static $_properties = array(
			'id',
			'kvmID',
			'conn_type',
			'type'	
	);
	
	protected static $_belongs_to = array(
			    'kvm' => array(
			        'key_from' => 'kvmID',
			        'model_to' => 'Basic\Model_Device_Kvm',
			        'key_to' => 'id',
			        'cascade_save' => false,
			        'cascade_delete' => false,
	)
	);
	
	
	
	
	
}

?>