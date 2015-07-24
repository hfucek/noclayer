<?php

namespace Debugger;

class Controller_Tree extends Debugger {

    public function before() {

        parent::before();
    }

    private function gettype($val) {



        $types = Array('root', 'group', 'test', 'record');

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

                    //room
                    case 0:

                        $data['groups'] = Model_Group::find()->where('meta_update_user', $this->user)->get();
                        return \Response::forge(\View::forge('tree/group', $data));
                        break;

                    //group
                    case 1:
                        
                        $tests = Model_Test::find()->where('group_id',$val->validated('id'))->get();
                        $data['tests'] = $tests;
                        return \Response::forge(\View::forge('tree/test', $data));
                        break;
                    
                    //test
                    case 2:

                        $records = Model_Record::find()->where('test_id',$val->validated('id'))->get();
                        $data['records'] = $records;
                        return \Response::forge(\View::forge('tree/record', $data));
                        break;

                    //record
                    case 3:
                        
                        echo '{:P}';
                        break;
                }




                //echo $val->validated('id');
            }
        }
    }
}