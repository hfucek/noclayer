<?php
namespace Ipm;

class Controller_Node_Rem extends Controller_Node {

    
 
    public function action_index() {
        
        if($this->id){
            $val = \Validation::forge('add');
            
            $val->add_field('name', 'subnet id', 'required|min_length[1]|max_length[20]');
            
            if($this->type==0) $this->id=0;
            
            
            if ($val->run()) {
                //check if exist already
                $m=Model_Node::find($this->id);
                if($m){
                $nodes=  \Ipm\Model_Node::find()->where('parent',$this->id)->get();
                foreach ($nodes as $n)
                    $n->delete();
                
                $m->delete();
                echo json_encode(array('status'=>'valid')); 
                    
                }else{
                    echo json_encode(array('status'=>'none')); 
                }
                
               
            }
            
        }
    }
    
    
}
    
?>    
    
   
    