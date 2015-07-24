<?php

foreach (glob(APPPATH . 'modules/monitoring/views/windows/*.php') as $win_name) {
    echo'
<!--=================================================================================-->
';
    include $win_name;
}
?>
