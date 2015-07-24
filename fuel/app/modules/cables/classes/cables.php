<?php

namespace Cables;

Class Cables extends \Controller_Login {

    public function before() {
        parent::before();
        $this->_module_Check(2);
    }

    public function action_index() {
        
    }

}