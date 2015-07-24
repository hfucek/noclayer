<?php
namespace Basic;
class Model_Device_Template_Network_Mac extends \Orm\Model{
	
	protected static $_table_name = 'temp_network_mac_ports';
	
	protected static $_properties = array(
			'id',
			'tempnetID',
			'mac_address',
			'conn_device',
			'vlan',
			'type'
	);
		
	protected static $_has_one = array(
            
            'cab1' => array(
                'key_from' => 'id',
                'model_to' => 'Basic\Model_Cable',
                'key_to' => 'port1',
                'cascade_save' => false,
                'cascade_delete' => false,
            ),
            
            'cab2' => array(
                'key_from' => 'id',
                'model_to' => 'Basic\Model_Cable',
                'key_to' => 'port2',
                'cascade_save' => false,
                'cascade_delete' => false,
            ),
            
            'vlans' => array(
                'key_from' => 'vlan',
                'model_to' => 'Basic\Model_Device_Template_Network_Vlan',
                'key_to' => 'id',
                'cascade_save' => false,
                'cascade_delete' => false,
            )
            
        );
	
	
}

?>