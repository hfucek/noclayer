<?php

namespace Ipm;

class Controller_Location_Rem extends Controller_Location {

    public function before() {
        parent::before();
    }
    
   
    public function action_index() {
    
         $val2 = \Validation::forge('data');
            $val2->add_field('name', 'subnet name', 'required|min_length[1]|max_length[50]');
            
            if ($val2->run()) {
                
                
           $out=Array(); 
        
        if ($this->type >= 0) {

          
            
                $lo= \Ipm\Model_Location::find()->where('id',$val2->validated('name'))->get_one();
                if($lo){
                    $lo->delete();
                
                     $o=$this->structure();
                    
                    $out=Array('status'=>'ok','data'=>$o);
                    
                }else{
                    $out=Array('status'=>'no');
                }
                
                
                
                echo json_encode($out);
                
                
            }
            }
        
    }
    
    
    
    
    }