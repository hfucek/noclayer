<?php

class Controller_Installbasic extends Library 
{
	 
    public function action_index(){
        echo 'io';
        
    }
    public function before()
	{
        //remove all data from previus installation....
        Sentry::logout();

        Config::load('Sentry', true);
        Cookie::delete('sentry_rm');

        Session::delete(Config::get('sentry.session.user'));
        Session::delete(Config::get('sentry.session.provider'));

		
		
        parent::before();
    }
	
	protected function _makeConfig($conf) {

        //load database configuration
        Config::load(Fuel::$env . '/db', 'db');

        //Fill it with user defined data
        Config::set('db.default.connection.dsn', "mysql:host=" . $conf['mysql_host'] . ";dbname=" . $conf['mysql_database']);
        Config::set('db.default.connection.username', $conf['mysql_username']);
        Config::set('db.default.connection.password', $conf['mysql_password']);

        /*
         *  //type
        Config::set('db.default.type','mysqli');
        //connection 
       
        Config::set('db.default.connection', array());
        Config::set('db.default.connection.hostname', $conf['mysql_host']);
        Config::set('db.default.connection.port', 3306);
        Config::set('db.default.connection.database', $conf['mysql_database']);
        Config::set('db.default.connection.username', $conf['mysql_username']);
        Config::set('db.default.connection.password', $conf['mysql_password']);
        Config::set('db.default.connection.persistent', false);
        Config::set('db.default.connection.compress', false);
        
        Config::set('db.default.identifier', '`');
        Config::set('db.default.table_prefix', '');
        Config::set('db.default.charset', 'utf8');
        Config::set('db.default.enable_cache', false);
        Config::set('db.default.profiling', false);
        Config::set('db.default.readonly', false);
         */
        
        //Save changes
        Config::save(Fuel::$env . '/db', 'db');



        //get install version
        Config::load('update', true);
        $upVersion = Config::get('update.version');
        Config::load('install', true);


        $curVersion = Config::get('install.version');

        if ($curVersion != null) {
            //new version ...	
            //migrate
        } else {

            Config::set('install.version', $upVersion);
            Config::set('install.user', $conf['admin_name']);
            Config::save('install', 'install');
        }
    }
	
	/**
     * Generates a random salt and hashes the given password with the salt.
     * String returned is prepended with a 16 character alpha-numeric salt.
     *
     * @param   string  Password to generate hash/salt for
     * @return  string
     */
    protected function generate_password($password) {
        $salt = \Str::random('alnum', 16);

        return $salt . $this->hash_password($password, $salt);
    }

    /**
     * Hash a given password with the given salt.
     *
     * @param   string  Password to hash
     * @param   string  Password Salt
     * @return  string
     */
    protected function hash_password($password, $salt) {
        $password = hash('sha256', $salt . $password);

        return $password;
    }
	
    protected function _isDefaultUserSet(){
        $users = DB::select('*')->from('users')->execute();
        $num_rows = count($users);
        if($num_rows>0) return true;
        return false;

    }

        protected function _installDefaultUserInDb($data)
	{
            
            //$query=DB::select('select * from users where ')->execute();
		if($this->_isDefaultUserSet()){
                    
                    //change name and password only
                    
            $result = DB::update('users')
            ->set(array(
                'username'  => $data['admin_name'],
                'password' => $this->generate_password($data['admin_pass'])
            ))
            ->where('id', '=', '1')
            ->execute();
                    
                    
                }else{
		$usr = array(
			'username'    => $data['admin_name'],
			'password' => $this->generate_password($data['admin_pass']),
			'email'	=> 'email@noclayer.com',
			'password_reset_hash'=>'',
			'temp_password'=>'',
			'remember_me'=>'',
			'remember_me'=>'',
			'last_login'=>'',
			'ip_address'=>'',
			'updated_at'=>'',
			'created_at'=>time(),
			'status'=> 1,	
			'activated'=>1
		);

		
		
		// insert new user
		list($user_id, $rows_affected) = DB::insert('users')->set($usr)->execute();
		
		$meta=array(
			'user_id'=>$user_id[0],
			'first_name'=>'',
			'last_name'=>''
		);
		
		//insert metadata
		list($insertt_id, $rows_affected) = DB::insert('users_metadata')->set($meta)->execute();
	}}
	
          /**
     * old version < 1.09 is without modules.. erase old table and set new
     */
    private function __erase_old_migration() {

 
        \Config::load('install', true);
        $version = \Config::get('install.version');
        
            
        


        
            
        $table = \DBUtil::checkIfExist('version');

        
        
        if ($table) {
           
            if (!DBUtil::field_exists('version', array('mode'))) {
              
                
                // Fields dont exist
                \DBUtil::truncate_table('version');

                \DBUtil::add_fields('version', array(
                    'lastcheck' => array('constraint' => 11, 'type' => 'int', 'default' => '0'),
                    'mode' => array('constraint' => 22, 'type' => 'varchar'),
                    'master' => array('constraint' => 22, 'type' => 'varchar'),
                    'quiet' => array('constraint' => 2, 'type' => 'int', 'default' => '0')
                ));


                $now = time();
/*  
               \Config::load('update', true);
                $master = \Config::get('update.version');
*/				
$master='1.1';	                

                list($insert_id, $rows_affected) = \DB::insert('version')->columns(array('id', 'value', 'meta_update_time', 'lastcheck', 'mode', 'master', 'quiet'))->values(
                                array('1', $master, $now, $now, $master, $master, 0))->execute();



                $table = \DBUtil::checkIfExist('simple_log');
                if (!$table) {
                    \DBUtil::create_table(
                            'simple_log', array(
                        'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                        'name' => array('constraint' => 200, 'type' => 'varchar'),
                        'value' => array('type' => 'text')
                            ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
                    );
                }
            }}
        
    }

	protected function _install($data)
	{
		
               
            
            
		$this->_makeConfig($data);
		//load config data and connect to database
		$l = Config::load('install', true);
		$lastestVersion=Config::get('install.version');
		
		$l=Config::load(Fuel::$env.'/db',null, true,true);
		Migrate::latest('default', 'app');
		$this->_installDefaultUserInDb($data);
		$this->migrate_modules();
		
		$this->__erase_old_migration();
                
		
		
		$db_master=Model_Version::find()->limit(1)->order_by('id','desc')->get_one();
		
		//set master on last
		$db_master->value= $lastestVersion;
                //set mode on last
                $db_master->mode= $lastestVersion;
		$db_master->save();
		$data['instaled']=true;
		
		$data['version']=$db_master;
		return View::forge('install/version',$data);
	}
	
}