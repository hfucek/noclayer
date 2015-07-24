<?php

class DBConfig {

    /**
     * @var boolean|string return mysql status
     */
    protected $_error;

    /**
     * @var string version of mysql server
     */
    private $_version;

    /**
     * Error titles
     */

    const MYSQL_WRONG_VERSION = 'Sorry we need Mysql version > 5.0.x';

    /*
     * Minimal version of mysql server
     */
    const MYSQL_MIN_VERSION = 5.0;

    /**
     * Fetch mysql server version
     * @return type mysql_version
     * 
     */
    protected function _mysql_version_get_query() {

        $query = mysql_query("select version() as version");
        if (!$query) {
            return mysql_error();
        }

        $data = mysql_fetch_object($query);
        return $data->version;
    }

    /**
     * 
     * @return boolean mysql version from server
     */
    private function __mysql_version() {


        $this->_version = $this->_mysql_version_get_query();

        if (version_compare($this->_version, self::MYSQL_MIN_VERSION, '<'))
            return false;


        return true;
    }

    /**
     * 
     * @param type string $result
     * @return type string numeric version of mysql
     */
    protected function _extractVersionNumber($result) {

        preg_match('/[0-9]\.[0-9]+\.[0-9]+/', $result, $version);
        return $version;
    }

    /**
     * 
     * @param type $host
     * @param type $user
     * @param type $pass
     * @param type $db
     * @return type _error
     */
    public function test($host, $user, $pass, $db) {


        $link = @mysql_connect($host, $user, $pass) or $this->_error = mysql_error();

        if ($link) {

            if (!mysql_select_db($db)) {

                $this->_error = mysql_error();
            } else {

                if (!$this->__mysql_version())
                    return self::MYSQL_WRONG_VERSION . ' (' . $this->_version . ')';
            }

            mysql_close($link);
        }



        return $this->_error;
    }

}

class Controller_Install extends Controller_Installbasic {

    //public function action_rewrite() {
    //    echo 'NOCLAYER';
    //}



    private function configdata() {

        $data = Array(
            'admin_name' => '',
            'admin_pass' => '',
            'licensekey' => '',
            'mysql_host' => '',
            'mysql_database' => '',
            'mysql_username' => '',
            'mysql_password' => '',
            'next' => false,
            'errors' => Array());


        if ($_POST) {
            $data = $_POST;
            $data['next'] = false;
            $val = Validation::forge('users');
            $val->add_field('admin_name', 'Admin name', 'required|min_length[4]|max_length[250]');
            $val->add_field('admin_pass', 'Admin password', 'required|min_length[4]|max_length[250]');
            $val->add_field('licensekey', 'License key', 'required|min_length[4]|max_length[250]');
            $val->add_field('mysql_host', 'Mysql host', 'required|min_length[4]|max_length[250]');
            $val->add_field('mysql_database', 'Mysql database', 'required|min_length[4]|max_length[250]');
            $val->add_field('mysql_username', 'Mysql username', 'required|min_length[4]|max_length[250]');
            $val->add_field('mysql_password', 'Mysql password', 'required|min_length[4]|max_length[250]');
            $conn = false;
            if ($val->run()) {
                $data['next'] = false;
                $DB = new DBConfig();
                $conn = $DB->test($val->validated('mysql_host'), $val->validated('mysql_username'), $val->validated('mysql_password'), $val->validated('mysql_database'));
                $data['errors'] = Array($conn);
                if (!$conn) {
                    $data['next'] = true;
                }
            } else {
                $data['errors'] = $val->error();
            }
        }

        return $data;
    }

    /**
     * 
     * @param type $data
     * @return boolean
     * 
     */
    private function check_license($data) {
        $licen = Licen::load();
        //register online mode
        $data = $licen->valRemote($data['licensekey']);
        if ($data) {
            return $licen->getData();
        }
        return false;
    }

  
    public function action_index($id = null) {


      
$this->install_mode='Online';

        Config::load('install', true);
        $this->version = Config::get('install.version');

        if ($this->version <= 0) {
            $data['instaled'] = false;
            $data['title'] = 'Installation';
            $view = View::forge('install/layout', $data);
            $req = $this->requirements(false);
            $view->requirements = View::forge('install/requirements', $req);
            //set empty
            $view->configdata = '';
            $view->license = '';
            //$req['next']=true;
            if ($req['next']) {
                //all requirements passed ok
                $config = $this->configdata();
                if ($config['next']) {
                    //install data passed, make install and goto license	
                    if ($this->check_license($config)) {
					
                        return $this->_install($config);
                    } else {
                        $config['next'] = false;
                        $config['errors'] = Array('Wrong license key!');
                    }
                }
                 
                
                $view->configdata = View::forge('install/configdata', $config);
            }
            return $view;
        } else {
            
                
            $this->migrate_modules();
            $data['version'] = Model_Version::find('last', array('order_by' => 'meta_update_time'));
            $data['instaled'] = true;
            return View::forge('install/version', $data);
        }
    }

}