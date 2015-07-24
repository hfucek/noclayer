<?php

namespace Basic;

class Controller_Device_Vps extends Controller_Device {

    public function before() {
        parent::before();
    }

    private function get_field($name) {
        $field = Model_Device_Fieldset::find()->where('name', 'like', $name)->where('deviceID', $this->id)->get_one();

        if ($field)
            return $field->value;

        return '-';
    }

    private function get_memory() {

        $field = Model_Device_Fieldset::find()->where('type', 'ram')->where('deviceID', $this->id)->get_one();
        if ($field) {

            $ram = $field->ram;
            if ($ram)
                return $ram->total;
        }
        return 0;
    }

    private function get_storage() {
        $fields = Model_Device_Fieldset::find()->where('type', 'hdd')->where('deviceID', $this->id)->get();

        $capacity = 0;
        foreach ($fields as $field) {



            $hdd = $field->hdd;
            if ($hdd)
                $capacity+=$hdd->total;
        }


        return $capacity;
    }

    public function action_remove() {

        $val = \Validation::forge();
        $val->add_field('did', 'node id', 'required|min_length[1]|max_length[20]');
        $val->add_field('vid', 'vps id', 'required|min_length[1]|max_length[20]');
        if ($val->run()) {

            $master = Model_Device::find($val->validated('did'));

            if ($master) {
                $vps = Model_Vps::find($val->validated('vid'));
                $vps->delete();
            }
        }



        $data['out'] = $this->vpsdata($val->validated('did'));

        return \Response::forge(\View::forge('device/vps', $data));
    }

    public function action_new() {

        $val = \Validation::forge();
        $val->add_field('did', 'node id', 'required|min_length[1]|max_length[20]');
        $val->add_field('ram', 'ram', 'required|min_length[1]|max_length[20]');
        $val->add_field('hdd', 'hdd', 'required|min_length[1]|max_length[20]');
        $val->add_field('cpu', 'cpu', 'required|min_length[1]|max_length[20]');
        //$val->add_field('ips', 'ip adr', 'min_length[1]|max_length[20]');
        $val->add_field('name', 'hostname', 'required|min_length[1]|max_length[20]');
        if ($val->run()) {

            $master = Model_Device::find($val->validated('did'));

            if ($master) {

                ///$vps = Model_Vps::find()->where('hostname', $val->validated('name'))->where('masterID', $val->validated('did'))->get_one();
                //(if (!$vps) {

                    $prop = Array(
                        'hostname' => $val->validated('name'),
                        'ram' => $val->validated('ram'),
                        'storage' => $val->validated('hdd'),
                        'cpu' => $val->validated('cpu'),
                        'masterID' => $val->validated('did')
                    );

                    $newvps = new Model_Vps($prop);
                    $newvps->save();



                /*    
                //update vps ip's
                    if (isset($_POST['ips'])) {
                        $ips = explode(';', $_POST['ips']);
                        foreach ($ips as $ip) {
                            if ($this->isValidIP($ip) or $this->isValidIPv6($ip)) {
                                $prop = Array('vpsID' => $newvps->id, 'data' => $ip);
                                $newip = new Model_Vps_Ip($prop);
                                $newip->save();
                            }
                        }
                    }
                    */
                
            }

            $data['out'] = $this->vpsdata($val->validated('did'));

            return \Response::forge(\View::forge('device/vps', $data));
        }
    }

    private function checkname($name, $me) {

        $vps = Model_Vps::find()->where('hostname', 'like', $name)->where('id', '!=', $me)->get_one();
        if ($vps) {
            return false;
        }
        return true;
    }

    public function action_change() {

        $val = \Validation::forge();
        $val->add_field('did', 'node id', 'required|min_length[1]|max_length[20]');
        $val->add_field('ram', 'ram', 'required|min_length[1]|max_length[20]');
        $val->add_field('hdd', 'hdd', 'required|min_length[1]|max_length[20]');
        $val->add_field('cpu', 'cpu', 'required|min_length[1]|max_length[20]');
        $val->add_field('vid', 'vps id', 'min_length[1]|max_length[20]');
        $val->add_field('name', 'hostname', 'required|min_length[1]|max_length[20]');
        if ($val->run()) {

            $master = Model_Device::find($val->validated('did'));

            if ($master) {

                $vps = Model_Vps::find($val->validated('vid'));


                if ($vps ) {




                    $vps->hostname = $val->validated('name');
                    $vps->ram = $val->validated('ram');
                    $vps->storage = $val->validated('hdd');
                    $vps->cpu = $val->validated('cpu');




                    //update vps ip's

                    if (isset($_POST['ips'])) {
                        $ips = explode(';', $_POST['ips']);
                        //insert all ip in dbase
                        $postip = Array();
                        

                        $vps->save();

                       
                       
                    }
                }
            }

            $data['out'] = $this->vpsdata($val->validated('did'));

            return \Response::forge(\View::forge('device/vps', $data));
        }
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

    private function IpToInt($ip){
        
        if(strlen($ip)>0){
       $split = explode( '.',$ip, 4 );
        
       if(count($split)<=1) return 0;
       
       $myInt = (
            (int)( $split[0]) * 16777216 	/* 2^24 */
            + (int)( $split[1]) * 65536 		/* 2^16 */
            + (int)( $split[2]) * 256 		/* 2^8  */
            + (int)( $split[3]) 
            );
        return $myInt;}
        
        return 0;
        
    }
    
    public function action_storages() {

        $val = \Validation::forge();
        $val->add_field('rack', 'RACK id', 'required|min_length[1]|max_length[20]');
        $out = Array('storages' => Array());
        //validate rack
        if ($val->run()) {

            $storages = Model_Device::find()->where('cat', 1)->where('rack', $val->validated('rack'))->get();


            foreach ($storages as $store) {
                $fields = Model_Device_Fieldset::find()->where('deviceID', $store->id)->where('type', 'hdd')->get();

                $capacity = 0;
                foreach ($fields as $field) {



                    $hdd = $field->hdd;
                    if ($hdd)
                        $capacity+=$hdd->total;
                }

                array_push($out['storages'], Array('device' => $store->id, 'hostname' => $store->hostname, 'capacity' => $capacity));
            }
        }

        echo json_encode($out);
    }

    private function vps_port($vport){
        
        switch($vport->type){
            case 1:
                $ports=  \Basic\Model_Network_Ip::find($vport->portID);
                return $ports->ipv4;
                break;
        }
        
        
    }
    
    
     public function action_remip(){
        $val = \Validation::forge();
        $val->add_field('vps', 'vps id', 'required|min_length[1]|max_length[20]');
        $val->add_field('val', 'ip value', 'required|min_length[1]|max_length[20]');
        
       
        //validate input
          $out = Array(
            'status' => 'ok',
            'data' => Array()
        );
           
             if ($val->run()) {
                $v = $val->validated('vps');
                $ip = $val->validated('val');

                $vps = \Basic\Model_Vps::find($v);

                

                if ($vps) {
                   $port=  \Basic\Model_Vps_Ports::query()->where('portID',$ip)->get_one(); 
                   
                   if($port){
                       $ips=  \Basic\Model_Network_Ip::find($port->portID);
                       if($ips) $ips->delete();
                       
                       $port->delete();
                   }
                    
                }
             }
             
             echo json_encode($out);
             
             }     
    
    public function action_addip(){
        $val = \Validation::forge();
        $val->add_field('vps', 'vps id', 'required|min_length[1]|max_length[20]');
        $val->add_field('val', 'ip value', 'required|min_length[1]|max_length[20]');
        
       
        //validate input
          $out = Array(
            'status' => 'ok',
            'data' => Array()
        );
           
             if ($val->run()) {
                $v = $val->validated('vps');
                $ip = $val->validated('val');

                $vps = \Basic\Model_Vps::find($v);

                foreach ($vps->device->network as $net) {
                    //nope
                }

                if ($vps) {
                    $i = \Basic\Model_Network_Ip::query()->where('ipv4', $ip)->get_one();

                    

                    if (!$i) {
                        $prop = Array(
                            'networkID' => $net->id,
                            'nic_name' => '',
                            'ipv4' => $ip,
                            'ipv6' => '',
                            'conn_type' => 0,
                            'conn_speed' => 0,
                            'type' => 3,
                            'addrint' => $this->IpToInt($ip)
                        );
                        $netip = new \Basic\Model_Network_Ip($prop);
                        $netip->save();

                        $vprop = Array(
                            'vpsID' => $vps->id,
                            'portID' => $netip->id,
                            'type' => 1
                        );
                        $port = new \Basic\Model_Vps_Ports($vprop);
                        $port->save();
                        $out['data'] = Array('id' => $port->id, 'val' => $ip, 'vps' => $vps->id);
                        $out['status'] = 'ok';
                    }
                }
            
            
        
            
        }
        echo json_encode($out);
        
    }
    
    private function vpsdata($id) {

        $device = Model_Device::find($id);
        $this->id = $device->id;
        /*
         * SUMMARY
         * */

        $sockets = $this->get_field('Processor Sockets');

        $cores = $this->get_field('Cores per Socket');



        $hyperthreading = $this->get_field('hyperthreading');

        $hyper = 'No';
        $hyperNum = 1;
        if ($hyperthreading == 1) {
            $hyper = 'Yes';
            $hyperNum = 2;
        }

        $logic = $sockets * $cores * $hyperNum;




        $summary = Array(
            //Manufacturer 	HP
            'manufacturer' => $this->get_field('Manufacturer'),
            //Model 	Proliant 452
            'model' => $this->get_field('Model'),
            //Core Speed 	 2.66 Ghz
            'speed' => $this->get_field('Core speed (GHz)'),
            //Processor Type 	Intel Xeon L5220 @ 2.27 GHz
            'processor' => $this->get_field('Processor Type'),
            //Processors Sockets 	2
            'sockets' => $sockets,
            //Cores per Socket 	4
            'cores' => $cores,
            //Hyperthreading 	Yes
            'hyperthreading' => $hyper,
            //Logical Procesors 	16
            'logic' => $logic,
            //Memory 	4x1024Mb
            'memory' => $this->get_memory(),
            //Local Storage
            'localStorage' => $this->get_storage(),
            //Virtual mashines 	8

            'vps' => Array(),
            'ram_used' => 0,
            'hdd_used' => 0,
            'cpu_used' => 0,
        );

        $vpss = $device->vps;

        $ram = 0;
        $cpu = 0;
        $hdd = 0;

        foreach ($vpss as $vps) {

            $ips = $vps->ips;
            $ip_data = Array();
            foreach ($ips as $ip) {
               $ipv4=$this->vps_port($ip);
                array_push($ip_data, Array('id' => $ip->portID, 'data' => $ipv4));
            }


            array_push($summary['vps'], Array('id' => $vps->id, 'hostname' => $vps->hostname, 'cpu' => $vps->cpu, 'ram' => $vps->ram, 'hdd' => $vps->storage, 'ip' => $ip_data));


            $ram+=$vps->ram;
            $cpu+=$vps->cpu;
            $hdd+=$vps->storage;
        }
        $summary['ram_used'] = $ram;
        $summary['hdd_used'] = $hdd;
        $summary['cpu_used'] = $cpu;

        $debug = array('debug' => 'Page rendered in {exec_time}s using {mem_usage}mb of memory.');
        array_push($summary, $debug);

        return $summary;
    }

    public function action_index() {

        $val = \Validation::forge();
        $val->add_field('did', 'device id', 'required|min_length[1]|max_length[20]');

        //validate rack
        if ($val->run()) {


            $data['out'] = $this->vpsdata($val->validated('did'));

            return \Response::forge(\View::forge('device/vps', $data));
        }
    }

}