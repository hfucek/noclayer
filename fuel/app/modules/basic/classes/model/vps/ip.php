<?php
namespace Basic;
class Model_Vps_Ip  extends  \Orm\Model {

	protected static $_table_name = 'vps_ip_ports';

	protected static $_properties = array(
			'id',
			'vpsID',
			'data'
	);

}

?>