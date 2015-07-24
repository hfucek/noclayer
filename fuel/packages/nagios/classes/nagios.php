<?php



namespace Nagios;

define("PHPNAGIOS_DIR", dirname(__FILE__));
//define("LOG_FILE", PHPSVN_DIR . time() . ".log.html");
/*
require_once PHPSVN_DIR . "/http.php";
require_once PHPSVN_DIR . "/xml_parser.php"; // to be dropped?
require_once PHPSVN_DIR . "/definitions.php";
require_once PHPSVN_DIR .  "/xml2Array.php";
*/
/**
 *  PHP SVN CLIENT
 *
 *  This class is a SVN client. It can perform read operations
 *  to a SVN server (over Web-DAV). 
 *  It can get directory files, file contents, logs. All the operaration
 *  could be done for a specific version or for the last version.
 *
 *  @author Cesar D. Rodas <cesar@sixdegrees.com.br>
 *  @license BSD License
 */


use Config;
use Cookie;
use FuelException;
use Session;
use Lang;


class Nagios {

    /**
     *  Nagios  status.cgi URL
     *
     *  @var string
     *  @access private
     */
    private $_url;

 
    
    
    public function  __construct($url){
    	$this->url=$url;
    	
    }
    
    public function auth($user,$password){
    	$this->user=$user;
    	$this->password=$password;
    	
    }
    
    public function testConnection(){

    	$process = curl_init($this->url);
curl_setopt($process, CURLOPT_HTTPHEADER, array('Content-Type: application/html'));
curl_setopt($process, CURLOPT_HEADER, 0);
curl_setopt($process, CURLOPT_USERPWD, $this->user.':'.$this->password);
curl_setopt($process, CURLOPT_TIMEOUT, 30);
curl_setopt($process, CURLOPT_FOLLOWLOCATION, TRUE);
//curl_setopt($process, CURLOPT_POST, 1);
//curl_setopt($process, CURLOPT_POSTFIELDS, $payloadName);
curl_setopt($process, CURLOPT_RETURNTRANSFER, TRUE);
$return = curl_exec($process);
$m=print_r($return,true);
$resultStatus = curl_getinfo($process);  

$code=$resultStatus['http_code']; 


if($code==200){

$data=explode("infoBoxTitle",$m);

if(count($data)<=1){
$code=515;	
	
}
}

return $code;

//echo $m=print_r($resultStatus,true);

//echo $m=print_r($return,true);
    	
    }
    
    
    public function getData($total){
    	//echo phpinfo();
	//$curl=new MyCurl();
    	
	
    	
  //  $curl = curl_init('http://localhost/pt/public/api/v1/tags.xml');
 //curl_setopt($s,CURLOPT_URL,$this->_url); 
                        
$process = curl_init($this->url);
curl_setopt($process, CURLOPT_HTTPHEADER, array('Content-Type: application/html'));
curl_setopt($process, CURLOPT_HEADER, 0);
curl_setopt($process, CURLOPT_USERPWD, $this->user.':'.$this->password);
curl_setopt($process, CURLOPT_TIMEOUT, 30);
curl_setopt($process, CURLOPT_FOLLOWLOCATION, TRUE);
//curl_setopt($process, CURLOPT_POST, 1);
//curl_setopt($process, CURLOPT_POSTFIELDS, $payloadName);
curl_setopt($process, CURLOPT_RETURNTRANSFER, TRUE);
$return = curl_exec($process);
	

//print_r($return);	


$m=print_r($return,true);
$z=$m;
$resultStatus = curl_getinfo($process);

$code=$resultStatus['http_code'];

if($code==200){
$data=explode("<body class='status'>",$m);

if(count($data)>=1){

$data2=explode('<body ',$z);	



$ispis=str_replace('<IMG','<i',$data2[1]);
                                  

   





$data=explode("infoBoxTitle",$z);

if(count($data)<=1){
$code=515;	
	
}
array_push($total['nagiosCode'],array($this->url,$code));
}



}




if($code==200){
//print_r($resultStatus);




$elements=new Parser($ispis,$total);


return Array($elements->services,$elements->total);
/*
return  json_encode( Array(
				//'hosts'=>$elements->hosts,
				'services'=>$elements->services,
				//'status'=>$elements->status
			));
    */
    
    }else{
    	return Array(Array(),$total);
    	
    }
  
    }
	
}    
    
    

    
?>
