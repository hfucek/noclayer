<?php

//initaial array setup
$racks_arr = array(
    "title" => 'Racks',
    "items" => array()
);

//object that contain rooms equipment
$racks = $room->rack;

//main array items of rack 
$racks_data = array();

foreach ($racks as $rack) {
    
    //array with one rack equ
    $onerack_arr = array(
        "name" => $rack['name'],
        "units" => $rack['size'],
        "id" => $rack['id'],
        "position" => $rack['position'], 
        "equs" => array()
    );
    

    //array with all devices in rack 
    $device_data = array();
    //object with devices
    $devices = $rack->device;

    foreach ($devices as $device) {

        $network = $device->network;



        //one device array 
        $device_arr = array(
            "id" => $device['id'],
            "position" => $device['rack_pos'],
            "units" => $device['rack_units'],
            "type" => $device['type'],
            "cat" => $device['cat'],
            "host" => $device['hostname'],
            "vports" => 0,
            "ports" => 0,
            "nics" => 0,
            "mount" => $device['meta_default_data'],
            "uplinks" => 0,
            "power" => Array(),
            "kvm" => Array(),
            "parent" => $device['parent_device']
        );


        $pdu = $device->power;
        if ($pdu) {

            $socs = Array();
            foreach ($pdu->socket as $soc) {
                array_push($socs, Array('id' => $soc->id, 'ct' => $soc->conn_type, 'type' => $soc->type));
            }

            array_push($device_arr['power'], Array(
                'id' => $pdu['id'],
                'input' => $pdu['input'],
                'output' => $pdu['output'],
                'pos' => $pdu['pos'],
                'socket' => $socs
            ));
        }

        $kvm = $device->kvm;
        if ($kvm) {

            $socs = Array();
            foreach ($kvm->socket as $soc) {
                array_push($socs, Array('id' => $soc->id, 'ct' => $soc->conn_type, 'type' => $soc->type));
            }

            array_push($device_arr['kvm'], Array(
                'id' => $kvm['id'],
                'input' => $kvm['input'],
                'output' => $kvm['output'],
                'socket' => $socs
            ));
        }






        foreach ($network as $net) {
            $device_arr['ports'] = $net['ports'];
            $device_arr['vports'] = $net['vports'];
            $device_arr['nics'] = $net['nics'];
            $device_arr['uplinks'] = $net['uplinks'];
        }




        //add device to array with others
        array_push($device_data, $device_arr);
    }

    $onerack_arr['equs'] = $device_data;




    //add one rack to array with others
    //array_push($racks_data, $onerack_arr);
    $racks_data[$rack->room_pos] = $onerack_arr;
}

//main array items 	
$racks_arr['items'] = $racks_data;

//$cabledata=Array();



$racks_arr['cables'] = $cabledata;


$debug = array('debug' => 'Page rendered in {exec_time}s using {mem_usage}mb of memory.');
array_push($racks_arr, $debug);

//print_r($racks_arr);
//display json data
echo $json = json_encode($racks_arr);

