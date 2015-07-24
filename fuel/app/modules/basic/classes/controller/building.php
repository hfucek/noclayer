<?php

namespace Basic;

class Controller_Building extends Basic {

    public function before() {

        parent::before();
    }

    private function gettype($val) {



        $types = Array('root', 'building', 'floor', 'room');

        return array_search($val, $types);
    }

    /**
     * 
     * Building tree
     */
    public function action_index() {
        if ($_POST) {




            $val = \Validation::forge();
            $val->add_field('id', 'node id', 'required|min_length[1]|max_length[20]');
            $val->add_field('rel', 'node type', 'required|min_length[1]|max_length[20]');
            if ($val->run()) {

                switch ($this->gettype($val->validated('rel'))) {

                    //root
                    case 0:

                        $data['buildings'] = Model_Building::find()->where('meta_update_user', $this->user)->get();
                        return \Response::forge(\View::forge('tree/building', $data));
                        break;

                    //building
                    case 1:
                        $building = Model_Building::find($val->validated('id'));
                        $data['floors'] = $building->floor;
                        return \Response::forge(\View::forge('tree/floor', $data));

                        break;
                    //floor
                    case 2:

                        $floor = Model_Floor::find($val->validated('id'));
                        $data['rooms'] = $floor->room;
                        return \Response::forge(\View::forge('tree/room', $data));


                        break;

                    //room
                    case 3:
                        echo '{:P}';
                        break;
                }




                //echo $val->validated('id');
            }
        }
    }

    /**
     *
     * Building Frontend rename conntroler
     */
    public function action_rename() {
        $val = \Validation::forge();
        $val->add_field('id', 'node id', 'required|min_length[1]|max_length[20]');
        $val->add_field('title', 'node title', 'required|min_length[1]|max_length[20]');
        $val->add_field('type', 'node type', 'required|min_length[1]|max_length[20]');
        if ($val->run()) {

            //rename building
            if ($val->validated('type') == 'building')
                $ren = Model_Building::find($val->validated('id'));


            //rename floor
            if ($val->validated('type') == 'floor')
                $ren = Model_Floor::find($val->validated('id'));


            //rename room
            if ($val->validated('type') == 'room')
                $ren = Model_Room::find($val->validated('id'));




            if ($ren) {
                $ren->name = $val->validated('title');
                $status = $ren->save();
            }


            $a = Array(
                "status" => $status
            );

            echo json_encode($a);
        }
    }

    /**
     * 
     * Building Frontend create conntroler 
     */
    public function action_create() {
        $val = \Validation::forge();
        $val->add_field('id', 'node id', 'required|min_length[1]|max_length[20]');
        $val->add_field('position', 'node position', 'required|min_length[1]|max_length[20]');
        $val->add_field('title', 'node title', 'required|min_length[1]|max_length[20]');
        $val->add_field('type', 'node type', 'required|min_length[1]|max_length[20]');
        if ($val->run()) {

            //new building add	
            if ($val->validated('type') == 'building') {

                $props = Array(
                    'name' => $val->validated('title'),
                    'meta_update_time' => time(),
                    'meta_update_user' => $this->user
                );

                $new = new Model_Building($props);
            }

            //new floor add
            if ($val->validated('type') == 'floor') {

                $props = Array(
                    'name' => $val->validated('title'),
                    'building' => $val->validated('id'),
                    'meta_update_time' => time(),
                    'meta_update_user' => $this->user
                );

                $new = new Model_Floor($props);
            }

            //new room add 
            if ($val->validated('type') == 'room') {

                $props = Array(
                    'name' => $val->validated('title'),
                    'floor' => $val->validated('id'),
                    'meta_update_time' => time(),
                    'meta_update_user' => $this->user
                );

                $new = new Model_Room($props);
            }

            $status = $new->save();

            $a = Array(
                "id" => $val->validated('type') . '_' . $new->id,
                "status" => $status
            );

            echo json_encode($a);
        }
    }

    /**
     * Frontend delete controller
     */
    public function action_remove() {
        $val = \Validation::forge();
        $val->add_field('id', 'node id', 'required|min_length[1]|max_length[20]');
        $val->add_field('type', 'node type', 'required|min_length[1]|max_length[20]');
        if ($val->run()) {

            //remove building
            if ($val->validated('type') == 'building')
                $ren = Model_Building::find($val->validated('id'));


            //remove floor
            if ($val->validated('type') == 'floor')
                $ren = Model_Floor::find($val->validated('id'));


            //remove room
            if ($val->validated('type') == 'room')
                $ren = Model_Room::find($val->validated('id'));



            $stat = $ren->delete();


            $a = Array(
                "status" => $stat
            );

            echo json_encode($a);
        }
    }

}