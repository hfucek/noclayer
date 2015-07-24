<?php

class Simplelog
{
        private static function isDB(){
            $up=new Upgrade();
            
            return $up->is_installed();
            
        }


        
	public static function read($logname, $default = null)
	{
            
            if(self::isDB()){
		$r =	DB::select('value')
					->from('simple_log')
					->where('name', '=', $logname)
					->execute()
		;

		if ($r->count() == 0)
		{
			return $default;
		}
		return empty($r) ? $default : unserialize($r[0]['value']);
            }
            return false;
	}
	
	public static function write($logname, $value)
	{
		
            if(self::isDB()){
            $exists = DB::select('value')->from('simple_log')->where('name','=',$logname)->execute()->count() > 0;
		if ($exists)
		{
			DB::update('simple_log')
				->set(array(
					'value' => serialize($value),
				))
				->where('name', '=', $logname)
				->execute()
			;
		} else {
			DB::insert('simple_log')
					->set(
						array(
							'name' => $logname,
							'value' => serialize($value),
						)
					)
					->execute()
				;
		}
	}}
	
}