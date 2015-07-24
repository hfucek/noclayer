<?php

namespace Basic;

class Model_Device_Fieldset extends \Orm\Model {

    protected static $_table_name = 'device_fieldset';
    protected static $_properties = array(
        'id',
        'name',
        'type',
        'deviceID',
        'tab',
        'value',
        'static',
        'extra'
    );
    protected static $_has_one = array(
        'network' => array(
            'key_from' => 'id',
            'model_to' => 'Basic\Model_Device_Network',
            'key_to' => 'fieldsetID',
            'cascade_save' => true,
            'cascade_delete' => true,
        ),
        'power' => array(
            'key_from' => 'id',
            'model_to' => 'Basic\Model_Device_Power',
            'key_to' => 'fieldsetID',
            'cascade_save' => true,
            'cascade_delete' => true,
        ),
        'kvm' => array(
            'key_from' => 'id',
            'model_to' => 'Basic\Model_Device_Kvm',
            'key_to' => 'fieldsetID',
            'cascade_save' => true,
            'cascade_delete' => true,
        ),
        'hdd' => array(
            'key_from' => 'id',
            'model_to' => 'Basic\Model_Raid',
            'key_to' => 'fieldsetID',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
        'ram' => array(
            'key_from' => 'id',
            'model_to' => 'Basic\Model_Ram',
            'key_to' => 'fieldsetID',
            'cascade_save' => false,
            'cascade_delete' => false,
        )
    );
    protected static $_has_many = array(
        'images' => array(
            'key_from' => 'id',
            'model_to' => 'Basic\Model_Image',
            'key_to' => 'elementID',
            'cascade_save' => true,
            'cascade_delete' => true,
        )
    );
    protected static $_belongs_to = array(
        'device' => array(
            'key_from' => 'deviceID',
            'model_to' => 'Basic\Model_Device',
            'key_to' => 'id',
            'cascade_save' => false,
            'cascade_delete' => false,
        )
    );

    /*
      protected static $_has_many = array(
      'ram' => array(
      'key_from' => 'id',
      'model_to' => 'Model_Ram',
      'key_to' => 'fieldsetID',
      'cascade_save' => true,
      'cascade_delete' => true,
      )
      );
     */

    private function setTypeOfDevice($device) {

        switch ($device->cat) {

            case 1: //server
            case 4: //PDU
            case 6: //KVM switch
            case 7: //APC ATS
            case 10: // UPS
                return 1;
                break;
            case 5:
                return 3;


                break;

            case 2: //switch
            case 3: //router
            case 8: //fc switch

                return 2;
                break;

            default:
                return 0;
                break;
        }
    }

    public function save($cascade = null, $use_transtation = false) {

        parent::save();

        if ($this->get('type') == 'hdd') {
            if (!$this->get('hdd')) {


                $props = Array(
                    'fieldsetID' => $this->get('id'),
                    'raid_type' => 1,
                    'size' => 0,
                    'meta_update_time' => time(),
                    'meta_update_user' => 0,
                    'total' => 0
                );

                $raid = new Model_Raid($props);
                $raid->save();
            }
        }


        if ($this->get('type') == 'ram') {
            if (!$this->get('ram')) {

                $props = Array(
                    'fieldsetID' => $this->get('id'),
                    'ram_type' => 1,
                    'size' => 0,
                    'total' => 0,
                    'meta_update_time' => time(),
                    'meta_update_user' => 0
                );
                $ram = new Model_Ram($props);
                $ram->save();
            }
        }

        if ($this->get('type') == 'network') {
            if (!$this->get('network')) {

                $dev = $this->get('device');



                $prop = Array(
                    'fieldsetID' => $this->get('id'),
                    'deviceID' => $dev->id,
                    'nics' => 0,
                    'vports' => 0,
                    'ports' => 0,
                    'uplinks' => 0,
                    'config_data' => '',
                    'type' => $this->setTypeOfDevice($dev)
                );

                $network = new Model_Device_Network($prop);
                $network->save();
            }
        }


        if ($this->get('type') == 'power_out') {
            if (!$this->get('power')) {

                $dev = $this->get('device');
                $prop = Array(
                    'fieldsetID' => $this->get('id'),
                    'deviceID' => $dev->id,
                    'current' => 10,
                    'input' => 1,
                    'output' => 1,
                    'ru' => 1,
                    'pos' => 0,
                    'type' => 0
                );

                $power = new Model_Device_Power($prop);
                $power->save();


                //input socket
                $prop = Array(
                    'powerID' => $power->id,
                    'conn_type' => 1,
                    'type' => 1
                );

                $socket = new Model_Device_Power_Socket($prop);
                $socket->save();
                //output socket
                $prop = Array(
                    'powerID' => $power->id,
                    'conn_type' => 1,
                    'type' => 2
                );

                $socket = new Model_Device_Power_Socket($prop);
                $socket->save();
            }
        }

        if ($this->get('type') == 'power_in') {
            if (!$this->get('power')) {

                $dev = $this->get('device');
                $prop = Array(
                    'fieldsetID' => $this->get('id'),
                    'deviceID' => $dev->id,
                    'current' => 0,
                    'input' => 1,
                    'output' => 0,
                    'ru' => 0,
                    'pos' => 0,
                    'type' => 0
                );

                $power = new Model_Device_Power($prop);
                $power->save();

                //input power
                $prop = Array(
                    'powerID' => $power->id,
                    'conn_type' => 1,
                    'type' => 1
                );

                $socket = new Model_Device_Power_Socket($prop);
                $socket->save();
            }
        }


        if ($this->get('type') == 'kvm_in') {
            if (!$this->get('kvm')) {

                $dev = $this->get('device');
                $prop = Array(
                    'fieldsetID' => $this->get('id'),
                    'deviceID' => $dev->id,
                    'input' => 1,
                    'output' => 0,
                    'type' => 0
                );

                $kvm = new Model_Device_Kvm($prop);
                $kvm->save();

                //input power
                $prop = Array(
                    'kvmID' => $kvm->id,
                    'conn_type' => 1,
                    'type' => 1
                );

                $socket = new Model_Device_Kvm_Socket($prop);
                $socket->save();
            }
        }

        if ($this->get('type') == 'kvm_out') {
            if (!$this->get('kvm')) {

                $dev = $this->get('device');
                $prop = Array(
                    'fieldsetID' => $this->get('id'),
                    'deviceID' => $dev->id,
                    'input' => 1,
                    'output' => 1,
                    'type' => 0
                );

                $kvm = new Model_Device_Kvm($prop);
                $kvm->save();

                //input kvm
                $prop = Array(
                    'kvmID' => $kvm->id,
                    'conn_type' => 1,
                    'type' => 2
                );

                $socket = new Model_Device_Kvm_Socket($prop);
                $socket->save();

                //output kvm
                $prop = Array(
                    'kvmID' => $kvm->id,
                    'conn_type' => 1,
                    'type' => 1
                );

                $socket = new Model_Device_Kvm_Socket($prop);
                $socket->save();
            }
        }
    }

    public function delete($cascade = null, $use_transation = false) {




        //remove images from disk
        if ($this->get('type') == 'img') {


            $imgs = $this->get('images');

            foreach ($imgs as $im)
                $im->delete();
        }



        //remove network elements
        if ($this->get('type') == 'network') {

            $network = $this->get('network');
            if ($network)
                $network->delete();
        }



        //remove ram elements



        parent::delete();
    }

}