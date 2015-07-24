

var VPS={

    componentToHex:function(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    },

    rgbToHex:function(r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    },

		
    getColorForPercentage:function(pct) {
	
        if(pct==1){
            color=this.percentColors[2].color
            return this.rgbToHex(color.r,color.g,color.b);
        }
	
        for (var i = 0; i < this.percentColors.length; i++) {
		
            if (pct < this.percentColors[i].pct) {
	  
                var lower = this.percentColors[i - 1];
                var upper = this.percentColors[i];
                var range = upper.pct - lower.pct;
                var rangePct = (pct - lower.pct) / range;
                var pctLower = 1 - rangePct;
                var pctUpper = rangePct;
		    	
		    
                var color = {
                    r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
                    g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
                    b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
                };
                return this.rgbToHex(color.r,color.g,color.b);
            // or output as hex if preferred
            }
		
        }
	
    },  

    row:function(name,used,total,height){
        row=$('<div/>').addClass('row')
	
        percentage=Math.round((Number(used)/Number(total))*100);
	
        col=VPS.getColorForPercentage(percentage/100);
	
	
        //$('<div/>').addClass('gn').html(name).appendTo(row)
        $('<div/>').addClass('gd hint').attr('hint',used+' / '+total).html('<div class="col" style="height:'+height+'px;width:'+percentage+'%;background:'+col+'"></div><div class="perc"><span>'+percentage+'%</span></div>').appendTo(row)
	
        return row;	
	
    },	

    stat:function(name,size,total){
        row=$('<div/>').addClass('row')
        percentage=Math.round((size/total)*100);
	
        col=VPS.getColorForPercentage(percentage/100);
	
	
        //$('<div/>').addClass('gn').html(name).appendTo(row)
        $('<div/>').addClass('gd').html('<div class="col" style="height:2px;width:'+percentage+'%;background:'+col+'"></div><div class="stat">'+size+' / '+total+'</div><div class="stat2"><span>'+percentage+'%</span></div>').appendTo(row)
	
        return row;
	
    },
	
    plotgraph:function(){

        $('#win_device_layer7_4').html('<canvas id="vpsmap" height="305" width="580" style=""></canvas>')

        var graph = new Graph();

	
	
        var node = graph.newNode({
            label: DEVICE.name,
            type:'server'
        });
	
	
        //var aaa = graph.newNode({label: 'Bianca2',type:'storage'});
        //var aaa2 = graph.newNode({label: 'Bianca3',type:'storage'});
        $.each(VPS.data.vps,function(i,vps){
            var vpsnode = graph.newNode({
                label: vps.hostname,
                type:'vps'
            });
            graph.newEdge(node, vpsnode, {
                color: '#cccccc'
            });
        })
	
	
	
        //graph.newEdge(aaa, dennis);
        //graph.newEdge(aaa2, dennis);
	
		
	
	
	
        var springy = $('#vpsmap').springy({
            graph: graph
        });

	
    },


    updateSummary:function(){

	
        html='<table class="vps_summary summary">'+
        '<tr>'+
        '<td class="item">Manufacturer</td>'+
        '<td class="value">'+VPS.data.manufacturer+'</td>'+
        '</tr><tr>'+
        '<td class="item">Model</td>'+
        '<td class="value">'+VPS.data.model+'</td>'+
        '</tr><tr>'+
        '<td class="item">Core speed</td>'+
        '<td class="value">'+VPS.data.speed+'</td>'+
        '</tr><tr>'+
        '<td class="item">Processor Type</td>'+
        '<td class="value">'+VPS.data.processor+'</td>'+
        '</tr><tr>'+
        '<td class="item">Processors Sockets</td>'+
        '<td class="value">'+VPS.data.sockets+'</td>'+
        '</tr><tr>'+
        '<td class="item">Cores per Socket</td>'+
        '<td class="value">'+VPS.data.cores+'</td>'+
        '</tr><tr>'+
        '<td class="item">Logical Procesors</td>'+
        '<td class="value">'+VPS.data.logic+'</td>'+
        '</tr><tr>'+
        '<td class="item">Hyperthreading</td>'+
        '<td class="value">'+VPS.data.hyperthreading+'</td>'+
        '</tr><tr>'+
        '<td class="item">Memory</td>'+
        '<td class="value">'+VPS.data.memory+' MB</td>'+
        '</tr><tr>'+
        '<td class="item">Storage</td>'+
        '<td class="value">'+VPS.data.localStorage+' GB</td>'+
        '</tr><tr>'+
        '<td class="item">Virtual mashines</td>'+
        '<td class="value">'+VPS.data.vps.length+'</td>'+
        '</tr>'+
        '</table>'
	
	
	
        $('#win_device_layer7_3').html(html)
	
	
	
	
    },

    makevps:function(data,cpu,ram,hdd,ip,total){
	
        vps=$('<div/>').addClass('vps '+total).attr('vps_id',data.id)
	
        if(total=='total'){
            nav=$('<div/>').addClass('vpsnav').appendTo(vps)
            nav.html('<div style="position:absolute;right:-15px;width:135px;top:-5px;"><div class="rows">RAM</div><div class="rows">CPU</div><div class="rows">HDD</div></div>')
        }
	
	
        $('<div/>').addClass('icon').appendTo(vps)
        name=$('<div/>').addClass('n').html(data.hostname).appendTo(vps)
	
        ips=$('<div/>').addClass('ip').appendTo(vps)
	
        vip=[]
        $.each(ip,function(i,e){
            vip.push(e.data)
        //$('<span/>').html(e.data).appendTo(ips)
		
        });
        ips.html('<div style="width:380px;">'+vip.join('; ')+'</div>')
	
        if(ip.length==0)
            ips.css({
                'height':'15px'
            })	
		
	
	
	
	
	
        graph=$('<div/>').addClass('graph').appendTo(vps)
	
	
	
        $(this.row('RAM',data.ram,ram,5)).appendTo(graph)
	
        $(this.row('CPU',data.cpu,cpu,5)).appendTo(graph)
	
        $(this.row('HDD',data.hdd,hdd,5)).appendTo(graph)
	
        $('#win_device_layer7_1').append(vps)
	
    },

    makestorage:function(name,size,total,cl,where){
	
	
	
        vps=$('<div/>').addClass('storage '+cl)
	
	
        $('<div/>').addClass('icon').appendTo(vps)
        name=$('<div/>').addClass('n').html(name).appendTo(vps)
        graph=$('<div/>').addClass('graph').appendTo(vps)
	
        $(this.stat('CPU',size,total)).appendTo(graph)
	
	
        $(where).append(vps)
	
    },
    getVPSdata:function(id){
	
        l=VPS.data.vps.length
        for(i=0;i<l;i+=1){
            if(Number(VPS.data.vps[i].id)==id){
                return VPS.data.vps[i];
            }	
		
        }
        return false;	
	
    },
    changedata:function(d){
	
        inp=this.win.data.find('input')
	
        name=$('#inp_vps_host').val()
        cpu=$('#inp_vps_cpu').val()
        ram=$('#inp_vps_ram').val()
        storage=$('#inp_vps_hdd').val()
	
	
        this.next=true
	
        $.each(inp,function(i,e){
      
            if($(e).attr('id')!='invpsip'){
                if($(this).val().length<=0 || $(this).val()==0){
                    VPS.next=false
                    $(this).focus()
                }
            }
            
            
        })
        
    ips=[]
    $.each($('#vpsip div.vpip'),function(i,ip){
        ips.push($(ip).find('span').html())
    });
	
	
	
	
    if(this.next){
        VPS.loading(true)
		
        $.postJSON('basic/device/vps/change',{
            'did':DEVICE.id,
            'name':name,
            'ram':ram,
            'vid':VPS.vpsID,
            'cpu':cpu,
            'hdd':storage,
            'ips':ips.join(';')
        }, function(json) {
            VPS.vpsID=false
		
            VPS.updatewindow(json)	
		
            VPS.win.remove()
            WIN.show('#win_device') //set zindex back to 400
            VPS.loading(false)
		
        });
	
    }
	
},

remove:function(d){
	
    vid=Number($(d).attr('vps_id'))
	
    VPS.loading(true)
	
    $.postJSON('basic/device/vps/remove',{
        'did':DEVICE.id,
        'vid':VPS.vpsID
    }, function(json) {
        VPS.vpsID=false;
        VPS.updatewindow(json)	
		
        VPS.win.remove()
        WIN.show('#win_device') //set zindex back to 400
        VPS.loading(false)
		
    });	
	
},
change:function(d){
    vid=Number($(d).attr('vps_id'))
    vpsdata=this.getVPSdata(vid)
    if(vpsdata){
        VPS.vpsID=vid
	
        this.win=new nocwin('Edit virtual device:'+vpsdata.hostname,'ddd','addvps');	

        this.win.zindex()
        this.win.setid('ip_vps')
                
        d=this.win.data
	
        pre=''
        $(d).html(
            '<fieldset style="margin-top:10px;"><legend></legend></fieldset>'+
            '<fieldset><legend>Device hostname:</legend><input id="inp_vps_host" value="'+vpsdata.hostname+'" class="size_large3"></fieldset>'+
            '<fieldset><legend>Master Node</legend><select disabled class="size_large"></select></fieldset>'+
            '<fieldset id="vps_add_addr" style="position:absolute;width:220px;right:5px;top:37px;height:250px;"><legend>IP addresses:</legend><div style="float:left;"><input id="invpsip" class="size_medium2"></div>'+


            '<div style="float: left;margin-left:10px;"><a href="#" class="abutton" onclick="VPS.addIP(1)"><div tmp="0" class="inner ipedit">add</div></a></div>'+
            '<div id="vpsip"></div>'+

            '</fieldset>'+
            '<div class="sliders" style="width:450px;position:relative;">'+
            '<fieldset><legend>CPU:</legend><div style="float:left;"><input  id="inp_vps_cpu" style="clear:both;" class="size_medium"></div><div id="cpuslide" class="slider"></div></fieldset>'+
            '<fieldset><legend>RAM:</legend><div style="position:absolute;right:19px;"><span style="color:#ccc;">MB</span></div><div style="float:left;"><input  id="inp_vps_ram" class="size_medium"></div><div id="ramslide" class="slider"></div></fieldset>'+
            '<fieldset><legend>STORAGE:</legend><div style="position:absolute;right:19px;"><span style="color:#ccc;">GB</span></div><div style="float:left;"><input  id="inp_vps_hdd" class="size_medium"></div><div id="hddslide" class="slider"></div></fieldset>'+
            '</div><fieldset style="position:absolute;width:260px;height:30px;bottom:5px;right:0px;"><legend></legend>'+
            '<div style="float:left;margin-left:25px;"><a href="#"  class="abutton el_remove"><div tmp="0" class="inner">remove</div></a></div>'+
            '<div style="float:left;margin-left:25px;"><a href="#"  class="abutton el_close"><div tmp="0" class="inner">cancel</div></a></div>'+
            '<div style="float:left;margin-left:25px;"><a href="#"  class="abutton el_ad"><div tmp="0" class="inner">go</div></a></div></fieldset>'

            ).addClass('vpspup')	


        this.populateSelect($(d).find('select'),true)


        if(typeof IPM_device != 'undefined')
            IPM_device.vps(d,vpsdata)
 
	
        //allocated RAM
        wram=vpsdata.ram
        //allocated HDD
        whdd=vpsdata.hdd
        //allocated CPU
        wcpu=vpsdata.cpu

        cpu=VPS.data.cpu_used-wcpu
        ram=VPS.data.ram_used-wram
        hdd=VPS.data.hdd_used-whdd

        this.slider('#cpuslide',cpu,VPS.data.logic,wcpu,false)

        this.slider('#ramslide',ram,VPS.data.memory,wram,false)

        this.slider('#hddslide',hdd,VPS.data.localStorage,whdd,false)


        this.updateIPsPool(vpsdata.ip)
	
	
        //close win
        $(this.win.div).find('div.win_close').click(function(){
            VPS.win.remove()
            WIN.show('#win_device') //set zindex back to 400
        });
        //add element
        $(this.win.div).find('a.el_ad').click(function(){
            VPS.changedata(this)
        });

        //remove
        $(this.win.div).find('a.el_remove').click(function(){
            VPS.remove(this)
        });
	
	
        //cancel
        $(this.win.div).find('a.el_close').click(function(){
            VPS.win.remove()
            WIN.show('#win_device') //set zindex back to 400
        });	
			
		
		
		
		
		
    }



	
},

addElement:function(div,action,name){
	
    el=$('<div/>').css({
        'float': 'left',
        'margin': '20px 0px 15px 10px'
    }).html('<a onclick="'+action+'" class="abutton addVPS" href="#"><div class="inner ipedit" tmp="0">'+name+'</div></a>')
    $(div).append(el)
},

add:function(type){
	
    switch(type){
        case 1:
            er=[]
            next=true
	
            //check resources
            //ram
            if(VPS.data.ram_used>=VPS.data.memory){
                next=false;
                er.push('ram');
            }
            //cpu
            if(VPS.data.cpu_used>=VPS.data.logic){
                next=false;
                er.push('cpu');
            }
		
            //hdd
            if(VPS.data.hdd_used>=VPS.data.localStorage){
                next=false;
                er.push('storage');
            }
		
            if(next)
                VPS.addnewvps()
            else
            {
                alert('There is no available resource('+er.join(',')+')  on Master node!')	
            }	
	
            break;
        case 2:
            VPS.addnewstorage()	
            break;
	
    }
		
//nocwin
	
//vps
	
//storage	
	
},

setnew:function(){
        
	
        

    //we wish allocate 512MB at start
    wram=512
    aram=VPS.data.memory-VPS.data.ram_used
    if(aram<=wram)
        wram=aram	
    //we wish allocate 512MB at start
    whdd=100
    ahdd=VPS.data.localStorage-VPS.data.hdd_used
    if(ahdd<=whdd)
        whdd=ahdd	
        
    name='new vps'
    cpu=1
        
    next=true
	
        
	
    ips=[]
        
	
    if(next){
            
		
        $.postJSON('basic/device/vps/new',{
            'did':DEVICE.id,
            'name':name,
            'ram':wram,
            'cpu':cpu,
            'hdd':whdd,
            'ips':ips.join(';')
        }, function(json) {
		
		
            VPS.updatewindow(json)	
		
		
        });
	
    }
	
	
	
	
	
},
loading:function(key){
    if(key)
        $('#win_vps div.win_icon').addClass('deviceLoader').removeClass('default');
    else
        $('#win_vps div.win_icon').removeClass('deviceLoader').addClass('default');
},
setValue:function(d){
    sl=$(d).position().left
    sw=$(d).parent().width()-10
    smin=Number($(d).parent().attr('min'))
    smax=Number($(d).parent().attr('max'))
    su=smax-smin
    //console.info(min,max,l,w)
	
    sdx=su/sw
    sm=Math.round(sdx*sl)
	
    sinp=$(d).parent().parent().parent().find('input')
    sinp.val(sm).attr('data',sm)
	
	
	
},
updatePosition:function(inp,val,min,max){
    s=$(inp).parent().parent().find('div.slider')
    $(s).html('')
	
    VPS.slider($(s), min, max, val,false)
	
},
slider:function(div,min,max,val,up){
	
    //min
    //max
    dmin=min
    if(up){
        dmin=min-val
    }
	
    dx=300/max;
    l=Math.round((dmin)*dx)
	
    w=300-l
	
    v=Math.round(val*dx)
	
    inp=$(div).parent().find('input')
    inp.val(val).attr('data',val)
    inp.bind('focus blur keydown',function(e){
        if(e.type=='keydown'){	
            if(e.keyCode==13){
                $(this).blur()
            }
        }	
        if(e.type=='blur'){
			
            v=Number($(this).val())
            min=Number($(this).attr('min'))
            max=Number($(this).attr('max'))
            data=Number($(this).attr('data'))
            mx=max-min
			
			
            if(v<=mx && v>=0){
                VPS.updatePosition(this,v,min,max)
            }else{
                $(this).val(data)	
				
            }
			
			
        }
		
    }).attr({
        'min':min,
        'max':max
    });
	
    back=$('<div/>').addClass('back').appendTo($(div))
	
	
    num=$('<div/>').addClass('num').html(0).appendTo($(div))
    if(l>0)
        num=$('<div/>').addClass('num').css({
            'left':l+'px'
        }).html(dmin).appendTo($(div))
	
    num=$('<div/>').addClass('num').css({
        'right':'1px'
    }).html(max).appendTo($(div))
    occupied=$('<div/>').addClass('occupied').css({
        width:l+'px'
    }).appendTo($(div))
	
	
	
    boundary=$('<div/>').addClass('boundary').attr({
        'min':(dmin),
        'max':max
    }).css({
        'left':l+'px',
        width:w+'px'
    }).appendTo($(div))
    take=$('<div/>').addClass('take').css({
        width:v+'px'
    }).appendTo(boundary)
    /*
	clickarea=$('<div/>').addClass('clickarea').appendTo(boundary)
	for(i=1;i<=10;i++){
		area=$('<div/>').addClass('area').appendTo(clickarea)
		area.click(function(){
			
			console.log($(this).position().left)
		})
	}
	*/
	
	
    drob=$('<div/>').addClass('drob').appendTo(boundary)
	
	
    sw=w-10
    su=max-min
    sdx=su/sw
    ll=Math.round(val/sdx)
    drob.css({
        'left':(ll)+'px'
    })
	
    drob.draggable({
        containment: 'parent',
        "snap": true, 
        "axis":'x',
        start: function(event, ui) { 
		

        },
        drag:function(){
		
            take=$(this).parent().find('div.take')
            take.css('width',$(this).position().left+'px')
		
            VPS.setValue(this)
        },
        stop:function(event, ui) { 
		

        }
    });
	
//this.setValue(drob)
	
	
	
		
},
sumIP:function(s){

    var octs = s.split('.');
          
    var sums = 0;
    $.each(octs,function(i,oct) {
        sums += Number(oct) * Math.pow(256, (octs.length - 1) - i);
    });
    return sums;
       
},

isipset:function(ip){
    next=true;
    $.each($('#vpsip div.vpip'),function(i,div){
        tt=$(div).find('span').text()	
        if(VPS.sumIP(tt)==VPS.sumIP(ip)) next=false;
		
		
    });
	
    return next;
},

updateVpsData:function(data){
    var total=VPS.data.vps.length
    for(i=0;i<total;i++){
        console.log(data.vps,VPS.data.vps[i].id)
        if(data.vps==VPS.data.vps[i].id){
          console.log('>>set')
          VPS.data.vps[i].ip.push({id:data.id,data:data.val})
        }
    }
    
},


addIP:function(){
	
    val=$('#invpsip').val()
	
	
    var ip = "^([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])$";
    valid=val.match(ip);

  
   
    if(valid!=null && this.isipset(val)){
            
             
             
        $.postJSON('basic/device/vps/addip',{
            'vps':VPS.vpsID,
            'val':val
        }, function(data) {
		
            console.log(data)
           
            ips=$('#win_device_layer7_1').find('div.vps[vps_id='+data.data.vps+'] div.ip div')
                            console.log(ips)
                            ht=$(ips).html()
                            $(ips).html(ht+'; '+data.data.val)
                            new_ip=$('<div/>').addClass('vpip').attr('ipid',data.data.id).html('<span>'+data.data.val+'</span><div class="rem" onclick="VPS.remip(this)">remove</div>')
                            
                            $('#vpsip').append($(new_ip))
                            VPS.updateVpsData(data.data)
		
        });


    }else{
        if(valid==null)
            alert('Please input valid IPv4 address')
        else
            alert('This IP is already taken !')	
		
    }
},
remip:function(s){
    id=$(s).parent().attr('ipid')
    $(s).parent().remove()
    VPS.remVpsData(id, VPS.vpsID)
    $.postJSON('basic/device/vps/remip',{
            'vps':VPS.vpsID,
            'val':id
        }, function(data) {
           
           
    
           
        });   
    
	
},
remVpsData:function(id,vpsid){
    var total=VPS.data.vps.length
    valid=[]
    out=[]
    for(i=0;i<total;i++){
        
        if(vpsid==VPS.data.vps[i].id){
          
          $.each(VPS.data.vps[i].ip,function(ii,ee){
          
              if(ee.id!=id){
              out.push(ee.data)   
              valid.push(ee)
              }
          })
          VPS.data.vps[i].ip=valid
      ips=$('#win_device_layer7_1').find('div.vps[vps_id='+vpsid+'] div.ip div')
    
        $(ips).html(out.join('; ')) 
         
        }
    }
    
    
     
     
     
    
    
},
updateIPsPool:function(ips){
	
    $.each(ips,function(i,ip){
			
        $('<div/>').addClass('vpip').attr('ipid',ip.id).html('<span>'+ip.data+'</span><div onclick="VPS.remip(this)" class="rem">remove</div>').appendTo($('#vpsip'))
			
    });
	
	
	
	
},

setstorages:function(data){
	
	
    storages=data.storages
    console.log(storages)
    $('#vpsstorages').html('')
    to=storages.length
	
    for(i=0;i<to;i++){
        VPS.makestorage('Network: '+storages[i].hostname,Math.round(Math.random()*100),'','#vpsstorages')
			
    }
	
	
    $('#vpsstorages').find('div.storage').click(function(){
		
        $('#vpsstorages').find('div.storage').removeClass('selected')
        $(this).addClass('selected')
		
    });
	
	
},
getRackStorages:function(rack){
    $.postJSON('basic/device/vps/storages',{
        'rack':rack
    }, function(json) {
		
		
        VPS.setstorages(json)
		
		
    });
		
	
},
addnewstorage:function(){
	
    this.win=new nocwin('Add new storage to master node','','addstorage');	

    this.win.zindex()
    d=this.win.data
    pre=''
    $(d).html(
        '<fieldset style="margin-top:10px;"><legend></legend></fieldset>'+
        '<fieldset><legend>Rack:</legend><select  class="size_large racks"><option>rack1</option><option>rack2</option></select></fieldset>'+
        '<fieldset><legend>Storage</legend><div id="vpsstorages">'+	
        '</div></fieldset>'+
		
        '<fieldset style="position:absolute;bottom:10px;right:10px;"><legend></legend>'+
        '<fieldset style="position:absolute;width:160px;height:30px;bottom:-5px;right:20px;"><legend></legend>'+
        '<div style="float:left;margin-left:25px;"><a href="#"  class="abutton el_close"><div tmp="0" class="inner">cancel</div></a></div>'+
        '<div style="float:left;margin-left:25px;"><a href="#"  class="abutton el_ad"><div tmp="0" class="inner">go</div></a></div></fieldset>'
        ).css({
        'height':'350px'
    });	
	
	
    NETWORK.racks($(d).find('select.racks'),'',true)
	
	
    $(d).find('select.racks').change(function(){
	
        VPS.getRackStorages($(this).val())
		
		
    });
	
	
    //close win
    $(this.win.div).find('div.win_close').click(function(){
        VPS.win.remove()
        WIN.show('#win_device') //set zindex back to 400
    });
    //add element
    $(this.win.div).find('a.el_ad').click(function(){
        //VPS.setnew(this)
        });

    //cancel
    $(this.win.div).find('a.el_close').click(function(){
        VPS.win.remove()
        WIN.show('#win_device') //set zindex back to 400
    });	
},
getMasterNodes:function(){
    servers=$('#row div.equ1')
    nodes=[]
    $.each(servers,function(i,node){
		
        id=$(node).attr('id').replace('rack_unit','')
        name=$(node).find('div.name').text()
        nodes.push({
            'id':id,
            'name':name
        })
		
		
    });
	
    return nodes;
},
populateSelect:function(select,action){
    m='';
    $.each(this.getMasterNodes(),function(i,node){
        m+='<option value="'+node.id+'">'+node.name+'</option>';

    });	

    $(select).html(m)
    $(select).val(DEVICE.id)

    if(action)
        $(select).change(function(){
		
		
            });
	
	
},

addnewvps:function(){
    
    this.setnew();
    
},

addnewvpsold:function(){

	
    this.win=new nocwin('Add new virtual device to master node','hh','addvps');	

    this.win.zindex()
	

    d=this.win.data
    pre=''
    $(d).html(
        '<fieldset style="margin-top:10px;"><legend></legend></fieldset>'+
        '<fieldset><legend>Device hostname:</legend><input value="'+pre+'" class="size_large3"></fieldset>'+
        '<fieldset><legend>Master Node</legend><select disabled class="size_large"></select></fieldset>'+
        '<fieldset id="vps_add_addr" style="position:absolute;width:220px;right:5px;top:37px;height:250px;"><legend>IP addresses:</legend><div style="float:left;"><input id="invpsip" class="size_medium2"></div>'+


        '<div style="float: left;margin-left:10px;"><a href="#" class="abutton" onclick="VPS.addIP(1)"><div tmp="0" class="inner ipedit">add</div></a></div>'+
        '<div id="vpsip"></div>'+

        '</fieldset>'+
        '<div class="sliders" style="width:450px;position:relative;">'+
        '<fieldset><legend>CPU:</legend><div style="float:left;"><input style="clear:both;" class="size_medium"></div><div id="cpuslide" class="slider"></div></fieldset>'+
        '<fieldset><legend>RAM:</legend><div style="position:absolute;right:19px;"><span style="color:#ccc;">MB</span></div><div style="float:left;"><input class="size_medium"></div><div id="ramslide" class="slider"></div></fieldset>'+
        '<fieldset><legend>STORAGE:</legend><div style="position:absolute;right:19px;"><span style="color:#ccc;">GB</span></div><div style="float:left;"><input class="size_medium"></div><div id="hddslide" class="slider"></div></fieldset>'+
        '</div><fieldset style="position:absolute;width:160px;height:30px;bottom:5px;right:40px;"><legend></legend>'+
        '<div style="float:left;margin-left:25px;"><a href="#"  class="abutton el_close"><div tmp="0" class="inner">cancel</div></a></div>'+
        '<div style="float:left;margin-left:25px;"><a href="#"  class="abutton el_ad"><div tmp="0" class="inner">go</div></a></div></fieldset>'

        ).addClass('vpspup')


    this.populateSelect($(d).find('select'),true)

    if(typeof IPM_device != 'undefined')
        IPM_device.vps(d,false)
 

    this.slider('#cpuslide',VPS.data.cpu_used,VPS.data.logic,1,false)

    //we wish allocate 512MB at start
    wram=512
    aram=VPS.data.memory-VPS.data.ram_used
    if(aram<=wram)
        wram=aram	
    //we wish allocate 512MB at start
    whdd=100
    ahdd=VPS.data.localStorage-VPS.data.hdd_used
    if(ahdd<=whdd)
        whdd=ahdd	


    this.slider('#ramslide',VPS.data.ram_used,VPS.data.memory,wram,false)

    this.slider('#hddslide',VPS.data.hdd_used,VPS.data.localStorage,whdd,false)


    //close win
    $(this.win.div).find('div.win_close').click(function(){
        VPS.win.remove()
        WIN.show('#win_device') //set zindex back to 400
    });
    //add element
    $(this.win.div).find('a.el_ad').click(function(){
        VPS.setnew(this)
    });

    //cancel
    $(this.win.div).find('a.el_close').click(function(){
        VPS.win.remove()
        WIN.show('#win_device') //set zindex back to 400
    });	
	
	
},
updatewindow:function(data){
    //console.log('vps data..')
    VPS.data=data
	
    //create vps
    $('#win_device_layer7_1').html('')
	
	
	
	
    m={
        'id':'',
        'hostname':'Total resource allocation of master node',
        'ram':data.ram_used,
        'hdd':data.hdd_used,
        'cpu':data.cpu_used
    }
    VPS.makevps(m,data.logic,data.memory,data.localStorage,'','total')
	
	
    $.each(data.vps,function(i,vps){	
        VPS.makevps(vps,data.logic,data.memory,data.localStorage,vps.ip,'')	
    });
	
	
    $('#win_device_layer7_1 div.vps').click(function(){
		
        VPS.change(this)	
		
    });


    VPS.addElement('#win_device_layer7_1','VPS.add(1)','add virtual device')
		
	
    //storage
    $('#win_device_layer7_2').html('')
    VPS.makestorage('Storage allocation',data.hdd_used,data.localStorage,'localstorage','#win_device_layer7_2')
			
		
    //summary
    VPS.updateSummary()	
	
    //map	
		
    this.plotgraph()	
		
		
    NOC.hintset('win_device_layer7')		

	
},
load:function(){
   DEVICE.loadings(true)
    //load data from server
    $.postJSON('basic/device/vps',{
        'did':DEVICE.id
    }, function(data) {
       
      VPS.updatewindow(data)		
      DEVICE.loadings(false)
        
    });
	
},

init:function(){
    this.percentColors = [
    {
        pct: 0.0, 
        color: {
            r: 0xad, 
            g: 0xff, 
            b: 0x64
        }
    },
    {
        pct: 0.5, 
        color: {
            r: 0xff, 
            g: 0xe6, 
            b: 0x64
        }
    },
    {
        pct: 1.0, 
        color: {
            r: 0xff, 
            g: 0x9a, 
            b: 0x64
        }
    } ];
	
	

}



}