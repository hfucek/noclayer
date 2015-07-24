<?php

namespace Basic;

class Controller_Kvm extends Basic {

    public function isKVM() {

        if (!$this->tmpl)
            $what = $this->field->device->cat; else
            $what = $this->field->template->categoryID;


        switch ($what) {
            case 6:
                return true;
                break;
            default:
                return false;
                break;
        }
    }

    public function before() {

        parent::before();

        if ($_POST) {

            $val = \Validation::forge('kvm');
            $val->add_field('eid', 'template id', 'required|min_length[1]|max_length[20]');
            $val->add_field('tmpl', 'template or realdevice', 'required|min_length[1]|max_length[20]');

            if ($val->run()) {

                if ($val->validated('tmpl') == "true") {
                    $this->tmpl = true;
                    $this->field = Model_Device_Template_Field::find($val->validated('eid'));
                    //$this->TempsetTypeOfDevice();
                } else {

                    $this->tmpl = false;
                    $this->field = Model_Device_Fieldset::find($val->validated('eid'));
                    //$this->setTypeOfDevice();
                }
            }
        }
    }

}