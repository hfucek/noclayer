
var NAGIOS={
	
		
	init:function(){
	//if server has problems with responce
        this.error=false;
        this.update_period=10
        this.hosts=[]
	this.hostsIndx=[]
	this.services=[]
	this.tooltip=false	
	this.winHeadCount=$('#win_monitor div.win_header_name span')[0]
	this.headMonitor=$('#header div.monitor_icon')
	this.initData=false;
	
        
        if(!this.initData){
            //this.sound=this.loadSound("/assets/audio/critical.wav");  //  preload
            this.loadData()
            this.loop()
            this.soundInit()
        }

	},
	
	updateCount:function(){
		
		
		
	},
	soundInit:function(){
	this.sound=['WARNING','CRITICAL','UNKNOWN']	
	this.sound['WARNING']=this.loadSound("/assets/audio/warning2.wav");  //  preload
	this.sound['CRITICAL']=this.loadSound("/assets/audio/critical2.wav");  //  preload
	this.sound['UNKNOWN']=this.loadSound("/assets/audio/unknown.wav");  //  preload
	},
	
	loading:function(key){
		if(key){
		$('#win_monitor div.win_icon').addClass('deviceLoader').removeClass('default');
		$(this.headMonitor).addClass('inprogress')
		}
		else{
		$(this.headMonitor).removeClass('inprogress')	
		$('#win_monitor div.win_icon').removeClass('deviceLoader').addClass('default');}
	},
	time:function(){
		
		//console.log(this.timecount)
		
		//$(this.winHeadCount).html('( '+this.timecount+' )')
		$('#header div.monitor_icon').html(this.timecount)
		
		
		this.timecount--
		
		this.timeInterval=setTimeout(function(){NAGIOS.time()},1000)
                
                if(this.timecount<0)
                NAGIOS.loadData()
                
	},
	
	forceStart:function(){
           
            
           
            NAGIOS.loadData();
               	
	/*	
            
		if(this.timeInterval) clearInterval(this.timeInterval)
		if(this.updateInterval) clearInterval(this.updaInterval)
		
		this.updateInterval=setTimeout(function(){NAGIOS.loadData()},this.timecount*1000)
		
            */
	},
	
	loop:function(){
	
	//if(NAGIOS.timeInterval) clearInterval(this.timeInterval)	
        	
	
        
	},
	getHost:function(hostname){
		m=false;

		$.each($('div.rack_unit'),function(i,e){
			if($($(e).find('div.name')[0]).text().localeCompare(hostname)==0){
				m=e
				return m;
				
			}
			
			
		})	
			
		
			return m;
		},
		makeList:function(div){
			hostname=$($(div).parent().find('div.name')[0]).text()
			
			ind=this.hostsIndx.indexOf(hostname)
			ahost = this.hosts[ind]
			$.each(ahost.service,function(i,e){
				m=$('<div/>').addClass('monitor_service').attr({'host':ind,'service':i}).html('<div class="n"><span>'+e.name+'</span></div><div class="s stat'+e.status+'"><span>'+e.status+'</span></div>').appendTo($('#monitor_hover'));
				
				
				$(m).hover(
						function(){
							hostID=Number($(this).attr('host'))
							serviceID=Number($(this).attr('service'))
							
							service=NAGIOS.hosts[hostID].service[serviceID]
							
							NAGIOS.tooltip=true
							 $('#monitortip').show();
							 $('#monitortip').html('<div><span class="name">Last Check:</span><br>'+service.time+'</div>'+
									 '<div><span class="name">Duration:</span><br>'+service.up+'</div>'+
									 '<div><span class="name">Attempt:</span><br>'+service.attempt+'</div>'+
									 '<div><span class="name">Status Information:</span><br><span class="info">'+service.text+'</span></div>'
							 );
							
							//if(MONITOR.hover) clearTimeout(MONITOR.hover);
							
						},
						function(){
							NAGIOS.tooltip=false
							 $('#monitortip').hide();
							//MONITOR.hover=setTimeout("MONITOR.clearHover()",100);
						}
					
					);
				
			});
			
			h=$('#monitor_hover').height()
			
			t=$(div).offset().top+$('#content').scrollTop()-35
			l=$(div).offset().left+$('#content').position().left
			
			h2=winh-h;
			hh=t+h
			kk=winh+$('#content').scrollTop()-35
			
			
			if(hh>950){
				console.log('hh>950')
				mh=950-hh-35
				$('#monitor_hover').css('top',mh)
				
			}
			if(hh>kk){
				console.log('hh>kk')
				if(kk>950) kk=950
					
				mh=kk-hh
				
				
				$('#monitor_hover').css('top',mh)
			}
			hh2=winh-35;
			if(h>hh2){
				mm=h-hh2;
				$('#monitor_hover').css('top',mh+mm)
				$('#monitor_hover').css('height',hh2)
				
			}
			
			
			
			
			
			
			
			
		},
		addLED:function(div,type){
			
			
			
		},
		updateLED:function(host,status){
			
			//console.log(host)
			div=$(host.div).find('div.device_status')[0]
			//console.log(div)
			
			
			$(div).hide();
			$(div).html('')
			sh=false;
		
			if(status['OK']>0){
			
				sh=true;	
				$(div).append($('<div/>').addClass('stat').addClass('statOK'))
			}
			
			if(status['WARNING']>0){
				sh=true;	
				$(div).append($('<div/>').addClass('stat').addClass('statWARNING'))
			}	
			if(status['UNKNOWN']>0){
				sh=true;
				$(div).append($('<div/>').addClass('stat').addClass('statUNKNOWN'))
			}	
			if(status['CRITICAL']>0){
				sh=true;
				$(div).append($('<div/>').addClass('stat').addClass('statCRITICAL'))
				
			}	
			
			ind=this.hostsIndx.indexOf(host.host)
			
		
			
			$(div).show();
			
			
			
		},
		
		loadSound:function(src) {
		    var sound = document.createElement("audio");
		    if ("src" in sound) {
		        sound.autoPlay = false;
		    }
		    else {
		        sound = document.createElement("bgsound");
		        sound.volume = -10000;
		        sound.play = function () {
		            this.src = src;
		            this.volume = 0;
		        }
		    }
		    sound.src = src;
		    document.body.appendChild(sound);
		    return sound;
		 },
		

		 searchDevice:function(data){
		
			 err=true;
			 
			 $.each(data,function(a,item){
					set=false
					if(item.items.length>0){
					$.each(item.items,function(i,d){
						
					console.log(d)	
					SEARCH.data={'t':1,'id':d.id,'room':d.room,'rack':d.rack,'building':d.building,'floor':d.floor,'tab':0,'dev':0}		
						
					err=false
					
					SEARCH.seeking=true;
					SEARCH.seekstat();
					
					
					});
					}});
			 
			 if(err){
				 alert('Device not found in Noclayer system, please add new device first.')	 
				 
			 }
			 
			 
	
			 
				
				
			 
		 },
		
		 
		updateStats:function(data){
			
			
			for( var item in data )
				{
				
				cl=item.replace('hostTotals','h').replace('serviceTotals','s')
				$('#header').find('div.'+cl).html(data[item])
		        }
			
			
			
			
		},
	
		makeNotification:function(id,name,exist){
			exist=true;
			
			if($('#nothost_'+id).length==0){
			
			wmc=$('<div/>').attr('id','nothost_'+id).addClass('win_monitor_card')
			hh=$('<div/>').addClass('host').attr('host',id).appendTo(wmc)
			if(exist && name){
			
				aa=$('<a/>').attr('href','#').html(name).appendTo($(hh))
			
			
			$(aa).hover(
					function(){
						ind=Number($(this).parent().attr('host'));
						ahost = NAGIOS.hosts[ind]
						$(ahost.div).addClass('locate')
						
						//console.log('play')
					},
					function(){
						ind=Number($(this).parent().attr('host'));
						ahost = NAGIOS.hosts[ind]
						$(ahost.div).removeClass('locate')
						
						
					}
					
			).click(function(){
				
				ind=Number($(this).parent().attr('host'));
				ahost = NAGIOS.hosts[ind]
				$.getJSON('search',{'key':ahost.host}, function(json) {
					//$('#searchdata').hide()
					//$(SEARCH.table).html('')
					NAGIOS.searchDevice(json)
				});
				
				
			})
			}else{
				aa=$('<span/>').html(name).appendTo($(hh))
				
			}
			
			this.list=$('<ul/>').appendTo(wmc)
			
			}else{
			wmc=$('#nothost_'+id)
			this.list=$(wmc).find('ul')[0]
				
			}
			active=this.initData
			
			
			return {'wmc':wmc,'active':active};
			
		},
		parseData:function(){
			
			this.info.counter++;
			//console.log(this.info.total,this.info.counter)
			if(this.info.total>this.info.counter){
			setTimeout("NAGIOS.parseHost()",2);	
			}else{
				this.initData=true;
				this.loading(false)	
			}
			
			
		},
		parseHost:function(){
			host=NAGIOS.tempData[this.info.counter]
			if(host!=undefined){
			//console.log('host')	
			ind=this.hostsIndx.indexOf(host.hostname)
			
			

			//ahost = $.grep(this.hosts, function (a) { return a.host == host.hostname; });
			insert=false;
			ahost = this.hosts[ind]
			//seek host
			if(ind<0){
			//console.log('ok')
			
				unit=this.getHost(host.hostname);
				
			this.hosts.push({'host':host.hostname})	
			this.hostsIndx.push(host.hostname)
			ind=this.hostsIndx.length-1
			
			
			//ahost = $.grep(this.hosts, function (a) { return a.host == host.hostname; });
			ahost = this.hosts[ind]
			ahost.div=unit
			ahost.service=[]
			ahost.serviceIndx=[]
			insert=true;
			
			}
			
			
			
		
			old_service=ahost.service
			
			var status=new Object({
				'OK':0,
				'WARNING':0,
				'CRITICAL':0,
				'UNKNOWN':0
			});
			
			
			
				
			wmcObj=this.makeNotification(ind,ahost.host,unit);
			
			//prepare list for update
			$(this.list).find('li').addClass('nop')
			
			sh=false;
			
			
			$.each(host,function(i,e){
				//["", "03_PING", "OK", "11-17-2012 16:00:39", "0d  1h 36m 21s", "1/4", "PING OK - Packet loss = 0%, RTA = 24.11 ms"]
				
				if( Object.prototype.toString.call( e ) === '[object Array]' ) {
				 
				service=e[1];
				///console.info(service)
				
				ind=ahost.serviceIndx.indexOf(service)
				
				//insert service
				if(ind<0){
					
					ahost.service.push({'name':service,"status":e[2],"time":e[3],"up":e[4],"attempt":e[5],"text":e[6]})	
					ahost.serviceIndx.push(service)
				}else{
					
				ahost.service[ind]={'name':service,"status":e[2],"time":e[3],"up":e[4],"attempt":e[5],"text":e[6]}
					
				}
				
				
				
				status[e[2]]++;
				
				//dont log green status
				if(e[2]!='OK'){
				
					serv=$('li[service="'+service+'"][host="'+ahost.host+'"]');
					not_card=$(serv).parent().parent()
					
					
					if(serv.length>0){
					//console.log('ok')	
					
					oldstat=$(serv).attr('status');
					if(oldstat!=e[2]){
					//make notification message	
						
					MSG.add(ahost.host,e[2],service)	
					}
					/*
					if(e[2]=='OK'){
						
						$(serv).remove()
						length=$(not_card).find('li').length
						if(length==0){
						//	$(not_card).remove()
						}
						
					
					}else{
					*/	
						
						$(serv).attr({'status':e[2]})
						$($(serv).find('div.time span')[0]).html(e[3])
						$($(serv).find('div.status span')[0]).html(e[2])
						$(serv).find('div.status').attr('class','status stat'+e[2])
						
						$(serv).removeClass('nop')
								
					
				//	console.log('update',e[3])
					
					
					}else{
					//console.log('add')
					
					if(wmcObj.active){
						MSG.add(ahost.host,e[2],service)	
						
					}	
						
				$('<li/>').attr({'service':service,'host':ahost.host,'status':e[2]}).html(
						'<div class="service"><span>'+service+'</span></div>'+
						'<div class="status stat'+e[2]+'"><span>'+e[2]+'</span></div>'+
						'<div class="time"><span>'+e[3]+'</span></div>'
						).appendTo(NAGIOS.list)
						sh=true;		
					}	
				//num++;
				
				}else{
					
					serv=$('li[service="'+service+'"][host="'+ahost.host+'"]');
					
					
					
					if(serv.length>0){
						MSG.add(ahost.host,e[2],service)
						
					}
					
				}
				
				
				
				
				}
				
			});	
		
			
			
			
			if(sh){
			//console.log('adds')
				
				
				mh=$('#win_monitor_layer0').append(wmcObj.wmc)
				MONITOR.menu(MONITOR.menuNUM)
				
			}
			$(this.list).find('li.nop').remove()
			
			
			l=$(this.list).find('li').length
			
			if(l==0) $(this.list).parent().remove()
			ahost.status=status;
			
		//	dbhost=this.hosts({"hostname":host.hostname}).first();
			this.updateLED(ahost,status)
			
			
		}
			this.parseData()			
		},
		
		checkRoom:function(){
			//let see if monitoring data in room was deployed
			
			for(host in this.hosts){
				
				unit=this.getHost(this.hosts[host].host);
				
				if(!unit){
					this.hosts[host].div=false;
					
				}else{
					this.hosts[host].div=unit;
				}
				
				
				
				
			}
			this.forceStart();
			
			
			
		},
		updateSourceCore:function(data){
			

			sources=$('#monitor_source div.s_stat')
			
			if($(sources).length>0){
				
				$.each(data,function(i,e){
					
					$.each(sources,function(ii,ee){
						//console.log($(ee).attr('data'))
						
						if($(ee).attr('data')==e[0]){
						//console.log(e[0],e[1])	
						switch(e[1]){
						case 0:
						case 404:
							st='<span class="stat_ER">Error</span>'
							break;
						case 200:
							st='<span class="stat_OK">Ok</span>'
							break;
						case 515:
							st='<span class="stat_ER">Check Url</span>'
							break;
						case 401:
							st='<span class="stat_ER">AUTH problem</span>'
							break;
						default:
						  st='<span class="stat_ER">Check Url</span>'
							break;
						
							
							
						}
						$(ee).html(st)
						
						
						}
						
						
						
					});
					
					
				});	
			}
			
			
		},
		
		updateSource:function(data){
			//console.log(data)
			
			
			this.sourceDATA=data
			
			$.each(data,function(i,e){
				
					if(e[1]!=200){
					MSG.crit(e)	
						
					}	
					
				});
			this.updateSourceCore(data)
			
		},
		loadData:function(){
                NAGIOS.timecount=this.update_period;	
                if(NAGIOS.timeInterval) clearInterval(NAGIOS.timeInterval)
            
			this.loading(true)
			console.log('nagios load')
			$.postJSON('monitoring/data',{"room":1} ,function(json) {
				
			//console.log(json.hosts)	
				
				if(json.status==0){
				console.log('Monitor source not set!')
				
				
				
				}else{
				if(json.total){	
				NAGIOS.updateSource(json.total.nagiosCode)	
				
				NAGIOS.tempData=json.services
				
				NAGIOS.updateStats(json.total)
				m=1
				for (var k in NAGIOS.tempData) {
					m++;
				}
				NAGIOS.info={
						'total':m,
						'counter':-1
						}
				
				NAGIOS.parseData()
				}
				}
				NAGIOS.time()
			});
			
			
			
		},
		printHosts:function(){
			m=[]
			$.each(this.hosts,function(i,e){
				m.push('"'+e.host+'"')
				
			})
			
			console.log(m.join(','))
			
		},
		
		hoverSet:function(id){
			
			set=$('#rack_unit'+id).find('div.device_status').attr('set')
			
			if(set!='ok'){
				$('#rack_unit'+id).find('div.device_status').attr('set','ok')	
			$('#rack_unit'+id).find('div.device_status').hover(
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
					
					);}
			
		},
		updateDevice:function(id,name,oldname){
			if(name!=''){
			dev=$('#rack_unit'+id)
			console.log(id,dev)
			did='rack_unit'+id;
			$('#rack_unit'+id).find('div.device_status').html('')
			$('#rack_unit'+id).find('div.device_status').hide()
			
			this.hoverSet(id)
			
			ind=this.hostsIndx.indexOf(oldname)
			if(ind>=0){
			ahost = this.hosts[ind]
			this.hostsIndx[ind]=name
			ahost.name=name
			}else{
				ind=this.hostsIndx.indexOf(name)
				ahost = this.hosts[ind]
				if(ahost)
				ahost.div=dev
			}}
		}
		
		
}	