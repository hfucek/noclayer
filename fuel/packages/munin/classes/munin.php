<?php

namespace Munin;

define("PHPMUNIN_DIR", dirname(__FILE__));

use Config;
use Cookie;
use FuelException;
use Session;
use Lang;

class Munin {

    /**
     *  Cacti  URL
     *
     *  @var string
     *  @access private
     */
    private $_url;
    private $_use_auth;

    public function __construct($url, $useAuth) {
        $this->url = $url;
        $this->_use_auth = ($useAuth == 1) ? true : false;
        //$session = Session::instance();
    }

    /**
     * Authentication variables for munin 
     * 
     */
    public function authentication($user, $password) {


        /**
         * First connexion : sending the login form
         *
         * */
        $this->user = $user;
        $this->password = $password;

       
        return true;
    }

    private function getGraphs() {

        $data = $this->curldata($this->url . 'graph_view.php?action=list');
    }

    private function isvalidUrl($what, $data) {
        $datas = explode($what, $data);

        //print_r($datas);
        return count($datas);
    }

    public function plotGraph($name,$time){
        
        $names=Array('','day','week','month','year');
        $mm=$names[$time];
        //remove html file if exist
        
        $u=explode('/',$this->url);
        
        $m=array_pop($u);
        
        if($m=='index.html'){
            
         $path=implode('/',$u);
        }else{
          $path=$this->url;  
        }
        $path.='/';
         $zz=$path.$name.'-'.$mm.'.png';
       
         $curl = $this->curl($zz);
        

        return $curl;
         
        
        
        
    }
    
    public function graph_list() {
      
        $data = $this->curldata($this->url);

        if ($data) {
            $parser = new \Munin\Parser($data);

            if ($parser)
                return $parser->graphs;
        }
    
        return Array();
        
    }

    public function testConnection($user, $password) {
        //\Log::debug('munin');

        $ch = curl_init($this->url);

        curl_setopt($ch, CURLOPT_FRESH_CONNECT, TRUE);

        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);

        if (preg_match('`^https://`i', $this->url)) {
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        }

        if ($this->_use_auth) {
            $this->user = $user;
            $this->password = $password;

            $temp_cookie = \Session::get('munin_cookie');
            if (!$temp_cookie) {
                
            }
            $tmp_fname = tempnam("/tmp", "MUNINCOOKIE");
            \Session::set('munin_cookie', $tmp_fname);
            //}

            $this->temp_cookie = \Session::get('munin_cookie');

         
            curl_setopt($ch, CURLOPT_COOKIESESSION, TRUE);
            curl_setopt($ch, CURLOPT_COOKIEJAR, $this->temp_cookie);
            //curl_setopt($ch, CURLOPT_POST, TRUE);
            curl_setopt($ch, CURLOPT_USERPWD, $this->user . ":" . $this->password);
        }

        $ret = curl_exec($ch);

        $m = print_r($ret, true);

        $resultStatus = curl_getinfo($ch);

        $code = $resultStatus['http_code'];


        if ($code == 200) {
            $code = 401;
            //echo $this->isvalidUrl('<title>Console',$m);
            // echo $this->isvalidUrl('<title>Graphs ->',$m);
            if ($this->isvalidUrl('-day.png"', $m) > 1 and $this->isvalidUrl('-week.png"', $m) > 1) {
                $code = 200;
            }
        }

        curl_close($ch);

        return $code;
    }

 

    private function curl($url) {

        $ch = curl_init($url);

        curl_setopt($ch, CURLOPT_FRESH_CONNECT, TRUE);

        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);

        if (preg_match('`^https://`i', $this->url)) {
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        }

        if ($this->_use_auth) {
           
            $temp_cookie = \Session::get('munin_cookie');
            if (!$temp_cookie) {
                
            }
            $tmp_fname = tempnam("/tmp", "MUNINCOOKIE");
            \Session::set('munin_cookie', $tmp_fname);
            //}

           
            //curl_setopt($ch, CURLOPT_POST, TRUE);
            curl_setopt($ch, CURLOPT_USERPWD, $this->user . ":" . $this->password);
        } else {
            curl_setopt($ch, CURLOPT_POST, FALSE);
        }

        $ret = curl_exec($ch);

        $m = print_r($ret, true);

        $resultStatus = curl_getinfo($ch);

        $code = $resultStatus['http_code'];

        if ($code == 200) {

            $code = 401;
            //echo $this->isvalidUrl('<title>Console',$m);
            // echo $this->isvalidUrl('<title>Graphs ->',$m);
            if ($this->isvalidUrl('-day.png"', $m) > 1 and $this->isvalidUrl('-week.png"', $m) > 1) {
                $code = 200;
            }
        }

        curl_close($ch);

        return array('ret' => $ret, 'code' => $code);
    }

  

    private function curldata($url) {

        $curl = $this->curl($url);

        if ($curl['code'] == 200) {
            return $curl['ret'];
        }
        return false;
    }

    function graph($id, $size, $rd) {

        /**
         * Now, we can get the page we want and return it
         *
         * */
        $size = $this->sizes($size);

        $leg = '';
        if (!$size[2]) {
            $leg = '&graph_nolegend=true';
        }

        return $this->graphdata($this->url . 'graph_image.php?graph_full_size=100&action=zoom&local_graph_id=' . $id . '&rra_id=' . $rd . $leg . '&graph_height=' . $size[1] . '&graph_width=' . $size[0]);
    }

}

?>
