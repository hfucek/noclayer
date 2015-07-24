<?php

foreach (glob(APPPATH . 'modules/debugger/views/windows/*.php') as $win_name) {
    echo'
<!--=================================================================================-->
';
    include $win_name;
}
?>
