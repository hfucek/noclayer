<?php

namespace Basic;

/**
 * 
 * This is main controller/router for frontend
 * @author hrvoje
 *
 */
class Controller_Device extends Basic {

    public function before() {

        parent::before();
    }

    public function action_index() {
        
    }

    /**
     * 
     * Function for checking is preset position and rack unit size fit in rack
     * @param unknown_type $rack
     * @param unknown_type $pos
     * @param unknown_type $ru
     * @return boolean */
    private function checkAviablePosition($rack, $self, $position, $ru) {

        //$position++;

        $empty = array_fill(0, $rack->size + 1, true);

        $devices = $rack->device;

        foreach ($devices as $dev) {

            //ignore self record
            if ($dev != $self) {
                //position in rack
                $pos = $dev['rack_pos'];
                //rack units
                $uni = $dev['rack_units'] + $pos;

                //take space in array
                for ($i = $pos; $i < $uni; $i++) {
                    $empty[$i] = false;
                }
            }
        }


        //all space betwen position and position+rack unit must be true

        $tot = $position + $ru;

        for ($i = $position; $i < ($tot); $i++) {

            if (!$empty[$i])
                return false;
        }

        return true;
    }

    public function action_ports() {
        if ($_POST) {
            $val = \Validation::forge();
            $val->add_field('dev', 'Device id', 'required|min_length[1]|max_length[20]');
            $val->add_field('type', 'Port type', 'required|min_length[1]|max_length[20]');
            
            if ($val->run()) {
                $network = Model_Device_Network::find()->where('deviceID', $val->validated('dev'))->get_one();

                if ($network) {


                    $m = $network->device->cat;


                    $out = Array('status' => 'ok', 'cables' => Array(), 'ports' => Array());
                    
                    
                    switch ($network->device->cat) {

                        case 2: //switch
                        case 8: //FC switch
                        case 3: //router
                            /*
                             * get data from macs
                             * */

                            $macs = $network->mac;

                            foreach ($macs as $mac) {
                                array_push($out['ports'], Array('id' => $mac->id));
                            }
                            $cabels = Model_Cable::find()->where('type', 1)->where('dev1', $network->deviceID)->or_where('dev2', $network->deviceID)->get();
                              break;  
                        case 5:
                            $macs = $network->mac;
                            foreach ($macs as $mac) {   
                                if($mac->type==$val->validated('type'))
                                    array_push($out['ports'], Array('id' => $mac->id));
                            }
                            
                            if($val->validated('type') == 3)
                                $portType = 4;
                            else
                                $portType = $val->validated('type');
                            
                            $cabels = Model_Cable::query()
                                ->where('type', $portType)
                                ->and_where_open()
                                    ->where('dev1', '=', $val->validated('dev'))
                                    ->or_where('dev2', '=', $val->validated('dev'))
                                ->and_where_close()->get();
                            
                            break;
                            
                        default:
                            $ips = $network->ip;

                            foreach ($ips as $ip) {
                                array_push($out['ports'], Array('id' => $ip->id, 'type' => $ip->type));
                            }

                            $cabels = Model_Cable::find()->where('type', 1)->where('dev1', $network->deviceID)->or_where('dev2', $network->deviceID)->get();
                            break;
                    }

                    
                    //$out['ports']=$ports;

                    foreach ($cabels as $cab) {
                        array_push($out['cables'], Array(
                            'id' => $cab->id,
                            'dev1' => $cab->dev1,
                            'port1' => $cab->port1,
                            'dev2' => $cab->dev2,
                            'port2' => $cab->port2,
                            'name1' => $cab->name1,
                            'name2' => $cab->name2
                        ));
                    }
                } else {
                    $out = Array('status' => 'nop');
                }

                echo json_encode($out);
            }
        }
    }

    public function action_remove() {
        if ($_POST) {
            $val = \Validation::forge();
            $val->add_field('did', 'Device id', 'required|min_length[1]|max_length[20]');
            if ($val->run()) {

                $device = Model_Device::find($val->validated('did'));
                if ($device) {


                    //remove cables
                    $cables = Model_Cable::find()->where('dev1', $device->id)->or_where('dev2', $device->id)->get();

                    foreach ($cables as $cab)
                        $cab->delete();



                    //get all device field and delete him 
                    $dev_fields = Model_Device_Fieldset::find()->where('deviceID', $device->id)->get();



                    //we must go with foreach becouse image deleting from hdd	
                    foreach ($dev_fields as $dev_field)
                        $dev_field->delete();



                    $device->delete();
                }
            }
        }
    }

    public function action_position() {
        if ($_POST) {


            $val = \Validation::forge();
            $val->add_field('did', 'Device id', 'required|min_length[1]|max_length[20]');
            $val->add_field('rid', 'Rack id', 'required|min_length[1]|max_length[20]');
            $val->add_field('pos', 'Position', 'required|min_length[1]|max_length[20]');
            if ($val->run()) {

                $device = Model_Device::find($val->validated('did'));
                if ($device) {

                    /*
                     * User can move device in diferent position of rack, 
                     * or move it to diferent rack at empty position
                     * 
                     * */

                    //get rack 
                    $dest_rack = Model_Rack::find($val->validated('rid'));

                    //check is position aviable
                    $empty = $this->checkAviablePosition($dest_rack, $device, $val->validated('pos'), $device->rack_units);

                    if ($empty) {

                        $device->rack = $dest_rack->id;
                        $device->rack_pos = $val->validated('pos');
                        $device->save();
                    }
                }
            }
        }
    }

    public function action_parent() {
        if ($_POST) {


            $val = \Validation::forge();
            $val->add_field('did', 'Device id', 'required|min_length[1]|max_length[20]');
            $val->add_field('par', 'parent device', 'required|min_length[1]|max_length[20]');
            if ($val->run()) {

                $device = Model_Device::find($val->validated('did'));
                echo 'ok';
                if ($device) {
                    $parent = Model_Device::find($val->validated('par'));

                    if ($parent) {
                        echo 'ok1';
                        $device->parent_device = $parent->id;
                        $device->save();
                    }
                }
            }
        }
    }

    public function action_rackunit() {
        if ($_POST) {


            $val = \Validation::forge();
            $val->add_field('did', 'Device id', 'required|min_length[1]|max_length[20]');
            $val->add_field('rid', 'Rack id', 'required|min_length[1]|max_length[20]');
            $val->add_field('ru', 'Rack unit', 'required|min_length[1]|max_length[20]');
            if ($val->run()) {

                $device = Model_Device::find($val->validated('did'));
                if ($device) {

                    /*
                     * User can change device rack unit size , but must fit into rack
                     * 
                     *
                     * */

                    //get rack
                    $dest_rack = Model_Rack::find($val->validated('rid'));

                    //check is position aviable
                    $empty = $this->checkAviablePosition($dest_rack, $device, $device->rack_pos, $val->validated('ru'));

                    if ($empty) {

                        $device->rack = $dest_rack->id;
                        $device->rack_units = $val->validated('ru');
                        $device->save();
                    }
                }
            }
        }
    }

    public function action_data($id = null) {
        if ($id) {


            $val = \Validation::forge();
            $val->add_field('id', 'Device id', 'required|min_length[1]|max_length[20]');


            if ($id == 'rename') {
                $val->add_field('name', 'Device hostname', 'required|min_length[1]|max_length[250]');

                if ($val->run()) {

                    $dev = Model_Device::find($val->validated('id'));
                    $dev->hostname = $val->validated('name');

                    $dev->save();
                    echo 'ok';
                }
            }

            if ($id == 'value') {
                $val->add_field('eid', 'Device element id', 'required|min_length[1]|max_length[25]');
                $val->add_field('val', 'Device element val', 'required|min_length[1]');

                if ($val->run()) {
                    $dev = Model_Device::find($val->validated('id'));
                    if ($dev) {
                        $field = Model_Device_Fieldset::find()->where('id', $val->validated('eid'))->where('deviceID', $dev->id)->get_one();

                        $field->value = $val->validated('val');

                        $field->save();
                        echo json_encode(array('test' => $field->value));
                    }
                }
            }
        }
    }

    public function action_ram($id = null) {

        if ($_POST) {
            
            $val = \Validation::forge();
            $val->add_field('eid', 'Device fieldset id', 'required|min_length[1]|max_length[20]');

            $val->add_field('tmp', 'Device or template', 'required|min_length[1]|max_length[20]');


            //get ram table data
            if ($id == 'get') {
                if ($val->run()) {

                    if ($val->validated('tmp') == 'true') {

                        $field = Model_Device_Template_Field::find($val->validated('eid'));
                        $ram = Model_Ram::find()->where('tempfieldID', $field->id)->get_one();

                        if (!$ram) {
                            $props = Array(
                                'tempfieldID' => $field->id,
                                'ram_type' => 1,
                                'size' => 0,
                                'total' => 0,
                                'meta_update_time' => time(),
                                'meta_update_user' => $this->user
                            );
                            $ram = new Model_Ram($props);
                            $ram->save();

                            $field->value = 'Type:none, modules:0';
                            $field->save();
                        }
                    } else {



                        $field = Model_Device_Fieldset::find($val->validated('eid'));

                        $ram = Model_Ram::find()->where('fieldsetID', $field->id)->get_one();

                        //no raid element in database, create one..
                        if (!$ram) {
                            $props = Array(
                                'fieldsetID' => $field->id,
                                'ram_type' => 1,
                                'size' => 0,
                                'total' => 0,
                                'meta_update_time' => time(),
                                'meta_update_user' => $this->user
                            );
                            $ram = new Model_Ram($props);
                            $ram->save();

                            $field->value = 'Type:none, modules:0';
                            $field->save();
                        }
                    }

                    $data['eid'] = $field->id;
                    $data['ram'] = $ram;


                    return \Response::forge(\View::forge('device/ram', $data));
                }
            }


            //change total capacity
            if ($id == 'total') {

                $val->add_field('total', 'Ram total', 'required|min_length[1]|max_length[300]');
                if ($val->run()) {

                    if ($val->validated('tmp') == 'true') {

                        $field = Model_Device_Template_Field::find($val->validated('eid'));
                        $ram = Model_Ram::find()->where('tempfieldID', $field->id)->get_one();
                    } else {


                        $field = Model_Device_Fieldset::find($val->validated('eid'));
                        $ram = Model_Ram::find()->where('fieldsetID', $field->id)->get_one();
                    }

                    $total = $val->validated('total');

                    $ram_type = 'none';
                    if ($ram->ram_type > 0) {
                        $rt = Model_Ram_Type::find($ram->ram_type);
                        $ram_type = $rt->name;
                    }



                    $field->value = $ram_type . ', modules:' . $ram->size . ', cap:' . $total . ' MB';


                    $field->save();

                    $ram->total = $total;

                    $ram->save();
                }

                $data['eid'] = $field->id;
                $data['ram'] = $ram;


                return \Response::forge(\View::forge('device/ram', $data));
            }

            //change type
            if ($id == 'type') {

                $val->add_field('type', 'Ram new type', 'required|min_length[1]|max_length[3]');
                if ($val->run()) {

                    if ($val->validated('tmp') == 'true') {

                        $field = Model_Device_Template_Field::find($val->validated('eid'));
                        $ram = Model_Ram::find()->where('tempfieldID', $field->id)->get_one();
                    } else {

                        $field = Model_Device_Fieldset::find($val->validated('eid'));
                        $ram = Model_Ram::find()->where('fieldsetID', $field->id)->get_one();
                    }




                    $new_type = $val->validated('type');

                    if ($new_type > 1) {
                        $ram_type = Model_Ram_Type::find($new_type);
                        $field->value = $ram_type['name'] . ', modules:' . $ram->size . ', cap:' . $ram->total . ' MB';
                    } else {

                        $field->value = 'Type:none, modules:' . $ram->size . ', cap:' . $ram->total . ' MB';
                    }

                    $field->save();

                    $ram->ram_type = $new_type;
                    $ram->save();
                }
                $data['eid'] = $field->id;
                $data['ram'] = $ram;


                return \Response::forge(\View::forge('device/ram', $data));
            }
            
            //change size
            if ($id == 'size') {
                $val->add_field('size', 'Raid new size', 'required|min_length[1]|max_length[20]');
                if ($val->run()) {
                    if ($val->validated('tmp') == 'true') {

                        $field = Model_Device_Template_Field::find($val->validated('eid'));
                        $ram = Model_Ram::find()->where('tempfieldID', $field->id)->get_one();
                    } else {
                        $field = Model_Device_Fieldset::find($val->validated('eid'));
                        $ram = Model_Ram::find()->where('fieldsetID', $field->id)->get_one();
                    }
                    $new_size = $val->validated('size');

                    
                    $total = Model_Ram_Data::find()->where('hardware_ram', $ram->id)->count();

                    if ($new_size > 50)
                        $new_size = 50;

                    $ram->size = $new_size;
                    $ram->save();

                    if ($new_size < $total) {
                        $dif = $total - $new_size;
                    } else {
                        $dif = $new_size - $total;
                    }

                    if ($total > $new_size) {
                        //delete overage fileds

                        $ram_data = Model_Ram_Data::find()->where('hardware_ram', $ram->id)->limit($dif)->order_by('id', 'desc')->get();

                        foreach ($ram_data as $modul)
                            $modul->delete();
                    } else {

                        //add new empty fields (diference)
                        if ($total < $new_size) {

                            for ($i = 0; $i < $dif; $i++) {

                                $prop = Array(
                                    'hardware_ram' => $ram->id,
                                    'model' => '',
                                    'size' => '',
                                    'port' => '',
                                    'meta_update_time' => time(),
                                    'meta_update_user' => $this->user,
                                    'serial_number' => ''
                                );

                                $hdata = new Model_Ram_Data($prop);

                                $hdata->save();
                            }
                        }
                    }

                    // update total
                    $sum=0;
                    $ram_type = Model_Ram_Type::find($ram->ram_type);
                    
                    $ram_data = Model_Ram_Data::find()->where('hardware_ram', $ram->id)->order_by('id', 'desc')->get();
                    foreach ($ram_data as $dd) {
                        $sum+=$dd->size;
                    }
                    
                    if ($ram->ram_type>0)
                        $field->value = $ram_type['name'] . ', modules:' . $new_size . ', cap:' . $sum . ' MB';
                    else
                        $field->value = 'Type:none, modules:' . $new_size . ', cap:' . $sum . ' MB';

                    $field->save();
                    
                    
                    $data['eid'] = $field->id;
                    $data['ram'] = $ram;

                    return \Response::forge(\View::forge('device/ram', $data));
                }
            }
            
            //set value of elements
            if ($id == 'set') {
                    
                $val->add_field('type', 'number of input element', 'required|min_length[1]|max_length[5]');
                $val->add_field('rid', 'data element id', 'required|min_length[1]|max_length[20]');
                $val->add_field('val', 'data element id', 'required|min_length[0]|max_length[250]');
                if ($val->run()) {
                    $ram_data = Model_Ram_Data::find($val->validated('rid'));

                    if ($ram_data) {
                        switch ($val->validated('type')) {

                            case 1:
                                $ram_data->port = $val->validated('val');
                                break;

                            case 2:
                                $ram_data->size = $val->validated('val');
                                break;

                            case 3:
                                $ram_data->model = $val->validated('val');
                                break;

                            case 4:
                                $ram_data->serial_number = $val->validated('val');
                                break;

                            default:
                                echo 'nop';
                                break;
                        }

                        $ram_data->save();
                    }
                }
            }
            
            //add
            if ($id == 'new') {
                
                    $val->add_field('val', 'Ram add', 'required|min_length[1]|max_length[20]');
                if ($val->run()) {
                    if ($val->validated('tmp') == 'true') {

                        $field = Model_Device_Template_Field::find($val->validated('eid'));
                        $ram = Model_Ram::find()->where('tempfieldID', $field->id)->get_one();
                    } else {
                        $field = Model_Device_Fieldset::find($val->validated('eid'));
                        $ram = Model_Ram::find()->where('fieldsetID', $field->id)->get_one();
                    }
                    $new_size = $val->validated('val');


                    if ($ram->ram_type > 1) {
                        $ram_type = Model_Ram_Type::find($ram->ram_type);
                        $field->value = $ram_type['name'] . ', modules:' . $new_size . ', cap:' . $ram->total . ' MB';
                    } else {

                        $field->value = 'Type:none, modules:' . $new_size . ', cap:' . $ram->total . ' MB';
                    }

                    $field->save();

                    $total = Model_Ram_Data::find()->where('hardware_ram', $ram->id)->count();

                    if ($new_size > 50)
                        $new_size = 50;

                    $ram->size = $new_size;
                    $ram->save();

                    if ($new_size < $total) {
                        $dif = $total - $new_size;
                    } else {
                        $dif = $new_size - $total;
                    }

                    if ($total > $new_size) {
                        //delete overage fileds

                        $ram_data = Model_Ram_Data::find()->where('hardware_ram', $ram->id)->limit($dif)->order_by('id', 'desc')->get();

                        foreach ($ram_data as $modul)
                            $modul->delete();
                    } else {

                        //add new empty fields (diference)
                        if ($total < $new_size) {

                            for ($i = 0; $i < $dif; $i++) {

                                $prop = Array(
                                    'hardware_ram' => $ram->id,
                                    'model' => \Input::post('dmodel'),
                                    'size' => \Input::post('dsize'),
                                    'port' => \Input::post('vport'),
                                    'meta_update_time' => time(),
                                    'meta_update_user' => $this->user,
                                    'serial_number' => \Input::post('dsn')
                                );

                                $hdata = new Model_Ram_Data($prop);

                                $hdata->save();
                            }
                        }
                    }

                    $data['eid'] = $field->id;
                    $data['ram'] = $ram;

                    return \Response::forge(\View::forge('device/ram', $data));
                }
            }
            
            //delete element
            if ($id == 'delete') {
                
                $val->add_field('rid', 'data element id', 'required|min_length[1]|max_length[20]');
                
                if ($val->run()) {

                    $raid_data = Model_Ram_Data::find($val->validated('rid'));
                    $raid_data->delete();
                    echo json_encode(array('deleted' => 1));
                }
            }
        }
    }

    public function action_raid($id = null) {

        if ($_POST) {

            $val = \Validation::forge();
            $val->add_field('eid', 'Device fieldset id', 'required|min_length[1]|max_length[20]');
            $val->add_field('tmp', 'Device or template', 'required|min_length[1]|max_length[20]');

            //get raid table data 
            if ($id == 'get') {
                if ($val->run()) {

                    if ($val->validated('tmp') == 'true') {

                        $field = Model_Device_Template_Field::find($val->validated('eid'));
                        $raid = Model_Raid::find()->where('tempfieldID', $field->id)->get_one();
                    } else {
                        $field = Model_Device_Fieldset::find($val->validated('eid'));
                        $raid = Model_Raid::find()->where('fieldsetID', $field->id)->get_one();
                    }

                    $data['eid'] = $field->id;
                    $data['raid'] = $raid;

                    return \Response::forge(\View::forge('device/raid', $data));
                }
            }


            //change type
            if ($id == 'type') {

                $val->add_field('type', 'Raid new type', 'required|min_length[1]|max_length[3]');
                if ($val->run()) {

                    if ($val->validated('tmp') == 'true') {

                        $field = Model_Device_Template_Field::find($val->validated('eid'));
                        $raid = Model_Raid::find()->where('tempfieldID', $field->id)->get_one();
                    } else {


                        $field = Model_Device_Fieldset::find($val->validated('eid'));
                        $raid = Model_Raid::find()->where('fieldsetID', $field->id)->get_one();
                    }

                    $new_type = $val->validated('type');

                    if ($new_type > 1) {
                        $raid_type = Model_Raid_Type::find($new_type);
                        $field->value = $raid_type['name'] . ', discs:' . $raid->size . ', cap:' . $raid->total . ' GB';
                    } else {

                        $field->value = 'Raid:none, discs:' . $raid->size . ', cap:' . $raid->total . ' GB';
                    }

                    $field->save();

                    $raid->raid_type = $new_type;
                    $raid->save();
                }

                $data['eid'] = $field->id;
                $data['raid'] = $raid;


                return \Response::forge(\View::forge('device/raid', $data));
            }

            //change total capacity
            if ($id == 'total') {

                $val->add_field('total', 'Raid total', 'required|min_length[1]|max_length[300]');
                if ($val->run()) {

                    if ($val->validated('tmp') == 'true') {

                        $field = Model_Device_Template_Field::find($val->validated('eid'));
                        $raid = Model_Raid::find()->where('tempfieldID', $field->id)->get_one();
                    } else {


                        $field = Model_Device_Fieldset::find($val->validated('eid'));
                        $raid = Model_Raid::find()->where('fieldsetID', $field->id)->get_one();
                    }

                    $total = $val->validated('total');

                    $raid_type = 'none';
                    if ($raid->raid_type > 0) {
                        $rt = Model_Raid_Type::find($raid->raid_type);
                        $raid_type = $rt->name;
                    }
                    
                    $field->value = $raid_type . ', discs:' . $raid->size . ', cap:' . $total . ' GB';


                    $field->save();

                    $raid->total = $total;

                    $raid->save();
                }

                $data['eid'] = $field->id;
                $data['raid'] = $raid;


                return \Response::forge(\View::forge('device/raid', $data));
            }


            //change size
            if ($id == 'size') {
                $val->add_field('size', 'Raid new size', 'required|min_length[1]|max_length[20]');
                if ($val->run()) {
                    if ($val->validated('tmp') == 'true') {

                        $field = Model_Device_Template_Field::find($val->validated('eid'));
                        $raid = Model_Raid::find()->where('tempfieldID', $field->id)->get_one();
                    } else {


                        $field = Model_Device_Fieldset::find($val->validated('eid'));
                        $raid = Model_Raid::find()->where('fieldsetID', $field->id)->get_one();
                    }
                    
                    $new_size = $val->validated('size');

                    $total = Model_Raid_Data::find()->where('hardware_raid', $raid->id)->count();

                    if ($new_size > 50)
                        $new_size = 50;

                    $raid->size = $new_size;
                    $raid->save();

                    if ($new_size < $total) {
                        $dif = $total - $new_size;
                    } else {
                        $dif = $new_size - $total;
                    }

                    if ($total > $new_size) {
                        //delete overage fileds

                        $raid_data = Model_Raid_Data::find()->where('hardware_raid', $raid->id)->limit($dif)->order_by('id', 'desc')->get();

                        foreach ($raid_data as $dd)
                            $dd->delete();
                    } else {

                        //add new empty fields (diference)	
                        if ($total < $new_size) {

                            for ($i = 0; $i < $dif; $i++) {

                                $prop = Array(
                                    'hardware_raid' => $raid->id,
                                    'model' => '',
                                    'size' => '',
                                    'vport' => '',
                                    'meta_update_time' => time(),
                                    'meta_update_user' => $this->user,
                                    'serial_number' => ''
                                );

                                $hdata = new Model_Raid_Data($prop);

                                $hdata->save();
                            }
                        }
                    }
                    
                    $sum = 0;
                    $raid_type = Model_Raid_Type::find($raid->raid_type);

                    // sum raid
                    $raid_data = Model_Raid_Data::find()->where('hardware_raid', $raid->id)->order_by('id', 'desc')->get();
                    foreach ($raid_data as $dd) {
                        $sum+=$dd->size;
                    }

                    if($raid->raid_type>0) 
                        $field->value = $raid_type['name'] . ', discs:' . $new_size . ', cap:' . $sum . ' GB';
                    else
                        $field->value = 'Raid:none, discs:' . $new_size . ', cap:' . $sum . ' GB';

                    $field->save();
                    

                    $data['eid'] = $field->id;
                    $data['raid'] = $raid;


                    return \Response::forge(\View::forge('device/raid', $data));
                }
            }


            //set value of elements
            if ($id == 'set') {
                
                $val->add_field('rid', 'raid id', 'required|min_length[1]|max_length[5]');
                $val->add_field('type', ' number of input element', 'required|min_length[1]|max_length[5]');
                $val->add_field('val', 'data element id', 'required|min_length[0]|max_length[250]');
                if ($val->run()) {
                    $raid_data = Model_Raid_Data::find($val->validated('rid'));
                    
                    if ($raid_data) {
                        switch ($val->validated('type')) {

                            case 1:
                                $raid_data->vport = $val->validated('val');
                                break;

                            case 2:
                                $raid_data->size = $val->validated('val');
                                break;

                            case 3:
                                $raid_data->model = $val->validated('val');
                                break;

                            case 4:
                                $raid_data->serial_number = $val->validated('val');
                                break;


                            default:
                                echo 'nop';
                                break;
                        }

                        $raid_data->save();
                    }
                }
            }
            
            //new element
            if ($id == 'new') {
                
                $val->add_field('val', 'items to add', 'required|min_length[1]|max_length[250]');
                
                if ($val->run()) {
                    
                    if ($val->validated('tmp') == 'true') {

                        $field = Model_Device_Template_Field::find($val->validated('eid'));
                        $raid = Model_Raid::find()->where('tempfieldID', $field->id)->get_one();
                    } else {

                        $field = Model_Device_Fieldset::find($val->validated('eid'));
                        $raid = Model_Raid::find()->where('fieldsetID', $field->id)->get_one();
                    }

                    $new_size = $val->validated('val');

                    if ($raid->raid_type > 1) {
                        $raid_type = Model_Raid_Type::find($raid->raid_type);
                        $field->value = $raid_type['name'] . ', discs:' . $new_size . ', cap:' . $raid->total . ' GB';
                    } else {

                        $field->value = 'Raid:none, discs:' . $new_size . ', cap:' . $raid->total . ' GB';
                    }
                    
                    $field->save();

                    $total = Model_Raid_Data::find()->where('hardware_raid', $raid->id)->count();

                    if ($new_size > 50)
                        $new_size = 50;

                    $raid->size = $new_size;
                    $raid->save();

                    if ($new_size < $total) {   
                        $dif = $total - $new_size;
                    } else {
                        $dif = $new_size - $total;
                    }

                    if ($total > $new_size) {
                        //delete overage fileds

                        $raid_data = Model_Raid_Data::find()->where('hardware_raid', $raid->id)->limit($dif)->order_by('id', 'desc')->get();

                        foreach ($raid_data as $dd)
                            $dd->delete();
                    } else {

                        //add new empty fields (diference)	
                        if ($total < $new_size) {

                            for ($i = 0; $i < $dif; $i++) {
                                
                                $prop = Array(
                                    'hardware_raid' => $raid->id,
                                    'model' => \Input::post('dmodel'),
                                    'size' => \Input::post('dsize'),
                                    'vport' => \Input::post('vport'),
                                    'meta_update_time' => time(),
                                    'meta_update_user' => $this->user,
                                    'serial_number' => \Input::post('dsn')
                                );

                                $hdata = new Model_Raid_Data($prop);
                                $hdata->save();
                            }
                        }
                    }
                
                $data['eid'] = $field->id;
                $data['raid'] = $raid;

                return \Response::forge(\View::forge('device/raid', $data));
                }
            }
            
           //delete element
            if ($id == 'delete') {
                
                $val->add_field('rid', 'data element id', 'required|min_length[1]|max_length[20]');
                
                if ($val->run()) {

                    $raid_data = Model_Raid_Data::find($val->validated('rid'));
                    $raid_data->delete();
                    echo json_encode(array('deleted' => 1));
                }
            }
            
        }
    }

    protected function insertStaticField($name, $type, $tab, $device, $static) {

        $field = New Model_Device_Fieldset();
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
    }
    
    public function action_category() {

        if ($_POST) {

            $val = \Validation::forge('templates');
            $val->add_field('cat', 'template category', 'required|min_length[1]|max_length[20]');

            $val->add_field('did', 'device id', 'required|min_length[1]|max_length[20]');

            $val->add_field('auto', 'auto update', 'required|min_length[1]|max_length[6]');
            if ($val->run()) {
                $data['auto'] = $val->validated('auto');
                $data['cat'] = '';


                if ($val->validated('auto') == "false") {
                    $dev = Model_Device::find($val->validated('did'));


                    //remove cables
                    $cables = Model_Cable::find()->where('dev1', $dev->id)->or_where('dev2', $dev->id)->get();

                    foreach ($cables as $cab)
                        $cab->delete();







                    $dcat = Model_Device_Category::find($val->validated('cat'));

                    $data['cat'] = $val->validated('cat');

                    if ($dcat) {
                        $dev->cat = $dcat->id;
                        $dev->save();

                        //delete all data from device



                        $dev_fields = Model_Device_Fieldset::find()->where('deviceID', $dev->id)->get();


                        foreach ($dev_fields as $dev_field)
                            $dev_field->delete();

                        $dev->type = 0;
                        $dev->save();




                        $this->add_device_default_fields($dev);

                    }
                }
                
                $data['templates'] = Model_Device_Template::find()->where('categoryID', $val->validated('cat'))->where('hidden', 0)->where('meta_update_user', $this->user)->get();

                return \Response::forge(\View::forge('device/templates', $data));
            }
        }
    }

    public function action_window($id = null) {


        if ($id) {
            $val = \Validation::forge();
            $val->add_field('tab', 'Device menu tab id', 'required|min_length[1]|max_length[2]');
            if ($val->run()) {

                $device = Model_Device::find($id);


                if ($device) {
                    $data['device'] = $device;




                    $data['cables'] = Array();


                    switch ($device->type) {
                        /*
                          //device type not set
                          case 0:
                          return \Response::forge(\View::forge('device/window/notype',$data));

                          break;
                          //server
                         */




                        default:

                            switch ($val->validated('tab')) {
                                case 4:
                                    $data['notes'] = Model_Notes::find()->where('deviceID', $device->id)->get();

                                    return \Response::forge(\View::forge('device/window/notes', $data));
                                    break;

                                case 2:
                                    $data['cables'] = Model_Cable::find()->where('dev1', $device->id)->or_where('dev2', $device->id)->get();


                                default:
                                    $fields = Model_Device_Fieldset::find()->where('deviceID', $device->id)->where('tab', $val->validated('tab'))->get();
                                    $data['fields'] = $fields;
                                    $data['device'] = $device;
                                    
                                    return \Response::forge(\View::forge('device/window/hardware', $data));
                                    break;
                            }


                            break;
                    }
                }
            }
            //print_r($_POST);
        }
    }

    public function action_notes($id = null) {
        if ($_POST) {
            $val = \Validation::forge();
            $val->add_field('did', 'Device id', 'required|min_length[1]|max_length[18]');

            if ($id == 'add') {

                $val->add_field('txt', 'notes', 'required|min_length[1]');

                if ($val->run()) {
                    $device = Model_Device::find($val->validated('did'));
                    if ($device) {
                        $prop = Array(
                            'deviceID' => $device->id,
                            'txt' => $val->validated('txt'),
                            'meta_update_user' => $this->user,
                            'meta_update_time' => time()
                        );


                        $note = new Model_Notes($prop);

                        $note->save();

                        $n = Array(
                            'id' => $note['id'],
                            'txt' => $note['txt'],
                            'user' => $this->username,
                            'time' => $note['meta_update_time'],
                        );

                        echo json_encode($n);
                    }
                }
            }

            if ($id == 'rem') {

                $val->add_field('nid', 'notes id', 'required|min_length[1]|max_length[18]');

                if ($val->run()) {
                    $device = Model_Device::find($val->validated('did'));
                    if ($device) {
                        $note = Model_Notes::find($val->validated('nid'));

                        if ($note)
                            $note->delete();
                    }
                }
            }
        }
    }
    
    public function action_get() {
        
        if ($_POST) {
            
            $val = \Validation::forge();
            $val->add_field('did', 'Device id', 'required|min_length[1]|max_length[18]');
            
            if ($val->run()) {
                
                $device = Model_Device::find($val->validated('did'));
                $rack = Model_Rack::find($device->rack);
                $room = Model_Room::find($rack->room);
                $floor = Model_Floor::find($room->floor);
                $build = Model_Building::find($floor->building);
                
                $data = array(
                    'id' => $device->id,
                    'hostname' => $device->hostname,
                    'rack' => $device->rack,
                    'rack_pos' => $device->rack_pos,
                    'rack_units' => $device->rack_units,
                    'cat' => $device->cat,
                    'type' => $device->type,
                    'room' => $room->id,
                    'floor' => $floor->id,
                    'build' => $build->id);

                echo json_encode($data);
            }
        }
    }

}

