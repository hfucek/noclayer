<?php

namespace Basic;

class Controller_Rack extends Basic {

    public function before() {

        parent::before();
    }

    public function action_remove() {

        $out = Array();
        $out['stat'] = false;
        if ($_POST) {

            $val = \Validation::forge('rack');
            $val->add_field('rid', 'rack id', 'required|min_length[1]|max_length[20]');

            if ($val->run()) {

                $rack = Model_Rack::find($val->validated('rid'));
                if ($rack) {
                    $devices = $rack->device;
                    //delete devices
                    foreach ($devices as $dev) {


                        //remove cables
                        $cables = Model_Cable::find()->where('dev1', $dev->id)->or_where('dev2', $dev->id)->get();

                        foreach ($cables as $cab)
                            $cab->delete();

                        //get all device field and delete him
                        $dev_fields = Model_Device_Fieldset::find()->where('deviceID', $dev->id)->get();

                       
                        //we must go with foreach becouse image deleting from hdd
                        foreach ($dev_fields as $dev_field)
                            $dev_field->delete();


                        $dev->delete();
                    }
                    
                    //shift room position
                    $ord=$rack->room_pos;
                    $room=$rack->room;
                    
                    //delete rack
                    $rack->delete();
                    $out['stat'] = true;
                    
                    //set room_pos-- on racks with larger room_pos
                    $racks=Model_Rack::find()->where('room', $room)->where('room_pos','>',$ord)->get();
                    foreach($racks as $rack) {
                        $rack->room_pos-=1;
                        $rack->save();
                    }
                }
            }
        }


        echo json_encode($out);
    }

}

?>