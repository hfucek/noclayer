<?php

namespace Monitoring;

Class Monitoring extends \Controller_Login {

    public function before() {
        parent::before();
        $this->_module_Check(2);
        \Fuel\Core\Package::load('nagios');
    }

    public function action_index() {
        
    }

}