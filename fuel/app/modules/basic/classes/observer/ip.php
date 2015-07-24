<?php

namespace Basic;

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

class Observer_Ip extends \Orm\Observer {

    private function IPv4_dotquadA_to_intA($strbits) {

        if (strlen($strbits) > 0) {
            $split = explode('.', $strbits, 4);

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

    public function before_insert(Model_Network_Ip $model) {


        $model->addrint = $this->IPv4_dotquadA_to_intA($model->ipv4);
    }

    public function before_save(Model_Network_Ip $model) {
        $model->addrint = $this->IPv4_dotquadA_to_intA($model->ipv4);
    }

}

?>
