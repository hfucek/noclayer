<div class="win w_resize" mask2="ok" style="display:none;width:520px;" id="win_rack">

    <div class="win_mask"></div>	

    <div class="win_header">
        <div class="win_close"></div>
        <div class="win_icon default"></div>	
        <div class="win_header_name">Rack properties</div>	
    </div>

    <div class="win_menu"><ul win="win_rack">
            <li layout="1" class="aktive">General</li>
            <li layout="2" >Layout</li>

        </ul></div>


    <div class="win_data">

        <div class="win_layer win_visible" id="win_rack_layer1">
            <div class="float_field">
                <fieldset>
                    <legend>Name</legend>
                    <input type="text" name="name">
                </fieldset>
          
                <fieldset style="margin-left:10px">
                    <legend>Action:</legend>
                    <div class="temp_butt">
                        <div class="icons edit_action">
                            <ul class="submenu">
                                <li m="1">Change position</li>
                                <li m="2">Delete rack</li>
                            </ul>
                        </div>
                    </div>
                </fieldset>

                <fieldset style="clear:both;">

                    <legend>Rack units</legend>
                    <select name="ru" class="select85 rack_units">
                       
                    </select>
                </fieldset>

                <fieldset>
                    <legend>Flow:</legend>
                    <select name="rp" class="select85 rack_pos">
                        <option value="0">Fixed</option>
                        <option value="1">Float</option>
                    </select>
                </fieldset>
                
            </div>
        </div>

        <div  class="win_layer" id="win_rack_layer2">
            <div class="todo">[TODO] next release:<br>
                -  export complete rack to PDF<br>
                <p style="text-decoration:line-through">-  rack position (one rack above the other)</p><br>
            </div> 
        </div>


    </div></div>