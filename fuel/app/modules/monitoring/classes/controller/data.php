<?php

namespace Monitoring;

class Controller_Data extends Monitoring {

    public function action_index() {

        $elements = Array();
        $total = Array(
            'hostTotals' => 0,
            'hostTotalsUP' => 0,
            'hostTotalsDOWN' => 0,
            'hostTotalsCRITICAL' => 0,
            'hostTotalsUNREACHABLE' => 0,
            'hostTotalsPROBLEMS' => 0,
            'serviceTotals' => 0,
            'serviceTotalsOK' => 0,
            'serviceTotalsWARNING' => 0,
            'serviceTotalsCRITICAL' => 0,
            'serviceTotalsUNKNOWN' => 0,
            'serviceTotalsPROBLEMS' => 0,
            'serviceTotals' => 0,
            'nagiosCode' => Array()
        );

        $sources = Model_Source::find()->where('meta_update_user', $this->user)->get();
        foreach ($sources as $source) {

            $nagios = new \Nagios($source->content);

            $nagios->auth($source->user, $source->pass);

            $data = $nagios->getData($total);

            $elements = array_merge($elements, $data[0]);
            $total = $data[1];
        }


        echo json_encode(Array(
            'total' => $total,
            'services' => $elements,
        ));
    }

}

