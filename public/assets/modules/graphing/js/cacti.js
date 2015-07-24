var CACTI={
    init:function(){
		
        if(!CACTI.activLi) CACTI.activLi=1
    },
    separateDeviceGraphs:function(dev,cat,data){
        out=[]
		
		
		
        $.each(data, function(i,e){
			
            if(cat==2 || cat==3){
				
                if(e.device==dev){
					
                    if(Number(e.num)<=0){
                        //custom	
                        out.push({
                            'graph':e.graph,
                            'name':e.name,
                            'source':e.source,
                        })
                    }else{
                        //mac
                        out.push({
                            'graph':e.graph,
                            'name':'PORT '+e.num,
                            'source':e.source,
                        })	
					
                    }
					
						
					
                }
				
				
            }else if(cat==1){
                
                                
                if(e.server){
                    if(Number(e.server.dev)==dev){
					
                        n=$('#rack_unit'+e.device+' div.name').html()
                        out.push({
                            'graph':e.graph,
                            'name':n+' PORT'+e.num,
                            'source':e.source,
                        })
                    }
					
					
                }
				
				
            }
			
			
			
			
			
        });
        out.sort(function(a,b){
            return b.name-a.name
            })
        return out;
    },
    makeList:function(d){
		
        //get all cacti graphs
		
        //$('#graph_hover').append('<div style="top:-2px;position:absolute;width:100px;height:20px;border:1px solid #ccc;background:#FFFADC;">aaa</div>')
                
        //if()
        if(GRAPHING.data){
            did=Number($(d).parent().attr('id').replace('rack_unit',''))
            cat=Number($(d).parent().attr('e_c'))
		
            graphs=this.separateDeviceGraphs(did,cat,GRAPHING.data.cacti.port);
		
            graphs=graphs.concat(this.separateDeviceGraphs(did,cat,GRAPHING.data.cacti.custom))
		
		
            //console.log(graphs)
		
            ind=0;
            size=1
            $.each(GRAPHING.data.cacti.data,function(i,e){
                if(e.name=='cacti_size') {
                    size=e.value
                }
            });
		
            if(graphs.length>=1){
		
			
			
			
		
                $.each(graphs,function(i,e){
				
                    name='name'+i	
                    m=$('<div/>').addClass('graph_service cacti_service').attr({
                        'host':ind,
                        'service':0
                    }).html(
                        '<div class="n"><span>'+e.name+'</span></div>'+
                        '<div class="graph_holder graph2" s="'+e.source+'" graph="'+e.graph+'" port="'+e.name+'" did="'+did+'" src="/graphing/graph/get/'+e.source+'/'+e.graph+'/'+size+'/'+CACTI.activLi+'">'+
						
						
                        //'<div class="menu"></div>'+
                        '</div>').appendTo($('#graph_hover'));
                });
				
			
		
		
                $(d).addClass('cacti')	
		
            }else{
                $(d).addClass('defgraph')
                m=$('<div/>').addClass('graph_service').attr('id','cacti_nodata').html(
                    '<div class="n"><span>No data</span></div>'
                    ).appendTo($('#graph_hover'));
		
            }
		
		
        }
    },
clearHover:function(){
		
    $('#graph_img').remove()
		
		
},	
	
select:function(what,selIndx){
		
    if(what=='source'){
        s=$('#cacti_source')
        $(s).html('')
		
        $.each(this.sources,function(i,e){
			
            o=$('<option/>').attr('value',e.id).text(e.url).appendTo(s)
			
            if(selIndx==e.id)
                $(o).attr('selected','selected')	
			
			
        });	
    }
		
		
		
		
		
},
menu:function(num){
    $('#win_graphing div.win_layer').removeClass('win_visible')
			
    this.menuNUM=Number(num)
    //console.info(this.menuNUM)
    m=num
		    
    $('#win_graphing_layer'+m).addClass('win_visible')		
			
			
			
		
		
		
			
},
	
customPopup	:function(d){
		
    set=$(d).attr('con')
    eid=Number($(d).attr('eid'))
    sid=Number($(d).attr('sid'))
		
    nameSet=$(d).parent().parent().find('legend').html()
		
    graph=$(d).find('div.id span').text()
		
    this.conn_div=d
				
    this.win=new nocwin('Edit/remove custom cacti source graph','','graph');	

    this.win.zindex()
				

    d=this.win.data
			
			
    this.win.isupdate=(set=='set')?true:false;
			
    name=(set=='set')?nameSet:'';
			
    remove=(set=='set')?'<div style="float:left;margin-right:20px;"><a class="abutton el_rem" href="#"><div class="inner">remove</div></a></div>':'';
			
    val=(set=='set')?graph:'';
				
			
    $(d).html('<fieldset style="margin-top:10px;"><legend></legend></fieldset>'+
        '<fieldset><legend>Graph name:</legend><input value="'+name+'" id="cacti_graph_name"></fieldset>'+  
        '<fieldset><legend>Cacti source:</legend><select id="cacti_source"><option value="1">http://192.168.8.1/cacti</option></select></fieldset>'+		
        '<fieldset><legend>GRAPH id<span></span>:</legend><input id="cacti_graph" value="'+val+'" class="size_medium"></fieldset>'+
					  
        '<fieldset style="position:absolute;bottom:10px;right:10px;"><legend></legend>'+
        //'<div style="float:left;margin-right:20px;"><a class="abutton el_disc" href="#"><div class="inner">disconnect</div></a></div>'+	
        remove+
        '<div style="float:left;margin-right:20px;"><a class="abutton el_cancel" href="#"><div class="inner">cancel</div></a></div>'+
						
        '<div style="float:left;margin-right:10px;"><a class="abutton el_set" href="#"><div class="inner">save</div></a></div></fieldset>'
        )	

    this.select('source',sid)
			
			
    //close win
    $(this.win.div).find('div.win_close').click(function(){
        CACTI.win.remove()
    //WIN.show('#win_ip') //set zindex back to 400
    });
    //save 
    $(this.win.div).find('a.el_set').click(function(){
        //IP.vlanset(this)
        $.postJSON('graphing/graph/set',{
            'type':'custom',
            'eid':eid,
            'num':0,
            'name':$('#cacti_graph_name').val(),
            'did':CACTI.did,
            'sour':$('#cacti_source').val(),
            'graph':$('#cacti_graph').val()
        } ,function(json) {
					
						
            if(CACTI.win.isupdate){
                $(CACTI.conn_div).addClass('set').attr({
                    'con':'set',
                    'sid':json.s
                    })
                $(CACTI.conn_div).find('div.id').html('<span>'+json.g+'</span>')
							
                $(CACTI.conn_div).parent().parent().find('legend').html(json.name)
							
            }else{
                CACTI.newElement(json)
							
            }
						
				     
						
            CACTI.updateGraphing()	
						
						
            CACTI.loading(false)
            CACTI.win.remove()
					
        //GRAPHING.window(json)
        //CACTI.make(json)
						
        });	
				
				
    });
			
    //remove 
    $(this.win.div).find('a.el_rem').click(function(){
        //IP.vlanset(this)
        $.postJSON('graphing/graph/rem',{
            'eid':eid,	
            'did':CACTI.did,
            'type':'custom'
        },function(json) {
					
            $(CACTI.conn_div).parent().parent().remove()
				
            CACTI.loading(false)
            CACTI.win.remove()
				
            CACTI.updateGraphing()
					
        });
				
				
    });
			
    //cancel win
    $(this.win.div).find('a.el_cancel').click(function(){
        CACTI.win.remove()
				
    });
				
},	

updateGraphing:function(){
    GRAPHING.load(true);
		
		
},	
		
popup:function(d){
		
    set=$(d).attr('con')
    eid=Number($(d).attr('eid'))
    sid=Number($(d).attr('sid'))
    numer=Number($(d).attr('num'))
    graph=$(d).find('div.id span').text()
		
    this.conn_div=d
				
    this.win=new nocwin('Edit/remove cacti source graph','','graph');	

    this.win.zindex()
				

    d=this.win.data
			
			
    remove=(set=='set')?'<div style="float:left;margin-right:20px;"><a class="abutton el_rem" href="#"><div class="inner">remove</div></a></div>':'';
			
    val=(set=='set')?graph:'';
				
			
    $(d).html('<fieldset style="margin-top:10px;"><legend></legend></fieldset>'+
        '<fieldset><legend>Cacti source:</legend><select id="cacti_source"><option value="1">http://192.168.8.1/cacti</option></select></fieldset>'+		
        '<fieldset><legend>GRAPH id<span></span>:</legend><input id="cacti_graph" value="'+val+'" class="size_medium"></fieldset>'+
					  
        '<fieldset style="position:absolute;bottom:10px;right:10px;"><legend></legend>'+
        //'<div style="float:left;margin-right:20px;"><a class="abutton el_disc" href="#"><div class="inner">disconnect</div></a></div>'+	
        remove+
        '<div style="float:left;margin-right:20px;"><a class="abutton el_cancel" href="#"><div class="inner">cancel</div></a></div>'+
						
        '<div style="float:left;margin-right:10px;"><a class="abutton el_set" href="#"><div class="inner">save</div></a></div></fieldset>'
        )	

    this.select('source',sid)
			
			
    //close win
    $(this.win.div).find('div.win_close').click(function(){
        CACTI.win.remove()
    //WIN.show('#win_ip') //set zindex back to 400
    });
    //save 
    $(this.win.div).find('a.el_set').click(function(){
        //IP.vlanset(this)
        $.postJSON('graphing/graph/set',{
            'type':'port',
            'name':'0',
            'eid':eid,
            'num':numer,
            'did':CACTI.did,
            'sour':$('#cacti_source').val(),
            'graph':$('#cacti_graph').val()
        } ,function(json) {
					
						
            CACTI.loading(false)
            CACTI.win.remove()
					
            $(CACTI.conn_div).addClass('set').attr({
                'con':'set',
                'sid':json.s
                })
            $(CACTI.conn_div).find('div.id').html('<span>'+json.g+'</span>')
            CACTI.updateGraphing()
        //GRAPHING.window(json)
        //CACTI.make(json)
						
        });	
				
				
    });
			
    //remove 
    $(this.win.div).find('a.el_rem').click(function(){
        //IP.vlanset(this)
				
        $.postJSON('graphing/graph/rem',{
            'eid':eid,	
            'did':CACTI.did,
            'type':'port'
        },function(json) {
						
            $(CACTI.conn_div).removeClass('set').attr({
                'con':'',
                'sid':''
            })
            $(CACTI.conn_div).find('div.id').html('<span>-</span>')
					
            CACTI.loading(false)
            CACTI.win.remove()
            CACTI.updateGraphing()
        });
				
    });
			
    //cancel win
    $(this.win.div).find('a.el_cancel').click(function(){
        CACTI.win.remove()
				
    });
				
},	
	
newElement:function(e){
    $('#addNewGraph').remove()
    win_l2=$('#win_graphing_layer2')
	
    field=$('<fieldset/>').addClass('graph_line').appendTo(win_l2)
	
    $('<legend/>').html(e.name).appendTo(field)
	
    div=$('<div/>').addClass('default').appendTo(field)	
	

	
    $(div).html(
        '<div eid="'+e.id+'" sid="'+e.s+'" num="0" con="set" class="graph_data_row set">'+
        '<div class="id"><span>'+e.g+'</span></div>'+
        '<div class="stat"></div>'+
        '</div>')





    $('#win_graphing_layer2 div.graph_data_row').click(function(){
	
        CACTI.customPopup(this)
	
    })

    this.addEl()
	
},			
addEl:function(){
    $('#addNewGraph').remove()	
    fs=$('<fieldset/>').addClass('newfieldadd').attr('id','addNewGraph').appendTo($('#win_graphing_layer2'))

    leg=$('<legend/>').addClass('fieldmenu').html('<span class="anew">Add new element</span>').appendTo(fs)



    $('<div/>').addClass('add_element').html('<div class="icons"></div>').appendTo(fs).click(function(){
	
        CACTI.customPopup(this)
	
    });
	
	
},

make:function(data){
		
    this.sources=data.sources
		
    win_l=$('#win_graphing_layer1')
		
		
    $(win_l).html('')
		
    $.each(data.mac, function(i,e){
			
			
        field=$('<fieldset/>').addClass('graph_port').appendTo(win_l)
			
        $('<legend/>').html('PORT '+(i+1)).appendTo(field)
			
        div=$('<div/>').addClass('default').appendTo(field)	
			
        set=(e.cacti.length==0)?'':'set';	
			
        cacti=(e.cacti.length==0)?'-':e.cacti.graph;
		
        sid=(e.cacti.length==0)?'0':e.cacti.s;
			
        $(div).html(
            '<div eid="'+e.id+'" sid="'+sid+'" num="'+(i+1)+'" con="'+set+'" class="graph_data_row '+set+'">'+
            '<div class="id"><span>'+cacti+'</span></div>'+
            '<div class="stat"></div>'+
            '</div>')
		
    });
    $('#win_graphing_layer2').html('')
    win_l2=$('#win_graphing_layer2')
    $.each(data.custom, function(i,e){
	
		
        field=$('<fieldset/>').addClass('graph_line').appendTo(win_l2)
		
        $('<legend/>').html(e.name).appendTo(field)
		
        div=$('<div/>').addClass('default').appendTo(field)	
		
	
		
        $(div).html(
            '<div eid="'+e.id+'" sid="'+e.s+'" num="0" con="set" class="graph_data_row set">'+
            '<div class="id"><span>'+e.graph+'</span></div>'+
            '<div class="stat"></div>'+
            '</div>')
	
    });
	
	
	
    $('#win_graphing_layer2 div.graph_data_row').click(function(){
		
        CACTI.customPopup(this)
		
    })
	
	
		
    $('#win_graphing_layer1 div.graph_data_row').click(function(){
			
        CACTI.popup(this)
			
    })
		
		
		
		
		
    this.addEl()
		
		
/*
		<fieldset style="width:135px;float:left;">
		<legend>PORT <?php echo $i;?>:</legend>
	<div class="default" style="position:relative;">
	
	</div>	
</fieldset>
		*/
},
window:function(d){
		
		
		
    name=$($(d).parent().find('div.name')[0]).text()
    this.winload=false;
    WIN.show('#win_graphing');
		
		
    $('#win_graphing div.win_header span').text(name);
		
		
    this.did=Number($(d).parent().attr('id').replace('rack_unit',''))
    if(!this.winload){
        CACTI.loadSettings()	
        this.winload=true;
    }
		
		
},
loading:function(key){	
    if(key){
        $('#win_graphing div.win_icon').addClass('deviceLoader').removeClass('default');
			
    }
    else{
				
        $('#win_graphing div.win_icon').removeClass('deviceLoader').addClass('default');
			
    }
			
		
		
},
	
loadSettings:function(){
		
		
    this.loading(true)	
    $.postJSON('graphing/get/mac',{
        "did":this.did
        } ,function(json) {
			
        CACTI.loading(false)
        //GRAPHING.window(json)
        CACTI.make(json)
				
    });
		
}


		
		
		
}