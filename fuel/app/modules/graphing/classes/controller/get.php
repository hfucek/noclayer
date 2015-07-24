<?php

namespace Graphing;

use Cacti\Cacti;

class Controller_Get extends Graphing {

    private function IsCableConnected($dev, $mac) {

        if ($mac > 0) {
            $cable = \Basic\Model_Cable::find()->where('dev1', $dev)->where('port1', $mac)->get_one();

            if ($cable) {


                return array(
                    'dev' => $cable->dev2,
                    'port' => $cable->port2
                );
            } else {
                $cable = \Basic\Model_Cable::find()->where('dev2', $dev)->where('port2', $mac)->get_one();


                if ($cable) {
                    return array(
                        'dev' => $cable->dev1,
                        'port' => $cable->port1
                    );
                }
            }
        }

        return false;
    }

    public function action_munin() {
        $out = array('status' => 'no','list'=>Array('data'=>Array(),'id'=>''));

        $val = \Validation::forge();
        $val->add_field('did', 'node id', 'required|min_length[1]|max_length[20]');

        
        if ($val->run()) {
            $mundata = Model_Munin::query()->where('deviceID', $val->validated('did'))->get_one();
            if ($mundata) {
                

                $auth = ($mundata->pass != '') ? 1 : 0;

                $munin = new \Munin($mundata->url, $auth);

                if ($auth > 0)
                    $munin->authentication($mundata->user, $mundata->pass);
                
                
                $list=$munin->graph_list();
                $out['status']='ok';
                $out['list']['data']=$list;
                $out['list']['id']=$val->validated('did');
            }
            echo json_encode($out);
        }
    }

    public function action_graphs() {
        $graphs = Model_Cacti::find()->order_by('deviceID', 'asc')->get();


        $out = Array(
            'cacti' => array(
                'devices' => Array(),
                'port' => Array(),
                'custom' => Array(),
                'source' => Array(),
                'data' => Array()
            ),
            'munin' => array(
                'devices' => Array(),
            ),
        );

        foreach ($graphs as $graph) {

            $server = $this->IsCableConnected($graph->deviceID, $graph->macID);

            $data = array(
                'id' => $graph->id,
                'graph' => $graph->graphID,
                'source' => $graph->sourceID,
                'name' => $graph->name,
                'device' => $graph->deviceID,
                'num' => $graph->num,
                'server' => $server
            );

            if (!in_array($graph->deviceID, $out['cacti']['devices']))
                array_push($out['cacti']['devices'], $graph->deviceID);

            if ($server) {

                if (!in_array($server['dev'], $out['cacti']['devices']))
                    array_push($out['cacti']['devices'], $server['dev']);
            }



            if ($graph->num == 0) {
                array_push($out['cacti']['custom'], $data);
            } else {
                array_push($out['cacti']['port'], $data);
            }
        }

        $data = Model_Data::find()->where('meta_update_user', $this->user)->get();
        foreach ($data as $d) {

            array_push($out['cacti']['data'], array(
                'value' => $d->value,
                'name' => $d->name,
            ));
        }


        $sources = Model_Source::find('all');
        foreach ($sources as $source) {

            array_push($out['cacti']['source'], array(
                'id' => $source->id,
                'url' => $source->content,
            ));
        }

        $munins = Model_Munin::find('all');

        foreach ($munins as $munin) {

            //$device=$munin->device;
            
            array_push($out['munin']['devices'], array(
                'id' => $munin->deviceID
               
            ));
        }


        //array_multisort($out['cacti']['data'], SORT_DESC,  $out['cacti']['data'], SORT_DESC);



        echo json_encode($out);
    }

    
    
    public function action_index() {



        $sources = Model_Source::find()->where('meta_update_user', $this->user)->get();



        $out = array(
            'sources' => array(),
            'data' => array(),
            'munin' => array(),
        );

        foreach ($sources as $source) {
            $type = Model_Type::find($source->typeID);

            array_push($out['sources'], array(
                'id' => $source['id'],
                'type' => array('id' => $source->typeID, 'name' => $type->name),
                //'user'=>$source['user'],
                //'pass'=>$source['pass'],
                'content' => $source['content']
            ));
        }


        $data = Model_Data::find()->where('meta_update_user', $this->user)->get();
        foreach ($data as $d) {

            array_push($out['data'], array(
                'value' => $d->value,
                'name' => $d->name,
            ));
        }

        
          $munins = Model_Munin::find('all');
         foreach ($munins as $munin) {

            $device=$munin->device;
            
            array_push($out['munin'], array(
                'id' => $munin->deviceID,
                'url' => $munin->url,
                'host'=>$device->hostname
            ));
        }
        

        echo json_encode($out);
    }

    public function action_mac() {

        if ($_POST) {




            $val = \Validation::forge();
            $val->add_field('did', 'node id', 'required|min_length[1]|max_length[20]');

            if ($val->run()) {

                $out = Array('sources' => Array(), 'mac' => Array(), 'custom' => Array());



                $device = \Basic\Model_Device::find($val->validated('did'));

                $source = Model_Source::find()->where('typeID', 1)->get();

                $sources = Array();

                foreach ($source as $s) {

                    array_push($sources, Array(
                        'id' => $s->id,
                        'url' => $s->content
                    ));
                }



                $out['sources'] = $sources;




                foreach ($device->network as $network) {




                    foreach ($network->mac as $mac) {

                        $cacti = Model_Cacti::find()->where('macID', $mac->id)->get_one();

                        /* TODO: dodati extend u cacti modelu
                          'graph' => array(
                          'key_from' => 'id',
                          'model_to' => '\Graphing\Model_Cacti',
                          'key_to' => 'macID',
                          'cascade_save' => false,
                          'cascade_delete' => false,
                          )
                         */

                        if ($cacti) {

                            array_push($out['mac'], array('id' => $mac->id, 'type' => $mac->type, 'cacti' => array('id' => $cacti->id, 'name' => $cacti->name, 'graph' => $cacti->graphID, 's' => $cacti->sourceID)));
                        } else {

                            array_push($out['mac'], array('id' => $mac->id, 'type' => $mac->type, 'cacti' => array()));
                        }
                    }
                }


                $customs = Model_Cacti::find()->where('deviceID', $device->id)->where('macID', 0)->get();

                foreach ($customs as $cacti) {

                    array_push($out['custom'], array('id' => $cacti->id, 'name' => $cacti->name, 'graph' => $cacti->graphID, 's' => $cacti->sourceID));
                }





                echo json_encode($out);
            }
        }
    }

}