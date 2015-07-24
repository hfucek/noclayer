<?php

namespace Fuel\Migrations;

class Migrate02 {

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

    function down() {
        
    }

    function up() {


        //check for address field as integer
        if (!\DBUtil::field_exists('network_ip_ports', array('addrint'))) {

            //\Fuel\Core\Module::load('basic');
            //add field
            \DBUtil::add_fields('network_ip_ports', array(
                'addrint' => array('type' => 'double'),
            ));


            $ports = \DB::select('id', 'ipv4')
                    ->from('network_ip_ports')
                    ->as_object()
                    ->execute();

            foreach ($ports as $port) {


                $result = \DB::update('network_ip_ports')
                        ->value("addrint", $this->IPv4_dotquadA_to_intA($port->ipv4))
                        ->where('id', '=', $port->id)
                        ->execute();
            }



            /*
              $ips = \Basic\Model_Network_Ip::find('all');




              foreach($ips as $ip){
              $ip->addrint=$this->IPv4_dotquadA_to_intA($ip->ipv4);
              $ip->save();
              }
             */
        }
    }

}

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
?>
