<?php

namespace Fuel\Migrations;

class Installnucl
{



	function up(){





		/***********************************************************************************************
		 groups
		***********************************************************************************************/
		$groups=\DBUtil::checkIfExist('groups');
		if(!$groups){
			\DBUtil::create_table('groups',array(
			'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
			'name' => array('constraint' => 200, 'type' => 'varchar'),
			'level' => array('constraint' => 11, 'type' => 'int'),
			'is_admin' => array('constraint' => 1, 'type' => 'int')

			),
			array('id'), true, 'InnoDB', 'utf8_unicode_ci'
			);
		}
		/***********************************************************************************************
		 migration
		***********************************************************************************************/
		$migration=\DBUtil::checkIfExist('migration');
		
               
                if(!$migration){
			\DBUtil::create_table('migration',array(
			'name' =>array('constraint' => 50, 'type' => 'varchar'),
			'type' =>  array('constraint' => 25, 'type' => 'varchar'),
			'version' => array('constraint' => 11, 'type' => 'int')
			),Array(), true, 'InnoDB', 'utf8_unicode_ci'
			);
			// insert default connector type
			//\DBUtil::truncate_table('migration');

			list($insert_id, $rows_affected) = \DB::insert('migration')->
			columns(array('name','type','version'))->values(array('sentry','package',1)
			)->execute();
		}
		
		/***********************************************************************************************
		 settings
		***********************************************************************************************/
		$settings=\DBUtil::checkIfExist('settings');
		if(!$settings){
			\DBUtil::create_table('settings',array(
			'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
			'name' => array('constraint' => 200, 'type' => 'varchar'),
			'value' => array('constraint' =>200, 'type' => 'varchar'),
			'meta_update_user' => array('constraint' => 11, 'type' => 'int','default'=>'0')     

			),
			array('id'), true, 'InnoDB', 'utf8_unicode_ci'
			);
		}

		/***********************************************************************************************
		 FOREIGN KEYS
		***********************************************************************************************/

		
		/***********************************************************************************************
		 sentry
		***********************************************************************************************/

		$table=\DBUtil::checkIfExist('users');
		if(!$table){

			\DBUtil::create_table('users', array(
					'id'                  => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
					'username'            => array('constraint' => 50, 'type' => 'varchar'),
					'email'               => array('constraint' => 50, 'type' => 'varchar'),
					'password'            => array('constraint' => 81, 'type' => 'varchar'),
					'password_reset_hash' => array('constraint' => 81, 'type' => 'varchar'),
					'temp_password'       => array('constraint' => 81, 'type' => 'varchar'),
					'remember_me'         => array('constraint' => 81, 'type' => 'varchar'),
					'activation_hash'     => array('constraint' => 81, 'type' => 'varchar'),
					'last_login'          => array('constraint' => 11, 'type' => 'int'),
					'ip_address'          => array('constraint' => 50, 'type' => 'varchar'),
					'updated_at'          => array('constraint' => 11, 'type' => 'int'),
					'created_at'          => array('constraint' => 11, 'type' => 'int'),
					'status'              => array('constraint' => 1, 'type' => 'tinyint'),
					'activated'           => array('contsraint' => 1, 'type' => 'tinyint'),
			), array('id'));
		}

		$table=\DBUtil::checkIfExist('users_metadata');
		if(!$table){

			\DBUtil::create_table('users_metadata', array(
					'user_id'    => array('constraint' => 11, 'type' => 'int'),
					'first_name' => array('constraint' => 50, 'type' => 'varchar'),
					'last_name'  => array('constraint' => 50, 'type' => 'varchar'),
			), array('user_id'));
		}

		$table=\DBUtil::checkIfExist('users_suspended');
		if(!$table){
			\DBUtil::create_table('users_suspended', array(
					'id'              => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
					'login_id'        => array('constraint' => 50, 'type' => 'varchar'),
					'attempts'        => array('constraint' => 50, 'type' => 'int'),
					'ip'              => array('constraint' => 25, 'type' => 'varchar'),
					'last_attempt_at' => array('constraint' => 11, 'type' => 'int'),
					'suspended_at'    => array('constraint' => 11, 'type' => 'int'),
					'unsuspend_at'    => array('constraint' => 11, 'type' => 'int'),
			), array('id'));
		}
		$table=\DBUtil::checkIfExist('users_groups');
		if(!$table){
			\DBUtil::create_table('users_groups', array(
					'user_id'  => array('constraint' => 11, 'type' => 'int'),
					'group_id' => array('constraint' => 11, 'type' => 'int'),
			));
		}



		/***********************************************************************************************
		 version
		***********************************************************************************************/
		$table=\DBUtil::checkIfExist('version');
		
                if($table){
                \DBUtil::drop_table('version');
                $table=false;
                }
                
                if(!$table){
			\DBUtil::create_table('version',array(
					'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
					'value' => array('constraint' => 200, 'type' => 'varchar'),
					'meta_update_time' => array('constraint' => 11, 'type' => 'int','default'=>'0'),
                                        'lastcheck'=> array('constraint' => 11, 'type' => 'int','default'=>'0'),
                                        'mode'=> array('constraint' => 22, 'type' => 'varchar'),
                                        'master'=> array('constraint' => 22, 'type' => 'varchar'),
                                        'quiet'=> array('constraint' => 2, 'type' => 'int','default'=>'0')

			),
			array('id'), true, 'InnoDB', 'utf8_unicode_ci'
			);

			$now=time();

                        $master='1.0';
			list($insert_id, $rows_affected) = \DB::insert('version')->columns(array('id','value','meta_update_time','lastcheck','mode','master','quiet'))->values(
			array('1',$master, $now,$now,'0',$master,0))->execute();
		}

		/***********************************************************************************************
		 simple log
		***********************************************************************************************/
		$table=\DBUtil::checkIfExist('simple_log');
		if(!$table){
			\DBUtil::create_table(
					'simple_log',
					array(
						'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
						'name' => array('constraint' => 200, 'type' => 'varchar'),
						'value' => array('type' => 'text')
					),
					array('id'),
					true,
					'InnoDB',
					'utf8_unicode_ci'
					
			);
		}
	}

	public function down()
	{


	}


}