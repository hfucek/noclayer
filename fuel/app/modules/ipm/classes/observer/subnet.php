<?php

namespace Ipm;

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

class Observer_Subnet extends \Orm\Observer {

    private function update_device($ip) {
        \Log::debug('cleanup:' . $ip->ipv4);
        $this->update_history($ip);
        $this->update_ip($ip);
    }

    private function update_history($ip) {
        //insert disconnect state 
        $ipv4 = new \Ipm\Ipv4object($ip->ipv4);
        $ipv4Int = $ipv4->toInt();
        if ($ipv4Int > 0) {
            $q = array(
                'ip_dotted' => $ip->ipv4,
                'ip_int' => $ipv4Int,
                'time' => time(),
                'device' => 0,
                'user' => $this->user
            );
            $history = new \Ipm\Model_History($q);
            $history->save();
        }
    }

    private function update_ip($ip) {
        //erase ipv4 from network_ip_ports 
        $ip->ipv4 = '';
        $ip->addrint = 0;
        $ip->save();
    }

    private function locate($sub) {

        $this->user = \Sentry::user()->get('id');
        $ips = \Basic\Model_Network_Ip::find()->where('addrint', '<=', $sub['range_to'])->where('addrint', '>=', $sub['range_from'])->get();


        foreach ($ips as $ip) {


            $device = $ip->network->device;

            if ($this->user == $device->meta_update_user) {

                $this->update_device($ip);
            }
        }
    }

    public function before_delete($model) {
        \Log::debug('subnet:' . $model->id);
        //get all ip from that location


        $this->locate($model);
    }

}