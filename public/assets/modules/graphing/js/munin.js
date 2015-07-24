var MUNIN={
    removeA:function(arr) {
        var what, a = arguments, L = a.length, ax;
        while (L > 1 && arr.length) {
            what = a[--L];
            while ((ax= arr.indexOf(what)) !== -1) {
                arr.splice(ax, 1);
            }
        }
        return arr;
    },
    getObjects:function (obj, key, val) {
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(MUNIN.getObjects(obj[i], key, val));
            } else if (i == key && obj[key] == val) {
                objects.push(obj);
            }
        }
        return objects;
    },
    
    init:function(){
        MUNIN.data=[]
        MUNIN.isAuth=1;
        MUNIN.list=[]
    },
    load:function(){
        
        
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
        $(MUNIN.pop.win.div).find('div.ms_status').html('<span style="color:'+col+'">'+err+'</span>')
		
        return {
            'err':err,
            'col':col
        }
    },	
    useAuth:function(a,n){
        MUNIN.isAuth=a
        if(a==0) $('#munin_auth_data').hide()
        else $('#munin_auth_data').show()
    //console.log(a,n)
        
    },
    db:function(key,val){
        var o=$.inArray(val,MUNIN.data)
        switch(key){
            case 'add':
                if(o==-1) MUNIN.data.push(val)
                break;
            case 'rem':
                if(o>=0) MUNIN.data=MUNIN.removeA(MUNIN.data,val)
                break;
            case 'get':
                return (o>=0)?true:false;
                break;
        }
        
        
        
    },
    makeList2:function(d){
		
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
                    m=$('<div/>').addClass('graph_service').attr({
                        'host':ind,
                        'service':0
                    }).html(
                        '<div class="n"><span>'+e.name+'</span></div>'+
                        '<div class="graph_holder graph2" s="'+e.source+'" graph="'+e.graph+'" port="'+e.name+'" did="'+did+'" src="/graphing/graph/get/'+e.source+'/'+e.graph+'/'+size+'/'+CACTI.activLi+'">'+
						
						
                        //'<div class="menu"></div>'+
                        '</div>').appendTo($('#graph_hover'));
                });
				
			
		
            }else{
                $(d).addClass('defgraph')
                m=$('<div/>').addClass('graph_service').html(
                    '<div class="n"><span>No data</span></div>'
                    ).appendTo($('#graph_hover'));
		
            }
		
		
        }
    },
    
    makeList:function(d){
        this.listData()
        
        
    },
    loading:function(key){
        if(key){
            $('<div/>').addClass('graph_service munin_service').attr({
                'id':'munin_load',
                'service':0
            }).html(
                '<div class="n"><span>Loading munin..</span></div>'+
                '<div class="graph_holder graph2">'+
						
						
                //'<div class="menu"></div>'+
                '</div>').appendTo($('#graph_hover'));
        }else{
            $('#munin_load').remove();
        }
	  
        
    },
    make:function(list){
        if(list.data.length>0)
            $('#cacti_nodata').remove()
        $.each(list.data,function(i,e){
        
            $('<div/>').addClass('graph_service munin_service').attr({
                'id':'munin_graph'+i,
                'service':0
            }).html(
                '<div class="n"><span style="text-transform:uppercase;">'+e.replace('-day.png','')+'</span></div>'+
						
						
                '<div class="graph_holder graph_m" id="munin_graph_holder'+did+'" src="/graphing/munin/get/'+e.replace('-day.png','')+'/'+list.id+'/1">'+
						
                //'<div class="menu"></div>'+
                '</div>').appendTo($('#graph_hover'));
                                                
     
 
        });

        GRAPHING.hoverAction()
    },
    
    listData:function(){
        //get list of graphs for device local
        
        m=MUNIN.getObjects({
            "data":MUNIN.list
        }, 'id', GRAPHING.dev)
        if(m.length==0){
         
            //console.log(GRAPHING.dev)
            this.loading(true)
         
            $.postJSON('graphing/get/munin',{
                "did":GRAPHING.dev
            } ,function(json) {
                MUNIN.loading(false)
                MUNIN.list.push(json.list)
                MUNIN.make(json.list)
          
            
            });
        }else{
            
            MUNIN.make(m[0])
        }
    //  console.log(m)
        
    },
    
    windowFromSettings:function(id){
        
        GRAPHING.dev=id
        ss=$('#rack_unit'+id+' div.device_graph')
        
        if($(ss).length>0){
        MUNIN.window(ss)}
        
    },
    window:function(s){
    
        MUNIN.dev=$(s).parent().attr('id').replace('rack_unit','')
    
    
        var pop=new POPUP.init(
            'Munin data for device',   //popup title
            'munin_set',    //popup name
            'windows',      //parent window
            {
                w:400,     //width 
                h:260,      //height
                wdclass:'orang'
            })
        MUNIN.pop=pop
    
    
        if($(s).hasClass('munin')){
    
            //get data from server.. 
        
            pop.data(
             
            {
                    save:false,     //save button
                    rem:false,     //remove button
                    cancel:true,   //cancel 
                    add:false,      //add
                    test:false
                },
                '<div class="datadiv">'+
		
                '<fieldset style="margin-top:0px;">'+
                '<div class="pop_warn">Loading data from server..</div>'+
                '</fieldset>'
                )
            MUNIN.pop.action(
                'windows',
                //add
                function(){},
                //save
                function(){},
                function (){
                    MUNIN.pop.win.remove()
                },
                function (){
                    MUNIN.pop.win.remove()
                }
                );  
            
            $.postJSON('graphing/munin/data',{
                "did":GRAPHING.dev
            } ,function(json) {
           
                MUNIN.newData=json.data
           
                isactive='';
                ac=0
                console.info(json.data.user.length)
                st='display:none;'
                if(json.data.user.length>=1){
                    ac=1
                    isactive=' active';
                    st='display:block;'
                }
           
                MUNIN.pop.data(
             
                {
                        save:true,     //save button
                        rem:true,     //remove button
                        cancel:true,   //cancel 
                        add:false,      //add
                        test:true
                    },
                    '<div class="datadiv">'+
		
                    '<fieldset style="margin-top:20px;padding:0px;">'+
                    '<legend>Url to munin data:</legend><input id="munin_url"  style="font-size:12px;width:360px;" value="'+MUNIN.newData.url+'">'+
                    '<div style="margin-top:10px;width:370px;clear:both;"><div style="float:left;width:50%;height:80px;">'+
                    '<div id="muninAuth" class="element button_element"><div class="print_checkboxs"><div class="check_box" m="1" act="'+ac+'"><div class="icons '+isactive+'"></div><div class="name">Authentication</div></div></div></div>'+
                    '</div><div id="munin_auth_data" style="'+st+'float:left:width:50%;"><legend>User:</legend><input  id="munin_usr" style="width:160px;" value="'+MUNIN.newData.user+'">'+
                    '<legend>Password:</legend><input id="munin_pwd" type="password" style="width:160px;" value="'+MUNIN.newData.pass+'"></div>'+
                    '</div></fieldset><fieldset>'
                    +'<div class="ms_status" style="width:360px;"><span></span></div></fieldset>'
                    )
                MUNIN.pop.action(
                    'windows',
                    //add
            
                    function(){
              
                      
                    },
                    //save
                    function(){
                        $.postJSON('graphing/update',{
                            "type": 2,
                            "url": $('#munin_url').val(),	
                            "usr": $('#munin_usr').val(),
                            "pwd": $('#munin_pwd').val(),
                            'auth':MUNIN.isAuth,
                            'dev':MUNIN.dev
                        } ,function(json) {
			
                            if(json.code=='ok'){
                                MUNIN.db('add',json.data.dev)
				
                                $('#rack_unit'+GRAPHING.dev+' div.device_graph').addClass('munin')
                          GRAPHING.reload()
                                MUNIN.pop.win.remove()
                            }else{
				
                                MUNIN.getErrCode(json.code)
                            }
			
                        //console.log(json)
                        });
                    },
                    //rem
                    function (){
                       
                        $.postJSON('graphing/munin/rem',{
                            'dev':MUNIN.dev
                        } ,function(json) {
			
                            if(json.stat=='ok'){
                            
                                //MUNIN.db('rem',json.data.dev)
				
                                $('#rack_unit'+MUNIN.dev+' div.device_graph').removeClass('munin')
                           
                                MUNIN.pop.win.remove()
                        
                             MUNIN.removeFromGraphing(MUNIN.dev)
                        
                               //if(GRAPHING)
                                
                            }else{
				
                                //MUNIN.getErrCode(json.code)
                            }
			
                        //console.log(json)
                        });
                        
                    },
                    //cancel
                    function (){
                        MUNIN.pop.win.remove()
                    }
                    );   
           
                //cancel
                $(MUNIN.pop.win.div).find('a.el_test').click(function(){
	   
                    //console.log('asdas')
                    $.postJSON('graphing/test',{
                        "type": 2,
                        "url": $('#munin_url').val(),	
                        "usr": $('#munin_usr').val(),
                        "pwd": $('#munin_pwd').val(),
                        'auth':MUNIN.isAuth,
                        'dev':MUNIN.dev
                    } ,function(json) {
		
                        console.log(json)
                        MUNIN.getErrCode(json.code)
			
                    });
        
                });
                    
                $('#muninAuth div.check_box').click(function(){
	
                    ac=Number($('#cactigraphsize div.check_box').attr('act'))
                    $('#cactigraphsize div.check_box div.icons').attr('class','icons')
                   
                    if(ac==1){
                        $('#cactigraphsize div.check_box').attr('act','0')
                    
                    }else{
                        $('#cactigraphsize div.check_box').attr('act','1')
                    
                    }
	
                    active=ELEMENT._checkbox(this)
	
	
                    num=Number($(this).attr('m'))
	
                    MUNIN.useAuth(active,num)
	
	
	
                });
            });
            
           
            
            
        }else{
            pop.data(
             
            {
                    save:true,     //save button
                    rem:false,     //remove button
                    cancel:true,   //cancel 
                    add:false,      //add
                    test:true
                },
                '<div class="datadiv">'+
		
                '<fieldset style="margin-top:20px;">'+
                '<legend>Url to munin data:</legend><input id="munin_url" style="font-size:12px;width:360px;" value="">'+
                '<div style="margin-top:10px;width:400px;clear:both;"><div style="float:left;width:50%;height:80px;">'+
                '<div id="muninAuth" class="element button_element"><div class="print_checkboxs"><div class="check_box" m="1" act="1"><div class="icons active"></div><div class="name">Authentication</div></div></div></div>'+
                '</div><div id="munin_auth_data" style="float:left:width:50%;"><legend>User:</legend><input id="munin_usr" style="width:160px;" value="">'+
                '<legend>Password:</legend><input id="munin_pwd" type="password" style="width:160px;" value=""></div>'+
                '</div></fieldset><fieldset>'
                +'<div class="ms_status" style="width:360px;"><span></span></div></fieldset>'
                )
            pop.action(
                'windows',
                //add
            
                function(){
              
                      
                },
                //save
                function(){
                    $.postJSON('graphing/add',{
                        "type": 2,
                        "url": $('#munin_url').val(),	
                        "usr": $('#munin_usr').val(),
                        "pwd": $('#munin_pwd').val(),
                        'auth':MUNIN.isAuth,
                        'dev':MUNIN.dev
                    } ,function(json) {
			
                        if(json.code=='ok'){
                            MUNIN.db('add',json.data.dev)
				
                            $('#rack_unit'+MUNIN.dev+' div.device_graph').addClass('munin')
                            GRAPHING.reload()
                            /*
                                 *
                                 *
                    $('<div/>').addClass('data_row').attr('eid',json.data.id).html(
                        '<div class="s_type"><span>'+json.data.name+'</span></div>'+
                        '<div class="s_url">'+json.data.content+'</div>'+
                        '<div class="s_stat" data="'+json.data.content+'">Ok</div>').appendTo($('#graphing_source'))	
				*/
                            MUNIN.pop.win.remove()
                        }else{
				
                            MUNIN.getErrCode(json.code)
                        }
			
                    //console.log(json)
                    });
                
              
            
                },
                //remove
                function(){},
                //cancel
                function(){
                    pop.win.remove()
                });
            //close win

            //cancel
            $(pop.win.div).find('a.el_test').click(function(){
	   
                $.postJSON('graphing/test',{
                    "type": 2,
                    "url": $('#munin_url').val(),	
                    "usr": $('#munin_usr').val(),
                    "pwd": $('#munin_pwd').val(),
                    'auth':MUNIN.isAuth,
                    'dev':MUNIN.dev
                } ,function(json) {
		
                    console.log(json)
                    MUNIN.getErrCode(json.code)
			
                });
        
            });
                    
            $('#muninAuth div.check_box').click(function(){
	
                $('#cactigraphsize div.check_box').attr('act','0')
                $('#cactigraphsize div.check_box div.icons').attr('class','icons')
	
	
                active=ELEMENT._checkbox(this)
	
	
                num=Number($(this).attr('m'))
	
                MUNIN.useAuth(active,num)
	
	
	
            });
        
        }
    
    
    
    
    
    
             
        
        
    },
    removeFromGraphing:function(dev){
        
     $('#graphing_munin div[eid='+dev+']').remove()
        
    }
    
    
}