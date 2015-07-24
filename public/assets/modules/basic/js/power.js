var POWER={
	
		
init:function(d){

	if(!this.consumer) this.consumer=0;
	
	if(Number($(d).attr('tmp'))==1) {
		this.tmpl=true;
		this.prefix=1;
		
		} else {this.tmpl=false;this.prefix=0;}
	
	eid=Number($(d).parent().parent().parent().attr('eid'))	
	
	
	WIN.show('#win_power')
	
	POWER.el=$(d).parent().parent().parent()
	
	
		
		POWER.eid=eid
		this.load()	
	
	
},
load:function(){
	$('#win_power div.win_mask').show()

	this.container=$('#win_power div.win_data')

	this.container.html('')
	this.winicon=$('#win_power div.win_icon')



	
this.loading(true)

	this.container.append($('<div/>').addClass('dataLoad').html('loading data..'))
		
	WIN.parseData('power/get','win_power',this.container,1,true,{'eid':POWER.eid,'tmpl':POWER.tmpl});	
	
	
	
},
loading:function(key){
	if(key)
	$('#win_power div.win_icon').addClass('deviceLoader').removeClass('default');
	else
	$('#win_power div.win_icon').removeClass('deviceLoader').addClass('default');
},


loadFinish:function(){
	
	if(POWER.json.err.length>0){
		
		alert(POWER.json.err)
	}
        
	if(POWER.consumer==0){
	POWER.makeField(POWER.json,POWER.el);
	}else{
            
	POWER.onlyInputfield(POWER.json,POWER.el);
		
	}
        
	this.loading(false)
	
$('#win_power div.win_mask').hide()
	
	$('#win_power_layer1 select').change(function(e){
	
		act=$(this).parent().parent().attr('act')
		if(act){
                        
                        // different types with power tab
                        var types=['pdu','rack_unit']
                        var type = types[1]             //default to rack_unit; just store new power sockets

                        if (DEVICE.dev) {
                            
                            var n=types.length
                            
                            // check device type
                            for (var i = 0; i < n; i++)
                                if ($(DEVICE.dev).attr('class').indexOf(types[i]) !== -1)
                                    var type = types[i]
                        }

                        var val = Number($(this).val())
                        var ru = Number($('.pdu.active').parents('.rack').attr('ru'))
                        var pos = Number($('.pdu.active').attr('pos'))
                        var ps = 0

                        $.each($('.pdu.active').parent().find('.pdu'), function(i, e) {
                            if (!$(e).hasClass('active'))
                                ps += Number($(e).attr('out'))
                        });

                        
                        switch (type) {
                            case 'pdu':
                                
                                if(ps+val<=ru && pos+val<=ru) {

                                    if(act=='act3' || act=='act1' || act=='act2'){

                                            if (val=='') {val=0;$(this).val(0)}
                                    }
                                    POWER.loading(true)
                                    WIN.parseData('power/set','win_power',POWER.container,1,true,{'eid':POWER.eid,'act':act,'val':val,'tmpl':POWER.tmpl});
                                    POWER.loading(false)
                                }
                                else {
                                    NOC.alertBox('Move','Output number of sockets is to large for rack, there is no enough empty space in rack!','win_power','orange2')
                                }
                                break;
                                
                            case 'rack_unit':

                                POWER.loading(true)
                                WIN.parseData('power/set', 'win_power', POWER.container, 1, true, {'eid': POWER.eid, 'act': act, 'val': val, 'tmpl': POWER.tmpl});
                                POWER.loading(false)

                                break;
                        }
                        
                        
		}
	});
},
splitSockets:function(){
	this.inputSoc=[]
	this.outputSoc=[]
	$.each(POWER.json.data.sockets, function(i,e){
		if(e.type==1) POWER.inputSoc.push(e); else POWER.outputSoc.push(e); 
	});
	
},
inputTable:function(field,el){
	
	
	this.makeTable(field,el,this.inputSoc)
	
},
outputTable:function(field,el){
	
	this.makeTable(field,el,this.outputSoc)
	
},

updateVal:function(val,id){
	//console.log(val,id)
	
	ob=getObjects(POWER.json.data.sockets, "id", id)

	
	if(ob.length>0) {ob[0]['conn_type']=val}
	
	if(this.consumer==0)
	POWER.makeField(POWER.json,POWER.el);
	else
	POWER.onlyInputfield(POWER.json,POWER.el);
},

isInCable:function(pin){
	uu=0
	//console.log(IP.cables,this.cables)
	
	
	
	if(!POWER.json.cables){}else{
	
	uu=POWER.json.cables.length
	
	cables=POWER.json.cables
	
	for(ci=0;ci<uu;ci++){
		
		if(IP.equal(cables[ci].dev2,POWER.getwindata('id')) && IP.equal(cables[ci].port2,pin)){
			return [true,cables[ci].dev1,cables[ci].port1,cables[ci].name1,cables[ci].id]
		 }
		if(IP.equal(cables[ci].dev1,POWER.getwindata('id')) && IP.equal(cables[ci].port1,pin)){
			return [true,cables[ci].dev2,cables[ci].port2,cables[ci].name2,cables[ci].id]
		 }
	
		
	}}
	
	return [false];
	
},

loadSockets:function(where,type,d,dev,p){
	
	pp=$(d).find('select.portsel')
        
	$(pp).html('')
	//console.log(POWER.getwindata('id'),soc)
	$.postJSON(where,{'dev':dev,'type':type}, function(json) {
		//console.log(pp)
		if(json.status=='ok'){
                    
			$.each(json.ports,function(i,port){
			
                        console.log("ports")
                        
			stat='unpluged'
			dis=0
				//console.log(id)
			
			if(port.type==2){
				stat='virtual'
    			dis=1
    					
				
			}
				
                                
                                
			$.each(json.cables,function(z,e){
			
                           // console.log("port1",e.port1, "port id",port.id, "e.dev1",e.dev1, "dev",dev);
				
				if(IP.equal(e.port1,port.id) && IP.equal(e.dev1,dev)){
				stat='connected'
			dis=1
				
			}
				
				
			if(IP.equal(e.port2,port.id) && IP.equal(e.dev2,dev)){
				stat='connected'
			dis=1   
				
			}
			
				
			});
			
			ii=i+1
			op=$('<option></option>').addClass('option_small').attr({'value':port.id,'dis':dis}).html(ii+' / '+stat)		
			
                        
                        //console.info(">>>>>>",port.id,dev,IP.equal(port.id,dev))
                        
			if(IP.equal(port.id,p)){
				op.attr('selected','selected')
				
			}
			$(pp).append(op)	
                        
                        if(typeof PANEL.poptmp=="object")
                        PANEL.poptmp.win.loading(false)
			
		});	
			
			if(json.ports.length==0){
				$(pp).html('<option value="0">*No ports defined yet..</option>')	
				
			}
			
			
		}else{
			$(pp).html('<option value="0">*Device have no port..</option>')	
			
		}
		
	});	
    
},

disc_win:function(d){
	
	cab=Number($(d).attr('cab'))
	
	ob=getObjects(POWER.json.cables, "id", cab)
	if(POWER.getwindata('id')==ob[0].dev1){
		dev=ob[0].dev2;port=ob[0].port2}else{dev=ob[0].dev1;port=ob[0].port1}
	
	
	if($('#rack_unit'+dev).length>0){
		n=$('#rack_unit'+dev)
		
	}else{
		
		n=$('#vertPDU'+dev)
		
	}
	
	
	rack=getparentAttr(n,'id')	
	
	//console.log(POWER.getwindata('id'),ob,n,rack)
	
	this.conn_div=d
	if(Number($(d).parent().parent().attr('type'))==1) { type=false;} else type=true;
	if(this.win) this.win.remove()
	this.win=new nocwin('Select device to connect','','conndevice');	

	this.win.zindex()
	

d=this.win.data

$(d).html('<fieldset style="margin-top:10px;"><legend></legend></fieldset>'+
		  '<fieldset><legend>RACK:</legend><select class="size_large2 racksel"></select></fieldset>'+
		  '<fieldset><legend>Device:</legend><select class="size_large2 devsel"></select></fieldset>'+
		  '<fieldset><legend>Socket:</legend><select class="size_large portsel"></select></fieldset>'+
		'<fieldset style="position:absolute;bottom:10px;right:10px;"><legend></legend>'+
		'<div style="float:left;margin-right:20px;"><a class="abutton el_disc" href="#"><div class="inner">disconnect</div></a></div>'+	
		'<div style="float:left;margin-right:20px;"><a class="abutton el_cancel" href="#"><div class="inner">cancel</div></a></div>'+
		'<div style="float:left;margin-right:10px;"><a class="abutton el_set" href="#"><div class="inner">set</div></a></div></fieldset>'
)	
	
		
    NETWORK.racks($(d).find('select.racksel'),rack,true)

    POWER.rackdevices('power',$(d).find('select.devsel'),dev,true,rack.replace('rack',''),type)
    
    
    POWER.loadSockets('basic/power/socket/conn',$(POWER.conn_div).parent().parent().attr('type'),$(d), dev,port);

    
    
    
	 $(d).find('select.racksel').change(function(e){
	    	
	    	o=$(this).find('option:selected').val()
	    	
	    	//console.log(o)
	    	if(Number($(POWER.conn_div).parent().parent().attr('type'))==1) { type=false;} else type=true;
	    	POWER.rackdevices('power',$(this).parent().parent().find('select.devsel'),'',true,o,type)
	    	
	    	pp=$(this).parent().parent().find('select.portsel')
			
			$(pp).html('')
	    	
	    });
		
		$(d).find('select.devsel').change(function(e){
			
	    	
			id=$(this).val()
			
			POWER.loadSockets('basic/power/socket/conn',$(POWER.conn_div).parent().parent().attr('type'),$(this).parent().parent(), id);
			
			
		});
		
		//close win
		$(this.win.div).find('div.win_close').click(function(){
			POWER.win.remove()
			WIN.show('#win_power') //set zindex back to 400
		});
	    //add element
		$(this.win.div).find('a.el_set').click(function(){
			POWER.device_connect(this,true)
		});
	    
		//cancel
		$(this.win.div).find('a.el_cancel').click(function(){
			POWER.win.remove()
			WIN.show('#win_power') //set zindex back to 400
		});		
		
		//cancel
		$(this.win.div).find('a.el_disc').click(function(){
			POWER.device_disconnect(this)
			POWER.win.remove()
			WIN.show('#win_power') //set zindex back to 400
		});
		
	
},

device_disconnect:function(d){
	
	cab=$(this.conn_div).attr('cab')
	td=$(this.conn_div).parent()
	
	
	
	v=0
	
	td.html('<div class="socket"><div class="icons"></div></div><div class="conname">none</div>')
	
	this.action(td)
	
	$.postJSON('basic/network/cable/remove',{'act':'disconnect','val':v,'eid':POWER.eid,'cab':cab,'tmpl':POWER.tmpl}, function(json) {
		
		$.each(POWER.json.cables,function(i,e){
			if(e.id==json.id){
				
				e.dev2=0
				e.dev1=0
				e.port1=0
				e.port2=0
			}
			
			
			$(td).find('div.socket2').removeAttr('cab')	
			
		})
			//IP.cableData('#mac_ports')
	POWER.win.remove()
	WIN.show('#win_power') //set zindex back to 400	
	});
	
	
	
	
	//IP.updateVal(0,1,mid)	
	
	//update vlan port field 
	//IP.updateVlanTable();
	
	
},


connector:function(sel,ct){
	
	m=Array('','IEC C13/C14','IEC C19/C20','IEC 60309')
	
	
	$.each(m,function(ii,ee){
		if(ii>0){
		o=$('<option></option>').val(ii).html(ee).appendTo(sel)
		}
		if(Number(ct)==ii) $(o).attr('selected','selected')
		
	})
	$(sel).change(function(e){	
	
		soc_id=getparentAttr(this,'mid')	
			
		val=$(this).val()
		//m=$(this).attr('m')
		
		
		
		
		$.postJSON('basic/power/socket/set',{'eid':POWER.eid,'val':val,'soc':soc_id,'tmpl':POWER.tmpl}, function(json) {
			
		
			POWER.updateVal(val,soc_id)	
				
			
			
			});
				
		
	
	});
	
	
	
},

getwindata:function(type){
	
	switch(POWER.prefix){
	case 0: //device
	if(type=='id') return DEVICE.id;
	if(type=='dev') return DEVICE.dev;
	break;
	case 1: //template
	if(type=='id') return TEMPLATE.templateID;
	if(type=='dev') return TEMPLATE.temp;
		
	break;
	}
	return 0;
	
},
action:function(t){
	$(t).find('div.socket').click(function(){
		POWER.conn_win(this);
		
	})

	$(t).find('div.socket2').click(function(){
		POWER.disc_win(this);
		
	})

	
},
makeTable:function(field,el,sockets){
	//   console.log(POWER.json.cables)
	
	table=$('<table/>').attr(field.attr).addClass(field.class)


newTR=$('<tr></tr>')
if(field.trclass){
newTR.addClass(field.trclass)	
}
$.each(field.tr, function(i,item){		//tabs
	td=$('<td/>').attr(item.attr).html(item.name).appendTo(newTR)	
	});
$(table).append(newTR)


$.each(sockets, function(i,e){

newTR=$('<tr class="row_color"></tr>').attr({'mid':e.id,'n':i+1,'type':e.type})

td=$('<td/>').html((i+1)+'.').appendTo(newTR)	

td1=$('<td/>').html('<select class="size_medium2"></select>').appendTo(newTR)	
td2=$('<td/>').html('<div class="socket"><div class="icons"></div></div><div class="conname">none</div>').appendTo(newTR)		

cab=POWER.isInCable(e.id)



if(cab[0]){
	
	if($('#rack_unit'+cab[1]).length>0){
		n=$('#rack_unit'+cab[1]+' div.name').text()
		
	}else{
		
		n=$('#vertPDU'+cab[1]).attr('name')
		
	}
	
	$(td2).html('<div cab="'+cab[4]+'" class="socket2"><div class="icons"></div></div><div class="conname2">'+n+' ['+cab[3]+']</div>');
	
}else{
	
	$(td2).html('<div class="socket"><div class="icons"></div></div><div class="conname">none</div>')	
}



POWER.connector($(td1).find('select')[0],e.conn_type);

$(table).append(newTR)
});




$(table).appendTo(el)
	
this.action(table)

},

onlyInputfield:function(field,div){
POWER.consumer=1;
	
	

this.splitSockets()

$(div).html('')

fl=$('<legend/>').css({'clear':'both','margin-top':10+'px'}).html('Input sockets').appendTo(div)
cont=$('<div/>').addClass('vertical_ipfield')
$(cont).appendTo(div)	
buc=$('<div/>').addClass('bucket2')
$(buc).appendTo(cont)	
m=['','IEC_C13','IEC_C19','IEC_60309']

for(i=1;i<=Number(field.data.input);i++){
	
	el=$('<div/>').addClass('pin').html(i).appendTo(buc);
	
	
	$(el).addClass(m[POWER.inputSoc[i-1].conn_type])
	
}

tmp=this.isTemplate(div)
hi=$('<div/>').css({'float':'left','clear':'both','margin-bottom':'15px','margin-left':'10px','margin-top':'0px'}).html('<a href="#" class="abutton toIP"><div tmp="'+tmp+'" class="inner">edit data</div></a>').appendTo(div)

$(hi).find('div.inner').click(function(){POWER.init(this)});

},
isTemplate:function(div){
	p=getparentAttr(div,'id')
	
	f=p.search( /template/i );

	if(f>0) return 1
	
	return 0
	
	
	
},

makeField:function(field,div){
	//console.log(field.data)
	POWER.consumer=0;
	this.splitSockets()
	
	$(div).html('')
	fl=$('<legend/>').css({'clear':'both','margin-top':10+'px'}).html('Current (max)').appendTo(div)
	cont=$('<div/>').html(field.data.current+'A').addClass('power_data')
	$(cont).appendTo(div)	
	
	
	fl=$('<legend/>').css({'clear':'both','margin-top':10+'px'}).html('Input sockets').appendTo(div)
	cont=$('<div/>').addClass('vertical_ipfield')
	$(cont).appendTo(div)	
	
	
	
	buc=$('<div/>').addClass('bucket2')
	$(buc).appendTo(cont)	
	m=['','IEC_C13','IEC_C19','IEC_60309']
	
	for(i=1;i<=Number(field.data.input);i++){
		
		el=$('<div/>').addClass('pin').html(i).appendTo(buc);
		
		
		$(el).addClass(m[POWER.inputSoc[i-1].conn_type])
		
	}
	
	fl=$('<legend/>').css({'clear':'both','margin-top':10+'px'}).html('Output sockets').appendTo(div)
	cont=$('<div/>').addClass('vertical_ipfield')
	$(cont).appendTo(div)	
	
	
	
	buc=$('<div/>').addClass('bucket2')
	$(buc).appendTo(cont)	
	o=0
	//console.log(POWER.json.cables)
	
	for(i=1;i<=Number(field.data.output);i++){
		
		el=$('<div/>').addClass('pin').html(i).appendTo(buc);
		
		$(el).addClass(m[POWER.outputSoc[i-1].conn_type])
	}
	
	tmp=this.isTemplate(div)
	hi=$('<div/>').css({'float':'left','clear':'both','margin-bottom':'15px','margin-left':'10px','margin-top':'0px'}).html('<a href="#" class="abutton toIP"><div tmp="'+tmp+'" class="inner">edit data</div></a>').appendTo(div)

	
	
	
	if(!tmp){
	if($(POWER.getwindata('dev')).attr('pduid')){
		h=Number(field.data.output)*14;
		$(POWER.getwindata('dev')).attr('out',field.data.output).css('height',h+'px')
	}
}
	
	
	
	
	$(hi).find('div.inner').click(function(){POWER.init(this)});
	
	
},
in_dev:function(key,cat){
	if(key){
		return true
	}else{
	valid=[4,7,10]	
		
	for(q=0;q<=2;q++) if(valid[q]==cat) return true;
	
		
	}
	
	
	return false;
	
},

rackitems:function(items,key,types){
	dataset=[]
	cats=NETWORK.categories()
	$.each(items, function(i,item){
		
		//type of device 
		type=Number($(item).attr('e_t'))
		
		cat=Number($(item).attr('e_c'))
		
		pos=Number($(item).attr('e_p'))
		//id 
		
		id=$(item).attr('id')
		
		c=cats[cat];
		
		
		if(key){
		name=$(item).find('div.name').text()	
		pid=Number(id.replace('rack_unit',''))
		}
		else{
			c='PDU(v)';
			pid=$(item).attr('did')
			name=$(item).attr('name')
		}
		
		if(POWER.in_dev(types,cat))
		dataset.push({'cat':c,'id':pid,'pos':pos,'name':name})
		
		
		
	});
	//console.log(dataset)
	return dataset;
	
},

rackdevices:function(win,select,pd,none,rack,types){
	

	
	if(none){
		$(select).html('<option value="0">Select device..</option>')}
	
	
	//console.log(cats)

	
	
	data=this.rackitems($('#rack'+rack+' div.rack_unit'),true,types)
	
	
	
	data.sort(function(a, b){
		 return b.pos-a.pos
		})
	
		data=data.concat(this.rackitems($('#rack'+rack+' div.pdu'),false,types))
		
	$.each(data,function(i,e){
		
		op=$('<option></option>').addClass('option_small').attr({'value':e.id,'pos':e.pos}).html(e.pos+'. '+e.name+' / '+e.cat)		
		
		if(pd==e.id){
			op.attr('selected','selected')
		}
		$(select).append(op)
		
	});
		
	
	
	
},


device_connect:function(sv,set){
	
	psel=$(POWER.win.data).find('select.portsel option:selected')
	dsel=$(POWER.win.data).find('select.devsel option:selected')
	
	name1=$(POWER.win.data).find('select.portsel')[0].selectedIndex+1
	
	
	//console.log($(this.conn_div).parent().parent())
	
	
	
	port=Number(psel.val())
	
	
	canc=Number(psel.attr('dis'))
	
	
	dev=dsel.val()
	
	if(port>0 && canc==0){
	port2=$(this.conn_div).parent().parent().attr('mid')
	name2=$(this.conn_div).parent().parent().attr('n')
	cab=0;
	if($(this.conn_div).attr('cab')){
		cab=$(this.conn_div).attr('cab');
	}
	
	//console.log(port,dev,mid)
	
	td=$(this.conn_div).parent()
	
	
		
		n=$(POWER.getwindata('dev')).attr('name')
	
		
	
if($('#rack_unit'+dev).length>0){
	n=$('#rack_unit'+dev+' div.name').text()
	
}else{
	n=$('#vertPDU'+dev+'').attr('name')
	
}
		
		
	
	
	td.html('<div class="socket2"><div class="icons"></div></div><div class="conname2">'+n+' ['+name1+']</div>')
	
	
	
	
	$.postJSON('basic/network/cable',{'cab':cab,'act':'connect','type':2,'name1':name1,'name2':name2,'port1':port,'dev2':POWER.getwindata('id'),'dev1':dev,'port2':port2,'tmpl':POWER.tmpl}, function(json) {
		
		
		
		
		ob=getObjects(POWER.json.cables, "id", cab)
		
		if(ob.length>0){
			$.each(POWER.json.cables,function(i,e){
				if(IP.equal(e.id,json.cable[0].id)){
					
					POWER.json.cables[i]=json.cable[0]
				}
				
			})	
		
		
		
		}else{
			
			POWER.json.cables.push(json.cable[0])
			
			
		}
		
		
		
		$(td).find('div.socket2').attr('cab',json.cable[0].id)
		
		
			
		POWER.action(td)
		
	
	
	});
	
	
	
	
	POWER.win.remove()
	WIN.show('#win_power') //set zindex back to 400
	//IP.updateVal(v,1,mid)	
	//update vlan port field 
	
	//IP.updateVlanTable();
	
	
	}else{
		if(canc==1){
			alert('selected socket is already connected!')
		}
		
	}
	
	

	
	/*	
	

    
	
	
	$.postJSON('basic/network/mac',{'act':'connect','val':v,'eid':NETWORK.eid,'mid':mid,'tmpl':NETWORK.tmpl}, function(json) {
		
		
		
	});
	
	*/
},	



conn_win:function(d){
	
	
	if(!POWER.tmpl){
	this.conn_div=d
	
	if(this.win) this.win.remove()
	this.win=new nocwin('Select device to connect','','conndevice');	

	this.win.zindex()
	

d=this.win.data

$(d).html('<fieldset style="margin-top:10px;"><legend></legend></fieldset>'+
		  '<fieldset><legend>RACK:</legend><select class="size_large2 racksel"></select></fieldset>'+
		  '<fieldset><legend>Device:</legend><select class="size_large2 devsel"></select></fieldset>'+
		  '<fieldset><legend>Socket:</legend><select class="size_large portsel"></select></fieldset>'+
		'<fieldset style="position:absolute;bottom:10px;right:10px;"><legend></legend>'+
		'<div style="float:left;margin-right:20px;"><a class="abutton el_cancel" href="#"><div class="inner">cancel</div></a></div>'+
		'<div style="float:left;margin-right:10px;"><a class="abutton el_set" href="#"><div class="inner">set</div></a></div></fieldset>'
)	
	
		
    NETWORK.racks($(d).find('select.racksel'),'',true)

    $(d).find('select.racksel').change(function(e){
    	
    	o=$(this).find('option:selected').val()
    	
    	//console.log(o)
    	if(Number($(POWER.conn_div).parent().parent().attr('type'))==1) { type=false;} else type=true;
    	POWER.rackdevices('power',$(this).parent().parent().find('select.devsel'),'',true,o,type)
    	
    	pp=$(this).parent().parent().find('select.portsel')
		
		$(pp).html('')
    	
    });
	
	$(d).find('select.devsel').change(function(e){
		
    	
		id=$(this).val()
		
		POWER.loadSockets('basic/power/socket/conn',$(POWER.conn_div).parent().parent().attr('type'),$(this).parent().parent(), id);
		
		
	});
    
    
	//
	
	
	//DEVICE.roomdevices($(d).find('select.devsel'),'',false)
	
	
	//close win
	$(this.win.div).find('div.win_close').click(function(){
		POWER.win.remove()
		WIN.show('#win_power') //set zindex back to 400
	});
    //add element
	$(this.win.div).find('a.el_set').click(function(){
		POWER.device_connect(this)
	});
    
	//cancel
	$(this.win.div).find('a.el_cancel').click(function(){
		POWER.win.remove()
		WIN.show('#win_power') //set zindex back to 400
	});	
	

}else{
	alert('Connection in Template is Not Available..')
}		
	
}	
		
		
		
}