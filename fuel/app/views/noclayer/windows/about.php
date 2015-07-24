<div class="win" id="win_about"  style="display:none;left:400px;width:400px;height:250px;">
<div class="win_mask"></div>
<div class="win_header">
<div class="win_close"></div>
<div class="win_icon default"></div>
<div class="win_header_name">About</div>

<div class="win_data" style="height:330px;">		
	
        <?php 
            
        $ch=$upgraded['channel'];
        ?>
	<fieldset>
	<div class="logo"></div>
	<div style="margin-left: 20px;margin-top: 5px;" class="license">
	<div style="position:absolute;left:170px;">
        Channel    
        <div id="about_ch" style="color:black;"><?php echo $ch;?></div>    
        <div>Type</div>
        <div style="color:black;"><?php echo $nocversion;?></div>    
        </div>
        
        <div>Version</div>
	<div id="about_ver" style="color:black;"><?php echo $upgraded['version'];?></div>
        <div>Updated</div>
	<div id="about_dat" style="color:black;"><?php echo date('d/m/Y',$upgraded['update_time']);?></div>
	
	<?php
        
        if($upgraded){?>
	<div style="margin-top:20px;" id="upgrade">
	<div>Check for update</div>
	
	<div style="float:left;margin-top:0px;"><a onclick="UPDATE.check()" href="#" class="abutton"><div style="margin:0px;" class="inner">Check</div></a>
	</div>
	
	
	
	
	
	
	</div>
	
	
	<?php }
        
        ?>
	</div>
	</fieldset>

</div>
</div></div>