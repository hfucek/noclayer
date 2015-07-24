<?php

use Fuel\Core\Controller;

class Library extends Controller {

    public function _module_Check($mod) {


        $mods = Array('none', 'basic', 'advanced', 'premium');

        //current mode from licence
        $key = array_search($this->nocversion, $mods);

        /*
         * xdfsdfs
         * */


        if ($key < $mod) {

            \Response::redirect(\Config::get('base_url') . 'module/wrong');
        }
    }

    /**
     * Migrate modules writen in manifest.json
     *
     */
    public function migrate_modules() {

        $manifest = json_decode(file_get_contents(DOCROOT . 'assets/modules/manifest.json'));
        foreach ($manifest->modules as $modul) {

            \Migrate::latest($modul, 'module');
        }
    }

    protected function path_get($file) {




        $md = explode('/', $_SERVER['SCRIPT_FILENAME']);
        array_pop($md); //remove index.php



        $MODULE_ROOT = implode('/', $md);



        switch ($file[1]) {
            case 'a':
                return APPPATH . $file[0];
                break;
            case 'd':
                return $MODULE_ROOT . $file[0];
                break;
            default:
                return COREPATH;
                break;
        }
    }

    public function requirements($installed=false) {

        $next = true;
        $data = Array(
            'php' => Array('class' => 'c1', 'value' => 'OK', 'ver' => ''),
            'mysql' => Array('class' => 'c1', 'value' => 'OK', 'ver' => ''),
            'rewrite' => Array('class' => 'c1', 'value' => 'OK', 'err' => ''),
            'gd' => Array('class' => 'c1', 'value' => 'OK', 'err' => ''),
            'files' => Array(),
            'dom' => Array('class' => 'c1', 'value' => 'OK', 'err' => ''),
            'mysql' => Array('class' => 'c1', 'value' => 'OK', 'err' => ''),
            'zip' => Array('class' => 'c1', 'value' => 'OK', 'err' => ''),
            'home' => Array('class' => 'c1', 'value' => 'OK', 'err' => '')
        );

        //php version
        if (version_compare(phpversion(), '5.3.0', '<')) {
            $data['php'] = Array('class' => 'c2', 'value' => 'NO', 'ver' => phpversion());
            //$next=false;
        } else {
            $data['php']['ver'] = phpversion();
        }





        /*
          //mod rewrite
          ob_start();
          phpinfo(INFO_MODULES);
          $contents = ob_get_contents();
          ob_end_clean();
         */

        /*
          if(strpos($contents, 'mod_rewrite')==false){
          $data['rewrite']=Array('class'=>'c2','value'=>'NO','err'=>'');
          $next=false;
          }
         */

        //DOM
        if (!class_exists('DOMDocument')) {
            $next = false;
            $data['dom'] = Array('class' => 'c2', 'value' => 'NO', 'err' => '');
        }
        //ZIP
        if (!class_exists('ZipArchive')) {
            $next = false;
            $data['zip'] = Array('class' => 'c2', 'value' => 'NO', 'err' => '');
        }

if (!function_exists("mysql_connect")) {
            $next = false;
            $data['mysql'] = Array('class' => 'c2', 'value' => 'NO', 'err' => '');
        }

        //gd library
        if (!extension_loaded('gd')) {
            $next = false;
            $data['gd'] = Array('class' => 'c2', 'value' => 'NO', 'err' => '');
        }

        //filesecho'hm'; permission


        \Config::load('writable', true);
        $_files = \Config::get('writable');



        foreach ($_files as $file) {



            $perm = substr(sprintf('%o', fileperms($this->path_get($file))), -3);


            if (is_writable($this->path_get($file))) {


                $new = Array('file' => $this->path_get($file), 'perm' => $perm, 'writable' => 'OK', 'exist' => 'true', 'class' => 'c1');
            } elseif (!file_exists($this->path_get($file))) {
                $new = Array('file' => $this->path_get($file), 'perm' => $perm, 'writable' => 'NO', 'exist' => 'false', 'class' => 'c2');

                $next = false;
            } else {



                $new = Array('file' => $this->path_get($file), 'perm' => $perm, 'writable' => 'NO', 'exist' => 'true', 'class' => 'c3');
                $next = false;
            }
            array_push($data['files'], $new);
        }


        
        
        

        $lic = \Licen::load();


        $mode=(isset($this->install_mode))?$this->install_mode:'';
        
        if (!$lic->isOfflineLicense() and $mode != 'Offline') {
           
            
            
            if(!$installed){
            $header = @fsockopen('license.noclayer.com', 80, $errno, $errstr, 10);

            if (!$header) {
                // if the socket fails return failed
                $data['home'] = Array('class' => 'c5', 'value' => $errstr);
                //$next=false;
            } else {

                fclose($header);
            }
            }else{
                  $data['home'] = Array('class' => 'c1', 'value' => 'passed');
            }
        } else {
            $data['home'] = Array('class' => 'c1', 'value' => 'OFFLINE');
        }




        return Array('req' => $data, 'next' => $next);
    }

}