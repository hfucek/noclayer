<?php

namespace Basic;

class Controller_Templates_Upload extends Controller_Templates {

    public function before() {

        parent::before();
    }

    public function action_index() {

        ob_start();

        $out = Array('status' => 'no');

        $uploaddir = DOCROOT . 'images/uploads/';






        $filename = $_FILES['image']['tmp_name'];

        $zip = new \ZipArchive;




        if ($zip->open($filename) === true) {



            $json = $zip->getFromName('data.json');



            $data = json_decode($json);
            
            
            //check if that template already exist

            $istempl = Model_Device_Template::find()->where('name', $data->title)->where('categoryID', $data->category)->get_one();

            if (!$istempl) {

                $prop = Array(
                    'name' => $data->title,
                    'categoryID' => $data->category,
                    'hidden' => 0,
                    'meta_update_user' => $this->user,
                    'rack_unit' => 1
                );


                $template = new Model_Device_Template($prop);

                $template->save();



                foreach ($data->items as $item) {


                    //basic data for field
                    $prop = Array(
                        'templateID' => $template->id,
                        'tab' => $item->tab,
                        'name' => $item->name,
                        'type' => $item->element,
                        'static' => $item->static,
                        'extra' => htmlspecialchars_decode($item->extra),
                        'value' => htmlspecialchars_decode($item->value)
                    );
                    //echo $item->value;
                    //insert into temp field

                    $field = new Model_Device_Template_Field($prop);

                    $field->save();







                    //hdd element data 
                    if ($item->element == 'hdd') {
                        
                        //create new hardware_raid

                        $prop = Array(
                            'raid_type' => $item->raid_type,
                            'size' => $item->size,
                            'total' => floor($item->total),
                            'meta_update_time' => time(),
                            'meta_update_user' => $this->user,
                            'tempfieldID' => $field->id
                        );

                        $hdd = new Model_Raid($prop);

                        $hdd->save();

                        //get all discs from array
                        foreach ($item->items as $disc) {
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

                    //ram element data
                    if ($item->element == 'ram') {


                        //create new hardware_ram



                        $prop = Array(
                            'ram_type' => $item->ram_type,
                            'size' => $item->size,
                            'total' => floor($item->total),
                            'meta_update_time' => time(),
                            'meta_update_user' => $this->user,
                            'tempfieldID' => $field->id
                        );

                        $ram = new Model_Ram($prop);

                        $ram->save();

                        //get all modules from array
                        foreach ($item->items as $modul) {
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



                    //images element
                    if ($item->element == 'img') {

                        //import images from zip

                        foreach ($item->items as $img) {

                            $props = Array(
                                'name' => 'none',
                                'elementID' => $field->id,
                                'type' => $img->type,
                                'width' => $img->w,
                                'height' => $img->h
                            );


                            $imgs = new Model_Device_Template_Image($props);

                            $imgs->save();


                            copy('zip://' . $filename . '#images/' . $img->id . '.png', DOCROOT . 'images/temp' . $imgs->id . '.png');
                            copy('zip://' . $filename . '#images/tumb/' . $img->id . '.png', DOCROOT . 'images/tumb/temp' . $imgs->id . '.png');
                        }
                    }








                    //network element data 
                    if ($item->element == 'none') {


                        switch ($item->special) {

                            //ip ports for server
                            case 'ipfield':
                                $field->type = 'network';
                                $field->save();

                                $extra = $item->extra;

                                $network = Model_Device_Template_Network::find()->where('fieldID', $field->id)->get_one();


                                $network->type = $extra->type;
                                $network->nics = $extra->nics;
                                $network->vports = $extra->vports;
                                $network->ports = $extra->ports;
                                $network->uplinks = $extra->uplinks;
                                $network->save();


                                foreach ($item->data as $ips) {
                                    $ip = $ips->port;


                                    $prop = Array(
                                        'tempnetID' => $network->id,
                                        'nic_name' => $ip->name,
                                        'ipv4' => $ip->ipv4,
                                        'ipv6' => $ip->ipv6,
                                        'conn_type' => $ip->conn_type,
                                        'conn_speed' => $ip->conn_speed,
                                        'type' => $ip->type
                                    );

                                    $ips = new Model_Device_Template_Network_Ip($prop);
                                    $ips->save();
                                }


                                break;



                            // mac for switch, router
                            case 'macfield':
                                $field->type = 'network';
                                $field->save();

                                $extra = $item->extra;

                                $network = Model_Device_Template_Network::find()->where('fieldID', $field->id)->get_one();


                                $network->type = $extra->type;
                                $network->nics = $extra->nics;
                                $network->vports = $extra->vports;
                                $network->ports = $extra->ports;
                                $network->uplinks = $extra->uplinks;
                                $network->save();
                                $vlan2port = Array();

                                //if no vlan is set to mac
                                $vlan2port[0] = 0;

                                //vlans
                                foreach ($item->vlans as $vlan) {




                                    $prop = Array(
                                        'tempnetID' => $network->id,
                                        'name' => $vlan->name
                                    );

                                    $vlans = new Model_Device_Template_Network_Vlan($prop);
                                    $vlans->save();

                                    $vlan2port[$vlan->id] = $vlans->id;
                                }

                                //print_r($item->data);
                                //mac addresses
                                foreach ($item->data as $mac) {


                                    $prop = Array(
                                        'tempnetID' => $network->id,
                                        'mac_address' => $mac->mac_addr,
                                        'conn_device' => $mac->conn_dev,
                                        'vlan' => $vlan2port[$mac->vlan],
                                        'type' => $mac->type
                                    );

                                    $macs = new Model_Device_Template_Network_Mac($prop);
                                    $macs->save();
                                }





                                break;
                            case 'powerfield':
                                $field->type = 'power_out';
                                $field->save();

                                $extra = $item->data;
                                $power = Model_Device_Template_Power::find()->where('fieldsetID', $field->id)->get_one();
                                //update device power field 
                                $power->input = $extra->input;
                                $power->current = $extra->current;
                                $power->output = $extra->output;
                                $power->save();

                                //delete default stored sockets
                                foreach ($power->socket as $tsoc)
                                    $tsoc->delete();

                                //loop from exportet socket, put them into database
                                foreach ($extra->sockets as $socket) {

                                    $prop = Array(
                                        'powerID' => $power->id,
                                        'type' => $socket->type,
                                        'conn_type' => $socket->conn_type,
                                    );

                                    $soc = new Model_Device_Template_Power_Socket($prop);
                                    $soc->save();
                                }



                                break;

                            case 'inpowerfield':
                                $field->type = 'power_in';
                                $field->save();

                                $extra = $item->data;
                                $power = Model_Device_Template_Power::find()->where('fieldsetID', $field->id)->get_one();
                                //update device power field
                                $power->input = $extra->input;
                                $power->save();

                                //delete default stored sockets
                                foreach ($power->socket as $tsoc)
                                    $tsoc->delete();

                                //loop from exportet socket, put them into database
                                foreach ($extra->sockets as $socket) {

                                    $prop = Array(
                                        'powerID' => $power->id,
                                        'type' => $socket->type,
                                        'conn_type' => $socket->conn_type,
                                    );

                                    $soc = new Model_Device_Template_Power_Socket($prop);
                                    $soc->save();
                                }


                                break;

                            case 'panelfield':
                                
                                $field->type = 'network';
                                $field->save();

                                $extra = $item->extra;

                                $network = Model_Device_Template_Network::find()->where('fieldID', $field->id)->get_one();


                                $network->type = $extra->type;
                                $network->nics = $extra->nics;
                                $network->vports = $extra->vports;
                                $network->ports = $extra->ports;
                                $network->uplinks = $extra->uplinks;
                                $network->save();


                                //print_r($item->data);
                                //mac addresses
                                foreach ($item->data as $mac) {


                                    $prop = Array(
                                        'tempnetID' => $network->id,
                                        'mac_address' => $mac->mac_addr,
                                        'conn_device' => $mac->conn_dev,
                                        'vlan' => $mac->vlan,
                                        'type' => $mac->type
                                    );

                                    $macs = new Model_Device_Template_Network_Mac($prop);
                                    $macs->save();
                                }

                                
                                break;

                            case 'inkvmfield':
                                $field->type = 'kvm_in';
                                $field->save();

                                $extra = $item->data;
                                $kvm = Model_Device_Template_Kvm::find()->where('fieldsetID', $field->id)->get_one();
                                //update device power field
                                $kvm->input = $extra->input;
                                $kvm->output = 0;
                                $kvm->save();
                                if ($kvm) {
                                    //delete default stored sockets

                                    $defSoc = Model_Device_Template_Kvm_Socket::find()->where('kvmID', $kvm->id)->get();

                                    foreach ($defSoc as $tsoc)
                                        $tsoc->delete();


                                    //loop from exportet socket, put them into database
                                    $esoc = $extra->sockets;
                                    foreach ($esoc as $socket) {

                                        $prop = Array(
                                            'kvmID' => $kvm['id'],
                                            'type' => $socket->type,
                                            'conn_type' => $socket->conn_type,
                                        );

                                        $soc = new Model_Device_Template_Kvm_Socket($prop);
                                        $soc->save();
                                    }
                                }



                                break;
                                
                                
                                
                                case 'kvmfield':
                                $field->type = 'kvm_out';
                                $field->save();

                                $extra = $item->data;
                                $kvm = Model_Device_Template_Kvm::find()->where('fieldsetID', $field->id)->get_one();
                                //update device power field
                                $kvm->input = $extra->input;
                                $kvm->output = $extra->output;
                                $kvm->save();

                                //delete default stored sockets
                                foreach ($kvm->socket as $tsoc)
                                    $tsoc->delete();

                                //loop from exportet socket, put them into database
                                foreach ($extra->sockets as $socket) {

                                    $prop = Array(
                                        'kvmID' => $kvm->id,
                                        'type' => $socket->type,
                                        'conn_type' => $socket->conn_type,
                                    );

                                    $soc = new Model_Device_Template_Kvm_Socket($prop);
                                    $soc->save();
                                }



                                break;
                        }
                    }
                }


                ob_end_clean();

                $d = Array();
                $d['templates'] = Model_Device_Template::find($template->id);

                $d['import'] = true;

                $d['alltemplates'] = Model_Device_Template::find()->where('hidden', 0)->where('categoryID', $template->categoryID)->get();
                $d['category'] = $template->categoryID;


                echo $json = \View::forge('template/data', $d);
            } else {

                ob_end_clean();

                echo json_encode(array('err' => 'template already exist!'));
            }








            $zip->close();
            
        }



        unlink($filename);
    }

}