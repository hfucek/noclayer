<?php

class Controller_Installo extends Controller_Installbasic
{

	const VALID_SUBSCRIPTION_TYPE = 'offline';
	
	const REQUIRED_MYSQL_VERSION = '5.0';
	
	private $_finalErrors;
	
	protected function _goToStep1()
	{
		return \Response::redirect(\Config::get('base_url').'/installo?step=1');
	}
	
	protected function _isLicenseValid($license)
	{
		$subscriptionMethod = \Licen::convertLicenseNameToLicenseNameData($license, 'subscriptionMethod');
		return in_array($subscriptionMethod, array(self::VALID_SUBSCRIPTION_TYPE));
	}
	
	protected function _posted($var)
	{
		$var = trim(\Input::post($var));
		return empty($var) ? null : $var;
	}
	
	public function action_index()
	{
		
		Config::load('install', true);
		$this->version=Config::get('install.version');
		$this->install_mode='Offline';
		if ($this->version <= 0)
		{
			$req = $this->requirements(false);
			if (!$req['next'])
			{
				return $this->step_0();
			}
			
			$step = \Input::get('step');
			if (!in_array($step,array(0,1,2,3,4)))
			{
				\Response::redirect(\Config::get('base_url').'/installo?step=1');
			}
			
			switch ($step)
			{
				case 0:
					return $this->step_0();
					break;
				case 1:
					return $this->step_1();
					break;
				case 2:
					return $this->step_2();
					break;
				case 3:
					return $this->step_3();
					break;
				case 4:
					return $this->step_4();
					break;
			}
		} else {
			// If installed, just output "Already installed"
			$data['version']=Model_Version::find('last', array('order_by' => 'meta_update_time'));
		 	$data['instaled']=true;
		 	return View::forge('install/version',$data);
		}
	}
	
	protected function step_0()
	{
		$view = View::forge('install/offline/layout',array('instaled' => false,'title' => 'Instalation requirements'));
		$view->content = View::forge('install/offline/step_0',$this->requirements(false));
		return $view;
	}
	
	protected function step_1()
	{
			$view = View::forge('install/offline/layout',array('instaled' => false, 'title' => 'Provideing license data'));
			$view->content = View::forge('install/offline/step_1',array('licensekey' => $this->_posted('licenseKey'), 'subscription_type'=>self::VALID_SUBSCRIPTION_TYPE));
		 			 	
		 	//install database
		 	return $view;
		 	
	}
	
	protected function step_2()
	{
		$license = \Input::post('licenseKey');
		$action = \Input::post('action');
		if (!$this->_isLicenseValid($license) || !in_array($action,array('step2','step3','step4','downloadLicense')))
		{
			$this->_goToStep1(); 
		}
		
		$manifestVersion = Manifestreader::getDataKey('version');
		$licenseVersion = Licen::convertLicenseNameToLicenseNameData($license, 'versionCategory');
		$validManifest = Nocversions::isCorrectManifestForVersion($manifestVersion, $licenseVersion);
		
		$stepBack = false;
		switch ($action)
		{
			case 'downloadLicense':
				$content = \Licen::instance()->generateEncodedOfflineLicenseData($license);
				$download = new \fileDownload($content, 'license-'.time());
				return $download->download();
				break;
			
			case 'step4':
			case 'step3':
				$stepBack = true;
			case 'step2':
				$view = View::forge('install/offline/layout',array('instaled' => false, 'title' => 'Input license'));
				$view->content = View::forge('install/offline/step_2',array('stepBack' => $stepBack, 'validManifest' => $validManifest, 'licenseKey' => $license,'licenseInput' => $this->_posted('licenseInput')));
				return $view;
				break;
			default:
				return $this->_goToStep1();
				break;
		}
	}
	
	protected function step_3()
	{
		$license = \Input::post('licenseKey');
		$action = \Input::post('action');
		$postFile = \Input::post('licensePost');
		$input = $this->_posted('licenseInput');
		if (!$this->_isLicenseValid($license) || !in_array($action,array('step4','step3')))
		{
			$this->_goToStep1();
		}
		
		$fileUploaded = !empty($input);
		if ($fileUploaded)
		{
			// Read file then remove if from disk (we don't need it anymore)
			//$file_path = $_FILES['licenseUpload']['tmp_name'];
			//$licenseFile = file_get_contents($file_path);
	/**/	//$fileLicen = Licen::load($file_path);
			//unlink($file_path);
			$licenseFile = $input;
			$fileLicen = Licen::parse($input);
		}
		$posted = false;
		if (!$fileUploaded)
		{
			if (!empty($postFile))
			{
				$licenseFile = $postFile;
				$fileLicen = Licen::parse(base64_decode($postFile));
				$posted = true;
			} else {
				$posted = false;
			}
		}
		
		if ($fileUploaded || $posted)
		{
			$key = $fileLicen->getKey();
			if ($key != $license || !$fileLicen->isLicenseOk())
			{
				// Wrong or invalid license was uploaded, ask for new license upload.
				return $this->step_2();
			}
		} else {
			// File was neither uploaded nor posted trough, so rerequest it's upload
			return $this->step_2();
		}
		
		
		$manifestVersion = Manifestreader::getDataKey('version');
		$licenseVersion = $fileLicen::convertLicenseNameToLicenseNameData($license, 'versionCategory');
		$validManifest = Nocversions::isCorrectManifestForVersion($manifestVersion, $licenseVersion);
		if (!$validManifest)
		{
			return $this->step_2();
		}
		
		
		$uploadedData = $posted ? $licenseFile : base64_encode($licenseFile);
		

		$errors = ($action == 'step3') ? array() : $this->evaluateFinalErrors();

		$view = View::forge('install/offline/layout',array('instaled' => false, 'title' => 'Provide data'));
		$view->content = View::forge(
				'install/offline/step_3',
				array(
					'licensePost' => $uploadedData,
					'licenseKey' => $license,
					'errors' => $errors,
					'd' => $this->getStep4PostData(),
				));
		return $view;
		
	}
	
	protected function step_4()
	{
		$license = \Input::post('licenseKey');
		$action = \Input::post('action');
		$postFile = \Input::post('licensePost');
		if (!$this->_isLicenseValid($license) || !in_array($action,array('step4')))
		{
			return $this->_goToStep1();
		}
		$decoded = base64_decode($postFile);
		$fileLicen = Licen::parse($decoded);
		$key = $fileLicen->getKey();
		if ($key != $license || !$fileLicen->isLicenseOk())
		{
			// Wrong or invalid license was uploaded, ask for new license upload.
			return $this->step_2();
		}
		
		$finalData = $this->evaluateFinalErrors();
		
		if (count($finalData) > 0)
		{
			return $this->step_3();
		}
		
		// Write license file to disk
		file_put_contents(APPPATH.'license/license.txt', $decoded);
		Licen::reinstance();
		// Finaly Preform Install
		$data = $this->getStep4PostData();
		return $this->_install($data);
	
	}
	
	protected function getStep4PostData()
	{
		return array(
			'admin_name' => $this->_posted('admin_name'),
			'admin_pass' => $this->_posted('admin_pass'),
			'mysql_host' => $this->_posted('mysql_host'),
			'mysql_username' => $this->_posted('mysql_username'),
			'mysql_password' => $this->_posted('mysql_password'),
			'mysql_database' => $this->_posted('mysql_database'),
			'licensekey'	=> $this->_posted('licenseKey'),
		);
	}
	
	protected function evaluateFinalErrors()
	{
		if (empty($this->_finalErrors))
		{
			$this->_finalErrors = array();
			$val = Validation::forge('users');
			$val->add_field('admin_name', 'Admin name', 'required|min_length[4]|max_length[250]');
			$val->add_field('admin_pass', 'Admin password', 'required|min_length[4]|max_length[250]');
			$val->add_field('licenseKey', 'License key', 'required|min_length[4]|max_length[250]');
			$val->add_field('mysql_host', 'Mysql host', 'required|min_length[4]|max_length[250]');
			$val->add_field('mysql_database', 'Mysql database', 'required|min_length[4]|max_length[250]');
			$val->add_field('mysql_username', 'Mysql username', 'required|min_length[4]|max_length[250]');
			$val->add_field('mysql_password', 'Mysql password', 'required|min_length[4]|max_length[250]');

			if ($val->run())
			{

				// We have to check MySQL still
				// 1. Check link
				$link = @mysql_connect($val->validated('mysql_host'), $val->validated('mysql_username'), $val->validated('mysql_password'));
				if (!$link)
				{
					$this->_finalErrors[] = 'Unable to connect to MySQL server. Got response "'.mysql_error().'"';
					
					return $this->_finalErrors;
				}
				// 2. Check database existence
				if (!@mysql_select_db($val->validated('mysql_database')))
				{
					$this->_finalErrors[] = 'Unable to select MySQL database. Got response "'.mysql_error().'"';
				}
				// 3. Check server version
				$query=mysql_query("select version() as v");
				$row=mysql_fetch_array($query);
				preg_match('/([0-9]+\.[0-9]+\.[0-9])+/', $row[0], $version);
				$version = $version[1];
				if(version_compare($version, self::REQUIRED_MYSQL_VERSION, '<'))
				{

					$this->_finalErrors[] = 'Required MySQL version is '.self::REQUIRED_MYSQL_VERSION.' or greater. However, your server has version '.$version.'.';
				}

				mysql_close($link);
				return $this->_finalErrors;

			} else {
				foreach ($val->errors() as $error)
				{
					$this->_finalErrors[] = (string) $error;
				}
			}
		}
		return $this->_finalErrors;

	}
	

	
	
}
