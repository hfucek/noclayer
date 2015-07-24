<div class="win" id="win_debugging"  style="display:none;z-index:600;left:200px;width:1020px;height:550px;top: 71px; ">

    <div class="win_mask"></div>		
    <div class="win_header">
        <div class="win_close"></div>
        <div class="win_icon default"></div>
        <div class="win_header_name">Debugging</div>	
    </div>

    
    <div style="float:left;width:300px;height:525px;border-right:1px solid #ccc;">

        <select class="pick_server">
          <option>Localhost</option>
          <option>Test server</option>
        </select>
        
        <div id="debugging_tree" style="padding-top:5px;width:300px;height:520px;overflow:auto;" class="jstree jstree-0 jstree-focused jstree-default">
            <ul>
                <li id="main_1" rel="group" class="jstree-last jstree-open">
                    <ins class="jstree-icon">&nbsp;</ins>
                    <a href="#" class="">
                        <ins class="jstree-icon">&nbsp;</ins>My company
                    </a>
                    <ul>
                        <li id="node_1" rel="test" class="jstree-open">
                            <ins class="jstree-icon">&nbsp;</ins>
                            <a href="#" class="">
                                <ins class="jstree-icon">&nbsp;</ins>test
                            </a>
                            <ul>
                                <li id="subnet_1" rel="record" class="jstree-leaf">
                                    <ins class="jstree-icon">&nbsp;</ins>
                                    <a href="#">
                                        <ins class="jstree-icon">&nbsp;</ins>66.0.0.0/24
                                    </a>
                                </li>
                                <li id="subnet_3" rel="record" class="jstree-last jstree-leaf">
                                    <ins class="jstree-icon">&nbsp;</ins>
                                    <a href="#">
                                        <ins class="jstree-icon">&nbsp;</ins>172.168.0.0/24
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li id="node_2" rel="test" class="jstree-closed jstree-last">
                            <ins class="jstree-icon">&nbsp;</ins>
                            <a href="#">
                                <ins class="jstree-icon">&nbsp;</ins>asdf
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
    
    <div style="width:718px;height:575px;float:left;position:relative;">

        <div class="win_menu">
            <ul win="win_debugging_settings">
                <li layout="1" class="aktive">Overview</li>
                <li layout="2">Add/Edit</li>
            </ul>
        </div>

        <div class="win_data" style="background: #f8f8f8;width:100%;position:relative;height:500px;">		
            
            <!-- General -->
            <div style="padding:0px;position:relative;" class="win_layer win_visible" id="win_debugging_settings_layer1">
                
                <div style="clear:both;height:215px;position:relative;">
                    
                    <div style="top:10px;position:absolute;left:20px;width:50%;">
                        <fieldset id="debug_summary">
                            
                            <legend>Summary</legend>
                            <div style="float:left; width:180px;">
                                
                                <div>Total groups:</div> 
                                <div class="tot_group default">762</div>

                                <div>Total tests:</div>
                                <div class="tot_test default">125</div>
                                
                                <div>&nbsp;</div>
                                <div class="default">&nbsp;</div>
                                
                                <div>&nbsp;</div>
                                <div class="default">&nbsp;</div>
                            </div>
                            
                            <div style="flaot:left;">
                                
                                <div>Average CPU:</div>
                                <div class="avg_cpu default">10</div>
                                
                                <div>Average RAM:</div>
                                <div class="avg_ram default">125</div>

                                <div>Max CPU:</div>
                                <div class="max_cpu default">125</div>

                                <div>Max RAM:</div>
                                <div class="max_ram default">125</div>
                            </div>
                        </fieldset>
                    </div>
                    
                    <div id="debug_pie" style="height: 100%; width: 320px; position: absolute;right:20px" class="jqplot-target">
                        <canvas width="320" height="215" class="jqplot-base-canvas" style="position: absolute; left: 0px; top: 0px;"></canvas>
                        <div class="jqplot-title" style="height: 0px; width: 0px;"></div>
                        <canvas width="320" height="215" class="jqplot-grid-canvas" style="position: absolute; left: 0px; top: 0px;"></canvas>
                        <canvas width="300" height="182" class="jqplot-series-shadowCanvas" style="position: absolute; left: 10px; top: 10px;"></canvas>
                        <canvas width="300" height="182" class="jqplot-series-canvas" style="position: absolute; left: 10px; top: 10px;"></canvas>
                        <table class="jqplot-table-legend" style="position: absolute; right: 10px; bottom: 23px;">
                            <tbody>
                                <tr class="jqplot-table-legend">
                                    <td class="jqplot-table-legend jqplot-table-legend-swatch" style="text-align: center; padding-top: 0px;">
                                        <div class="jqplot-table-legend-swatch-outline">
                                            <div class="jqplot-table-legend-swatch" style="background-color: rgb(75, 178, 197); border-color: rgb(75, 178, 197);"></div>
                                        </div>
                                    </td>
                                    <td class="jqplot-table-legend jqplot-table-legend-label" style="padding-top: 0px;">Used</td>
                                </tr>
                                <tr class="jqplot-table-legend">
                                    <td class="jqplot-table-legend jqplot-table-legend-swatch" style="text-align: center; padding-top: 0.5em;">
                                        <div class="jqplot-table-legend-swatch-outline">
                                            <div class="jqplot-table-legend-swatch" style="background-color: rgb(234, 162, 40); border-color: rgb(234, 162, 40);"></div>
                                        </div>
                                    </td>
                                    <td class="jqplot-table-legend jqplot-table-legend-label" style="padding-top: 0.5em;">Reserved</td>
                                </tr>
                                <tr class="jqplot-table-legend">
                                    <td class="jqplot-table-legend jqplot-table-legend-swatch" style="text-align: center; padding-top: 0.5em;">
                                        <div class="jqplot-table-legend-swatch-outline">
                                            <div class="jqplot-table-legend-swatch" style="background-color: rgb(197, 180, 127); border-color: rgb(197, 180, 127);"></div>
                                            
                                        </div>
                                    </td>
                                    <td class="jqplot-table-legend jqplot-table-legend-label" style="padding-top: 0.5em;">Free</td>
                                </tr>
                            </tbody>
                        </table>
                        <canvas width="300" height="182" class="jqplot-pieRenderer-highlight-canvas" style="position: absolute; left: 10px; top: 10px;"></canvas>
                        <canvas width="300" height="182" class="jqplot-pieRenderer-highlight-canvas" style="position: absolute; left: 10px; top: 10px;"></canvas>
                        <canvas width="300" height="182" class="jqplot-pieRenderer-highlight-canvas" style="position: absolute; left: 10px; top: 10px;"></canvas>
                        <canvas width="300" height="182" class="jqplot-pieRenderer-highlight-canvas" style="position: absolute; left: 10px; top: 10px;"></canvas>
                        <canvas width="300" height="182" class="jqplot-pieRenderer-highlight-canvas" style="position: absolute; left: 10px; top: 10px;"></canvas>
                        <div class="jqplot-pie-series jqplot-data-label" style="position: absolute; left: 48px; top: 90px;">100%</div>
                        <canvas width="300" height="182" class="jqplot-event-canvas" style="position: absolute; left: 10px; top: 10px;"></canvas>
                        <canvas width="320" height="215" class="jqplot-base-canvas" style="position: absolute; left: 0px; top: 0px;"></canvas>
                        <div class="jqplot-title" style="height: 0px; width: 0px;"></div>
                        <canvas width="320" height="215" class="jqplot-grid-canvas" style="position: absolute; left: 0px; top: 0px;"></canvas>
                        <canvas width="300" height="182" class="jqplot-series-shadowCanvas" style="position: absolute; left: 10px; top: 10px;"></canvas>
                        <canvas width="300" height="182" class="jqplot-series-canvas" style="position: absolute; left: 10px; top: 10px;"></canvas>
                        <table class="jqplot-table-legend" style="position: absolute; right: 10px; bottom: 23px;">
                            <tbody>
                                <tr class="jqplot-table-legend">
                                    <td class="jqplot-table-legend jqplot-table-legend-swatch" style="text-align: center; padding-top: 0px;">
                                        <div class="jqplot-table-legend-swatch-outline">
                                            <div class="jqplot-table-legend-swatch" style="background-color: rgb(75, 178, 197); border-color: rgb(75, 178, 197);"></div>
                                            
                                        </div>
                                    </td>
                                    <td class="jqplot-table-legend jqplot-table-legend-label" style="padding-top: 0px;">Used</td>
                                </tr>
                                <tr class="jqplot-table-legend">
                                    <td class="jqplot-table-legend jqplot-table-legend-swatch" style="text-align: center; padding-top: 0.5em;">
                                        <div class="jqplot-table-legend-swatch-outline">
                                            <div class="jqplot-table-legend-swatch" style="background-color: rgb(234, 162, 40); border-color: rgb(234, 162, 40);">
                                                
                                            </div></div>
                                    </td>
                                    <td class="jqplot-table-legend jqplot-table-legend-label" style="padding-top: 0.5em;">Reserved</td>
                                </tr>
                                <tr class="jqplot-table-legend">
                                    <td class="jqplot-table-legend jqplot-table-legend-swatch" style="text-align: center; padding-top: 0.5em;">
                                        <div class="jqplot-table-legend-swatch-outline">
                                            <div class="jqplot-table-legend-swatch" style="background-color: rgb(197, 180, 127); border-color: rgb(197, 180, 127);"></div>
                                        </div>
                                    </td>
                                    <td class="jqplot-table-legend jqplot-table-legend-label" style="padding-top: 0.5em;">Free</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="jqplot-pie-series jqplot-data-label" style="position: absolute; left: 48px; top: 90px;">100%</div>
                        <canvas width="300" height="182" class="jqplot-event-canvas" style="position: absolute; left: 10px; top: 10px;"></canvas>
                        <canvas width="320" height="215" class="jqplot-base-canvas" style="position: absolute; left: 0px; top: 0px;"></canvas>
                        <div class="jqplot-title" style="height: 0px; width: 0px;"></div>
                        <canvas width="320" height="215" class="jqplot-grid-canvas" style="position: absolute; left: 0px; top: 0px;"></canvas>
                        <canvas width="300" height="182" class="jqplot-series-shadowCanvas" style="position: absolute; left: 10px; top: 10px;"></canvas>
                        <canvas width="300" height="182" class="jqplot-series-canvas" style="position: absolute; left: 10px; top: 10px;"></canvas>
                        <table class="jqplot-table-legend" style="position: absolute; right: 10px; bottom: 23px;">
                            <tbody>
                                <tr class="jqplot-table-legend">
                                    <td class="jqplot-table-legend jqplot-table-legend-swatch" style="text-align: center; padding-top: 0px;">
                                        <div class="jqplot-table-legend-swatch-outline">
                                            <div class="jqplot-table-legend-swatch" style="background-color: rgb(75, 178, 197); border-color: rgb(75, 178, 197);"></div>
                                            
                                        </div>
                                    </td>
                                    <td class="jqplot-table-legend jqplot-table-legend-label" style="padding-top: 0px;">Used</td>
                                </tr>
                                <tr class="jqplot-table-legend">
                                    <td class="jqplot-table-legend jqplot-table-legend-swatch" style="text-align: center; padding-top: 0.5em;">
                                        <div class="jqplot-table-legend-swatch-outline">
                                            <div class="jqplot-table-legend-swatch" style="background-color: rgb(234, 162, 40); border-color: rgb(234, 162, 40);"></div>
                                            
                                        </div>
                                    </td>
                                    <td class="jqplot-table-legend jqplot-table-legend-label" style="padding-top: 0.5em;">Reserved</td>
                                </tr>
                                <tr class="jqplot-table-legend">
                                    <td class="jqplot-table-legend jqplot-table-legend-swatch" style="text-align: center; padding-top: 0.5em;">
                                        <div class="jqplot-table-legend-swatch-outline">
                                            <div class="jqplot-table-legend-swatch" style="background-color: rgb(197, 180, 127); border-color: rgb(197, 180, 127);"></div>
                                            
                                        </div>
                                    </td>
                                    <td class="jqplot-table-legend jqplot-table-legend-label" style="padding-top: 0.5em;">Free</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="jqplot-pie-series jqplot-data-label" style="position: absolute; left: 48px; top: 90px;">100%</div>
                        <canvas width="300" height="182" class="jqplot-event-canvas" style="position: absolute; left: 10px; top: 10px;"></canvas>
                        <canvas width="320" height="215" class="jqplot-base-canvas" style="position: absolute; left: 0px; top: 0px;"></canvas>
                        <div class="jqplot-title" style="height: 0px; width: 0px;"></div>
                        <canvas width="320" height="215" class="jqplot-grid-canvas" style="position: absolute; left: 0px; top: 0px;"></canvas>
                        <canvas width="300" height="182" class="jqplot-series-shadowCanvas" style="position: absolute; left: 10px; top: 10px;"></canvas>
                        <canvas width="300" height="182" class="jqplot-series-canvas" style="position: absolute; left: 10px; top: 10px;"></canvas>
                        <table class="jqplot-table-legend" style="position: absolute; right: 10px; bottom: 23px;">
                            <tbody>
                                <tr class="jqplot-table-legend">
                                    <td class="jqplot-table-legend jqplot-table-legend-swatch" style="text-align: center; padding-top: 0px;">
                                        <div class="jqplot-table-legend-swatch-outline">
                                            <div class="jqplot-table-legend-swatch" style="background-color: rgb(75, 178, 197); border-color: rgb(75, 178, 197);"></div>
                                            
                                        </div>
                                    </td>
                                    <td class="jqplot-table-legend jqplot-table-legend-label" style="padding-top: 0px;">Used</td>
                                </tr>
                                <tr class="jqplot-table-legend">
                                    <td class="jqplot-table-legend jqplot-table-legend-swatch" style="text-align: center; padding-top: 0.5em;">
                                        <div class="jqplot-table-legend-swatch-outline">
                                            <div class="jqplot-table-legend-swatch" style="background-color: rgb(234, 162, 40); border-color: rgb(234, 162, 40);"></div>
                                            
                                        </div>
                                    </td>
                                    <td class="jqplot-table-legend jqplot-table-legend-label" style="padding-top: 0.5em;">Reserved</td>
                                </tr>
                                <tr class="jqplot-table-legend">
                                    <td class="jqplot-table-legend jqplot-table-legend-swatch" style="text-align: center; padding-top: 0.5em;">
                                        <div class="jqplot-table-legend-swatch-outline">
                                            <div class="jqplot-table-legend-swatch" style="background-color: rgb(197, 180, 127); border-color: rgb(197, 180, 127);"></div>
                                            
                                        </div>
                                    </td>
                                    <td class="jqplot-table-legend jqplot-table-legend-label" style="padding-top: 0.5em;">Free</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="jqplot-pie-series jqplot-data-label" style="position: absolute; left: 48px; top: 90px;">100%</div>
                        <canvas width="300" height="182" class="jqplot-event-canvas" style="position: absolute; left: 10px; top: 10px;"></canvas>
                        <canvas width="320" height="215" class="jqplot-base-canvas" style="position: absolute; left: 0px; top: 0px;"></canvas>
                        <div class="jqplot-title" style="height: 0px; width: 0px;"></div>
                        <canvas width="320" height="215" class="jqplot-grid-canvas" style="position: absolute; left: 0px; top: 0px;"></canvas>
                        <canvas width="300" height="182" class="jqplot-series-shadowCanvas" style="position: absolute; left: 10px; top: 10px;">
                        </canvas><canvas width="300" height="182" class="jqplot-series-canvas" style="position: absolute; left: 10px; top: 10px;">
                        </canvas>
                        <table class="jqplot-table-legend" style="position: absolute; right: 10px; bottom: 23px;">
                            <tbody>
                                <tr class="jqplot-table-legend">
                                    <td class="jqplot-table-legend jqplot-table-legend-swatch" style="text-align: center; padding-top: 0px;">
                                        <div class="jqplot-table-legend-swatch-outline">
                                            <div class="jqplot-table-legend-swatch" style="background-color: rgb(75, 178, 197); border-color: rgb(75, 178, 197);"></div>
                                            
                                        </div>
                                    </td>
                                    <td class="jqplot-table-legend jqplot-table-legend-label" style="padding-top: 0px;">Used</td>
                                </tr>
                                <tr class="jqplot-table-legend">
                                    <td class="jqplot-table-legend jqplot-table-legend-swatch" style="text-align: center; padding-top: 0.5em;">
                                        <div class="jqplot-table-legend-swatch-outline">
                                            <div class="jqplot-table-legend-swatch" style="background-color: rgb(234, 162, 40); border-color: rgb(234, 162, 40);"></div>
                                            
                                        </div>
                                    </td>
                                    <td class="jqplot-table-legend jqplot-table-legend-label" style="padding-top: 0.5em;">Reserved</td>
                                </tr>
                                <tr class="jqplot-table-legend">
                                    <td class="jqplot-table-legend jqplot-table-legend-swatch" style="text-align: center; padding-top: 0.5em;">
                                        <div class="jqplot-table-legend-swatch-outline">
                                            <div class="jqplot-table-legend-swatch" style="background-color: rgb(197, 180, 127); border-color: rgb(197, 180, 127);"></div>
                                            
                                        </div>
                                    </td>
                                    <td class="jqplot-table-legend jqplot-table-legend-label" style="padding-top: 0.5em;">Free</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="jqplot-pie-series jqplot-data-label" style="position: absolute; left: 48px; top: 90px;">100%</div>
                        <canvas width="300" height="182" class="jqplot-event-canvas" style="position: absolute; left: 10px; top: 10px;"></canvas>
                    </div>
                </div>

                <div id="debug_graph_data" style="display: none;">
                    <div style="position: absolute;right:0px;" graph="ipm_sub_lay_1" class="ipm_graph_nav">
                        <div style="margin-right:10px;" class="right"></div><div class="left"></div><div class="semafor"> 1 to 6 from 20</div>
                    </div>
                    <div class="half_menu">


                        <ul layer="debug_lay" menu="overviewmenu">
                            <li type="1" class="active">Map</li>
                            <li type="2">List</li>

                        </ul>
                    </div>
                    <div id="debug_graph_lay_1" style="display:block;" class="ipm_data_map_list">



                    </div>
                    <div id="debug_graph_lay_2" class="ipm_data_map_list"></div>

                </div>
                
                <div id="debug_bar_wrap">
                    <div graph="ipm_bar" class="ipm_graph_nav">
                        <div class="title" id="debug_overview_title">IP usage for <b>My company</b> </div><div style="margin-right:10px;" class="right rdis" act="no"></div><div class="left ldis" act="no"></div><div class="semafor">Showing 1 to 3 of 3 entries</div>

                    </div>

                    <div class="ipm_bar jqplot-target" id="debug_bar" style="margin-left: 10px; clear: both; width: 760px; height: 255px; position: relative;" from="0"><canvas width="760" height="255" class="jqplot-base-canvas" style="position: absolute; left: 0px; top: 0px;"></canvas><div class="jqplot-title" style="height: 0px; width: 0px;"></div><div class="jqplot-axis jqplot-xaxis" style="position: absolute; width: 760px; height: 18px; left: 0px; bottom: 0px;"><div class="jqplot-xaxis-tick" style="position: absolute; left: 118.33333333333331px;">66.0.0.0/24</div><div class="jqplot-xaxis-tick" style="position: absolute; left: 350px;">192.168.0.0/24</div><div class="jqplot-xaxis-tick" style="position: absolute; left: 590.6666666666666px;">172.168.0.0/24</div></div><div class="jqplot-axis jqplot-yaxis" style="position: absolute; height: 255px; width: 18px; left: 0px; top: 0px;"><div class="jqplot-yaxis-tick" style="position: absolute; top: 218px;">0</div><div class="jqplot-yaxis-tick" style="position: absolute; top: 181.83333333333334px;">50</div><div class="jqplot-yaxis-tick" style="position: absolute; top: 145.66666666666669px;">100</div><div class="jqplot-yaxis-tick" style="position: absolute; top: 109.5px;">150</div><div class="jqplot-yaxis-tick" style="position: absolute; top: 73.33333333333334px;">200</div><div class="jqplot-yaxis-tick" style="position: absolute; top: 37.16666666666666px;">250</div><div class="jqplot-yaxis-tick" style="position: absolute; top: 1px;">300</div></div><canvas width="760" height="255" class="jqplot-grid-canvas" style="position: absolute; left: 0px; top: 0px;"></canvas><canvas width="722" height="217" class="jqplot-series-shadowCanvas" style="position: absolute; left: 28px; top: 10px;"></canvas><canvas width="722" height="217" class="jqplot-series-shadowCanvas" style="position: absolute; left: 28px; top: 10px;"></canvas><canvas width="722" height="217" class="jqplot-series-shadowCanvas" style="position: absolute; left: 28px; top: 10px;"></canvas><canvas width="722" height="217" class="jqplot-series-canvas" style="position: absolute; left: 28px; top: 10px;"></canvas><div class="jqplot-point-label jqplot-series-0 jqplot-point-2" style="position: absolute; left: 588.6666666666666px; top: 203px;">0</div><div class="jqplot-point-label jqplot-series-0 jqplot-point-1" style="position: absolute; left: 348px; top: 203px;">0</div><div class="jqplot-point-label jqplot-series-0 jqplot-point-0" style="position: absolute; left: 107.33333333333331px; top: 203px;">0</div><canvas width="722" height="217" class="jqplot-series-canvas" style="position: absolute; left: 28px; top: 10px;"></canvas><div class="jqplot-point-label jqplot-series-1 jqplot-point-2" style="position: absolute; left: 626.6666666666666px; top: 203px;">0</div><div class="jqplot-point-label jqplot-series-1 jqplot-point-1" style="position: absolute; left: 386px; top: 203px;">0</div><div class="jqplot-point-label jqplot-series-1 jqplot-point-0" style="position: absolute; left: 145.33333333333331px; top: 203px;">0</div><canvas width="722" height="217" class="jqplot-series-canvas" style="position: absolute; left: 28px; top: 10px;"></canvas><div class="jqplot-point-label jqplot-series-2 jqplot-point-2" style="position: absolute; left: 658.6666666666666px; top: 19.27333333333334px;">254</div><div class="jqplot-point-label jqplot-series-2 jqplot-point-1" style="position: absolute; left: 418px; top: 19.27333333333334px;">254</div><div class="jqplot-point-label jqplot-series-2 jqplot-point-0" style="position: absolute; left: 177.33333333333331px; top: 19.27333333333334px;">254</div><canvas width="722" height="217" class="jqplot-barRenderer-highlight-canvas" style="position: absolute; left: 28px; top: 10px;"></canvas><canvas width="722" height="217" class="jqplot-event-canvas" style="position: absolute; left: 28px; top: 10px;"></canvas></div>
                </div>
                
            </div>

            <!-- Add/Edit -->
            <div class="win_layer" id="win_debugging_settings_layer2">

                <ul class="debug_edit_menu">
                    
                    <li cat="0" act="1" class="rec"><div class="icon"></div>start recording</li>
                    <li cat="0" act="2" class="stop" style="display:none"><div class="icon"></div>stop recording</li>
                    
                    <li cat="1" act="1" class="group add" style="display: none;"><div class="icon"></div>add group</li>
                    <li cat="1" act="2" class="group edit" style="display: none;"><div class="icon"></div>edit group</li>
                    <li cat="1" act="3" class="group rem" style="display: none;"><div class="icon"></div>remove group</li>
                    
                    <li cat="2" act="2" class="test edit" style="display:none"><div class="icon"></div>edit test</li>
                    <li cat="2" act="3" class="test rem" style="display:none"><div class="icon"></div>remove test</li>
                    
                    <li cat="3" act="2" class="record edit" style="display: none;"><div class="icon"></div>edit record</li>
                    <li cat="3" act="3" class="record rem" style="display: none;"><div class="icon"></div>remove record</li>

                    <li cat="4" act="1" class="nadd" style="display: none;"><div class="icon"></div>copy</li>
                </ul>
                
                
                <div class="table_list">
                    <div id="ipm_list_wrapper" class="dataTables_wrapper" role="grid">
                        <table cellspacing="0" cellpadding="0" id="checks_list" width="100%" class="dataTable" aria-describedby="debug_list_info" style="width: 100%;">
                            <thead>
                                <tr role="row">
                                    <th class="sorting" tabindex="0" rowspan="1" colspan="1" aria-label="Subnet Address: activate to sort column ascending" style="width: 20px;">Id</th>
                                    <th class="sorting_desc" tabindex="0" rowspan="1" colspan="1" aria-sort="descending" aria-label="Size: activate to sort column ascending" style="width: 355px;">Test name</th>
                                    <th class="center sorting" tabindex="0" rowspan="1" colspan="1" aria-label="Mask: activate to sort column ascending" style="width: 110px;">Time [ms]</th>
                                    <th class="center sorting" tabindex="0" rowspan="1" colspan="1" aria-label="Usage [num]: activate to sort column ascending" style="width: 200px;">CPU [%]</th>
                                    <th class="center usage sorting" tabindex="0" rowspan="1" colspan="1" aria-label="Usage [%]: activate to sort column ascending" style="width: 200px;">RAM [mb]</th>
                                    <th class="center selectspace sorting" tabindex="0" rowspan="1" colspan="1" aria-label=": activate to sort column ascending" style="width: 20px;">Status</th>
                                </tr>
                            </thead>
                            <tbody role="alert" aria-live="polite" aria-relevant="all">
                            </tbody>
                        </table>
                        <div class="dataTables_info" id="debug_list_info">Showing 1 to 3 of 3 entries</div>
                        <div class="dataTables_paginate paging_two_button" id="ipm_list_paginate">
                            <a class="paginate_disabled_previous" tabindex="0" role="button" id="ipm_list_previous" aria-controls="ipm_list"></a>
                            <a class="paginate_disabled_next" tabindex="0" role="button" id="ipm_list_next" aria-controls="ipm_list"></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</div>