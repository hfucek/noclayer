<div class="win" id="win_upgrade" mask2="ok"  style="background: #FFFADC;display:none;left:50%;margin-left:-240px;width:480px;height:380px;">
<div class="win_mask"></div>
<div class="win_header">

<div class="win_icon default"></div>
<div class="win_header_name">Upgrade in progress!</div>

<div class="win_data" style="margin-top:2px;height:310px;border-bottom:1px solid #ccc;">		
	
	
	
           
           
	<div id="upgrade_stat" class="license" style="display:none;margin:20px 10px;width:460px;">
        <div>
        <div id="" class="title">Is writeable(by server)</div>
        
        <div id="upgrade_write" class="data"></div>
        </div>
           
            
        <div id="upgrade_normal">
        <div>
        <div class="title">Download update</div>
	<div id="upgrade_progress" class="data">
            <div>21313</div>
            <div>21313</div>
            <div>21313</div>
        </div>
        </div>
            
        <div>
        <div  class="title">Extracting</div>
	<div id="upgrade_extract" class="data">
        
        </div>
        </div>	

        <div  class="title">Database migration</div>
	<div id="upgrade_migration" class="data"></div>
	
        </div>
       
    </div>
    
    
    <div class="license" style="display:block;" id="upgrade_local_data">
        <div class="warn">
        Noclayer detected new upgrade on disk!
        </div>
        <div class="warn">
        Hit button to migrate database
        </div>
    </div>
        
        <div id="bepatient" style="display:none;left:10px;bottom:5px;position:absolute;font:12px Verdana;color:#880000;">Please be patient!</div> 
    
	
	
	

<div id="upgrade_ftp" style="display:none;position: absolute;right:20px;bottom: 20px;width:460px;height:20px;">
        <div style="float:left;margin:10px;color:#990000;">Download update manual!</div>
        
        <div style="float:right;margin:10px;"><a onclick="UPDATE.manual()" href="#" class="abutton"><div style="margin:0px;" class="inner">Download</div></a>
	</div>
                
	</div>


    <div id="upgrade_local" style="display:none;position: absolute;right:20px;bottom: 20px;width:460px;height:20px;">
        <div style="float:left;margin:10px;font-size:12px;">Backup database first!</div>
        
        <div style="float:right;margin:10px;"><a onclick="UPDATE.golocal()" href="#" class="abutton"><div style="margin:0px;" class="inner">Migrate Database</div></a>
	</div>
                
	</div>

    <div id="upgrade_reload" style="display:none;position: absolute;right:20px;bottom: 20px;width:460px;height:20px;">
        <div style="float:left;margin:10px;color:green;">Upgrade finished!</div>
        
        <div style="float:right;margin:10px;"><a onclick="UPDATE.reload()" href="#" class="abutton"><div style="margin:0px;" class="inner">Reload Noclayer</div></a>
	</div>
                
	</div>
	</div>
    
</div>
</div>