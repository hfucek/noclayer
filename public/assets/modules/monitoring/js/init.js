


var MONITOR={

		
	showNotiff:function(status){
		
		
		
		$('#win_monitor_layer0 li').hide()
		
		$('#win_monitor_layer0 div.win_monitor_card').hide()
		
		$.each($('#win_monitor_layer0 li'),function(i,li){
			
			if($(li).attr('status')==status){
			$(li).show()
			$(li).parent().parent().show()
			}
			
			
		});
		
		
		
		
		
		
	},
		
	forcemenu:function(num){
		
		$('#win_monitor div.win_layer').removeClass('win_visible')
		
		$('#win_monitor div.win_menu li').removeClass('aktive')
		
		$.each($('#win_monitor div.win_menu li'),function(i,e){
			if(Number($(e).attr('layout'))==num){
				$(e).addClass('aktive')	
				
			}
			
		});
		
		
		this.menu(num)
		

			
		
	},
	
	menu:function(num){
		
		$('#win_monitor div.win_layer').removeClass('win_visible')
		
		this.menuNUM=Number(num)
		//console.info(this.menuNUM)
		m=num
		
		if(num>0 && num<=4){
		m=0	
		}
		
		switch(this.menuNUM){
		
		case 1:
			$('#win_monitor_layer0 li').show()
			$('#win_monitor_layer0 div.win_monitor_card').show()
		break;
		case 2:
			this.showNotiff('WARNING')
			
			break;
		case 3:
			this.showNotiff('UNKNOWN')
			break;
		case 4:
			this.showNotiff('CRITICAL')
			break;
		
	
	}
		
		
		$('#win_monitor_layer'+m).addClass('win_visible')	
		
	},	
		
	clearHover:function(){
		$('#monitor_hover').parent().find('div.device_status').removeClass('status_hover')
		$('#monitor_hover').remove()
		
		
	},	
	
	makeCheckBox:function(name,active,num){
		
		cl=(active==1)?' active':'';
		
		return '<div act="'+active+'" m="'+num+'" class="check_box">'+
		'<div class="icons'+cl+'"></div><div class="name">'+name+'</div></div>'
		
	},
	
	editSourceWin:function(data){
		
		//this.conn_div=d
		
		this.win=new nocwin('Edit/remove monitor source','','monitor');	

		this.win.zindex()
		

	d=this.win.data
	
	$(d).html('<fieldset style="margin-top:10px;"><legend></legend></fieldset>'+
			  '<fieldset><legend>Monitor type:</legend><select id="mon_type"><option value="1">Nagios</option></select></fieldset>'+		
			  '<fieldset><legend>URL <span>( /cgi-bin/status.cgi )</span>:</legend><input value="'+data.content+'" id="mon_url" class="size_large2"></fieldset>'+
			  '<div class="float_field"><fieldset><legend>User:</legend><input  value="'+data.user+'" class="size_medium2" id="mon_usr"></fieldset>'+
			  '<fieldset><legend>Password:</legend><input class="size_medium2"  value="'+data.pass+'" type="password" id="mon_pwd"></fieldset></div>'+
			  '<fieldset style="clear:both;margin-top:5px;"><legend>Status:</legend><div class="ms_status"><span></span></div></fieldset>'+
			  '<fieldset style="position:absolute;bottom:10px;right:10px;"><legend></legend>'+
				//'<div style="float:left;margin-right:20px;"><a class="abutton el_disc" href="#"><div class="inner">disconnect</div></a></div>'+	
			  '<div style="float:left;margin-right:20px;"><a class="abutton el_rem" href="#"><div class="inner">remove</div></a></div>'+
			  '<div style="float:left;margin-right:20px;"><a class="abutton el_cancel" href="#"><div class="inner">cancel</div></a></div>'+
				'<div style="float:left;margin-right:20px;"><a class="abutton el_test" href="#"><div class="inner">test</div></a></div>'+
				'<div style="float:left;margin-right:10px;"><a class="abutton el_set" href="#"><div class="inner">save</div></a></div></fieldset>'
	)	

	//close win
	$(this.win.div).find('div.win_close').click(function(){
		MONITOR.win.remove()
		//WIN.show('#win_ip') //set zindex back to 400
	});
	//save 
	$(this.win.div).find('a.el_set').click(function(){
		//IP.vlanset(this)
		
		$.postJSON('monitoring/source/edit',{
			"type": $('#mon_type').val(),
			"url": $('#mon_url').val(),	
			"usr": $('#mon_usr').val(),
			"pwd": $('#mon_pwd').val()
		} ,function(json) {
			
			if(json.code=='ok'){
				
				MONITOR.win.remove()
				
			}else{
				MONITOR.getErrCode(json.code)
				
			}
			
			//console.log(json)
		});
		
	});

	//test data
	$(this.win.div).find('a.el_test').click(function(){
	
		$.postJSON('monitoring/test',{
			"type": $('#mon_type').val(),
			"url": $('#mon_url').val(),	
			"usr": $('#mon_usr').val(),
			"pwd": $('#mon_pwd').val()
		} ,function(json) {
			
			
			MONITOR.getErrCode(json.code)
			
			
			
			//console.log(json,err)
			
			
		});
		
	});
	
	//cancel
	$(this.win.div).find('a.el_cancel').click(function(){
		MONITOR.win.remove()
		//WIN.show('#win_ip') //set zindex back to 400
	});	

	
	//remove
	$(this.win.div).find('a.el_rem').click(function(){
		
		$.postJSON('monitoring/source/rem',{
			"type": $('#mon_type').val(),
			"url": $('#mon_url').val()
		} ,function(json) {
			
			
			
			$(MONITOR.editSourceDiv).remove()
			MONITOR.editSourceDiv=false
			
			
			MONITOR.win.remove()
			
			//MONITOR.getErrCode(json.code)
			
			
			
			//console.log(json,err)
			
			
		});
		
		
		
		//WIN.show('#win_ip') //set zindex back to 400
	});	
		
		
	},
	getErrCode:function(code){
		
		err='Unknown';
		col='#EC816A';
		switch(code){
		case 404:
			err='Wrong URL parameter'
			
			break;
		
		case 401:
			err='Authorization Required'
			
			break;
		
		case 515:
			err='No valid source for input url'
			
			break;	
		case 200:
			err='Connection valid!'
			col='#7ECD65'
			break;
		case 0:
		default:
			err='Enter valid nagios url!'
			col='#B7CDE9'
				
			break;
		
		}
		$(MONITOR.win.div).find('div.ms_status').html('<span style="color:'+col+'">'+err+'</span>')
		
		return {
			'err':err,
			'col':col
		}
	},
	
	addSourceWin:function(){
		
		//this.conn_div=d
		
		this.win=new nocwin('Add monitor source','','monitor');	

		this.win.zindex()
		

	d=this.win.data
	
	$(d).html('<fieldset style="margin-top:10px;"><legend></legend></fieldset>'+
			  '<fieldset><legend>Monitor type:</legend><select id="mon_type"><option value="1">Nagios</option></select></fieldset>'+		
			  '<fieldset><legend>URL <span>( /cgi-bin/status.cgi )</span>:</legend><input id="mon_url" class="size_large2"></fieldset>'+
			  '<div class="float_field"><fieldset><legend>User:</legend><input class="size_medium2" id="mon_usr"></fieldset>'+
			  '<fieldset><legend>Password:</legend><input class="size_medium2" type="password" id="mon_pwd"></fieldset></div>'+
			  '<fieldset style="clear:both;margin-top:5px;"><legend>Status:</legend><div class="ms_status"><span></span></div></fieldset>'+
			  '<fieldset style="position:absolute;bottom:10px;right:10px;"><legend></legend>'+
				//'<div style="float:left;margin-right:20px;"><a class="abutton el_disc" href="#"><div class="inner">disconnect</div></a></div>'+	
				'<div style="float:left;margin-right:20px;"><a class="abutton el_cancel" href="#"><div class="inner">cancel</div></a></div>'+
				'<div style="float:left;margin-right:20px;"><a class="abutton el_test" href="#"><div class="inner">test</div></a></div>'+
				'<div style="float:left;margin-right:10px;"><a class="abutton el_set" href="#"><div class="inner">save</div></a></div></fieldset>'
	)	

	//close win
	$(this.win.div).find('div.win_close').click(function(){
		MONITOR.win.remove()
		//WIN.show('#win_ip') //set zindex back to 400
	});
	//save 
	$(this.win.div).find('a.el_set').click(function(){
		//IP.vlanset(this)
		
		$.postJSON('monitoring/add',{
			"type": $('#mon_type').val(),
			"url": $('#mon_url').val(),	
			"usr": $('#mon_usr').val(),
			"pwd": $('#mon_pwd').val()
		} ,function(json) {
			
			if(json.code=='ok'){
				
				$('<div/>').addClass('data_row').attr('eid',json.data.id).html(
						'<div class="s_type"><span>'+json.data.name+'</span></div>'+
						'<div class="s_url">'+json.data.content+'</div>'+
						'<div class="s_stat" data="'+json.data.content+'">Pending..</div>').appendTo($('#monitor_source'))	
				
			MONITOR.win.remove()
			}else{
				
				MONITOR.getErrCode(json.code)
			}
			
			//console.log(json)
		});
		
	});

	//test data
	$(this.win.div).find('a.el_test').click(function(){
	
		$.postJSON('monitoring/test',{
			"type": $('#mon_type').val(),
			"url": $('#mon_url').val(),	
			"usr": $('#mon_usr').val(),
			"pwd": $('#mon_pwd').val()
		} ,function(json) {
			
				MONITOR.getErrCode(json.code)
			
		});
		
	});
	
	//cancel
	$(this.win.div).find('a.el_cancel').click(function(){
		MONITOR.win.remove()
		//WIN.show('#win_ip') //set zindex back to 400
	});	

		
		
	},
	
	editSource:function(d){
		MONITOR.editSourceDiv=d
		id=$(d).attr('eid')
		$.postJSON('monitoring/source',{'id':id,'action':'get'} ,function(json) {
			
			console.log(json)
			
			MONITOR.editSourceWin(json.source)
		});
		
		
	},
	window:function(data){
		
		
		mon=data.data

		field1=$('<fieldset/>').html(
		'<div style="margin-top:10px;" id="monitor_source">'+
		'<div class="source_row title">'+
		'<div class="s_type th">Engine</div>'+
		'<div class="s_url th">URL</div>'+
		'<div class="s_stat th">Connection</div>'+
		'</div></div>')		
		
$('#win_monitor_settings_layer1').html(field1)		
		
		$.each(data.sources,function(i,e){
		
			source=$('<div/>').addClass('data_row').attr('eid',e.id).html(
		'<div class="s_type"><span>'+e.type.name+'</span></div>'+
		'<div class="s_url">'+e.content+'</div>'+
		'<div data="'+e.content+'" class="s_stat">Pending..</div>').appendTo($('#monitor_source'))	
		
		$(source).click(function(){
		
			MONITOR.editSource(this)	
			
			
			
		});
		
		
		});
		
$('<div/>').css({'float': 'left', 'clear': 'both', 'margin-bottom': '15px', 'margin-left': '10px', 'margin-top': '10px'}).html(
'<a class="abutton addSource" href="#"><div class="inner" tmp="0">add source</div></a>'		
).appendTo(field1)
	

$('#win_monitor_settings_layer1 a.addSource').click(function(){
	MONITOR.addSourceWin()
	
});

layer2=$('#win_monitor_settings_layer2').html('')

$('<fieldset>').html(
		'<legend>Show icon in header</legend>'+
		'<div class="element button_element"><div class="print_checkboxs">'+
		this.makeCheckBox('Warning',mon.iconw,1) +
		this.makeCheckBox('Unknown',mon.iconu,2) +
		this.makeCheckBox('Critical',mon.iconc,3) +
		'</div></div>').appendTo(layer2);

$('<fieldset>').html(
		'<legend>On screen notification</legend>'+
		'<div class="element button_element"><div class="print_checkboxs">'+
		this.makeCheckBox('Warning',mon.osdw,4) +
		this.makeCheckBox('Unknown',mon.osdu,5) +
		this.makeCheckBox('Critical',mon.osdc,6) +
		'</div></div>').appendTo(layer2);



layer3=$('#win_monitor_settings_layer3').html('')

$('<fieldset>').html(
		'<legend>Play Sound</legend>'+
		'<div class="element button_element"><div class="print_checkboxs">'+
		this.makeCheckBox('Warning',mon.soundw,7) +
		this.makeCheckBox('Unknown',mon.soundu,8) +
		this.makeCheckBox('Critical',mon.soundc,9) +
		'</div></div>').appendTo(layer3);


/*
 * action set on window elements
 * */

$('#win_monitor_settings div.check_box').click(function(){
		
		active=ELEMENT._checkbox(this)
		num=Number($(this).attr('m'))
		MONITOR.updateSettings(active,num)
		
		
		
});

		

if(NAGIOS.hosts.length>0)
NAGIOS.updateSourceCore(NAGIOS.sourceDATA);
	//console.log(data)
	
		
	},
	updateSettings:function(a,n){
		
		
		data=Array('','iconw','iconu','iconc','osdw','osdu','osdc','soundw','soundu','soundc')
		
		NOC.settings[this.getSettings()].value[data[n]]=a
		$.postJSON('monitoring/set',{"action":data[n],'value':a} ,function(json) {
			
			
		});
		
	},
	
	
	getSettings:function(){

		for(key in NOC.settings){
			
			if(NOC.settings[key].name=='monitoring'){
			return 	key;
			}
			
			
		}
		
	},
	loadSettings:function(){
		this.loading(true)	
		$.postJSON('monitoring/get',{"room":1} ,function(json) {
			
			MONITOR.window(json)
			NOC.settings['monitoring']=json.data
			
		
			MONITOR.loading(false)	
		});
		
		
	},
	loading:function(key){
		/*
		if(key){
		$('#win_monitor_settings div.win_icon').addClass('deviceLoader').removeClass('default');
		
		}
		else{
			
		$('#win_monitor_settings div.win_icon').removeClass('deviceLoader').addClass('default');
		
		}
		*/
	},
	blink:function(){
		if(this.hide){
			this.hide=false
			$('#header div.blink').animate({
			    opacity: 0.8
			    
			  }, 300, function() {
			    // Animation complete.
			  });
			
		}else{
			this.hide=true
			
			
			$('#header div.blink').animate({
				    opacity: 1
				    
				  }, 300, function() {
				    // Animation complete.
				  });
			
			
		}
		
		setTimeout('MONITOR.blink()',500)
		
	},
        
        head_data:function(){
            
            $('#headmenu_monitor').html(
'<a href="#" class="menu_a"><div class="icon_menu"><div class="icons monitor_icon">17</div>&nbsp;</div></a>'+
'<ul class="sub_menu monitor_sub" style="display: none;">'+
'<li><div class="name">host</div><div class="h num numst0">0</div></li>'+
'<li><div class="name">up</div><div class="hUP num numst1">0</div></li>'+
'<li><div class="name">down</div><div class="hDOWN num numst2">3</div></li>'+
'<li><div class="name">unreachable</div><div class="hUNREACHABLE num numst6">4</div></li>'+
'<li><div class="name">Pending</div><div class="hPENDING num numst3">2</div></li>'+
'<li><div class="name">services</div><div class="s num numst0">425</div></li>'+
'<li><div class="name">ok</div><div class="sOK num numst1">403</div></li>'+
'<li><div class="name">warning</div><div class="sWARNING num numst5">3</div></li>'+
'<li><div class="name">critical</div><div class="sCRITICAL num numst2">18</div></li>'+
'<li><div class="name">unknown</div><div class="sUNKNOWN num numst4">1</div></li>'+
'<li><div class="name">Pending</div><div class="sPENDING num numst3">0</div></li></ul>'    
);
            
            $('#monitor_head').html(
'<li class="menu_div">'+
'<a class="menu_a notiff" n="2" href="#"><div class="icon_menu" style="display:none;">'+
'<div style="opacity: 0.8;" class="icons notWARNING hint blink" act="no" hint="WARNING status!"></div>'+
'</div></a></li>'+
'<li class="menu_div">'+
'<a class="menu_a notiff" n="4" href="#"><div class="icon_menu" style="display:none;">'+
'<div style="opacity: 0.8;" class="icons notCRITICAL hint blink" act="no" hint="CRITICAL status!"></div>'+
'</div></a></li>'+
'<li class="menu_div">'+
'<a class="menu_a notiff" n="3" href="#"><div style="display:none;" class="icon_menu">'+
'<div style="opacity: 0.8;" class="icons notUNKNOWN hint blink" act="no" hint="UNKNOWN status!"></div>'+
'</div></a></li>')
            NOC.setNavAction()
        },
	init:function(){
		console.log('monitor init')
	
		//GRAPHING.init()
		
		this.head_data()
		this.menuNUM=0;
		
		this.checkboxs=[]
		
		if(!this.set){
		
			//load settings from server 
			$.postJSON('monitoring/get',{"room":1} ,function(json) {
				
				NOC.settings.push({
					'name':'monitoring',
					'value':json.data
				});
				
				
			
			});

			
			this.blink();
			//$('#header div.blink').click('')
				
			this.set=true;

			
			$('div.monitor_icon').click(function(){
				
				WIN.show('#win_monitor')	
					
				});	
			
			
			
			
			$('a.notiff').click(function(){
				
				WIN.show('#win_monitor')	
				
				//
				$(this).find('div.icon_menu').hide()
				
				n=Number($(this).attr('n'))
				
				
				MONITOR.forcemenu(n)
				
				
				});	
			
			
			
			
			
			
		MSG.init()
		today=new Date();
		
		MSG.log(2,{'text':'Monitoring started','time':today.format("dd-m-yyyy  HH:MM:ss")})
		MSG.id++;
		NAGIOS.init()
		
		$(document).mousemove(function(){
			
			MONITOR.move()
			
		});
		
		//select monitoring system
		
		
		
		}else{
			
		//check if devices in room having monitoring activated
		NAGIOS.checkRoom()
			
			
			
		}
		
		$('div.device_status').attr('set','ok')
		
		$('div.device_status').hover(
				function(){
					
					
				//console.log('ok');	
				MONITOR.clearHover()
				$(this).addClass('status_hover');
				//$('#monitor_hover').remove()
				if(MONITOR.hover) clearTimeout(MONITOR.hover);
				m=$('<div/>').attr('id','monitor_hover').appendTo($(this).parent());
				
				$(m).hover(
					function(){
						if(MONITOR.hover) clearTimeout(MONITOR.hover);
						
					},
					function(){
						
						MONITOR.hover=setTimeout("MONITOR.clearHover()",100);
					}
				
				);
				NAGIOS.makeList(m)
				
				
				//$('#monitor_hover').css({'top':0,'left':220});
				
				},		
				function(){
						
				MONITOR.hover=setTimeout("MONITOR.clearHover()",100);	
				
				}
				
				);
		
			
	},
	move:function(){
		
		
		if(NAGIOS.tooltip){
			
			bodyTop=0
			if(typeof PLUGIN!='undefined') bodyTop=$('#noclayer-plugin').offset().top;	 
			
			x=mouseX+10;
			y=mouseY+10-bodyTop
			h=$('#monitortip').height()
			w=$('#monitortip').width()
			hh=h+y
			ww=w+x
			if(hh>winh){
			y-=h+20	
				
			}
			if(ww>winw){
			x-=w+20	
			}
				
			
			$('#monitortip').css({'left':x,'top':y})

			
		}
		
		
		
	}
	
	
		
		
}

