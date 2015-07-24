var GRAPHING={
    move:function(){
		
		
    },
    menu:function(num){
        $('#win_graphing_settings div.win_layer').removeClass('win_visible')
		
        this.menuNUM=Number(num)
        //console.info(this.menuNUM)
        m=num
	    
        $('#win_graphing_settings_layer'+m).addClass('win_visible')		
		
	
		
    },
	
	
    load:function(data){
		
		

		
        $.postJSON('graphing/get/graphs',{
            "did":0
        } ,function(json) {
			
            GRAPHING.data=json
			
            if(json){
                $.each(json.cacti.devices,function(i,e){
				
                    $('#rack_unit'+e+' div.device_graph').addClass('cacti hint2').attr('hint2','Click to set Graphing')
                //NOC.hintset_static('rack_unit'+e)    
                });
                
		
                $.each(json.munin.devices,function(i,e){
				
                    $('#rack_unit'+e.id+' div.device_graph').addClass('munin hint2').attr('hint2','Click to set Graphing')
                //NOC.hintset_static('rack_unit'+e.id)
        
            
                });		
            }
			
		
            GRAPHING.loading(false)
        //GRAPHING.window(json)
        //GRAPHING.make(json)
				
        });
		
		
		
		
		
    },
	
	


    reload:function(){
         if(GRAPHING.settingsON){
        // this.loading(true)
         this.loadSettings()
         }
    }, 	
	
    loadSettings:function(){
		
		
        //this.loading(true)	
		
        $.postJSON('graphing/get',{
            "did":this.did
        } ,function(json) {
            GRAPHING.settingsON=true	
            GRAPHING.loading(false)
            GRAPHING.window(json)
        //GRAPHING.make(json)
				
        });
		
		
    },
	
    loading:function(key){
		
        if(key){
            $('#win_graphing_settings div.win_icon').addClass('deviceLoader').removeClass('default');
		
        }
        else{
			
            $('#win_graphing_setting div.win_icon').removeClass('deviceLoader').addClass('default');
		
        }
		
    },
    clearHover:function(){
        $('#graph_hover').parent().find('div.device_graph').removeClass('status_hover')
        $('#graph_hover').remove()
		
        CACTI.clearHover()
    },	
	
	


    addSourceWin:function(){
		
        //this.conn_div=d
		
        this.win=new nocwin('Add graph source','','graphing');	

        this.win.zindex()
		

        d=this.win.data
	
        $(d).html('<fieldset style="margin-top:10px;"><legend></legend></fieldset>'+
            //'<fieldset><legend>Graphing type:</legend><select id="graph_type"><option value="1">Nagios</option></select></fieldset>'+		
            '<fieldset><legend>URL <span>( http://example.com/cacti/ )</span>:</legend><input id="graph_url" class="size_large2"></fieldset>'+
            '<div class="float_field"><fieldset><legend>User:</legend><input class="size_medium2" id="graph_usr"></fieldset>'+
            '<fieldset><legend>Password:</legend><input class="size_medium2" type="password" id="graph_pwd"></fieldset></div>'+
            '<fieldset style="clear:both;margin-top:5px;"><legend>Status:</legend><div class="ms_status"><span></span></div></fieldset>'+
            '<fieldset style="position:absolute;bottom:10px;right:10px;"><legend></legend>'+
            //'<div style="float:left;margin-right:20px;"><a class="abutton el_disc" href="#"><div class="inner">disconnect</div></a></div>'+	
            '<div style="float:left;margin-right:20px;"><a class="abutton el_cancel" href="#"><div class="inner">cancel</div></a></div>'+
            '<div style="float:left;margin-right:20px;"><a class="abutton el_test" href="#"><div class="inner">test</div></a></div>'+
            '<div style="float:left;margin-right:10px;"><a class="abutton el_set" href="#"><div class="inner">save</div></a></div></fieldset>'
            )	

        //close win
        $(this.win.div).find('div.win_close').click(function(){
            GRAPHING.win.remove()
        //WIN.show('#win_ip') //set zindex back to 400
        });
        //save 
        $(this.win.div).find('a.el_set').click(function(){
            //IP.vlanset(this)
		
            $.postJSON('graphing/add',{
                "type": 1,
                "url": $('#graph_url').val(),	
                "usr": $('#graph_usr').val(),
                "pwd": $('#graph_pwd').val()
            } ,function(json) {
			
                if(json.code=='ok'){
				
                    source= $('<div/>').addClass('data_row').attr('eid',json.data.id).html(
                        '<div class="s_type"><span>'+json.data.name+'</span></div>'+
                        '<div class="s_url">'+json.data.content+'</div>'+
                        '<div class="s_stat" data="'+json.data.content+'">Ok</div>').appendTo($('#graphing_source'))	
				
                    $(source).click(function(){
		
                        GRAPHING.editSource(this)	
			
			
			
                    });   
                                
                    GRAPHING.win.remove()
                }else{
				
                    GRAPHING.getErrCode(json.code)
                }
			
            //console.log(json)
            });
		
        });

        //test data
        $(this.win.div).find('a.el_test').click(function(){
	
            $.postJSON('graphing/test',{
                "type": 1,
                "url": $('#graph_url').val(),	
                "usr": $('#graph_usr').val(),
                "pwd": $('#graph_pwd').val()
            } ,function(json) {
			
                GRAPHING.getErrCode(json.code)
			
            });
		
        });
	
        //cancel
        $(this.win.div).find('a.el_cancel').click(function(){
            GRAPHING.win.remove()
        //WIN.show('#win_ip') //set zindex back to 400
        });	

		
		
    },	
	
	
    updateGraphSize:function(active,num){
		
        $.postJSON('graphing/set/data',{
		
            "type":'cacti_size',	
            "val": num
		
        } ,function(json) {
		
            $.each(GRAPHING.data.cacti.data,function(i,e){
                if(e.name=='cacti_size') {
                    console.log('set')
                    GRAPHING.data.cacti.data[i].value=num
				
                }
            });
		
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
                err='Enter valid  url!'
                col='#B7CDE9'
				
                break;
		
        }
        $(GRAPHING.win.div).find('div.ms_status').html('<span style="color:'+col+'">'+err+'</span>')
		
        return {
            'err':err,
            'col':col
        }
    },	
	
	
    editSource:function(d){
        GRAPHING.editSourceDiv=d
        id=$(d).attr('eid')
        $.postJSON('graphing/source',{
            'id':id,
            'action':'get'
        } ,function(json) {
			
            GRAPHING.editSourceWin(json.source)
        });
		
		
    },	
	
    editSourceWin:function(data){
		
        //this.conn_div=d
		
        eid=$(GRAPHING.editSourceDiv).attr('eid')
		
		
        this.win=new nocwin('Edit/remove graphing source','','graphing');	

        this.win.zindex()
		

        d=this.win.data
	
	
        $(d).html('<fieldset style="margin-top:10px;"><legend></legend></fieldset>'+
            //'<fieldset><legend>Graphing type:</legend><select id="graph_type"><option value="1">Nagios</option></select></fieldset>'+		
            '<fieldset><legend>URL <span>( http://example.com/cacti/ )</span>:</legend><input value="'+data.content+'" id="graph_url" class="size_large2"></fieldset>'+
            '<div class="float_field"><fieldset><legend>User:</legend><input  value="'+data.user+'" class="size_medium2" id="graph_usr"></fieldset>'+
            '<fieldset><legend>Password:</legend><input class="size_medium2" type="password"  value="'+data.pass+'" id="graph_pwd"></fieldset></div>'+
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
            GRAPHING.win.remove()
        //WIN.show('#win_ip') //set zindex back to 400
        });
        //save 
        $(this.win.div).find('a.el_set').click(function(){
            //IP.vlanset(this)
		
            $.postJSON('graphing/source/edit',{
                'eid':eid,
                "type": 1,
                "url": $('#graph_url').val(),	
                "usr": $('#graph_usr').val(),
                "pwd": $('#graph_pwd').val()
            } ,function(json) {
			
                if(json.code=='ok'){
				
                    GRAPHING.win.remove()
				
                }else{
                    GRAPHING.getErrCode(json.code)
				
                }
			
            //console.log(json)
            });
		
        });

        //test data
        $(this.win.div).find('a.el_test').click(function(){
	
            $.postJSON('graphing/test',{
                "type": 1,
                "url": $('#graph_url').val(),	
                "usr": $('#graph_usr').val(),
                "pwd": $('#graph_pwd').val()
            } ,function(json) {
                GRAPHING.getErrCode(json.code)
            });
		
        });
	
        //cancel
        $(this.win.div).find('a.el_cancel').click(function(){
            GRAPHING.win.remove()
        //WIN.show('#win_ip') //set zindex back to 400
        });	

	
        //remove
        $(this.win.div).find('a.el_rem').click(function(){
		
            $.postJSON('graphing/source/rem',{
                'eid':eid,
                "type": 1,
                "url": $('#graph_url').val()
            } ,function(json) {
			
			
			
                $(GRAPHING.editSourceDiv).remove()
                GRAPHING.editSourceDiv=false
                GRAPHING.win.remove()
            });
		
		
        });	
		
		
    },	
	
	
    sizeData:function(size){

        sets=[[],[1,0,0],[0,1,0],[0,0,1]];
        names=[[],'Small','Medium','Large']
	
        out='';
        for(i=1;i<=3;i++){
		
            out+=this.makeCheckBox(names[i],sets[size][i-1],i)
		
        }
        return out
    },	
	
    window:function(data){
		
		
        mon=data.data

        field1=$('<fieldset/>').html(
            '<div style="margin-top:10px;" class="graphing_box" id="graphing_source">'+
            '<div class="source_row title">'+
            '<div class="s_type th">Engine</div>'+
            '<div class="s_url th">URL</div>'+
            '<div class="s_stat th"></div>'+
            '</div></div>')		
		
        $('#win_graphing_settings_layer1').html(field1)		
		
        $.each(data.sources,function(i,e){
		
            source=$('<div/>').addClass('data_row').attr('eid',e.id).html(
                '<div class="s_type"><span>'+e.type.name+'</span></div>'+
                '<div class="s_url">'+e.content+'</div>'+
                '<div data="'+e.content+'" class="s_stat"></div>').appendTo($('#graphing_source'))	
		
            $(source).click(function(){
		
                GRAPHING.editSource(this)	
			
			
			
            });
		
		
        });
		
        $('<div/>').css({
            'float': 'left', 
            'clear': 'both', 
            'margin-bottom': '15px', 
            'margin-left': '10px', 
            'margin-top': '10px'
        }).html(
            '<a class="abutton addSource" href="#"><div class="inner" tmp="0">add source</div></a>'		
            ).appendTo(field1)
	

        $('#win_graphing_settings_layer1 a.addSource').click(function(){
            GRAPHING.addSourceWin()
	
        });

        size=1;

        $.each(data.data,function(i,e){
            if(e.name=='cacti_size') size=Number(e.value);
        });
	
		
	








        $('<fieldset>').attr('id','cactigraphsize').html(
            '<legend>Graph size</legend>'+
            '<div class="element button_element"><div class="print_checkboxs">'+
            this.sizeData(size)+
            '</div></div>').appendTo($('#win_graphing_settings_layer1'));

        $('#cactigraphsize div.check_box').click(function(){
	
            $('#cactigraphsize div.check_box').attr('act','0')
            $('#cactigraphsize div.check_box div.icons').attr('class','icons')
	
	
            active=ELEMENT._checkbox(this)
	
	
            num=Number($(this).attr('m'))
	
            GRAPHING.updateGraphSize(active,num)
	
	
	
        });


    field2=$('<fieldset/>').html(
            '<div style="margin-top:10px;" class="graphing_box" id="graphing_munin">'+
            '<div class="source_row title">'+
            '<div style="width:25%;" class="s_type th">Hostname</div>'+
            '<div style="width:60%;" class="s_url th">URL</div>'+
            '<div style="width:15%;" class="s_stat th"></div>'+
            '</div></div>')		
		
        $('#win_graphing_settings_layer2').html(field2)	


    $.each(data.munin,function(i,e){
		
            source=$('<div/>').addClass('data_row').attr('eid',e.id).html(
                '<div style="width:25%;" class="s_type"><span>'+e.host+'</span></div>'+
                '<div style="width:60%;font-size:10px;" class="s_url">'+e.url+'</div>'+
                '<div style="width:15%;" class="s_stat"></div>').appendTo($('#graphing_munin'))	
		
            $(source).click(function(){
		
                //GRAPHING.editSource(this)	
                eid=$(this).attr('eid')
                console.warn(eid)
                
			MUNIN.windowFromSettings(eid)
			
			
            });
		
		
        });




    },

    makeCheckBox:function(name,active,num){
	
        cl=(active==1)?' active':'';
	
        return '<div act="'+active+'" m="'+num+'" class="check_box">'+
        '<div class="icons'+cl+'"></div><div class="name">'+name+'</div></div>'
	
    },
	
    deviceUpdate:function(a){
        if(a!=undefined){
            
            $(a).find('div.device_graph').unbind('click').click(function(){
				
                GRAPHING.clickAction(this);
				
            });
            
            $(a).find('div.device_graph').unbind('hover').hover(
                function(){
                    GRAPHING.hover_in(this)
						
                },		
                function(){
                    GRAPHING.hover_out(this)
                }       
                );
            
        }
            
    },
    clickAction:function(d){
        type=Number($(d).parent().attr('e_c'))
				
				
				
				
        switch(type){
            case 1:
                
                MUNIN.window(d)
                break;
            
            case 2:
					
            case 3:
                CACTI.window(d)
                break;
					
         
        }
            
    },
        
    hover_in:function(d){
        //console.log('ok');	
        GRAPHING.clearHover()
        $(d).addClass('status_hover');
        GRAPHING.dev=Number($(d).parent().attr('id').replace('rack_unit',''))
        
        //$('#monitor_hover').remove()
        if(GRAPHING.hover) clearTimeout(GRAPHING.hover);
					
        m=$('<div/>').attr('id','graph_hover').appendTo($(d).parent());
					
        $(m).hover(
            function(){
                if(GRAPHING.hover) clearTimeout(GRAPHING.hover);
							
            },
            function(){
                //if(!CACTI.overgraph)
                GRAPHING.hover=setTimeout("GRAPHING.clearHover()",100);
            }
					
            );
        GRAPHING.d=d
        
        CACTI.makeList(d)
        if($(d).hasClass('munin'))
            MUNIN.makeList(d)		
        
        
        GRAPHING.hoverAction()
					
                                        
    //$('#monitor_hover').css({'top':0,'left':220});
            
    },
     
    hoverAction:function(){
        d=GRAPHING.d
        
        //cacti
        $('#graph_hover div.cacti_service').hover(
            function(){
							
                if(GRAPHING.hover) clearTimeout(GRAPHING.hover);
                if(CACTI.timer) clearTimeout(CACTI.timer)
                CACTI.clearHover()
                CACTI.overService=this
                $(this).addClass('hover')
					
                t=$(this).offset().top
                l=$(this).offset().left
                //src=$(this).find('div.graph_holder').attr('src')
							
                gh=$(this).find('div.graph_holder')
							
                srcs=$(gh).attr('src').split('/')
                srcs.pop()
                srcs.push(CACTI.activLi)
                src=srcs.join('/')
								
								
								
								
								
                //console.warn(t,l)
                pop=$('<div/>').attr('id','graph_img').addClass('graph_s'+size).appendTo('#windows');
                t-=35	
                l+=155
                w=$(pop).width();
                wuk=w+l
					
						
                if(winw<wuk){
                    l=l-w-155	
						
                }
                pop.css({
                    'top':t,
                    'left':l
                })
						
						
						
						
						
						
                $(pop).html('<div class="imgloader">Loading...</div><div id="cimgloader">loading...</div><img style="display:none;" src="'+src+'">');
							
                $(pop).find('img').load(function(){
                    $('#cimgloader').hide()
							
                    names=['','Daily','Weekly','Monthly','Yearly']
                    html=''
                    $(this).show()
                    t=$(this).parent().offset().top
                    h=$(this).parent().height()
                    huk=t+h
                    if(winh<huk){
                        tp=winh-h-28
								
                        $('#graph_img').css({
                            'top':tp
                        })	
                    }
								
								
								
								
								
                    for(i=1;i<=4;i++){
									
                        cl=(i==CACTI.activLi)?'class="active"':''
									
                        html+='<li m="'+i+'" '+cl+'>'+names[i]+'</li>'
									
                    }
							
                    $(this).css('opacity','1')
							
                    $(this).parent().find('div.imgloader').html(
                        '<ul>'+html+'</ul><a href="#" class="pdf">print</a>')
							
                    $(this).parent().find('div.imgloader a').click(function(){
								
                        s=$(gh).attr('s')
                        g=$(gh).attr('graph')
                        p=$(gh).attr('port')
                        d=$(gh).attr('did')
								
                        window.open(mainpath+'graphing/print/get/'+g+'/'+d+'/'+p+'/'+s)
								
                    });		
									
									
                    $(this).parent().find('li').click(function(){
								
                        CACTI.activLi=Number($(this).attr('m'))	
                        $(this).parent().find('li').removeClass('active')
                        $(this).addClass('active')
                        $('#cimgloader').show()
								
                        srcs=$('#graph_img img').attr('src').split('/')
                        srcs.pop()
                        srcs.push(CACTI.activLi)
                        nsrc=srcs.join('/')
                        $('#graph_img img').attr('src',nsrc)
								
                    });	
									
							
                }).error(function(){
                    $(this).parent().find('div.imgloader').html(
                        'Error loading image!')
							
                }
						
                )
						
                $(pop).hover(
                    function(){
                        if(GRAPHING.hover) clearTimeout(GRAPHING.hover);
                        CACTI.overgraph=true	
                        console.log('hovr1')
                    },
						
                    function(){
                        console.log('hovr2')
                        CACTI.overgraph=false
                        CACTI.clearHover()
                        CACTI.timer=setTimeout("GRAPHING.clearHover()",100)
                    }		
                    )
						
						
            },
            function(){
                if(!CACTI.overgraph)
                    $(this).removeClass('hover')
							
                CACTI.isover=false
            }
            );
        
        
        //munin
        $('#graph_hover div.munin_service').hover(
            function(){
							
                if(GRAPHING.hover) clearTimeout(GRAPHING.hover);
                if(CACTI.timer) clearTimeout(CACTI.timer)
                CACTI.clearHover()
                CACTI.overService=this
                $(this).addClass('hover')
					
                t=$(this).offset().top
                l=$(this).offset().left
                //src=$(this).find('div.graph_holder').attr('src')
							
                gh=$(this).find('div.graph_holder')
                
                
                if($(gh)[0].tagName=='DIV')
                if($($(gh)[0]).attr('src')){
                
                srcs=$($(gh)[0]).attr('src').split('/')
                srcs.pop()
                srcs.push(CACTI.activLi)
                src=srcs.join('/')
		//console.log(src)						
                //src=srcs.join('/')
                size='m'						
								
								
                //console.warn(t,l)
                pop=$('<div/>').attr('id','graph_img').addClass('graph_s'+size).appendTo('#windows');
                t-=35	
                l+=155
                w=$(pop).width();
                wuk=w+l
					
						
                if(winw<wuk){
                    l=l-w-155	
						
                }
                pop.css({
                    'top':t,
                    'left':l
                })
						
						
						
						
						
						
                $(pop).html('<div class="imgloader"><span id="imgloadmunin">Loading..</span></div><div id="cimgloader">loading...</div><img style="display:none;" src="'+src+'">');
							
                $(pop).find('img').load(function(){
                    console.log($(this).width())
                    
                    $('#cimgloader').hide()
                    $('#imgloadmunin').hide()				
                    names=['','Daily','Weekly','Monthly','Yearly']
                    html=''
                    
                    $(this).show()
                    t=$(this).parent().offset().top
                    h=$(this).parent().height()
                    if(h>winh-35){
                        $(this).parent().css({
                            'background':'#ccc',
                            'overflow-y':'scroll',
                            'height':(winh-35)+'px'
                            })
                        tp=0
                        $('#graph_img').css({
                            'top':tp
                        })
                    }else{
                    
                        huk=t+h
                        if(winh<huk){
                            tp=winh-h-28
								
                            $('#graph_img').css({
                                'top':tp
                            })	
                        }
                    }
								
								
								
								
								
                for(i=1;i<=4;i++){
									
                    cl=(i==CACTI.activLi)?'class="active"':''
									
                    html+='<li m="'+i+'" '+cl+'>'+names[i]+'</li>'
									
                }
							
                $(this).css('opacity','1')
							
                    $(this).parent().find('div.imgloader').html(
                        '<ul>'+html+'</ul>')
                    //<a href="#" class="pdf">print</a>
                                        
                    $(this).parent().find('div.imgloader a').click(function(){
								
                        s=$(gh).attr('s')
                        g=$(gh).attr('graph')
                        p=$(gh).attr('port')
                        d=$(gh).attr('did')
                        console.log(this)
                        
                    //window.open(mainpath+'graphing/print/get/'+g+'/'+d+'/'+p+'/'+s)
								
                    });		
									
									
                    $(this).parent().find('li').click(function(){
								
                        CACTI.activLi=Number($(this).attr('m'))	
                        $(this).parent().find('li').removeClass('active')
                        $(this).addClass('active')
                        $('#cimgloader').show()
								
                        srcs=$('#graph_img img').attr('src').split('/')
                        srcs.pop()
                        srcs.push(CACTI.activLi)
                        nsrc=srcs.join('/')
                        $('#graph_img img').attr('src',nsrc)
								
                    });	
									
							
                }).error(function(){
                $(this).parent().find('div.imgloader').html(
                    'Error loading image!')
							
            }
						
            )
						
            $(pop).hover(
                function(){
                    if(GRAPHING.hover) clearTimeout(GRAPHING.hover);
                    CACTI.overgraph=true	
                    console.log('hovr1')
                },
						
                function(){
                    console.log('hovr2')
                    CACTI.overgraph=false
                    CACTI.clearHover()
                    CACTI.timer=setTimeout("GRAPHING.clearHover()",100)
                }		
                )
						
	 }					
        },
        function(){
            if(!CACTI.overgraph)
                $(this).removeClass('hover')
							
            CACTI.isover=false
        }
           
        );
		
		
		
    h=$('#graph_hover').height()
		
    t=$(d).offset().top+$('#content').scrollTop()-35
    l=$(d).offset().left+$('#content').position().left
		
    h2=winh-h;
    hh=t+h
    kk=winh+$('#content').scrollTop()-35
		
		
    if(hh>RACK.rh){
        console.log('hh>RACK.rh')
        mh=RACK.rh-hh-35
        console.log(mh)
        $('#graph_hover').css('top',mh)
			
    }
    if(hh>kk){
        console.log('hh>kk')
        if(kk>RACK.rh) kk=RACK.rh
				
        mh=kk-hh
			
			
        $('#graph_hover').css('top',mh)
    }
    hh2=winh-35;
    if(h>hh2){
        if(hh2>RACK.rh) hh2=RACK.rh;
        console.log('h>hh2')
        mm=h-hh2;
        $('#graph_hover').css('top',mh+mm)
                        
        $('#graph_hover').css('height',hh2)
			
    }
        
}, 
     
hover_out:function(){
    if(GRAPHING.hover) clearTimeout(GRAPHING.hover);	
    //if(!CACTI.overgraph)
    GRAPHING.hover=setTimeout("GRAPHING.clearHover()",100);	
					
					
            
},
        
init:function(){
		
    console.log('graphing init')
                
    Hook.register('deviceOnCategory',function(a){
        GRAPHING.deviceUpdate(a)
    });
		
    //if(!this.set){
    this.set=true;
			
    $(document).mousemove(function(){
				
        GRAPHING.move()
				
    });
			
			
    $('div.device_graph').click(function(){
				
        GRAPHING.clickAction(this);
				
    });
			
			
    $('div.device_graph').hover(
        function(){
            GRAPHING.hover_in(this)
						
        },		
        function(){
            GRAPHING.hover_out(this)
        }       
        );	
			
    CACTI.init()
    MUNIN.init();
			
			
			
		
		
    this.load()
		
}	
		
		
		
}