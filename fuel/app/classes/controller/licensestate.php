<?php

class Controller_Licensestate extends \Fuel\Core\Controller
{
	//3 day
	const ALERT_IN_TIME = 259200; // 60*60*24*5 = 432000    1day 86400
	/** Getter for JS of license state... To notify frontend of main data **/
	
	protected function _generateLicenseStateData()
	{
		$licen = Licen::reinstance();
		$installed = '';
		if (!$licen->isLoaded())
		{
			$installed = 'none';
		}
		elseif ($licen->getResult() == Licen::LICENSE_RESULT_TIMEFRAME_EXPIRED)
		{
			$installed = 'expired';
		}
		elseif ($licen->isLicenseOk())
		{
			$installed = 'ok';
		}
		elseif ($licen->isLicenseCorrupt())
		{
			$installed = 'corrupt';
		} else {
			$installed = 'invalid';
		}
		
		
		$data = array(
			'state' => $installed,
			'loaded' => $licen->isLoaded(),
		);
		
		$serverstate = Licen::getLastValResult();
		$data['server_available'] = $serverstate['state'];
		
		if ($licen->isLoaded())
		{
			$data['remind_period'] = $licen->inRemindPeriod();
			$data['purchuse_reminder'] = $licen->purchuseNewReminder();
			$data['purchuse_overdue'] = $licen->purchuseOverdue();
			$license = $licen->getDataKey('DATA','key');
			$hide_len = 15;
			$license = substr($license,0,strlen($license)-$hide_len).str_repeat('-',$hide_len);
			$data['license']= array(
				'key' => $license,
				'subscription' => $licen->getLicenseNameData('subscriptionMethod'),
				'version' => $licen->getLicenseNameData('versionCategory'),
			);
			
		}
		return $data;
	}
	
	public function action_index()
	{
		
		return json_encode($this->_generateLicenseStateData());
	}
	
	
	public function action_new_key()
	{
		$val = Validation::forge();
 		$val->add_field('data', 'licence data', 'required|min_length[10]|max_length[200]');
 		if($val->run())
 		{
			$key_passed = true;
 			$key = $val->validated('data');
			$reloaded = Licen::instance()->valRemote($key);
 		} else {
			$key_passed = false;
			$reloaded = false;
		}
		$_data = array('key_passed'=>$key_passed, 'reloaded'=>$reloaded);
		if ($key_passed && $reloaded)
		{
			$_data = array_merge($_data,$this->_generateLicenseStateData());
		}
		return json_encode($_data);
	}
	
	public function action_force_reload()
	{
		$licen = Licen::reinstance();
		$_data = array('key_found' => $licen->hasDataKey('DATA','key'));
		if ($licen->hasDataKey('DATA','key'))
		{
			$_data = array(
				'key_found' => true,
				'reloaded' => $licen->valRemote($licen->getDataKey('DATA','key')),
			);
		} else {
			$_data = array(
				'key_found' => false,
				'reloaded' => false,
			);
		}
		$data = array_merge($_data,$this->_generateLicenseStateData());
		return json_encode($data);
	}
}
