<?php

namespace Ipm;

class Controller_Location_Data extends Controller_Location {

   

    public function action_index() {
if($this->id){

    $o=$this->structure();
    
    echo json_encode($o); 
    
}
        
        
        
    
    }
}

?>
