<?php

class Licen 
{
   /**
     * @var Licen
     */
    static protected $_instance;

    /**
     * @var string Path to active license file
     */
    protected $_licensePath;

    /**
     * @var array Data array extracted from the license
     */
    protected $_validation_data;

    /**
     * @var string License validation result
     */
    protected $_result;

    /**
     * @var bool Has license been loaded
     */
    protected $_loaded;

    /**
     * Connection settings
     */

    const LICENSE_SERVER_HOST = 'license.noclayer.com';
    const LICENSE_SERVER_PORT = 80;
    const LICENSE_SERVER_PATH = '/remote';

	const PURCHUSE_NEW_DAYS_REMINDER = 4;
	
	const LAST_SUCCESSFULL_CONNECT_LOG_NAME = 'remote_val_success';
	const LAST_UNSUCCESSFULL_CONNECT_LOG_NAME = 'remote_val_fail';
	const LAST_CONNECT_ATTEMPT_TIME_LOG_NAME = 'remote_val_time';
	const LAST_CONNECT_STATE_LOG_NAME = 'remote_val_state';
	
    /**
     * Version shortnames
     */
    const NOC_LICENCE_VERSION_NONE = 'none';
    const NOC_LICENCE_VERSION_BASIC = 'basic';
    const NOC_LICENCE_VERSION_ADVANCED = 'advanced';
    const NOC_LICENCE_VERSION_PREMIUM = 'premium';

    /**
     * Version integer code representations
     */
    const NOC_LICENCE_VERSION_IDKEY_NONE = 0;
    const NOC_LICENCE_VERSION_IDKEY_BASIC = 1;
    const NOC_LICENCE_VERSION_IDKEY_ADVANCED = 2;
    const NOC_LICENCE_VERSION_IDKEY_PREMIUM = 3;

    /**
     * Licence path
     */
    const LICENSE_PATH = 'license/license.txt';

    /**
	 * Licence result constants
	 */
	const LICENSE_RESULT_OK = 'OK';
	const LICENSE_RESULT_CORRUPT = 'CORRUPT';
	
	const LICENSE_RESULT_UNKNOW = 'UNKNOWN';
	
	const LICENSE_RESULT_TIMEFRAME_TMINUS = 'TMINUS';
	const LICENSE_RESULT_TIMEFRAME_EXPIRED = 'EXPIRED';
	
	const LICENSE_RESULT_ILLEGAL_MAC = 'ILLEGAL MAC';
	const LICENSE_RESULT_ILLEGAL_PATH = 'ILLEGAL PATH';
	const LICENSE_RESULT_ILLEGAL_DOMAIN = 'ILLEGAL DOMAIN';
	const LICENSE_RESULT_ILLEGAL_IP = 'ILLEGAL IP';
	const LICENSE_RESULT_ILLEGAL_LOCAL = 'ILLEGAL LOCAL';
	
	/**
	 * Connection between licence integer representations and shortnames
	 * 
	 * @var array
	 */
	private $_license_key_name_pairs = array(
		self::NOC_LICENCE_VERSION_IDKEY_NONE		=>	self::NOC_LICENCE_VERSION_NONE		,
		self::NOC_LICENCE_VERSION_IDKEY_BASIC		=>	self::NOC_LICENCE_VERSION_BASIC		,
		self::NOC_LICENCE_VERSION_IDKEY_ADVANCED	=>	self::NOC_LICENCE_VERSION_ADVANCED	,
		self::NOC_LICENCE_VERSION_IDKEY_PREMIUM		=>	self::NOC_LICENCE_VERSION_PREMIUM	,
	);
	
	/**
	 * List of access rights by versions
	 * 
	 * @var array[] 
	 */
	private $_licesne_key_valid_mods = array(
		self::NOC_LICENCE_VERSION_IDKEY_NONE => array(
			self::NOC_LICENCE_VERSION_IDKEY_NONE,
		),
		self::NOC_LICENCE_VERSION_IDKEY_BASIC => array(
			self::NOC_LICENCE_VERSION_IDKEY_NONE,
			self::NOC_LICENCE_VERSION_IDKEY_BASIC,
		),
		self::NOC_LICENCE_VERSION_IDKEY_ADVANCED => array(
			self::NOC_LICENCE_VERSION_IDKEY_NONE,
			self::NOC_LICENCE_VERSION_IDKEY_BASIC,
			self::NOC_LICENCE_VERSION_IDKEY_ADVANCED,
		),
		self::NOC_LICENCE_VERSION_IDKEY_PREMIUM => array(
			self::NOC_LICENCE_VERSION_IDKEY_NONE,
			self::NOC_LICENCE_VERSION_IDKEY_BASIC,
			self::NOC_LICENCE_VERSION_IDKEY_ADVANCED,
			self::NOC_LICENCE_VERSION_IDKEY_PREMIUM,
		),
	);
	
	/**
	 * List of statuses representing iliegal data
	 * 
	 * @var array
	 */
	private $_license_illegal_results = array(
		self::LICENSE_RESULT_ILLEGAL_DOMAIN,
		self::LICENSE_RESULT_ILLEGAL_IP,
		self::LICENSE_RESULT_ILLEGAL_LOCAL,
		self::LICENSE_RESULT_ILLEGAL_MAC,
		self::LICENSE_RESULT_ILLEGAL_PATH
	);
	
	/**
	 * List of statuses representing illegal time
	 * 
	 * @var array 
	 */
	private $_license_out_of_time_frame_results = array(
		self::LICENSE_RESULT_TIMEFRAME_EXPIRED,
		self::LICENSE_RESULT_TIMEFRAME_TMINUS,
	);
	
	//<editor-fold defaultstate="collapsed" desc="Instancing of Licen class">
	/**
	 * Singleton classes have protected constructor;
	 */
	protected function __construct($filePath, $isContent = false)
	{
		$this->___read($filePath, $isContent);
		
	}
	
	/**
	 * Read data from filepath and setup class
	 * 
	 * @param string $filePath
	 */
	private function ___read($filePath, $isContent = false)
	{
		$this->_loaded = false;
		$this->_licensePath = $isContent ? null : $filePath;
		$this->_validation_data = array();
		$this->_result = null;
		
		if ($isContent || (is_file($filePath) && is_readable($filePath)))
		{
			$content = $isContent ? $filePath : file_get_contents($filePath);
			if (!empty($content))
			{
				$this->_loaded = true;
			}
			
			ob_start();
			$r = self::getMod()->validate($content);
			ob_end_clean();
			
			if (is_array($r))
			{
				$this->_validation_data = $r;

				if (!is_array($r) || !array_key_exists('RESULT', $r))
				{
					$this->_result = self::LICENSE_RESULT_UNKNOW;
				} else {
					$this->_result = $r['RESULT'];
				}
				$this->_loaded = true;
			} else {
				$this->_loaded = false;
			}
			
		}
	}
	
	
	/**
	 * Load new independent instance of Licen
	 * 
	 * @param string $filePath Path to license. Default already set.
	 * @return Licen
	 */
	static public function load($filePath = null)
	{
		if (empty($filePath))
		{
			$filePath = APPPATH.self::LICENSE_PATH;
		}
		$c = get_called_class();
		return new $c($filePath, false);
	}
	
	/**
	 * Parse license data from string
	 * @param String $content
	 * @return Licen
	 */
	static public function parse($content)
	{
		$c = get_called_class();
		return new $c($content, true);
	}
	/**
	 * Check if licence file was loaded
	 * 
	 * @return bool
	 */
	 
	 public function isLoaded()
	 {
		return $this->_loaded;
	}


    /**
     * Get instance of Licen
     * 
     * @return type
     */
    static public function instance()
    {
        if (!(self::$_instance instanceof Licen) || !self::$_instance->isLoaded())
	{
            self::$_instance = self::load();
        }
        return self::$_instance;
    }

    /**
     * Force reinstance
     * 
     * @return Licen
     */
    static public function reinstance() 
    {
        self::$_instance = null;
        return self::instance();
    }

    public function getLicensePath()
    {
        return $this->_licensePath;
    }

    //</editor-fold>
    //<editor-fold defaultstate="collapsed" desc="Fetchers of \Mod class">
    /**
     * Get Mod
     * @return \Share_Mod
     */
    static public function getMod()
    {
        return new Share_Mod(false, true, true, false);
    }

    /**
     * Get internal Mod class with preset license path
     * @return \Share_Mod
     */
    protected function _getMod()
    {
        $mod = self::getMod();
        if (!empty($this->_licensePath))
		{
            $mod->licensePath = $this->_licensePath;
        }
        return $mod;
    }

    //</editor-fold>
    //<editor-fold defaultstate="collapsed" desc="Writeing to licence file">
    /**
     * Check if license file can be written to
     * 
     * @return boolean
     */
    public function canWriteToLicenseFile()
    {
        
        //check if file exist if not make it!
         
        if (!is_file($this->_licensePath)){
             touch($this->_licensePath);
             
        }

        // If it is a writeable file, say YES
        if (is_file($this->_licensePath) && is_writable($this->_licensePath)) 
	{
            return true;
        }

        // If it is a directory, say NO
        if (is_dir($this->_licensePath))
	{
            return false;
        }

        // If parent directory exists and is Writeable, say YES
        if (is_dir(dirname($this->_licensePath) && is_writeable(dirname($this->_licensePath))))
	{
            return true;
        }

        // Otherwise relay on simple is writeable test
        return is_writeable($this->_licensePath);
    }

    /**
     * Write the key to file
     * 
     * @param string $key
     * @return boolean If key written
     */
    protected function _writeKey($key)
    {   
        if ($this->canWriteToLicenseFile())
	{
            $this->_getMod()->writeKey($key, $this->_licensePath);
            $this->___read($this->_licensePath);
            return true;
        } else {
            return false;
        }
    }

    //</editor-fold>
    //<editor-fold defaultstate="collapsed" desc="Data fetchers">
    /**
     * Get data extracted from license
     * 
     * @return array
     */
    public function getData()
    {
        return $this->_validation_data;
    }

    /**
     * Check if key exists in validation result
     * @param string $key1
     * @param string $key2
     * @param string ...
     * @return boolean
     */
    public function hasDataKey($key)
    {
        $params = func_get_args();
        $data = $this->_validation_data;
        while (count($params))
	{
            $param = array_shift($params);
            // Parameter doesn't exist, so return null
            if (!array_key_exists($param, $data))
	    {
                return false;
            }
            // Final depth of parameter search so return parameter
            elseif (count($params) == 0)
	    {
                return true;
            }
            // Or go deeper into data and redo search
            else
	    {
                $data = $data[$param];
            }
        }
    }

    /**
     * Get key in validation result if it exists, otherwise return null
     * @param string $key1
     * @param string $key2
     * @param string ...
     * @return mixed|null
     */
    public function getDataKey($key)
    {
        $params = func_get_args();
        $data = $this->_validation_data;
        while (count($params))
	{
            $param = array_shift($params);
            // Parameter doesn't exist, so return null
            if (!array_key_exists($param, $data))
	    {
                return null;
            }
            // Final depth of parameter search so return parameter
            elseif (count($params) == 0)
	    {
                return $data[$param];
            }
            // Or go deeper into data and redo search
            else
	    {
                $data = $data[$param];
            }
        }
    }

    //</editor-fold>

    /**
     * Get result of validation
     * 
     * @return array
     */
    public function getResult()
    {
        return $this->_result;
    }
public function getChannel()
	{
		return $this->getDataKey('DATA','channel');
	}
    
	public function getKey()
	{
		return $this->getDataKey('DATA','key');
	}
    //<editor-fold defaultstate="collapsed" desc="Licence evaluation result checkers">
    /**
     * Was there an invalida data while evaluating license (checked against result)
     * 
     * @return bool
     */
    public function hasLicenseInvalidData()
    {
        return in_array($this->_result, $this->_license_illegal_results);
    }

    /**
     * Is the license out of it's time frame (checked against result)
     * 
     * @return bool
     */
    public function isLicenseOutOfTimeframe()
    {
        return in_array($this->_result, $this->_license_out_of_time_frame_results);
    }

    /**
     * Is the license corrupted (checked against result)
     * 
     * @return bool
     */
    public function isLicenseCorrupt()
    {
        return $this->_result == self::LICENSE_RESULT_CORRUPT;
    }

    /**
     * Is the license OK (checked against result)
     * 
     * @return bool
     */
    public function isLicenseOk()
    {
        return $this->_result == self::LICENSE_RESULT_OK;
    }

    //</editor-fold>
    //<editor-fold defaultstate="collapsed" desc="Licence data fatchers, parsers and procesors">

    static public function convertLicenseNameToLicenseNameData($license, $single_value = null)
    {

        $key = $license;
        preg_match('/([^\/\_]+)\/([^\/\_]+)_([^\/\_]+)/', $key, $match);
        if (count($match) >= 4)
	{
            $return = array(
                'versionCategory' => $match[1],
                'subscriptionMethod' => $match[2],
                'licenseId' => $match[3],
            );
            if (!empty($single_value))
	    {
                return 		array_key_exists($single_value, $return)
			? 	$return[$single_value]
			: 	false;
            } else {
                return $return;
            }
        } else {
            return false;
        }
    }

    /**
     * Extract data from license name
     * 
     * @return array|boolean Array of data, or false if fail
     */
    public function getLicenseNameData($single_value = null)
    {
        if ($this->hasDataKey('DATA', 'key'))
	{
            $key = $this->getDataKey('DATA', 'key');
            return self::convertLicenseNameToLicenseNameData($key, $single_value);
        }
        return false;
    }

    /**
     * Get short name of Noclayer version from licence
     * 
     * @return string|bool String if found, false otherwise
     */
    public function getFromLicenceNocVersion()
    {
        $key = $this->getLicenseNameData('versionCategory');
        if (!empty($key))
	{
            switch ($key)
	    {
                case 'basic':
                    return self::NOC_LICENCE_VERSION_BASIC;
                    break;

                case 'advanced':
                    return self::NOC_LICENCE_VERSION_ADVANCED;
                    break;

                case 'premium':
                    return self::NOC_LICENCE_VERSION_PREMIUM;
                    break;
            }
        }
        return false;
    }

    /**
     * Get a numeric (integer) representation of Noc Version from license
     * 
     * @return type
     */
    public function getFromLicenceNocVersionId()
    {
        $key = $this->getFromLicenceNocVersion();
        return array_search($key, $this->_license_key_name_pairs);
    }

    /**
     * Check licence version requirement (if given licence version has access to other version options)
     * 
     * @param integer $req_ver
     * @return boolean
     */
    public function checkLicenseVersionRequirement($req_ver)
    {
        $key = $this->getFromLicenceNocVersionId();
        return 		array_key_exists($key, $this->_licesne_key_valid_mods)
		? 	in_array($req_ver, $this->_licesne_key_valid_mods[$key])
		: 	false
        ;
    }

    //</editor-fold>
    //<editor-fold defaultstate="collapsed" desc="Some data parsers, checkers and fatchers to ease getting of data">
    /**
     * Check if license is in a "Remind Period", that is, if it is time to recconect the server and update license data
     * @return null
     */
     public function inRemindPeriod()
    {
        if (is_array($this->_validation_data) && array_key_exists('DATE', $this->_validation_data) && is_array($this->_validation_data['DATE']))
		{
            $times = $this->_validation_data['DATE'];
			if ($times['END'] == 'NEVER') { return false; }            
            $diference = ($times['END'] - $times['START']) / 2;
            $remind_start= $times['START']+$diference;
            $remind_end = ($times['END']);
            $time = time();
            
            
            return ($time >= $remind_start && $time <= $remind_end);
        }
        return null;
    }
	
	public function purchuseNewReminder()
	{
		if (!$this->hasDataKey('DATA','valid'))
		{
			return false;
		}
		
		$remind_time = self::PURCHUSE_NEW_DAYS_REMINDER * 24*60*60;
		$time = time();
		$valid_time = $this->getDataKey('DATA','valid');
		return $valid_time-$remind_time<$time;
		
	}

	public function purchuseOverdue()
	{
		if (!$this->hasDataKey('DATA','valid'))
		{
			return false;
		}
		
		return $this->getDataKey('DATA','valid') < time();
	}
	
    /**
     * Get an array of domain names from license
     * 
     * @return type
     */
    public function getDomainsArray()
    {
        $return = array();
        if ($this->hasDataKey('DATA', 'domains'))
	{
            foreach ($this->getDataKey('DATA', 'domains') as $domain)
	    {
                $domain = trim($domain);
                if (!empty($domain))
		{
                    $return[$domain] = $domain;
                }
            }
        }
        return $return;
    }

    //</editor-fold>
    //<editor-fold defaultstate="collapsed" desc="Remote functions being or using registerInstall">
    /**
     * registerInstall
     *
     * registers the install with the home server and if registration is
     * excepted it then generates and installs the key.
     * 
     * @return string Returns the encrypted install validation
     * */
    public function registerInstall($key)
    {
        $data = array(
            'SERVER_NAME' => $_SERVER['SERVER_NAME'],
            'key' => $key,
            'ip' => $_SERVER['SERVER_ADDR'],
            'dir' => APPPATH
        );
        $mod = $this->_getMod();
        ob_start();
        $return = $mod->registerInstall(
                $_SERVER['HTTP_HOST'], //	The domain to register the license to
                0, //	The start time of the license, can be either the actuall time or the time span until the license is valid
                1, //	Number of seconds untill the license expires after start, or 'NEVER' to never expire
                $data, //	Array that contains the info to be validated
                self::LICENSE_SERVER_HOST, //	Host name of the server to be contacted
                self::LICENSE_SERVER_PATH, //	Path of the script for the data to be sent to
                self::LICENSE_SERVER_PORT //	Port Number to send the data through
        );
		ob_end_clean();
		return $return;
	}
	
    /**
     * Validate key with remote server and save license key.
     * If validation passes, save the key and reload instance of Licen (self reload).
     * 
     * @param string $key Key to validate
     * @return boolean
     */
    public function valRemote($key)
	{
        
        $result = $this->registerInstall($key);
		$m = $this->_getMod()->validate($result);
		if ($m['RESULT'] == 'OK')
    	{
			$this->_writeKey($result);
			self::_updateLastAttemptState(true);
			return true;
    	} else {
			self::_updateLastAttemptState(false);
			return false;
    	}
    }
	
	protected static function _updateLastAttemptState($success_state)
	{
		$logname = $success_state ? self::LAST_SUCCESSFULL_CONNECT_LOG_NAME : self::LAST_UNSUCCESSFULL_CONNECT_LOG_NAME;
		$time = time();
		Simplelog::write($logname,$time);
		Simplelog::write(self::LAST_CONNECT_ATTEMPT_TIME_LOG_NAME,$time);
		Simplelog::write(self::LAST_CONNECT_STATE_LOG_NAME, $success_state);
	}
	
	static public function getLastValResult()
	{
		return array
		(
			'time' => Simplelog::read(self::LAST_CONNECT_ATTEMPT_TIME_LOG_NAME),
			'state' => Simplelog::read(self::LAST_CONNECT_STATE_LOG_NAME),
		);
	}
	
    /**
     * Registers the key with the server and if valid writes it to license file
     * 
     * @param string $key
     * @return array Validation result
     */
    public function reactivate($key)
    {
        $res = $this->registerInstall($key);
        ob_start();
        $m = $this->_getMod()->validate($res);
        ob_end_clean();
        if ($m['RESULT'] == 'OK')
		{
            $this->_writeKey($key);
        }
        return $m;
    }

    //</editor-fold>


    public function generateOfflineLicenseData($key)
    {
        $data = array(
            'SERVER_NAME' => $_SERVER['SERVER_NAME'],
            'key' => $key,
            'ip' => $_SERVER['SERVER_ADDR'],
            'dir' => APPPATH,
			'mac' => $this->getMod()->getMacAddress(),
        );

        return $data;
    }

    public function generateEncodedOfflineLicenseData($key)
    {
        $m = $this->_getMod();
        return $m->wrapLicense(
                        $this->generateOfflineLicenseData($key),
			'OFFLINE_DATA'
        );
    }

    public function decodeOfflineLicenseData($data)
    {
        return $this->_getMod()->unwrapLicense($data, 'OFFLINE_DATA');
    }
	
	public function isOfflineLicense()
	{
		return $this->isLoaded() && ($this->getLicenseNameData('subscriptionMethod') == 'offline');
	}
	

}