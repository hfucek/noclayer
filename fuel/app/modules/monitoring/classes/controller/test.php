<?php

namespace Monitoring;

use Nagios\Nagios;
use Orm\Model;

class Controller_Test extends Monitoring {

    public function action_index() {

        if ($_POST) {


            $val = \Validation::forge();
            $val->add_field('type', 'Action', 'required|min_length[1]|max_length[20]');
            $val->add_field('url', 'Value', 'required|min_length[1]');
            $val->add_field('usr', 'Value', 'max_length[200]');
            $val->add_field('pwd', 'Value', 'max_length[200]');

            if ($val->run()) {

                $nagios = new \Nagios($val->validated('url'));
                $nagios->auth($val->validated('usr'), $val->validated('pwd'));

                $code = $nagios->testConnection();

                echo json_encode(array('code' => $code));
            }
        }
    }

}

