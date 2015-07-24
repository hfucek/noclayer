<?php
namespace Munin;

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
		
		 $this->make($data);
	
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
		
	//print_r($data);
		
		
		//get all tables from DOM
		$trs=$this->dom->getElementsByTagName('img');
		
		
		
		//loop
		foreach ($trs as $tr){
			
			
			
			
			//only table with status class
			if($tr->hasAttribute('src')){
				$name=$tr->getAttribute('src');
				$n= explode('/',$name);
                                $img=array_pop($n);
                                $ob=explode('-day.png',$img);
                                if(count($ob)>1){
                                    array_push($this->graphs,  $img);
                                }
                                
                                
				
				
				
				
			}
		
		}
			
			
		
		
		
	}




		

		

		//print_r($services);
		//echo $time=microtime(true)-$time;


	





}