<?php
namespace Nagios;

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

	public $services=Array();

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

	public function __construct($data,$total){
		$this->total=$total;
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

$this->host=0;

		//get all tables from DOM
		$tables=$this->dom->getElementsByTagName('table');


		//loop
		foreach ($tables as $table){
			//only table with status class

			
			
			if($table->hasAttribute('class') or $table->hasAttribute('CLASS')){
				if($table->getAttribute('class')=='status' or $table->getAttribute('CLASS')=='status'){

					//get all tr from table
					$tr=$table->getElementsByTagName('tr');

					//length of tr array
					$length = $tr->length;



					for ($i=0;$i<=$length;$i++){

						//tr
						$row=$tr->item($i);

						//only if row is not empty
						if($row->childNodes <>0){

							//relative path of tr
							$path=explode('/',$row->getNodePath());

							
							
							//use tr if length of path is 5
							if(count($path)==5 or count($path)==6){

								if($row->childNodes->length>1){

									//echo '<div style="color:silver;">'.$m->nodeValue.'</div>';

									$tds=$row->getElementsByTagName('td');

									$ii=0;

									//$services[$host]=Array();
									
									foreach ($tds as $td) {

										$path=explode('/',$td->getNodePath());
										
										
										if(count($path)==6 or count($path)==7){

											if($ii==0 and strlen($td->nodeValue)>0){
												$this->host++;

												$this->hosts[$this->host]=str_replace('&Acirc;&nbsp;','',trim(htmlentities($td->nodeValue)));
												$this->service=0;
												
												$this->services[$this->host]=Array('hostname'=>$this->hosts[$this->host]);
												$this->status[$this->host]=Array();
												

											}else{
												if($ii==0 and strlen($td->nodeValue)==0){
													$this->service++;	}
													//$services[$host]=Array();
											}

											if($ii==2){
												$this->status[$this->host][$this->service]=str_replace('status','',$td->getAttribute('class'));
											}

											$this->services[$this->host][$this->service][$ii]=str_replace('&Acirc;&nbsp;','',trim(htmlentities($td->nodeValue)));

											//echo '<span style="color:red;">'.count($path).$td->getNodePath().'</span>';

											//echo '<div style="color:green;">'.$td->nodeValue.'</div>';
											$ii++;
										}}


										//echo'<br>===================================================================<br>';
								}



							}

						}}
						break;
				}
				
				
				//HOST STATUS TOTALS
				if($table->getAttribute('class')=='hostTotals' or $table->getAttribute('CLASS')=='hostTotals'){
					
					
					$td=$table->getElementsByTagName('td');
					
					foreach ($td as $t) {
						$name=$t->getAttribute('class');
						$value=str_replace('&Acirc;&nbsp;','',trim(htmlentities($t->nodeValue)));
					
						
						$this->total[$name]+=$value;	
						
						
						
					}
					
				}
				
				
				//SERVICES STATUS TOTALS
				if($table->getAttribute('class')=='serviceTotals' or $table->getAttribute('CLASS')=='serviceTotals'){
					
					$td=$table->getElementsByTagName('td');
				
					
					foreach ($td as $t) {
						$name=$t->getAttribute('class');
						$value=str_replace('&Acirc;&nbsp;','',trim(htmlentities($t->nodeValue)));
					$this->total[$name]+=$value;	
						
						
						
					}
					
					
				}
				
				
				

			}
		}




		//print_r($hosts);

		

		//print_r($services);
		//echo $time=microtime(true)-$time;


	}





}