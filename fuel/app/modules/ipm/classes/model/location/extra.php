<?php
namespace Ipm;
class Model_Location_Extra  extends Model_Location {



	
        protected static $_has_one = array(
	'subnet_name'=>array(
            			        'key_from' => 'node',
				        'model_to' => 'Ipm\Model_Subnet',
				        'key_to' => 'id',
				        'cascade_save' => false,
				        'cascade_delete' => false,
            
        ),
	'building_name' => array(
				        'key_from' => 'building',
				        'model_to' => 'Basic\Model_Building',
				        'key_to' => 'id',
				        'cascade_save' => false,
				        'cascade_delete' => false,
	),
	'floor_name' => array(
				        'key_from' => 'floor',
				        'model_to' => 'Basic\Model_Floor',
				        'key_to' => 'id',
				        'cascade_save' => false,
				        'cascade_delete' => false,
	),
	'room_name' => array(
				        'key_from' => 'room',
				        'model_to' => 'Basic\Model_Room',
				        'key_to' => 'id',
				        'cascade_save' => false,
				        'cascade_delete' => false,
	),
        'rack_name' => array(
				        'key_from' => 'rack',
				        'model_to' => 'Basic\Model_Rack',
				        'key_to' => 'id',
				        'cascade_save' => false,
				        'cascade_delete' => false
	)
	
	);
	
	
}

?>	