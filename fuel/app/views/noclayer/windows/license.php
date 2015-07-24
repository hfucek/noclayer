<div class="win" id="win_license"  style="height:390px;width:420px;display:none;left:450px;">
    <div class="win_mask"></div>		
    <div class="win_header">
        <div class="win_close"></div>
        <div class="win_icon default"></div>
        <div class="win_header_name">LICENSE</div>	

    </div>

    <div class="win_data" style="height:365px;">		

        <fieldset>

            <div class="license">
                <?php
                $names = Array('Registered To', 'License Key', 'Valid Domain', 'Valid IP', 'Valid Directory', 'Created', 'Expires');

                if ($demo == 'demo') {

                    $i = 0;

                    foreach ($names as $n) {
                        switch ($i) {
                            //registered to
                            case 0:
                                $data = $license[$i];
                                break;
                            //license key
                            case 1:
                                $data = 'basic_********************';
                                break;
                            //valid domain
                            case 2:
                                $data = $license[$i];
                                break;
                            //valid ip

                            case 3:
                                $data = '80.73.***.***';
                                break;
                            //valid dir
                            case 4:
                                $data = '/home/nocla***/***/';
                                break;
                            //created
                            case 5:
                                $data = $license[$i];
                                break;
                            //expires
                            case 6:
                                $data = 'Never';
                                break;
                        }


                        echo'<div>' . $n . '</div>';
                        echo'<div style="color:black;">' . $data . '</div>';
                        $i++;
                    }
                } else {

                    $i = 0;

                    foreach ($names as $n) {
                        if ($i == 1) {
                            $license[$i] = '';
                        }

                        echo'<div>' . $n . '</div>';
                        echo'<div id="license_data_num_' . $i . '" style="color:black;">' . $license[$i] . '</div>';
                        $i++;
                    }
                }
                echo'<div>Status</div>';
                echo'<div id="license_status" style="color:' . $license_stat[0] . ';">' . $license_stat[1] . '</div>';
                echo'<div  style="float:left;margin-top:5px;"><button class="licence_act_r">Reload data</button></div>';
                    echo'<div  style="float:left;margin-left:10px;margin-top:5px;"><button class="licence_act_s">Set new key</button></div>';
      
                $mode = (isset($license[7])) ? $license[7] : false;
                if ($mode) {
                     echo'<div style ="position:absolute;bottom:20px;right:20px;">Mode: Offline</div>';
                }
                ?>




            </div>
        </fieldset>

    </div>

</div>