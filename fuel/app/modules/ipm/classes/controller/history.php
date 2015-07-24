<?php

namespace Ipm;

class Controller_History extends Ipm {

    public function before() {
        parent::before();

        \Fuel\Core\Module::load('basic');

        if ($_POST) {
            $val = \Validation::forge();
            $val->add_field('type', 'branch type', 'max_length[20]');
            $val->add_field('id', 'subnet id', 'required|min_length[1]|max_length[20]');


            if ($val->run()) {
                $this->type = $val->validated('type');
                $this->id = $val->validated('id');
            }
        }
    }

    public function populate_hist_nodes($node) {




        $subnets = Model_Subnet::find()->where('parent', $node)->order_by('size', 'desc')->get();

        foreach ($subnets as $sub) {

            $from_pos = $sub['range_from'];
            $to_pos = $sub['range_to'];
            $ips = Model_History::find()->where('ip_int', '>=', $from_pos)->where('ip_int', '<=', $to_pos)->get();

            foreach ($ips as $ip) {
                $device = $ip->dev;
                // print_r($device);
                array_push($this->subArray, array(
                    'id' => $ip->id,
                    'ip' => $ip->ip_dotted,
                    'date' => date('d/m/Y H:i:s', $ip->time),
                    'device' => array(
                        'id' => $ip->device,
                        'name' => $ip->devname,
                        'erased' => 0
                    )
                ));
            }
        }

        $subs = Model_Node::find()->where('parent', $node)->get();
        foreach ($subs as $sub) {
            $this->populate_hist_nodes($sub->id);
        }
    }

    public function get_ip_history($node, $array = false) {
        $this->subArray = Array();

        //get usage from all
        if ($node == 'all') {



            $ips = Model_History::find()->order_by('time', 'desc')->limit(1000)->get();

            foreach ($ips as $ip) {
                $device = $ip->dev;
                $sub = \Ipm\Model_Subnet::find()->where('range_from', '<=', $ip->ip_int)->where('range_to', '>=', $ip->ip_int)->get_one();


                $erased = ($sub) ? 0 : 1;
                if ($ip->device > 0)
                    $erased = 0;


                // print_r($device);
                array_push($this->subArray, array(
                    'id' => $ip->id,
                    'ip' => $ip->ip_dotted,
                    'date' => date('d/m/Y H:i:s', $ip->time),
                    'device' => array(
                        'id' => $ip->device,
                        'name' => $ip->devname,
                        'erased' => $erased
                    )
                ));
            }
        } else {

            $this->populate_hist_nodes($node);
        }
        $out = array(
            'history' => $this->subArray
        );
        if ($array) {
            return $out;
        } else {
            echo json_encode($out);
        }
    }

    public function action_index() {


        if ($this->type >= 0) {

            switch ($this->type) {
                default:
                    echo json_encode(array('nop' => 'ok'));
                    break;

                    break;

                case 0:
                    //get all 
                    $this->get_ip_history('all');
                    break;

                case 1:
                case 2:
                    //get subnodes


                    $this->get_ip_history($this->id);
                    break;

                //subnets    
                case 3:
                    $sub = Model_Subnet::find($this->id);
                    $this->subArray = Array();
                    if ($sub) {

                        $from_pos = $sub['range_from'];
                        $to_pos = $sub['range_to'];
                        $ips = Model_History::find()->where('ip_int', '>=', $from_pos)->where('ip_int', '<=', $to_pos)->get();

                        foreach ($ips as $ip) {
                            $device = $ip->dev;
                            // print_r($device);
                            array_push($this->subArray, array(
                                'id' => $ip->id,
                                'ip' => $ip->ip_dotted,
                                'date' => date('d/m/Y H:i:s', $ip->time),
                                'device' => array(
                                    'id' => $ip->device,
                                    'name' => $ip->devname,
                                    'erased' => 0
                                )
                            ));
                        }
                    }
                    $out = array(
                        'history' => $this->subArray
                    );
                    echo json_encode($out);
                    break;



                //reserved ip-s
            }
        }
    }

}

?>
     