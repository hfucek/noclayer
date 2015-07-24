<?php
/**
 * 
 * Model for modules  ...
 * @author hrvoje
 *
 *
 */
class Modules extends Orm\Observer{

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

    public function shared($model,$function){
          
        
        $manifest=new \Manifestreader();
        
        $modules=$manifest->getDataKey('modules');
        foreach($modules as $modul){
            $method_name=  str_replace('Model_','',get_class($model));
            $method=explode('\\',$method_name);
            
            
            $module_method=array_pop($method);
            $module_observer='\\'.ucfirst($modul).'\\Observer::'.$module_method;
            $module_class='\\'.ucfirst($modul).'\\Observer';
            
            
             
            $loaded = \Fuel\Core\Module::loaded($modul);
            if(!$loaded)
             \Fuel\Core\Module::load($modul);
            
            if (class_exists($module_class)) {
            if(method_exists ($module_class,$module_method)){
           
                call_user_func($module_observer,$model,$function);
            
            
            }}
            
            
        }
        
    }
    
    public function after_insert($model)
    {
        $this->shared($model, 'after_insert');
    }
    
    public function after_save($model)
    {
        
        
        $this->shared($model, 'after_save');
    }
    
      public function before_save($model)
    {
        
        
        $this->shared($model, 'before_save');
    }
   
       public function before_update($model)
    {
        
        
        $this->shared($model, 'before_update');
    }
    
    public function before_delete($model)
    {
        
        $this->shared($model, 'before_delete');

    }
    
}