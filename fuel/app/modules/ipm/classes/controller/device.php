<?php

namespace Ipm;

class Controller_Device extends Ipm {

    public function before() {

        parent::before();

        \Fuel\Core\Module::load('basic');

        if ($_POST) {
            $val = \Validation::forge();

            $val->add_field('id', 'subnet id', 'required|min_length[1]|max_length[20]');


            if ($val->run()) {
                $this->id = $val->validated('id');
            }
        }
    }

}