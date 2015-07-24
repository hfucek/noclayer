<?php

namespace Ipm;

class Controller_Subnet_Update extends Controller_Subnet {

    public function before() {
        parent::before();
    }
    
   
    public function action_index() {
    
         $val = \Validation::forge('data');
            $val->add_field('name', 'subnet name', 'required|min_length[1]|max_length[50]');
            $val->add_field('old', 'subnet old name', 'required|min_length[1]|max_length[50]');
            if ($val->run()) {
                
                
           $out=Array(); 
        
        if ($this->type >= 0) {
            
            
            $sub= \Ipm\Model_Subnet::find()->where('subnet',$val->validated('old'))->get_one();

            
                $ip= new Ipv4($val->validated('name'));
                
                
            
/***
 * 'subnet'=>$this->_subnet,
            'mask'=>$this->_maskbit,
            'from'=>$this->_intAddrFrom,
            'to'=>$this->_intAddrTo,
            'hosts'=>$this->_numberOfHosts,
            'network'=>$this->_network
 */
            
            
            /*
    
            if($this->type==2 or $this->type==1) {
            
                $ip= new Ipv4($val->validated('old'));
                
                 $ip2= new Ipv4($val->validated('name'));
                
                 $ipdata=$ip->get();
                //check if subnet already exist
                //$sub=  Model_Subnet::find()->where('range_from','<',$ip['from'])->where('range_from','<',$ip[''])->get();
                $from=$ipdata['from'];
                $to=$ipdata['to'];
                $query=\DB::query('select * from ipm_subnet where 
                    (range_from>='.$from.' and range_from<='.$to.') 
                    or 
                    (range_to>='.$from.' and range_to<='.$to.') 
                    or
                    (range_from>='.$from.' and range_to<='.$to.') 
                    
');
                
                $sub=$query->execute();
     
                $m=false;
                foreach($sub as $s){
                  $error=$s;
                    
                $m=true;    
                }
                
                
                if(!$m){
                    $data=Array(
                      'subnet'=>$ipdata['subnet'],
                      'alias'=>'',
                      'description'=>'',
                      'size'=>$ipdata['hosts'],
                      'mask' =>$ipdata['mask'],
                      'type' =>0,
                      'vlan' =>0,
                      'parent' =>$this->id,
                      'meta_update_user'=>$this->user ,
                      'range_from'=>$ipdata['from'],
                       'range_to'=>$ipdata['to']
                    );
                    
                    $sub=new Model_Subnet($data);
                    $sub->save();
                    
                      $data=$this->get_ip_usage($this->id,true);
                    
                    echo json_encode(array('id'=>$sub->id,'subnet'=>$sub->subnet,'status'=>'valid','data'=>$data)); 
                }else{
                    echo json_encode(array('status'=>'taken','err'=>$error));
                }
                
            }
            */
            }
        
    }}
    
    
    
    
    }