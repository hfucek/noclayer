<?php
namespace Basic;
class Model_Network_Vlan extends \Orm\Model{
	
	protected static $_table_name = 'network_vlans';
	
	protected static $_properties = array(
			'id',
			'networkID',
			'name'
	);
	
	protected static $_has_many = array(
	
		'ports' => array(
				'key_from' => 'id',
				'model_to' => 'Basic\Model_Network_Mac',
				'key_to' => 'vlan',
				'cascade_save' => false,
				'cascade_delete' => false,
	));
		
	public function delete($cascade=null, $use_transation=false){
		
		$ports=$this->get('ports');
		
		foreach($ports as $port){
		$port->vlan=0;
		$port->save();	
		}
		
		
		parent::delete();
	}


}

?>