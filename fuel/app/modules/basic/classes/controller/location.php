<?php

namespace Basic;

class Controller_Location extends Basic {

    public function getParentData($node) {


        $result = Array();

        $subnets = Model_Subnet::find()->where('parent', $node)->get();


        foreach ($subnets as $sub) {

            $m = $this->getData($sub->id);
            if (count($m) > 0)
                $result = array_merge($result, $m);
        }

        return $result;
    }

    public function structure() {
        $o = Array();
        switch ($this->type) {

            case 1:

                $nodes = Model_Node::find()->where('parent', $this->id)->get();
                foreach ($nodes as $node)
                    $o = array_merge($o, $this->getParentData($node->id));


                $o = array_merge($o, $this->getParentData($this->id));
                //get subnets
                //get child folder subnets


                break;

            case 2:
                $o = $this->getParentData($this->id);

                //$o = array_merge($o,$this->getData($this->id));
                // $o=Array($p,$a);

                break;


            case 3:

                $o = $this->getData($this->id);

                break;
        }

        return $o;
    }

    public function getData($nodeId) {
        $out = Array();
        $node = '-';

        $ds = Model_Location_Extra::find()->where('node', $nodeId)->get();
        foreach ($ds as $d) {

            array_push($out, array(
                'id' => $d->id,
                'mn' => $d->subnet_name['subnet'],
                'bu' => $d->building_name['name'],
                'fl' => $d->floor_name['name'],
                'ro' => $d->room_name['name'],
                'ra' => $d->rack_name['name'],
                'st' => $d['pos_from'],
                'en' => $d['pos_to']
            ));
        }
        return $out;
    }

    public function before() {

        parent::before();

        \Fuel\Core\Module::load('basic');

        if ($_POST) {
            $val = \Validation::forge();
            $val->add_field('type', 'branch type', 'max_length[20]');
            $val->add_field('id', 'subnet id', 'required|min_length[1]|max_length[20]');


            if ($val->run()) {
                $this->id = $val->validated('id');
                $this->type = $val->validated('type');
            }
        }
    }

}