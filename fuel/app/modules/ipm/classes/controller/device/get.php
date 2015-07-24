<?php

namespace Ipm;

class Controller_Device_Get extends Controller_Device {

    public function populate_nodes($node) {



        $nodes = Model_Node::find($node);

        $subnets = Model_Subnet::find()->where('parent', $nodes->id)->order_by('size', 'desc')->get();

        foreach ($subnets as $sub) {

            $ips = \Basic\Model_Network_Ip::find()->where('addrint', '>=', $sub->range_from)->where('addrint', '<=', $sub->range_to)->get();
            foreach ($ips as $ip) {
                $dev = $ip->network->device;

                if (!in_array($dev->id, $this->subArray)) {
                    array_push($this->subArray, $dev->id);
                }
            }
        }

        $subs = Model_Node::find()->where('parent', $nodes->id)->get();
        foreach ($subs as $sub) {
            $this->populate_nodes($sub->id);
        }
    }

    public function get_ip_usage($node, $array = false) {
        $this->subArray = Array();

        $this->populate_nodes($node);

        $out = $this->subArray;

        if ($array) {
            return $out;
        } else {
            echo json_encode($out);
        }
    }

    private function getPorts($devid) {
        $dev = \Basic\Model_Device::find($devid);
        $ports = array();
        foreach ($dev->network as $net) {

            foreach ($net->ip as $ip) {

                $sub = \Ipm\Model_Subnet::find()->where('range_from', '<=', $ip->addrint)->where('range_to', '>=', $ip->addrint)->get_one();


                $subnet = (count($sub) > 0) ? $sub->subnet : '0';

                array_push($ports, array('port' => array(
                        'id' => $ip->id,
                        'ipv4' => $ip->ipv4,
                        'type' => $ip->type,
                        'ipv6' => '',
                        'subnet' => $subnet,
                        'conn_speed' => $ip->conn_speed,
                        'conn_type' => $ip->conn_type
                        )));
            }
        }

        return $ports;
    }

    private function getVps($dev) {
        $data = Array();
        $_vps = \Basic\Model_Vps::query()->where('masterID', $dev)->get();
        foreach ($_vps as $vps) {
            $ip = $vps->ips;

            $ports = Array();

            foreach ($vps->ips as $port) {
                $ip = $port->ip;
                array_push($ports, array(
                    'id' => $ip->id,
                    'ipv4' => $ip->ipv4,
                ));
            }


            array_push($data, array(
                'id' => $vps->id,
                'name' => $vps->hostname,
                'ports' => $ports
            ));
        }
        return $data;
    }

    private function devices($devs, $keyset = true) {

        $n = 0;
        $u = 0;

        foreach ($devs as $dev) {
            if ($keyset)
                $dev = \Basic\Model_Device::find($dev);

            if ($n >= $this->offset and $u < $this->limit) {
                array_push($this->out['data'], array(
                    'id' => $dev->id,
                    'name' => $dev->hostname,
                    'data' => $this->getPorts($dev->id),
                    'vps' => $this->getVps($dev->id)
                ));
                $u++;
            }
            $n++;
        }
    }

    public function action_index() {

        $this->limit = 30;
        $this->out = Array('data' => array(), 'total' => 0, 'from' => 0, 'limit' => $this->limit);

        if ($this->id) {

            $val2 = \Validation::forge('data');
            $val2->add_field('from', 'from', 'required|min_length[1]|max_length[50]');
            $val2->add_field('type', 'type', 'required|min_length[1]|max_length[50]');
            if ($val2->run()) {
                $this->offset = (int) $val2->validated('from') * $this->limit;

                $this->out['from'] = (int) $val2->validated('from');

                switch ($val2->validated('type')) {

                    case 0:
                        //get all devices
                        $devices = \DB::select()->from('device')->as_object()->execute();


                        $res = \DB::select()->from('device')->execute();
                        $this->out['total'] = count($res);

                        $this->devices($devices, false);

                        break;

                    case 1:
                    case 2:
                        //get subnodes
                        $devices = $this->get_ip_usage($this->id, true);
                        //print_r($devices);

                        $this->out['total'] = count($devices);
                        //make limit offset
                        $this->devices($devices);

                        break;
                    case 3:
                        $this->subArray = Array();
                        $sub = \Ipm\Model_Subnet::find($this->id);

                        $ips = \Basic\Model_Network_Ip::find()->where('addrint', '>=', $sub->range_from)->where('addrint', '<=', $sub->range_to)->get();
                        foreach ($ips as $ip) {
                            $dev = $ip->network->device;

                            if (!in_array($dev->id, $this->subArray)) {
                                array_push($this->subArray, $dev->id);
                            }
                        }


                        $this->out['total'] = count($this->subArray);

                        $this->devices($this->subArray);



                        break;
                }
            }




            echo json_encode($this->out);
        }
    }

}

/*
 * 
 */
?>
