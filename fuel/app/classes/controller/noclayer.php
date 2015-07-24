<?php

use Fuel\Core\Controller;

class Controller_Noclayer extends Controller_Login {

    /**
     *
     * @var instance of upgrade class 
     */
    protected $_upgrade;

    public function before() {
        parent::before();

        $this->_upgrade = new \Upgrade();
        if (Module::exists('whmcs')) {
            Module::load('whmcs');
         if(\Whmcs\Whmcs::route()){
             $data=array();
            return Response::forge(View::forge('whmcs/route', $data)); 
             
         } 
        
                 
        }
    }

    /**
     * 
     * Main index file for project ...
     * @access public
     * @return Response
     */
    protected function using_ie() {
        $u_agent = $_SERVER['HTTP_USER_AGENT'];

        $ub = False;
        if (preg_match('/MSIE/i', $u_agent)) {


            if (preg_match('/(?i)msie [1-8]/', $_SERVER['HTTP_USER_AGENT'])) {
                //	$ub = True;
            } else {
                
            }

            //$ub = True;
        }




        return $ub;
    }

    protected function default_settings($user) {



        $props = Array(
            'name' => 'background',
            'value' => '2',
            'meta_update_user' => $user
        );
        $set0 = new \Model_Settings($props);
        $set0->save();

        $props2 = Array(
            'name' => 'tutorials',
            'value' => '0',
            'meta_update_user' => $user
        );
        $set = new \Model_Settings($props2);
        $set->save();

        return $set0;
    }

    private function parse_settings() {

        //when no user loged in, defualt background 
        $a = Array(Array('name' => 'background', 'value' => '2'), Array('name' => 'tutorials', 'value' => '0'));


        if (Sentry::check()) {
            $a = Array();
            $user = Sentry::user()->get('id');

            $query = Model_Settings::find()->where('meta_update_user', $user);

            $data = $query->get();

            if ($query->count() <= 1) {
                // user (demo) loged first time, make defualt settings
                $data = $this->default_settings($user);
            }



            foreach ($data as $s) {
                $m = array('name' => $s->name, 'value' => $s->value);

                array_push($a, $m);
            }
        }


        return $a;
    }

    private function __get_version() {



        return $upgrade->check();
    }

    public function action_index() {


        /* what if user move all data to other location?
         * we need to check each time noclayer index start for file permission 
         * 
         * */

        //echo Fuel::$env;



        /*
         * IE only version >=9
         * */

        if ($this->using_ie())
            return Response::forge(View::forge('noclayer/ieerror'));
        //Auth::instance()->logout();


        /*
         * load install config
         * */




        if ($this->_upgrade->is_installed()) {


            $req = $this->requirements(true);



            if (!$req['next']) {
                $data['instaled'] = false;
                $data['title'] = false;

                $view = View::forge('install/layout', $data);
                //$req=$this->requirements();

                $view->configdata = false;
                $view->license = false;

                $view->requirements = View::forge('install/requirements', $req);

                return $view;
            }


            //boolean is user loged in 
            $data['huser'] = (Sentry::check()) ? Sentry::user()->get('username') : 'none';
            $data['license_stat'] = Array('red', '-');

            $data['license'] = Array('Unregistered', '-', '-', '-', '-', '-', '-');
            if (isset($this->valid)) {
                $data['license'] = $this->valid;
                $data['license_stat'] = $this->valid_c;
            }


            $data['settings'] = $this->parse_settings();


            //type of user
            $data['htyp'] = 0;

            //type of user
            $data['hlog'] = (Sentry::check()) ? 'ok' : 'no';

            //version installed
            $data['version'] = $this->_upgrade->getVersion();

            //upgrade
            $data['upgraded'] = $this->_upgrade->check();


            $data['manifest'] = json_decode(file_get_contents(DOCROOT . 'assets/modules/manifest.json'));



            //is demo or production
            if (isset($_SERVER['HTTP_NOC_ENV']))
                $data['demo'] = $_SERVER['HTTP_NOC_ENV'];
            else
                $data['demo'] = 'nop';


            $data['nocversion'] = $this->nocversion;



            return Response::forge(View::forge('noclayer/index', $data));
        }else {
            $data['instaled'] = true;
            return Response::forge(View::forge('install/not_installed', $data));
        }


        /*
          echo 'hello';
         */
    }

    /**
     * The 404 action for the application.
     *
     * @access  public
     * @return  Response
     */
    public function action_404() {
        return Response::forge(View::forge('noclayer/404'), 404);
    }

    public function action_500() {
        //return Response::forge(ViewModel::forge('welcome/404'), 404);
    }

}