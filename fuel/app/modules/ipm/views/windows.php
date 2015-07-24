<?php

foreach (glob(APPPATH . 'modules/ipm/views/windows/*.php') as $win_name) {
    echo'
<!--=================================================================================-->
';
    include $win_name;
}
?>
