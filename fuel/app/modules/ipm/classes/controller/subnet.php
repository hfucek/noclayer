<?php

namespace Ipm;

class Controller_Subnet extends Ipm {

    public function populate_nodes($node) {

        $nodes = Model_Node::find($node);

        $subnets = Model_Subnet::find()->where('parent', $nodes->id)->order_by('size', 'desc')->get();

        foreach ($subnets as $sub) {

            array_push($this->subArray, array(
                'id' => $sub->id,
                'subnet' => $sub->subnet,
                'size' => $sub->size,
                'used' => $this->get_used($sub->subnet, true),
                'reserved' => '0'
            ));
        }

        $subs = Model_Node::find()->where('parent', $nodes->id)->get();
        foreach ($subs as $sub) {
            $this->populate_nodes($sub->id);
        }
    }

    public function get_ip_usage($node, $array = false) {
        $this->subArray = Array();

        //get usage from all
        if ($node == 'all') {
            $subnets = Model_Subnet::find()->order_by('size', 'desc')->get();

            foreach ($subnets as $sub) {

                array_push($this->subArray, array(
                    'id' => $sub->id,
                    'subnet' => $sub->subnet,
                    'size' => $sub->size,
                    'used' => $this->get_used($sub->subnet, true),
                    'reserved' => '0'
                ));
            }
        } else {

            $this->populate_nodes($node);
        }
        $out = array(
            'subnets' => $this->subArray
        );
        if ($array) {
            return $out;
        } else {
            echo json_encode($out);
        }
    }

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

}

