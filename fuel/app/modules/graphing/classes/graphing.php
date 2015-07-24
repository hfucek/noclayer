<?php

namespace Graphing;

Class Graphing extends \Controller_Login {

    public function before() {
        parent::before();
        $this->_module_Check(2);
        \Fuel\Core\Package::load('cacti');
        \Fuel\Core\Package::load('munin');

        \Fuel\Core\Module::load('basic');
    }

    public function action_index() {
        
    }

}