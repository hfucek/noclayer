<?php

namespace Basic;

class Controller_Search extends Basic {

    public function before() {

        parent::before();
    }

    public function action_details() {
        $out = Array(
            'type' => 0,
            'room' => 0,
            'rack' => 0,
            'pos' => 0,
            'did' => 0
        );
        $type = false;
        $tid = false;
        if (isset($_GET['type']))
            $type = $_GET['type'];
        if (isset($_GET['tid']))
            $tid = $_GET['tid'];

        if ($type and $tid) {
            switch ($type) {
                //device hostname
                case 1:
                    $device = Model_Device::find($tid);

                    break;

                //buildings
                case 2:

                    break;

                //floors
                case 3:

                    break;

                //rooms
                case 4:

                    break;

                //fields
                case 5:

                    break;
            }

            echo json_encode(Array('aaa' => 'aaas', 'm' => 'ok'));
        }
    }

    public function action_index() {


        $out = Array(
        );

        if (count($_GET) > 0) {
            /*
              'buildings'=>Array(),
              'rooms'=>Array(),
              'floors'=>Array(),
              'buildings'=>Array(),
              'fields'=>Array() */

            $key = false;
            if (isset($_GET['key']))
                $key = $_GET['key'];
            if ($key) {
                $key_right = $key . '%';
                $key = '%' . $key . '%';



                //device hostname
                $device = Model_Device::find()->where('hostname', 'like', $key)->limit(5)->where('meta_update_user', $this->user)->get();

                $m = Array('type' => 'Device', 'tn' => 1, 'items' => Array());

                foreach ($device as $dev) {

                    $rack = $dev->racks;
                    $room = $rack->rooms;
                    array_push($m['items'], Array(
                        'id' => $dev->id,
                        'name' => $dev->hostname,
                        'room' => $room->id,
                        'rack' => $rack->id,
                        'floor' => $room->floors->id,
                        'building' => $room->floors->buildings->id,
                    ));
                }

                array_push($out, $m);


                //buildings
                $buildings = Model_Building::find()->where('name', 'like', $key)->where('meta_update_user', $this->user)->limit(5)->get();

                $m = Array('type' => 'Building', 'tn' => 2, 'items' => Array());

                foreach ($buildings as $bui) {
                    array_push($m['items'], Array(
                        'id' => $bui->id,
                        'name' => $bui->name
                    ));
                }
                array_push($out, $m);


                //floors
                $floors = Model_Floor::find()->where('name', 'like', $key)->where('meta_update_user', $this->user)->limit(5)->get();

                $m = Array('type' => 'Floor', 'tn' => 3, 'items' => Array());

                foreach ($floors as $fl) {
                    array_push($m['items'], Array(
                        'id' => $fl->id,
                        'name' => $fl->name,
                        'building' => $fl->buildings->id,
                    ));
                }
                array_push($out, $m);


                //rooms
                $rooms = Model_Room::find()->where('name', 'like', $key)->where('meta_update_user', $this->user)->limit(5)->get();

                $m = Array('type' => 'Room', 'tn' => 4, 'items' => Array());

                foreach ($rooms as $rm) {
                    array_push($m['items'], Array(
                        'id' => $rm->id,
                        'name' => $rm->name,
                        'floor' => $rm->floors->id,
                        'building' => $rm->floors->buildings->id,
                    ));
                }
                array_push($out, $m);



                //racks
                $rack = Model_Rack::find()->where('name', 'like', $key)->where('meta_update_user', $this->user)->limit(5)->get();

                $m = Array('type' => 'Rack', 'tn' => 5, 'items' => Array());

                foreach ($rack as $rm) {
                    array_push($m['items'], Array(
                        'id' => $rm->id,
                        'name' => $rm->name,
                        'floor' => $rm->rooms->floors->id,
                        'room' => $rm->rooms->id,
                        'building' => $rm->rooms->floors->buildings->id
                    ));
                }
                array_push($out, $m);



                //ip address


                $query = \DB::query('select distinct * from network_ip_ports where ipv4 like "' . $key_right . '" group by networkID limit 0,5');

                $ips = $query->as_object()->execute();


                foreach ($ips as $ip) {


                    $tab=($ip->type==3)?6:2;
                 

                    $network = Model_Device_Network::find()->where('id', $ip->networkID)->get_one();

                    $device = $network->device;

                    $m = Array('type' => 'IPv4', 'tn' => 6, 'items' => Array());
                    $room = $device->racks->rooms;
                    array_push($m['items'], Array(
                        'id' => $ip->id,
                        'name' => $ip->ipv4,
                        'room' => $device->racks->rooms->id,
                        'rack' => $device->racks->id,
                        'building' => $room->floors->buildings->id,
                        'floor' => $room->floors->id,
                        'tab' => $tab,
                        'dev' => $device->id,
                    ));
                    array_push($out, $m);
                }
			
                //raid
		$query = \DB::query('select df.id, df.name, df.tab, df.deviceID, d.hostname, df.value, hrd.model, hrd.serial_number, hrd.id as "rid" from device as d join device_fieldset as df on df.deviceID = d.id join hardware_raid AS hr on hr.fieldsetID = df.id join hardware_raid_data as hrd on hrd.hardware_raid = hr.id where hrd.model like "' . $key . '" or hrd.serial_number like "' . $key . '" group by hrd.serial_number, hrd.model');	
		
                $raid = $query->as_object()->execute();
					
                foreach ($raid as $fd) {
					
                    $device = Model_Device::find($fd->deviceID);

                    $m = Array('type' => $fd->name, 'tn' => 6, 'items' => Array());
                    $room = $device->racks->rooms;
					
                    array_push($m['items'],Array(
                        'id' => $fd->id,
                        'name' => $fd->value,
                        'room' => $device->racks->rooms->id,
                        'rack' => $device->racks->id,
                        'building' => $room->floors->buildings->id,
                        'floor' => $room->floors->id,
                        'tab' => $fd->tab,
                        'dev' => $fd->deviceID,
			'hostname' => $fd->hostname,
			'model' => $fd->model,
			'serial' => $fd->serial_number,
			'rid' => $fd->rid,
		    ));
                    array_push($out, $m);
                }
                
                $notes = Model_Notes::find()->where('txt', 'like', $key)->where('meta_update_user', $this->user)->limit(5)->get();

                $m = Array('type' => 'Device Notes', 'tn' => 7, 'items' => Array());


                foreach ($notes as $note) {

                    $device = $note->device;

                    $room = $device->racks->rooms;
                    array_push($m['items'], Array(
                        'id' => $note->id,
                        'name' => substr($note->txt, -100),
                        'room' => $device->racks->rooms->id,
                        'rack' => $device->racks->id,
                        'building' => $room->floors->buildings->id,
                        'floor' => $room->floors->id,
                        'tab' => 4,
                        'dev' => $device->id,
                    ));
                }
                array_push($out, $m);
                
                
                
                //ram
		$query = \DB::query('select df.id, df.name, df.tab, df.deviceID, d.hostname, df.value, hrd.model, hrd.serial_number, hrd.id as "rid" from device as d join device_fieldset as df on df.deviceID = d.id join hardware_ram AS hr on hr.fieldsetID = df.id join hardware_ram_data as hrd on hrd.hardware_ram = hr.id where hrd.model like "' . $key . '" or hrd.serial_number like "' . $key . '" group by hrd.serial_number, hrd.model');	
		
                $ram = $query->as_object()->execute();
					
                foreach ($ram as $fd) {
					
                    $device = Model_Device::find($fd->deviceID);

                    $m = Array('type' => $fd->name, 'tn' => 8, 'items' => Array());
                    $room = $device->racks->rooms;
					
                    array_push($m['items'],Array(
                        'id' => $fd->id,
                        'name' => $fd->value,
                        'room' => $device->racks->rooms->id,
                        'rack' => $device->racks->id,
                        'building' => $room->floors->buildings->id,
                        'floor' => $room->floors->id,
                        'tab' => $fd->tab,
                        'dev' => $fd->deviceID,
			'hostname' => $fd->hostname,
			'model' => $fd->model,
			'serial' => $fd->serial_number,
			'rid' => $fd->rid,
		    ));
                    array_push($out, $m);
                }
            }
            echo json_encode($out);
        }
    }

}