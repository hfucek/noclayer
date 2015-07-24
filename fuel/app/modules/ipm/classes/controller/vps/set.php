<?php

namespace Ipm;

class Controller_Vps_Set extends Ipm {

    public function action_index() {
        $out = Array(
            'status' => 'ok',
            'data' => Array()
        );

        \Fuel\Core\Module::load('basic');

        if ($_POST) {
            $val = \Validation::forge();
            $val->add_field('eid', 'vps id', 'max_length[20]');
            $val->add_field('val', 'ip address', 'required|min_length[1]|max_length[20]');


            if ($val->run()) {
                $v = $val->validated('eid');
                $ip = $val->validated('val');

                $vps = \Basic\Model_Vps::find($v);

                foreach ($vps->device->network as $net) {
                    //nope
                }

                if ($vps) {
                    $i = \Basic\Model_Network_Ip::query()->where('ipv4', $ip)->get_one();

                    $ipv4 = new \Ipm\Ipv4object($ip);

                    if (!$i) {
                        $prop = Array(
                            'networkID' => $net->id,
                            'nic_name' => '',
                            'ipv4' => $ip,
                            'ipv6' => '',
                            'conn_type' => 0,
                            'conn_speed' => 0,
                            'type' => 3,
                            'addrint' => $ipv4->toInt()
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
        }
        
        echo json_encode($out);
    }

}