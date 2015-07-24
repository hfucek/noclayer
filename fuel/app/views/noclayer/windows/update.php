<div class="win" id="win_update"  style="display:none;left:400px;width:480px;height:180px;background: #FFFADC;">
<div class="win_mask"></div>
<div class="win_header">
<div class="win_close"></div>
<div class="win_icon default"></div>
<div class="win_header_name">Update available</div>

<div class="win_data" style="height:330px;">		
	
	
	
           
           
	<div class="license" style="margin:20px 10px;width:135px;">
	<div>Current Version</div>
	<div id="up_cur_ver" style="margin-bottom: 5px;color:black;background:#f8f8f8;font-size:18px;line-height:25px;"><?php echo $upgraded['version'];?></div>
	<div>Available Version</div>
	<div id="up_avi_ver" style="color:black;background:#f8f8f8;font-size:18px;line-height:25px;"><?php echo $upgraded['available'];?></div>
	
	
        <div style="left:10px;bottom:5px;position:absolute;font:12px Verdana;color:#880000;">Please backup your database first!</div> 
	
	
	</div>
	

    <div style="position: absolute;right:20px;top: 45px;width:100px;height:100px;">
        <div style="float:right;margin:10px;"><a onclick="UPDATE.auto()" href="#" class="abutton"><div style="margin:0px;" class="inner">Autoupdate</div></a>
	</div>
        <div style="float:right;margin:10px;"><a onclick="UPDATE.manual()" href="#" class="abutton"><div style="margin:0px;" class="inner">Manual</div></a>
	</div>
                
	</div>
	
    
</div>
</div></div>