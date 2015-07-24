[
<?php
$data = Array();

foreach ($rooms as $room) {

    $b = Array(
        'attr' => Array(
            'id' => 'room_' . $room->id,
            'rel' => 'room'
        ),
        'data' => $room->name
    );

    array_push($data, $b);
}

echo json_encode($data);
?>
]