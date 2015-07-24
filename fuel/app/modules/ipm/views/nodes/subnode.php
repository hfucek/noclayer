[
<?php
$data = Array();

foreach ($nodes as $node) {

    $subs = \Ipm\Model_Subnet::find()->where('parent', $node->id)->count();

    $b = Array(
        'attr' => Array(
            'id' => 'subnode_' . $node->id,
            'rel' => 'subnode'
        ),
        'data' => $node->name,
        'state' => $subs == 0 ? '' : 'closed'
    );

    array_push($data, $b);
}



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