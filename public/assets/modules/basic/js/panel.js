
var PANEL = {
    init: function(d) {
        
        if (Number($(d).attr('tmp')) == 1) {
            this.tmpl = true;
            this.prefix = 1;

        } else {
            this.tmpl = false;
            this.prefix = 0;
        }
        
        eid = Number($(d).parents('fieldset').attr('eid'))
        WIN.show('#win_panel')
        
        
        if (eid != NETWORK.eid) {
            NETWORK.el = $(d).parent().parent().parent()
            NETWORK.eid = eid
            NETWORK.tmpl = this.tmpl



        }
        
        this.load()


    },
            
    action: function(td) {
        
        if($(td).hasClass('int')) {
            $(td).find('.socket, .socket2').click(function() {
                PANEL.tmp_s=$(this)
                PANEL.int_con_win(this);
            })
        }else {
            $(td).find('.socket, .socket2').click(function() {
                //NETWORK.device_disconnect(this);
                PANEL.tmp_s=$(this)
                PANEL.ext_con_win(this);
            });
            
        }
    },
            
    isInCable: function(pin,type) {
        uu = 0


        if (!PANEL.cables) {
        } else {

            uu = PANEL.cables.length

            for (ci = 0; ci < uu; ci++) {

                
                
                if (IP.equal(this.cables[ci].dev2, DEVICE.id) && IP.equal(this.cables[ci].port2, pin) && this.cables[ci].type==type) {
                    return [true, this.cables[ci].dev1, this.cables[ci].port1, this.cables[ci].name1, this.cables[ci].id]
                }
                
                if (IP.equal(this.cables[ci].dev1, DEVICE.id) && IP.equal(this.cables[ci].port1, pin) && this.cables[ci].type==type) {
                    return [true, this.cables[ci].dev2, this.cables[ci].port2, this.cables[ci].name2, this.cables[ci].id]
                }


            }
        }

        return [false];

    },
            
    makeBucket : function(from, count, con, data) {
        
        buc = $('<div/>').addClass(this.bucketClass)
        $(buc).appendTo(con)
        
        var n=1
        $.each(NETWORK.o.data,function(i,e) {
            
            if (e.type == 1) {
                el = $('<div/>').addClass('pin').html(n).appendTo(buc);

                $(el).attr('mid', e.id)
                $('<div class="diode ld"></div>').appendTo(el)
                $('<div class="diode rd" style="margin-left:20px"></div>').appendTo(el)
                
                if (e.vlan) {
                    if (e.vlan == 1)
                        $(el).addClass('rj45')
                    if (e.vlan == 2)
                        $(el).addClass('fiberlc')
                }
                n++;
            }
            from++
        });

        return from;
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
        

        length=1;
        while(length<=this.ports){	
	
            length=this.makeBucket(length,bucket_count,cont,d)	
        }
        
        return cont
	
    },
            
    locationdata: function() {

        
        buildings = HEADER.navdata

        //building
        building_length = buildings.length
        html = []
        for (var i = 0; i < building_length; i++)
        {
            sel = ''
            html.push('<option ' + sel + ' value="' + buildings[i].id + '">' + buildings[i].name + '</option>')
        }

        $('#panel_loc_build').html(html.join(''))

        //floors
        floors = buildings[0].floors
        floors_length = floors.length
        html = []
        html.push('<option value="all">All</option>')
        for (var i = 0; i < floors_length; i++)
        {
            sel = ''
            html.push('<option ' + sel + ' value="' + floors[i].id + '">' + floors[i].name + '</option>')
        }

        $('#panel_loc_floor').html(html.join(''))

        
    },
    
    device_disconnect:function(socket){
	
        
        cab=$(socket).attr('cab')
        td=$(socket).parent()
	
        v=0
		
        td.html('<div class="socket"><div class="icons"></div></div><div class="conname">none</div>')
	
        $.postJSON('basic/network/cable/remove',{
            'act':'disconnect',
            'val':v,
            'eid':NETWORK.eid,
            'cab':cab,
            'tmpl':NETWORK.tmpl
        }, function(json) {
			
            $.each(PANEL.cables,function(i,e){
                if(e.id==json.id){
					
                    e.dev2=0
                    e.dev1=0
                    e.port1=0
                    e.port2=0
                }
				
            })
		
            $(td).find('div.socket2').removeAttr('cab')
			
            if(DEVICE.cat==2 || DEVICE.cat==3 || DEVICE.cat==5 ||DEVICE.cat==8){
				
                PANEL.cableData('#mac_ports'+PANEL.prefix)	
				
            }else{
				
					
                if(PANEL.tmpl){
                    PANEL.cableData('#ipp_ports1')
					
                }else{
                    PANEL.cableData('#ipp_ports0')
					
                }	
				
            }
            PANEL.action(td)	
			
	
        });
		
		
        PANEL.poptmp.win.remove()
        WIN.show('#win_panel') //set zindex back to 400
		
    //IP.updateVal(0,1,mid)	
		
    //update vlan port field 
    //IP.updateVlanTable();
    
		
    },
    
    device_connect:function(sv, pt){
        
        psel=$('#'+sv).find('.win_data').find('select.portsel option:selected')
        dsel=$('#'+sv).find('.win_data').find('select.devsel option:selected')
	
        name1=$('#'+sv).find('.win_data').find('select.portsel')[0].selectedIndex+1
        
        port=Number(psel.val())
        canc=Number(psel.attr('dis'))
        dev=dsel.val()
        
        if(port>0 && canc==0){
            port2=$(PANEL.tmp_s).parent().attr('mid')
            name2=$(PANEL.tmp_s).parent().attr('n')
            cab=0;
            if($(PANEL.tmp_s).attr('cab'))
                cab=$(PANEL.tmp_s).attr('cab')

            td=$(PANEL.tmp_s).parent()
		
            n=$('#rack_unit'+dev+' div.name').text()

            if(pt==4) {
                $.postJSON('basic/device/get',{
                    'did':dev
                },function(json) {
                    n=json.hostname;
                    td.html('<div class="socket2"><div class="icons"></div></div><div class="conname2">'+n+' ['+name1+']</div>')
                });
            }
            else
                td.html('<div class="socket2"><div class="icons"></div></div><div class="conname2">'+n+' ['+name1+']</div>')	
            
            $.postJSON('basic/network/cable',{
                'cab':cab,
                'act':'connect',
                'type':pt,
                'name1':name1,
                'name2':name2,
                'port1':port,
                'dev2':DEVICE.id,
                'dev1':dev,
                'port2':port2,
                'tmpl':NETWORK.tmpl
            }, function(json) {
		
                ob=getObjects(PANEL.cables, "id", cab)
                
		
                if(ob.length>0){
                    $.each(PANEL.cables,function(i,e){
                        if(PANEL.equal(e.id,json.cable[0].id)){
						
                            PANEL.cables[i]=json.cable[0]
                        }
					
                    })
			
                //IP.cables[oo]=json.cable[0];
				
                }else{
				
                    PANEL.cables.push(json.cable[0])	
                }
                
                
                $(td).find('div.socket2').attr('cab',json.cable[0].id)
			
                if(DEVICE.cat==2 || DEVICE.cat==3 || DEVICE.cat==5 || DEVICE.cat==8){
				
                    PANEL.cableData('#mac_ports'+PANEL.prefix)	
				
                }else{
                    
                    
                    if(PANEL.tmpl){
                        PANEL.cableData('#ipp_ports1')
					
                    }else{
                        PANEL.cableData('#ipp_ports0')
					
                    }	
				
                }
			
                PANEL.action(td)
            });	
		
            PANEL.poptmp.win.remove()
            WIN.show('#win_panel') //set zindex back to 400

        //IP.updateVal(v,1,mid)	
        //update vlan port field 
		
        //IP.updateVlanTable();
		
		
        }else{
            if(canc==1){
                alert('selected port is already connected!')
            }
		
        }
	
		
       

    },	
	 
    textMacField:function(){
	
        //append to #vlan_s
        ct=$('#vlan_s'+this.prefix+' div.text_ipfield')
        ct.html('')
    },
    
    connector_type:function(){
        if(DEVICE.cat==8)
            return 'fiberlc';
        else
            return 'rj45';
    },
    
    large_port_table: function(json, els, diode, vlan) {

        

        //empty table
        $(els).html('')

        //make ports
        this.makeTable(json.length, json.data, $(els));
        
        //get all ports
        ports = $(els + ' div.pin')
        
        $.each(ports, function(i, e) {

            var _mid = $(e).attr('mid')
            
            m = $('<div/>').addClass('diode').appendTo(e)

            //add mac and connected device information
            $(e).attr({
                'mac': NETWORK.o.data[i].mac_addr,
                'cd': NETWORK.o.data[i].conn_dev
            })

            //set mac class for connector
            if (NETWORK.o.data[i].mac_addr != '') {
                $(e).removeClass(ct).addClass(ct + '-mac')

            }
            
            if (NETWORK.o.data[i].id) {
                $(e).attr('mid', NETWORK.o.data[i].id)
            }

            //diode light
            if (NETWORK.o.data[i].conn_dev > 0) {
                $(m).addClass('isConnected');

            }


        });


        if (!vlan)
            this.textMacField()

        
    },
            
    sort_type: function(data, type) {
        m = Array();
        a = 1;
        $.each(data, function(i, e) {

            if (e.port.type == type)
            {
                e.port.n = a
                m.push(e)
                a++;
            }


        })

        return m
    },
               
    makePANELField:function(field, div){
        

        this.cables=field.cables
	
        this.tmpl=false;
        this.prefix=0;
        if($(div).attr('temp')=='ok'){
            this.tmpl=true;	
	
            this.prefix=1;
        }
        
        NETWORK.o=field
	
        $(div).html('')
        field1=$('<fieldset/>').attr('id','mac_ports'+this.prefix).appendTo(div)
        vlan=$('<div>').attr('id','vlan_s'+this.prefix).appendTo(field1)
        
        cont=this.makeTable(field.data.length,field.data,vlan);
       
        el=$('<div>').appendTo(field1)
        f=field

        tmp=0;  
        if(PANEL.tmpl) tmp=1;	
        fl=$('<div/>').addClass('buttonHolder').appendTo(div)
        hi=$('<div/>').css({
            'float':'left',
            'clear':'both',
            'margin-bottom':'15px',
            'margin-left':'10px',
            'margin-top':'0px'
        }).html('<a href="#" class="abutton toPANEL"><div tmp="'+tmp+'" class="inner portedit">edit ports</div></a>').appendTo(div)

        $(hi).find('div.portedit').click(function(){
            PANEL.init(this)
        });
        
        this.cableData('#mac_ports'+this.prefix)

    },
         
    equal:function(a,b){
        if(Number(a)==Number(b)) return true;
        return false;
	
    },
         
    cableData:function(div){

        

        var _split = PANEL.split(NETWORK.o.data)
        $.each(_split,function(i, e){
            
            switch (Number(e.type)){

                case 1:
                    mm = PANEL.isInCable(e.id, 1);
                    if (mm[0]) {

                        pin = $(div).find('div.pin[mid="' + e.id + '"]')
                        $(pin).find('div.rd').addClass('isConnected')
                        $(pin).attr('cd', mm[1])
                        $(pin).attr('cp', mm[3])
                    }
                    break;
                    
                case 3:
                    mm = PANEL.isInCable(e.id, 4);
                    if (mm[0]) {
                        
                        pin = $(div).find('div.pin[mid="' + _split[i+1].id + '"]')
                        $(pin).find('div.ld').addClass('isConnected')
                    }
                    break;
                    
            }
        })
        
    },
    
    split: function(data) {

        var _split = []
        var _ext = 0
        var _int = 1

        $.each(data, function(i, e) {

            if (e.type == 1) {
                _split[_int] = e;
                _int += 2
            }
            if (e.type == 3) {
                _split[_ext] = e;
                _ext += 2;
            }
        });

        return _split;
    },
    
    makePANELTable:function(field,el){
    
       
    
        checkCableSide = function(mid, cab) {
     
            // check on what side of cable is port
            $.each(PANEL.cables, function(i, cable) {
                if (cable.id==cab)
                    if (cable.port1==mid)
                        n=cable.devname2
                    else
                        n=cable.devname1
            });
            
            return n
        }
    
        if(PANEL.json.data.length>0){
	
            table=$('<table/>').attr(field.attr).addClass(field.class)
            
            newTR=$('<tr></tr>')
            if(field.trclass){
                newTR.addClass(field.trclass)	
            }
	
            $.each(field.tr, function(i,item){		//tabs
                td=$('<td/>').attr(item.attr).html(item.name).appendTo(newTR)	
            });
            
            $(table).append(newTR)
            newTR=''
            
            var row=0
            var split = PANEL.split(PANEL.json.data)
            
            $.each(split, function(i,e){
                
                // start row
                if((i+1)%2!=0){
                    
                    newTR=$('<tr class="row_color"></tr>').attr({
                        'n':i+1
                    })
                
                    td=$('<td/>').html(row+1+'.').appendTo(newTR)
                    td1=$('<td/>').attr('mid',e.id).attr('n',row+1).addClass('ext').html('<div class="socket"><div class="icons"></div></div><div class="conname">none</div>').appendTo(newTR)
                    
                    m=getObjects(PANEL.json.data, 'n', i+1);
                    if(m.length>0){
                        /*
                         * panel->panel
                         * 
                         */
                        s=PANEL.isInCable(e.id,4)
                        if(s[0]){
                            
                            
                            
                            n=checkCableSide(e.id,s[4])
                           
                            $(td1).html('<div class="socket2"><div class="icons"></div></div><div class="conname2">'+ n +' ['+s[3]+']</div>')
                            $(td1).find('div.socket2').attr('cab',s[4])
                        }
                    }
                    
                    PANEL.action(td1)
                    $(table).append(newTR)
                    row++;
                }
                //end row
                else {
                    
                    td2 = $('<td/>').attr('mid',e.id).attr('n',row+1).addClass('int').html('<div class="socket"><div class="icons"></div></div><div class="conname">none</div>').appendTo(newTR)
                    td3 = $('<td/>').attr('mid',e.id).html('<div><select m="3" class="conn_type size_small2"><option value="0">-</option><option value="1">RJ45</option><option value="2">Fiber LC</option></select></div>').appendTo(newTR)	
                    
                    switch (Number(e.vlan)) {
                        case 0:
                            td3.find('select').val(0)
                            break;
                        case 1:
                            td3.find('select').val(1)
                            break;
                        case 2:
                            td3.find('select').val(2)
                            break;
                    }
                    
                    m=getObjects(PANEL.json.data, 'n', i+1);
                    if(m.length>0){
		
                        /*
                         * panel->panel
                         * 
                         */
                        s=PANEL.isInCable(e.id,1)
                        if(s[0]){

                            n=$('#rack_unit'+s[1]+' div.name').text()
                            $(td2).html('<div class="socket2"><div class="icons"></div></div><div class="conname2">'+n+' ['+s[3]+']</div>')
                            $(td2).find('div.socket2').attr('cab',s[4])
                        }
                    }
                    PANEL.action(td2)
                    $(td3).find('select').change(function(e) {  

                        //ip_id=getparentAttr(this,'ip')
                        mid = $(this).parents('td').attr('mid')

                        val = $(this).val()
                        m = $(this).attr('m')

                        NETWORK.loading(true)

                         $.postJSON('basic/network/mac/set',{
                            'eid':NETWORK.eid,
                            'm':m,
                            'val':val,
                            'mid':mid,
                            'tmpl':NETWORK.tmpl
                         }, function(json) {

                            PANEL.updateVal(val,m,mid)
                            NETWORK.loading(false)

                         });
                    });
                    
                    $(table).append(newTR)
                    
                }
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
	
        }else{
            $('<div/>').addClass('info').html(NETWORK.message['noport']).appendTo(el)
	
	
        }
    },	

    load: function() {
    
   
    
        $('#win_panel div.win_mask').show()

        this.container = $('#win_panel div.win_data')

        this.container.html('')
        this.winicon = $('#win_panel div.win_icon')


        $(this.winicon).removeClass('default').addClass('imageLoader')

        this.container.append($('<div/>').addClass('dataLoad').html('loading data..'))


        WIN.parseData('network/get', 'win_panel', this.container, 1, true, {
            'eid': NETWORK.eid,
            'tmpl': NETWORK.tmpl
        });

    },
            
    updateVal: function(val, m, mid) {
            
            $.each($('div.pin'),function(i,pin) {
                
                var _mid=Number($(pin).attr('mid'))
                if (_mid==mid) {
                    
                    // delete type
                    $(pin).removeClass('fiberlc').removeClass('rj45')

                    // set new one
                    switch (Number(val)) {
                        case 1:
                            $(pin).addClass('rj45');
                            break;
                        case 2:
                            $(pin).addClass('fiberlc');
                            break;
                        default:
                            break;
                    }
                }
            })
    },
    
    loadFinish: function() {

       

        //PANEL.cables = WIN.json.cables
        //IP.data=WIN.json.data
        portactive = false

        //if(this.tmpl) IP.cables=false; 

        if (portactive) {
            WIN.activateTab('#win_panel', 2)
        }
        

        NETWORK.o.data = WIN.json.data
        NETWORK.o.ips = WIN.json.ips
        NETWORK.o.cables = WIN.json.cables

        
        //PANEL.large_port_table(NETWORK.o, '#vlan_s' + this.prefix, true, false)
        $('#vlan_s0').html('')
        cont=this.makeTable(NETWORK.o.data.length, NETWORK.o.data.data, $('#vlan_s0'));

        if (this.prefix == 0) {
            PANEL.cableData('#mac_ports'+this.prefix)
        }
        //IP.makeIPField(o,NETWORK.el);

        if (WIN.json.data.length > 0) {
            portactive = true
        }


        PANEL.makePANELField(NETWORK.o, NETWORK.el);

        $('#win_panel div.win_mask').hide()

        $('#win_panel_layer1 select').change(function(e) {


            act = $(this).parent().parent().attr('act')
            if (act) {

                val = $(this).val()
                if (act == 'act3' || act == 'act4' || act == 'act1' || act == 'act2' || act == 'act6') {

                    if (val == '') {
                        val = 0;
                        $(this).val(0)
                    }
                }
                NETWORK.loading(true)

                WIN.parseData('network/set', 'win_panel', PANEL.container, 1, true, {
                    'eid': NETWORK.eid,
                    'act': act,
                    'val': val*2,
                    'tmpl': NETWORK.tmpl
                });


            }


        });

        $(this.winicon).addClass('default').removeClass('imageLoader')
        NETWORK.loading(false)

    },
            
    ext_selecting: function(t, init, setVal, port, cab) {

        selbox = ['build', 'floor', 'room', 'rack', 'patch', 'port']

        setEmptyValue = function(from) {

            $.each(selbox, function(i, e) {
                if (i >= from)
                    $('#panel_loc_' + e).html('<option>-</option>')
            });

        }

        updateBuilding = function(data, setVal) {
            
            html = []

            dataLength = data.length
            $.each(data, function(i, e) {

                html.push('<option value="' + e.id + '">' + e.name + '</option>')
            });
            $('#panel_loc_floor').html(html.join(''))
            
            if(typeof setVal=='undefined')
                $('#panel_loc_floor').val(setVal)
            else
                setEmptyValue(2)
            
            PANEL.poptmp.loading(false)
        }

        updateFloor = function(data, setVal) {
            html = []

            dataLength = data.length
            $.each(data, function(i, e) {

                html.push('<option value="' + e.id + '">' + e.name + '</option>')
            });

            $('#panel_loc_room').html(html.join(''))

            if(typeof setVal !== 'undefined')
                $('#panel_loc_room').val(setVal)
            else
                setEmptyValue(3)
                
            PANEL.poptmp.loading(false)
        }

        updateRoom = function(data, setVal) {
            
            html = []

            dataLength = data.length
            $.each(data, function(i, e) {

                html.push('<option value="' + e.id + '">' + e.name + '</option>')
            });

            $('#panel_loc_rack').html(html.join(''))

            if(typeof setVal !== 'undefined') 
                $('#panel_loc_rack').val(setVal)
            else
                setEmptyValue(4)
                
            PANEL.poptmp.loading(false)
        }
        
        updateRack = function(data, setVal) {

            html = []

            dataLength = data.length
            $.each(data, function(i, e) {

                html.push('<option value="' + e.id + '">' + e.name + '</option>')
            });

            $('#panel_loc_patch').html(html.join(''))

            if(typeof setVal !== 'undefined')
                $('#panel_loc_patch').val(setVal)
            else
                setEmptyValue(5)
            
            PANEL.poptmp.loading(false)  
        }

        updatePatch = function(data, setVal) {

            html = []

            dataLength = data.length
            $.each(data, function(i, e) {

                html.push('<option value="' + e.id + '">' + e.name + '</option>')
            });

            $('#panel_loc_port').html(html.join(''))

            if(typeof setVal !== 'undefined')
                $('#panel_loc_port').val(setVal)
            else
                setEmptyValue(6)
            
            PANEL.poptmp.loading(false)
        }
        
      
        type = t.replace('panel_loc_', '')
        if (typeof init !== 'undefined')
            id = init
        else
            id = $('#' + t).val()


        if (id == 'all') {

            if (type == 'build')
                m = 1;
            if (type == 'floor')
                m = 2;
            if (type == 'room')
                m = 3;
            if (type == 'rack')
                m = 4;
            if (type == 'patch')
                m = 5;

            if (typeof setVal == 'undefined')
                setEmptyValue(m)
        } else {

            if (type == 'panel_ext') {


                $.postJSON('basic/location/get', {
                    'type': 'panel_ext',
                    'id': id,
                    'cab': cab
                }, function(json) {
                    
                    updateBuilding(json.data[0].floors, setVal.floor)
                    
                    updateFloor(json.data[0].rooms, setVal.room)
                    
                    updateRoom(json.data[0].racks, setVal.rack)
                    
                    updateRack(json.data[0].devices, setVal.device)
                });
            }
            else {

                $.postJSON('basic/location/get', {
                    'type': type,
                    'id': id

                }, function(data) {

                    switch (data.type) {
                        case 'build':
                            PANEL.poptmp.loading(true)
                            updateBuilding(data.data, setVal)
                            break;
                        case 'floor':
                            PANEL.poptmp.loading(true)
                            updateFloor(data.data, setVal)
                            break;
                        case 'room':
                            PANEL.poptmp.loading(true)
                            updateRoom(data.data, setVal)
                            break;
                        case 'rack':
                            PANEL.poptmp.loading(true)
                            updateRack(data.data, setVal)
                            break;
                        case 'patch':
                            PANEL.poptmp.win.loading(true)
                           
                            POWER.loadSockets('basic/device/ports', 3, $('#pop_ext_conn'),id, port)
                            break;
                    }

                });
            }
        }
    },
   
    ext_con_win: function(div) {
    
        function sortdata(div) {

            var cab = $(div).attr('cab')
            var mid = $(div).parent().attr('mid')

            ob = getObjects(PANEL.cables, "id", cab)
            if (DEVICE.id == ob[0].dev1) {
                dev = ob[0].dev2;
                port = ob[0].port2
            } else {
                dev = ob[0].dev1;
                port = ob[0].port1
            }

            if ($('#rack_unit' + dev).length > 0) {
                n = $('#rack_unit' + dev)

            } else
                n = $('#vertPDU' + dev)

            $.postJSON('basic/device/get', {
                'did': dev
            }, function(json) {

                PANEL.ext_selecting('panel_loc_panel_ext', mid,
                        {
                            'build': json.build,
                            'floor': json.floor,
                            'room': json.room,
                            'rack': json.rack,
                            'device': json.id
                        }, 0, cab)
                        
                PANEL.ext_selecting('panel_loc_patch', dev, 1, port, cab)

            });

        }
        
        $(d).addClass('selected')

        if (!PANEL.tmpl) {
            this.conn_div = d

            var pop = new POPUP.init(
                    'Select patch panel port', //popup title
                    'ext_conn', //popup name
                    'win_panel', //parent window
                    {
                        w: 350, //width 
                        h: 430, //height
                        wdclass: 'orange2'
                    })
            
            var args = {
                save: false, //save button
                rem: false, //remove button
                cancel: true, //cancel 
                add: false, //add button
                set: true, //set button
            }
            
            PANEL.poptmp=pop
            
            if($(div).hasClass('socket2'))
                args.disconnect=true
            
            pop.data(
                    args,
                    '<div class="win_data" style="height:400px;">'
                    + '<div class="win_layer win_visible">'
                    + '<div class="datadiv" style="width:260px;">'
                    + '<fieldset><legend>Building:</legend><select id="panel_loc_build" style="width:320px;"><option>-</option></select></fieldset>'
                    + '<fieldset><legend>Floor:</legend><select id="panel_loc_floor" style="width:320px;"><option>-</option></select></fieldset>'
                    + '<fieldset><legend>Room:</legend><select id="panel_loc_room" style="width:320px;"><option>-</option></select></fieldset>'
                    + '<fieldset><legend>Rack:</legend><select id="panel_loc_rack" style="width:220px;"><option>-</option></select></fieldset>'
                    + '<fieldset><legend>Patch Panel:</legend><select id="panel_loc_patch" class="size_large2 devsel"><option>-</option></select></fieldset>'
                    + '<fieldset><legend>Port:</legend><select id="panel_loc_port" class="size_large portsel"><option>-</option></select></fieldset>'
                    + '<fieldset style="position:absolute;bottom:10px;right:10px;"><legend></legend>'
                    + '</div>'
                    + '</div>'
                    + '</div>'
                    );

            this.locationdata()
            
            // load socket data
            if($(div).hasClass('socket2')) {
                pop.loading(true)
                sortdata(div)
            }
            
            pop.actionSet('win_panel', ['close', 'cancel'], function() {
                pop.win.remove()
            });

            pop.actionSet('windows', ['set'], function() {
                
                //pop.loading(true)
                PANEL.device_connect('pop_ext_conn',4)
            });
            
            pop.actionSet('windows', ['disconnect'], function() {
                pop.loading(true)
                 
                PANEL.device_disconnect(div)

                pop.loading(false)
            });

            pop.onchange(
                    function(e, d) {
                        PANEL.ext_selecting($(d).attr('id'))
                    });

        } else {
            alert('Connection in Template is Not Available..')
        }

    },
    
    int_selecting: function(t,init,setVal,port,cab) {

        selbox = ['room', 'rack2', 'device', 'port']

        setEmptyValue = function(from) {

            $.each(selbox, function(i, e) {
                if (i >= from)
                    $('#panel_loc_' + e).html('<option>-</option>')
            });

        }
        
        updateRoom = function(data,setVal) {

            html = []

            dataLength = data.length
            $.each(data, function(i, e) {

                html.push('<option value="' + e.id + '">' + e.name + '</option>')
            });

            $('#panel_loc_rack2').html(html.join(''))
           
            if(typeof setVal=='undefined') 
                setEmptyValue(2)
            
            if(typeof setVal!=='undefined')
                $('#panel_loc_rack2').val(setVal)

        }

        updateRack = function(data,setVal) {

            html = []

            dataLength = data.length
            $.each(data, function(i, e) {

                html.push('<option value="' + e.id + '">' + e.name + '</option>')
            });

            $('#panel_loc_device').html(html.join(''))
            
            if(typeof setVal=='undefined') 
                setEmptyValue(3)
            
            if(typeof setVal!=='undefined') 
                $('#panel_loc_device').val(setVal)
        }
        
        type = t.replace('panel_loc_', '')
        if(typeof init !== 'undefined')
            id = init
        else
            id = $('#' + t).val()
        

        if (id == 'all') {
            if (type == 'room')
                m = 4;
            if (type == 'rack2')
                m = 5;
            
            setEmptyValue(m)
        } 
        else {
            
            if(type=='panel_int'){

                $.postJSON('basic/location/get', {           
                'type': 'panel_int',              
                'id': id,
                'cab': cab
                }, function(json) {
                    
                    updateRoom(json.data[0].racks,setVal.rack)
                    updateRack(json.data[0].devices,setVal.device)
                });
                
            }
            else {
                    
                $.postJSON('basic/location/get', {
                    'type': type,
                    'id': id

                }
                ,function(data) {

                    switch (data.type) {
                        case 'room':
                            updateRoom(data.data,setVal)
                            break;
                        case 'rack2':
                            updateRack(data.data,setVal)
                            break;
                        case 'device':
                            PANEL.poptmp.win.loading(true)
                           
                            POWER.loadSockets('basic/device/ports', 1, $('#pop_int_conn'),id, port)
                            break;
                    }

                });
            }
        }     

    },
    
    
    int_con_win: function(div) {
            
        function sortdata(div) {

            var cab = $(div).attr('cab')
            var mid = $(div).parent().attr('mid')

            ob = getObjects(PANEL.cables, "id", cab)
            if (DEVICE.id == ob[0].dev1) {
                dev = ob[0].dev2
                port = ob[0].port2;
            } else {
                dev = ob[0].dev1
                port = ob[0].port1;
            }

            if ($('#rack_unit' + dev).length > 0) {
                n = $('#rack_unit' + dev)

            } else
                n = $('#vertPDU' + dev)

            $.postJSON('basic/device/get', {
                'did': dev
            }, function(json) {

                PANEL.int_selecting('panel_loc_panel_int', mid,
                        {
                            'rack': json.rack,
                            'device': json.id
                        }, 0, cab)

                PANEL.int_selecting('panel_loc_device', dev, 1, port, cab)
            });

        }
        
        var soc=$(div).hasClass('socket2')
        
        $(div).addClass('selected')

        if (!PANEL.tmpl) {
            this.conn_div = div

            var pop = new POPUP.init(
                    'Select device to connect', //popup title
                    'int_conn', //popup name
                    'win_panel', //parent window
                    {
                        w: 350, //width 
                        h: 270, //height
                        wdclass: 'orange2'
                    })
                    
            var args={
                        save: false, //save button
                        rem: false, //remove button
                        cancel: true, //cancel 
                        add: false,      //add
                        set: true, // set 
                    } 
            
            PANEL.poptmp=pop   
            if(soc)
                args.disconnect=true
            
            pop.data(
                    args,
                    '<div class="win_data" style="height:400px;">'
                    + '<div class="win_layer win_visible">'
                    + '<div class="datadiv" style="width:260px;">'
                    + '<fieldset><legend>Rack:</legend><select id="panel_loc_rack2" class="size_large"></select></fieldset>'
                    + '<fieldset><legend>Device:</legend><select id="panel_loc_device" class="size_large devsel"></select></fieldset>'
                    + '<fieldset><legend>Port:</legend><select id="panel_loc_port" class="size_large portsel"></select></fieldset>'
                    + '<fieldset style="position:absolute;bottom:10px;right:10px;"><legend></legend>'
                    + '</div>'
                    + '</div>'
                    );
            
            var mid = $(div).parent().attr('mid')
            
            // load socket data
            if(soc) {
                sortdata(div)
                PANEL.poptmp.loading(true)
            }
            else
                PANEL.int_selecting('panel_loc_room', RACK.roomId,1)

            pop.actionSet('win_panel', ['close', 'cancel'], function() {
                pop.win.remove()
            });
            
            pop.actionSet('windows', ['set'], function() {

                pop.loading(true)
                PANEL.device_connect('pop_int_conn',1)
            });
            
            pop.actionSet('windows', ['disconnect'], function() {

                pop.loading(true)
                PANEL.device_disconnect(div)

                pop.loading(false)
            });

            pop.onchange(
                function(e, d) {
                    PANEL.int_selecting($(d).attr('id'))
            });
        } else {
            alert('Connection in Template is Not Available..')
        }

    }

}