var WIN={
    
    /**
 *
 **/

    addMenu:function(win,name){
        //this.    
        ul=$('#'+win).find('div.win_menu ul')
        l=$(ul).find('li').size()+1
        li=$('<li layout="'+l+'">'+name+'</li>')
        $(ul).append(li)
    
        $(li).click(function(){
	
            WIN.menuaction(this)
        });	
    
        return l
    
    },

    addLayer:function(win,num){
        //this.    
    
        wd=$('#'+win).find('div.win_data')
       // console.log(wd)
    
        $(wd).append('<div id="'+win+'_layer'+num+'" class="win_layer win_layer_custom"></div>')
    
    },

    e_return:function(e,key){
	
	
        if(e && key==0){
            BUILDING.remove()	
        }
        if(e && key==1){
            DEVICE.remove(true)		
        }
        if(e && key==2){
            TEMPLATE.e_remove(true)		
        }
        if(e && key==3){
            RACK.removeRack()		
        }
				
        if(e && key==4){
            WIKI.rem()		
        }
		
        if(e && key==5){
            WIKI.catrem()		
        }
	
	
        $(this.eprompt.div).remove()
        this.eprompt=false;
	
	
	
        $('#win_mask2').hide()
    },
    prompt:function(titl,text,key){
        //create new instance
        $("div.win").css("z-index",398);
	
        $('#win_mask2').show()
        this.eprompt=new nocwin(titl,text,'prompt',key)

    },


    makeTab:function(item,ul,count,act){
        
        m=$('<li/>').attr('layout',count).html(item.title)
        if(act==count){
            $(m).addClass('aktive')
        }
		
        $(ul).append($(m))		
		
	
    },
    activateTab:function(win,tnum){
	
        $(win).find("div.win_menu li").removeClass('aktive');

        items=$(win).find("div.win_menu li")
	
        tt=tnum
        if(!DEVICE.editmode && tnum==0){
            tt=1	
        }
        $.each(items, function(i,tab){
		
		
		
		
            if($(tab).attr('layout')==tt){
                $(tab).addClass('aktive');
            }
		
		
        });
	
	

		
        $(win).find('div.win_layer').removeClass('win_visible')
        $('#'+$(win).attr('id')+'_layer'+tnum).addClass('win_visible')



	
	
    },	

	
    emptydata:function(d){
        if(d=='') d='-'
        return d
    },	
	
    addHddRow:function(d,tr,c){
        $(tr).attr('row',d.id)
        $('<td align="left" width="20"></td>').html(c+'.').appendTo(tr)
        $('<td width="10%"></td>').html(this.emptydata(d.vport)).appendTo(tr)
        $('<td></td>').html(this.emptydata(d.size)).appendTo(tr)
        $('<td></td>').html(this.emptydata(d.model)).appendTo(tr)
        $('<td></td>').html(this.emptydata(d.serial_number)).appendTo(tr)
		
    },
	
    hddfield:function(items,div){

        tab=$('<table></table>').attr({
            'cellspacing':0,
            'cellpadding':0,
            'width':'100%'
        }).appendTo(div)
	
        hrow=$('<tr/>').css('text-transform','uppercase').html(
            '<td align="left" width="20">&nbsp;</td>'+
            '<td width="10%">VPort</td>'+
            '<td width="15%">Size</td>'+
            '<td width="35%">Model / Type</td>'+
            '<td width="35%">Serial Number</td>').appendTo(tab)
			
        $.each(items,function(i,e){
				
				
            tr=$('<tr></tr>')
            WIN.addHddRow(e,tr,i+1)
				
            tr.appendTo(tab)
				
        });
	
	
	
	
	
	
    },	

    addRamRow:function(d,tr,c){
        $(tr).attr('row',d.id)
        $('<td align="left" width="20"></td>').html(c+'.').appendTo(tr)
        $('<td width="10%"></td>').html(this.emptydata(d.port)).appendTo(tr)
        $('<td></td>').html(this.emptydata(d.size)).appendTo(tr)
        $('<td></td>').html(this.emptydata(d.model)).appendTo(tr)
        $('<td></td>').html(this.emptydata(d.serial_number)).appendTo(tr)
	
    },

    ramfield:function(items,div){

        tab=$('<table></table>').attr({
            'cellspacing':0,
            'cellpadding':0,
            'width':'100%'
        }).appendTo(div)

        hrow=$('<tr/>').css('text-transform','uppercase').html(
            '<td align="left" width="20">&nbsp;</td>'+
            '<td width="10%">Port</td>'+
            '<td width="15%">Size</td>'+
            '<td width="35%">Model / Type</td>'+
            '<td width="35%">Serial Number</td>').appendTo(tab)
		
        $.each(items,function(i,e){
			
			
            tr=$('<tr></tr>')
            WIN.addRamRow(e,tr,i+1)
			
            tr.appendTo(tab)
			
        });






    },	
	
    switchTypeReadOnly:function(field,el){
        switch(field.element){
	
            case 'checkbox':
	
                activ='No'
                ac=0;	
                if(field.value!='' && field.value!=0){
                    activ='Yes';
                    ac=1;
                }
			
                //ck=$('<div/>').attr({'act':ac,'fc':field.action}).addClass('check_box').html('<div class="icons'+activ+'"></div>').appendTo(el)
                ck=$('<div/>').attr({
                    'act':ac,
                    'fc':field.action
                    }).addClass('default').html(activ).appendTo(el)
			
                /*
			$(ck).click(function(){
			
			
			if($(this).attr('fc')=='device'){
				DEVICE._checkbox(this)	
			}else{
				TEMPLATE._checkbox(this)
			}
			
			
			
		});
			*/
		
                break;
	
	
            case 'hdd':
                ff=$('<div/>').addClass(cl).appendTo(el)	
                discs=$('<div/>').addClass('disc_array').appendTo(el)
                val=field.value
                if(field.value==''){
                    val='-'
                    }
                ff.text(val)

                WIN.hddfield(field.items,discs)
					
		
                break;
	
	
            case 'ram':
                ff=$('<div/>').addClass(cl).appendTo(el)	
                discs=$('<div/>').addClass('disc_array').appendTo(el)
                val=field.value
                if(field.value==''){
                    val='-'
                    }
                ff.text(val)

                WIN.ramfield(field.items,discs)
					
		
                break;
	
	
	
            case 'img':
                $(el).addClass('button_element')
                im=$('<div/>').addClass('img_container').appendTo(el)
		
                if(field.items){
                    $.each(field.items,function(i,e){
		
                        WIN.addImageField(im,e)	
			
                    })
                }
		
		
		
                $('<div class="upl_tr"><div style="float:left;clear:both;margin-left:10px;"><a href="#" class="abutton imgupl"><div class="inner">upload</div></a></div></div>').appendTo(el)
		
		
                break;
	
            case 'print':
                $(el).addClass('button_element')
                ac=0
                m=$('<div/>').addClass('print_checkboxs').appendTo(el)
		
                ck=$('<div/>').attr({
                    'act':1,
                    'm':1
                }).addClass('check_box').html(
                    '<div class="icons active"></div><div class="name">Hardware</div>').appendTo(m)
			
				
                ck=$('<div/>').attr({
                    'act':1,
                    'm':2
                }).addClass('check_box').html(
                    '<div class="icons active"></div><div class="name">Network</div>').appendTo(m)
                ck=$('<div/>').attr({
                    'act':0,
                    'm':3
                }).addClass('check_box').html(
                    '<div class="icons"></div><div class="name">Notes</div>').appendTo(m)
		
                $(m).find('div.check_box').click(function(){
                    PRINT._checkbox(this)
                    })	
				
		
                //hi=$('<button>').addClass('toPDF').text('export').appendTo(el)
		
                hi=$('<div/>').css({
                    'float':'left',
                    'clear':'both',
                    'margin-left':'10px',
                    'margin-top':'10px'
                }).html('<a href="#" class="abutton toPDF"><div class="inner">export</div></a>').appendTo(el)
		
		
		
                break;
	
            default:
		
                cl='default'
                if(field.element=='textarea'){
                    cl+='2'	
                }
		
                ff=$('<div/>').addClass(cl).appendTo(el)	
                val=field.value
                if(field.value==''){
                    val='-'	
			
                }
                ff.html(this.nl2br(val))
	
                //if()
                break;
	
        }
		
		
    },

    nl2br:function(str) {   
        var breakTag = '<br>';    
        return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
    },
	
    switchType:function(field,el){
		
        console.log(field)
	
        switch(field.element){
            case 'select':
                ff=$('<'+field.element+'/>').attr('autocomplete','off').appendTo(el)	
                if(field.width){
                    $(ff).css('width',field.width+'px')
				
                }
			
                for(var i=field.min;i<=field.max;i++){
			
                    o=$('<option>'+i+'</option>').val(i).appendTo(ff)	
				
                    if(field.value==i){
                        o.attr('selected','selected')
					
                    }
				
                }
			
			
                break;
		
            case 'eselect':
                ff=$('<select/>').attr('autocomplete','off').addClass('eselect select85').appendTo(el)	
			
			
                data=field.struc.split(',')
                $.each(data,function(i,e){
				
                    o=$('<option>'+e+'</option>').val(e).appendTo(ff)	
				
                    if(Number(field.value)==Number(e)){
                        o.attr('selected','selected')
					
                    }	
                });
			
                /*
			for(var i=field.min;i<=field.max;i++){
			
				o=$('<option>'+i+'</option>').val(i).appendTo(ff)	
				
				if(field.value==i){
					o.attr('selected','selected')
					
				}
				
			}
			*/
			
                break;
		
			
			
            case 'power_out':
			
                $(el).addClass('button_element font_small')
			
                $('<div/>').css({
                    'float':'left',
                    'clear':'both',
                    'margin-left':'10px',
                    'margin-top':'10px'
                }).html('<a href="#" class="abutton toPower"><div class="inner">edit sockets</div></a>').appendTo(el)
						
			
                break;	
			
            case 'checkbox':
			
			
                activ=''
                ac=0;	
                if(field.value!='' && field.value!=0){
                    activ=' active';
                    ac=1;
                }
                ck=$('<div/>').attr({
                    'act':ac,
                    'fc':field.action
                    }).addClass('check_box').html('<div class="icons'+activ+'"></div>').appendTo(el)
				
					
					
                $(ck).click(function(){
					
					
						
						
                    if($(this).attr('fc')=='device'){
                        DEVICE._checkbox(this)	
                    }else{
                        TEMPLATE._checkbox(this)
                    }
					
					
					
                });
			
			
                break;
            case 'hdd':
                $(el).addClass('button_element font_small')
                hi=$('<input  disabled>').appendTo(el)
                $('<div/>').addClass('icon_button hdd_icon').appendTo(el)
                if(field.value){
                    hi.val(field.value)
                }
				
                break;
            case 'print':
                $(el).addClass('button_element')
                ac=0
                m=$('<div/>').addClass('print_checkboxs').appendTo(el)
			
                ck=$('<div/>').attr({
                    'act':1,
                    'm':1
                }).addClass('check_box').html(
                    '<div class="icons active"></div><div class="name">Hardware</div>').appendTo(m)
				
					
                ck=$('<div/>').attr({
                    'act':1,
                    'm':2
                }).addClass('check_box').html(
                    '<div class="icons active"></div><div class="name">Network</div>').appendTo(m)
                ck=$('<div/>').attr({
                    'act':0,
                    'm':3
                }).addClass('check_box').html(
                    '<div class="icons"></div><div class="name">Notes</div>').appendTo(m)
			
                $(m).find('div.check_box').click(function(){
                    PRINT._checkbox(this)
                    })	
					
			
                //hi=$('<button>').addClass('toPDF').text('export').appendTo(el)
			
                hi=$('<div/>').css({
                    'float':'left',
                    'clear':'both',
                    'margin-left':'10px',
                    'margin-top':'10px'
                }).html('<a href="#" class="abutton toPDF"><div class="inner">export</div></a>').appendTo(el)
			
			
			
                break;	
			
            case 'network':
			
                $(el).addClass('button_element font_small')
			
                $('<div/>').css({
                    'float':'left',
                    'clear':'both',
                    'margin-left':'10px',
                    'margin-top':'10px'
                }).html('<a href="#" class="abutton toIP"><div class="inner">edit ports</div></a>').appendTo(el)
			
                //$('<button>').addClass('toIP').text('edit').appendTo(el)
			
			
                break;
			
            case 'ram':
                $(el).addClass('button_element font_small')
                hi=$('<input  disabled>').appendTo(el)
                $('<div/>').addClass('icon_button ram_icon').appendTo(el)
                if(field.value){
                    hi.val(field.value)
                }
				
			
                break;	
            case 'img':
                $(el).addClass('button_element')
                im=$('<div/>').addClass('img_container').appendTo(el)
			
                if(field.items){
                    $.each(field.items,function(i,e){
			
                        WIN.addImageField(im,e)	
				
                    })
                }
			
			
			
                $('<div class="upl_tr"><div style="float:left;clear:both;margin-left:10px;"><a href="#" class="abutton imgupl"><div class="inner">upload</div></a></div></div>').appendTo(el)
			
			
                break;		
            default:
                ff=$('<'+field.element+'/>').attr('autocomplete','off').appendTo(el)	
                if(field.value){
                    ff.val(field.value)
				
                }
                //if()
                break;
        }
			
		
    },	




    parseElements:function(what,where,name){

        $.each(what, function(i,field){
            
            if(field.field){
		
			
                if(name=='win_device' && DEVICE.editmode && field.static!=1){
                    f=$('<fieldset/>').attr({
                        'eid':field.eid,
                        'tab':DEVICE.menuActive
                        }).appendTo(where)
                    leg=$('<legend/>').addClass('fieldmenu').appendTo(f)
                    leg.html('<a class="menu_a" href="#"><div class="name">'+field.field+'</div><ul class="field_submenu"><li m="1">rename</li><li m="2">delete</li></ul></a>')
			
		
			
			
				
                    DEVICE.action(f)		
			
                }else{
		
                    if(field.nolegend!='ok'){	
                        l=$('<legend/>').html(field.field)
                        f=$('<fieldset/>').append(l)
                    }else{
                        f=$('<fieldset/>')
			
                    }
		 
		 
                    f.appendTo(where)
                }
		
               
			
            }else{
                f=where
            }
		
            if(field.eid){
			
                $(f).attr('eid',field.eid)	
            }
		
            if(field.act){
			
                $(f).attr('act',field.act)	
            }
                
            if(field.element){
				
                if(field.element!='none' ){	
				
                    el=$('<div/>').addClass('element').appendTo(f)
                        
                    if(name=='win_device' && !DEVICE.editmode){
                                                
                        WIN.switchTypeReadOnly(field, el)	
                    }else{
                        WIN.switchType(field, el)
                        }
			
                //el=$('<'+field.element+'/>').appendTo(f)
			
			
                }else{
                    el=f
                    }
		
                if(field.text){
                    $(el).html(field.text)
			
                }
		
                //special stuff	
                if(field.special=='kvmfield'){
			
                    KVM.json=field
                    f= KVM.makeField(field,el);
			
                }
		
                //special stuff	
                if(field.special=='inkvmfield'){
			
                    KVM.json=field
                    f= KVM.onlyInputField(field,el);
			
                }
		
		
                if(field.special=='powerfield'){
			
                    POWER.json=field
                    f= POWER.makeField(field,el);
			
                }
			
                if(field.special=='inpowerfield'){
			
                    POWER.json=field
                    f=POWER.onlyInputfield(field,el);
			
                }
		
		
                if(field.special=='powerintable'){
                    f= POWER.inputTable(field,el);
			
                }
                if(field.special=='powerouttable'){
                    f= POWER.outputTable(field,el);
			
                }
		
                if(field.special=='kvmintable'){
                    f= KVM.inputTable(field,el);
			
                }
                if(field.special=='kvmouttable'){
                    f= KVM.outputTable(field,el);
			
                }             
		
                if(field.special){
                    if(field.special=='portfield'){
				
                        f= IP.makeField(field,el);
				
                    }
		    
                    if(field.special=='mactable'){
                        f= IP.makeMACTable(field,el);
				
                    }
				
                    if(field.special=='ipfield'){
                        el=$('<div/>').addClass('element').appendTo(f)
				
                        f= IP.makeIPField(field,el);
				
                    }
                    
                    if(field.special=='panelfield'){
                        
                        el=$('<div/>').addClass('element').appendTo(f)
				
                        //field.data=tempdata
                        
                        console.log("panelfield",field)
                        
                        PANEL.makePANELField(field,el);
                        
                    }
                                
                    if(field.special=='paneltable'){
                       PANEL.makePANELTable(field,el);
				
                    }
                    
                    if(field.special=='macfield'){
                        //virtual ipv4
                        /*
                        tempdata=field.data
                        iel=$('<div/>').addClass('element').appendTo(f)
				
                        field.data=field.ips
                        IP.makeIPFieldextra(field,iel);
                        
                        */
                        el=$('<div/>').addClass('element').appendTo(f)
				
                        //field.data=tempdata
                        
                        IP.makeMACField(field,el);
                        
                                
                        
			
                        
				
                    }
                    if(field.special=='config'){
                        $('<textarea/>').html(field.values).appendTo(f)
                        b=$('<button/>').html('save').appendTo(f)
                        $(b).click(function(){
                            NETWORK.configSet(this)
				
                        })	
                    }
			
			
                    if(field.special=='iptable'){

                        f= IP.makeIPTable(field,el);
				
                    }
			
			
			

                    if(field.special=='vlan'){
                        f= IP.vlan(field,el);
				
                    }
	
                }	

			
				
				
                if(field.class) el.addClass(field.class)
                if(field.value) el.val(field.value)
                if(field.name) el.html(field.name)
                //if(field.action) el.attr('onclick',field.action)
                if(field.items){
					
                    m= new WIN.parseElements(field.items,el,name)
					
					
                }
            }
        });
	
    },

    addImageField:function(im,el){
        pr=''
        if(el.tmpl){
            pr='temp'
            }
        path=mainpath+'images/tumb/';
        if(typeof PLUGIN!='undefined') path=PLUGIN.path+'public/'+path;
		
		
        d=$('<div/>').addClass('dev_img').html('<div class="wraper"><div  im="'+el.id+'" tmp="'+el.tmpl+'" class="remove icons"></div><img type="'+el.type+'" w="'+el.w+'" h="'+el.h+'"  src="'+path+pr+el.id+'.png"></div>').appendTo(im)


		
		
		
        $(d).find('img').bind('click',function(){
            WIN.showIMG(this)
			 
			 
        });

        $(d).find('div.remove').bind('click',function(){
            WIN.removeIMG(this)
				 
				 
        });

		
	
			
    },	
	

    parseTab:function(from,where,data,name){
	
	
	
	
        $.postJSON('basic/'+from,data, function(json) {
            //clear container
            $(where).html('')
		
            //get notes
            switch(json.route){
                //route to device notes
                case 4:
                    DEVICE.notes(json)	
                    break;	
		
                default:
                    parse=new WIN.parseElements(json.items,where,name)
                    break;
            }
		
		
		
        }).complete(function() {
		
            switch(name){
                case 'win_device':
                    DEVICE.loadFinish(where);
                    WIN.elementActionSet(where)
                    break;
                case 'win_ip':
                    IP.loadFinish();
                    break;
            }
		
		
		
		
		
		
        });	
	
	
    },	
	
	
    parseData:function(from,name,where,tab_num,make_tabs,data){
        this.tab=tab_num;
	
        $.postJSON('basic/'+from,data, function(json) {
            WIN.json=json
            if(make_tabs) {
                //empty window navig
	
                menu=$('#'+name).find("div.win_menu")
                $(menu).html('')
                ul=$('<ul/>').attr('win',name)
                $(ul).appendTo(menu)
	
                //set 1st item as active
                act=1;
                count=1
            }


            if(json.extend){
                switch(name){
                    case 'win_ip':
                        IP.json=json
                        IP.data=json.data
                        IP.ips=json.ips
                        IP.data2=json.data2
                        IP.cables=json.cables
                        break;
                    case 'win_power':
                        POWER.json=json
                        POWER.data=json.data
                        POWER.cables=json.cables
                        POWER.splitSockets()
		
		
                        break;
                    case 'win_kvm':
                        KVM.json=json
                        KVM.data=json.data
                        KVM.cables=json.cables
                        KVM.splitSockets()
			
			
                        break;
		
                    case 'win_device':
                        DEVICE.json=json
		
                        break;
                        
                    case 'win_panel':
                        PANEL.json=json
                        PANEL.cables=json.cables
                        break;
                }
	
            }
            
            where.html('')	
            var items = [];
            
            
            $.each(json.items, function(i,item){		//tabs
                
                
                tab=$('<div/>').addClass('win_layer').attr('id',name+'_layer'+WIN.tab)
                tab.appendTo(where)	

                if(make_tabs) {
			
                    if(WIN.tab==act){
                        tab.addClass('win_visible')
                        }
                    
                    WIN.makeTab(item,ul,count,act)
                    count++;
			
			
			
                }
                
               
                parse=new WIN.parseElements(item.items,tab)	
                WIN.tab++;			
		
		
            });	
            
            if(make_tabs) {
	
                WIN.action(1,name)
	
            }
		
		
		
		
		
        }).success(function() { 
			
            })
        .error(function(jqXHR, textStatus, errorThrown) { 
            console.error("error in load data: " + textStatus);

        })
        .complete(function() {
            
            switch(name){
                case 'win_device':
                    DEVICE.loadFinish();
                    WIN.elementActionSet(name)
                    break;
                case 'win_ip':
                    IP.loadFinish();
                    break;
                case 'win_power':
                    POWER.loadFinish();
                    break;
                case 'win_kvm':
                    KVM.loadFinish();
                    break;	
                case 'win_panel':
                    PANEL.loadFinish();
                    break;
            }
	
	
	
	
	
	
        });
	
    },
	
    uploadTrackMove:function(){
	
	
    //WIN.uploadT
	
	
    },	

    showIMG:function(a){
        IMAGE.load(a)

	
    },
    getParAttr:function(e,at){

        att = $(e).attr(at);
          

        if (att) {
            return e;
        // ...
        }else{
			
            if($(e).parent()){
                return this.getParAttr($(e).parent(),at)
            }else{
                d=false;
            }
        }
	
		
	
    },


    removeIMG:function(m){
	
        eid=this.getParAttr(m,'eid')
        WIN.imfr=$(m).parent().parent()
        $.postJSON('/basic/image/remove',{
            'eid':eid.attr('eid'),
            'tmpl':$(m).attr('tmp'),
            'im':$(m).attr('im')
            }, function(json) {
				
            $(WIN.imfr).remove()			
				
        });
	
	
	
	
	
	
    },

    elementActionSet:function(w){
	

        $(w).find('input,textarea').bind('focus',function(){
            WIN.el_focused=this;
		
            $(this).addClass('focused')
		
        });
	
	
        //set action on input,textarea
	
        $(w).find('select.eselect').change(function(){
		
            eid=$(this).parent().parent().attr('eid')
		
		
            DEVICE.loadings(true)
		
            $.postJSON('basic/device/data/value',{
                'id':DEVICE.id,
                'val':$(this).val(),
                'eid':eid
            }, function(json) {
		
                DEVICE.loadings(false)	
			
            });	
		
		
        });
	
	
	
        $(w).find('input,textarea').bind('blur keydown',function(e){
		
		
		
		
            if(this==WIN.el_focused){
                WIN.el_focused=false;
            }
		
		
            tag=e.currentTarget.tagName
            eid=$(this).parent().parent().attr('eid')
		
            ent=false;
            if(e.type=='keydown'){
		
                if(e.keyCode==13 && $(this).is('input')){
                    ent=true
			
				
                    $(this).blur()
			
			
                }
			
            }
		
		
            if(e.type=='blur'){
                $(this).removeClass('focused')
		
                if($(this).val().length>0){
                    $.postJSON('basic/device/data/value',{
                        'id':DEVICE.id,
                        'val':$(this).val(),
                        'eid':eid
                    }, function(json) {
			
				
				
                        });	
			
                }
		
		
            }	
	
	
	
	
        });
	
	
	
        //image upload button action
        $(w).find('a.imgupl div.inner').each(function(i,e){
            im=new imageupload(e,false);
        });
	
        // hdd icon action
        $(w).find('div.hdd_icon').each(function(i,el){
            $(el).click(function(){
                RAID.open(this,false)
                });
        });
	
        // ram icon action
        $(w).find('div.ram_icon').each(function(i,el){
            $(el).click(function(){
                RAM.open(this,false)
                });
        });
	
        //export2PDF action
        $(w).find('a.toPDF').each(function(i,el){
            $(el).click(function(){
                DEVICE.print(this,false)
                });
        });
	
        //add note action
        $(w).find('a.addNote').each(function(i,el){
            $(el).click(function(){
                DEVICE.addNote(this)
                });
        });
	
    //network button action
    //$(w).find('button.toIP').each(function(i,el){$(el).click(function(){NETWORK.open(this)});});
	
	
    },	
	
    min:function(d){
        $(d).find('div.win_max').show()
        $(d).find('div.win_min').hide()
        $(d).attr('max','no')
        $(d).css({
            'width':$(d).attr('w'),
            'height':$(d).attr('h'),
            'left':$(d).attr('l')+'px',
            'top':$(d).attr('t')+'px'
            })
   
        Hook.call('winMinimize', d);
    
    } ,       
    max:function(d){
    
        $(d).find('div.win_max').hide()
        $(d).find('div.win_min').show()
        console.log('max',d) 
   
        t=$(d).position().top
        l=$(d).position().left
        w=$(d).width()
        h=$(d).height()
        if($(d).attr('max')!='ok')
        {
            $(d).attr({
                't':t,
                'l':l,
                'w':w,
                'h':h,
                'max':'ok'
            })
            }
   
        $(d).css({
            'width':winw,
            'height':winh-35,
            'left':'0',
            'top':'0'
        })
        Hook.call('winMaximize', d);
    } ,        
    init:function(){

	
        $("div.win").mousedown(function(){
            $("div.win").css("z-index",398);
            $(this).css("z-index",400);

        });

        $("div.win_header").mousedown(function(){
            m=$(this).parent().attr('max')
            if(m!='ok'){
                $(this).parent().draggable({
                    'containment': 'parent' ,
                    start: function(event, ui) { 
	
                        // postavit sve ostale prozore na 1
	
                        $("div.win").css("z-index",398);
                        $(this).css("z-index",400);	
	

                    },
                    drag:function(){
	
	
                    },
                    stop:function(event, ui) { 
                        if($(this).draggable)
                            $(this).draggable("destroy");
                    }
                });	
        }
        });	
	
	
    //resizable win

	
	
	
	
    $("div.w_resize").resizable(
    {
        minHeight: 420,
        minWidth: 420 ,
        maxHeight:600,
        maxWidth:900
    });
	
    $("div.w_resize").resize(function(e) {
	  
        //get header and menu height
	
        wh=$(this).find('div.win_header').height()
        wm=$(this).find('div.win_menu').height()
	
        h=$(this).height()
        w=$(this).width()
        ht=h-(wh+wm)
        $(this).find('div.win_data').css({
            'height':ht+'px',
            'width':w+'px'
            })
	
	
	
	
	
	
	
	
    });	
	
    //close window
    $('div.win_close').click(function(){
        WIN.close($(this).parent().parent())
        });
    $('div.win_min').click(function(){
        WIN.min($(this).parent().parent())
        });
    $('div.win_max').click(function(){
        WIN.max($(this).parent().parent())
        });





    this.staticAction()	
	
},	
staticAction:function(){
	
    $('#win_device div.win_icon').html('<ul class="submenu"><li id="dev_edit">Edit</li><li id="dev_close">Close</li></ul>')   
    
    $('#dev_edit').click(function(){
        DEVICE.editModeSet()
        
    });
    
    $('#dev_close').click(function(){
          WIN.close('#win_device')	
        
    });
	
    $('#win_login a.abutton').click(function(){
	
        LOGIN.action();
			
    });
	
    $('#alert_cancel').click(function(){
		
        WIN.close('#win_alert')
		
    });
    $('#alert_ok').click(function(){
	
        //console.info('>>'+$('#alert_cancel').is(":visible"))
	
        if(!$('#alert_cancel').is(":visible")){
            WIN.close('#win_alert')	
		
        }
    //WIN.alert_confrim()
	
	
    });
	
    $('#win_login button').keydown(function(event){
        //enter pressed
        if(event.keyCode==13){
			
            LOGIN.action();	
        }		
    });
	
    $('#win_login input').keydown(function(event){
        //enter pressed
		
        if(event.keyCode==13){	
            LOGIN.action();	
        }		
    });

    this.action();
},

menuaction:function(t){

    win=$(t).parent().attr('win')		
		
    sw=$(t).parent().attr('sw')
		
    num=$(t).attr('layout')
    if(!sw)	
    {
		
        $(t).parent().find("li").removeClass('aktive');
        $('#'+win+'_layer'+num).parent().find('div.win_layer').removeClass('win_visible')
			
    }









    $(t).addClass('aktive')
    switch(win){
        case 'win_device':
            DEVICE.menu(num)
            break;
        case 'win_monitor':
            MONITOR.menu(num)
            break;
        case 'win_graphing_settings':
            GRAPHING.menu(num)
            break;
        case 'win_graphing':
            CACTI.menu(num)
            break;

        default:
            $('#'+win+'_layer'+num).addClass('win_visible')	
            break;
    }

    Hook.call('menuWin', {
        'num':num,
        'win':win
    })
	
    menu_atr=$(t).parent().attr('menu')
    if(menu_atr){
        if(menu_atr.length>0){
            if (typeof eval(menu_atr) !== 'undefined') {
                _m=eval(menu_atr)
                _m.menu(num)
            }
 
        }
    }
    
},
action:function(){
	

    $('div.win_submenu li').click(function(){
		
        $(this).parent().find('li').removeClass('aktive')
        $(this).addClass('aktive')
	
        layer=$(this).parent().parent().parent()
		
        layer.find('div.win_sublayer').removeClass('win_visible')
        m='#'+layer.attr('id')+'_'+$(this).attr('l')
		
        $(m).addClass('win_visible')
		
    });
	
	
    $('div.win_menu li').click(function(){
	
        WIN.menuaction(this)
    });	
	
	
	
	
},
alert:function(data){
    $('#alert_ok').show()
    $('#alert_cancel').hide()
    $('#win_alert div.win_alert_p').html(data)
	
    WIN.show('#win_alert')
	

	
},
show:function(win){
	
        
        
    if(win=='#win_building'){
        BUILDING.init()	
		
    }
    if(win=='#win_device_template'){
        TEMPLATE.init()	
    }
    if(win=='#win_domains'){
        DOMAINS.init()	
    }
    if(win=='#win_monitor_settings'){
        MONITOR.loadSettings()

    }
	
    if(win=='#win_graphing_settings'){
        GRAPHING.loadSettings()

    }
	
	
    $("div.win").css("z-index",398);
    $(win).css("z-index",400);
    $(win).show()
    //this.animatedOpen(win)
    //check for mask
    m=$(win).attr('mask')
	
    if(m=='ok'){
        $('#win_mask').show()
    }
    m2=$(win).attr('mask2')
    if(m2=='ok'){
        $('#win_mask2').show()
    }
		
    Hook.call('winShow', {
        'win':win
    })   
                
                
},
animatedClose:function(win){
	
    WIN.ah=$(win).height()
    WIN.aw=$(win).width()
	
	
	
    WIN.al=$(win).position().left
    WIN.at=$(win).position().top
	
    if(WIN.al>0){
	
	
        $(win).animate({
            left:'+='+WIN.aw/2,
            top:'+='+WIN.ah/2,
            height: "1%",
            width: "1%",
            opacity:0.3
        }, {
            duration: 400,
            complete: function() {
                $(this).hide()
	    
                $(win).css({
                    'width':WIN.aw+'px',
                    'height':WIN.ah+'px',
                    'left':WIN.al+'px',
                    'top':WIN.at+'px',
                    'opacity':1
                });
	    	
	    	
	    	
            }
        });
	
    }else{
        $(win).hide()	
		
    }
},	
animatedOpen:function(win){
    $(win).show()
    WIN.ah=$(win).height()
    WIN.aw=$(win).width()
	    
	
	
    WIN.al=$(win).position().left
    WIN.at=$(win).position().top
	
    $(win).css({
        'width':'5%',
        'height':'5%',
        'left':WIN.al+WIN.aw/2+'px',
        'top':WIN.at+WIN.ah/2+'px',
        'opacity':0.1
    });
	
    if(WIN.al>0){
	
	
        $(win).animate({
            left:'-='+WIN.aw/2,
            top:'-='+WIN.ah/2,
            height: WIN.ah+'px',
            width: WIN.aw+'px',
            opacity:1
        }, {
            duration: 300,
            complete: function() {
	
	    
	    	
	    	
	    	
	    	
            }
        });
	
    }else{
        $(win).show()	
		
    }
},	

	
close:function(win){
    id=$(win).attr('id')
	
    Hook.call('winClose', id)
    switch(id){
        
        case 'win_minimap':
            MINIMAP.close()
            break;
        case 'win_tools':
            CABLE.toolclose()
            break;
        case 'win_wiki':
            WIKI.icon(false)
            break;
        case 'win_device':
            DEVICE.windowClosed()
            break;
        case 'win_rack':
            $('#'+RACK.rid+' div.rack_cage').removeClass('rack_active')
            break;	
		
		
    }
    //$(win).hide()	
    WIN.animatedClose(win)
    $('#win_mask').hide()
    $('#win_mask2').hide()
}	
	
	
	
}
        
        
