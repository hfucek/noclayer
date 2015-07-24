[
<?php
$data = Array();

foreach ($tests as $test) {
    
    $records = \Debugger\Model_Record::find()->where('test_id', $test->id)->get();

    $b = Array(
        'attr' => Array(
            'id' => 'test_' . $test->id,
            'rel' => 'test'
        ),
        'data' => $test->name,
        'state' => count($records) == 0 ? '' : 'closed'
    );

    array_push($data, $b);
}

echo json_encode($data);
?>
]