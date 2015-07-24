<?php

//fields of template, inclunding all tabs



$fields = $templates->field;


//print_r($fields);


$h = Array('title' => 'DATA',
    'items' => Array()
);


if (isset($import)) {
    $h['device'] = $templates->id;
    $h['templates'] = Array();
    $h['category'] = $category;
    $h['err'] = 'NO';
    foreach ($alltemplates as $temp) {

        array_push($h['templates'], array('id' => $temp->id, 'name' => $temp->name));
    }
}


$a = array();

foreach ($fields as $field) {

    //data of field ; fieldset
    /*
      'id'	=>$field['id'],
      'name'	=>$field['name'],
      'tab'	=>$field['tab'],
      'element'	=>$field['type'],
      'static'	=>$field['static'],
      'value'=>$field['value']
     */


    $val = '';
    if ($field['value'] != null) {
        $val = htmlspecialchars_decode($field['value']);
    }
    
    $extra = '';
    if ($field['extra'] != null) {
        $extra = $field['extra'];
    }


    $a = Array(
        'name' => $field['name'],
        'id' => $field['id'],
        'tab' => $field['tab'],
        'value' => $val,
        'struc' => $extra,
        'element' => $field['type'],
        'static' => $field['static'],
        'data' => Array(),
        'class' => "",
        'items' => null
    );

    //get images into array
    if ($field['type'] == 'img') {

        $a['items'] = Array();
        $imgs = $field->images;

        foreach ($imgs as $img) {
            $im = Array('id' => $img->id, 'type' => $img->type, 'tmpl' => 'true', 'w' => $img->width, 'h' => $img->height);

            array_push($a['items'], $im);
        }
    }

    if ($field['type'] == 'power_in') {
        $a['element'] = 'none';
        $a['nolegend'] = 'ok';
        $a['special'] = 'inpowerfield';

        $pdu = $field->power;
        if ($pdu) {

            $socs = Array();
            foreach ($pdu->socket as $socket) {
                array_push($socs, Array(
                    'id' => $socket->id,
                    'type' => $socket->type,
                    'conn_type' => $socket->conn_type,
                ));
            }


            $a['data'] = Array(
                'id' => $pdu['id'],
                'input' => $pdu['input'],
                'current' => 0,
                'output' => 0,
                'sockets' => $socs
            );
        }
    }


    if ($field['type'] == 'power_out') {
        $a['element'] = 'none';
        $a['nolegend'] = 'ok';
        $a['special'] = 'powerfield';

        $pdu = $field->power;
        if ($pdu) {
            $a['data'] = Array(
                'id' => $pdu->id,
                'input' => $pdu->input,
                'current' => $pdu->current,
                'output' => $pdu->output,
                'sockets' => Array()
            );

            foreach ($pdu->socket as $socket) {
                array_push($a['data']['sockets'], Array(
                    'id' => $socket->id,
                    'type' => $socket->type,
                    'conn_type' => $socket->conn_type,
                ));
            }
        }
    }


    if ($field['type'] == 'kvm_in') {
        $a['element'] = 'none';
        $a['nolegend'] = 'ok';
        $a['special'] = 'inkvmfield';

        $kvm = $field->kvm;
        if ($kvm) {
            $a['data'] = Array(
                'id' => $kvm->id,
                'input' => $kvm->input,
                'output' => $kvm->output,
                'sockets' => Array()
            );

            foreach ($kvm->socket as $socket) {
                array_push($a['data']['sockets'], Array(
                    'id' => $socket->id,
                    'type' => $socket->type,
                    'conn_type' => $socket->conn_type,
                ));
            }
        }
    }


    if ($field['type'] == 'kvm_out') {
        $a['element'] = 'none';
        $a['nolegend'] = 'ok';
        $a['special'] = 'kvmfield';

        $kvm = $field->kvm;
        if ($kvm) {
            $a['data'] = Array(
                'id' => $kvm->id,
                'input' => $kvm->input,
                'output' => $kvm->output,
                'sockets' => Array()
            );

            foreach ($kvm->socket as $socket) {
                array_push($a['data']['sockets'], Array(
                    'id' => $socket->id,
                    'type' => $socket->type,
                    'conn_type' => $socket->conn_type,
                ));
            }
        }
    }




    if ($field['type'] == 'network') {


        $a['element'] = 'none';
        $a['data'] = Array();

        if ($field->network) {

            $a['type'] = $field->network->type;
            switch ($field->network->type) {
                case 1:
                    //server ip tables

                    $a['special'] = 'ipfield';

                    $i = 1;

                    foreach ($field->network->ip as $ip) {

                        array_push($a['data'], Array('port' => Array(
                                'id' => $ip->id,
                                'n' => $i,
                                'name' => $ip->nic_name,
                                'ipv4' => $ip->ipv4,
                                'ipv6' => $ip->ipv6,
                                'conn_type' => $ip->conn_type,
                                'conn_speed' => $ip->conn_speed,
                                'type' => $ip->type
                                )));
                        $i++;
                    }


                    break;

                case 2:
                    $a['ips'] = Array();

                    $i = 1;
                    foreach ($field->network->ip as $ip) {

                        array_push($a['ips'], Array('port' => Array(
                                'id' => $ip->id,
                                'n' => $i,
                                'name' => $ip->nic_name,
                                'ipv4' => $ip->ipv4,
                                'ipv6' => $ip->ipv6,
                                'conn_type' => $ip->conn_type,
                                'conn_speed' => $ip->conn_speed,
                                'type' => $ip->type
                        )));
                        $i++;
                    }
                    $a['special'] = 'macfield';
                    $a['vlans'] = Array();


                    $i = 1;
                    foreach ($field->network->mac as $mac) {

                        $d = Array(
                            'n' => $i,
                            'id' => $mac->id,
                            'mac_addr' => $mac->mac_address,
                            'conn_dev' => $mac->conn_device,
                            'vlan' => $mac->vlan,
                            'type' => $mac->type
                        );
                        array_push($a['data'], $d);
                        $i++;
                    }


                    foreach ($field->network->vlan as $vlan) {

                        $d = Array(
                            'id' => $vlan->id,
                            'name' => $vlan->name
                        );
                        array_push($a['vlans'], $d);
                    }

                  
                    break;
                    
                case 3:
                    
                    $a['special'] = 'panelfield';
                    
                    $i = 1;
                    foreach ($field->network->mac as $mac) {

                        $d = Array(
                            'n' => $i,
                            'id' => $mac->id,
                            'mac_addr' => $mac->mac_address,
                            'conn_dev' => $mac->conn_device,
                            'vlan' => $mac->vlan,
                            'type' => $mac->type
                        );
                        array_push($a['data'], $d);
                        $i++;
                    }
                    
                    break;
            }
        }
    }


    array_push($h['items'], $a);



    /*

      $f=array(
      'id'	=>$field['id'],
      'name'	=>$field['name'],
      'tab'	=>$field['tab'],
      'element'	=>$field['type'],
      'static'	=>$field['static'],
      'value'=>$field['value']
      );
      array_push($a, $f);
     */
}








echo json_encode($h);


