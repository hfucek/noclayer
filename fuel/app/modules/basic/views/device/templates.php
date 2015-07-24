<?php

$a = Array('data' => Array());

foreach ($templates as $temp) {
    array_push($a['data'], array('id' => $temp['id'], 'name' => $temp['name']));
}

if (isset($new)) {
    $a['nid'] = $new->id;
}

$out = Array('d' => $a, 'auto' => $auto, 'cat' => $cat);


echo json_encode($out);
?>