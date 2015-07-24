<?php

namespace Basic;

class Controller_Network extends Basic {

    public function before() {

        parent::before();

        if ($_POST) {

            $val = \Validation::forge('network');
            $val->add_field('eid', 'template id', 'required|min_length[1]|max_length[20]');

            $val->add_field('tmpl', 'template or realdevice', 'required|min_length[1]|max_length[20]');

            if ($val->run()) {

                if ($val->validated('tmpl') == "true") {
                    $this->tmpl = true;
                    $this->field = Model_Device_Template_Field::find($val->validated('eid'));
                    $this->TempsetTypeOfDevice();
                } else {

                    $this->tmpl = false;
                    $this->field = Model_Device_Fieldset::find($val->validated('eid'));
                    $this->setTypeOfDevice();
                }
            }
        }
    }

    public function connection_data() {
        $types = Model_Connection_Type::find('all');
        $speeds = Model_Connection_Speed::find('all');

        $out = Array(
            'type' => Array(),
            'speed' => Array()
        );

        foreach ($types as $type)
            array_push($out['type'], Array('id' => $type->id, 'name' => $type->name));

        foreach ($speeds as $speed)
            array_push($out['speed'], Array('id' => $speed->id, 'name' => $speed->name));


        return $out;
    }

    /**
     * 
     * Validate mac address
     * @param  $input_string
     * Unix style mac address (example: 00:15:17:1D:73:5F)
     * Windows style mac address (example: 00-25-9c-4b-1e-2b)
     * Cisco style mac address (example: 0018.f352.d31c)
     * @return boolean
     */
    public function isValidMAC($input_string) {

        //$input_string = "00:15:17:1D:73:5F";
        if (preg_match('/^[a-f0-9]{2}:[a-f0-9]{2}:[a-f0-9]{2}:[a-f0-9]{2}:[a-f0-9]{2}:[a-f0-9]{2}$/i', $input_string))
            return true;
        //$input_string = "00-25-9c-4b-1e-2b";
        if (preg_match('/^[a-f0-9]{2}-[a-f0-9]{2}-[a-f0-9]{2}-[a-f0-9]{2}-[a-f0-9]{2}-[a-f0-9]{2}$/i', $input_string))
            return true;
        //$input_string = "0018.f352.d31c";
        if (preg_match('/^[a-f0-9]{4}\.[a-f0-9]{4}\.[a-f0-9]{4}$/i', $input_string))
            return true;

        return false;
    }

    /**
     * Validate an IPv4 IP address
     *
     * @param  string $ip
     * @return boolean - true/false
     */
    public function isValidIP($ip) {
        if (false === filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Validate an IPv6 IP address
     *
     * @param  string $ip
     * @return boolean - true/false
     */
    public function isValidIPv6($ip) {
        if (false === filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) {
            return false;
        } else {
            return true;
        }
    }

    public function data() {

        $data = Array(
            'net_type' => $this->net_type,
            'con_type' => $this->con_type,
            'net' => $this->field->network
        );
        
        if ($this->net_type == 1) {
            $data['conn'] = $this->connection_data();

            if ($this->tmpl) {
                $data['ips'] = Model_Device_Template_Network_Ip::find()->where('tempnetID', $this->field->network->id)->order_by('type', 'asc')->order_by('id', 'asc')->get();
            } else {
                $data['ips'] = Model_Network_Ip::find()->where('networkID', $this->field->network->id)->order_by('type', 'asc')->order_by('id', 'asc')->get();
            }
        }
        if ($this->net_type == 2) {
            $data['conn'] = $this->connection_data();

            if ($this->tmpl) {
                $data['ips'] = Model_Device_Template_Network_Ip::find()->where('tempnetID', $this->field->network->id)->order_by('type', 'asc')->order_by('id', 'asc')->get();

                $data['macs'] = Model_Device_Template_Network_Mac::find()->where('tempnetID', $this->field->network->id)->order_by('id', 'asc')->get();

                $data['vlans'] = Model_Device_Template_Network_Vlan::find()->where('tempnetID', $this->field->network->id)->order_by('id', 'asc')->get();
            } else {
                $data['ips'] = Model_Network_Ip::find()->where('networkID', $this->field->network->id)->order_by('type', 'asc')->order_by('id', 'asc')->get();

                $data['macs'] = Model_Network_Mac::find()->where('networkID', $this->field->network->id)->order_by('id', 'asc')->get();

                $data['vlans'] = Model_Network_Vlan::find()->where('networkID', $this->field->network->id)->order_by('id', 'asc')->get();
            }
        }
       if ($this->net_type == 3) {
             $data['conn'] = $this->connection_data();
             
             if ($this->tmpl) {
                $data['ips'] = Model_Device_Template_Network_Ip::find()->where('tempnetID', $this->field->network->id)->order_by('type', 'asc')->order_by('id', 'asc')->get();

                $data['macs'] = Model_Device_Template_Network_Mac::find()->where('tempnetID', $this->field->network->id)->order_by('id', 'asc')->get();

                $data['vlans'] = Model_Device_Template_Network_Vlan::find()->where('tempnetID', $this->field->network->id)->order_by('id', 'asc')->get();
            } else {
                $data['ips'] = Model_Network_Ip::find()->where('networkID', $this->field->network->id)->order_by('type', 'asc')->order_by('id', 'asc')->get();

                $data['macs'] = Model_Network_Mac::find()->where('networkID', $this->field->network->id)->order_by('id', 'asc')->get();

                $data['vlans'] = Model_Network_Vlan::find()->where('networkID', $this->field->network->id)->order_by('id', 'asc')->get();
            }
         }
        

        if ($this->tmpl) {
            $data['cables'] = Array(); //Model_Cable::find()->where('dev1',$this->field->templateID)->or_where('dev2',$this->field->templateID)->get();
        } else {
            $data['cables'] = Model_Cable::find()->where('dev1', $this->field->deviceID)->or_where('dev2', $this->field->deviceID)->get();
        }


        return $data;
    }

}

?>	