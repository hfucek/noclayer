<?php

namespace Ipm;

class Controller_Node extends Ipm {

    public function before() {
        parent::before();

        \Fuel\Core\Module::load('basic');

        if ($_POST) {
            $val = \Validation::forge();
            $val->add_field('type', 'branch type', 'max_length[20]');
            $val->add_field('id', 'subnet id', 'required|min_length[1]|max_length[20]');


            if ($val->run()) {
                $this->type = $val->validated('type');
                $this->id = $val->validated('id');
            }
        }
    }

}