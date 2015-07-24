
<?php

$h = Array('title' => 'DATA',
    'items' => Array()
);

foreach ($fields as $field) {
    
    $val = '';
    if ($field['value'] != null) {
        $val = htmlspecialchars_decode($field['value']);
    }
    $extra = '';
    if ($field['extra'] != null) {
        $extra = $field['extra'];
    }

    $a = Array(
        'field' => $field['name'],
        'eid' => $field['id'],
        'static' => $field['static'],
        'value' => $val,
        'struc' => $extra,
        'element' => $field['type'],
        'class' => "",
        'items' => null
    );
    //get images into array
    if ($field['type'] == 'checkbox') {
        $a['action'] = 'device';
    }
    
    
    //get hdd into array

    if ($field['type'] == 'hdd') {

        $a['items'] = Array();


        $hdds = $field->hdd;

        $a['raid_type'] = $hdds->raid_type;
        $a['size'] = $hdds->size;
        $a['total'] = $hdds->total;

        foreach ($hdds->rows as $hdd) {

            $m = Array(
                'model' => $hdd['model'],
                'size' => $hdd['size'],
                'vport' => $hdd['vport'],
                'serial_number' => $hdd['serial_number']
            );
            array_push($a['items'], $m);
        }
    }

    //get ram into array

    if ($field['type'] == 'ram') {

        $a['items'] = Array();


        $rams = $field->ram;
        $a['ram_type'] = $rams->ram_type;
        $a['size'] = $rams->size;

        $a['total'] = $rams->total;
        foreach ($rams->rows as $ram) {

            $m = Array(
                'model' => $ram['model'],
                'size' => $ram['size'],
                'port' => $ram['port'],
                'serial_number' => $ram['serial_number']
            );
            array_push($a['items'], $m);
        }
    }


    //get images into array 
    if ($field['type'] == 'img') {
        $a['items'] = Array();
        $imgs = $field->images;

        foreach ($imgs as $img) {
            $im = Array('id' => $img->id, 'type' => $img->type, 'w' => $img->width, 'h' => $img->height);

            array_push($a['items'], $im);
        }
    }

    /*
     * Power distribution
     * */

    if ($field['type'] == 'power_in') {
        $a['element'] = 'none';
        $a['nolegend'] = 'ok';
        $a['special'] = 'inpowerfield';

        $pdu = $device->power;
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





    if ($field['type'] == 'power_out') {
        $a['element'] = 'none';
        $a['nolegend'] = 'ok';
        $a['special'] = 'powerfield';

        $pdu = $device->power;
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

    /*
     * KVM distribution
     * */

    if ($field['type'] == 'kvm_in') {
        $a['element'] = 'none';
        $a['nolegend'] = 'ok';
        $a['special'] = 'inkvmfield';

        $kvm = $device->kvm;
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


    if ($field['type'] == 'kvm_out') {
        $a['element'] = 'none';
        $a['nolegend'] = 'ok';
        $a['special'] = 'kvmfield';

        $kvm = $device->kvm;
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
    
    
    if ($field['type'] == 'network') {

        $a['element'] = 'none';
        $a['data'] = Array();
        $a['cables'] = Array();

        if ($field->network) {

            //cables

            foreach ($cables as $cable) {
                $m = Array(
                    'id' => $cable->id,
                    'dev1' => $cable->dev1,
                    'port1' => $cable->port1,
                    'port2' => $cable->port2,
                    'dev2' => $cable->dev2,
                    'name1' => $cable->name1,
                    'name2' => $cable->name2,
                    'type' => $cable->type
                );
                array_push($a['cables'], $m);
            }

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
                    $a['vlans'] = Array();
                    $a['data'] = Array();
                    
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
}
echo json_encode($h);



/*
  {
  "title": "Hardware",
  "items" : [
  {
  "field":"Manufacturer",
  "value" : "Cisco",
  "element": "input",
  "class": ""
  },
  {
  "field":"Model",
  "value" : "WR 604",
  "element": "input",
  "class": ""
  },

  {
  "field":"CPU",
  "value" : "Pentium 100Mhz",
  "element": "input",
  "class": ""
  },

  {
  "element":"div",
  "class":"float_field",
  "items": [
  {


  "field":"RAM",
  "value" : "4x2GB Kingston",
  "element": "input",
  "class": "size_medium2"
  },
  {

  "field":"Part Number",
  "value" : "12121122112",
  "element": "input",
  "class": "size_medium2"
  }]

  },

  {
  "element":"div",
  "class":"input_button_set",
  "items": [
  {


  "field":"HDD / RAID",
  "element":"none",
  "items" :
  [
  {
  "value" : "RAID-1 size:279.39 GB",
  "element": "input",
  "disabled":"true"


  },
  {
  "value" : "",
  "element": "div",
  "action":"RAID.init(this)",
  "class": "icon_button edit_icon"
  }



  ]

  }]
  }]
  }
 */
?>	