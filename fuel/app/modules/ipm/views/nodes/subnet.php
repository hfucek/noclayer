[
<?php
$data = Array();


foreach ($subnets as $subnet) {

    $b = Array(
        'attr' => Array(
            'id' => 'subnet_' . $subnet->id,
            'rel' => 'subnet'
        ),
        'data' => $subnet->subnet,
    );

    array_push($data, $b);
}


echo json_encode($data);
?>
]