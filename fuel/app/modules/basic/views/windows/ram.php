<div class="win" id="win_ram" mask="ok"  style="width:480px;display:none;left:100px;">
    <div class="win_mask"></div>		
    <div class="win_header">
        <div class="win_close"></div>
        <div class="win_icon default"></div>
        <div class="win_header_name">RAM</div>	

    </div>

    <div class="win_menu"><ul win="win_ram">
            <li layout="1" class="aktive">General</li>
            <li layout="2">Modules</li>

        </ul></div>

    <div class="win_data">
        <div  class="win_layer win_visible" id="win_ram_layer1">


            <div class="float_field">
                <fieldset>
                    <legend>Type of RAM:</legend>
                    <select class="size_medium3 ram_type">
                        <?php
                        foreach ($rams as $ram) {

                            echo '<option value="' . $ram['id'] . '">' . $ram['name'] . '</option>';
                        }
                        ?>

                    </select>
                </fieldset>
            </div>
            
            <fieldset style="margin-left:10px">
                <legend>Action:</legend>
                <div class="temp_butt">
                    <div class="icons edit_action">
                        <ul class="submenu">
                            <li m="1">Add</li>
                        </ul>
                    </div>
                </div>
            </fieldset>

            <fieldset>

                <legend>Number of modules:</legend>
                <select class="size_medium3 ram_size">
                </select>

            </fieldset>

            <fieldset>
                <legend>Total capacity (Megabytes):</legend>
                <input class="size_medium3 ram_total">


            </fieldset>


        </div>

        <div class="win_layer" id="win_ram_layer2">

            <fieldset style="clear:both;padding:0px;margin:0px;">
                <div class="ram_table"></div>

            </fieldset>

        </div></div>
</div>
