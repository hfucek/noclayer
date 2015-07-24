<?php
namespace Basic;
class Controller_Domain_Ip extends Controller_Domain{

	public function before(){

		parent::before();
	}
	
	
	private function vps($vpss){
if(!$vpss) return Array();
		$data=Array();
		
		foreach ($vpss as $vps){
		
			$ipdata=Array();
			$ips=$vps->ips;
			foreach ($ips as $ip){
				array_push($ipdata, array('data'=>$ip->data));
			}
			
			array_push($data, array('id'=>$vps->id,'host'=>$vps->hostname,'ips'=>$ipdata));
			
			
		}
	return $data;	
	}
	
	
	
	public function action_index(){
		


		
$ip_data=Model_Network_Ip::find()
->related('network')
->related('network.device')
->where('network.device.meta_update_user',$this->user)
->order_by(\DB::expr('INET_ATON(ipv4)'),'asc')
->get();






//$ip_data=Model_Network_Ip::find()->order_by(DB::expr('INET_ATON(ipv4)'),'asc')->get();

$out=Array('data'=>Array());
foreach ($ip_data as $ip){

	$vpsdata=Array();
	$vps=$ip->network->device->vps;
	
$d=Array(
'ip'=>$ip['ipv4'],
'host'=>$ip->network->device->hostname,
'vps'=>$this->vps($vps)
);



if($ip['ipv4']!='')
array_push($out['data'], $d);	
	
}
	
	



		
		
	echo json_encode($out); 	
	}


}