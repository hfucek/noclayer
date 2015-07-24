<?php

namespace Debugger;

class Controller_Get extends Debugger {

    public function before() {
        parent::before();
    }

    public function action_index() {

        \Fuel\Core\Module::load('basic');

        $val = \Validation::forge();
        $val->add_field('cat', 'Category', 'required|min_length[1]|max_length[20]');
        $id = \Input::post('id');

        $data = array(
            'data' => array(),
            'group' => array(),
            'test' => array(),
            'record' => array()
        );

        if ($val->run()) {

            switch ($val->validated('cat')) {

                case 'group':

                    // get groups
                    $group = \Debugger\Model_Group::find($id);
                    
                    $group_data = array(
                        'id' => $group->id,
                        'name' => $group->name,
                        'description' => $group->description,
                        'tests' => array()
                    );

                    array_push($data['group'], $group_data);

                    break;

                case 'test':

                    // get tests
                    $test = \Debugger\Model_Test::find($id);

                    $test_data = array(
                        'id' => $test->id,
                        'name' => $test->name,
                        'description' => $test->description,
                        'group_id' => $test->group_id,
                        'priority' => $test->priority,
                        'records' => array()
                    );

                    array_push($data['test'], $test_data);

                    break;

                case 'record':

                    // get records
                    $records = \Debugger\Model_Record::find($id);

                    $record_data = array(
                        'id' => $record->id,
                        'type' => $record->type,
                        'object' => $record->object,
                        'action' => $record->action,
                        'test_id' => $record->test_id
                    );

                    array_push($data['record'], $record_data);

                    break;

                case 'all':

                    // get groups
                    $groups = \Debugger\Model_Group::find()->get();
                    foreach ($groups as $group) {

                        $group_data = array(
                            'id' => $group->id,
                            'name' => $group->name,
                            'description' => $group->description,
                            'tests' => array()
                        );

                        // get tests
                        $tests = \Debugger\Model_Test::find()->where('group_id', $group->id)->get();
                        foreach ($tests as $test) {

                            $test_data = array(
                                'id' => $test->id,
                                'name' => $test->name,
                                'description' => $test->description,
                                'priority' => $test->priority,
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

                    break;
            }
        }

        echo json_encode($data);
    }

    public function action_checks() {

        $data = array(
            'checks' => array()
        );
        
        $mem = $this->action_mem();
        $checks = \Debugger\Model_Check::find('all');
        
        foreach ($checks as $check) {
            
            $test = \Debugger\Model_Test::find($check->test_id);
            
            array_push($data['checks'], array(
                'id' => $check->id,
                'test_id' => $check->test_id,
                'test_name' => $test->name,
                'time_taken' => $check->time_taken,
                'cpu' => $check->cpu,
                'ram' => $check->ram,
                'status' => $check->status,
                'totram' => $mem['total']  
            ));
        }
        
        echo json_encode($data);
    }
    
    public function action_mem() {
        
        $data = explode("\n", file_get_contents("/proc/meminfo"));
        $meminfo = array();
        
        $total = filter_var($data[0], FILTER_SANITIZE_NUMBER_INT);
        
        return array(
            'total' => $total / 1024 / 8
        );
    }
}
