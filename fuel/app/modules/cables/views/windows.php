<?php

foreach (glob(APPPATH . 'modules/cables/views/windows/*.php') as $win_name) {
    echo'
<!--=================================================================================-->
';
    include $win_name;
}
?>
