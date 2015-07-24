<?php
/**
 * 
 * Model for users ...
 * @author hrvoje
 *
 *
 */
class Model_Users extends Orm\Model{
	
	protected static $_table_name = 'users';
	
	protected static $_properties = array(
	'id',
	'username',
	'email',
	'password',
	'password_reset_hash',
	'temp_password',
	'remember_me'
	);
	
	
	
}

?>