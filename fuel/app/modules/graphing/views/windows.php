<?php

foreach (glob(APPPATH . 'modules/graphing/views/windows/*.php') as $win_name) {
    echo'
<!--=================================================================================-->
';
    include $win_name;
}
?>
