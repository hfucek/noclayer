<?php

foreach (glob(APPPATH . 'modules/conn/views/windows/*.php') as $win_name) {
    echo'
<!--=================================================================================-->
';
    include $win_name;
}
?>
