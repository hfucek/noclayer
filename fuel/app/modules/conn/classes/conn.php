<?php

namespace Conn;

Class Conn extends \Controller_Login {

    public function before() {
        parent::before();
        $this->_module_Check(3);
    }

    public function action_index() {
        
    }

}