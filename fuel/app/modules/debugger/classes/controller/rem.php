<?php

namespace Debugger;

class Controller_Rem extends Debugger {

    public function before() {
        parent::before();
    }

    public function action_index() {
        
        if ($_POST) {
            
            $val = \Validation::forge();
            $val->add_field('id', 'Object id', 'required|min_length[1]|max_length[20]');
            $val->add_field('cat', 'Category', 'required|min_length[1]|max_length[20]');
            
            if ($val->run()) {
                
                $data = array(
                    'group' => array(),
                    'test' => array(),
                    'record' => array()
                );
                
                $cat = $val->validated('cat');
                $id = $val->validated('id');

                switch($cat) {
                    
                    case 'group':
                        
                        $group= \Debugger\Model_Group::find($id);
                        
                        // find and delete all test
                        $tests= \Debugger\Model_Test::find()->where('group_id', $group->id);
                        foreach($tests as $test) {
                            
                            // find and delete all records
                            $records= \Debugger\Model_Record::find()->where('test_id', $test->id);
                            foreach($records as $record) 
                                $record->delete();
                            
                            $test->delete();
                        }
                        
                        $group->delete();
                        echo json_encode(array("status" => "ok"));
                        
                        break;
                        
                       
                     case 'test':

                        $test = \Debugger\Model_Test::find($id);

                        // find and delete all records
                        $records = \Debugger\Model_Record::find()->where('test_id', $test->id);
                        foreach ($records as $record) 
                            $record->delete();
                        
                        $test->delete();
                        echo json_encode(array("status" => "ok"));
                        
                        break;
                    
                     
                     case 'record':

                        $record = \Debugger\Model_Record::find($id);
                        $record->delete();
                        
                        echo json_encode(array("status" => "ok"));
                        break;
                    
                    
                    case 'check':

                        $check = \Debugger\Model_Check::find($id);
                        $check->delete();
                        
                        echo json_encode(array("status" => "ok"));
                        break;
                }
            }
        }
    }
}

?>