var MSG={
	init:function(){
		
	this.container=$('#messages')	
	this.id=0;	
	
	},
	
	close:function(id){
	
	//console.log('closing',id)	
		m=$('#msg'+id).animate({
	'margin-top':'-=55'	
		
	},
	200, //delay
	function(){
		//finished
		$(this).remove();
	})	
		
	},
	
	
	crit:function(e){
		
	today=new Date()
		
		this.log(1,{'host':'NAGIOS','service':e[0],'status':e[1],'time':today.format("dd-m-yyyy  HH:MM:ss")})
		
		
		m=$('<div/>').attr('id','msg'+this.id).css({'z-index':200,'margin-left':480+'px','background':'red','width':480+'px'}).addClass('msg').appendTo(this.container)	
		$(m).html(
			'<div class="title">SOURCE : Nagios error! code:'+e[1]+'</div>'+
			'<div class="value">'+e[0]+'</div>'
			
				
		)
		
		$('#msg'+this.id).animate({
	'margin-left':'-=700'	
		
	},
	200, //delay
	function(){
		//finished
		
	}).click(function(){
		
		WIN.show('#win_monitor_settings')
		$(this).remove()
		
	})
		
	setTimeout('MSG.close('+this.id+')',20000)
	
		this.id++;
			
	},
	
	log:function(type,data){
		
		col=(this.id%2!=0)?'even':'odd'; 
		
		switch(type){
		case 1:
			li=$('<li>').addClass('log').addClass(col).html(
					'<div class="l_ho"><span>'+data.host+'</span></div>'+
					'<div class="l_se">'+data.service+'</div>'+
					'<div class="l_st">'+data.status+'</div>'+
					'<div class="l_ti"><span>'+data.time+'</span></div>'		
					);
			
			
			
		break;
		case 2:
			
			li=$('<li>').addClass('log').addClass(col).html(
			'<div class="l_te"><span>'+data.text+'</span></div>'+
			'<div class="l_ti"><span>'+data.time+'</span></div>'
			)
			
			break;
		
		}
		
		$('#monitor_log').prepend(li);
		
		
		
		
		
		
		
	
		
	},
	
	add:function(host,stat,service)
	{
		
		
		setname={'OK':0,'UNKNOWN':'u','WARNING':'w','CRITICAL':'c'}
		
		today = new Date();
		
		
		this.log(1,{'host':host,'service':service,'status':stat,'time':today.format("dd-m-yyyy  HH:MM:ss")})
		
		
		
		if(NAGIOS.sound[stat] && NOC.settings[MONITOR.getSettings()].value['sound'+setname[stat]]==1)
		NAGIOS.sound[stat].play()
		
		
		if(NOC.settings[MONITOR.getSettings()].value['icon'+setname[stat]]==1)
		$('#header div.not'+stat).parent().css('display','block');
	
		if(NOC.settings[MONITOR.getSettings()].value['osd'+setname[stat]]==1){	
		
		type=Math.floor(Math.random() * 4);
		
	m=$('<div/>').attr('id','msg'+this.id).css('margin-left',220+'px').addClass('msg msg'+stat).appendTo(this.container)	
	$(m).html(
		'<div class="title">'+host+'</div>'+
		'<div class="value">'+service+'</div>'
		
			
	)
	
	$('#msg'+this.id).animate({
	'margin-left':'-=220'	
		
	},
	200, //delay
	function(){
		//finished
		
	})	
		
	
	setTimeout('MSG.close('+this.id+')',5000)
	
	this.id++;
		}
	}
		
		
}