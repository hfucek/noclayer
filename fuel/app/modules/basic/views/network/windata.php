<?php

$out = Array(
    'title' => 'Network',
    'type' => $net_type,
    'ctype' => $con_type,
    'extend' => 'ok',
    'cables' => Array(),
    'data' => Array(),
    'items' => Array(), //for first tab only, other tabs have self variable IP,MAC,VLAN...
);




//cables

foreach ($cables as $cable) {
   
   $dev1=  \Basic\Model_Device::find($cable->dev1); 
   $dev2=  \Basic\Model_Device::find($cable->dev2); 
   $m = Array(
        'id' => $cable->id,
        'dev1' => $cable->dev1,
        'port1' => $cable->port1,
        'port2' => $cable->port2,
        'dev2' => $cable->dev2,
        'name1' => $cable->name1,
        'name2' => $cable->name2,
        'type' => $cable->type,
        'devname1'=>$dev1->hostname,
        'devname2'=>$dev2->hostname,
    );
    array_push($out['cables'], $m);
}



switch ($net_type) {

    case 1:


        $ipdata = Array();



        $i = 1;
        foreach ($ips as $ip) {

            $d = Array(
                'n' => $i,
                'id' => $ip->id,
                'name' => $ip->nic_name,
                'ipv4' => $ip->ipv4,
                'ipv6' => $ip->ipv6,
                'conn_type' => $ip->conn_type,
                'conn_speed' => $ip->conn_speed,
                'type' => $ip->type
            );
            array_push($ipdata, Array('port' => $d));
            $i++;
        }


        $data = Array(
            Array(
                'title' => 'General',
                'items' => Array(
                    Array(
                        'act' => 'act1',
                        'field' => 'Number of NIC',
                        'value' => $net->nics,
                        'element' => 'select',
                        'min' => 0,
                        'max' => 48,
                        'width' => 135,
                        'class' => 'port_select'
                    ),
                    Array(
                        'act' => 'act2',
                        'field' => 'Number of virtual ports',
                        'value' => $net->vports,
                        'element' => 'select',
                        'min' => 0,
                        'max' => 48,
                        'width' => 135,
                        'class' => 'port_select'
                    )
            )),
            Array(
                'title' => 'Ports / IP Adrresses',
                'items' => Array(
                    Array(
                        'special' => 'iptable',
                        'count' => $net->nics,
                        'element' => 'none',
                        'class' => 'win_iptable win_table_small',
                        'conn' => $conn,
                        'trclass' => 'head',
                        'attr' => Array(
                            'cellpadding' => 0,
                            'cellspacing' => 0
                        ),
                        'items' => $ipdata
                    )
            ))
        );
        break;
    case 2:
        //switch(FC) and router

        $macdata = Array();
        $vlandata = Array();
        $ipdata = Array();



        $i = 1;
        foreach ($ips as $ip) {

            $d = Array(
                'n' => $i,
                'id' => $ip->id,
                'name' => $ip->nic_name,
                'ipv4' => $ip->ipv4,
                'ipv6' => $ip->ipv6,
                'conn_type' => $ip->conn_type,
                'conn_speed' => $ip->conn_speed,
                'type' => $ip->type
            );
            array_push($ipdata, Array('port' => $d));
            $i++;
        }
        $out['ips'] = $ipdata;

        $i = 1;
        foreach ($macs as $mac) {

            $d = Array(
                'n' => $i,
                'id' => $mac->id,
                'mac_addr' => $mac->mac_address,
                'conn_dev' => $mac->conn_device,
                'vlan' => $mac->vlan,
                'type' => $mac->type
            );
            array_push($macdata, $d);
            $i++;
        }

        $out['data'] = $macdata;

        foreach ($vlans as $vlan) {

            $dd = Array(
                'id' => $vlan->id,
                'name' => $vlan->name
            );
            array_push($vlandata, $dd);
        }




        $data = Array(
            Array(
                'title' => 'General',
                'items' => Array(
                    Array(
                        'act' => 'act3',
                        'field' => 'Number of ports',
                        'value' => $net->ports,
                        'element' => 'select',
                        'min' => 0,
                        'max' => 48,
                        'width' => 135,
                        'class' => 'port_select'
                    ),
                    Array(
                        'act' => 'act4',
                        'field' => 'Number of uplink ports',
                        'element' => 'select',
                        'value' => $net->uplinks,
                        'min' => 0,
                        'max' => 4,
                        'width' => 135,
                        'class' => 'port_select'
                    )
                    ,
                    Array(
                        'act' => 'act2',
                        'field' => 'Management IP ports',
                        'value' => $net->vports,
                        'element' => 'select',
                        'min' => 0,
                        'max' => 48,
                        'width' => 135,
                        'class' => 'port_select'
                    )
            )),
            Array(
                'title' => 'Ports',
                'items' => Array(
                    Array(
                        'special' => 'mactable',
                        'count' => $net->ports + $net->uplinks,
                        'element' => 'none',
                        'class' => 'win_iptable',
                        'trclass' => 'head',
                        'attr' => Array(
                            'cellpadding' => 5,
                            'cellspacing' => 0
                        ),
                        'tr' => Array(
                            Array('name' => 'Port', 'attr' => Array('width' => '10%'), 'class' => ''),
                            Array('name' => 'MAC addresses', 'attr' => Array('width' => '30%'), 'class' => ''),
                            Array('name' => 'Connected Device', 'attr' => Array('width' => '60%'), 'class' => '')
                        ),
                        'struct' => Array(
                            Array('el' => 'num', 'attr' => Array('width' => '10%'), 'class' => ''),
                            Array('el' => 'input', 'attr' => Array('width' => '30%'), 'class' => ''),
                            Array('el' => 'input', 'attr' => Array('width' => '50%'), 'class' => '')
                        )
                    )
            )),
            Array(
                'title' => 'IP Adrresses',
                'items' => Array(
                    Array(
                        'special' => 'iptable',
                        'count' => $net->nics,
                        'element' => 'none',
                        'class' => 'win_iptable win_table_small',
                        'conn' => $conn,
                        'trclass' => 'head',
                        'attr' => Array(
                            'cellpadding' => 0,
                            'cellspacing' => 0
                        ),
                        'items' => $ipdata
                    )
            )),
            Array(
                'title' => 'Vlans',
                'items' => Array(
                    Array(
                        'special' => 'vlan',
                        'ports' => $net->ports + $net->uplinks,
                        'element' => 'none',
                        'class' => '',
                        'items' => $vlandata
                    )
            )),
            Array(
                'title' => 'Config data',
                'items' => Array(
                    Array(
                        'special' => 'config',
                        'field' => 'Config file of switch',
                        'element' => 'none',
                        'class' => 'text_notes',
                        'values' => $net->config_data
                    )
            ))
        );
        break;
        
    case 3:
        
        // pach panel
        $ipdata = Array();
        $macdata = Array();
        
        $i = 1;
        foreach ($macs as $mac) {

            $cab1 = \Basic\Model_Cable::find()->where('port1',$mac->id)->get();
            $cab2 = \Basic\Model_Cable::find()->where('port2',$mac->id)->get();
                    
            $dev11=\Basic\Model_Device::find()->where('id',$cab1->dev1);
            $dev12=\Basic\Model_Device::find()->where('id',$cab1->dev2);
                    
            $dev21=\Basic\Model_Device::find()->where('id',$cab2->dev1);
            $dev22=\Basic\Model_Device::find()->where('id',$cab2->dev2);   
                    
            $d = Array(
                'n' => $i,
                'id' => $mac->id,
                'mac_addr' => $mac->mac_address,
                'conn_dev' => $mac->conn_device,
                'type' => $mac->type,
                'vlan' => $mac->vlan,
                'devname11' => $dev11->hostname,
                'devname12' => $dev12->hostname,
                'devname21' => $dev21->hostname,
                'devname22' => $dev22->hostname,
            );
            array_push($macdata, $d);
            $i++;
        }
        
        $out['data'] = $macdata;
        
        
        $data = Array(
            Array(
                'title' => 'General',
                'items' => Array(
                    Array(
                        'act' => 'act6',
                        'field' => 'Number of ports',
                        'value' => $net->ports/2,
                        'element' => 'select',
                        'min' => 0,
                        'max' => 48,
                        'width' => 135,
                        'class' => 'port_select'
                    )
            )),
            Array(
                'title' => 'Ports',
                'items' => Array(
                    Array(
                        'special' => 'paneltable',
                        'count' => $net->ports + $net->uplinks,
                        'element' => 'none',
                        'class' => 'win_iptable',
                        'trclass' => 'head',
                        'items' => $macdata,
                        'conn' => $conn,
                        'attr' => Array(
                            'cellpadding' => 5,
                            'cellspacing' => 0
                        ),
                        'tr' => Array(
                            Array('name' => 'Port', 'attr' => Array('width' => '10%'), 'class' => ''),
                            Array('name' => 'Patch panel', 'attr' => Array('width' => '35%'), 'class' => ''),
                            Array('name' => 'Network port', 'attr' => Array('width' => '35%'), 'class' => ''),
                            Array('name' => 'Connector', 'attr' => Array('width' => '20%'), 'class' => '')
                        ),
                        'struct' => Array(
                            Array('el' => 'num', 'attr' => Array('width' => '10%'), 'class' => ''),
                            Array('el' => 'input', 'attr' => Array('width' => '35%'), 'class' => ''),
                            Array('el' => 'input', 'attr' => Array('width' => '35%'), 'class' => ''),
                            Array('el' => 'select', 'attr' => Array('width' => '20%'), 'class' => '')
                        )
                    )
            ))
        );

        break;
        
    default:

        break;
}


$out['items'] = $data;

$debug = array('debug' => 'Page rendered in {exec_time}s using {mem_usage}mb of memory.');
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

