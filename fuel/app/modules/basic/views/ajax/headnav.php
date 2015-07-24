<?php 
$b_data=array();


			foreach ($building as $b){ 
			
				$floors=$b->floor;
				
				$b_array=array(
				"name"	=>	$b['name'],
				"id"		=>  $b['id'],
				"rel"		=> "building",
				"floors"	=> array()	
				);
						
				
						//get floors array
						$f_data=array();
				
						foreach ($floors as $f){
						
							$rooms=$f->room;
							
							
							
							$f_array=array(
										"name"		=>	$f['name'],
										"id"		=>  $f['id'],
										"rel"		=> "floor",
										"rooms"		=> array()
											);
					
						
								$r_data=array();
							
								//get rooms array
								foreach ($rooms as $r){
          
								$r_array=array(
													"name"		=>	$r['name'],
													"id"		=>  $r['id'],
													"rel"		=> "room",
                                                                                                        "racks"         => count($r['rack'])
								);
								//add room array to floors
								
								array_push($r_data, $r_array);
								
								}
								
								$f_array['rooms']=$r_data;
							
								
								
								
								
						
							
						
							array_push($f_data, $f_array);
						}
						//add floor array to buildings
						$b_array['floors']=$f_data;
						array_push($b_data, $b_array);
						
						
			}
			
			/*
			$debug=array('debug' => 'Page rendered in {exec_time}s using {mem_usage}mb of memory.');
			array_push($b_data, $debug);
			*/
			
				 echo $json = json_encode($b_data);
			
			
				
			
			/*
				//object with floor data
			
				
				$floors=$b->floor;
			echo '{"sample":'.json_encode($floors).'}';
				echo'{
				"building"	:	"'.$b['name'].'" 
				"id"		:   "'.$b['id'].'"
				"items"		:	[';
	
						 
						//output all floors here
						foreach ($floors as $flor){
						//object with room data
						//$rooms=$flor->room;	
						
							{
			
							}
			
			 
							if(next($floors)){echo ',';}
						}
	
	?>
	
	
	
								]
				}

<?php
if(end($building)!=$b){echo ',';}	


					}

*/					
?>



