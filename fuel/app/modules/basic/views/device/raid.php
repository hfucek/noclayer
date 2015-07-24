<?php

$out = Array(
    'eid' => $eid,
    'data' => false,
    'size' => 0,
    'type' => 0,
    'total' => 0,
    'items' => Array()
);



if ($raid) {
    //raid exist
    $out['data'] = true;

    //get rows 
    $data = $raid->rows;

    //number of rows
    $out['size'] = count($data);

    //type
    $out['type'] = $raid->raid_type;

    //total
    $out['total'] = $raid->total;



    foreach ($data as $row) {
        $m = Array(
            'id' => $row['id'],
            'model' => $row['model'],
            'size' => $row['size'],
            'port' => $row['vport'],
            'sn' => $row['serial_number']
        );
        array_push($out['items'], $m);
    }
}

echo json_encode($out);
?>