[
<?php
$data = Array();

foreach ($floors as $floor) {
    $rooms = count($floor->room);

    $b = Array(
        'attr' => Array(
            'id' => 'floor_' . $floor->id,
            'rel' => 'floor'
        ),
        'data' => $floor->name,
        'state' => $rooms == 0 ? '' : 'closed'
    );

    array_push($data, $b);
}

echo json_encode($data);
?>
]