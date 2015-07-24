[
<?php
$data = Array();

foreach ($records as $record) {

    $b = Array(
        'attr' => Array(
            'id' => 'record_' . $record->id,
            'rel' => 'record'
        ),
        'data' => $record->object
    );

    array_push($data, $b);
}

echo json_encode($data);
?>
]