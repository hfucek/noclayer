<?php

$out = Array(
    'eid' => $eid,
    'data' => false,
    'size' => 0,
    'type' => 0,
    'total' => 0,
    'items' => Array()
);



if ($ram) {
    //ram exist
    $out['data'] = true;

    //get rows 
    $data = $ram->rows;

    //number of rows
    $out['size'] = count($data);

    //type
    $out['type'] = $ram->ram_type;

    //total
    $out['total'] = $ram->total;



    foreach ($data as $row) {
        $m = Array(
            'id' => $row['id'],
            'model' => $row['model'],
            'size' => $row['size'],
            'port' => $row['port'],
            'sn' => $row['serial_number']
        );
        array_push($out['items'], $m);
    }
}

echo json_encode($out);
?>