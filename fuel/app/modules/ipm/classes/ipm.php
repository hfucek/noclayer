<?php

namespace Ipm;

Class Ipm extends \Controller_Login {

    public function get_used($subnet, $count = false) {

        $ipv4 = new Ipv4($subnet);

        $data = $ipv4->get();

        $query = \Basic\Model_Network_Ip::find()->where('addrint', '>=', 1)->where('addrint', '>=', $data['from'])->where('addrint', '<=', $data['to'])->order_by('addrint', 'asc');

        if ($count) {
            return $query->count();
        }
        return $query->get();
    }

    public function before() {

        parent::before();
        $this->_module_Check(2);
        \Fuel\Core\Module::load('basic');
    }

    public function action_index() {
        
    }

}

