var IPM={
    
    deviceMenu:function(){
        DEVICE.menuLEN++;
        //add new menu to device win
        /*
        num=WIN.addMenu('win_device', 'IPAM')
        WIN.addLayer('win_device', num)
        */
      
        num=WIN.addMenu('win_rack', 'IPAM')
        WIN.addLayer('win_rack', num)
        
        
      
    },
    winresize:function(){
        if(this.maxwin){
            WIN.max($('#win_ipm')) 
        }
    }, 
    winmin:function(d){
        
        $('#ipm_tree').parent().css('height','525px');
        $('#ipm_tree').css('height','520px');
        wd=$('#win_ipm div.win_data')
        $(wd).css({
            'width':'778px',
            'height':'500px'
        })
        $(wd).parent().css({
            'width':'778px',
            'height':'500px'
        })
        m=$('#win_ipm div.ipm_bar').css({
            'width':'760px',
            'height':'255px'
        }).attr('from','0')
        s=$(m).size()
        /*
        if(size>0){
            $.each($(m),function(i,e){
                $(e).html('')
               $(e).attr('from','0') 
               id=$(e).attr('id')
               IPM_GRAPHS.bar(id)
            });
        }
        */
        
        IPM.maxwin=false
        IPM_layers.update()
    },
    winmax:function(d){
       
        h=winh-60;
        w=winw-242
        $('#ipm_tree').parent().css('height',h+'px');
        $('#ipm_tree').css('height',(h-5)+'px');
        wd=$('#win_ipm div.win_data')
        $(wd).parent().css({
            'width':w+'px',
            'height':(h-25)+'px'
        })
        $(wd).css({
            'width':w+'px',
            'height':(h-25)+'px'
        })
        m=$('#win_ipm div.ipm_bar').css({
            'width':(w-18)+'px',
            'height':(h-280)+'px'
        }).attr('from','0')
        
        IPM_layers.update()
        IPM.maxwin=true
    },
    init:function(){
        
        //add menu to windows
        Hook.register('deviceMenu',function(a){
            IPM.deviceMenu()    
        });
        
        //update window on maximize
        Hook.register('winMaximize',function(a){
            IPM.winmax(a)    
        });
        
        //update window on minimize
        Hook.register('winMinimize',function(a){
            IPM.winmin(a)    
        });
            
        //update window on minimize
        Hook.register('browserResize',function(){
            IPM.winresize()    
        });
        
        //update menu
        Hook.register('menuWin',function(ob){
            IPM.menu(ob)    
        });
            
        //ipm window show
        Hook.register('winShow',function(ob){
            IPM.show(ob)    
        });
        
        //ipm window show
        Hook.register('winClose',function(ob){
            IPM.close(ob)    
        });
            
        $('#win_ipm div.right').click(function(){
            IPM.right(this)
        });
        $('#win_ipm div.left').click(function(){
            IPM.left(this)
        });
         
         
        this.temporary=$('#win_ipm div.win_data').clone(true)
        $('#win_ipm div.win_data').html('')
         
        IPM_layers.__construct()
         
        this.actionClick()
     
       
       
       
  
        
        
    },
    setFrom:function(a,dif){
        graph=$(a).parent().attr('graph')
        
        
        f=Number($('#'+graph).attr('from'))
        $('#'+graph).attr('from',f+dif)
        
        if(graph=='ipm_bar')
            IPM_GRAPHS.bar(graph)
    
        if(graph=='ipm_sub_lay_1')
            IPM_layers.makemapList()
    
        
    },
    right:function(a){
        
        if($(a).attr('act')=='ok')
            this.setFrom(a,1)
    },
    left:function(a){
        if($(a).attr('act')=='ok')
            this.setFrom(a,-1)
    },
    
  
    actionClick:function(){
        $('#win_ipm div.half_menu li').click(function(){
            
            $(this).parent().find('li').removeClass('active')
            $(this).addClass('active')
            m=$(this).parent().attr('menu')
            l=$(this).parent().attr('layer')
            menu=eval('IPM_layers.'+m)
            t=Number($(this).attr('type'))
            $(this).parent().parent().parent().find('div.ipm_data_map_list').hide()
            $('#'+l+'_'+t).show()
            
            
            menu(t)
           
        });  
    },
    resetMenu:function(){
        $('#win_ipm div.win_menu li').removeClass('aktive')
        $($('#win_ipm div.win_menu li')[0]).addClass('aktive')
        $('#win_ipm div.win_layer').removeClass('win_visible')
        $('#win_ipm_layer1').addClass('win_visible')
       
    },
    close:function(ob){
        if(ob=='win_ipm'){
           
            //remove table wrapers
            $('#ipm_list_wrapper').parent().html('<table width="100%" cellspacing="0" cellpadding="0" id="ipm_list" class="dataTable"></table>')
           
            this.temporary=$('#win_ipm div.win_data').clone(true)
            $('#win_ipm div.win_data').html('')
            
        }
        
    },
    show:function(ob){
        
        if(ob.win=='#win_rack'){
            
            
            if(IPM_rack.num==3)
            IPM_rack.init()
        }
        
        if(ob.win=='#win_ipm'){
            if(!this.set){
                this.activeMenu=1;
                this.tree()
                this.set=true
            }
        
            if(this.temporary){
                $('#win_ipm div.win_data').replaceWith(this.temporary)
                this.temporary=false
         
            
        
        
                //this.resetMenu() 
        
        
        
        
                //make left menu tree 
                //this.tree()
         
         
                IPM_layers.update()   
         
            //plot overview
            }
         
            
            
         
        }
        
    },
    
    loading:function(key){
        if(key)
            $('#win_ipm div.win_icon').addClass('deviceLoader').removeClass('default');
        else
            $('#win_ipm div.win_icon').removeClass('deviceLoader').addClass('default');
    },
    
    
    
    tree:function(){
        
        $("#ipm_tree")
        .bind("before.jstree", function (e, data) {
            $("#alog").append(data.func + "<br />");
        })
        .jstree({ 
            // List of active plugins
            "plugins" : [ 
            "themes","json_data","ui","crrm","dnd","types" 
            ],

				
            // I usually configure the plugin that handles the data first
            // This example uses JSON as it is most common
            "json_data" : { 
                // This tree is ajax enabled - as this is most common, and maybe a bit more complex
                // All the options are almost the same as jQuery's AJAX (read the docs)
                "ajax" : {
                    // the URL to fetch the data
                    "url" : "./ipm/subnets",
                    //type 
                    "type": 'POST',
                    // the `data` function is executed in the instance's scope
                    // the parameter is the node being loaded 
                    // (may be -1, 0, or undefined when loading the root nodes)
                    "data" : function (n) { 
                        // the result is fed to the AJAX request `data` option
                        return { 
								 
                            "rel" : n.attr ? n.attr("rel") : 'root',
                            "id" : n.attr ? n.attr("id").replace(n.attr("rel")+'_','') : '0' 
                        }; 
                    }
                }
            },

            // Using types - most of the time this is an overkill
            // read the docs carefully to decide whether you need types
            "types" : {
                // I set both options to -2, as I do not need depth and children count checking
                // Those two checks may slow jstree a lot, so use only when needed
                "max_depth" : -2,
                "max_children" : -2,
                // I want only `drive` nodes to be root nodes 
                // This will prevent moving or creating any other type as a root node
                "valid_children" : [ "main" ],
                "types" : {
                    // The default type
                    "subnet" : {
                        // I want this type to have no children (so only leaf nodes)
                        // In my case - those are files
                        "valid_children" : "none",
                        // If we specify an icon for the default type it WILL OVERRIDE the theme icons
                        "icon" : {
                            "image" : "/assets/modules/ipm/img/icons.png",
                            "position": "0px 0px"
                        }
                    },
                    // The `subnode` type
                    "subnode" : {
                        // can have files and other folders inside of it, but NOT `drive` nodes
                        "valid_children" : [ "subnet" ],
							
                        "icon" : {
                            "image" : "/assets/modules/ipm/img/icons.png",
                            "position": "0px -25px"
                        }
							
                    },
                    // The `node` nodes 
                    "node" : {
                        // can have files and folders inside, but NOT other `drive` nodes
                        "valid_children" : [ "subnode","subnet" ],
							
                        "icon" : {
                            "image" : "/assets/modules/ipm/img/icons.png",
                            "position": "0px -50px"
                        },
                        // those prevent the functions with the same name to be used on `drive` nodes
                        // internally the `before` event is used
                        "start_drag" : false,
                        "move_node" : false,
                        "remove" : false
                    },
                    "main" : {
                        // can have files and folders inside, but NOT other `drive` nodes
                        "valid_children" : [ "node" ],
							
                        "icon" : {
                            "image" : "/assets/modules/ipm/img/icons.png",
                            "position": "0px -75px"
                        },
                        // those prevent the functions with the same name to be used on `drive` nodes
                        // internally the `before` event is used
                        "start_drag" : false,
                        "move_node" : false,
                        "remove" : false
                    }
                                                
                                                
                                                
                                                
                }
            },
				
				
            "core" : { 
                // just open those two nodes up
                // as this is an AJAX enabled tree, both will be downloaded from the server
                "initially_open" : [ "main_1" ,"node_1"] 
            }

				
        }).bind("select_node.jstree", function (e, data) {
				
                                
            IPM.selected=data.rslt.obj
				  
                                
            rel=data.rslt.obj.attr('rel')
				
            switch(rel){
                default:
                    //root
                    set=Array(true,false,false,false,false,false,false,false,false)
                    break;
                case 'main':
                    //building
                    set=Array(true,true,true,true,false,false,false,false,false)
                    break;
                case 'node':
                    //floor
                    set=Array(true,false,false,false,true,true,true,false,false)
                    break;
                case 'subnode':
                    //room
                    set=Array(true,false,false,false,false,false,false,false,true)
                    break;
                case 'subnet':
                    //room
                    set=Array(true,false,false,false,false,false,false,true,true)
                    break;
            }
            IPM_layers.update()
                                
        /*
				butt=$('#win_building div.win_button')
				
				$.each(butt, function(i,e){
					
					if(set[i]){
					$(this).removeClass('disabled')	
					}else{
					$(this).addClass('disabled')
					}
					
					
					
				});
                                */
				
				
        })
    ;   
        
    },
    
    bar:function(){
 
      
      
     
     
     
     
    
  
    },
  
    macList:function(){
        oTable=$('#ipm_mac_list').dataTable( {
            "oLanguage": {
                "oPaginate": {
                    "sNext": "",
                    "sPrevious": ""
                }
            },
            "iDisplayLength": 10,
            "bFilter": false,
            "bLengthChange": false,
            "aaData": [
            /* Reduced data set */
            
            [ "12.168.8.0", "98:8B:5D:F0:D2:31"],
            [ "10.10.8.5","F8:D1:11:78:EA:3A"],
            [ "19.168.84","1C:6F:65:F9:31:A3" ],
            [ "92.168.82", "00:04:25:AA:00:DB"],
            [ "77.168.8.2", "88:30:8A:7C:E4:F6"],
            [ "12.18.8.4", "00:4F:62:1A:15:86" ],
            [ "192.168.8.2", "C0:F8:DA:42:FA:5A"],
            
            ],
            "aoColumns": [
            {
                "sTitle": "Device IP Address"
            },
            {
                "sTitle": "Switch/Router MAC Address"
            }
            ]
        } );

        
    },
    
    table:function(){
        
     
    },
    menu:function(d){
   
        if(d.win=='win_ipm'){
            this.activeMenu=d.num;
       
            IPM_layers.plot()
     
        }
        
        if(d.win=='win_rack'){
            IPM_rack.num=d.num
            IPM_rack.init()
     
        }
        
       
    }
  
    
    
    
    
}
