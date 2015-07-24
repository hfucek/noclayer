[
<?php
$data = Array();

foreach ($groups as $group) {

    $tests = \Debugger\Model_Test::find()->where('group_id', $group->id)->get();
    
    $b = Array(
        'attr' => Array(
            'id' => 'group_' . $group->id,
            'rel' => 'group'
        ),
        'data' => $group->name,
        'state' => count($tests) == 0 ? '' : 'closed'
    );

    array_push($data, $b);
}

echo json_encode($data);
?>
]