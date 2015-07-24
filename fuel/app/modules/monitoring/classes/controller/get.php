<?php

namespace Monitoring;

class Controller_Get extends Monitoring {

    public function action_index() {

        $data = Model_Data::find(1);

        $sources = Model_Source::find()->where('meta_update_user', $this->user)->get();


        $monitor = array(
            'iconw' => $data['iconw'],
            'iconc' => $data['iconc'],
            'iconu' => $data['iconu'],
            'osdw' => $data['osdw'],
            'osdu' => $data['osdu'],
            'osdc' => $data['osdc'],
            'soundw' => $data['soundw'],
            'soundu' => $data['soundu'],
            'soundc' => $data['soundc']
        );

        $s = array();

        foreach ($sources as $source) {
            $type = Model_Type::find($source->typeID);

            array_push($s, array(
                'id' => $source['id'],
                'type' => array('id' => $source->typeID, 'name' => $type->name),
                //'user'=>$source['user'],
                //'pass'=>$source['pass'],
                'content' => $source['content']
            ));
        }

        echo json_encode(array('data' => $monitor, 'sources' => $s));
    }

}

