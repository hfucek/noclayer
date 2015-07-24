<?php

namespace Basic;

class Controller_Migrations_Monkey extends \Controller_Login {

    private function insertStaticField($name, $type, $tab, $device, $static) {



        $field = New \Basic\Model_Device_Fieldset();
        $field->name = $name;
        $field->type = $type[0];
        $field->static = $static;
        $field->deviceID = $device->id;
        $field->tab = $tab;

        if ($type[1] != null)
            $field->extra = $type[1];
        if ($type[2] != null)
            $field->value = $type[2];


        $field->save();


        if ($type == 'network') {

            $prop = Array(
                'fieldsetID' => $field->id,
                'deviceID' => $field->device->id,
                'nics' => 0,
                'vports' => 0,
                'ports' => 0,
                'uplinks' => 0,
                'config_data' => '',
                'type' => $this->net_type
            );

            $network = new \Basic\Model_Device_Network($prop);
            //$network->save();
        }

        return true;
    }

    private function add_device_default_fields($device, $data) {

        //template or device
        if (isset($device->categoryID))
            $cat = $device->categoryID;
        else
            $cat = $device->cat;


        $this->insertStaticField('In Service', Array('checkbox', null, ($data[3] == 'Yes') ? 1 : 0), 1, $device, 1);

        $this->insertStaticField('Status', Array('eselect', 'racked,other', 0), 1, $device, 1);


        $this->insertStaticField('Manufacturer', Array('input', null, $data['10']), 1, $device, 1);

        //model
        $this->insertStaticField('Model', Array('input', null, $data[11]), 1, $device, 1);

        //role
        $this->insertStaticField('Role', Array('input', null, $data[9]), 1, $device, 1);

        //OS
        $this->insertStaticField('OS', Array('input', null, $data[13]), 1, $device, 1);

        //OS Version
        $this->insertStaticField('OS Version', Array('input', null, (isset($data[14])) ? $data[14] : '-'), 1, $device, 1);

        //OS License Key
        $this->insertStaticField('OS License Key', Array('input', null, (isset($data[15])) ? $data[15] : '-'), 1, $device, 1);


        //Serial
        $this->insertStaticField('Serial', Array('input', null, $data[16]), 1, $device, 1);

        //Asset
        $this->insertStaticField('Asset', Array('input', null, $data[17]), 1, $device, 1);

        //Customer
        $this->insertStaticField('Customer', Array('input', null, $data[18]), 1, $device, 1);

        //Service Level
        $this->insertStaticField('Service Level', Array('input', null, $data[19]), 1, $device, 1);



        //cpu type
        $this->insertStaticField('Processor Type', Array('input', null, null), 1, $device, 1);
        //cpu core speed
        $this->insertStaticField('Core speed (GHz)', Array('input', null, '2.66'), 1, $device, 1);
        //Processor Sockets
        $this->insertStaticField('Processor Sockets', Array('eselect', '1,2,3,4,5,6,7,8', 1), 1, $device, 1);
        //Core per sockets
        $this->insertStaticField('Cores per Socket', Array('eselect', '1,2,3,4,5,6,7,8,10,12,14,16,18,20,30,40,80,160', 2), 1, $device, 1);
        //Core per sockets
        $this->insertStaticField('Hyperthreading', Array('checkbox', null, 1), 1, $device, 1);

        $this->insertStaticField('Storage', Array('hdd', null, null), 1, $device, 1);

        $this->insertStaticField('Memory', Array('ram', null, null), 1, $device, 1);


        $this->insertStaticField('Power supply', Array('power_in', null, null), 5, $device, 1);



        $this->insertStaticField('Domain', Array('input', null, $data[2]), 2, $device, 1);

        // network field
        $this->insertStaticField('Ports', Array('network', null, null), 2, $device, 1);

        $this->insertStaticField('KVM settings', Array('kvm_in', null, null), 2, $device, 1);

        $this->insertStaticField('Images', Array('img', null, null), 3, $device, 0);


        //export to pdf
        $this->insertStaticField('Export to pdf', Array('print', null, null), 3, $device, 0);


        //note
        if (isset($data[20])) {

            $prop = Array(
                'deviceID' => $device->id,
                'txt' => $data[20],
                'meta_update_user' => 1,
                'meta_update_time' => time()
            );


            $note = new \Basic\Model_Notes($prop);
            $note->save();
        }
    }

    private function add_server($data, $rack) {

        /*

          -[1] => Device
          -[2] => Domain
          -[3] => In Service
          -[4] => Status
          -[5] => Position
          -[6] => Rack
          -[7] => Room
          -[8] => Building
          -[9] => Role
          -[10] => Manufacturer
          - [11] => Hardware
          -[12] => Size (U)
          [13] => OS
          [14] => OS Version
          [15] => OS Licence Key
          [16] => Serial
          [17] => Asset
          [18] => Customer
          [19] => Service Level
          [20] => Notes

         */

        $host = $data[1];


        if ($data[1] == '') {
            
            return false;
        }
        $server = \Basic\Model_Device::find()->where('rack', $rack->id)->where('hostname', $host)->get_one();

        if (!$server) {

            $props = array(
                'hostname' => $host,
                'type' => 0,
                'cat' => 1,
                'rack' => $rack->id,
                'rack_pos' => ($data[5] == '') ? 0 : $data[5],
                'rack_units' => $data[12],
                'parent_device' => 0,
                'meta_default_data' => 2,
                'meta_update_time' => time(),
                'meta_update_user' => 1
            );
            //print_r($props);

            $server = new \Basic\Model_Device($props);

            $server->save();

            $this->add_device_default_fields($server, $data);
            
            return '<span style="color:green;">device added (ID:'.$server->id.')</span>';
        }else{
            
            return '<span style="color:silver;">already exist</span>';
        }
    }

    private function __get_room($name, $bid) {
        $r = \Basic\Model_Room::find()->where('name', $name)->get_one();
    }

    private function __get_rack($r, $name) {
        $num = 0;
        foreach ($r->rack as $rack) {
            $num++;
            if ($rack->name == $name) {
                return $rack;
            }
        }

        //add default rack
        $props = Array(
            'name' => $name,
            'room' => $r->id,
            'room_pos' => $num,
            'hidden_rack' => 0,
            'size' => 48,
            'position' => 0,
            'numbering_direction' => 0,
            'meta_default_data' => 0,
            'meta_update_time' => time(),
            'meta_update_user' => 1
        );

        $rack = new \Basic\Model_Rack($props);
        $rack->save();


        return $rack;
    }

    private function __rack($_building, $_room, $_rack) {


//building       
        $b = \Basic\Model_Building::find()->where('name', $_building)->get_one();



        if (!$b) {
            //add new building
            $props = Array(
                'name' => $_building,
                'meta_update_time' => time(),
                'meta_update_user' => 1
            );


            $building = new \Basic\Model_Building($props);
            $building->save();

            //add defualt floor
            $props = Array(
                'name' => 'Basement',
                'building' => $building->id,
                'meta_update_time' => time(),
                'meta_update_user' => 1
            );

            $floor = new \Basic\Model_Floor($props);
            $floor->save();


            //add default room
            $props = Array(
                'name' => $_room,
                'floor' => $floor->id,
                'meta_update_time' => time(),
                'meta_update_user' => 1
            );

            $room = new \Basic\Model_Room($props);
            $room->save();


            //add default rack
            $props = Array(
                'name' => $_rack,
                'room' => $room->id,
                'room_pos' => 0,
                'hidden_rack' => 0,
                'size' => 48,
                'position' => 0,
                'numbering_direction' => 0,
                'meta_default_data' => 0,
                'meta_update_time' => time(),
                'meta_update_user' => 1
            );

            $rack = new \Basic\Model_Rack($props);
            $rack->save();
        } else {
            $floors = \Basic\Model_Floor::find()->where('building', $b->id)->get();

            foreach ($floors as $fl) {
                $rooms = $fl->room;

                foreach ($rooms as $rs) {
                    
                    if ($rs->name == $_room) {

                        return $this->__get_rack($rs, $_rack);
                    }
                }
            }

            $_floor = \Basic\Model_Floor::find()->where('building', $b->id)->get_one();
            if (!$_floor) {

                //add defualt floor
                $props = Array(
                    'name' => 'Basement',
                    'building' => $b->id,
                    'meta_update_time' => time(),
                    'meta_update_user' => 1
                );

                $floor = new \Basic\Model_Floor($props);
                $floor->save();


                //add default room
                $props = Array(
                    'name' => $_room,
                    'floor' => $floor->id,
                    'meta_update_time' => time(),
                    'meta_update_user' => 1
                );

                $room = new \Basic\Model_Room($props);
                $room->save();


                //add default rack
                $props = Array(
                    'name' => $_rack,
                    'room' => $room->id,
                    'room_pos' => 0,
                    'hidden_rack' => 0,
                    'size' => 48,
                    'position' => 0,
                    'numbering_direction' => 0,
                    'meta_default_data' => 0,
                    'meta_update_time' => time(),
                    'meta_update_user' => 1
                );

                $rack = new \Basic\Model_Rack($props);
                $rack->save();
            } else {



                //add default room
                $props = Array(
                    'name' => $_room,
                    'floor' => $_floor->id,
                    'meta_update_time' => time(),
                    'meta_update_user' => 1
                );

                $room = new \Basic\Model_Room($props);
                $room->save();


                //add default rack
                $props = Array(
                    'name' => $_rack,
                    'room' => $room->id,
                    'room_pos' => 0,
                    'hidden_rack' => 0,
                    'size' => 48,
                    'position' => 0,
                    'numbering_direction' => 0,
                    'meta_default_data' => 0,
                    'meta_update_time' => time(),
                    'meta_update_user' => 1
                );

                $rack = new \Basic\Model_Rack($props);
                $rack->save();
            }
        }



        return $rack;

//
        //
        //position
        //rack
        //room
    }

     
    
    public function action_index() {

     
        
        if ($_POST) {

            $config = array(
                'path' => APPPATH . '/tmp',
                'randomize' => true,
                'ext_whitelist' => array('xls'),
            );

// process the uploaded files in $_FILES
            \Upload::process($config);

// if there are any valid files
            if (\Upload::is_valid()) {
                // save them according to the config
                \Upload::save();
                foreach (\Upload::get_files() as $file) {
                    //print_r($file);

                    $this->make(APPPATH . 'tmp/' . $file['saved_as']);
// do something with the file info
                }

                // call a model method to update the database
                //Model_Uploads::add(Upload::get_files());
            }else{
                
                echo 'wrong file format!';
            }
        } else {
            return \Response::forge(\View::forge('migrations/form'));
        }
    }

    private function log($row,$len,$stat){
        $this->num++;
        $m=Array();
        echo '<tr><td>'.$this->num.'.</td><td>'.$stat.'</td>';
        for ($i=1;$i<=$len;$i++) {
            $s=(isset($row[$i]))?$row[$i]:'-';
            echo '<td>'.$s.'</td>';
            
        }
        echo '<td>-</td></tr>';
        
        
        
        
    }
    
    private function __head($data){
        
        echo '<div style="width:100%;overflow:auto;height:100%;"><table style="font:10px Monospace;" cellpadding="0" cellspacing="0" width="3000px;">';
                echo '<tr style="background:#f8f8f8;"><td width="40">NUM:</td><td>MIGRATION STATUS:</td>';
                
                foreach ($data as $td){
                 echo '<td>'.$td.'</td>';   
                    
                }
                echo '</tr>';
    }
    
    private function make($path) {

        $this->num=0;
        \Fuel\Core\Package::load('excel');

        $data = new \Excel\Spreadsheet_Excel_Reader();

        $data->setOutputEncoding('UTF-8');
        $data->setUTFEncoder('mb');

        $data->read($path);

        $len = count($data->sheets[0]['cells']);

        $generator = $data->sheets[0]['cells'][$len + 1];
        $out = false;
        if (isset($generator[1])) {
            // The "i" after the pattern delimiter indicates a case-insensitive search
            if (preg_match("/Generated by RackMonkey/i", $generator[1])) {

                $this->__head($data->sheets[0]['cells'][1]);
                
                $out = true;
                for ($i = 2; $i < $len; $i++) {

                    if ($data->sheets[0]['cells'][$i][8]) {


                        $rack = $this->__rack(
                                $data->sheets[0]['cells'][$i][8], //building
                                $data->sheets[0]['cells'][$i][7], //room
                                $data->sheets[0]['cells'][$i][6] //rack
                        );
                    }


                    $server=$this->add_server($data->sheets[0]['cells'][$i], $rack);
                    
                    $this->log($data->sheets[0]['cells'][$i],20,$server);
                }
                
                echo '</table><br><br><a href="/basic/migrations/monkey">BACK</a></div>';
                
                
            }
        }

        if (!$out) {
            echo 'Wrong .xls file!';
        }

//print_r($data);
//print_r($data->formatRecords);
        /*


          for ($i = 2; $i < $len; $i++) {

          if ($data->sheets[0]['cells'][$i][8]) {


          $rack = $this->__rack(
          $data->sheets[0]['cells'][$i][8], //building
          $data->sheets[0]['cells'][$i][7], //room
          $data->sheets[0]['cells'][$i][6] //rack
          );
          }


          $this->add_server($data->sheets[0]['cells'][$i], $rack);
          }


          //print_r($file_content);
          }
         * 
         */
    }

}

?>