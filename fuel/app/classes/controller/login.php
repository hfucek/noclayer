<?php
class Controller_Login extends Library
{
	
	
	public function check_license($path)
	{
           
		$wrong = true;
		$recheck = false;
		$licen = Licen::load();
               
		if ($licen->isLoaded())
		{
			if ($licen->isLicenseOk() || $licen->isLicenseOutOfTimeframe())
			{
				$dom =  implode(',',$licen->getDomainsArray());
				
                                $this->valid = Array(
					$licen->getDataKey('DATA','register'),
					$licen->getDataKey('DATA','key'),
					$dom,
					$licen->getDataKey('DATA','ip'),
					$licen->getDataKey('DATA','dir'),
					date('d-m-Y H:i:s',(int) $licen->getDataKey('DATA','created')),
					date('d-m-Y H:i:s',(int) $licen->getDataKey('DATA','valid')),
                                        $licen->isOfflineLicense(),
				);
				
				// Let's assume the licence has expired
				$this->valid_c = array('Red','Expired');
				
				// Read the noc version from licence
				$this->nocversion = $licen->getFromLicenceNocVersion();
				
				/** @todo remove this override of noc version **/
				//$this->nocversion='core';
				
                                //check only for root path
				if($path=='_root_' && !$licen->isOfflineLicense()){
				// If we are in a "Remind period" do recheck on the licence
				if ($licen->inRemindPeriod())
				{
					if(!isset($this->check_remote))
					{
						$recheck=\Licen::instance()->valRemote($licen->getDataKey('DATA','key'));
						if (!$recheck)
						{
							$this->valid_c=Array('Orange','Server connection problem!');
						}
						$this->check_remote=true;
					}
				}
				
                                }
				
				if($licen->isLicenseOk())
				{
					$wrong=false;
					$this->valid_c=Array('Green','Active');	
				}
			}
		}else{
                    $this->valid_c=Array('Red','Unknown');	
                    
                }
		
		if (!$recheck && $wrong && !in_array($path, array('auth/license','_root_','force')))
		{
			\Response::redirect(\Config::get('base_url').'auth/license');
		}
	}
	
	
	public function after($res)
	{
		
		if($res=='' or $res==null){
			$res=' ';
			
		}
		
		
		
		
		parent::after($res);
		
		return $res;
	}
	
	public function before()
	{
		
		$this->nocversion='none';
		
		$path=$this->request->route->path;
		
		if($path!='auth/login')
		{
			$this->check_license($path);
		}
		
		
		
		parent::before();
		
		
		
		//$auth = Auth::instance();
		
		//Auth::instance()->login('hrvoje','hajduk81');
		/*
		if(!$this->check_license())
		\Response::redirect(\Config::get('base_url').'/ajax/license');
		*/
		
		
		
		$uri_string = explode('/', Uri::string());
		
		
		if (count($uri_string)>1 and $uri_string[0] == 'auth' and $uri_string[1] == 'login')
		{
			return;
		}
		
		
		if($path!='_root_'){
		
		if (\Sentry::check())
		{
			$this->user=Sentry::user()->get('id');
			$this->username=Sentry::user()->get('username');
			return;
				
		}else{
			$this->user=false;
			$this->username='';
			
			\Response::redirect(\Config::get('base_url').'auth/login');
				
		}
		}
	
	}
	
	
	

	



	


} 