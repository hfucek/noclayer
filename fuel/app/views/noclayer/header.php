<!-- HEADER ========================================================================================= -->
<!-- settings -->
<ul class="menu menu_right">
	<li class="menu_div"><a class="menu_a" href="#"><div class="icon_right">
				<div class="settings"></div>
				&nbsp;
			</div> </a>

		<ul id="head_menu_settings_sub" class="sub_menu">
			<li id="head_setting_button" class="sub_menu_div"><a win="settings"
				class="menu_click" href="#"><div>Settings</div> </a>
			</li>
			<li class="sub_menu_div"><a act="logout" class="menu_click" href="#">
					<div>
						Logout
						<?php echo '<span class="disabled logname">('.$huser.')</span>';?>
					</div>
			</a>
			</li>
		</ul>
	</li>
</ul>

<?php
/*
 if($nocversion=='adv' or $nocversion=='pre')
 {
?>
<!-- Monitoring notification icons -->
<ul class="menu menu_right" style="right: 45px;">
<li class="menu_div"><a class="menu_a notiff" n="2" href="#"><div
style="display: none;" class="icon_menu">
<div class="icons notWARNING hint blink" act="no"
hint="WARNING status!"></div>
</div> </a>
</li>

<li class="menu_div"><a class="menu_a notiff" n="4" href="#"><div
class="icon_menu" style="display: none;">
<div class="icons notCRITICAL hint blink" act="no"
hint="CRITICAL status!"></div>
</div> </a>
</li>

<li class="menu_div"><a class="menu_a notiff" n="3" href="#"><div
style="display: none;" class="icon_menu">
<div class="icons notUNKNOWN hint blink" act="no"
hint="UNKNOWN status!"></div>
</div> </a>
</li>


</ul>


<!-- CABLE navigation -->

<ul
style="background: #f8f8f8; right: 300px; position: absolute; display: none;"
id="cableHead" class="menu">
<li class="menu_div"><a class="menu_a" style="width: 100px;" href="#">
<div class="menu_name">View</div>
</a>
<ul class="sub_menu clasps">

<li class="sub_menu_div"><a m="1" class="clasp_click"
id="view_minimap" act="1" href="#"><div>Minimap</div>
<div class="clasp claspAct"></div> </a></li>
<li class="sub_menu_div"><a m="2" class="clasp_click" id="view_tool"
act="1" href="#"><div>Tools</div>
<div class="clasp claspAct"></div> </a></li>
</ul>
</li>
<li class="menu_div"><a class="menu_a" style="width: 100px;" href="#">
<div class="menu_name">Cables</div>
</a>
<ul class="sub_menu chboxs">
<li class="sub_menu_div"><a m="1" class="chbox_click" act="1"
href="#"><div>UTP/Fiber</div>
<div class="chbox chboxAct"></div> </a></li>
<li class="sub_menu_div"><a m="2" class="chbox_click" href="#"><div>Power
supply</div>
<div class="chbox"></div> </a></li>
<li class="sub_menu_div"><a m="3" class="chbox_click" href="#"><div>KVM
switch</div>
<div class="chbox"></div> </a></li>
</ul>
</li>
</ul>
<?php
}
*/
 	
/*
 <!-- room action | add rack -->
<li class="menu_div"><a class="menu_a" id="room_action" href="#">
<div class="icon_menu">
<div class="icons head_action"></div>
&nbsp;
</div> </a>

<ul class="sub_menu">
<li class="sub_menu_div"><a class="rack_click" href="#"><div>Add new
Rack</div> </a></li>
</ul>
</li>


<?php
/*
if($nocversion=='adv' or $nocversion=='pre')
{
?>
<!-- CABLE mode activation -->
<li class="menu_div"><a class="menu_a" style="width: 100px;" href="#"><div
class="icon_menu">
<div class="icons cable_icon  hint" act="no"
hint="Activate cable mode!"></div>
</div> </a>
</li>
<?php
}


<!-- wiki activate-->
<li class="menu_div"><a class="menu_a wiki_click" href="#"><div
class="icon_menu">
<div class="icons wikicon hint" act="2" hint="Wiki"></div>
</div> </a>
</li>

<!-- search panel -->
<li class="menu_div">
<div act="0" class="menu_search hint"
hint="Click to activate search panel!"></div>
<ul class="sub_menu_null search_drop">

<li class="sub_menu_div">
<div style="padding: 0;">
<div id="icon_search"></div>
<div class="info">
<span>Search</span>
</div>
<input class="inputsearch"
style="position: absolute; width: 350px; margin-left: 175px; height: 25px; top: 0px; margin-top: 4px;"
autocomplete="off">

<div id="searchdata" style="margin-left: -1px; padding-top: 0px;">
<div class="back"></div>
<table id="searchtable">



</table>




<!--
<div style="float:left;margin-top:10px;"><a href="#" class="abutton"><div class="inner">Search</div></a></div>

<div class="alert">Search option is currently under development....</div>
-->
</div>
	
</li>

</ul>


</li>
<?php
/*
if($nocversion=='adv' or $nocversion=='pre')
{
?>
<!-- monitoring icon -->
<li class="menu_div"><a href="#" class="menu_a"><div class="icon_menu">
<div class="icons monitor_icon"></div>
&nbsp;
</div> </a>

<!-- monitor panel -->
<ul class="sub_menu monitor_sub" style="display: none;">
<li>
<div class="name">host</div>
<div class="h num numst0">0</div>
</li>
<li>
<div class="name">up</div>
<div class="hUP num numst1">0</div>
</li>
<li>
<div class="name">down</div>
<div class="hDOWN num numst2">0</div>
</li>
<li>
<div class="name">unreachable</div>
<div class="hUNREACHABLE num numst6">0</div>
</li>

<li>
<div class="name">Pending</div>
<div class="hPENDING num numst3">0</div>
</li>



<li>
<div class="name">services</div>
<div class="s num numst0">0</div>
</li>
<li>
<div class="name">ok</div>
<div class="sOK num numst1">0</div>
</li>
<li>
<div class="name">warning</div>
<div class="sWARNING num numst5">0</div>
</li>
<li>
<div class="name">critical</div>
<div class="sCRITICAL num numst2">0</div>
</li>
<li>
<div class="name">unknown</div>
<div class="sUNKNOWN num numst4">0</div>
</li>

<li>
<div class="name">Pending</div>
<div class="sPENDING num numst3">0</div>
</li>

</ul>
</li>

<?php
}
*/
?>
<!-- logo navigation -->
<ul class="menu menu_noc">
	<li class="menu_div">
		<div class="headerlogo"></div>

		<ul class="sub_menu">
			<li class="sub_menu_div"><a win="license" class="menu_click" href="#"><div>License</div>
			</a></li>
			<!-- <li class="sub_menu_div"><a win="demo" class="menu_click" href="#"><div>Tutorials</div>
			</a></li> -->
			<li class="sub_menu_div"><a win="about" class="menu_click" href="#"><div>About</div>
			</a></li>

		</ul>
	</li>

</ul>

<!-- /HEADER ========================================================================================= -->
