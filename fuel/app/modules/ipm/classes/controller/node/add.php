<?php
namespace Ipm;

class Controller_Node_Add extends Controller_Node {

    
 
    public function action_index() {
        
        if($this->id){
            $val = \Validation::forge('add');
            
            $val->add_field('name', 'subnet id', 'required|min_length[1]|max_length[20]');
            
            if($this->type==0) $this->id=0;
            
            
            if ($val->run()) {
                //check if exist already
                $m=Model_Node::find()->where('name',$val->validated('name'))->where('parent',$this->id)->get();
                if(!$m){
                    
                    $q=Array(
                      'name'=>$val->validated('name'),
                      'parent'=>$this->id,
                      'meta_update_user'=>$this->user
                        
                    );
                $n=new Model_Node($q);
                $n->save();
                echo json_encode(array('id'=>$n->id,'name'=>$n->name,'status'=>'valid')); 
                    
                }else{
                    echo json_encode(array('id'=>$m->id,'name'=>$m->name,'status'=>'taken')); 
                }
                
               
            }
            
        }
    }
    
    
}
    
?>    
    
   
    