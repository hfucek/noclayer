<?php
namespace Basic;
class Model_Device_Template_Image  extends  \Orm\Model {



	protected static $_table_name = 'temp_images';

	protected static $_properties = array(
		'id',
		'name',
		'elementID',
		'type',
		'width',
		'height'
	);

/*
	protected static $_has_many = array(
	    'fields' => array(
	        'key_from' => 'id',
	        'model_to' => 'Model_DeviceFieldset',
	        'key_to' => 'deviceID',
	        'cascade_save' => true,
	        'cascade_delete' => true,
	)
	);
*/
private function unlink_img($path){
	
	if(is_file($path)){
		
	unlink($path);	
		
	}
	
}	
	
public function delete($cascade=null, $use_transation=false){
	
	
	$id=$this->get('id');
	//remove images from disk
	
	//path to 1000px image
	$this->unlink_img(DOCROOT.'images/temp'. $id.'.png');
	
	//path to 135px image
	$this->unlink_img(DOCROOT.'images/tumb/temp'. $id.'.png');
	
	//delete from database
	parent::delete();
}
	
	
}