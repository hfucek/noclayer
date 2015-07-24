<?php

	$out=Array(
		'title'=>'KVM',
		'extend'=>'ok',
		'err'=>$err,
		'cables'=>Array(),
		'data'=>Array(),
		'items'=>Array(), //for first tab only, other tabs have self variable IP,MAC,VLAN...
);

	
		

	//cables
	
	foreach ($cables as $cable){
		$m=Array(
		'id'=>$cable->id,
		'dev1'=>$cable->dev1,
		'port1'=>$cable->port1,
		'port2'=>$cable->port2,
		'dev2'=>$cable->dev2,
		'name1'=>$cable->name1,
		'name2'=>$cable->name2,
		'type'=>$cable->type
		);
		array_push($out['cables'], $m);
	
	}	
	
	
	$out['data']=Array(
			'id'=>$kvm->id,
			'input'=>$kvm->input,
			'output'=>$kvm->output,
			'sockets'=>Array()
	);
	
	foreach($kvm->socket as $socket){
		array_push($out['data']['sockets'],Array(
			'id'=>$socket->id,
			'type'=>$socket->type,
			'conn_type'=>$socket->conn_type,
		));
			
	}
	
	
	$data=Array(
	Array(
	'title'=>'General',
	'items'=>Array(
					
					Array(
					'act'=>'act2',
					'field'=>'Number of input sockets',
					'value'=>$kvm->input,
					'element'=>'select',
					'min'=>1,
					'max'=>4,
					'width'=>135,
					'class'=>'port_select'
					),
					Array(
					'act'=>'act3',
					'field'=>'Number of output sockets',
					'value'=>$kvm->output,
					'element'=>'select',
					'min'=>1,
					'max'=>24,
					'width'=>135,
					'class'=>'port_select'
					)
		
	)),
		
		
		
	Array(
	'title'=>'Input Sockets',
	'items'=>Array(
					Array(
					'special'=>'kvmintable',
					'count'=>$kvm->input,
					'element'=>'none',
					'conn'=>0,	
									'class'=>'win_iptable',
									'trclass'=>'head',
									'attr'=>Array(
											'cellpadding'=>5,
											'cellspacing'=>0
										),
									'tr'=>Array(
									Array('name'=>'Socket','attr'=>Array('width'=>'10%'),'class'=>''),
									Array('name'=>'Connector Type','attr'=>Array('width'=>'30%'),'class'=>''),
									Array('name'=>'Connected Device','attr'=>Array('width'=>'60%'),'class'=>'')
									),
									'struct'=>Array(
									Array('el'=>'num','attr'=>Array('width'=>'10%'),'class'=>''),
									Array('el'=>'input','attr'=>Array('width'=>'30%'),'class'=>''),
									Array('el'=>'input','attr'=>Array('width'=>'50%'),'class'=>'')
									),
	'items'=>0
	)
		
	
	)),
	
	Array(
	'title'=>'Output Sockets',
	'items'=>Array(
						Array(
						'special'=>'kvmouttable',
						'count'=>$kvm->output,
						'element'=>'none',
						'conn'=>0,	
									'class'=>'win_iptable',
									'trclass'=>'head',
									'attr'=>Array(
											'cellpadding'=>5,
											'cellspacing'=>0
											),
									'tr'=>Array(
									Array('name'=>'Socket','attr'=>Array('width'=>'10%'),'class'=>''),
									Array('name'=>'Connector Type','attr'=>Array('width'=>'30%'),'class'=>''),
									Array('name'=>'Connected Device','attr'=>Array('width'=>'60%'),'class'=>'')
									),
									'struct'=>Array(
									Array('el'=>'num','attr'=>Array('width'=>'10%'),'class'=>''),
									Array('el'=>'input','attr'=>Array('width'=>'30%'),'class'=>''),
									Array('el'=>'input','attr'=>Array('width'=>'50%'),'class'=>'')
										),
	'items'=>0
	)
	
	
	))
	);
	/*
switch($net_type){
	
	case 1:
		
		
		$ipdata=Array();
		
		
		
		$i=1;
		foreach ($ips as $ip){
		
			$d=Array(
			'n'=>$i,
			'id'=>$ip->id,
			'name'=>$ip->nic_name,
			'ipv4'=>$ip->ipv4,
			'ipv6'=>$ip->ipv6,
			'conn_type'=>$ip->conn_type,
			'conn_speed'=>$ip->conn_speed,
			'type'=>$ip->type
			);
		array_push($ipdata, Array('port'=>$d));
		$i++;
		}
		
		
		$data=Array(
					Array(
					'title'=>'General',
					'items'=>Array(
							Array(
							'act'=>'act1',
							'field'=>'Number of NIC',
							'value'=>$net->nics,
							'element'=>'select',
							'min'=>0,
							'max'=>48,
							'width'=>135,
							'class'=>'port_select'
							),
							Array(
							'act'=>'act2',
							'field'=>'Number of virtual ports',
							'value'=>$net->vports,
							'element'=>'select',
							'min'=>0,
							'max'=>48,
							'width'=>135,
							'class'=>'port_select'
							)
					
					)),
					
					
					
					Array(
					'title'=>'Ports / IP Adrresses',
					'items'=>Array(
							Array(
							'special'=>'iptable',
							'count'=>$net->nics,
							'element'=>'none',
							'class'=>'win_iptable win_table_small',
							'conn'=>$conn,
							'trclass'=>'head',
							'attr'=>Array(
									'cellpadding'=>0,
									'cellspacing'=>0
									),
							'items'=>$ipdata
					)
					
						
					))
		);
		break;
	case 2:
	//switch(FC) and router
		
		$macdata=Array();
		$vlandata=Array();
		
		
		$i=1;
		foreach ($macs as $mac){
		
			$d=Array(
					'n'=>$i,
					'id'=>$mac->id,
					'mac_addr'=>$mac->mac_address,
					'conn_dev'=>$mac->conn_device,
					'vlan'=>$mac->vlan,
					'type'=>$mac->type
			);
			array_push($macdata, $d);
			$i++;
		}
		
		$out['data']=$macdata;
		
		foreach ($vlans as $vlan){
		
			$dd=Array(
							'id'=>$vlan->id,
							'name'=>$vlan->name
		);
			array_push($vlandata, $dd);
			
		}
		
		
		
		
		$data=Array(
					Array(
					'title'=>'General',
					'items'=>Array(
							Array(
							'act'=>'act3',
							'field'=>'Number of ports',
							'value'=>$net->ports,
							'element'=>'select',
							'min'=>0,
							'max'=>48,
							'width'=>135,
							'class'=>'port_select'
							),
							Array(
							'act'=>'act4',
							'field'=>'Number of uplink ports',
							'element'=>'select',	
							'value'=>$net->uplinks,
							'min'=>0,
							'max'=>4,
							'width'=>135,
							'class'=>'port_select'
							)
					
					)),
		
					Array(
							'title'=>'Ports',
							'items'=>Array(
								Array(
									'special'=>'mactable',
									'count'=>$net->ports+$net->uplinks,
									'element'=>'none',
									'class'=>'win_iptable',
									'trclass'=>'head',
									'attr'=>Array(
											'cellpadding'=>5,
											'cellspacing'=>0
										),
									'tr'=>Array(
									Array('name'=>'Port','attr'=>Array('width'=>'10%'),'class'=>''),
									Array('name'=>'MAC addresses','attr'=>Array('width'=>'30%'),'class'=>''),
									Array('name'=>'Connected Device','attr'=>Array('width'=>'60%'),'class'=>'')
									),
									'struct'=>Array(
									Array('el'=>'num','attr'=>Array('width'=>'10%'),'class'=>''),
									Array('el'=>'input','attr'=>Array('width'=>'30%'),'class'=>''),
									Array('el'=>'input','attr'=>Array('width'=>'50%'),'class'=>'')
									)
									
								)
							)),
					Array(
							'title'=>'Vlans',
							'items'=>Array(
									Array(
									
									'special'=>'vlan',
									'ports'=>$net->ports+$net->uplinks,
									'element'=>'none',
									'class'=>'',
									'items'=>$vlandata
									
			
									)
							)),
					Array(
							'title'=>'Config data',
							'items'=>Array(
										Array(
											'special'=>'config',
											'field'=>'Config file of switch',
											'element'=>'none',
											'class'=>'text_notes',
											'values'=>$net->config_data
			
						)
						))
		
		);
		break;
	default:
		
		break;	
		
	
}


*/
$out['items']=$data;

$debug=array('debug' => 'Page rendered in {exec_time}s using {mem_usage}mb of memory.');
array_push($out, $debug);
	
echo json_encode($out);


/*
 * 
 * 
 *
 
 
 
 
 * 
 * 
 * 
{ 

"title": "Switch", 
"type":1, 
"extend":"ok", 

"items" :[ 
{ "title": "General", "items" : [ { "field":"Number of NIC", "value" :
"2", "element": "input", "class": "size_medium" }, { "field":"Number of
virtual ports", "value" : "2", "element": "input", "class":
"size_medium" } ] }, 

{ "title": "Ports / IP adrresses", "items" : [ {
"element": "none", 
"special":"iptable", 
"count": 4, 
"class":"win_iptable win_table_small", 
"trclass": "head", 
"attr":{
	"cellpadding":0 ,"cellspacing":0}, 
"tr" : [ { "name":"Port", "attr":{
"width":"20%"}, "class": "" }, { "name":"DATA", "attr":{ "width":"75%"},
"class": "" } ] } ] } ] }
*/
?>

