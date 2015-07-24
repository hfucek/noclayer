<?php

namespace Graphing;

use Cacti\Cacti;
use Munin\Munin;

class Controller_Munin extends Graphing {

    public function action_data() {
        $out = array('stat' => 'ok', 'data' => Array());
        $val = \Validation::forge();
        $val->add_field('did', 'Action', 'required|min_length[1]|max_length[20]');

        if ($val->run()) {



            $mundata = Model_Munin::query()->where('deviceID', $val->validated('did'))->get_one();

            if ($mundata) {

                $out['data'] = Array(
                    'id' => $mundata->id,
                    'url' => $mundata->url,
                    'user' => $mundata->user,
                    'pass' => $mundata->pass
                );
            }

            echo json_encode($out);
        }
    }

    public function action_get($name, $did, $time) {

        if ($name and $did and $time) {
            ob_start();
            $mundata = Model_Munin::query()->where('deviceID', $did)->get_one();
            if ($mundata) {


                $auth = ($mundata->pass != '') ? 1 : 0;

                $munin = new \Munin($mundata->url, $auth);

                if ($auth > 0)
                    $munin->authentication($mundata->user, $mundata->pass);

                $graph = $munin->plotgraph($name, $time);
                ob_end_clean();
                header('Content-Type: image/png');
                echo $graph['ret'];
            }
        }
    }

    public function action_rem() {

        $out = array('stat' => 'no');
        $val = \Validation::forge();
        $val->add_field('dev', 'Action', 'required|min_length[1]|max_length[20]');

        if ($val->run()) {



            $mundata = Model_Munin::query()->where('deviceID', $val->validated('dev'))->get_one();

            if ($mundata) {

                $mundata->delete();
                $out['stat']='ok';
            }

            echo json_encode($out);
        }
    }
    
    
      public function action_update() {
        $out = array('stat' => 'ok', 'data' => Array());
        $val = \Validation::forge();
        $val->add_field('did', 'Action', 'required|min_length[1]|max_length[20]');

        if ($val->run()) {



            $mundata = Model_Munin::query()->where('deviceID', $val->validated('did'))->get_one();

            if ($mundata) {

                $out['data'] = Array(
                    'id' => $mundata->id,
                    'url' => $mundata->url,
                    'user' => $mundata->user,
                    'pass' => $mundata->pass
                );
            }

            echo json_encode($out);
        }
    }

}

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
?>
