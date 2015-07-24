<?php

namespace Debugger;

Class Debugger extends \Controller_Login {

    public function before() {
        parent::before();
        $this->_module_Check(1);
    }

    public function action_index() {
        
    }
}
