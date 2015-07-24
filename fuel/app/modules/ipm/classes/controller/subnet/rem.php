<?php

namespace Ipm;

class Controller_Subnet_Rem extends Controller_Subnet {

    public function before() {
        parent::before();
    }
    
   
    public function action_index() {
    
         $val = \Validation::forge('data');
            $val->add_field('name', 'subnet name', 'required|min_length[1]|max_length[50]');
            
            if ($val->run()) {
                
                
           $out=Array(); 
        
        if ($this->type >= 0) {

/***
 * 'subnet'=>$this->_subnet,
            'mask'=>$this->_maskbit,
            'from'=>$this->_intAddrFrom,
            'to'=>$this->_intAddrTo,
            'hosts'=>$this->_numberOfHosts,
            'network'=>$this->_network
 */
    
            
            
                $sub=  Model_Subnet::find()->where('subnet',$val->validated('name'))->get_one();
                if($sub){
                    $sub->delete();
                
                    
                    switch($this->type)
                    {
                     case 0:
                    //get all 
                    $data=$this->get_ip_usage('all',true);
                    break;

                case 1:
                case 2:
                    //get subnodes
                    $data=$this->get_ip_usage($sub->parent,true);
                    break;

                //subnets    
                case 3:
                    
                     $data=$this->get_ip_usage($sub->parent,true);
                    break;
                    }
                    
                     
                    $out=Array('status'=>'ok','data'=>$data);
                    
                }else{
                    $out=Array('status'=>'no');
                }
                
                echo json_encode($out);
                
                
            }
            
        
    }}
    
    
    
    
    }