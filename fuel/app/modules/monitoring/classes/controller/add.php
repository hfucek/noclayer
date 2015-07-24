<?php

namespace Monitoring;

use Nagios\Nagios;
use Orm\Model;

class Controller_Add extends Monitoring {

    public function action_index() {

        if ($_POST) {


            $val = \Validation::forge();
            $val->add_field('type', 'Action', 'required|min_length[1]|max_length[20]');
            $val->add_field('url', 'Value', 'required|min_length[1]');
            $val->add_field('usr', 'Value', 'max_length[200]');
            $val->add_field('pwd', 'Value', 'max_length[200]');
            $id = false;

            if ($val->run()) {

                $nagios = new \Nagios($val->validated('url'));
                $nagios->auth($val->validated('usr'), $val->validated('pwd'));

                $code = $nagios->testConnection();

                if ($code == 200) {
                    $monitor = Model_Source::find()->where('content', $val->validated('url'))->where('meta_update_user', $this->user)->get_one();

                    if (!$monitor) {

                        $q = Array(
                            'typeID' => $val->validated('type'),
                            'user' => $val->validated('usr'),
                            'pass' => $val->validated('pwd'),
                            'content' => $val->validated('url'),
                            'meta_update_time' => time(),
                            'meta_update_user' => $this->user
                        );

                        $source = new Model_Source($q);
                        $source->save();
                        $id = $source->id;
                        $code = 'ok';
                    } else {
                        $code = 'no';
                    }
                }



                echo json_encode(array('code' => $code, 'data' => array('id' => $id, 'name' => 'Nagios', 'content' => $val->validated('url'))));
            }
        }
    }

}

