<?php

namespace Ipm;

class Ipv4object {

    protected $__ip;

    function __construct($ip) {
        $this->__ip = $ip;
    }

    public function toInt() {

        if (strlen($this->__ip) > 0) {
            $split = explode('.', $this->__ip, 4);

            if (count($split) <= 1)
                return 0;

            $myInt = (
                    (int) ( $split[0]) * 16777216 /* 2^24 */
                    + (int) ( $split[1]) * 65536 /* 2^16 */
                    + (int) ( $split[2]) * 256 /* 2^8  */
                    + (int) ( $split[3])
                    );
            return $myInt;
        }

        return 0;
    }

}

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
?>
