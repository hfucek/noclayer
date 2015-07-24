<?php

namespace Ipm;

class Ipv4 {

    /**
     * 192.168.8.2/24
     * @var String
     */
    protected $_subnet;

    /**
     * 192.168.8.0
     * @var String
     */
    protected $_network;

    /**
     * Value of subnet , range 0-32
     * /32
     * @var String
     */
    protected $_maskbit;

    /**
     * Value of subnet as dotted
     * 255.255.255.0
     * @var String
     */
    protected $_binmaskbit;

    /**
     * Number of all hosts in network
     * @var Integer
     */
    protected $_numberOfHosts;

    /**
     * Value of first host as integer
     * @var String
     */
    protected $_intAddrFrom;

    /**
     * Value of last host as integer
     * @var Integer
     */
    protected $_intAddrTo;

    public function __construct($sub) {

        $this->_subnet = $sub;

        $this->___populate();
    }

    /**
     * populate data
     */
    private function ___populate() {
        $addr = explode('/', $this->_subnet);

        $this->_network = $addr[0];
        $this->_maskbit = (int) $addr[1];

        $this->_numberOfHosts = $this->___IPv4_Hosts();

        $this->_intAddrFrom = $this->___intAddrFrom();
        $this->_intAddrTo = $this->___intAddrTo();
        // $this->binmask=$this->___IPv4_int_dotquadA($this->_maskbit);
    }

    /**
     * First host address as integer
     * @return  Integer
     */
    private function ___intAddrFrom() {

        return $this->___IPv4_dotquadA_to_intA($this->_network);
    }

    /**
     * Last host address as integer
     * @return type Integer
     */
    private function ___intAddrTo() {

        return ($this->_intAddrFrom + $this->_numberOfHosts);
    }

    /**
     * Calculate maskbit of int
     * @param type int
     * @return dotted
     */
    private function ___IPv4_int_dotquadA($n) {

        $k = pow(2, 32) - pow(2, 32 - $n);

        return $this->___IPv4_dotquadA_to_intA($k);
    }

    /**
     * Calculate int value of ipv4 address
     * @param type $addr 192.168.8.3
     * @return Integer
     */
    private function ___IPv4_dotquadA_to_intA($addr) {

        $split = explode('.', $addr, 4);


        $myInt = (
                (int) ( $split[0]) * 16777216 /* 2^24 */
                + (int) ( $split[1]) * 65536 /* 2^16 */
                + (int) ( $split[2]) * 256 /* 2^8  */
                + (int) ( $split[3])
                );
        return $myInt;
    }

    /**
     * Number of host in subnet
     * @return Integer 
     */
    private function ___IPv4_Hosts() {

        return pow(2, (32 - $this->_maskbit));
    }

    /*
     * Summary of all data 
     * @return Array
     */

    public function get() {
        return array(
            'subnet' => $this->_subnet,
            'mask' => $this->_maskbit,
            'from' => $this->_intAddrFrom,
            'to' => $this->_intAddrTo,
            'hosts' => $this->_numberOfHosts,
            'network' => $this->_network
                //'binmask'=>$this->binmask
        );
    }

}

?>
