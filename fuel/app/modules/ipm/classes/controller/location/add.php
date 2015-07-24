<?php

namespace Ipm;

class Controller_Location_Add extends Controller_Location {

    private function significantData($data){
        $m=count($data);
        
        for($i=0;$i<$m;$i++){
            if((int)$data[$i]==0) return $i;
        }
        
    }
    
    private function checkForInhert($data){
     
    
      
      
      //check if data already exist
      
     
      
      $vars=Array('building','floor','room','rack','pos_from','pos_to');
      
     
      $b=$data[0];
      $f=$data[1];
      $ro=$data[2];
      $ra=$data[3];
      
           for($i=0;$i<4;$i++){
               if($data[$i]=='all'){
                   
                   $v=$i-1;
                     $loc= Model_Location::find()->where('node',$this->name)->where($vars[$v],$data[$v])->get_one();
                     if($loc['id']!=''){
                         return array('v'=>$v,'i'=>$i,'base'=>$vars[$v],'val'=>$data[$i],'stat'=>false,'data'=>$data);                
                     }
                         
               }
               
           }
      
      
      $locs= Model_Location::find()->where('node',$this->name)->get();
      
      $taken=Array();
      foreach ($locs as $loc){
           for($i=0;$i<4;$i++){
               
               
               if($loc[$vars[$i]]==0){
                   $p=$i-1;
                   $inbase=$loc[$vars[$p]];
                   $insert=$data[$p];
                   if($inbase==$insert){
                       return array('base'=>$inbase,'stat'=>false,'data'=>$data);                
                       
                   }
                   
               } 
               
           }
           
           if($loc['rack']==$data[3]){
                       if($loc['pos_from']<=$data[5] && $loc['pos_from']>=$data[4])
               return array('base'=>'pos_from','stat'=>false,'data'=>$data); 
                       
                       if($loc['pos_to']<=$data[5] && $loc['pos_to']>=$data[4])
               return array('base'=>'pos_to','stat'=>false,'data'=>$data); 
                       
                       if($loc['pos_to']<=$data[5] && $loc['pos_from']>=$data[4])
               return array('base'=>'pos_iner','stat'=>false,'data'=>$data); 
                       
                       if($loc['pos_to']>=$data[5] && $loc['pos_from']<=$data[4])
               return array('base'=>'pos_iner','stat'=>false,'data'=>$data); 
               
           }
           
           
          
      }
      
      return array('stat'=>true,'data'=>$data);                

          
    }
    

    public function action_index() {
if($this->id){
    
 $val2 = \Validation::forge('data');
            $val2->add_field('name', 'subnet name', 'required|min_length[1]|max_length[50]');
            
            if ($val2->run()) {
                
    $this->name=$val2->validated('name');
    $data=\Input::post('data');
    
    $m=explode(',',$data);
    
    $stat=$this->checkForInhert($m);
    
                
    if($stat['stat']){
               $in= array(
		'node'=>$this->name,
		'type'=>0,
                'building'=>$m[0],
                'floor'=>$m[1],
                'room'=>$m[2],
                'rack'=>$m[3],
                'pos_from'=>$m[4],
                'pos_to'=>$m[5]
                );
    
               $location=new Model_Location($in);
               
               $location->save();
    
               
      $o=$this->structure();
      
      
        echo json_encode(array('stat'=>$stat,'data'=>$o));
      
               
    }else{
          echo json_encode(array('stat'=>$stat));
    }
       
}
        
}
        
    
    }
}

?>
