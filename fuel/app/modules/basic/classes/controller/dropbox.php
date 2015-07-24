<?php

namespace Basic;

class Controller_Dropbox extends Basic {

    public function before() {
        parent::before();
    }

    public function action_data() {
        $val = \Validation::forge();
        $val->add_field('eid', 'Device id', 'required|min_length[1]|max_length[20]');
        $val->add_field('val', 'Device id', 'required|min_length[0]|max_length[250]');


        if ($val->run()) {
            $field = Model_DeviceFieldset::find($val->validated('eid'));

            if ($field) {


                $data = Model_DeviceFieldset::find()->where('name', $field->name)->where('value_lc', 'LIKE', strtolower($val->validated('val')) . '%')->get();

                $a = Array();

                foreach ($data as $element) {

                    $el = array('name' => $element->value);

                    array_push($a, $el);
                }

                echo json_encode($a);
            }
        }
    }

}

?>