var NETWORK={
    action:function(t){
        $(t).find('div.socket').click(function(){
            NETWORK.conn_win(this);
			
        })

        $(t).find('div.socket2').click(function(){
            //NETWORK.device_disconnect(this);
            NETWORK.disc_win(this);
        })

		
    },
	
    action2:function(t){
        $(t).find('div.socket').click(function(){
            NETWORK.conn_win(this);
			
        })

        $(t).find('div.socket2').click(function(){
            NETWORK.disc_win(this);
			
        //NETWORK.device_disconnect2(this);
			
        })

		
    },
	
	
    configSet:function(d){
		
        v=$(d).parent().find('textarea').val()
		
        $.postJSON('basic/network/set',{
            'act':'act5',
            'val':v,
            'eid':NETWORK.eid,
            'tmpl':NETWORK.tmpl
        }, function(json) {
		
		
            });
		
		
    },
    init:function(){
        this.message={
            'noport':'No ports defined. <br><span>Please goto General tab and select ports!</span>'
        }
		
    },
    racks:function(select,pd,none){
		
        items=$('#row div.rack')
		
        if(none){
            $(select).html('<option value="0">Select rack..</option>')
        }
		
		
        $.each(items, function(i,item){
			
            //id 
            id=$(item).attr('id').replace('rack','')
			
            name=$(item).find('div.rack_head').text()
			
            un=$(item).attr('ru')
			
            op=$('<option></option>').addClass('option_small').attr({
                'value':id
            }).html(name+' ('+un+')')
			
            if(pd.replace('rack','')==id){
                op.attr('selected','selected')
            }
            $(select).append(op)
        });	
			
    },
	
    categories:function(){
	
        data=[]
        cats=$('#win_dev_1 option')
        $.each(cats,function(i,e){
            data.push($(e).text());	
		
        });
        return data;
	
    },

    rackdevices:function(select,pd,none,rack){
		
        items=$('#rack'+rack+' div.rack_unit')
		
        if(none){
            $(select).html('<option value="0">Select device..</option>')
        }
		
        cats=this.categories()
		
        data=[]
		
        $.each(items, function(i,item){
			
            //type of device 
            type=Number($(item).attr('e_t'))
			
            cat=Number($(item).attr('e_c'))
			
            pos=Number($(item).attr('e_p'))
            //id 
            id=$(item).attr('id')
			
            c=cats[cat];
			
			
			
            name=$(item).find('div.name').text()	
			
            pid=Number(id.replace('rack_unit',''))
			
            data.push({
                'cat':c,
                'id':pid,
                'pos':pos,
                'name':name
            })
			
			
			
			
			
			
			
			
			
        });
		
		
        data.sort(function(a, b){
            return b.pos-a.pos
        })
		
        $.each(data,function(i,e){
			
            op=$('<option></option>').addClass('option_small').attr({
                'value':e.id,
                'pos':e.pos
            }).html(e.name+' / '+e.cat)		
			
            $(select).append(op)
			
        });
			
		
		
		
    },
	

    loading:function(key){
        if (NETWORK.timerID) clearTimeout(NETWORK.timerID)
		
		
        if(key){
            NETWORK.finish(true)
        }
        else{
			
            NETWORK.timerID=setTimeout("NETWORK.finish(false);",400);
        }
		
    },
	
    finish:function(key){
		
        if(key){
		
            $('#win_ip div.win_icon').removeClass('default').addClass('imageLoader')
            $('#win_ip div.win_mask').show()
        }else
        {
            $('#win_ip div.win_mask').hide()
            $('#win_ip div.win_icon').addClass('default').removeClass('imageLoader')
        }
		
		
    },
	
	
    setVlanOnPort:function(a){
        mid=$(a).attr('pid')
		
        NETWORK.activeEL=d
        if(IP.wcl=='c'){
            v=0	
        }else{
            vid=Number(IP.wcl)-1
		
            v=IP.vlandata[vid].id
        }
		
		
        IP.tmpdd=Array(v,3,mid)
		
	
        NETWORK.loading(true)
        $.postJSON('basic/network/mac',{
            'act':'vlanset',
            'val':v,
            'eid':NETWORK.eid,
            'mid':mid,
            'tmpl':NETWORK.tmpl
        }, function(json) {
			
            NETWORK.loading(false)
			
            if(json.status!='ok'){
				
					
            }else{
				
                //IP.updateVal(v,3,mid)	
                IP.updateVlanText(v,mid)
            //IP.cableData('#mac_ports'+IP.prefix)
            }
			
			
			
        });	
		
		
		
		
	
		
		
		
    },
	
    remVlan:function(d){
        w=$(d).parent().attr('w')
        v=$(d).parent().attr('vid')
	
	
        $('#vlanports div.pin').removeClass('wcolor'+w)
	
        $(d).parent().remove()
        NETWORK.loading(true)
        $.postJSON('basic/network/vlan',{
            'act':'rem',
            'val':v,
            'eid':NETWORK.eid,
            'tmpl':NETWORK.tmpl
        }, function(json) {
		
            NETWORK.loading(false)
            IP.vlandata=json.data
		
            NETWORK.o.vlans=json.data
            IP.vlanNav($('#vlan'));
	
            IP.textMacField()
            IP.cableData('#mac_ports'+IP.prefix)
		
		
        });		
	
	
    },
	
    updateMAC:function(d){
		
        v=$(d).val()
        mid=$(d).parent().parent().attr('mid')
		
		
        NETWORK.activeEL=d
        IP.tmpvv=Array(v,2,mid)
        NETWORK.loading(true)
        $.postJSON('basic/network/mac',{
            'act':'macset',
            'val':v,
            'eid':NETWORK.eid,
            'mid':mid,
            'tmpl':NETWORK.tmpl
        }, function(json) {
			
			
            NETWORK.loading(false)
            if(json.status!='ok'){
				
                $(NETWORK.activeEL).val(json.old)	
            }else{
				
                IP.updateVal(IP.tmpvv[0],IP.tmpvv[1],IP.tmpvv[2])	
				
            }
			
			
			
        });
		
		
		
		
    },
    device_disconnect2:function(d){
		
		
        cab=$(d).attr('cab')
        td=$(d).parent()
		
		
		
        v=0
		
        td.html('<div class="socket"><div class="icons"></div></div><div class="conname">none</div>')
		
        this.action(td)
		
        $.postJSON('basic/network/cable/remove',{
            'act':'disconnect',
            'val':v,
            'eid':NETWORK.eid,
            'cab':cab,
            'tmpl':NETWORK.tmpl
        }, function(json) {
			
            $.each(IP.cables,function(i,e){
                if(e.id==json.id){
					
                    e.dev2=0
                    e.dev1=0
                    e.port1=0
                    e.port2=0
                }
				
            })
            if(IP.tmpl){
                IP.cableData('#ipp_ports1')
				
            }else{
                IP.cableData('#ipp_ports0')
				
            }	
			
			
        });
    },
    device_disconnect:function(d){
		
		
		
        cab=$(this.conn_div).attr('cab')
        td=$(this.conn_div).parent()
		
		console.log("cab",cab,"td",td,"network eid",NETWORK.eid)
		
        v=0
		
        td.html('<div class="socket"><div class="icons"></div></div><div class="conname">none</div>')
		
        this.action(td)
		
        $.postJSON('basic/network/cable/remove',{
            'act':'disconnect',
            'val':v,
            'eid':NETWORK.eid,
            'cab':cab,
            'tmpl':NETWORK.tmpl
        }, function(json) {
			
            $.each(IP.cables,function(i,e){
                if(e.id==json.id){
					
                    e.dev2=0
                    e.dev1=0
                    e.port1=0
                    e.port2=0
                }
				
            })
		
            $(td).find('div.socket2').removeAttr('cab')
			
            if(DEVICE.cat==2 || DEVICE.cat==3 || DEVICE.cat==8){
				
                IP.cableData('#mac_ports'+IP.prefix)	
				
            }else{
				
					
                if(IP.tmpl){
                    IP.cableData('#ipp_ports1')
					
                }else{
                    IP.cableData('#ipp_ports0')
					
                }	
				
            }
            NETWORK.action(td)	
			
	
        });
		
		
        NETWORK.win.remove()
        WIN.show('#win_ip') //set zindex back to 400
		
    //IP.updateVal(0,1,mid)	
		
    //update vlan port field 
    //IP.updateVlanTable();
		
		
    },
	
    device_connect:function(sv){
		
        psel=$(NETWORK.win.data).find('select.portsel option:selected')
        dsel=$(NETWORK.win.data).find('select.devsel option:selected')
		
        name1=$(NETWORK.win.data).find('select.portsel')[0].selectedIndex+1
		
		
	
		
		
		
        port=Number(psel.val())
		
		
        canc=Number(psel.attr('dis'))
		
		
        dev=dsel.val()
		
        if(port>0 && canc==0){
            port2=$(this.conn_div).parent().parent().attr('mid')
            name2=$(this.conn_div).parent().parent().attr('n')
            cab=0;
            if($(this.conn_div).attr('cab'))
                cab=$(this.conn_div).attr('cab')
		
		
		
            td=$(this.conn_div).parent()
		
            n=$('#rack_unit'+dev+' div.name').text()
		
            td.html('<div class="socket2"><div class="icons"></div></div><div class="conname2">'+n+' ['+name1+']</div>')
		
		
		
		
            $.postJSON('basic/network/cable',{
                'cab':cab,
                'act':'connect',
                'type':1,
                'name1':name1,
                'name2':name2,
                'port1':port,
                'dev2':DEVICE.id,
                'dev1':dev,
                'port2':port2,
                'tmpl':NETWORK.tmpl
            }, function(json) {
			
			
		
			
			
                ob=getObjects(IP.cables, "id", cab)
			
                if(ob.length>0){
                    $.each(IP.cables,function(i,e){
                        if(IP.equal(e.id,json.cable[0].id)){
						
                            IP.cables[i]=json.cable[0]
                        }
					
                    })
			
                //IP.cables[oo]=json.cable[0];
				
                }else{
				
                    IP.cables.push(json.cable[0])
				
                }
			
                $(td).find('div.socket2').attr('cab',json.cable[0].id)
			
                if(DEVICE.cat==2 || DEVICE.cat==3 || DEVICE.cat==8){
				
                    IP.cableData('#mac_ports'+IP.prefix)	
				
                }else{
				
					
                    if(IP.tmpl){
                        IP.cableData('#ipp_ports1')
					
                    }else{
                        IP.cableData('#ipp_ports0')
					
                    }	
				
                }
			
                NETWORK.action(td)	
		
            });
		
		
		
		
            NETWORK.win.remove()
            WIN.show('#win_ip') //set zindex back to 400
        //IP.updateVal(v,1,mid)	
        //update vlan port field 
		
        //IP.updateVlanTable();
		
		
        }else{
            if(canc==1){
                alert('selected port is already connected!')
            }
			
        }
		
		


    },	
		

    disc_win:function(d){
		
		
		
        cab=$(d).attr('cab')	
		
		
        ob=getObjects(IP.cables, "id", cab)
        if(DEVICE.id==ob[0].dev1){
            dev=ob[0].dev2;
            port=ob[0].port2
        }else{
            dev=ob[0].dev1;
            port=ob[0].port1
        }
		
		
        if($('#rack_unit'+dev).length>0){
            n=$('#rack_unit'+dev)
			
        }else{
			
            n=$('#vertPDU'+dev)
			
        }
		
		
        rack=getparentAttr(n,'id')	
		
		
		
        this.conn_div=d
        if(Number($(d).parent().parent().attr('type'))==1) {
            type=false;
        } else type=true;
		
        this.win=new nocwin('Select device to connect','','conndevice');	

        this.win.zindex()
		

        d=this.win.data

        $(d).html('<fieldset style="margin-top:10px;"><legend></legend></fieldset>'+
            '<fieldset><legend>RACK:</legend><select class="size_large2 racksel"></select></fieldset>'+
            '<fieldset><legend>Device:</legend><select class="size_large2 devsel"></select></fieldset>'+
            '<fieldset><legend>Port:</legend><select class="size_large portsel"></select></fieldset>'+
            '<fieldset style="position:absolute;bottom:10px;right:10px;"><legend></legend>'+
            '<div style="float:left;margin-right:20px;"><a class="abutton el_disc" href="#"><div class="inner">disconnect</div></a></div>'+	
            '<div style="float:left;margin-right:20px;"><a class="abutton el_cancel" href="#"><div class="inner">cancel</div></a></div>'+
            '<div style="float:left;margin-right:10px;"><a class="abutton el_set" href="#"><div class="inner">set</div></a></div></fieldset>'
            )	
		
			
        NETWORK.racks($(d).find('select.racksel'),rack,true)

        POWER.rackdevices('net',$(d).find('select.devsel'),dev,true,rack.replace('rack',''),type)
	    

        POWER.loadSockets('basic/device/ports',1,$(d), dev,port);

	    
	    
	    
	    
        $(d).find('select.racksel').change(function(e){
		    	
            o=$(this).find('option:selected').val()
		    	
		    	
            if(Number($(NETWORK.conn_div).parent().parent().attr('type'))==1) {
                type=false;
            } else type=true;
            POWER.rackdevices('net',$(this).parent().parent().find('select.devsel'),'',true,o,type)
		    	
            pp=$(this).parent().parent().find('select.portsel')
				
            $(pp).html('')
		    	
        });
			
        $(d).find('select.devsel').change(function(e){
				
		    	
            id=$(this).val()
            POWER.loadSockets('basic/device/ports',1,$(this).parent().parent(), id);
				
				
				
        });
			
        //close win
        $(this.win.div).find('div.win_close').click(function(){
            NETWORK.win.remove()
            WIN.show('#win_ip') //set zindex back to 400
        });
        //add element
        $(this.win.div).find('a.el_set').click(function(){
            NETWORK.device_connect(this)
        });
		    
        //cancel
        $(this.win.div).find('a.el_cancel').click(function(){
            NETWORK.win.remove()
            WIN.show('#win_ip') //set zindex back to 400
        });		
			
        //cancel
        $(this.win.div).find('a.el_disc').click(function(){
            NETWORK.device_disconnect(this)
            NETWORK.win.remove()
            WIN.show('#win_ip') //set zindex back to 400
        });
			
		
    },
	
    conn_win:function(d){
	
        $(d).addClass('selected')
		
        if(!IP.tmpl){
            this.conn_div=d
		
            this.win=new nocwin('Select device to connect','','conndevice');	
	
            this.win.zindex()
		
	
            d=this.win.data
	
	
	
            $(d).html('<fieldset style="margin-top:10px;"><legend></legend></fieldset>'+
                '<fieldset><legend>RACK:</legend><select class="size_large2 racksel"></select></fieldset>'+
                '<fieldset><legend>Device:</legend><select class="size_large2 devsel"></select></fieldset>'+
                '<fieldset><legend>Port:</legend><select class="size_large portsel"></select></fieldset>'+
                '<fieldset style="position:absolute;bottom:10px;right:10px;"><legend></legend>'+
                '<button class="size_medium el_close">cancel</button>'+
                '<button class="size_medium el_add">add</button></fieldset>'
                )	
		
			
            this.racks($(d).find('select.racksel'),'',true)
	
            $(d).find('select.racksel').change(function(e){
	    	
                o=$(this).find('option:selected').val()
	    	
	    
	    	
                POWER.rackdevices('net',$(this).parent().parent().find('select.devsel'),'',true,o,true)
	    	
                pp=$(this).parent().parent().find('select.portsel')
    		
                $(pp).html('')
	    	
            });
		
            $(d).find('select.devsel').change(function(e){
			
	    	
                id=$(this).val()
			
                POWER.loadSockets('basic/device/ports',1,$(this).parent().parent(), id);
			
			
            });
	    
            //
		
		
            //DEVICE.roomdevices($(d).find('select.devsel'),'',false)
		
		
            //close win
            $(this.win.div).find('div.win_close').click(function(){
                $(NETWORK.conn_div).removeClass('selected')
                NETWORK.win.remove()
                WIN.show('#win_ip') //set zindex back to 400
			
            });
            //add element
            $(this.win.div).find('button.el_add').click(function(){
                NETWORK.device_connect(this)
			
            });
        
            //cancel
            $(this.win.div).find('button.el_close').click(function(){
                $(NETWORK.conn_div).removeClass('selected')
                NETWORK.win.remove()
                WIN.show('#win_ip') //set zindex back to 400
			
            });	
		
	
        }else{
            alert('Connection in Template is Not Available..')
        }		
		
    }	
}



var IP={
    init:function(d){
	
        if(Number($(d).attr('tmp'))==1) {
            this.tmpl=true;
            this.prefix=1;
		
        } else {
            this.tmpl=false;
            this.prefix=0;
        }
	
        eid=Number($(d).parent().parent().parent().parent().attr('eid'))
        WIN.show('#win_ip')
	
	
	
	
        if(eid!=NETWORK.eid){
            NETWORK.el=$(d).parent().parent().parent()
            NETWORK.eid=eid
            NETWORK.tmpl=this.tmpl
            
        }
        this.load()	
        
	
    },

    makeBucket:function(from,count,con,data){
        buc=$('<div/>').addClass(this.bucketClass)
        $(buc).appendTo(con)	
	
	
	
        for(i=1;i<=count;i++){
            if(from<=this.ports){
		
	
			

		
                el=$('<div/>').addClass('pin').html(from).appendTo(buc);					
			
		
                m=getObjects(data, 'n', from);
			
			
                if(m.length>0){
		
		
		
		
		
                    if(m[0].mac){
                        $(el).attr('mac',m[0].mac).addClass('hasMAC')
                    }
                    if(m[0].dev){
                        $(el).attr('dev',m[0].dev).addClass('isCON')
                    }
		
                    if(m[0].ipv4){
                        $(el).addClass('IPset')
                    }
		
                    if(m[0].conn_type){
                        if(m[0].conn_type==1)
                            $(el).addClass('rj45')
                        if(m[0].conn_type==2)
                            $(el).addClass('fiberlc')	
                    }
		
		
		
                    if(m[0].type){
                        if(m[0].type==2){
                            $(el).attr('virt','ok').addClass('isVirtual')
                        }
                    }
			
			
			

		

					
                }
		
			
		
            }
			
            from++;
        }
        return from;
    },	
	
    textIpField:function(ct,data){
        $.each(data,function(i,e){
	
            e.port.ipv6==''?ipv6='':ipv6='<span>IPv6:</span>'+e.port.ipv6;
	
            e.port.ipv4==''?ip='undefined':ip=e.port.ipv4;
	
		
            d=$('<div/>').addClass('ip_data').appendTo(ct)
            d.html('<div class="num">'+e.port.n+'.</div>'+
                '<div class="data"><div class="ipv4"><span>IP:</span>'+ip+'</div><div class="ipv6">'+
                ipv6+'</div></div>')
	
	
        //if(e.port.ipv4)
	
	
        })
		



    },

    textMacField:function(){
	
        //append to #vlan_s
        ct=$('#vlan_s'+this.prefix+' div.text_ipfield')
        ct.html('')
	
        $.each(IP.vlandata,function(i,e){
		
            ports=getObjects(NETWORK.o.data, "vlan", e.id)
		
            data='<span>PORTS:</span>'
		
            IP.m_a=Array()
            $.each(ports,function(ii,ee){
	
                IP.m_a.push(ee.n)
				
				
            });
		
            data+=IP.m_a.join(',')
            if(IP.m_a.length==0) data+='undefined'
		
		
            d=$('<div/>').addClass('ip_data').appendTo(ct)
            d.html('<div class="num">'+(i+1)+'.</div>'+
                '<div class="data"><div class="ipv4"><span>VLAN:</span>'+e.name+'</div><div class="ipv6">'+
                data+'</div></div>')
		
		
        //if(e.port.ipv4)
		
		
        })
			



    },


    makeTable:function(ports,d,div){
	
        this.ports=ports
        //

        if(this.ports<=12) {
            this.bucketClass='bucket2'
            bucket_count=4;
        }
        else {
            this.bucketClass='bucket2'
            bucket_count=4;
        }

        
        cont=$('<div/>').addClass('vertical_ipfield')
		
        $(cont).appendTo(div)	

        ct=$('<div/>').addClass('text_ipfield').appendTo(div)	

        if(this.ports==0){
            $(cont).css('height','35px')
        }

        this.textIpField(ct,d)


        length=1;
        while(length<=this.ports){	
	
            length=this.makeBucket(length,bucket_count,cont,d)	
        }

	
	
        return cont
	
    },	
	
    parseAtrr:function(items){

        $.each(items, function(i,item){	

	
	
            });
	
    },

    vlanNum:function(v){
	
        for(ii=0;ii<IP.vlandata.length;ii++){
            if(IP.vlandata[ii].id==v) return ii+1
		
        }
        return 0;
    },	
    connector_type:function(){
        if(DEVICE.cat==8)
            return 'fiberlc';
        else
            return 'rj45';
    },	
	
    large_port_table:function(json,els,diode,vlan){

        //empty table
        $(els).html('')

        //make ports
        this.makeTable(NETWORK.o.data.length,'',$(els));	

        if(NETWORK.o.data.length==0){
            $(els).html('<div class="vertical_ipfield" style="height:41px;"></div><div class="text_ipfield"></div>')
	
        }





        //get all ports
        ports=$(els+' div.pin')	

        //connector type
        ct=this.connector_type()
        //add all ports rj45/fiberLC connector type
        ports.addClass(ct) 
	


        $.each(ports,function(i,e){
		
            //add diode
            m=$('<div/>').addClass('diode').appendTo(e)
		
            //add mac and connected device information
            $(e).attr({
                'mac':NETWORK.o.data[i].mac_addr,
                'cd':NETWORK.o.data[i].conn_dev
            })
		
            //set mac class for connector
            if(NETWORK.o.data[i].mac_addr!=''){
                $(e).removeClass(ct).addClass(ct+'-mac')	
			
            }
		
		
            //vlan color
            if(vlan){
                if(NETWORK.o.data[i].vlan>0){
                    $(e).addClass('wcolor'+IP.vlanNum(NETWORK.o.data[i].vlan));
			
                }
                //action for click
                $(e).click(function(){
                    if(!IP.wcl){
                        console.log('not set wcl')
                    }else{

					
				
                        for(i=0;i<=24;i++){
                            $(this).removeClass('wcolor'+i)
                        }

                        if(IP.wcl=='c'){
                            NETWORK.setVlanOnPort(this)
				
				
                        }


                        if(IP.wcl!='c' && IP.wcl!='a' && IP.wcl){
                            $(this).addClass('wcolor'+IP.wcl);
                            NETWORK.setVlanOnPort(this)

                        }
                    }
                });
		
		
		
		
		
            }else{
		
                $(e).hover(function(){
                    $('#tooltip').html('');
                    html=''
                    if($(this).attr('mac').length>0){
                        html+='MAC: '+$(this).attr('mac')+'<br>'	
                    }
                    if($(this).attr('cd')!=0){
                        cd=$('#rack_unit'+$(this).attr('cd')+' div.name').text()
                        pt=$(this).attr('cp')
						
                        html+='Connected: '+cd+' ['+pt+']'	
                    }
                    if(html!=''){
						
                        $('#tooltip').html(html);
						
                        $('#tooltip').show();
                    }
                },function(){
					
                    $('#tooltip').hide();	
					
                }).click(function(){
						
						
						
                    }).mousemove(function(){
                    $('#tooltip').css('left',mouseX+10)
                    $('#tooltip').css('top',mouseY+10)
						
						
						
                });
					
		
			
			
			
			
			
			
            }
		
		
		
            if(NETWORK.o.data[i].id){
                $(e).attr('pid',NETWORK.o.data[i].id)
            }
		
		
		
            //diode light
            if(NETWORK.o.data[i].conn_dev>0){
                $(m).addClass('isConnected');
			
            }
		
		
        });
	
	
        if(!vlan) this.textMacField()

	
    },	
    vlanset:function(d){
        inp=$(this.win.data).find('input')
	
	
	
        v=inp.val()
	
        //td=$(this.conn_div).parent()
       
       
        /*
	w=$('<div>').addClass('vlan').attr('w',n).appendTo(div)

	$(w).html('<div class="wname">'+v+'</div>' +
			'<div class="wcolor wcolor'+n+'">' +
					
			'</div><div class="rem"></div>');
	
	IP.vlanAction(w);		
	*/
	
        this.win.remove()
        WIN.show('#win_ip') //set zindex back to 400
	
	
        NETWORK.loading(true)
	
        $.postJSON('basic/network/vlan',{
            'act':'add',
            'val':v,
            'eid':NETWORK.eid,
            'tmpl':NETWORK.tmpl
        }, function(json) {
		
            NETWORK.loading(false)
            IP.vlandata=json.data
            NETWORK.o.vlans=json.data
            
            IP.vlanNav($('#vlan'));
            IP.textMacField()
            IP.cableData('#mac_ports'+IP.prefix)
        });	
	


	
    },
    updateVlanTable:function(){
	
        IP.large_port_table(NETWORK.o,'#vlanports',false,true)
    //update layout field
    //IP.large_port_table(NETWORK.o,'#vlan_s'+IP.prefix,true,false)	
    },

    addvlan:function(d){
	
        this.conn_div=d
	
        this.win=new nocwin('Add vlan','','addvlan');	

        this.win.zindex()
	

        d=this.win.data
        pre='vlan'+(this.vlandata.length+1);
        $(d).html('<fieldset style="margin-top:10px;"><legend></legend></fieldset>'+
            '<fieldset><legend>Vlan name:</legend><input value="'+pre+'" class="size_large2"></fieldset>'+		
            '<fieldset style="position:absolute;bottom:10px;right:10px;"><legend></legend>'+
            '<button class="size_medium el_close">cancel</button>'+
            '<button class="size_medium el_add">add</button></fieldset>'
            )	

        //close win
        $(this.win.div).find('div.win_close').click(function(){
            IP.win.remove()
            WIN.show('#win_ip') //set zindex back to 400
        });
        //add element
        $(this.win.div).find('button.el_add').click(function(){
            IP.vlanset(this)
        });

        //cancel
        $(this.win.div).find('button.el_close').click(function(){
            IP.win.remove()
            WIN.show('#win_ip') //set zindex back to 400
        });	


	
    },
	
    vlanNav:function(d){

	
        $(d).html('')
		
        nav=$('<div>').addClass('vlan_nav').html('<div w="a" class="vlan vlanAdd"><div class="wname">add</div><div class="wcolor"></div></div><div w="c" class="vlan vlanClear"><div class="wname">clear</div><div class="wcolor"></div></div>').appendTo(d)	
	
        IP.vlanAction($(nav).find('div.vlanAdd'));	
        IP.vlanAction($(nav).find('div.vlanClear'));


        $.each(IP.vlandata, function(ii,vlan){

            num=ii+1
		
            ww=$('<div>').addClass('vlan vlancol').attr({
                'w':num,
                'vid':vlan.id
            }).appendTo(d)

            $(ww).html('<div class="wname">'+vlan.name+'</div>' +
                '<div class="wcolor wcolor'+num+'">' +
                '</div><div class="rem"></div>');
			
		

            IP.vlanAction(ww);	
		
		
        });
	
	
        IP.wcl=false;


        this.large_port_table(NETWORK.o,'#vlanports',false,true)
	
	
	
    },

    vlan:function(field,el){
	
        if(IP.data.length>0){
	
            this.vlandata=field.items	

            NETWORK.o.vlandata=field.items
            NETWORK.o.vlans=field.items


            tr=$('<tr/>')
            td1=$('<td/>').attr({
                'width':'410',
                'valign':'top'
            }).appendTo(tr)
            td2=$('<td/>').attr({
                'valign':'top'
            }).appendTo(tr)


            field2=$('<fieldset/>').attr('id','vlan_field').addClass('ports_field').appendTo(td1)
            field1=$('<fieldset/>').addClass('vlan_field').appendTo(td2)

            $('<legend/>').html('Ports').appendTo(field2)
            $('<legend/>').html('Vlan').appendTo(field1)	
	
            div=$('<div>').attr('id','vlan').appendTo(field1)
            $('<div>').attr('id','vlanports').appendTo(field2)	
	



            table=$('<table>').attr({
                cellspacing:0,
                cellpadding:0
            }).appendTo(el)
            tr.appendTo(table)



            this.vlanNav(div)
	

        //make empty table of n ports, then add vlan data on it
	

	
        }else{
            $('<div/>').addClass('info').html(NETWORK.message['noport']).appendTo(el)	
        }
	
    },
	
    vlanAction:function(div){

        $(div).hover(function(){	
            $(this).addClass('vlan_over')

        },function(){
            $(this).removeClass('vlan_over')

        }).click(function(){
            if($(this).attr('w')){
                IP.wcl=$(this).attr('w');
            }
            if(IP.wcl=='a'){
                IP.addvlan(this)
            }else{
                $('#vlan div.vlan').removeClass('vlan_active')
                $(this).addClass('vlan_active')
            }

        });		
	
        $(div).find('div.rem').click(function(){
            $('#vlan div.vlan').removeClass('vlan_active')
	
            NETWORK.remVlan(this)
        })


    },	

	
	
    makeMACTable:function(field,el){

        if(IP.json.data.length>0){	
	
            table=$('<table/>').attr(field.attr).addClass(field.class)


            newTR=$('<tr></tr>')
            if(field.trclass){
                newTR.addClass(field.trclass)	
            }	
	
            $.each(field.tr, function(i,item){		//tabs
                td=$('<td/>').attr(item.attr).html(item.name).appendTo(newTR)	
            });



            $(table).append(newTR)

            ll=IP.json.data.length




            $.each(IP.json.data, function(i,e){

	
                newTR=$('<tr class="row_color"></tr>').attr({
                    'mid':e.id,
                    'n':i+1
                })

                td=$('<td/>').html(e.n+'.').appendTo(newTR)	

                td1=$('<td/>').html('<input  autocomplete="off" placeholder="- -:- -:- -:- -:- -:- -">').appendTo(newTR)	
                td2=$('<td/>').html('<div class="socket"><div class="icons"></div></div><div class="conname">none</div>').appendTo(newTR)		

	
                m=getObjects(IP.data, 'n', i+1);
                if(m.length>0){
                    if(m[0].mac_addr){
                        $(td1).find('input').val(m[0].mac_addr)
                    }
		
		
                    s=IP.isInCable(e.id)
		
                    if(s[0]){
			
			
		
			
			
                        n=$('#rack_unit'+s[1]+' div.name').text()
			
			
                        $(td2).html('<div class="socket2"><div class="icons"></div></div><div class="conname2">'+n+' ['+s[3]+']</div>')
			
                        $(td2).find('div.socket2').attr('cab',s[4])
                    }
		
		
                }else{
			
			
                }
	

	
	
                NETWORK.action(td2)
	
	

                $(table).append(newTR)	
	
	
            });


            $(table).appendTo(el)

            $(table).find('input').bind('keydown focus blur',function(e){
                if(this==WIN.el_focused){
                    WIN.el_focused=false;
                }else{
		
		
                }
                if(e.type=='keydown') if(e.keyCode==13) $(this).blur()
	
		
                if(e.type=='focus'){
                    $(this).addClass('focused')	
                }
	
                if(e.type=='blur'){
                    $(this).removeClass('focused')	
                    NETWORK.updateMAC(this)
                }
	
	
	
            })	
        //.addClass('head')

        /*
<table class="win_iptable" cellpadding=5 cellspacing=0>
<tr class="head">
<td width="10%">Port</td>
<td width="35%">MAC address</td>
<td width="35%">Connected device</td>
</tr>
*/
	
        }else{
            $('<div/>').addClass('info').html(NETWORK.message['noport']).appendTo(el)
	
	
        }
    },	
	
    makeIPTable:function(field,el){


        if(field.items.length>0){	
	
            table=$('<div/>').addClass('ip_div_table')





            //IPM advanced version 
       

            $.each(field.items, function(i,z){
                e=z.port
	
                ii=i+1;
	
	
	
	
                if(e.type==1){
	
                    newTR=$('<div ip="'+e.id+'" class="ip_div_table_row"><div class="number">NIC:'+ii+'</div></div>')
		
                    td=$('<div/>').addClass('ip_div_left').html(
                        '<div class="row">	NIC name:<br><input placeholder="ethX" m="1" class="size_medium2" value="'+e.name+'"></div>'+
                        '<div class="row">	<div class="size_medium2">IPv4:</div><div><input  m="2" value="'+e.ipv4+'"  class="size_medium2" autocomplete="off" placeholder="00.00.00.00"></div></div>'+
                        '<div class="row"><div class="size_medium2">Connector type:</div><div>'+
                        '<select class="size_medium2 conn_type"  m="3"></select></div></div>'+
                        '<div class="row" mid="'+e.id+'" n="'+ii+'"><div class="size_medium2">Connected device:</div><div style="background:white;width:90%;height:20px;position:absolute;margin:5px;" class="condev">'+
                        '</div></div>'
                        ).appendTo(newTR)

                    cab=IP.isInCable(e.id)
	
        
     
        
        
	
                    if(cab[0]){
                        n=$('#rack_unit'+cab[1]+' div.name').text()
                        $(td).find('div.condev').html('<div cab="'+cab[4]+'" class="socket2"><div class="icons"></div></div><div class="conname2">'+n+' ['+cab[3]+']</div>');
		
                    }else{
		
                        $(td).find('div.condev').html('<div class="socket"><div class="icons"></div></div><div class="conname">none</div>')	
                    }
	
                    //
	
	
	
                    td=$('<div/>').addClass('ip_div_right').html(
                        '<div class="row"></div>'+
                        '<div class="row"><div class="size_medium2">IPv6:</div><div>'+
                        '<input value="'+e.ipv6+'"  m="4"  class="size_large3" autocomplete="off" placeholder="0000:0000:0000:0000:0000:0000:0000:0000"></div></div>'+
                        '<div class="row"><div class="size_medium2">Connector speed:</div><div>'+
                        '<select class="size_large conn_sp"  m="5"></select></div></div>'
				
                        ).appendTo(newTR)

	
	
                    //IPM advanced version 
                    if(typeof IPM_device != 'undefined')
                        IPM_device.init(newTR,e.ipv4,e.id)
        

	
                    NETWORK.action2(newTR)

                    $(table).append(newTR)	
	
                    sel_sp=$(newTR).find('select.conn_sp')
                    sel_type=$(newTR).find('select.conn_type')
	
                    if(e.conn_type==0){
                        o=$('<option/>').val(0).text('-').appendTo(sel_type)
		
                    }
	
                    if(e.conn_speed==0){
                        o=$('<option/>').val(0).text('-').appendTo(sel_sp)
		
                    }
	
	
	
                    $.each(field.conn.type,function(ii,ee){
                        o=$('<option/>').val(ee.id).text(ee.name).appendTo(sel_type)
                        if(e.conn_type==ee.id){
                            o.attr('selected','selected')
                        }
                    })
	
                    $.each(field.conn.speed,function(ii,ee){
                        o=$('<option/>').val(ee.id).text(ee.name).appendTo(sel_sp)
                        if(e.conn_speed==ee.id){
                            o.attr('selected','selected')
                        }
                    })
                }
	
                if(e.type==2){
                    newTR=$('<div ip="'+e.id+'" class="ip_div_table_row virtual"><div class="number">VP:'+i+'</div></div>')
		
		
                    td=$('<div/>').addClass('ip_div_left').html(
                        '<div class="row">	NIC name:<br><input placeholder="ethX/Y" m="1" class="size_medium2" value="'+e.name+'"></div>'+
                        '<div class="row">	<div class="size_medium2">IPv4:</div><div><input  m="2" value="'+e.ipv4+'"  class="size_medium2" autocomplete="off" placeholder="00.00.00.00"></div></div>'+
                        '<div class="row"><div class="size_medium2">Connector type:</div><div>'+
                        '<select class="size_medium2 conn_type"  m="3" disabled><option>virtual</option></select></div></div>'
                        ).appendTo(newTR)

                    td=$('<div/>').addClass('ip_div_right').html(
                        '<div class="row"></div>'+
                        '<div class="row"><div class="size_medium2">IPv6:</div><div><input m="4"  value="'+e.ipv6+'" class="size_large3" autocomplete="off" placeholder="0000:0000:0000:0000:0000:0000:0000:0000"></div></div>'
						
                        ).appendTo(newTR)

			
		
                    //IPM advanced version 
                    if(typeof IPM_device != 'undefined')
                        IPM_device.init(newTR,e.ipv4,e.id)
		

                    $(table).append(newTR)	

		
                }
	
	
	
            });

	
	






	


            $(table).appendTo(el)
	
            this.setAction(table)

        }else{
            $('<div/>').addClass('info').html(NETWORK.message['noport']).appendTo(el)
        }
	
	
    },	

    setAction:function(table){

        $(table).find('select').change(function(e){	
	
            ip_id=getparentAttr(this,'ip')	
			
            val=$(this).val()
            m=$(this).attr('m')
		
            NETWORK.loading(true)
		
		
            $.postJSON('basic/network/ip/set',{
                'eid':NETWORK.eid,
                'm':m,
                'val':val,
                'ip':ip_id,
                'tmpl':NETWORK.tmpl
            }, function(json) {
			
		
                IP.updateVal(val,m,ip_id)	
				
                NETWORK.loading(false)
			
            });
				
		
	
        });

        $(table).find('input').bind('keydown blur focus',function(e){
            if(this==WIN.el_focused){
                WIN.el_focused=false;
            }else{
                WIN.el_focused=this;
            }	
            if(e.type=='keydown') if(e.keyCode==13) $(this).blur()
		
            if(e.type=='focus'){
                $(this).addClass('focused')	
            }
	
            if(e.type=='blur'){
		
                $(this).removeClass('focused')
                val=$(this).val()
                m=$(this).attr('m')
		
                ip_id=getparentAttr(this,'ip')	
                IP.activeEL=this	
                IP.tmp=Array(val,m,ip_id)
	
                NETWORK.loading(true)
	
                $.postJSON('basic/network/ip/set',{
                    'eid':NETWORK.eid,
                    'm':m,
                    'val':val,
                    'ip':ip_id,
                    'tmpl':NETWORK.tmpl
                }, function(json) {
		
	
		
                    if(json.status!='ok'){
                        $(IP.activeEL).val(json.old)	
                    }else{
                        IP.updateVal(IP.tmp[0],IP.tmp[1],IP.tmp[2])	
			
                    }
		
		
		
                    NETWORK.loading(false)
		
		
		
		
                });	
		
		
            }
	
	
        });	
	
	
    },	
    updateVlanText:function(a,b){
        ob=getObjects(NETWORK.o.data, "id", b)
	
        if(ob.length>0) {
		
            $.each(NETWORK.o.data,function(i,e){
			
                if(e.id==b){
				
			
                    NETWORK.o.data[i]['vlan']=a
                }
			
            });

            this.textMacField()
		
        }
		
    },

updateIPval:function(val,m,ip){
  
   NETWORK.o.data=WIN.json.data
            NETWORK.o.ips=WIN.json.ips
            NETWORK.o.cables=WIN.json.cables
  
  v=Array()
        v[2]=Array('','conn_dev','mac_addr','vlan');
	
        v[1]=Array('','name','ipv4','conn_type','ipv6','conn_speed');
  
$.each(NETWORK.o.ips,function(i,e){
		
                if(e.port.id==ip){
                    console.info('set',val)
                    NETWORK.o.ips[i]['port'][v[1][m]]=val	
				
                }
			
			
            });

  switch(NETWORK.o.special){
                case 'ipfield':
			
                    IP.makeIPField(NETWORK.o,NETWORK.el);
                    break;
                case 'macfield':
                    NETWORK.o.vlans=IP.vlandata
                    //NETWORK.el=(NETWORK.el).parent()
                    $(NETWORK.el).html('')
                    IP.makeMACField(NETWORK.o,NETWORK.el);
                   
			
                    break;
		
            }

    
},

    updateVal:function(val,m,ip){
        //console.log('update val',val,m,ip)

	
        v=Array()
        v[2]=Array('','conn_dev','mac_addr','vlan');
	
        v[1]=Array('','name','ipv4','conn_type','ipv6','conn_speed');
	
        nt=Number(NETWORK.o.type)
	/*
        ob=getObjects(NETWORK.o.ips, "id", ip)

	
        if(ob.length>0) {
		
            $.each(NETWORK.o.ips,function(i,e){
		
                if(e.port.id==ip){
                    NETWORK.o.ips[i]['port'][v[1][m]]=val	
				
                }
			
			
            });
        }
       */
	
        
        
        ob=getObjects(NETWORK.o.data, "id", ip)


        if(ob.length>0) {
		
            $.each(NETWORK.o.data,function(i,e){
		
			
                switch(nt){
                    case 1:
                        if(e.port.id==ip){
                            NETWORK.o.data[i]['port'][v[nt][m]]=val	
				
                        }
				
                        break;
                    case 2:
                        if(e.id==ip){
                            NETWORK.o.data[i][v[nt][m]]=val	
				
                        }
					
                        break;
		
                }
		
			
            });
		
		
	
		
		
            switch(NETWORK.o.special){
                case 'ipfield':
			
                    IP.makeIPField(NETWORK.o,NETWORK.el);
                    break;
                case 'macfield':
                    NETWORK.o.vlans=IP.vlandata
                    //NETWORK.el=(NETWORK.el).parent()
                    $(NETWORK.el).html('')
                    IP.makeMACField(NETWORK.o,NETWORK.el);
                   
			
                    break;
		
            }
			
        }
    },

    sort_type:function(data,type){
        m=Array();
        a=1;
        $.each(data,function(i,e){
	
            if(e.port.type==type)
            {
                e.port.n=a
                m.push(e)
                a++;
            }	
		
	
        })
	
        return m	
    },

    makePortLayout:function(){
    //('#vlan_s')	
	
	
    },
    equal:function(a,b){
        if(Number(a)==Number(b)) return true;
        return false;
	
    },
    isInCable:function(pin){
        uu=0
	
	
        if(!IP.cables){}else{
	
            uu=IP.cables.length
		
            for(ci=0;ci<uu;ci++){
		
                if(IP.equal(this.cables[ci].dev2,DEVICE.id) && IP.equal(this.cables[ci].port2,pin)){
                    return [true,this.cables[ci].dev1,this.cables[ci].port1,this.cables[ci].name1,this.cables[ci].id]
                }
                if(IP.equal(this.cables[ci].dev1,DEVICE.id) && IP.equal(this.cables[ci].port1,pin)){
                    return [true,this.cables[ci].dev2,this.cables[ci].port2,this.cables[ci].name2,this.cables[ci].id]
                }
	
		
            }
        }
	
        return [false];
	
    },

    cableData:function(div){
	
	
        pins=$(div).find('div.pin')
	
        $.each(pins,function(oi,e){
		
            $(e).find('div.diode').removeClass('isConnected')	
            $(e).attr('cd',0)
		
            mm=IP.isInCable($(e).attr('pid'));
            if(mm[0]){
                $(e).find('div.diode').addClass('isConnected')	
                $(e).attr('cd',m[1])
                $(e).attr('cp',m[3])
            }
		
		
		
        })
	
	
    },

    makeMACField:function(field,div){
	
        this.cables=field.cables
	
	
        this.tmpl=false;
        this.prefix=0;
        if($(div).attr('temp')=='ok'){
            this.tmpl=true;	
	
            this.prefix=1;
        }

	
        IP.vlandata=field.vlans
        NETWORK.o=field
	
        $(div).html('')
	


        field1=$('<fieldset/>').attr('id','mac_ports'+this.prefix).appendTo(div)


	
        $('<div>').attr('id','vlan_s'+this.prefix).appendTo(field1)
	
	
        IP.large_port_table('','#vlan_s'+this.prefix,true,false)

        el=$('<div>').appendTo(field1)
        f=field
        
        this.makeIPFieldextra(f,el);

        tmp=0;
        if(IP.tmpl) tmp=1;	
        fl=$('<div/>').addClass('buttonHolder').appendTo(div)
        hi=$('<div/>').css({
            'float':'left',
            'clear':'both',
            'margin-bottom':'15px',
            'margin-left':'10px',
            'margin-top':'0px'
        }).html('<a href="#" class="abutton toIP"><div tmp="'+tmp+'" class="inner portedit">edit ports</div></a>').appendTo(div)

        $(hi).find('div.portedit').click(function(){
            IP.init(this)
        });
	
        this.cableData('#mac_ports'+this.prefix)

	
	
    },

    makeIPFieldextra:function(field,el){
	
        //NETWORK.o=field
	
        if(typeof field.ips != 'undefined')

        
        {
        
        virtIP=this.sort_type(field.ips, 2);
	
        
	
	
        
        if($(virtIP).length>0){
	
            fl=$('<legend/>').css({
                'clear':'both',
                'margin-top':10+'px'
            }).html('virtual IP ports').appendTo(el)
            this.makeTable(virtIP.length,virtIP,el);
        }
        }
    },  

    makeIPField:function(field,el){
        IP.cables=field.cables
        this.tmpl=false;

	
        px=0
        if($(el).attr('temp')=='ok'){
            this.tmpl=true;	
            px=1
        }
	
        NETWORK.o=field
	
        console.log(field)
        
        $(el).html('')
        statIP=this.sort_type(field.data, 1);
        
        port_s=statIP

        //console.log(statIP)
	
        cont=this.makeTable(statIP.length,statIP,el);

        $(cont).attr('id','ipp_ports'+px)
	
	
	
        virtIP=this.sort_type(field.data, 2);
	
        
        //port_s=port_s.concat(virtIP);
	
        
        if($(virtIP).length>0){
            console.info(virtIP)
            fl=$('<legend/>').css({
                'clear':'both',
                'margin-top':10+'px'
            }).html('virtual IP/ports').appendTo(el)
	
            this.makeTable(virtIP.length,virtIP,el);
        }
	
	
        //
	
	
	
	
	
        ps=$('#ipp_ports'+px).find('div.pin')
	
        $.each(ps,function(ii,pt){
		
		
		
            $(pt).attr({
                'pid':port_s[ii].port.id
            })
            $(pt).addClass('linkspeed'+port_s[ii].port.conn_speed)
		
            tt=$(pt).text()
		
            $(pt).html(tt+'<div class="diode"></div>')
		
		
            $(pt).hover(function(){
                $('#tooltip').html('');
                html=''
				
                if($(this).attr('cd')!=0){
                    cd=$('#rack_unit'+$(this).attr('cd')+' div.name').text()
                    pt=$(this).attr('cp')
					
                    html+='Connected: '+cd+' ['+pt+']'	
                }
                if(html!=''){
					
                    $('#tooltip').html(html);
					
                    $('#tooltip').show();
                }
            },function(){
				
                $('#tooltip').hide();	
				
            }).click(function(){
					
					
					
                }).mousemove(function(){
                $('#tooltip').css('left',mouseX+10)
                $('#tooltip').css('top',mouseY+10)
					
					
					
            });
		
		
        });
	
	
	
	
        tmp=0;
        if(this.tmpl) tmp=1;
	
        fl=$('<div/>').addClass('buttonHolder').appendTo(el)

        hi=$('<div/>').css({
            'float':'left',
            'clear':'both',
            'margin-bottom':'15px',
            'margin-left':'10px',
            'margin-top':'0px'
        }).html('<a href="#" class="abutton toIP"><div tmp="'+tmp+'" class="inner ipedit">edit ports</div></a>').appendTo(el)

        $(hi).find('div.ipedit').click(function(){
            IP.init(this)
        });




	
        IP.cableData($('#ipp_ports'+px))
	



    },		
    makeField:function(field,div){

	
	
        this.makeTable(field.ports,field.data,div);

	
	
        if(field.uplinks){
	
            $('<div/>').addClass('textHolder').html('Uplinks').appendTo(div)
	
            this.makeTable(field.uplinks,field.data2,div);	
	
        }	
	

	
        fl=$('<div/>').addClass('buttonHolder').appendTo(div)
        $('<button/>').html('edit').appendTo(fl).click(function(){
            IP.init(this)
        });

    },
    loadFinish:function(){
        IP.cables=WIN.json.cables
        //IP.data=WIN.json.data
        portactive=false
	
        //if(this.tmpl) IP.cables=false; 
	
        if(WIN.json.type==1){
	
		
	
            o=NETWORK.o
            o.cables=WIN.json.cables
            o.data=WIN.json.items[1].items[0].items
	
            if(o.data.length>0){
                portactive=true
            }
	
            IP.makeIPField(o,NETWORK.el);
	
        }
	
        if(WIN.json.type==2){
		
       
                
            NETWORK.o.data=WIN.json.data
            NETWORK.o.ips=WIN.json.ips
            NETWORK.o.cables=WIN.json.cables
		
            IP.large_port_table('', '#vlan_s'+this.prefix, true, false)
		
            IP.large_port_table('', '#vlanports', true, true)
		
            if(this.prefix==0){
                IP.cableData('#mac_ports'+this.prefix)
            }
            //IP.makeIPField(o,NETWORK.el);
		
            if(WIN.json.data.length>0){
                portactive=true
            }
	
  	
            IP.makeMACField(NETWORK.o,NETWORK.el);
	
                   
        }
	
	
        if(portactive){
            WIN.activateTab('#win_ip',2)
		
        }
	
	
        $('#win_ip div.win_mask').hide()
	
        $('#win_ip_layer1 select').change(function(e){
		
		
            act=$(this).parent().parent().attr('act')
            if(act){
			
                val=$(this).val()
                if(act=='act3' || act=='act4' || act=='act1' || act=='act2'){
				
                    if (val=='') {
                        val=0;
                        $(this).val(0)
                    }
                }
                NETWORK.loading(true)
			
                WIN.parseData('network/set','win_ip',IP.container,1,true,{
                    'eid':NETWORK.eid,
                    'act':act,
                    'val':val,
                    'tmpl':NETWORK.tmpl
                });
			
			
            }
		
		
        });
		
		
		
        $(this.winicon).addClass('default').removeClass('imageLoader')
        NETWORK.loading(false)
	
	
    },
    load:function(){
        
        $('#win_ip div.win_mask').show()

        this.container=$('#win_ip div.win_data')

        this.container.html('')
        this.winicon=$('#win_ip div.win_icon')
        this.vlandata=false;


        $(this.winicon).removeClass('default').addClass('imageLoader')

        this.container.append($('<div/>').addClass('dataLoad').html('loading data..'))
	
        WIN.parseData('network/get','win_ip',this.container,1,true,{
            'eid':NETWORK.eid,
            'tmpl':NETWORK.tmpl
        });
	

	
    }
	
	
	
}
	