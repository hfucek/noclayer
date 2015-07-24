<?php

namespace Graphing;

use Nagios\Nagios;
use Orm\Model;

class Controller_Add extends Graphing {

    public function action_index() {

        if ($_POST) {
            $dev='';

            $val = \Validation::forge();
            $val->add_field('type', 'Action', 'required|min_length[1]|max_length[20]');
            $val->add_field('url', 'Value', 'required|min_length[1]');
            $val->add_field('usr', 'Value', 'max_length[200]');
            $val->add_field('pwd', 'Value', 'max_length[200]');
            $val->add_field('auth', 'Value', 'max_length[200]');
            $val->add_field('dev', 'Value', 'max_length[200]');
            $id = false;

            if ($val->run()) {
                switch ($val->validated('type')) {
                    case 1:
                        $name = 'Cacti';
                        $cacti = new \Cacti($val->validated('url'));
                        //$cacti->authentication();

                        $code = $cacti->testConnection($val->validated('usr'), $val->validated('pwd'));

                        if ($code == 200) {
                            $graph = Model_Source::find()->where('content', $val->validated('url'))->where('meta_update_user', $this->user)->get_one();

                            if (!$graph) {

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
                        break;
                    case 2:
                        $name = 'Munin';
                        $munin = new \Munin($val->validated('url'), $val->validated('auth'));
                        $code = $munin->testConnection($val->validated('usr'), $val->validated('pwd'));
                        if ($code == 200) {

                            $graph = Model_Munin::query()->where('url', $val->validated('url'))->where('deviceID', $val->validated('dev'))->where('meta_update_user', $this->user)->get_one();

                            if (!$graph) {
                                $q = Array(
                                    'deviceID' => $val->validated('dev'),
                                    'user' => $val->validated('usr'),
                                    'pass' => $val->validated('pwd'),
                                    'url' => $val->validated('url'),
                                    'meta_update_user' => $this->user
                                );
                                $dev= $val->validated('dev');
                                $source = new Model_Munin($q);
                                $source->save();
                                $id = $source->id;
                                $code = 'ok';
                            } else {
                                $code = 'no';
                            }
                        }

                        break;
                }


                echo json_encode(array('code' => $code, 'data' => array('id' => $id,'dev'=>$dev, 'name' => $name, 'content' => $val->validated('url'))));
            }
        }
    }

}

