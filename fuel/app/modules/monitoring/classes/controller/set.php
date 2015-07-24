<?php

namespace Monitoring;

use Orm\Model;

class Controller_Set extends Monitoring {

    public function action_index() {

        if ($_POST) {


            $val = \Validation::forge();
            $val->add_field('action', 'Action', 'required|min_length[1]|max_length[20]');
            $val->add_field('value', 'Value', 'required|min_length[1]|max_length[20]');

            if ($val->run()) {

                $monitorSettings = Model_Data::find()->where('meta_update_user', $this->user)->get_one();
                $monitorSettings[$val->validated('action')] = $val->validated('value');
                $monitorSettings->save();
            }
        }
    }

}

