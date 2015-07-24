<?php

namespace Debugger;

class Controller_Set extends Debugger {

    public function before() {
        parent::before();
    }

    public function action_index() {
        
        if ($_POST) {
            
            $val = \Validation::forge();
            $val->add_field('act', 'New/Update', 'required|min_length[1]|max_length[20]');
            $val->add_field('cat', 'Category', 'required|min_length[1]|max_length[20]');
            
            if ($val->run()) {
                
                $data = array(
                    'group' => array(),
                    'test' => array(),
                    'record' => array(),
                    'check' => array()
                );

                $cat = $val->validated('cat');
                $action = $val->validated('act');
               
                $id = \Input::post('id');
                $gid = \Input::post('gid');
                $tid = \Input::post('tid');
                
                switch ($cat) {

                    case 'group':

                        if ($action == 'new') {
                            $props = Array(
                                'name' => \Input::post('name'),
                                'description' => \Input::post('desc'),
                                'meta_update_time' => time(),
                                'meta_update_user' => $this->user
                            );
                            $group = new \Debugger\Model_Group($props);
                            $group->save();
                            
                        } else {
                            
                            $group = \Debugger\Model_Group::find($id);
                            $group->name = \Input::post('name');
                            $group->description = \Input::post('desc');
                            $group->meta_update_time = time();
                            $group->save();
                        }

                        array_push($data['group'], array(
                            'id' => $group->id,
                            'name' => $group->name,
                            'desc' => $group->description,
                            'priority' => \Input::post('priority')
                        ));
                        break;

                        
                    case 'test':
                        
                        if ($action == 'new') {
                            $props = Array(
                                'name' => \Input::post('name'),
                                'description' => \Input::post('desc'),
                                'group_id' => $gid,
                                'priority' => \Input::post('priority'),
                                'meta_update_time' => time(),
                                'meta_update_user' => $this->user
                            );
                            $test = new \Debugger\Model_Test($props);
                            $test->save();
                            
                        } else {
                            $test = \Debugger\Model_Test::find($id);
                            $test->name = \Input::post('name');
                            $test->description = \Input::post('desc');
                            $test->group_id = $gid;
                            $test->priority = \Input::post('priority');
                            $test->meta_update_time = time();
                            $test->save();
                        }

                        array_push($data['test'], array(
                            'id' => $test->id,
                            'name' => $test->name,
                            'description' => $test->description,
                            'priority' => $test->priority,
                            'group_id' => $test->group_id
                        ));
                        break;
                        
                        
                    case 'record':
                        
                        if ($action == 'new') {
                            $props = Array(
                                'type' => \Input::post('type'),
                                'action' => \Input::post('action'),
                                'object' => \Input::post('object'),
                                'test_id' => $tid,
                                'meta_update_time' => time(),
                                'meta_update_user' => $this->user
                            );

                            $record = new \Debugger\Model_Record($props);
                            $record->save();
                            
                        } else {
                            $record = \Debugger\Model_Record::find($id);
                            $record->type = \Input::post('type');
                            $record->action = \Input::post('action');
                            $record->object = \Input::post('object');
                            $record->test_id = $tid;
                            $record->meta_update_time = time();
                            $record->save();
                        }

                        array_push($data['record'], array(
                            'id' => $record->id,
                            'test_id' => $record->test_id,
                            'type' => $record->type,
                            'action' => $record->action,
                            'object' => $record->object
                        ));
                        break;
                        
                        
                   case 'check':

                        if ($action == 'new') {
                            $props = Array(
                                'test_id' => $tid,
                                'time_taken' => \Input::post('tt'),
                                'cpu' => \Input::post('cpu'),
                                'ram' => \Input::post('ram'),
                                'meta_update_time' => time(),
                                'meta_update_user' => $this->user
                            );

                            $check = new \Debugger\Model_Check($props);
                            $check->save();
                        } else {
                            
                            $check = \Debugger\Model_Check::find($id);
                            $check->test_id = $tid;
                            $check->time_taken = \Input::post('tt');
                            $check->cpu = \Input::post('cpu');
                            $check->ram = \Input::post('ram');
                            $check->meta_update_time = time();
                            $check->save();
                        }

                        array_push($data['check'], array(
                            'time_taken' => $check->time_taken,
                            'test_id' => $check->test_id,
                            'ram' => $check->ram,
                            'cpu' => $check->cpu
                        ));

                        break;
                }
                
                echo json_encode(array_merge($data, $this->getData()));
            }
        }
    }

    public function getData() {

        $data = array(
            'data' => array()
        );

        // get groups
        $groups = \Debugger\Model_Group::find()->get();
        foreach ($groups as $group) {
            
            $group_data = array(
                'id' => $group['id'],
                'name' => $group['name'],
                'description' => $group['description'],
                'tests' => array()
            );
            
            // get tests
            $tests = \Debugger\Model_Test::find()->where('group_id', $group->id)->get();
            foreach ($tests as $test) {
                
                $test_data = array(
                    'id' => $test->id,
                    'name' => $test->name,
                    'description' => $test->description,
                    'group_id' => $test->group_id,
                    'records' => array()
                );
                
                // get records
                $records = \Debugger\Model_Record::find()->where('test_id', $test->id)->get();
                foreach ($records as $record) {

                    array_push($test_data['records'], array(
                        'id' => $record->id,
                        'type' => $record->type,
                        'object' => $record->object,
                        'action' => $record->action,
                        'test_id' => $record->test_id
                    ));
                }
                
                array_push($group_data['tests'], $test_data);
            }
            
            array_push($data['data'], $group_data);
        }
        
        return $data;
    }

}

?>