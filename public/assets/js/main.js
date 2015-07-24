//global variables
//jQuery.fx.off = true,  
mouseX = 0; 
mouseY = 0;
winw=0;
winh=0;
scroll=false;
cscroll=0


jQuery.extend({
    postJSON: function( url, data, callback) {
        return jQuery.post(url, data, callback, "json");
    }
});  


$(document).ready(function(){
	

    window.onerror=ERRORS.inside

    //handle all ajax errors
    $.ajaxSetup({
        error: ERRORS.dialog
    });	

    $(document).scroll(function() {
	
        //fix for scroll main  header out on drag&drop window
        $(document).scrollTop(0) 
    });
	
	
	
    // rebuild data when user resize browser
    $(window).resize(function() {
        CARTESIAN.init()
	
    });

    //update window size and set initial height
    CARTESIAN.init()
	
    //global variables for mouse position
    $(document).mousemove(function(e){
        mouseX = e.pageX;
        mouseY = e.pageY;

	    
	    
    });	
	
    if (typeof WHMCS !== 'undefined') {
           WHMCS.check() // reset cables
        }    
        
    WIN.init();
    //check if user is logged, if not then display login win
    LOGIN.init()
    LOGIN.check()
	
});




var LOGIN={
    init:function(){
        
        this.loged=hlog;
        this.user=huser;
        this.ltype=htyp;
        this.settings=$.parseJSON(settings);
        //set default background
        $('#content').addClass('back'+this.settings[0].value);
        NOC.setNavAction();
    },
    reload:function(){
        location.reload()
    },

    logout:function(){

	
        $.postJSON('auth/logout','', function(data) {
            LOGIN.reload()
        });
	
	
	
    },

    connect:function(n,p){
     //   //console.log(n)	
	
        $.postJSON('auth/login',{
            'n':n,
            'p':p,
            'log':'ok'
        }, function(data) {
		
		
            if(data.log){
                WIN.close('#win_login')
                LOGIN.loged='ok'
                LOGIN.user=data.lname
                LOGIN.ltype=data.ltyp
	
                NOC.updateSettings(data.settings)	
                LOGIN.settings=data.settings
                LOGIN.check()
                $('ul.menu_right span.logname').text(data.lname)
	
			
            }else{
                $(LOGIN.logset).hide();
                //console.log("wrong")
                $(LOGIN.alert).show()
                $(LOGIN.fin).focus()
				
            }
		
		
	
        }).error(function(e,b){
		
            //console.error(e.responseText)
		
            });



    },
    action:function(){
	
        inpp=$('#win_login').find('input')
        this.alert=$('#win_login').find('div.win_alert')
        this.logset=$('#win_login').find('div.win_logset')
        this.fin=inpp[0]
	
        if($(inpp[0]).val().length>0 && $(inpp[1]).val().length>0){
            $(this.alert).hide();
		
            $(this.logset).show();
		
            LOGIN.connect($(inpp[0]).val(),$(inpp[1]).val())
		
		
        }else{
            if($(inpp[0]).val().length==0){
			
			
                $(inpp[0]).focus()
			
            }else{
                if($(inpp[1]).val().length==0){
				
                    $(inpp[1]).focus()
                }	
			
            }	
		
		
        }	
	
	
    },

    check:function(){
        if(this.loged=='no'){
            WIN.show('#win_login')	
            $('#win_login').find('input')[0].focus()	
        }else{

            PRELOAD.dataset()	
	
        }	
	
	
    }
		
		
}

var HEAD={
    init:function(){
			
        //console.log(HEAD.manifest)
			
        head=HEAD.manifest.header
			
        //settings elements
        $.each(head.settings,function(i,e){
			
            $('<li></li>')
            .addClass('sub_menu_div')
            .html('<a href="#" class="menu_click" win="'+e.win+'"><div>'+e.name+'</div></a>')
            .prependTo($('#head_menu_settings_sub'))
				
        });
			
        //header list elements
        $.each(head.navigation,function(i,e){
            //console.log(e)
            ul=$('<ul></ul>')
            .addClass(e.cls)
            .appendTo($('#header'))
            if(e.id){
                $(ul).attr('id',e.id)
					
            }
            if(e.data.length>0){
                $.each(e.data,function(ii,ee){
                    $('<li></li>')
                    .addClass('menu_div')
                    .attr('id',"headmenu_"+ee)
                    .appendTo($(ul))
								
						
                });

					
            }
				
				
				
        });
				
	
	HEAD.headerClass(this.manifest.version)
                              
    },
	
headerClass:function(cls){
    $('#header').addClass('ver_'+cls)
    
},	
    action:function(){
        /*
        $("ul.menu_noc li").mouseover(function(){
            $(this).parent().find("ul.sub_menu").show()
            $(this).parent().hover(function() {  
                }, function(){  
                    $(this).parent().find("ul.sub_menu").hide()
                });  

        });
        */
			
       // NOC.setNavAction();
			
    }
				

}

var COMET={
   
   iframe:function(url){
       this.destroy();
    $('<iframe src="'+url+'"></iframe>').addClass('hidenframe').attr('id','hiddeniframe').appendTo($('#windows'));
       
   }, 
   destroy:function(){
       $('#hiddeniframe').remove()
       
   }
   
    
}
function warn(type,msg){
    
    UPDATE.warn(type,msg)
    
   
}

var UPDATE={
    none:function(){
        
        $('#update2_track').remove();
         
         $('#wraper').append($('<div></div>').attr('id','update2_track').addClass('update noupdate').html(
    '<div class="title">No update available!</div>'+
    '<div style="top:0px;right:20px;position:absolute">'+
    '<div style="float:right;" class="button"><a href="#" class="abutton upgrade2_hide"><div class="inner">hide</div></a></div>'+

'</div>'    
    ));
	
        
$('a.upgrade2_hide').click(function(){
		//$(this).find('div.icons').addClass()
		    
                    $("#update2_track").slideUp('fast');
                    
                 
});  
        
    },
    
   check:function(){
        $.postJSON('update/check','', function(data) {
            
            
            if(data.warn)
            {
            
             $("#up_cur_ver").html(data.version)
              $("#up_avi_ver").html(data.available)
            
               UPDATE.make(data)
            }else{
                
             UPDATE.none()   
            }
            
        });
       
   },
   reload:function(){
       
       location.reload();
   },
   addRow:function(pre,title,data){
     this.con.append('<div class="title">'+title+'</div>'+
	'<div class="data">'+data+'</div>');  
       
   },
   warn:function(type,msg){
      // console.warn(type,msg)   
       this.con=$('#upgrade_stat')    
       
       types=['start','size','writeable','total','end','backup','extract','migrate'];
       t=Number(type);
       $('#win_upgrade div.win_data').scrollTop(10000)
       
       switch(types.indexOf(type)){
        //start
        case 0:    
        console.info('start')
        
        break;
        //size
        case 1:
        console.info('size',msg)
        
        
        break;
        //writeable
        case 2:
        if(msg=='no'){
    
    $('#upgrade_progress').parent().addClass('noact')
    $('#upgrade_extract').parent().addClass('noact')
    $('#upgrade_migration').parent().addClass('noact')
      $('#bepatient').hide()       
            $('#upgrade_ftp').show()
   
        }else{
            $('#upgrade_normal').show()
        }
        $('#upgrade_write').html('<div>'+msg+'</div>') 
        //this.addRow(false,'Can write to disk',msg);
        console.warn('writeable',msg)
        break;
        //total
        
        case 3:
        $('#upgrade_progress').append('<div>'+msg+'</div>')
        //console.log(msg)
        break;
        //end
        case 4:
         $('#bepatient').hide()
         $('#upgrade_local').hide()
        $('#upgrade_reload').show()
        console.info(msg)
        break;
        //backup
        case 5:
        //console.log(msg)
        break;
        //extract
        case 6:
         $('#upgrade_extract').append('<div>'+msg+'</div>')    
        //console.log(msg)
        break;
      //migrate
        case 7:
         $('#upgrade_migration').append('<div>'+msg+'</div>')
        //console.log(msg)
        break;
   }
       
   },
   //TODO: add hook for nagios/cacti to stop ping server on update
   auto:function(){
    
    $('#upgrade_write').html('')    
    $('#upgrade_progress').html('')    
    $('#upgrade_extract').html('')    
    $('#upgrade_migration').html('')
    
    WIN.close('#win_update');
    WIN.show('#win_upgrade');
      $('#upgrade_local_data').hide()
      $('#upgrade_stat').show()
      $('#bepatient').show();
       COMET.iframe(mainpath+'update/auto')
       
    },
    manual:function(){
      window.open('update/manual','_blank');

      
      
      
    },
    head_data:function(){
        
        
        //add wiki menu
	$('#headmenu_update').html(
			'<a class="menu_a upgrade_click" href="#"><div class="icon_menu">'+
			'<div class="icons updateicon_active hint" act="2" hint="New update available"></div>'+
			'</div></a>'
	)	
	$('#update_track').remove()
        
        $('#wraper').append($('<div></div>').attr('id','update_track').addClass('update').html(
    '<div class="title">New update available!</div>'+
    '<div style="top:0px;right:20px;position:absolute">'+
    '<div style="float:right;" class="button"><a href="#" class="abutton upgrade_hide"><div class="inner">hide</div></a></div>'+
'<div style="float:right;" class="button"><a href="#" class="abutton upgrade_show"><div class="inner">show</div></a></div>'+
'</div>'    
    ));
	

$('a.upgrade_show').click(function(){
		//$(this).find('div.icons').addClass()
		
		WIN.show('#win_update');
                $("#update_track").slideUp('fast');
	});	
        
$('a.upgrade_hide').click(function(){
		//$(this).find('div.icons').addClass()
		    
                    $("#update_track").slideUp('fast');
                    
                 $.postJSON('update/mute',{},function(json){
                     
                 });
                 
              
                 
                 
		
});	

        
        
        
        
$('a.upgrade_click').click(function(){
		//$(this).find('div.icons').addClass()
		WIN.show('#win_update');
		 $("#update_track").slideUp('fast');
	});	
        
    },
 localUpgrade:function(){
 
 $('#bepatient').hide();
 
 $('#upgrade_local').show();


},
 
 golocal:function(){
     
   COMET.iframe(mainpath+'update/auto')  
 },
 
 make:function(data){
  ////console.log(data)    

    if(data.warn){
        
    console.info('upgrade head')

if(data.is_local){
 
 WIN.show('#win_upgrade');
 this.localUpgrade()   
return true;
}else{
  
this.head_data();
if(Number(data.quiet)==1){
    $('#update_track').hide()
    
}

}    
    }
return false;   
      
     
 },
 
    init:function(){


    data=$.parseJSON(upgrade)


     return this.make(data)
    
    
    
}}

var PRELOAD={
    dataset:function(){
	
	if(LIC.init())
       {
           
        $.getJSON('assets/modules/manifest.json','', function(data) {
	
            HEAD.manifest=data
		
                
                
		
		
            if(mode!=data.version){
                console.warn('Wrong module assets!');
			
            }else{
                
                HEAD.init()
			
                if(!UPDATE.init()){
			
                $.each(data.init,function(i,e){
                    eval(e).init()
			
                });
		}        
		
                //right menu action
                $('a.menu_click').click(function(){
				
                    m=$(this).attr('win')
                    if(m){
					
                        WIN.show('#win_'+m);
                    }
                    a=$(this).attr('act')
                    if(a=='logout')LOGIN.logout();
				
                }); 
			
            }
		
		
        ////console.log(data)
        });
	
    }
	
	
    /*
	if(typeof BASIC != 'undefined')
		BASIC.init()
	if(typeof ADVANCED != 'undefined')
		ADVANCED.init()
	if(typeof BASIC != 'undefined')
		PREMIUM.init()
	
	*/
		
    /*
		 * HEADER.init();
	SEARCH.init()
	NETWORK.init();
	HARDWARE.init();
	WIKI.actions();
	VPS.init();
		 * */
		
	
	
    },
    respond:function(){
	
	
	
    }
			
}
/**
 * Coordinate system 
 * @author Hrvoje
 * 
 */

var CARTESIAN={
		
    //called every time window resize
    init:function(){
        
        //GLOBAL VARIABLES
        winw=$(window).width() 		// total width of window	
        winh=$(window).height()		// total height of window		
			
			
        var contentHeight=winh-35 // remove header height
		
        if(typeof CAGE !=='undefined')
        {
            CAGE.setHeight(); // in basic version
            CAGE.matrix()     // in basic version
				
            if(CAGE.set)	CAGE.reset() // reset cage for racks
				
        }
        
        if (typeof CABLE !== 'undefined') {
            if(CABLE.set)	CABLE.reset() // reset cables
        }
		 
        if (typeof IMAGE !== 'undefined') {
            IMAGE.resize()
        }
		 
        //update windows height for D&D 
        $('#windows').css('height',contentHeight+'px');
		
                
                Hook.call('browserResize','');
		
    }	
			
}	

var NOC={
alertBox:function(title,text,win,css){
    
     var pop=new POPUP.init(
            title,   //popup title
            'noc_alert_pop',    //popup name
            win,      //parent window
            {
                w:380,     //width 
                h:160,      //height
                wdclass:css
            })
                   
                   
        pop.data(
             
        {
                save:false,     //save button
                rem:false,     //remove button
                cancel:true,   //cancel 
                add:false      //add
                
            },
            "<div class='pop_warn'>"+text+"</div>"
            
            );
            
        pop.actionSet(win, ['close', 'cancel'], function() {
            pop.win.remove()
        });    
    
    
    
},	
    loadModule:function(mod) {
        var element = document.createElement('script');
        element.setAttribute('type','text/javascript');
        element.setAttribute('src',mod);
        document.getElementsByTagName('head')[0].appendChild(element);
			
    },
			
    isset:function(v){
        if(typeof(v) != "undefined" && v !== null) return true;
        return false
			
    },		
    getBack:function(){
m=this.settings.length
for(i=0;i<m;i++){
    if(this.settings[i].name=='background')
        return this.settings[i].value
}

    },
            updateSettings:function(set){
        this.settings=set;

        $('#content').addClass('back'+this.getBack());
        $('#cables').addClass('back'+this.getBack());

        back=$('#backgrounds').find('div.set_back')
        $(back).removeClass('activbg')
        $(back[this.getBack()-1]).addClass('activbg')

			
			
    },
    setNavAction:function(){
        $("ul.menu li a").mouseover(function(){
            $(this).parent().find("ul.sub_menu").show()
            $(this).find("div.menu_name").addClass('menu_active')
            //$(this).parent().prev().addClass('menu_active')
            $(this).parent().hover(function() {  
                }, function(){
                    $(this).find("div.menu_name").removeClass('menu_active')       	
                    //$(this).parent().prev().removeClass('menu_active')
                   $(this).parent().find("ul.sub_menu").hide(); //When the mouse hovers out of the subnav, move it back up  
                });  

        });

		/*
        $("ul.menu_noc li").mouseover(function(){
            $(this).parent().find("ul.sub_menu").show()
            $(this).parent().hover(function() {  
                }, function(){  
                    $(this).parent().find("ul.sub_menu").slideUp('fast'); //When the mouse hovers out of the subnav, move it back up  
                });  

        });
        */
    },
		
    licenceWin:function(){
			
        this.win=new nocwin('Licence update/re-activation','','licence');	

        this.win.zindex();
			

        d=this.win.data;

        $(d).html('<fieldset style="margin-top:10px;"><legend></legend></fieldset>'+
            '<fieldset><legend>License key:</legend><input id="lic_updt" style="width:420px;" class="size_large3"></fieldset>'+
				  
				  
				  
            '<fieldset style="position:absolute;bottom:10px;right:10px;"><legend></legend>'+
            //'<div style="float:left;margin-right:20px;"><a class="abutton el_disc" href="#"><div class="inner">disconnect</div></a></div>'+	
            '<div style="float:left;margin-right:20px;"><a class="abutton el_cancel" href="#"><div class="inner">Cancel</div></a></div>'+
            '<div style="float:left;margin-right:10px;"><a class="abutton el_set" href="#"><div class="inner">Update</div></a></div></fieldset>'
            );

        //close win
        $(this.win.div).find('div.win_close').click(function(){
            NOC.win.remove();
        //WIN.show('#win_ip') //set zindex back to 400
        });
        //save 
        $(this.win.div).find('a.el_set').click(function(){
            //IP.vlanset(this)
            val=$('#lic_updt').val()
            if(val.length>10){
                $.postJSON('licensestate/new_key',{
                    'data':val
                }, function(data) {
				
		LIC.serverdata(data)
                    
                });
            }
        });

        //cancel
        $(this.win.div).find('a.el_cancel').click(function(){
            NOC.win.remove();
        //WIN.show('#win_ip') //set zindex back to 400
        });	

			
			
			
    },
      hintset:function(div){
        a='';
        if(div!=null) a='#'+div+' ';
				
			
        $(a+'div.hint').hover(function(){
				
            html=$(this).attr('hint');
				
            $('#tooltip').html('');
            //html='Search ability is currently under development!'
					
					
				
						
            $('#tooltip').html(html);
						
            $('#tooltip').show();
				
        },function(){
					
            $('#tooltip').hide();	
					
        }).mousedown(function(){
						
						
						
            }).mousemove(function(){
            $('#tooltip').css('left',mouseX+10)
            $('#tooltip').css('top',mouseY+10)
						
						
						
        });
    },
   hintset_static:function(div){
        a='';
        if(div!=null) a='#'+div+' ';
				
			
        $(a+'div.hint2').hover(function(){
				
            html=$(this).attr('hint2');
	$('<div></div>').attr('id','tooltip_static').html('<div>'+html+'</div>').appendTo($(this))
        
            //$('#tooltip').html('');
            //html='Search ability is currently under development!'
					
					
				
		
				
        },function(){
					
            $('#tooltip_static').remove();	
					
        }).mousedown(function(){
						
						
						
            }).mousemove(function(){
            //$('#tooltip').css('left',mouseX+10)
            //$('#tooltip').css('top',mouseY+10)
						
						
						
        });	
    },
		
    settingsWindow:function(){
        
        $('#win_settings div.set_back').click(function(){
				
            atr=$(this).attr('atr')
            $('#win_settings div.set_back').removeClass('activbg');
				
				
            for(var i=1;i<=8;i++)
            {
                $('#content').removeClass('back'+i);
                $('#cables').removeClass('back'+i);
            }
				
            $('#content').addClass('back'+atr);
            $('#cables').addClass('back'+atr);
				
            $(this).addClass('activbg');
				
            $.postJSON('settings/set',{
                'el':'background',
                'val':atr
            }, function(json) {
					
					
                });	
		
	
        });
        
        $('#win_settings select').change(function(){
            
            var val=$(this).val()
            
            $.postJSON('settings/set',{
                'el':'room_height',
                'val':val
            }, function(json) {
                RACK.init();
            });
        });
        
    },
		
    init:function(){
			
        $(window).bind('beforeunload',function(){

            //save info somewhere
            NOC.reloading=true

        });
			
			
			
        this.reloading=false
			
        this.updateSettings($.parseJSON(settings))
			
        this.settingsWindow()

			
			
			
			
    },
			

    upgrade:function(){
			
        $.postJSON('auth/upgrade','', function(data) {
				
            if(data.status){
				
                $('#upgrade').html('<div style="color:green;">Upgraded successively!</div>');
				
                $('#about_ver').text(data.ver);
                $('#about_dat').text(data.dat);
				
            }
							

        });
			
    },

    update:function(url,d,type){
			
        $.postJSON(url,d, function(data) {
				
            switch(type){
                case 1:
				
                    if(RACK.rid==DEVICE.rid){
                        ////console.log('ok')	
                        $('#dev_data_rack').text(d.name)
                        $('#win_dev_4').val(d.name)
                    }
					
                    break;
               case 2:
                   
                   RACK.init()
                   break;
            }
				
				
				

        });

			
    },
    tooltipset:function(){
			

			
    }		
				
}

var ERRORS={
    network:function(text){
			
        //we dont whant error window popup when reloading page
        if(!NOC.reloading){
				
            ERRORS.set=true
            this.win=new nocwin('Error on page','','error');	

            this.win.zindex()
			
            d=this.win.data
            pre=''
            $(d).html('<div class="error"><div class="bug"></div>'+
                '<div class="title">Network Error!</div>'+		
                '<br><div class="data">'+
                "We're sorry, an internal error occurred that prevents the "+ 
                "request to complete. <br><br>"+
				
                "<strong>Please reload Noclayer.</strong><br><br>"+
                '<fieldset style="position:absolute;width:160px;height:30px;bottom:5px;right:20px;"><legend></legend>'+
                //'<div style="float:left;margin-left:25px;"><a href="#"  class="abutton el_close"><div tmp="0" class="inner">reload page</div></a></div>'+
                '<div style="float:left;margin-left:25px;"><a href="#"  class="abutton el_ad"><div tmp="0" class="inner">reload page</div></a></div></fieldset>'
                )	
				
        }
			
			
    },
				
    window:function(text,type){
			
        ERRORS.type=type
        ERRORS.set=true
			
        this.win=new nocwin('Error on page','','error');	

        this.win.zindex()
        $('#win_mask2').show()
			
        $('#win_mask3').css({
            'background':'url(../assets/img/bg3.png)',
            'opacity':'0.90'
        })
        $('#win_mask3').show()

        d=this.win.data
        pre=''
        $(d).html('<div class="error"><div class="bug"></div>'+
            '<div class="title">Error occurred!</div>'+		
            '<div class="data">'+
            "We're sorry, an internal error occurred that prevents the "+ 
            "request to complete. "+
            "We profusely apologize for the inconvenience and for any damage"+ 
            " this may cause.<br><br>"+

            "<strong>Please tell Noclayer team about this problem.</strong><br><br>"+

            "We have created error report that you can send to help us improve<br>"+ 
            "Noclayer. We will treat this report as confidential and anonymous</div></div>"+
            '<div id="err_wait" style="display:none;width:100%;height:25px;position:absolute;bottom:10px;left:0px;"></div>'+

            '<fieldset style="position:absolute;width:300px;height:30px;bottom:5px;right:0px;"><legend></legend>'+
            //'<div style="float:left;margin-left:25px;"><a href="#"  class="abutton el_close"><div tmp="0" class="inner">reload page</div></a></div>'+

            '<div id="err_button" style="float:right;margin-right:25px;"><a href="#"  class="abutton el_send"><div tmp="0" class="inner">send error report</div></a></div>'+
            '<div  style="float:right;margin-right:25px;"><a href="#"  class="abutton el_show"><div tmp="0" class="inner">show report</div></a></div>'+
            '</fieldset>'
            ).attr('id','error_report')	

        var json_jqXHR='-----------------------------------------------------------------\nDescription:\n-----------------------------------------------------------------\n'


			
        json_jqXHR+=JSON.stringify(ERRORS.jqXHR, null, 2)+'\n-----------------------------------------------------------------\n\ntell us more here...'+
        '\n-----------------------------------------------------------------\n\nMail(optional):\n'
			
			
        $('<div id="reportshow" style="display:none;width:478px;position:absolute;top:50px;left:20px;">'+
            '<form method="POST" action="http://bugs.noclayer.com/noc/report.php" target="errdata" name="errform" id="errform">'+
            '<input style="width:100%;" type="hidden"  name="type" value="'+ERRORS.type+'">'+
            '<input style="width:100%;" type="hidden" id="bugsend"  name="bug" value="0">'+
            '<input type="input" name="exc" value="'+encodeURIComponent(ERRORS.exception)+'"><br>'+
            '<textarea  id="errdatasend" style="  resize: none; margin-top:3px;width:100%;height:195px;" name="err">'+json_jqXHR+'</textarea>'+
            '</form></div>').appendTo($("#error_report"))

        //close win
        $(this.win.div).find('div.win_close').click(function(){
            //WIKI.win.remove()
            //WIN.show('#win_wiki') //set zindex back to 400
            });

        //show
        $(this.win.div).find('a.el_show').click(function(){
				
            ERRORS.showreport(this)

        });	
			
        //cancel
        $(this.win.div).find('a.el_send').click(function(){
			
            ERRORS.report()
        //WIKI.win.remove()
        //WIN.show('#win_wiki') //set zindex back to 400
        });	
			
    },
    inside:function(m,a,l){
			
        ERRORS.jqXHR='script:'+a.replace(mainpath,'')+' at line:'+l
        ERRORS.exception=m
			
        if(!ERRORS.set)
            ERRORS.window(m,1)
       // console.info(m,a,l)
			
			
			
    },
parseNotes:function(s){
    
    notes=s['notes'];
    
    
    if(notes!=null){
        m=''
        $.each(notes,function(i,e){
         
           
           m+='<div style="color:green;font-size:11px;text-align:left;margin-right:10px;line-height:16px;">'+e.date+'</div>'
           m+='<div style="color:#333;font-weight:bold;">'+e.text+'</div>'
        });
        return m;
    }else{
    return '-';}
    
},
    showreport:function(d){
        div=$(d).find('div.inner')
			
        if(this.errsh){
            this.errsh=false
            $('#reportshow').hide();
            $(div).html('show report')
        }else{
            this.errsh=true
            $(div).html('hide report')
            $('#reportshow').show();
        }
    },

//data from bugs
reportData:function(a){
    
    m=$.parseJSON(a.data)
    
    ins=m.data[0]
    status='New';
    switch(parseInt(ins['main'])){
        case 10:
        status='New';
        break;
        case 20:
        status='Feedback';
        break;
        case 30:
        status='Acknowledged';
        break;
        case 40:
        status='Confirmed';
        break;
        case 50:
        status='Assigned';            
        break;
        case 80:
        status='Resolved';            
        break;
        case 90:
        status='Closed';            
        break;
    }
    
    $('#error_report div.data').html('<div style="margin-top:-50px;font-size:14px;">'
            +'Bug ID: <br><span style="color:#1e90ff;">00'+ins['id']+'</span><br>'
            +'Status: <br><span style="color:#1e90ff;">'+status+'</span><br>'
            +'Date first seen: <br><span style="color:#1e90ff;">'+ins['date']+'</span><br>'
            +'Note: <br><div style="width:100%;height:100px;overflow-x:hidden;overflow-y:auto;"><span>'+this.parseNotes(ins)+'</span></div><br>'

            +'</div>')
    
   // console.log(ins)
    
},


    report:function(){
			
			
        count=0;
        ERRORS.interval=setInterval(function(){
            count+=4;
            if(count>60) count=0;
            $('#err_wait').css({
                'background-position':count+'px 0px'
                });	
		    		
		    		
        },50)
        $('#err_wait').show();	
        $('#err_wait').addClass('upload_track')
		    	
		    
        if($('#errdata').length>0){
            $('#errdata').remove()
				
        }
			
        iframe=$("<iframe/>").attr('id','errdata').attr('name','errdata').css({
            'position':'absolute',
            'z-index':'1000',
            'left':'-1000px',
            'width':'10px',
            'height':'100px'
        }).appendTo($("#windows"));
			

			
			
			
        //stream='&type='+ERRORS.type+'&err='+encodeURIComponent(json_jqXHR)+'&exc='+encodeURIComponent(ERRORS.exception)
			
        //+stream
			
			
        text=$('#errdatasend').val()
	
        ver=$.parseJSON(licdata)
        report={
           "type":ERRORS.type, //type of error
           //"text":text, //
           "url":NOC.path,
           "num": $('#about_ver').html(),
           "ver":ver.license.version,
           "channel":$('#about_ch').html(),
           "error":ERRORS.jqXHR,  
           "text":'FROM:'+mainpath+' \n'+text,  
           "exception":ERRORS.exception
            //  "url":this.path
            
        }

        var myJSONText = JSON.stringify(report)


        $('#bugsend').val(Base64.encode(myJSONText))
        
        et=Base64.encode(text)
			
        text=$('#errdatasend').val(et)
				
        
			
        $('#err_button').parent().hide()
			
        ERRORS.sent=false
        $(iframe).attr('src',"http://bugs.noclayer.com/noc/report.php")
			
        //$('#errform').submit();
			
        $(iframe).load(function(){

            if(ERRORS.sent){
		
               //iframeHtml= $(iframe).contents().find("html").html();
                
         //console.log(iframeHtml)       
                
                $('#error_report').html('<div class="error"><div class="bug"></div>'+
                    '<div class="title">Error report sent, Thank you!</div>'+		
                    '<br><br><div class="data">'
                    ); 	
				
            }
				
            if(!ERRORS.sent){
					
                ERRORS.sent=true
					
					 
                $('#errform').submit();
            }
				
				
				
        /*
				
			*/
        }
        )
			
    },
    dialog:function(jqXHR, exception){
			
			
        ERRORS.jqXHR=jqXHR
        ERRORS.exception=exception
			
			
        if(!ERRORS.set){
			
            if (jqXHR.status === 0) {
                ERRORS.network('Time out error.')
            //alert('Not connect.\n Verify Network.');
            } else if (jqXHR.status == 404) {
                if(!NOC.reloading)
                    ERRORS.network('Requested page not found. [404]')
            //alert('Requested page not found. [404]');
            } else if (jqXHR.status == 500) {
                ERRORS.window('Internal Server Error [500].',0)
            //alert('Internal Server Error [500].');
            } else if (exception === 'parsererror') {
		    	   
		    	   
                if(jqXHR.responseText.length>10){
		    		   
                    ERRORS.type=0;
                    ERRORS.window('Requested JSON parse failed.',0)   
                }
            //alert('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
                ERRORS.window('timeout',0)
            //alert('Time out error.');
            } else if (exception === 'abort') {
                ERRORS.window('Time out error.',0)
            //alert('Ajax request aborted.');
            } else {
                ERRORS.window('Uncaught Error:' + jqXHR.responseText,0)
            //alert('Uncaught Error.\n' + jqXHR.responseText);
            }
			
        }
			
    }		
				
}

var LIC={
    
    serverdata:function(data){
        ////console.log(data)
        
        
        if(data.reloaded){
        for(i=0;i<=6;i++){
         $('#license_data_num_'+i).html('-')
        }
        $('#license_status').html('-').css('color','#ccc')
        
        location.reload()
        
        }else{
            alert("Wrong key! Please check all data and try again!")
            
        }
    },
    
    init:function(){
        
        this.data=$.parseJSON(licdata)
      
      //check if is valid
      
      $('button.licence_act_r').click(function(){
          
        $.postJSON('licensestate/force_reload','', function(json) {
					
	LIC.serverdata(json)
                });	
       
      });
      
      	$('button.licence_act_s').click(function(){
		
		NOC.licenceWin();
	
	});		
		
      
      if(this.data.state=='ok'){
       $('#license_data_num_1').html(this.data.license.key)    
      
       //$('#reactivate_lic').hide();
       
       if(this.data.purchuse_reminder){
        this.head_data('Your license will expire soon!','warn');   
       }
       
       if(!this.data.server_avaiable && this.data.remind_period){
        this.head_data('License server connection problem!','info');   
        //$('#reactivate_lic').hide();
        
        //$('#update_data_lic').hide();    
   }
       
       
        
       
       
       
          return true;
      }else{
       $('#reactivate_lic').show();   
       WIN.show('#win_license')   
      }
      
      
      
     
        
        
        
        
        
    },
    head_data:function(name,cl){
        $('#license_track'+cl).remove()
    $('#wraper').append($('<div></div>').attr('id','license_track'+cl).addClass('update lic_'+cl).html(
    '<div class="title">'+name+'!</div>'+
    '<div style="top:0px;right:20px;position:absolute">'+
    '<div style="float:right;" class="button"><a href="#" class="abutton license_warn_hide"><div class="inner">hide</div></a></div>'+

'</div>'    
    ));
	

        
$('#license_track'+cl+' a.license_warn_hide').click(function(){
		//$(this).find('div.icons').addClass()
		    
                    $(this).parent().parent().parent().slideUp('fast');
                    
                 
           
    });
    
    } 
}

var Hook = {
hooks: [],
 
register: function ( name, callback ) {
if( 'undefined' == typeof( Hook.hooks[name] ) )
Hook.hooks[name] = []
Hook.hooks[name].push( callback )
},
 
call: function ( name, arguments ) {


if( 'undefined' != typeof( Hook.hooks[name] ) )
for( i = 0; i < Hook.hooks[name].length; ++i )

if( true != Hook.hooks[name][i]( arguments ) ) { break; }
}
}


window.addEventListener('message', receiveMessage, false);

function receiveMessage(evt)
{
  if (evt.origin === 'http://bugs.noclayer.com')
  {
  //zanimljivos
        ERRORS.reportData(evt)
  }
}