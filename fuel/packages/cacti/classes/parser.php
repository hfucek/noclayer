<?php
namespace Cacti;

use Config;
use Cookie;
use FuelException;
use Session;
use Lang;



class Parser{

	/*
	 * @var array contain all hosts
	 */
	public $hosts=Array('');

	/*
	 * @var array contain services from all hosts
	 * */

	public $graphs=Array();

	/**
	 * @var  array  contain status of services from hosts
	 */

	public $status=Array();

	/*
	 * @var int host counter
	 * */

	private $host=0;

	/*
	 * @var DOMDocument nagios status.cgi body
	 * */


	public $total=Array();
	
	
	
	/*
	 * construct parser
	 * */

	public function __construct($data){
		
		return $this->make($data);
	
	}

	/*
	 * make data
	 * @param string body data from status.cgi
	 * @return  array parsed data
	 * */

	private function make($data){

		ob_start();
		$this->dom= new \DOMDocument();
		$this->dom->loadHTML($data);
		ob_end_clean();
		
	
		//print_r($this->dom);
		
		//get all tables from DOM
		$trs=$this->dom->getElementsByTagName('tr');
		
		$hostIndx=Array();
		
		
		//loop
		foreach ($trs as $tr){
			
			
			
			
			//only table with status class
			if($tr->hasAttribute('id')){
				$id_name=$tr->getAttribute('id');
				
				
				//get tr with id line%
				if (strpos($id_name,'line') !== false) {
					
					$id=str_replace('line', '', $id_name);
					$aa=$tr->getElementsByTagName('a');
					foreach ($aa as $a) {
						
						$linkname=explode(' - ',$a->nodeValue);
						
						$host=$linkname[0];
						
						$name=array_pop($linkname);
						
						
						if (!in_array($host, $hostIndx)) {
							array_push($hostIndx,$host);
							array_push($this->hosts,'');
							$key = array_search($host, $hostIndx);
							$this->hosts[$key]=array('name'=>$host,'graphs'=>Array());
						}
						
						
						$key = array_search($host, $hostIndx);
						
						
						//print_r($hostIndx);
						
						array_push($this->hosts[$key]['graphs'], array('id'=>$id,'name'=>$name));
						
						
						
						
						
					}
					
					
					
					
				}
				
				
				
				
			}
		
		}
			
			
		
		
		print_r($this->hosts);
	}




		

		

		//print_r($services);
		//echo $time=microtime(true)-$time;


	





}