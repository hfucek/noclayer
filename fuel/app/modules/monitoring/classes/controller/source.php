<?php

namespace Monitoring;

class Controller_Source extends Monitoring {

    public function action_rem() {
        if ($_POST) {


            $val = \Validation::forge();
            $val->add_field('type', 'Action', 'required|min_length[1]|max_length[20]');
            $val->add_field('url', 'Value', 'required|min_length[1]');
            if ($val->run()) {

                $monitor = Model_Source::find()->where('content', $val->validated('url'))->where('meta_update_user', $this->user)->get_one();
                if ($monitor) {

                    $monitor->delete();
                }

                echo json_encode(array('stat' => 'ok'));
            }
        }
    }

    public function action_edit() {
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

                if ($code == 200) {
                    $monitor = Model_Source::find()->where('content', $val->validated('url'))->where('meta_update_user', $this->user)->get_one();

                    if ($monitor) {


                        //$monitor->'typeID'=>$val->validated('type');
                        $monitor->user = $val->validated('usr');
                        $monitor->pass = $val->validated('pwd');
                        $monitor->content = $val->validated('url');
                        $monitor->meta_update_time = time();
                        //'meta_update_user'=>$this->user
                        //);	
                        //$source=new Model_Monitoring_Source($q);
                        $monitor->save();

                        $code = 'ok';
                    } else {
                        $code = 'no';
                    }
                }



                echo json_encode(array('code' => $code, 'data' => array('name' => 'Nagios', 'content' => $val->validated('url'))));
            }
        }
    }

    public function action_index() {



        if ($_POST) {


            $val = \Validation::forge();
            $val->add_field('id', 'Action', 'required|min_length[1]|max_length[20]');
            $val->add_field('action', 'Value', 'required|min_length[1]|max_length[20]');

            if ($val->run()) {

                $source = Model_Source::find($val->validated('id'));


                if ($val->validated('action') == 'get') {
                    $type = Model_Type::find($source->typeID);

                    $out = array(
                        'id' => $source['id'],
                        'type' => array('id' => $source->typeID, 'name' => $type->name),
                        'user' => $source['user'],
                        'pass' => $source['pass'],
                        'content' => $source['content']
                    );
                }


                if ($val->validated('action') == 'remove') {
                    
                }


                echo json_encode(array('source' => $out));
            }
        }
    }

}

