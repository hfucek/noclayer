<?php

namespace Basic;

class Controller_Templates extends Basic {

    public function before() {

        parent::before();
    }

    public function action_index() {
        
    }

    public function action_data() {
        if ($_POST) {

            $val = \Validation::forge('users');
            $val->add_field('id', 'template id', 'required|min_length[1]|max_length[20]');

            if ($val->run()) {

                $data['templates'] = Model_Device_Template::find(
                                $val->validated('id'), array('related' => array('field'
                            ),
                            'order_by' => array('id' => 'asc')
                                )
                );

                return \Response::forge(\View::forge('template/data', $data));
            }
        }
    }

    private function elements($id) {

        $el = Array('input', 'textarea', 'checkbox', 'hdd', 'ram', 'img', 'print', 'network');
        return $el[$id];
    }

    private function insert_template_to_device_data($field, $new_field) {


        #hdd element data
        #####################################################################################
        if ($field->type == 'hdd') {

            //get raid data
            $old_raid = Model_Raid::find()->where('tempfieldID', $field->id)->get_one();

            $hdd = Model_Raid::find()->where('fieldsetID', $new_field->id)->get_one();

            //create new hardware_raid


            $hdd->raid_type = $old_raid->raid_type;
            $hdd->size = $old_raid->size;
            $hdd->total = $old_raid->total;
            $hdd->meta_update_time = time();
            $hdd->meta_update_user = $this->user;


            //$hdd=new Model_Raid($prop);

            $hdd->save();




            //get all discs from array
            foreach ($old_raid->rows as $disc) {
                $m = Array(
                    'model' => $disc->model,
                    'size' => $disc->size,
                    'vport' => $disc->vport,
                    'serial_number' => $disc->serial_number,
                    'hardware_raid' => $hdd->id,
                    'meta_update_time' => time(),
                    'meta_update_user' => $this->user,
                );
                $discs = new Model_Raid_Data($m);

                $discs->save();
            }
        }

        //ram
        #####################################################################################

        if ($field->type == 'ram') {

            //get ram data
            $old_ram = Model_Ram::find()->where('tempfieldID', $field->id)->get_one();

            $ram = Model_Ram::find()->where('fieldsetID', $new_field->id)->get_one();
            //create new hardware_ram

            $ram->ram_type = $old_ram->ram_type;
            $ram->size = $old_ram->size;
            $ram->total = $old_ram->total;
            $ram->meta_update_time = time();
            $ram->meta_update_user = $this->user;

            $ram->save();

            //get all modules from array
            foreach ($old_ram->rows as $modul) {
                $m = Array(
                    'hardware_ram' => $ram->id,
                    'meta_update_time' => time(),
                    'meta_update_user' => $this->user,
                    'model' => $modul->model,
                    'size' => $modul->size,
                    'port' => $modul->port,
                    'serial_number' => $modul->serial_number
                );
                $rams = new Model_Ram_Data($m);

                $rams->save();
            }
        }

        //images
        #####################################################################################

        if ($field->type == 'img') {

            //get field images
            $temp_imags = Model_Device_Template_Image::find()->where('elementID', $field->id)->get();




            foreach ($temp_imags as $img) {

                $props = Array(
                    'name' => $img->name,
                    'elementID' => $new_field->id,
                    'type' => $img->type,
                    'width' => $img->width,
                    'height' => $img->height
                );


                $imgs = new Model_Image($props);

                $imgs->save();


                copy(DOCROOT . 'images/temp' . $img->id . '.png', DOCROOT . 'images/' . $imgs->id . '.png');
                copy(DOCROOT . 'images/tumb/temp' . $img->id . '.png', DOCROOT . 'images/tumb/' . $imgs->id . '.png');
            }
        }

        //power out (PDU,ATS,UPS)
        #####################################################################################





        if ($field->type == 'power_out') {
            //power is set automatic as field saved
            $power = Model_Device_Power::find()->where('fieldsetID', $new_field->id)->get_one();

            $extra = $field->power;

            if ($new_field->device->meta_default_data > 0) {
                $max = 42;
            } else {
                $max = 24;
            }
            if ($extra->output > $max)
                $extra->output = $max;


            //update default data with template power data
            $power->input = $extra->input;
            $power->output = $extra->output;
            $power->type = $extra->type;
            $power->current = $extra->current;
            if ($power->ru == 0) {
                $power->ru = $extra->ru;
                $power->pos = $extra->pos;
            }

            $power->save();


            //delete any default socket
            $defsockets = Model_Device_Power_Socket::find()->where('powerID', $power->id)->get();
            foreach ($defsockets as $ds)
                $ds->delete();


            $n = 1;

            foreach ($field->power->socket as $socket) {
                if ($n > $max)
                    break;

                $prop = Array(
                    'powerID' => $power->id,
                    'conn_type' => $socket->conn_type,
                    'type' => $socket->type
                );

                $newsocket = new Model_Device_Power_Socket($prop);
                $newsocket->save();
                if ($socket->type == 2)
                    $n++;
            }
        }


        //power in (Server,Switch,Router,...)
        #####################################################################################


        if ($field->type == 'power_in') {
            //power is set automatic as field saved
            $power = Model_Device_Power::find()->where('fieldsetID', $new_field->id)->get_one();

            $extra = $field->power;

            //update default data with template power data
            $power->input = $extra->input;
            $power->output = $extra->output;
            $power->type = $extra->type;
            $power->current = $extra->current;
            $power->ru = $extra->ru;
            $power->pos = $extra->pos;
            $power->save();

            //delete any default socket
            $defsockets = Model_Device_Power_Socket::find()->where('powerID', $power->id)->get();
            foreach ($defsockets as $ds)
                $ds->delete();




            foreach ($field->power->socket as $socket) {
                $prop = Array(
                    'powerID' => $power->id,
                    'conn_type' => $socket->conn_type,
                    'type' => $socket->type
                );

                $newsocket = new Model_Device_Power_Socket($prop);
                $newsocket->save();
            }
        }


        //kvm out (KVM switch)
        #####################################################################################


        if ($field->type == 'kvm_out') {
            //power is set automatic as field saved
            $kvm = Model_Device_Kvm::find()->where('fieldsetID', $new_field->id)->get_one();

            $extra = $field->kvm;

            //update default data with template power data
            $kvm->input = $extra->input;
            $kvm->output = $extra->output;
            $kvm->type = $extra->type;
            $kvm->save();

            //delete any default socket
            $defsockets = Model_Device_Kvm_Socket::find()->where('kvmID', $kvm->id)->get();
            foreach ($defsockets as $ds)
                $ds->delete();




            foreach ($field->kvm->socket as $socket) {
                $prop = Array(
                    'kvmID' => $kvm->id,
                    'conn_type' => $socket->conn_type,
                    'type' => $socket->type
                );

                $newsocket = new Model_Device_Kvm_Socket($prop);
                $newsocket->save();
            }
        }

        //KVM in (Server,Switch,Router,...)
        #####################################################################################


        if ($field->type == 'kvm_in') {
            //kvm is set automatic as field saved
            $kvm = Model_Device_Kvm::find()->where('fieldsetID', $new_field->id)->get_one();

            $extra = $field->kvm;

            //update default data with template kvm data
            $kvm->input = $extra->input;
            $kvm->output = $extra->output;
            $kvm->type = $extra->type;
            $kvm->save();

            //delete any default socket
            $defsockets = Model_Device_Kvm_Socket::find()->where('kvmID', $kvm->id)->get();
            foreach ($defsockets as $ds)
                $ds->delete();




            foreach ($field->kvm->socket as $socket) {
                $prop = Array(
                    'kvmID' => $kvm->id,
                    'conn_type' => $socket->conn_type,
                    'type' => $socket->type
                );

                $newsocket = new Model_Device_Kvm_Socket($prop);
                $newsocket->save();
            }
        }



        //network
        #####################################################################################


        if ($field->type == 'network') {


            //newtwork is set automatic as field saved
            $network = Model_Device_Network::find()->where('fieldsetID', $new_field->id)->get_one();

            $extra = $field->network;

            //update default data with  template network data
            $network->type = $extra->type;
            $network->nics = $extra->nics;
            $network->vports = $extra->vports;
            $network->ports = $extra->ports;
            $network->uplinks = $extra->uplinks;
            $network->save();



            switch ($network->type) {
                case 1:
                    //IP addresses
                    foreach ($field->network->ip as $ip) {

                        $prop = Array(
                            'networkID' => $network->id,
                            'nic_name' => $ip->nic_name,
                            'ipv4' => $ip->ipv4,
                            'ipv6' => $ip->ipv6,
                            'conn_type' => $ip->conn_type,
                            'conn_speed' => $ip->conn_speed,
                            'type' => $ip->type
                        );

                        $ips = new Model_Network_Ip($prop);
                        $ips->save();
                    }


                    break;
                //MAC and VLAN
                case 2:

                    $vlan2port = Array();

                    //if no vlan is set to mac
                    $vlan2port[0] = 0;


                    foreach ($field->network->vlan as $vlan) {
                        $prop = Array(
                            'networkID' => $network->id,
                            'name' => $vlan->name
                        );

                        $vlans = new Model_Network_Vlan($prop);
                        $vlans->save();

                        $vlan2port[$vlan->id] = $vlans->id;
                    }

                    foreach ($field->network->mac as $mac) {

                        $prop = Array(
                            'networkID' => $network->id,
                            'mac_address' => $mac->mac_address,
                            'conn_device' => $mac->conn_device,
                            'vlan' => $vlan2port[$mac->vlan],
                            'type' => $mac->type
                        );

                        $macs = new Model_Network_Mac($prop);
                        $macs->save();
                    }

                    break;
                    
                case 3:
                    
                    foreach ($field->network->mac as $mac) {

                        $prop = Array(
                            'networkID' => $network->id,
                            'mac_address' => $mac->mac_address,
                            'conn_device' => $mac->conn_device,
                            'vlan' => $mac->vlan,
                            'type' => $mac->type
                        );

                        $macs = new Model_Network_Mac($prop);
                        $macs->save();
                    }

                    break;
            }
        }
    }

    private function check_boundary($pdu, $size) {


        //template dont have boundary 
        //if($this->tmpl) return true;
        //this dev
        $meDev = $pdu->device;

        //devices below
        $DevBelows = Model_Device::find()->where('rack', $meDev->rack)->where('cat', $meDev->cat)->where('id', '!=', $meDev->id)->where('meta_default_data', $meDev->meta_default_data)->get();

        $boundary = $pdu->pos + $size + 1;
        //get all devices in rack and see if they have pos < then boundary
        foreach ($DevBelows as $down) {
            $pdu2 = $down->power;

            if ($pdu2->pos > $pdu->pos and $pdu2->pos <= $boundary) {
                return false;
            }
        }

        return true;
    }

    /*
     * User can set template to vertical PDU, but we must 
     * check if template size fit into rack  
     * 
     * */

    private function check_for_PDU($template, $dev) {

        $cat = $template->category;

        if ($cat->id == 4) {

            $fields = $template->field;

            foreach ($fields as $field) {

                if ($field->power) {
                    $power = $field->power;
                    $output = ($power) ? $power->output : false;
                    if ($output) {



                        if (!$this->check_boundary($dev->power, $output))
                            return true;
                    }
                }
            }
        }

        return false;
    }

    public function action_device($id = null) {
        if ($_POST) {
            $val = \Validation::forge('templates');

            if ($id == 'edit') {
                $val->add_field('did', 'device id', 'required|min_length[1]|max_length[20]');
                $val->add_field('type', 'device new type', 'required|min_length[1]|max_length[10]');
                if ($val->run()) {

                    //get device current template type
                    $dev = Model_Device::find($val->validated('did'));



                    //set template
                    $template = Model_Device_Template::find($val->validated('type'));

                    //category
                    $cat = $template->category;


                    //store position of vertical pdu
                    $power_temp = false;
                    if ($cat->id == 4) {
                        if ($dev->meta_default_data > 0) {
                            $power_temp = $dev->power;
                        }
                    }



                    $pdu_size_wrong = $this->check_for_PDU($template, $dev);


                    if ($pdu_size_wrong) {
                        echo json_encode(Array('error' => 'You cant use this template, no enough space in rack'));
                    } else {

                        $dev_fields = Model_Device_Fieldset::find()->where('deviceID', $dev->id)->get();

                        //delete all data from device
                        foreach ($dev_fields as $dev_field)
                            $dev_field->delete();







                        $fields = $template->field;

                        $dev->type = $template->id;

                        $dev->save();

                        foreach ($fields as $field) {



                            $data = Array(
                                'name' => $field['name'],
                                'static' => $field['static'],
                                'value' => htmlspecialchars_decode($field['value']),
                                'type' => $field['type'],
                                'deviceID' => $dev->id,
                                'tab' => $field['tab'],
                                'extra' => $field['extra']
                            );


                            $new_field = new Model_Device_Fieldset($data);
                            $new_field->save();


                            $this->insert_template_to_device_data($field, $new_field);
                        }
                        $out = false;


                        if ($cat->id == 4) {
                            $dev = Model_Device::find($val->validated('did'));


                            //check if vertical PDU , and echo number of output pins 	
                            if ($dev->meta_default_data > 0) {
                                $po = Model_Device_Power::find()->where('deviceID', $val->validated('did'))->get_one();

                                $po->pos = $power_temp->pos;
                                $po->ru = $power_temp->ru;
                                $po->save();


                                $out = $po->output;
                                echo json_encode(Array('type' => $template->id, 'id' => $dev->id, 'cat' => $cat->id, 'out' => $out));
                            }
                        }


                        if (!$out)
                            echo json_encode(Array('type' => $template->id, 'id' => $dev->id, 'cat' => $cat->id));
                    }
                }
            }
        }
    }

    public function action_element($id = null) {



        if ($_POST) {
            $val = \Validation::forge('templates');
            //$val->add_field('stid', 'template id', 'required|min_length[1]|max_length[20]');

            if ($id == 'rename') {
                $val->add_field('fid', 'fieldset id', 'required|min_length[1]|max_length[20]');
                $val->add_field('name', 'fieldset new name', 'required|min_length[1]|max_length[250]');
                if ($val->run()) {

                    $field = Model_Device_Template_Field::find($val->validated('fid'));

                    $status = false;
                    if ($field) {

                        $field->name = $val->validated('name');
                        $status = $field->save();
                    }
                    $a = Array('status' => $status);
                    echo json_encode($a);
                }
            }

            if ($id == 'remove') {
                $val->add_field('fid', 'fieldset id', 'required|min_length[1]|max_length[20]');
                if ($val->run()) {

                    $field = Model_Device_Template_Field::find($val->validated('fid'));
                    $status = $field->delete();


                    $a = Array('status' => $status);
                    echo json_encode($a);
                }
            }



            if ($id == 'new') {



                $val->add_field('tid', 'template id', 'required|min_length[1]|max_length[20]');
                $val->add_field('name', 'element name', 'required|min_length[1]|max_length[250]');
                $val->add_field('type', 'element type', 'required|min_length[1]|max_length[20]');
                $val->add_field('tab', 'window tab', 'required|min_length[1]|max_length[20]');
                if ($val->run()) {



                    $template = Model_Device_Template::find($val->validated('tid'));





                    $temp_field_props = Array(
                        'name' => $val->validated('name'),
                        'type' => $this->elements($val->validated('type')),
                        'static' => 0,
                        'templateID' => $template->id,
                        'tab' => $val->validated('tab')
                    );


                    $template_field = new Model_Device_Template_Field($temp_field_props);
                    $template_field->save();


                    $a = Array(
                        'id' => $template_field->id
                    );

                    echo json_encode($a);
                }
            }
        }
    }

    protected function insertStaticField($name, $type, $tab, $template, $static) {

        $extra = '';
        $value = '';
        if ($type[1] != null)
            $extra = $type[1];

        if ($type[2] != null)
            $value = $type[2];

        $prop = Array(
            'name' => $name,
            'type' => $type[0],
            'static' => $static,
            'templateID' => $template->id,
            'tab' => $tab,
            'extra' => $extra,
            'value' => $value
        );

        $tempfield = New Model_Device_Template_Field($prop);


        $tempfield->save();
    }

    /*
      private function setStaticField(Model_Device_Template $temp){
      /*
      /*
     * Set hardware static field
     * */
    /* 	
      //manufacturer
      $this->insertStaticField('Manufacturer','input',1,$temp,1);


      //model
      $this->insertStaticField('Model','input',1,$temp,1);


      /*
     * Set network static field
     * */
    /*
      //ip address
      $this->insertStaticField('Admin url','input',2,$temp,1);

      // network field
      $this->insertStaticField('Ports','network',2,$temp,1);

      /*
     * Set layer non-static field
     * */
    /*
      //images
      $this->insertStaticField('Images','img',3,$temp,0);
      //export

      $this->insertStaticField('Export to pdf','print',3,$temp,0);




      //adding default field depends of device category

      //manufacturer
      $this->insertStaticField('Manufacturer','input',1,$temp,1);

      //model
      $this->insertStaticField('Model','input',1,$temp,1);


      switch($temp->categoryID){

      case 1: //server
      case 2: // switch
      case 3: // router
      case 4: //PDU
      case 6: //KVM switch
      case 7: //APC ATS
      case 8: // FC switch
      case 10: // UPS
      //ip address
      $this->insertStaticField('Admin url','input',2,$temp,1);

      // network field
      $this->insertStaticField('Ports','network',2,$temp,1);


      break;

      default:
      //ip address
      $this->insertStaticField('Admin url','input',2,$temp,1);

      break;

      }

      //KVM switch
      if($temp->categoryID==6)
      $this->insertStaticField('KVM settings','kvm_out',2,$temp,1);

      switch($temp->categoryID){
      case 1: //server
      case 2: // switch
      case 3: // router
      case 4: //PDU
      case 7: //APC ATS
      case 8: // FC switch
      case 9: // UPS
      case 10: // UPS

      $this->insertStaticField('KVM settings','kvm_in',2,$temp,1);
      break;

      }


      switch($temp->categoryID){
      case 4: //PDU
      case 7: //APC ATS
      case 10: // UPS
      $this->insertStaticField('Power distribution','power_out',5,$temp,1);
      break;

      case 1: //server
      case 2: // switch
      case 3: // router

      case 6: //KVM switch

      case 8: // FC switch
      case 9: // UPS
      $this->insertStaticField('Power supply','power_in',5,$temp,1);
      break;

      }

      //images
      $this->insertStaticField('Images','img',3,$temp,0);


      //export to pdf
      $this->insertStaticField('Export to pdf','print',3,$temp,0);


      }
     */

    public function action_remove() {

        if ($_POST) {

            $val = \Validation::forge('templates');

            $val->add_field('tid', 'template id', 'required|min_length[1]|max_length[20]');
            if ($val->run()) {

                $template = Model_Device_Template::find($val->validated('tid'));


                if ($template) {

                    $fields = $template->field;

                    foreach ($fields as $field) {
                        $field->template = '';
                        $field->delete();
                    }
                    $template->hidden = 1;
                    $template->name = $template->name . ' (erased)';
                    $template->delete();

                    $data['templates'] = Model_Device_Template::find()->where('categoryID', $template->categoryID)->where('hidden', 0)->where('meta_update_user', $this->user)->get();
                    return \Response::forge(\View::forge('template/window', $data));
                }
            }
        }
    }

    public function action_create() {
        if ($_POST) {

            $val = \Validation::forge();
            $val->add_field('name', 'template name', 'required|min_length[2]|max_length[250]');
            $val->add_field('cat', 'category id', 'required|min_length[1]|max_length[20]');
            if ($val->run()) {
                $category = Model_Device_Category::find($val->validated('cat'));
                if ($category) {

                    $props = Array(
                        'name' => $val->validated('name'),
                        'categoryID' => $category->id,
                        'hidden' => 0,
                        'meta_update_user' => $this->user,
                        'rack_unit' => 1
                    );

                    $new = new Model_Device_Template($props);

                    $new->save();

                    $data['templates'] = Model_Device_Template::find()->where('categoryID', $category->id)->where('hidden', 0)->where('meta_update_user', $this->user)->get();
                    $data['new'] = $new;

                    //set static field into fieldset and device_template_field


                    $this->add_device_default_fields($new);


                    return \Response::forge(\View::forge('template/window', $data));
                }
            }
        }
    }

    public function action_window() {



        if ($_POST) {

            $val = \Validation::forge('templates');
            $val->add_field('cat', 'template category', 'required|min_length[1]|max_length[20]');

            if ($val->run()) {
                $data['templates'] = Model_Device_Template::find()->where('categoryID', $val->validated('cat'))->where('hidden', 0)->where('meta_update_user', $this->user)->get();

                return \Response::forge(\View::forge('template/window', $data));
            }
        }
    }

}