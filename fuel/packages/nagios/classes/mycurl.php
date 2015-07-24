<?php

/**
 *  MyCurl - A portable cURL engine
 *
 *  MyCurl allows anyone to be able to use cURL, even if it is not installed
 *  on their server.  MyCurl is a OO version of cURL that uses fsockopen
 *  and other native functions to PHP to acheive the same results as
 *  an installed version of cURL would provide.
 *
 *  @author Justin Rainbow <justin@lazywebmastertools.com>
 *  @version v0.01-3 - 10/30/2006 17:53 
 */ 
/*
if (!function_exists('curl_init')): #used to avoid duplicate function errors

define('CURLOPT_URL',            0x00001);
define('CURLOPT_USERAGENT',      0x00002);
define('CURLOPT_POST',           0x00004);
define('CURLOPT_POSTFIELDS',     0x00008);
define('CURLOPT_RETURNTRANSFER', 0x00016);
define('CURLOPT_REFERER',        0x00032);
define('CURLOPT_HEADER',         0x00064);
define('CURLOPT_TIMEOUT',        0x00128);
define('CURLOPT_FOLLOWLOCATION', 0x00256);
define('CURLOPT_AUTOREFERER',    0x00512);
define('CURLOPT_PROXY',          0x01024);

function curl_init($url = false)
{
	return new MyCurl($url);
}

function curl_setopt(&$ch, $name, $value)
{
	$ch->setopt($name, $value);
}

function curl_exec($ch)
{
	return $ch->exec();
}

function curl_close(&$ch)
{
	$ch = false;
}

endif;


class MyCurl
{
	var $url = "";
	var $user_agent = "MyCurl v0.01 (http://lazywebmastertools.com/mycurl)";
	var $return_result = false;
	var $referrer = false;
	var $cookies_on = false;
	
	var $timeout = 30;
	
	var $cookies;
	var $headers;
	var $method = "GET";
	
	function MyCurl( $url = false )
	{
		$this->cookies = new myCurl_Cookies();
		$this->url = $url;
	}
	
	function setopt($name, $value = false)
	{
		switch ($name)
		{
			case CURLOPT_URL:
				$this->url = $value; break;
				
			case CURLOPT_USERAGENT:
				$this->user_agent = $value; break;
				
			case CURLOPT_POST:
				$this->method = ($value == true) ? "POST" : "GET"; break;
				
			case CURLOPT_POSTFIELDS:
				$this->post_data = $value; break;
				
			case CURLOPT_RETURNTRANSFER:
				$this->return_result = ($value == true); break;
				
			case CURLOPT_REFERER:
				$this->referrer = $value; break;
				
			case CURLOPT_HEADER:
				$this->options["header"] = ($value == true); break;
				
			case CURLOPT_PROXY:
				list($this->proxy["host"], $this->proxy["port"]) = explode(":", $value);
				break;
				
			case CURLOPT_TIMEOUT:
				$this->timeout = ($value >= 0) ? $value : 30;
		}
	}
	
	function exec()
	{
		$errno = false;
		$errstr = false;
		$url = $this->url;
		
		$host = $this->get_host($url);
		$query = $this->get_query($url);
		
		if ($this->proxy["host"]) {
			$fp = fsockopen($this->proxy["host"], $this->proxy["port"], $errno, $errstr, $this->timeout);
			$request = $url;
		} else {
			$fp = fsockopen($host, 80, $errno, $errstr, $this->timeout);
			$request = $query;
		}
		
		if (!$fp) {
			trigger_error($errstr, E_WARNING);
			return;	
		}
		
		$headers =  $this->method . " $request HTTP/1.0\r\n";
		$headers .= "HOST: $host\r\n";
		
		if ($this->user_agent)
			$headers .= "User-Agent: " . $this->user_agent . "\r\n";
			
		if ($this->referrer)
			$headers .= "Referer: " . $this->referrer . "\r\n";
			
		if ($this->method == "POST") {
			$headers .= "Content-Type: application/x-www-form-urlencoded\r\n";
			$headers .= "Content-Length: " . strlen($this->post_data) . "\r\n";
		}
		
		if ($this->cookies_on)
			$headers .= $this->cookies->create_header();
		
		$headers .= "Connection: Close\r\n\r\n";
		
		if ($this->method == "POST")
			$headers .= $this->post_data;
		
		$headers .= "\r\n\r\n";
		
		fwrite($fp, $headers);
		
		$raw_data = "";
		
		while(!feof($fp)) {
			$raw_data .= fread($fp, 512);
		}
		fclose($fp);
		
		$this->_parse_raw_data($raw_data);
				
		if ($this->options["header"])
			$this->content = $raw_data;
		
		if ($this->return_result)
			return $this->content;
			
		echo $this->content;
	}
	
	function get_host($url)
	{
		$url = str_replace(array("http://", "https://"), "", $url);
		$tmp = explode("/", $url);
		
		return $tmp[0];
	}
	
	function get_query($url)
	{
		$url = str_replace(array("http://", "https://"), "", $url);
		$tmp = explode("/", $url, 2);
		 
		return "/".$tmp[1];
	}
	
	function _parse_raw_data($raw_data)
	{
		$array = explode("\r\n\r\n", $raw_data, 2);
		
		$this->header_data = $array[0];
		$this->content = $array[1];
		
		$this->_parse_headers($array[0]);
	}
	
	function _parse_headers($raw_headers)
	{
		$raw_headers = trim($raw_headers);
		
		$headers = explode("\r\n", $raw_headers);
		
		foreach($headers as $header)
		{
			if (preg_match("|http/1\.. (\d+)|i", $header, $match)) {
				$this->status_code = $match[1];
				continue;
			}
			
			$header_array = explode(":", $header);
			
			$header_name = trim($header_array[0]);
			$header_value = trim($header_array[1]);
			
			if (preg_match("|set-cookie2?|i", $header_name))
				$this->cookies->add($header_value);
			
			if ($header_name > "")
				$this->headers[strtolower($header_name)] = $header_value;
		}
		
		if ($this->headers["location"] > "") {
			$this->url = $this->headers["location"];
			$this->exec();
		}
	}
}

class myCurl_Cookies
{
	var $cookies;
	
	function myCurl_Cookies()
	{
		
	}
	
	function add($cookie)
	{
		list($data, $etc) = explode(";", $cookie, 2);
		list($name, $value) = explode("=", $data);
		
		$this->cookies[trim($name)] = trim($value);
	}
	
	function create_header()
	{
		if (count($this->cookies) == 0 || !is_array($this->cookies)) return "";
		
		$output = "";
		
		foreach($this->cookies as $name => $value) {
			$output .= "$name=$value; ";
		}
		
		return "Cookies: $output\r\n";
	}
}
*/
?>