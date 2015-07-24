<div class="win w_resize" id="win_device_template"  style="left:300px;display:none;width:580px;height:420px;">
	<div class="win_header">
		<div class="win_close"></div>
		<div class="win_icon default"></div>
		<div class="win_notes"></div>
		<div class="win_header_name">Device Templates <span class="template"></span></div>	
	
	</div>
	
<div class="win_menu"><ul win="win_device_template">
		<li layout="1" class="aktive">General</li>
		<li layout="2">Hardware</li>
		<li layout="3">Network</li>
		<li layout="4">Layout</li>
		<li layout="6">Power</li>
		</ul></div>	

<div class="win_data" style="height:370px;">
	
<!--layer1 -->	
<div  class="win_layer win_visible" id="win_device_template_layer1">	

<fieldset>
		<legend>Category of devices</legend>
<select autocomplete="off" class="cat">
<?php 

foreach ($d_type as $dt){
echo'<option value="'.$dt['id'].'">'.$dt['name'].'</option>';
}
?>

</select>

</fieldset>


<fieldset>
		<legend>Existings templates in Category:</legend>


<div style="float:left;">
<select  autocomplete="off" class="temp"></select>

</div>

<!-- 
<fieldset>
		<legend>Rack units:</legend>
<div style="float:left;">
<select  autocomplete="off" class="select85">

</select>
</div>
 -->
<div class="temp_butt">
<div class="icons edit_action">
	<ul class="submenu">
	<li m="1">rename</li>
	<li m="2">duplicate</li>
	<li m="3">export</li>
	<li m="4">delete</li>
	</ul>
	</div></div>

<!-- <button class="rem">delete</button> -->
</fieldset>

<fieldset>
		<legend>New Template:</legend>
<div style="float:left;">
<input>
</div>
<div style="float:left;margin-left:5px;">
<a class="abutton make" href="#"><div class="inner">make</div></a>
</div>

</fieldset>


<fieldset>
		<legend>Import Template from ZIP:</legend>
<div style="float:left;">
<a class="abutton import" href="#"><div class="inner">import</div></a>
</div>



</fieldset>





</div>	
<!--layer2 -->	
<div  class="win_layer" id="win_device_template_layer2">	

</div>	
<!--layer3 -->	
<div  class="win_layer" id="win_device_template_layer3">	

</div>	
<!--layer3 -->	
<div  class="win_layer" id="win_device_template_layer4">	

</div>	
<!--layer6 -->	
<div  class="win_layer" id="win_device_template_layer6">	

</div>	
</div></div>