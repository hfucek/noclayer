<?php

namespace Cacti;

define("PHPCACTI_DIR", dirname(__FILE__));

use Config;
use Cookie;
use FuelException;
use Session;
use Lang;

class Cacti {

    /**
     *  Cacti  URL
     *
     *  @var string
     *  @access private
     */
    private $_url;

    public function __construct($url) {
        $this->url = $url;
        //$session = Session::instance();
    }

    /**
     * Authentication variables for cacti 
     * 
     */
    public function authentication($user, $password) {


        /**
         * First connexion : sending the login form
         *
         * */
        $this->user = $user;
        $this->password = $password;

        $temp_cookie = \Session::get('cacti_cookie');
        if (!$temp_cookie) {
            $tmp_fname = tempnam("/tmp", "cacticookie");
            Session::set('cacti_cookie', $tmp_fname);
        }

        $this->temp_cookie = Session::get('cacti_cookie');


        $ch = curl_init($this->url);
        curl_setopt($ch, CURLOPT_POST, TRUE);
        curl_setopt($ch, CURLOPT_POSTFIELDS, array(
            'login_username' => $this->user,
            'login_password' => $this->password,
            'realm' => 'local',
            'action' => 'login'
                )
        );
        curl_setopt($ch, CURLOPT_FRESH_CONNECT, TRUE);
        curl_setopt($ch, CURLOPT_COOKIEJAR, $this->temp_cookie);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
        curl_setopt($ch, CURLOPT_COOKIESESSION, TRUE);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        if (preg_match('`^https://`i', $this->url)) {
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        }
        $ret = curl_exec($ch);
        //print_r($ret);

        if ($ret === FALSE) {
            print (curl_error($ch));
            die(curl_error());
            return false;
        }
        curl_close($ch);
        return true;
    }

    public function getHosts() {

        $data = $this->curldata($this->url . 'graph_view.php?action=list');

        $data = explode('<body', $data);


        $ispis = str_replace('<IMG', '<i', $data[1]);


        $parser = new Parser($ispis);
    }

    private function getGraphs() {
        $data = $this->curldata($this->url . 'graph_view.php?action=list');
    }

    private function isvalidUrl($what, $data) {
        $datas = explode($what, $data);

        //print_r($datas);
        return count($datas);
    }

    public function testConnection($user, $password) {
        //\Log::debug('cacti');

        $this->user = $user;
        $this->password = $password;

        $temp_cookie = \Session::get('cacti_cookie');
        if (!$temp_cookie) {
            
        }
        $tmp_fname = tempnam("/tmp", "cacticookie");
        \Session::set('cacti_cookie', $tmp_fname);
        //}

        $this->temp_cookie = \Session::get('cacti_cookie');

        \Log::debug($this->temp_cookie);


        $ch = curl_init($this->url);
        curl_setopt($ch, CURLOPT_POST, TRUE);
        curl_setopt($ch, CURLOPT_POSTFIELDS, array(
            'login_username' => $this->user,
            'login_password' => $this->password,
            'realm' => 'local',
            'action' => 'login'
                )
        );
        curl_setopt($ch, CURLOPT_FRESH_CONNECT, TRUE);
        curl_setopt($ch, CURLOPT_COOKIEJAR, $this->temp_cookie);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
        curl_setopt($ch, CURLOPT_COOKIESESSION, TRUE);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        if (preg_match('`^https://`i', $this->url)) {
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        }


        $ret = curl_exec($ch);

        $m = print_r($ret, true);

        $resultStatus = curl_getinfo($ch);

        $code = $resultStatus['http_code'];


        if ($code == 200) {
            $code = 401;
            //echo $this->isvalidUrl('<title>Console',$m);
            // echo $this->isvalidUrl('<title>Graphs ->',$m);
            if ($this->isvalidUrl('<title>Console', $m) > 1 or $this->isvalidUrl('<title>Graphs ->', $m) > 1) {
                $code = 200;
            }
        }

        curl_close($ch);

        return $code;
    }

    private function sizes($n) {


        $sizes = Array(
            array(265, 55, false),
            array(355, 105, false), //360,135
            array(425, 125, true), //480,180
            array(550, 180, true), //590,220
            array(640, 150, true), //590,220
            array(550, 100, true), //590,220
        );

        return $sizes[$n];
    }

    private function curl($url) {

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, FALSE);
        if (preg_match('`^https://`i', $url)) {
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        }
        curl_setopt($ch, CURLOPT_FRESH_CONNECT, TRUE);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_COOKIEFILE, $this->temp_cookie);
        $ret = curl_exec($ch);

        $m = print_r($ret, true);

        $resultStatus = curl_getinfo($ch);

        $code = $resultStatus['http_code'];

        if ($code == 200) {

            $data = explode("<title>Login to Cacti", $m);
            if (count($data) >= 1) {
                $code = 401;
            } else {

                $data = explode("<title>Graphs -> List Mode", $m);

                if (count($data) <= 1) {
                    $code = 515;
                }
            }
        }

        curl_close($ch);

        return array('ret' => $ret, 'code' => $code);
    }

    private function graphdata($url) {

        $curl = $this->curl($url);


        return $curl;
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
