<?php

$a = Array('data' => Array());

foreach ($templates as $temp) {
    array_push($a['data'], array('id' => $temp['id'], 'name' => $temp['name'], 'ru' => $temp['rack_unit']));
}

if (isset($new)) {
    $a['nid'] = $new->id;
}

$out = Array('d' => $a);

echo json_encode($a);
?>