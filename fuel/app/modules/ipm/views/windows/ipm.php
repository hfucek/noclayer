<div class="win" id="win_ipm" style="z-index:400;height:550px;top:35px;width:1020px;display:none;left:200px">
    <div class="win_mask"></div>
    <div class="win_header">
        <div class="win_max"></div>
        <div style="display:none;" class="win_min"></div>
        <div class="win_close"></div>
        <div class="win_icon default"></div>
        <div class="win_header_name">IP Management</div>

    </div>

    <div style="float:left;width:240px;height:525px;border-right:1px solid #ccc;">

        <div id="ipm_tree" style="padding-top:5px;width:240px;height:520px;overflow:auto;"></div>
    </div>        

    <div style="width:778px;height:575px;float:left;position:relative;">

        <div class="win_menu">

            <ul win="win_ipm">
                <li layout="1" class="aktive">Overview</li>
                <li layout="2">Add/Edit</li>
                <li layout="3">Devices</li>
                <li layout="4">Location</li>
                <li layout="5">IP History</li>

                <!-- 

<li layout="7">VPS</li>
                -->
            </ul></div>        

        <div class="win_data" style="background: #f8f8f8;width:100%;position:relative;height:500px;">		

            <div  style="padding:0px;position:relative;" class="win_layer win_visible" id="win_ipm_layer1">


                <div style="clear:both;height:215px;position:relative;">

                    <div style="top:10px;position:absolute;left:25px;width:50%;">
                        <fieldset id="ipm_summary">

                        </fieldset>

                    </div>

                    <div id="ipm_pie" style="height: 100%; width: 320px; position: absolute;right:50px"></div>
                </div>

                <div id="ipm_subnet_data" >
                    <div style="position: absolute;right:0px;" graph="ipm_sub_lay_1" class="ipm_graph_nav">
                        <div style="margin-right:10px;" class="right"></div><div class="left"></div><div class="semafor"> 1 to 6 from 20</div>

                    </div>
                    <div class="half_menu">


                        <ul layer="ipm_sub_lay" menu="overviewmenu">
                            <li type="1" class="active">Map</li>
                            <li type="2">List</li>

                        </ul>
                    </div>
                    <div id="ipm_sub_lay_1" style="display:block;" class="ipm_data_map_list">



                    </div>
                    <div id="ipm_sub_lay_2" class="ipm_data_map_list"></div>

                </div>
                <div id="ipm_bar_wrap">
                    <div graph="ipm_bar" class="ipm_graph_nav">
                        <div class="title" id="ipm_overview_title"></div><div style="margin-right:10px;" class="right"></div><div class="left"></div><div class="semafor"> 1 to 6 from 20</div>

                    </div>

                    <div class="ipm_bar" id="ipm_bar" style="margin-left:10px;clear:both;width:760px;height:255px;">


                    </div>
                </div>


            </div>

            <div  class="win_layer" id="win_ipm_layer2">

                <ul class="ipm_edit_menu">
                    <li class="add"><div class="icon"></div>add subnet</li>
                    <li class="edit"><div class="icon"></div>edit subnet</li>
                    <li class="rem"><div class="icon"></div>remove subnet</li>

                    <li class="nadd"><div class="icon"></div>add folder</li>
                    <li class="nedit"><div class="icon"></div>edit folder</li>
                    <li class="nrem"><div class="icon"></div>remove folder</li>
                </ul>



                <div class="table_list">
                    <table cellspacing="0" cellpadding="0" id="ipm_list" width="100%" >
                    </table>



                </div>
                <div class="table_list">
                    <div id="subnet_list" > 


                    </div>
                </div> 
            </div>


            <!-- DEVICES -->
            <div  class="win_layer"  id="win_ipm_layer3" style="overflow-x: hidden;overflow-y: auto;height:100%;background: #f8f8f8;">

                <div class="ipm_device_menu" >

                    <div style="position: absolute;top:0px;right:0px;"  class="ipm_graph_nav">


                        <div style="margin-right:10px;" class="right"></div><div class="left"></div><div class="semafor"> loading..</div>

                    </div></div>


                <div class="ipm_devices" >



                </div>    
            </div>

            <!-- location -->
            <div  class="win_layer" id="win_ipm_layer4">

                <div id="win_ipm_layer41">

                </div>
                <div style="display:none;" id="win_ipm_layer42">
                    <div style="width:100%;text-align:center;margin-top:30px;color:#1e90ff;font-size:14px;">Please select Folder or Subnet first!</div>
                </div>
            </div>


            <!-- IP history -->
            <div  class="win_layer" id="win_ipm_layer5">

                <div id="win_ipm_layer51">


                </div>

                <div style="display:none;" id="win_ipm_layer52">
                    <div style="width:100%;text-align:center;margin-top:30px;color:#1e90ff;font-size:14px;">Please select Folder or Subnet first!</div>
                </div>

            </div>	

            <!-- ?? -->
            <div  class="win_layer" id="win_ipm_layer6">

            </div>
        </div>
    </div>
</div>