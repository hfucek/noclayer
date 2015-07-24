<?php

class Manifestreader
{
	const MANIFEST = 'assets/modules/manifest.json';
	
	private static $___manifest;
	
	private static $___loaded;
	
	private static $___loadTried;
	
	/**
	 * Get manifest path
	 * 
	 * @return string
	 */
	public static function getManifestPath()
	{
		return DOCROOT.self::MANIFEST;
	}
	
	/**
	 * Check if manifest exists
	 * 
	 * @return bool
	 */
	public static function manifestExists()
	{
		return is_file(self::getManifestPath());
	}
	
	/**
	 * Read raw manifest data
	 * 
	 * @return stdClass|null
	 */
	public static function readManifestFile()
	{
		return		self::manifestExists()
				?	json_decode(file_get_contents(self::getManifestPath()))
				:	null
		;
	}
	
	/**
	 * Help convert item to full array
	 * 
	 * @param object|array $object
	 * @return array
	 */
	protected static function _toArray($object)
	{
		$object = (array) $object;
		foreach ($object as &$item)
		{
			if ($item instanceof stdClass || is_array($item))
			{
				$item = self::_toArray($item);
			}
		}
		unset($item);
		return $object;
	}
	
	/**
	 * Force reload of manifest data
	 * 
	 * @return bool
	 */
	static public function reloadManifestData()
	{
		$data = self::readManifestFile();
		if (!empty($data))
		{
			self::$___manifest = self::_toArray($data);
			self::$___loaded = true;
		} else {
			self::$___manifest = array();
			self::$___loaded = false;
		}
		return self::$___loaded;
	}
	
	/**
	 * Get read data from manifest
	 * 
	 * @return array
	 */
	static public function getManifestDataArray()
	{
		if (!self::$___loadTried)
		{
			self::reloadManifestData();
		}
		return self::$___manifest;
	}
	
	/**
	 * Check if key has been set
	 * @param type $key
	 * @return boolean
	 */
	static public function hasDataKey($key)
	{
		$params = func_get_args();
		$data = self::getManifestDataArray();
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
	static public function getDataKey($key)
	{
		$params = func_get_args();
		$data = self::getManifestDataArray();
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
	
	static public function getManifestVersion()
	{
		return self::getDataKey('version');
	}
}