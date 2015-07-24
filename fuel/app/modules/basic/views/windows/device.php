
<div class="win w_resize" id="win_device"  style="display:none;width:580px;height:420px;">
<div id="win_device_mask" class="win_mask"></div>		
	<div class="win_header">
		<div class="win_close"></div>
		<div class="win_icon default"></div>
		<div class="win_notes"></div>
		<div class="win_header_name">Device <span class="template"></span></div>	
	
	</div>
	<div class="win_menu"><ul win="win_device">
		<li layout="1" class="aktive">General</li>
		<li layout="2">Hardware</li>
		<li layout="3">Network</li>
		<li layout="4">Layout</li>
		<li layout="5">Notes</li>
		<li layout="6">Power</li>
		<li layout="7">VPS</li>
		<!-- 
		
		<li layout="7">VPS</li>
		 -->
		</ul></div>
	<div class="win_data" style="height:370px;">
<div  class="win_layer win_visible" id="win_device_layer0">

<div class="float_field">
<fieldset style="width:225px;">
		<legend>Category of device:</legend>
<div id="dev_data_cat" class="default">Server</div>
</fieldset>

<fieldset>
		<legend>Action:</legend>
<!-- <button  id="win_dev_0">Delete</button> -->
<div class="temp_butt">
<div class="icons edit_action">
	<ul class="submenu">
	<li m="1">Edit</li>
	<li m="2">Export</li>
	<li m="3">Delete</li>
	</ul>
	</div></div>
	

</fieldset>

</div>

<fieldset class="cls">
		<legend>Template:</legend>
<div id="dev_data_temp" class="default">none</div>
</select>

</fieldset>

<fieldset>
		<legend>Name / hostname:</legend>
<div id="dev_data_host" class="default">Name9855</div>
</fieldset>

<fieldset>
		<legend>Parent device:</legend>
<div id="dev_data_parent" class="default">none</div>


</fieldset>



<fieldset>
		<legend>Rack name:</legend>
<div id="dev_data_rack" class="default">Default rack</div>
</fieldset>
<div class="float_field">
<fieldset>
		<legend>Rack position:</legend>
<div id="dev_data_pos" class="default">33</div>
</fieldset>

<fieldset>
		<legend>Number of rack units:</legend>
<div id="dev_data_ru" class="default">1</div>
</fieldset>

</div>
		
		

</div>

<div  class="win_layer" id="win_device_layer1">
<div class="float_field">
<fieldset>
		<legend>Category of device:</legend>
<select id="win_dev_1">
<?php 
echo'<option value="0">Unknown</option>';
foreach ($d_type as $dt){
echo'<option value="'.$dt['id'].'">'.$dt['name'].'</option>';
}
?>

</select>

</fieldset>

<fieldset>
		<legend>Action:</legend>
<!-- <button  id="win_dev_0">Delete</button> -->
<div class="temp_butt">
<div class="icons edit_action">
	<ul class="submenu">
	<li m="1">Close Edit</li>
	<li m="2">Export</li>
	<li m="3">Delete</li>
	</ul>
	</div></div>
<!-- 	
<div style="float:left;margin-left:5px;">
<a class="button closedit" href="#"><div class="inner">close edit</div></a>
</div>	
 -->	

</fieldset>





</div>

<fieldset class="cls">
		<legend>Template:</legend>
<select id="win_dev_20">
<?php 
echo'<option value="0">Unknown</option>';

?>

</select>

</fieldset>

<fieldset>
		<legend>Name / hostname:</legend>
<input id="win_dev_2" type="text"  value="w80.nodata.biz">
</fieldset>

<fieldset>
		<legend>Parent device:</legend>
<select   id="win_dev_3">

</select>
</fieldset>



<fieldset>
		<legend>Rack name:</legend>
<input disabled type="text" value="rack91"  id="win_dev_4">
</fieldset>
<div class="float_field">
<fieldset>
		<legend>Rack position:</legend>

<select class="select85"  id="win_dev_5">

</select>



</fieldset>

<fieldset>
		<legend>Number of rack units:</legend>
<select class="select85"  id="win_dev_6">
<option>1</option>
<option>2</option>
<option>3</option>
<option>4</option>
<option>5</option>
<option>6</option>
<option>7</option>
<option>8</option>
<option>9</option>
<option>10</option>
<option>12</option>
<option>16</option>
</select>

</fieldset>

</div>



</div>	
	
<div class="win_layer" id="win_device_layer2"></div>		
	
<div class="win_layer"  id="win_device_layer3"></div>		
	
<div class="win_layer" id="win_device_layer4"></div>	

<div class="win_layer" id="win_device_layer5"></div>	

<div class="win_layer" id="win_device_layer6"></div>

<div class="win_layer" id="win_device_layer7" style="padding:0px;">
<div  class="win_submenu">
<ul style="margin-left: 5px;">

<li l="1" class="aktive">Virtual devices</li>
<li l="2">Storage</li>
<li l="3">Summary</li>
<li l="4">Map</li>
</ul>
</div>


<div class="win_sublayer" id="win_device_layer7_3">




</div>
<div class="win_sublayer win_visible" id="win_device_layer7_1">






</div>


<div class="win_sublayer" id="win_device_layer7_2">



</div>

<div class="win_sublayer" id="win_device_layer7_4">
	<canvas id="maps" width="560" height="300"></canvas>

</div>



</div>

</div>

	</div>
	