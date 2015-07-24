var IPM_layers={
    
    search:function(d){
        n=Number($(d).attr('n'))
        hosts=IPAM_object.hosts() //2^4
        
         
        $.getJSON('basic/search',{
            'key':hosts[n]
                        
                
        }
        , function(data) {
            $.each(data,function(i,e){
                     
                if(e.type=='IPv4' && e.items.length>0)
                {
                    
                    if(!SEARCH.seeking){
                        //console.log(e.items[0])
                        SEARCH.data=e.items[0]
                        SEARCH.data.t=6
                        SEARCH.seeking=true;
                        SEARCH.seekstat();
                    
                    }
                }
                       
                    
            })
                        
        });    
        
    },
    __construct:function(){
        
        if(!this.set){
            
            this.set=true
        
            this.device_layer={
            
            
                init:function(type){
                    if(!this.set){
                        this.set=true
        
                        $('#win_ipm_layer3 div.ipm_device_menu div.right').click(function(){
                            if(!$(this).hasClass('rdis'))
                                IPM_layers.device_layer.seek('R') 
                        });
                        $('#win_ipm_layer3 div.ipm_device_menu div.left').click(function(){
                            if(!$(this).hasClass('ldis'))
                                IPM_layers.device_layer.seek('L') 
                        });
        
        
                    }              
                    
                    IPM_layers.devfrom=0

                    this.selector(type)  
                
                },
            
                seek:function(m){
                
                
                    if(m=='R'){
                        IPM_layers.devfrom++;
                    
                    }else{
                        IPM_layers.devfrom--;
                    }
                
                    this.selector()
                
                },
                prepareFieldData:function(dev){
                
                    return {
                        'field':'Ports',
                        'eid':'0',
                        'static':'1',
                        'value':'',
                        'struc':'',
                        'element':'none',
                        'class':'',
                        'items':null,
                        'id':dev.id     
                    
                    }
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

                    //ct=$('<div/>').addClass('text_ipfield').appendTo(div)	

                    if(this.ports==0){
                        $(cont).css('height','35px')
                    }

                    //this.textIpField(ct,d)


                    length=1;
                    while(length<=this.ports){	
	
                        length=this.makeBucket(length,bucket_count,cont,d)	
                    }

	
	
                    return cont
	
                },	    
            
                deviceField:function(dev){
              
            
                    field=dev
	
	
                    f=$('<fieldset/>').addClass('ipm_device').appendTo($(IPM_layers.device_layer.cont))
                    $('<legend/>').html('<a href="#">'+dev.name+'</a>').appendTo(f)
               
                    el=$('<div/>').addClass('element').appendTo(f).css({
             
                        })
                
                    ct=$('<div/>').addClass('text_ipfield').appendTo(f)	
	
                    $(el).html('')
                    statIP=IP.sort_type(field.data, 1);


                    $.each(statIP,function(i,e){
	
                        e.port.ipv6==''?ipv6='':ipv6='<span>IPv6:</span>'+e.port.ipv6;
	
                        e.port.ipv4==''?ip='undefined':ip=e.port.ipv4;
	
		
                        d=$('<div/>').addClass('ip_data ip_data_ipm').appendTo(ct)
                        d.html('<div class="num">'+e.port.n+'.</div>'+
                            '<div class="data"><div class="ipv4"><span>IP:</span>'+ip+'</div><div class="ipv6">'+
                            ipv6+'</div></div>')
	
	
                    //if(e.port.ipv4)
	
	
                    })


                    port_s=statIP
	
                    px=11;
	
	
                    cont=this.makeTable(statIP.length,statIP,el);

               

                    $(cont).attr('id','ipp_ports'+px)
	
	
	
                    virtIP=IP.sort_type(field.data, 2);
	
                    port_s=port_s.concat(virtIP);
	
                    if(virtIP.length>0){

        
                        $.each(virtIP,function(i,e){
	
                            e.port.ipv6==''?ipv6='':ipv6='<span>IPv6:</span>'+e.port.ipv6;
	
                            e.port.ipv4==''?ip='undefined':ip=e.port.ipv4;
	
		
                            d=$('<div/>').addClass('ip_data ip_data_ipm').appendTo(ct)
                            d.html('<div class="num">'+e.port.n+'.</div>'+
                                '<div class="data"><div class="ipv4"><span>VIRTUAL:</span>'+ip+'</div><div class="ipv6">'+
                                ipv6+'</div></div>')
	
	
                        //if(e.port.ipv4)
	
	
                        })
        
	
                    //IP.makeTable(virtIP.length,virtIP,el);
        
                    }
	
                    //vps
                    if(dev.vps.length>0)
                    {
                        console.log(dev.vps)
                        $.each(dev.vps,function(i,e){
              
              d=$('<div/>').addClass('ip_data ip_data_ipm').appendTo(ct)
                            d.html('<div class="data"><b>VPS:</b> <span style="color:#1e90ff;">'+e.name+'</span>.</div>')
              
              $.each(e.ports,function(ii,ee){
                            d=$('<div/>').addClass('ip_data ip_data_ipm').appendTo(ct)
                            d.html('<div class="num">'+(ii+1)+'.</div>'+
                                '<div class="data"><div class="ipv4"><span>VIRTUAL:</span>'+ee.ipv4+'</div></div>')
              });
              
               
                        });
           
            
           
           
                    }
	
	
	
	
	
     
	
                },
                render:function(data){
                
                    //IPM_layers.history_layer.render(data.history)
                            
                    $('#win_ipm_layer3 div.ipm_device_menu div.left').addClass('ldis')
                    if(data.from>0){
                        $('#win_ipm_layer3 div.ipm_device_menu div.left').removeClass('ldis')
                                
                    }
                            
                    z=data.from*data.limit+data.limit
                            
                    $('#win_ipm_layer3 div.ipm_device_menu div.right').addClass('rdis')
                    if(z<data.total){
                                
                        $('#win_ipm_layer3 div.ipm_device_menu div.right').removeClass('rdis')
                    }
                            
                    f=data.from*data.limit+1
                    t=f+data.limit
                    if(t>=data.total) t=data.total
                    if(f>t) f=t;
                            
                    ht=f+' to '+t+' from '+data.total
                    if(t==0) ht='0 devices'
                            
                    $('#win_ipm_layer3 div.ipm_device_menu div.semafor').html(ht)
                            
              
                    IPM_layers.device_layer.data={
                        'from':data.from,
                        'total':data.total,
                        'limit':data.limit
                    }
                                 
                    IPM_layers.device_layer.cont=$('#win_ipm_layer3 div.ipm_devices')[0]
                    $(IPM_layers.device_layer.cont).html('')
                                 
                    $.each(data.data,function(i,e){
                        IPM_layers.device_layer.deviceField(e)
                                
                    })        
                                    
                
                },
                selector:function(t){
           
                    
                    this.id=IPM_layers.id;
                    this.type=IPM_layers.type;
             
           
                    IPM.loading(true)
           
                    $('#win_ipm_layer52').hide()
                    $('#win_ipm_layer51').show()
                    $('#win_ipm_layer51').html(
                        '<div class="table_list">'+
                        '<table cellspacing="0" cellpadding="0" id="ipm_history_list" width="100%" ></table> '+
                        '</div>')
            
                    $.postJSON('ipm/device/get',{
                        'id':IPM_layers.id,
                        'type':IPM_layers.type,
                        'from':IPM_layers.devfrom
                
                    }
                    , function(data) {
                 
                        IPM_layers.device_layer.render(data)
              
              
                        IPM.loading(false)
                    });    
           
           
         
                //}
            
                }
            
            }
        
            this.overview_layer={
                init:function(){
                    if(!this.set){
                
                    }
            
                }
            }
        
            this.history_layer={
                init:function(type){
                    if(!this.set){
                        this.set=true
              
        
                    }
                    this.selector(type)  
                },   
        
                selector:function(t){
           
                    /*
                    if(IPM_layers.type==0){
                        if(!this.temp){
                            $('#win_ipm_layer51').hide()
                            $('#win_ipm_layer52').show()
                        }
                    }else{
                        */
                    //if(this.id!=IPM_layers.id || this.type!=IPM_layers.type){
                    this.id=IPM_layers.id;
                    this.type=IPM_layers.type;
                    IPM_layers.location_layer.fromTable=false
                    $('ul.ipm_edit_menu li.lrem').hide()
           
           
                    IPM.loading(true)
           
                    $('#win_ipm_layer52').hide()
                    $('#win_ipm_layer51').show()
                    $('#win_ipm_layer51').html(
                        '<div class="table_list">'+
                        '<table cellspacing="0" cellpadding="0" id="ipm_history_list" width="100%" ></table> '+
                        '</div>')
            
                    $.postJSON('ipm/history',{
                        'id':IPM_layers.id,
                        'type':IPM_layers.type
                
                    }
                    , function(data) {
                 
                        IPM_layers.history_layer.render(data.history)
              
                        IPM.loading(false)
                    });    
           
           
         
                //}
            
                },
                render:function(data){
                    valset=function(n){
                        if (n!=null) return n;
                        return '-';
                
                
                    }
            
                    parseDate=function(stamp){
                    
                        var d = new Date(stamp*1000);
                
                        return d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()
                    }
            
                    parseNode=function(n){
               
                        t=n.type
               
                        d=[]
                        $.each(n,function(ii,ee){
                            if(ee.device!=undefined){
                                stat=(ee.device.id>0)?'Taken':'Free'
                                if(ee.device.erased==1) stat='Subnet Erased'
                    
                    
                   
                                d.push([
                        
                                    valset(ee.ip),
                                    ee.date,
                                    valset(ee.device.name),
                                    valset(stat)
                        
                    
                                    ])
                            }
                    
                    
                        });
                
                        return d;
                    }
            
                    //prepare data for table
                    tdata=parseNode(data)
             
             
            
                    oTable=$('#ipm_history_list').dataTable( {
                        "bDestroy": true,
                        "aaSorting": [[ 1, "desc" ]],
                        "oLanguage": {
                            "oPaginate": {
                                "sNext": "",
                                "sPrevious": ""
                            }
                        },
                        "iDisplayLength": 17,
                        "bFilter": false,
                        "bLengthChange": false,
                        "fnRowCallback": function( nRow, aData, iDisplayIndex ) {
                            if ( jQuery.inArray(aData.DT_RowId, this.aSelected) !== -1 ) {
                                $(nRow).addClass('row_selected');
                            }
                        },
                        "aaData": tdata,
                        "aoColumns": [
            
                        {
                            "sTitle": "IP Address" ,
                            "sClass": "center width20"
                        },
                        {
                            "sTitle": "Date",
                            "sClass": "center width30"
                        },
                        {
                            "sTitle": "Device"
                        },
                        {
                            "sTitle": "Status", 
                            "sClass": "center"
                        }
            
           
                        ]
                    } );  
                /* Click event handler */
   
            
                }
            
            }
        
        
            /**
         * Location object for control layer
         * 
         * */
        
            this.location_layer={
        
                init:function(type){
                    if(!this.set){
                        this.set=true
              
        
                    }
                    this.selector(type)  
                },
                render:function(data){
                    shownavigation=function(){
                        var show=false;
                    
                        if(IPM_layers.type==3){
                            show=true;    
                        }
               
                        if(IPM_layers.type!=3 && IPM_layers.data.subnets.length>0) show=true;
             
             
                        if(show){
             
                            $('ul.ipm_edit_menu li.ladd').show()
                        }

                    
                    }
                
                    valset=function(n){
                        if (n!=null) return n;
                        return 'any';
                
                
                    }
            
                    parseNode=function(n){
               
                        t=n.type
               
                        d=[]
                        $.each(n,function(ii,ee){
                    
                    
                    
                            d.push([
                                '<div tid="'+ee.id+'" class="icon"></div>',
                                valset(ee.mn),
                                valset(ee.bu),
                                valset(ee.fl),
                                valset(ee.ro),
                                valset(ee.ra),
                                valset(ee.st),
                                valset(ee.en),
                    
                                ])
                    
                    
                        });
                
                        return d;
                    }
            
                    //prepare data for table
                    tdata=parseNode(data)
             
                    shownavigation(tdata)
              
                          
                    oTable=$('#ipm_location_list').dataTable( {
                        "bDestroy": true,
                        "aaSorting": [[ 2, "desc" ]],
                        "oLanguage": {
                            "oPaginate": {
                                "sNext": "",
                                "sPrevious": ""
                            }
                        },
                        "iDisplayLength": 15,
                        "bFilter": false,
                        "bLengthChange": false,
                        "fnRowCallback": function( nRow, aData, iDisplayIndex ) {
                            if ( jQuery.inArray(aData.DT_RowId, this.aSelected) !== -1 ) {
                                $(nRow).addClass('row_selected');
                            }
                        },
                        "aaData": tdata,
                        "aoColumns": [
                        {
                            "sTitle": "", 
                            "sClass": "selectspace"
                        },
                        {
                            "sTitle": "Subnet" ,
                            "sClass": "center width10"
                        },
                        {
                            "sTitle": "Building",
                            "sClass": "center width20"
                        },
                        {
                            "sTitle": "Floor"
                        },
                        {
                            "sTitle": "Room", 
                            "sClass": "center"
                        },
                        {
                            "sTitle": "Rack", 
                            "sClass": "center width20"
                        },
                        {
                            "sTitle": "From", 
                            "sClass": "center width5"
                        },
                        {
                            "sTitle": "To", 
                            "sClass": "center width5"
                        }
                        ]
                    } );  
                    /* Click event handler */
                    $('#ipm_location_list tbody tr').bind('click', function () {
      
                        if($(this).find('td').length>1)
                        {
        
                            if ( $(this).hasClass('row_selected') ) {
                                $(this).removeClass('row_selected');
                                $('ul.ipm_edit_menu li.lrem').hide()
            
                                IPM_layers.location_layer.fromTable=false
                            }
                            else {
                                oTable.$('tr.row_selected').removeClass('row_selected');
                                $(this).addClass('row_selected');
                                IPM_layers.location_layer.fromTable=$(this).find('div.icon').attr('tid')
            
                                $('ul.ipm_edit_menu li.lrem').show()
                            //$('ul.ipm_edit_menu li.edit').show()
                            }
                        }
        
        
        
        
                    } );
            
                },
                selector:function(t){
           
           
                    if(IPM_layers.type==0){
                        if(!this.temp){
                            $('#win_ipm_layer41').hide()
                            $('#win_ipm_layer42').show()
                        }
                    }else{
                        //if(this.id!=IPM_layers.id || this.type!=IPM_layers.type){
                        this.id=IPM_layers.id;
                        this.type=IPM_layers.type;
           
                        IPM.loading(true)
                        $('#win_ipm_layer42').hide()
                        $('#win_ipm_layer41').show()
                        $('#win_ipm_layer41').html(
                            '<ul class="ipm_edit_menu">'+
                            '<li class="ladd" style="display: none;"><div class="icon"></div>add location</li>'+
                            '<li class="lrem" style="display: none;"><div class="icon"></div>remove location</li>'+
                            '</ul>'+
                            '<div class="table_list"><table cellspacing="0" cellpadding="0" id="ipm_location_list" width="100%" ></table></div>'
                            )
                
                        $('#win_ipm_layer41 ul.ipm_edit_menu li').click(function(){
               
                            IPM_layers.location_layer.menu(this)
                
                        });
         
          
                        $.postJSON('ipm/location/data',{
                            'id':IPM_layers.id,
                            'type':IPM_layers.type
                
                        }
                        , function(data) {
                 
                            IPM_layers.location_layer.render(data)
              
                            IPM.loading(false)
                        });    
                    //}
                
         
                    }
            
                },
                locationdata:function(){
          
                    if(IPM_layers.type==3){
      
                        name=IPM_layers.nodeGetName()
                        $('#ipm_loc_sub').html('<option value="'+IPM_layers.id+'">'+name+'</option>').prop('disabled', true);
       
       
      
                    }else{
      
       
                        subnets=IPM_layers.data.subnets
                        //building
                        subnets_length=subnets.length 
                        html=[]
                        for(var i=0;i<subnets_length;i++)
                        {
                            sel=''
                            html.push('<option '+sel+' value="'+subnets[i].id+'">'+subnets[i].subnet+'</option>')
                        }
         
                        $('#ipm_loc_sub').html(html.join('')).prop('disabled',false);    
          
      
                    }
          
          
          
                    buildings=HEADER.navdata
            
                    //building
                    building_length=buildings.length 
                    html=[]
                    for(var i=0;i<building_length;i++)
                    {
                        sel=''
                        html.push('<option '+sel+' value="'+buildings[i].id+'">'+buildings[i].name+'</option>')
                    }
         
                    $('#ipm_loc_build').html(html.join(''))
          
                    //floors
                    floors=buildings[0].floors
                    floors_length=floors.length 
                    html=[]
                    html.push('<option value="all">All</option>')
                    for(var i=0;i<floors_length;i++)
                    {
                        sel=''
                        html.push('<option '+sel+' value="'+floors[i].id+'">'+floors[i].name+'</option>')
                    }
         
                    $('#ipm_loc_floor').html(html.join(''))
          
     
           
            
            
                },
        
        
                selecting:function(t){
        
                    selbox=['build','floor','room','rack','p1','p2']
        
                    setEmptyValue=function(from){
            
                        $.each(selbox,function(i,e){
                            if(i>=from)
                                $('#ipm_loc_'+e).html('<option>-</option>')
                        });
            
                    }
        
                    updateBuilding=function(data){
                        html=[]
         
                        dataLength=data.length
                        $.each(data,function(i,e){
             
                            html.push('<option value="'+e.id+'">'+e.name+'</option>')
                        });
         
                        $('#ipm_loc_floor').html(html.join(''))
        
                        setEmptyValue(2)
                    }
        
                    updateFloor=function(data){
                        html=[]
         
                        dataLength=data.length
                        $.each(data,function(i,e){
             
                            html.push('<option value="'+e.id+'">'+e.name+'</option>')
                        });
         
                        $('#ipm_loc_room').html(html.join(''))
        
                        setEmptyValue(3)
                    }
        
                    updateRoom=function(data){
                        IPM_layers.location_layer.racks=data;
                        html=[]
         
                        dataLength=data.length
                        $.each(data,function(i,e){
             
                            html.push('<option value="'+e.id+'">'+e.name+'</option>')
                        });
         
                        $('#ipm_loc_rack').html(html.join(''))
           
           
                        setEmptyValue(4)
        
                    }
                    updatePosition=function(n,f){
                        html=[]
                        for(var i=1;i<=n;i++)     {
             
                            sel=(f==i)?'selected':'';
                            html.push('<option '+sel+' value="'+i+'">'+i+'</option>')
                        }
                        return html    
                    }
            
        
                    getRackSize=function(id){
            
                        $.each(IPM_layers.location_layer.racks,function(i,e){
                
                            if(e.id==id) size=e.size;
                
                
                        })
            
                        return size;
                    }
        
        
            
                    type=t.replace('ipm_loc_','')
                    id=$('#'+t).val()
            
           
            
                    switch(type){
                
                        case 'rack':
                
                            if(id=='all'){
                                setEmptyValue(5)
                            }else{
                
                                size=getRackSize(id)
                
                                $('#ipm_loc_p1').html(updatePosition(size,1))
                                $('#ipm_loc_p2').html(updatePosition(size,size))
                            }
                            break;
                
                
                        case 'build':
                
                        case 'floor':
                
                        case 'room':
                
                            if(id=='all'){
                     
                                if(type=='build') m=1;
                                if(type=='floor') m=2;
                                if(type=='room') m=3;
                    
                                setEmptyValue(m)
                            }else{
            
                                $.postJSON('ipm/location/get',{
                                    'type':type,
                                    'id':id
                
                                }
                                , function(data) {
                                    switch(data.type){
                                        case 'build':
                                            updateBuilding(data.data) 
                    
                                            break;
                                        case 'floor':
                                            updateFloor(data.data)
                                            break;
                                        case 'room':
                                            updateRoom(data.data)
                                            break; 
                                    } 
                
                                });
                            }
        
                            break;    
        
        
                    }
            
            
            
                },
                add:function(){
                    var pop=new POPUP.init(
                        'Location add',   //popup title
                        'locationadd',    //popup name
                        'win_ipm',      //parent window
                        {
                            w:420,     //width 
                            h:380,      //height
                            wdclass:'orange'
                        })
                   
             
                   
                   
                    pop.data(
             
                    {
                            save:false,     //save button
                            rem:false,     //remove button
                            cancel:true,   //cancel 
                            add:true      //add
                        },
                        '<div class="datadiv">'+
                        '<fieldset><legend>Subnet:</legend><select  id="ipm_loc_sub" style="width:220px;"><option>Building A</option></select></fieldset>'+		
                        '<fieldset><legend>Building:</legend><select  id="ipm_loc_build" style="width:320px;"><option>Building A</option></select></fieldset>'+		
                        '<fieldset><legend>Floor:</legend><select  id="ipm_loc_floor" style="width:320px;"><option>Floor 2</option></select></fieldset>'+		
                        '<fieldset><legend>Room:</legend><select id="ipm_loc_room" style="width:320px;"><option>-</option></select></fieldset>'+		
                        '<fieldset><legend>Rack:</legend><select id="ipm_loc_rack" style="width:220px;"><option>-</option></select></fieldset>'+
                        '<fieldset><legend>From position:</legend><select id="ipm_loc_p1" style="width:55px;"><option>-</option></select></fieldset>'+
                        '<fieldset><legend>To position:</legend><select id="ipm_loc_p2" style="width:55px;"><option>-</option></select></fieldset>'
                
		
                        );
            
                    this.locationdata()
            
                    pop.onchange(
            
                        function(e,d){
                            id=$(d).attr('id')
            
                            IPM_layers.location_layer.selecting(id)
            
                        }
            
                        )
            
            
                    pop.action(
                        'win_ipm',
                        //add
                        function(){
               
                            selbox=['build','floor','room','rack','p1','p2']
        
                            m=[]
            
                            $.each(selbox,function(i,e){
                                m.push($('#ipm_loc_'+e).val())
                            });
            
        
            
                            $.postJSON('ipm/location/add',{
                                'type':IPM_layers.type,
                                'id':IPM_layers.id,//fake
                                'name':$('#ipm_loc_sub').val(),
                                'data':m.join(',')
                            }
                            , function(data) {
                        
             
                                if(data.stat.stat==true){
                                    pop.win.remove()
                                    IPM_layers.location_layer.render(data.data)
                                }else{
                                    alert("Please make sure that location is not already taken!")
                 
                                }
             
                            })
             
                        //
             
                        },    
                        //save
                        function(){
                            pop.win.remove()
                        },
                        //remove
                        function(){
                            pop.win.remove()
                        },
                        //cancel
                        function(){
                            pop.win.remove()
                        }
            
                        )
        
            
                },
                //remove subnet location 
                rem:function(){
                    var pop=new POPUP.init(
                        'Subnet location remove',   //popup title
                        'subnetlocrem',    //popup name
                        'win_ipm',      //parent window
                        {
                            w:320,     //width 
                            h:140,      //height
                            wdclass:'orange'
                        })
             
                    pop.data(
             
                    {
                            save:false,     //save button
                            rem:true,     //remove button
                            cancel:true,   //cancel 
                            add:false      //add
                        },
                        '<div class="datadiv">'+
		
                        '<fieldset style="margin-top:20px;"><legend>Remove subnet location:</legend><div class="default">All assigned IP address will be erased!</div></fieldset></div>'
                        )
                    pop.action(
                        'win_ipm',
                        //add
            
                        function(){
              
           
                        },
                        //save
                        function(){
                
                        },
                        //remove
                        function(){
                     
                            if(IPM_layers.location_layer.fromTable){
                                name=IPM_layers.location_layer.fromTable
                            }else{
                                id=$(IPM.selected).attr('id')
                                name=$('#ipm_tree').jstree("get_text", '#'+id)
                            }
                 
                     
                            $.postJSON('ipm/location/rem',{
                 
                                'type':IPM_layers.type,//fake
                                'id':IPM_layers.id,//fake
                                'name':name
                            }
                            , function(data) {
                                
                                IPM_layers.location_layer.render(data.data)
                            });
                     
                     
                            pop.win.remove()
                            $('ul.ipm_edit_menu li.lrem').hide()
                      
                            //$('#ipm_location_list').find('tr.row_selected').remove()
                            IPM_layers.location_layer.fromTable=false
                    
                        },
                        //cancel
                        function(){
                            pop.win.remove()
                        });
            
                },
        
                edit:function(){
            
            
                },
                menu:function(a){
            
                    cl=$(a).attr('class')
            
                    switch(cl){
                        case 'ladd':
                            this.add()
                            break;
                
                        case 'ledit':
                            this.edit()
                            break;
                        case 'lrem':
                            this.rem()
                            break;
                    
               
                            break;
               
                    }
                }
        
        
            }
        
            /**
         * Add /edit object for control layer
         * 
         * */
        
            this.add_edit_layer={
        
                init:function(type){
            
                    this.aSelected = [];
                    if(!this.set){
                        this.set=true
                        $('#win_ipm_layer2 ul.ipm_edit_menu li').click(function(){
               
                            IPM_layers.add_edit_layer.menu(this)
                
                        });
        
                    }
                    this.selector(type)   
            
                },
        
                makeSubdata:function(ob){
            
                    this.ipa=function(){
                        m=[]
                        for(i=0;i<=3;i++){
                            m.push($('#ipm_add_fa'+i).val())
                        }
                        return m.join('.')
                    }
            
                    this.prefix=function(){
                        return Number($('#ipm_add_np').val())
                    }
            
                    this.mask=function(){
                        return Number($('#ipm_add_nm').val())
                    }
            
                    this.maxs=function(){
                        return Number($('#ipm_add_ms').val())
                    }
                    this.maxh=function(){
                        return Number($('#ipm_add_mh').val())
                    }
            
                    this.calculate=function(pref){
                        if(!pref)
                            pref=this.prefix()
                        else
                            //set prefix
                            $('#ipm_add_np').val(pref)
                    
                        //subnet mask
                        $('#ipm_add_nm').val(numToDotted(pref))
                
                        //subnet bits
                        $('#ipm_add_sb').val(31-pref)
                
                        //max subnets
                        $('#ipm_add_ms').val(numToInt(pref))
                
                        //max hosts
                        $('#ipm_add_mh').val(numToInt(pref)-2)
                
                        this.summary()
                    }
                    this.dottedToInt=function(bin){
                        return IPAM_object.IPv4_dotquadA_to_intA(bin)
                    }
                    this.intToDotted=function(i){
                        return IPAM_object.IPv4_intA_to_dotquadA(i)
                    }
                    this.checkAddrSpace=function(){
               
                        current=this.dottedToInt(this.ipa())
                        need=this.dottedToInt('255.255.255.255')-this.maxh()-1
                
                        if(need<=current){
                            new_adr=this.intToDotted(need)    
                            m=new_adr.split('.')   
                            for(i=0;i<=3;i++){
                                $('#ipm_add_fa'+i).val(m[i])
                            }
                        }   
                    }
           
                    this.summary=function(){
            
            
                        //check is address fit number of hosts!
                        this.checkAddrSpace()
            
                        $('#ipm_sum_0').html(this.ipa()+'/'+this.prefix())
            
            
                        first=this.dottedToInt(this.ipa())+1
                        last=first+this.maxh()-1
            
                        $('#ipm_sum_1').html(IPAM_object.IPv4_intA_to_dotquadA(first))
                        $('#ipm_sum_2').html(IPAM_object.IPv4_intA_to_dotquadA(last))
            
            
                    }
           
                    switch(ob){
                        //ip addresses
                        case 'ipm_add_fa0':
                        case 'ipm_add_fa1':
                        case 'ipm_add_fa2':
                        case 'ipm_add_fa3':
                            this.calculate() 
             
                            break;
                        //network prefix
                        case 'ipm_add_np':
                            this.calculate() 
                            break;
                        //network mask
                        case 'ipm_add_nm':
                            p=IPAM_object.IPv4_dotquadA_to_intA($('#'+ob).val())
                            pr=Math.pow(2,32)-p
                            prefix =32-Math.floor((Math.log(pr))/(Math.log(2)))
                  
                            this.calculate(prefix) 
                            break;
                        //subnet bit
                        case 'ipm_add_sb':
                   
                            prefix=32-Number($('#'+ob).val())
                            this.calculate(prefix) 
                            break;
                        //max subnets
                        case 'ipm_add_ms':
                            pr=Number($('#'+ob).val())
                   
                            prefix =32-Math.floor((Math.log(pr))/(Math.log(2)))
                    
                            this.calculate(prefix) 
                            break;
                        //max hosts/ip addr
                        case 'ipm_add_mh':
                            pr=Number($('#'+ob).val())+2
                   
                            prefix =32-Math.floor((Math.log(pr))/(Math.log(2)))
                    
                            this.calculate(prefix) 
                            break;
                    }
           
            
                },
       
                dataIPv4:function(subnet){
        
                    numToDotted=function(n){
                        k=Math.pow(2, 32)-Math.pow(2, 32-n)
                        return IPAM_object.IPv4_intA_to_dotquadA(k)
                    }
                    numToInt=function(n){
                        return Math.pow(2, 32-n)
            
                    }
                    if(!subnet) subnet='0.0.0.0/24' 
         
                    m=subnet.split('/')
                    //set ip data
                    ii=m[0].split('.')
                    for(i=0;i<=3;i++){
                        $('#ipm_add_fa'+i).val(ii[i])
                    }
                    prefix=Number(m[1])
                    //network prefix
                    html=[]
                    for(var io=30;io>=1;io--)
                    {
                        sel=(io==prefix)?'selected ':'';   
                        html.push('<option '+sel+' value="'+io+'">'+io+'</option>')
           
                    }
                    $('#ipm_add_np').html(html.join(''))
         
                    //subnet mask
                    html= []
                    for(var i=1;i<=30;i++){
                        sel=(i==prefix)?'selected ':'';   
                        html.push('<option '+sel+' value="'+numToDotted(i)+'">'+numToDotted(i)+'</option>')
         
                    }
                    $('#ipm_add_nm').html(html.join(''))
                    html=[]
                    //subnet bits
                    for(var i=1;i<=30;i++)
                    {
                        sel=(i==(30-prefix))?'selected ':'';   
                        html.push('<option '+sel+' value="'+i+'">'+i+'</option>')
                    }
         
                    $('#ipm_add_sb').html(html.join(''))
                    html=[]
                    for(var i=1;i<=30;i++){
                        sel=(i==prefix)?'selected ':'';   
                        html.push('<option '+sel+' value="'+numToInt(i)+'">'+numToInt(i)+'</option>')
                    }
         
                    $('#ipm_add_ms').html(html.join(''))
                    html=[]
                    for(var i=1;i<=30;i++){
                        sel=(i==prefix)?'selected ':'';   
                        html.push('<option '+sel+' value="'+(numToInt(i)-2)+'">'+(numToInt(i)-2)+'</option>')
                    }
         
                    $('#ipm_add_mh').html(html.join(''))
    
                },
        
      
                addFolder:function(){
                    var pop=new POPUP.init(
                        'Subnet folder add',   //popup title
                        'subnetfoldadd',    //popup name
                        'win_ipm',      //parent window
                        {
                            w:320,     //width 
                            h:140,      //height
                            wdclass:'orange'
                        })
             
                    pop.data(
             
                    {
                            save:false,     //save button
                            rem:false,     //remove button
                            cancel:true,   //cancel 
                            add:true      //add
                        },
                        '<div class="datadiv">'+
		
                        '<fieldset style="margin-top:20px;"><legend>Name:</legend><input id="ipm_add_fold" style="width:280px;" value=""></fieldset></div>'
                        )
                
                
                
                    pop.action(
                        'win_ipm',
                        //add
            
                        function(){
              
                            name=$('#ipm_add_fold').val()
                            if(name.length>0){
            
                                $.postJSON('ipm/node/add',{
                 
                                    'type':IPM_layers.type,
                                    'id':IPM_layers.id,
                                    'name':name
                                }
                                , function(data) {
                
                                    if(data.status=='valid'){
                   
                   
                                        rel=(IPM_layers.type==1)?'subnode':'node';
                                        if(!IPM.selected)
                                        {
                                            $.jstree._focused().select_node("#main_1");
                                            IPM.selected=$("#main_1")
                                            rel='node'
                                        }
                   
                   
                 
                     
                 
                                        $("#ipm_tree").jstree("create", null, "last", {
                                            'attr':{
                                                'rel':rel,
                                                'id':rel+'_'+data.id
                                            },
                                            'data':data.name
                                        },false,true);
                                        pop.win.remove()   
                                    }else{
                                        alert('Folder already exist')
                                    }
                                });
                            }
                        },
                        //save
                        function(){
                
                        },
                        //remove
                        function(){},
                        //cancel
                        function(){
                            pop.win.remove()
                        });
             
                },
      
      
                editFolder:function(){
                    var pop=new POPUP.init(
                        'Subnet folder edit',   //popup title
                        'subnetfoldadd',    //popup name
                        'win_ipm',      //parent window
                        {
                            w:320,     //width 
                            h:140,      //height
                            wdclass:'orange'
                        })
                    id=$(IPM.selected).attr('id')
                    name=$('#ipm_tree').jstree("get_text", '#'+id)
                    pop.data(
             
                    {
                            save:true,     //save button
                            rem:false,     //remove button
                            cancel:true,   //cancel 
                            add:false      //add
                        },
                        '<div class="datadiv">'+
		
                        '<fieldset style="margin-top:20px;"><legend>Name:</legend><input id="ipm_add_fold" style="width:280px;" value="'+name+'"></fieldset></div>'
                        )
                    pop.action(
                        'win_ipm',
                        //add
            
                        function(){
              
          
                        },
                        //save
                        function(){
                            name=$('#ipm_add_fold').val()
                            if(name.length>0){
            
                                $.postJSON('ipm/node/edit',{
                 
                                    'type':IPM_layers.type,
                                    'id':IPM_layers.id,
                                    'name':name
                                }
                                , function(data) {
                
                                    if(data.status=='valid'){
                   
                                        id=$(IPM.selected).attr('id')
                                        $('#ipm_tree').jstree("set_text", '#'+id , data.name)
                   
                 
                                        pop.win.remove()   
                                    }else{
                                        alert('Folder already exist')
                                    }
                                });
                            }
                        },
                        //remove
                        function(){},
                        //cancel
                        function(){
                            pop.win.remove()
                        });
             
                },
                remFolder:function(){
            
                    var pop=new POPUP.init(
                        'Subnet folder remove',   //popup title
                        'subnetfoldrem',    //popup name
                        'win_ipm',      //parent window
                        {
                            w:320,     //width 
                            h:140,      //height
                            wdclass:'orange'
                        })
             
                    pop.data(
             
                    {
                            save:false,     //save button
                            rem:true,     //remove button
                            cancel:true,   //cancel 
                            add:false      //add
                        },
                        '<div class="datadiv">'+
		
                        '<fieldset style="margin-top:20px;"><legend>Remove folder:</legend><div class="default">All data will be erased!</div></fieldset></div>'
                        )
                    pop.action(
                        'win_ipm',
                        //add
            
                        function(){
              
           
                        },
                        //save
                        function(){
                
                        },
                        //remove
                        function(){
                     
                            $.postJSON('ipm/node/rem',{
                 
                                'type':IPM_layers.type,
                                'id':IPM_layers.id,
                                'name':name
                            }
                            , function(data) {
                                });
                     
                            $(IPM.selected).remove()
                            pop.win.remove()
                            $.jstree._focused().select_node("#main_1");
                            IPM.selected=$("#main_1")
                        },
                        //cancel
                        function(){
                            pop.win.remove()
                        });
             
                },
                remSubnet:function(){
            
                    var pop=new POPUP.init(
                        'Subnet  remove',   //popup title
                        'subnetrem',    //popup name
                        'win_ipm',      //parent window
                        {
                            w:320,     //width 
                            h:140,      //height
                            wdclass:'orange'
                        })
             
                    pop.data(
             
                    {
                            save:false,     //save button
                            rem:true,     //remove button
                            cancel:true,   //cancel 
                            add:false      //add
                        },
                        '<div class="datadiv">'+
		
                        '<fieldset style="margin-top:20px;"><legend>Remove subnet:</legend><div class="default">All assigned IP address will be erased!</div></fieldset></div>'
                        )
                    pop.action(
                        'win_ipm',
                        //add
            
                        function(){
              
           
                        },
                        //save
                        function(){
                
                        },
                        //remove
                        function(){
                     
                            if(IPM_layers.fromTable){
                                name=IPM_layers.fromTable[1]
                            }else{
                                id=$(IPM.selected).attr('id')
                                name=$('#ipm_tree').jstree("get_text", '#'+id)
                            }
                 
                     
                            $.postJSON('ipm/subnet/rem',{
                 
                                'type':IPM_layers.type,
                                'id':IPM_layers.id,
                                'name':name
                            }
                            , function(data) {
                         
                        
                        
                                if(!IPM_layers.fromTable){
                                    parent=$(IPM.selected).parent().parent().attr('id')                        
                                    $("#ipm_tree").jstree("refresh",'#'+parent)
                                    $.jstree._focused().select_node('#'+parent);

                        
                                }else{
                                    parent=$(IPM.selected).attr('id')                            
                                    if(parent!='main_1'){
                                        $("#ipm_tree").jstree("refresh",'#'+parent)
                                    }
                                    $.jstree._focused().select_node('#'+parent);
                            
                                    IPM_layers.data=data.data
                            
                                    IPM_layers.update()
                        
                                // $('#ipm_list').find('tr.row_selected').remove()
                                // IPM_layers.fromTable=false
                                }
                        
                            });
                        
                            
                            
                     
                            pop.win.remove()
                     
                          
                        },
                        //cancel
                        function(){
                            pop.win.remove()
                        });
             
                },
        
        
                addSubnet:function(){
                    var pop=new POPUP.init(
                        'Subnet add',   //popup title
                        'subnetadd',    //popup name
                        'win_ipm',      //parent window
                        {
                            w:550,     //width 
                            h:330,      //height
                            wdclass:'orange'
                        })
                   
             
                   
                   
                    pop.data(
             
                    {
                            save:false,     //save button
                            rem:false,     //remove button
                            cancel:true,   //cancel 
                            add:true      //add
                        },
                        '<div id="new_subnet_add" class="datadiv">'+
                        '<div><fieldset><legend>IP network:</legend><input id="ipm_add_fa0" style="width:30px;" value="0">.<input id="ipm_add_fa1" style="width:30px;" value="0">.<input id="ipm_add_fa2" style="width:30px;" value="0">.<input  id="ipm_add_fa3" style="width:30px;" value="0"></fieldset>'+		
                        '<fieldset><legend>Network prefix:</legend><select  id="ipm_add_np" style="width:55px;"><option>24</option></select></fieldset></div>'+		
                
                        '<div ><fieldset><legend>Subnet Mask:</legend><select id="ipm_add_nm" style="width:155px;"><option>255.255.255.0</option></select></fieldset>'+
                        '<fieldset><legend>Subnet Bits:</legend><select id="ipm_add_sb" style="width:55px;"><option>1</option><option>2</option></select></div>'+
                        '<div ><fieldset><legend>Maximum subnets:</legend><select id="ipm_add_ms" style="width:220px;"><option selected="" value="0">2147483648</option></select></fieldset>'+
                        '<fieldset><legend>Maximum IP addresses:</legend><select id="ipm_add_mh" style="width:220px;"><option selected="" value="0">2147483648</option></select></div></div>'+
                
                        '<div style="top:30px;position:absolute;right:20px;width:280px;height:200px;"><fieldset class="summary2"><legend>Overview</legend><fieldset><legend>Subnet</legend><div id="ipm_sum_0" class="default">0.0.0.0/24</div></fieldset>'+
                        '<fieldset><legend>First IP address</legend><div id="ipm_sum_1" class="default">0.0.0.1</div></fieldset>'+
                        '<fieldset><legend>Last IP address</legend><div id="ipm_sum_2" class="default">0.0.0.254</div></fieldset>'+
                        '</fieldset></div>'
                        );
            
                    this.dataIPv4()
            
                    $('#new_subnet_add input').bind('keyup keydown blur',function(e){
                        
                        this.value = this.value.replace(/[^0-9\.]/g,'');
                        
                        if(this.id=='ipm_add_fa3'){
                        //this.value=0;
                        //always set network gateway to 0
                        }
                       
                        
                        if(e.type=='blur'){
                            if(this.id=='ipm_add_fa0'){
                                if(this.value<=1) this.value=1;
                            }
                            
                        //check is IP valid
                            
                        
                            
                            
                            
                        }
                        
                        if(this.value.length>1){
                            if(this.value.charAt(0)==0)
                            {
                                this.value=this.value.substring(1,this.value.length)
                            }
                        }
                                
                        if(this.value>255) this.value=255;
                        
                        if(this.value.length==0) this.value=0
                        
                        IPM_layers.add_edit_layer.makeSubdata(this.id)
                    })
            
                    pop.onchange(
            
                        function(e,d){
                            id=$(d).attr('id')
                    
                            IPM_layers.add_edit_layer.makeSubdata(id)
            
                        }
            
                        )
            
            
                    pop.action(
                        'win_ipm',
                        //add
                        function(){
               
                            if($('#ipm_sum_1').html()=='0.0.0.1'){
                                alert('Please change ip network, subnet "0.0.0.0/24" not alowed!')
                                $('#ipm_add_fa0').focus()
                            }else{
               
            
                                $.postJSON('ipm/subnet/add',{
                                    'type':IPM_layers.type,
                                    'id':IPM_layers.id,
                                    'name':$('#ipm_sum_0').text()
                                }
                                , function(data) {
                       
                                    if(data.status!='taken'){
                                        IPM_layers.data=data.data
                                        IPM_layers.update()
                                        pop.win.remove()
                                        if(IPM.selected){
                                            cl=$(IPM.selected).attr('class').split(' ')
                                            open=false;
                                            $.each(cl,function(i,e){
                                                if(e=='jstree-open') open=true;
                                            })
                       
                       
                                            if(open){
                                                $("#ipm_tree").jstree("create", null, "last", {
                                                    'attr':{
                                                        'rel':'subnet',
                                                        'id':'subnet_'+data.id
                                                    },
                                                    'data':data.subnet
                                                },false,true);
                                            }else{
                                                id=$(IPM.selected).attr('id')
                                                $(IPM.selected).attr('class','jstree-closed')
                                                $("#ipm_tree").jstree("toggle_node",'#'+id)
                                            } 
                                        }
      		

                    
                                    }else{
                                        f=IPAM_object.IPv4_intA_to_dotquadA(data.err.range_from)
                                        t=IPAM_object.IPv4_intA_to_dotquadA(data.err.range_to)
                                        alert('Subnet '+data.err.subnet+' already in use! range :'+f+' - '+t)
                                    }
                                })
                            }
                        //
             
                        },    
                        //save
                        function(){
                            pop.win.remove()
                        },
                        //remove
                        function(){
                            pop.win.remove()
                        },
                        //cancel
                        function(){
                            pop.win.remove()
                        }
            
                        )
        
   
            
            
                },
                editSubnet:function(){
                    var pop=new POPUP.init(
                        'Subnet edit',   //popup title
                        'subnetedit',    //popup name
                        'win_ipm',      //parent window
                        {
                            w:550,     //width 
                            h:330,      //height
                            wdclass:'orange'
                        })
                   
             
                   
                   
                    pop.data(
             
                    {
                            save:true,     //save button
                            rem:false,     //remove button
                            cancel:true,   //cancel 
                            add:false      //add
                        },
                        '<div id="new_subnet_add" class="datadiv">'+
                        '<div><fieldset><legend>IP network:</legend><input id="ipm_add_fa0" style="width:30px;" value="0">.<input id="ipm_add_fa1" style="width:30px;" value="0">.<input id="ipm_add_fa2" style="width:30px;" value="0">.<input  id="ipm_add_fa3" style="width:30px;" value="0"></fieldset>'+		
                        '<fieldset><legend>Network prefix:</legend><select  id="ipm_add_np" style="width:55px;"><option>24</option></select></fieldset></div>'+		
                
                        '<div ><fieldset><legend>Subnet Mask:</legend><select id="ipm_add_nm" style="width:155px;"><option>255.255.255.0</option></select></fieldset>'+
                        '<fieldset><legend>Subnet Bits:</legend><select id="ipm_add_sb" style="width:55px;"><option>1</option><option>2</option></select></div>'+
                        '<div ><fieldset><legend>Maximum subnets:</legend><select id="ipm_add_ms" style="width:220px;"><option selected="" value="0">2147483648</option></select></fieldset>'+
                        '<fieldset><legend>Maximum IP addresses:</legend><select id="ipm_add_mh" style="width:220px;"><option selected="" value="0">2147483648</option></select></div></div>'+
                
                        '<div style="top:30px;position:absolute;right:20px;width:280px;height:200px;"><fieldset class="summary2"><legend>Overview</legend><fieldset><legend>Subnet</legend><div id="ipm_sum_0" class="default">0.0.0.0/24</div></fieldset>'+
                        '<fieldset><legend>First IP address</legend><div id="ipm_sum_1" class="default">0.0.0.1</div></fieldset>'+
                        '<fieldset><legend>Last IP address</legend><div id="ipm_sum_2" class="default">0.0.0.254</div></fieldset>'+
                        '</fieldset></div>'
                        );
            
                    if(IPM_layers.type==3){
                        id=$(IPM.selected).attr('id')
                        name=$('#ipm_tree').jstree("get_text", '#'+id)
                    }else{
                        name=IPM_layers.fromTable[1]
                
                    }
                    IPM_layers.old_name=name;
            
                    this.dataIPv4(name)
                    IPM_layers.add_edit_layer.makeSubdata('ipm_add_fa0')
                    
            
                    $('#new_subnet_add input').bind('keyup keydown blur',function(e){
                        
                        this.value = this.value.replace(/[^0-9\.]/g,'');
                  
                  
                        
                  
                        if(e.type=='blur'){
                            if(this.id=='ipm_add_fa0'){
                                if(this.value<=1) this.value=1;
                            }
                        }
                        
                        if(this.value.length>1){
                            if(this.value.charAt(0)==0)
                            {
                                this.value=this.value.substring(1,this.value.length)
                            }
                        }
                                
                        if(this.value>255) this.value=255;
                        
                        if(this.value.length==0) this.value=0
                        
                        IPM_layers.add_edit_layer.makeSubdata(this.id)
                    
                   
                    })
            
                    pop.onchange(
            
                        function(e,d){
                            id=$(d).attr('id')
                    
                            IPM_layers.add_edit_layer.makeSubdata(id)
            
                        }
            
                        )
            
            
                    pop.action(
                        'win_ipm',
                        //add
                        function(){
                            pop.win.remove()
                        },
                        //save
                        function(){
               
                            if($('#ipm_sum_1').html()=='0.0.0.1'){
                                alert('Please change ip network, subnet "0.0.0.0/24" not alowed!')
                                $('#ipm_add_fa0').focus()
                            }else{
               
            
                                $.postJSON('ipm/subnet/update',{
                                    'type':IPM_layers.type,
                                    'id':IPM_layers.id,
                                    'old':IPM_layers.old_name,
                                    'name':$('#ipm_sum_0').text()
                                }
                                , function(data) {
                       
                                    if(data.status!='taken'){
                                        IPM_layers.data=data.data
                                        IPM_layers.update()
                                        pop.win.remove()
                                        if(IPM.selected){
                                            cl=$(IPM.selected).attr('class').split(' ')
                                            open=false;
                                            $.each(cl,function(i,e){
                                                if(e=='jstree-open') open=true;
                                            })
                       
                       
                                            if(open){
                                                $("#ipm_tree").jstree("create", null, "last", {
                                                    'attr':{
                                                        'rel':'subnet',
                                                        'id':'subnet_'+data.id
                                                    },
                                                    'data':data.subnet
                                                },false,true);
                                            }else{
                                                id=$(IPM.selected).attr('id')
                                                $(IPM.selected).attr('class','jstree-closed')
                                                $("#ipm_tree").jstree("toggle_node",'#'+id)
                                            } 
                                        }
      		

                    
                                    }else{
                                        f=IPAM_object.IPv4_intA_to_dotquadA(data.err.range_from)
                                        t=IPAM_object.IPv4_intA_to_dotquadA(data.err.range_to)
                                        alert('Subnet '+data.err.subnet+' already in use! range :'+f+' - '+t)
                                    }
                                })
                            }
                        //
             
                        },    
                        
                        //remove
                        function(){
                            pop.win.remove()
                        },
                        //cancel
                        function(){
                            pop.win.remove()
                        }
            
                        )
        
   
            
            
                },
                menu:function(a){
           
                    cl=$(a).attr('class')
            
                    switch(cl){
                        case 'add':
                            this.addSubnet()
                            break;
                
                        case 'edit':
                            this.editSubnet()
                            break;
                        case 'rem':
                            this.remSubnet()
                            break;
                    
                        case 'nadd':
                            this.addFolder()
                            break;
                
                        case 'nedit':
                            this.editFolder()
                            break;
                        case 'nrem':
                            this.remFolder()
                            break;
               
                    }
            
                },
                navigation:function(datas){
                    lis=$('#win_ipm_layer2 ul.ipm_edit_menu li')
                    $.each(datas,function(i,e){
                
                        if(e==1) $(lis[i]).show(); else $(lis[i]).hide();
                
                    });
            
                },
                //subnet overview for edit
                subnetData:function(){
          
                    $('#subnet_list').html('')
                    name=IPM_layers.nodeGetName()
                    IPAM_object.init(name)
                    m=['Subnet','Parent','Netmask','Hosts','Usage','Reserved']
                    hosts=IPAM_object.hosts()
                    d=[name,IPM_layers.data.parent,IPAM_object.netmaskDotQuad,hosts.length,IPM_layers.data.used.length,0]         
          
          
                    html=''
               
                    $.each(m,function(i,e){
                   
                        html+='<fieldset>'+
                        '<legend>'+e+'</legend>'+
                        '<div class="data">'+d[i]+'</div>'+
                        '</fieldset>'
                   
                    });
                  
                    $('#subnet_list').html(html) 
                },
                usage:function(u,t){
                    return Math.ceil((u/t)*100)
            
                },
                populateData:function(){
                    m=[]
                    $.each(IPM_layers.data.subnets,function(i,e){
            
                        IPAM_object.init(e.subnet)
            
                        m.push(['<div class="icon"></div>',e.subnet,e.size,IPAM_object.netmaskDotQuad,e.used,IPM_layers.add_edit_layer.usage(e.used,e.size)])
                
                    });
            
                    return m
                //[ , "local subnetloca", "254", "255.255.255.0", "0.4%" ],
            
                },
                table:function(){
             
                    datas=this.populateData()
            
                    IPM_layers.fromTable=false
            
                    oTable=$('#ipm_list').dataTable( {
                        "bDestroy": true,
                        "aaSorting": [[ 2, "desc" ]],
                        "oLanguage": {
                            "oPaginate": {
                                "sNext": "",
                                "sPrevious": ""
                            }
                        },
                        "iDisplayLength": 15,
                        "bFilter": false,
                        "bLengthChange": false,
                        "fnRowCallback": function( nRow, aData, iDisplayIndex ) {
                            if ( jQuery.inArray(aData.DT_RowId, this.aSelected) !== -1 ) {
                                $(nRow).addClass('row_selected');
                            }
                        },
                        "aaData": datas,
                        "aoColumns": [
                        {
                            "sTitle": "", 
                            "sClass": "selectspace"
                        },
                        {
                            "sTitle": "Subnet Address"
                        },
                        {
                            "sTitle": "Size"
                        },
                        {
                            "sTitle": "Mask"
                        },
                        {
                            "sTitle": "Usage [num]", 
                            "sClass": "center"
                        },
                        {
                            "sTitle": "Usage [%]", 
                            "sClass": "center usage"
                        }
                        ]
                    } );  
                    $.each(oTable.$('td.usage'),function(i,e){
                        m=Number($(e).text())
        
                        $(e).html('<div  class="bar"><span style="position:relative;z-index:2;">'+m+'%</span><div style="width:'+m+'%"></div></div>')
                    });
    
    
                    /* Click event handler */
                    $('#ipm_list tbody tr').bind('click', function () {
      
                        if($(this).find('td').length>1)
                        {
                            if ( $(this).hasClass('row_selected') ) {
                                $(this).removeClass('row_selected');
                                $('ul.ipm_edit_menu li.rem').hide()
                                //$('ul.ipm_edit_menu li.edit').hide()
                                IPM_layers.fromTable=false
                            }
                            else {
                                oTable.$('tr.row_selected').removeClass('row_selected');
                                $(this).addClass('row_selected');
                                IPM_layers.fromTable=oTable.fnGetData( this );
            
                                $('ul.ipm_edit_menu li.rem').show()
                            //$('ul.ipm_edit_menu li.edit').show()
                            }
        
                        } 
        
        
                    } );
                //oTable.$('td.usage').html('<div class="bar">20%<div></div></div>')
                },
      
     
                selector:function(type){
            
            
            
                    switch(type){
            
            
                        //root node
                        case 0:
                            data=[0,0,0,1,0,0]
                            break;
                        //main node
                        case 1:
                            data=[1,0,0,1,1,1]
                            break;
                        //subnode
                        case 2:
                            data=[1,0,0,0,1,1]   
                            break;
                        //subnet
                        case 3:
                            data=[0,0,1,0,0,0]
                            break;
            
                    }
                    if(type==3){
                        $('#subnet_list').parent().show()
                        $('#ipm_list').parent().hide()
                        this.subnetData()
            
            
                    //subnet data
                    }else{
                        //all subnets as list
                        $('#subnet_list').parent().hide()
                        $('#ipm_list').parent().show()
                        this.table()
                    }
        
        
                    this.navigation(data)
            
                }
            
            }
        }
        
    },
    
    nodeTypes:function(b){
        a=['main','node','subnode','subnet']
        return a.indexOf(b);
    },
    
    nodeGetName:function(){
        
        if(!IPM.selected) return 'My company';
        
        return $(IPM.selected).find('a.jstree-clicked').text().replace(/\s+/g, '');
    },
    
    nodeGetType:function(){
        
        if(!IPM.selected) return  {
            'id':'all',
            'type':0
        }
        ;
        t=$(IPM.selected).attr('id').split('_')
        
        
        return {
            'id':Number(t[1]),
            'type':this.nodeTypes(t[0])
        }
        
    },
    plot:function(){
        switch(Number(IPM.activeMenu)){
            case 1:
                //overview
                this.overview() 
           
                break;
            case 2:
                //edit/add
                this.add_edit_layer.init(this.type)
           
                break;
            //devices
            case 3:
                this.device_layer.init(this.type)
                break;    
            //location
            case 4:
                this.location_layer.init(this.type)
            
                break;    
            //IP history
            case 5:
                this.history_layer.init(this.type)
                break;    
        }
        
    },
    
    
    
    update:function(){
  
        data=this.nodeGetType()
        //if(data.id!=this.id || data.type!=this.type){
        
        this.id=data.id
        this.type=data.type
        IPM.loading(true);
        if(!IPM_layers.submenuActive)
            IPM_layers.submenuActive=1
        $.postJSON('ipm/subnet/get',{
            'type':data.type,
            'id':data.id
        }, function(json) {

            IPM.loading(false);
            IPM_layers.data=json
            IPM_layers.plot()

        });  
      
      
    //}else{this.plot()}
    
        
    },
    
    summary:function(type){
        ipms=$('#ipm_summary')
        if(type==3){
           
           
        
            $(ipms).append('<legend>Summary</legend>')
            $(ipms).append('<div>Hosts:</div> ')
            $(ipms).append('<div class="default">'+this.total+'</div>')
            $(ipms).append('<div>Reserved Static IPs</div>')
            $(ipms).append('<div class="default">0</div>')
            $(ipms).append('<div>Mask:</div>')
            $(ipms).append('<div class="default">'+IPAM_object.netmaskDotQuad+'</div>')
            $(ipms).append('<div>Used</div>')
            $(ipms).append('<div class="default">'+IPM_layers.data.used.length+'</div>')
            
        }else{
            
            m=this.sumData()
        
            
            $(ipms).append('<legend>Summary</legend>')
            $(ipms).append('<div>Total IPs:</div> ')
            $(ipms).append('<div class="default">'+m.t+'</div>')
            $(ipms).append('<div>Reserved Static IPs</div>')
            $(ipms).append('<div class="default">'+m.r+'</div>')
            $(ipms).append('<div>Total Subnet:</div>')
            $(ipms).append('<div class="default">'+this.data.subnets.length+'</div>')
            $(ipms).append('<div>Used IPs</div>')
            $(ipms).append('<div class="default">'+m.u+'</div>') 
            
        }
        
    },
    calculateSize:function(cont){
     
        w=$(cont).width()
        w=w-140
        s=Math.ceil(w/40)
        if(s>=64) s=64
        if(s>=48 && s<56) s=48
        if(s>=32 && s<48) s=32
        if(s>=24 && s<32) s=24
        if(s>=16 && s<24) s=16
        if(s>=8 && s<16) s=8
      
        return s
        
        
    },
    
    overviewmenu:function(a){
    
        a=Number(a)
        if(a==0) a=1
        
        if(a==2){
            
            IPM_layers.makeIPList()
        }else{
            
            IPM_layers.makemapList()
        }
        
        IPM_layers.submenuActive=a
        
        
        
    },
    
    makeIPList:function(){
        //hide navigation menu  
        $('#ipm_subnet_data div.ipm_graph_nav').hide()
        
        hosts=IPAM_object.hosts() //2^4
        c=$('#ipm_sub_lay_2').html('')
         
        $('<table></table>').attr('id','ipm_subnet_ip_list').appendTo(c)
         
         
        idata=[]
        $.each(hosts,function(i,e){
          
            var used = $.grep(IPM_layers.data.used, function(ee){
                return ee.ip == e;
            });
            st='free' 
            dev=''
            if(used.length==1){
                st='taken' 
                dev=used[0].device
            }
            idata.push([e,st,dev])
             
             
        });
         
         
 
      
        oTable=$('#ipm_subnet_ip_list').dataTable( {
            "bDestroy": true,
            "oLanguage": {
                "oPaginate": {
                    "sNext": "",
                    "sPrevious": ""
                }
            },
            "iDisplayLength": 256,
            "bFilter": false,
            "bLengthChange": false,
            "aaData": idata,
            "aoColumns": [
            {
                "sTitle": "IP Address"
            },
            {
                "sTitle": "Status"
            },
            {
                "sTitle": "Device" , 
                "sClass": "center"
            }
            
            ]
        } );
   
    
        
    },
    getLastNum:function(ip){
        m=ip.split('.',4)
        return Number(m.pop())
    },
    makemapList:function(){
   
        //hide navigation menu  
        container='ipm_sub_lay_1'
        $('#ipm_subnet_data div.ipm_graph_nav').show()
        
        //get from integer
        if(!$('#'+container).attr('from')){
            $('#'+container).attr('from',0)
            from=0
            
        }else{
            from=Number($('#'+container).attr('from'))
        }
        
    
        
        //counter
        var n=0;
        
        //host counter
        var hostNumber=0;
        
        //array for html
        var html=[]
        
        //get array of hosts
        hosts=IPAM_object.hosts() //2^4
   
        //clear container
        cont=$('#ipm_sub_lay_1').html('')
        
        //get number of cells
        num=this.calculateSize(cont) 
        
        //number of hosts
        l=hosts.length
        
        p=num
        //populate data
          
        
        fr=from*256
        //   if(from>0) fr+=1
        
        zz=fr
        to=fr+256;

        //navigation setup right
        if(to>=l) {
            to=l;
            $('#ipm_subnet_data div.right').addClass('rdis').attr('act','no')
        }
        else{
            $('#ipm_subnet_data div.right').removeClass('rdis').attr('act','ok')
        }
        
        //navigation setup left
        if(from>=1) {
            $('#ipm_subnet_data div.left').removeClass('ldis').attr('act','ok')
        }
        else{
            $('#ipm_subnet_data div.left').addClass('ldis').attr('act','no')
        }
        
        $('#ipm_subnet_data div.semafor').html('Showing '+fr+' to '+to+' of '+l+' entries')
 
        //console.log(fr,to)
 
        for(i=fr;i<to;i++){
            
          
        
            //for(var i=0;i<l;i=i+p){
            if(i>=zz){
                zz+=num
          
                html.push('<div class="mapipname">'+hosts[i]+'</div>')
        
            
                nn=((n+num)>l)?(l-n):num;
          
                for(ii=0;ii<nn;ii++){

                    //default class name
                    cl_name='free';
                
                    //hint
                    hint=''

                    //check is ip used
                    var used = $.grep(IPM_layers.data.used, function(e){
                        return e.ip == hosts[n+fr];
                    });
                
                vps=0;
                         
                    if(used.length==1){
                        cl_name='used';
                        hint='Device:'+used[0].device
                        
                        
                        if($(used[0].vps).length>0){
                    vps=1;    
                           hint+='<br>VPS:'+ used[0].vps.name
                            cl_name='usedvps';
                        }
                       
                    }
          
                    
          
          
                    //only 2^8-1 hosts
                    if(hostNumber>255) hostNumber=0
          
                    tot=n+fr;
          
          
          
                    if(tot==0 || tot==(l-1)){
                        cl_name='ipdisabled'
                        hint=(tot==0)?'network':'broadcast'
                        hint+=' IP address'
                    
                    }
                    hn=this.getLastNum(hosts[n])
                
                    html.push('<div n="'+tot+'" vps="'+vps+'" hint="'+hint+'" class="mapip '+cl_name+'">'+hn+'</div>')
           
                    n++; 
                    hostNumber++;
                }
            }
            
            
                
            
        
        }
       
        htmls=html.join('')
        $(cont).html(htmls)
        
        
        
        
        this.hintSet('ipm_sub_lay_1')
        

        $(cont).find('div.used').bind('click',function(){
    
            IPM_layers.search(this)
    
        //console.log(this.id)
        
    })
    
    $(cont).find('div.usedvps').bind('click',function(){
    
            IPM_layers.search(this)
    
        //console.log(this.id)
        })

     
        
    },
    hintSet:function(div){
      
        a='';
        if(div!=null) a='#'+div+' ';
      
        $(a+'div[hint]').hover(function(){
				
            html=$(this).attr('hint');
		

            $('#tooltip').html('');
            //html='Search ability is currently under development!'
					
					
            if(html.length>0){
						
                $('#tooltip').html(html);
						
                                                
                $('#tooltip').show();
            }		
				
        },function(){
					
            $('#tooltip').hide();	
					
        }).mousemove(function(){
            $('#tooltip').css('left',mouseX+10)
            $('#tooltip').css('top',mouseY+10)
						
						
						
        });
        
    },
  
  
    
  
    add_edit:function(){
     
        
        
        
        
        
        
    },
  
    //return sum of used subnets for overwiev
    sumData:function(){
        m={
            'r':0,
            'u':0,
            't':0
        }
        $.each(this.data.subnets,function(i,sub){
            m.r+=Number(sub.reserved)
            m.u+=Number(sub.used)
            m.t+=Number(sub.size)-2
                
        });
            
        return m;       
      
    },
  
    overview:function(){




        
        this.name=this.nodeGetName()
       
        if(this.type==3){
            if(!this.sets) {
                IPM.actionClick()
                this.sets=true    
            }
                     
            IPAM_object.init(this.name)
           
            this.used=IPM_layers.data.used.length
            this.total=IPAM_object.hostTot
            this.reserved=0
        }else{
            m=this.sumData()
             
            this.used=m.u
            this.total=m.t
            this.reserved=m.r
           
        } 
        //console.log(this.used,this.reserved,this.total)
        //summary
        ipms=$('#ipm_summary').html('')
       
        name=this.nodeGetName()
       
        $('#ipm_overview_title').html('IP usage for <b>'+name+'</b> ')
      
          
       
      
        this.summary(this.type)
      
      
        
      
        IPM_GRAPHS.pie(this.used,this.reserved,this.total)
       
        //IPM_GRAPHS.bar()
        
      
        if(this.type==3){
          
            $('#ipm_bar_wrap').hide()
            $('#ipm_subnet_data').show()
           
            this.menunav(); 
            this.overviewmenu(this.submenuActive)
        //this.ipMacList()
          
        }else{
            $('#ipm_bar_wrap').show()
            $('#ipm_subnet_data').hide()
            IPM_GRAPHS.bar('ipm_bar')
        }
        
    },
    menu:function(a){
    
        
    },
    menunav:function(){

        
        
    }
    
    
    
    
    
}

