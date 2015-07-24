[
<?php
$data = Array();

foreach ($nodes as $node) {

    $subs = \Ipm\Model_Node::find()->where('parent', $node->id)->count();
    $subs+= \Ipm\Model_Subnet::find()->where('parent', $node->id)->count();



    $b = Array(
        'attr' => Array(
            'id' => 'node_' . $node->id,
            'rel' => 'node'
        ),
        'data' => $node->name,
        'state' => $subs == 0 ? '' : 'closed'
    );

    array_push($data, $b);
}



echo json_encode($data);
?>
]