[
<?php
$data = Array();

foreach ($buildings as $building) {

    $floors = count($building->floor);

    $b = Array(
        'attr' => Array(
            'id' => 'building_' . $building->id,
            'rel' => 'building'
        ),
        'data' => $building->name,
        'state' => $floors == 0 ? '' : 'closed'
    );

    array_push($data, $b);
}

echo json_encode($data);
?>
]