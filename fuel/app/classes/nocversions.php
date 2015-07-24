<?php

class Nocversions
{
	const NOC_VERSION_CORE		= 'core'		;
	const NOC_VERSION_BASIC		= 'basic'		;
	const NOC_VERSION_ADVANCED	= 'advanced'	;
	const NOC_VERSION_PREMIUM	= 'premium'		;
	
	static private $___validVersions = array(
		self::NOC_VERSION_CORE,
		self::NOC_VERSION_BASIC,
		self::NOC_VERSION_ADVANCED,
		self::NOC_VERSION_PREMIUM,
	);
	
	static private $___validVersionLicenseForManifestOnInstall = array(
		self::NOC_VERSION_CORE => array(
			self::NOC_VERSION_CORE,
			self::NOC_VERSION_BASIC,
		),
		self::NOC_VERSION_BASIC => array(
			self::NOC_VERSION_CORE,
			self::NOC_VERSION_BASIC,
		),
		self::NOC_VERSION_ADVANCED => array(
			self::NOC_VERSION_CORE,
			self::NOC_VERSION_BASIC,
			self::NOC_VERSION_ADVANCED,
			self::NOC_VERSION_PREMIUM,
		),
	);
	
	static public function getValidVersionNames()
	{
		return self::$___validVersions;
	}
	
	static public function isValidVersionName($name)
	{
		return in_array($name,self::getValidVersionNames());
	}
	
	static public function isCorrectManifestForVersion($manifest, $version)
	{
		return		self::isValidVersionName($manifest)
				&&	self::isValidVersionName($version)
				&& array_key_exists($manifest, self::$___validVersionLicenseForManifestOnInstall)
				&& is_array(self::$___validVersionLicenseForManifestOnInstall[$manifest])
				&&	in_array($version,self::$___validVersionLicenseForManifestOnInstall[$manifest])
		;
	}
}