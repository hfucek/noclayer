var TEMPLATE={
		init:function(){
			
			if(!this.set){
				this.set=true	
				
				//GUI elements 
				this.elements=Array(
					Array('Input box','input'),
					Array('Text box','textarea'),
					Array('Check box','checkbox'),
					Array('HDD/RAID element','hdd'),
					Array('RAM element','ram')
					//Array('Image element','img'),
					//Array('Export2PDF element','print')
					//Array('IP/MAC element','network')	
				)
				
				//total of 6 tabs	
				this.tabsize=6
				//name of default window layer
				this.layer='win_device_template_layer'
				//category select element
				this.cat=$('#'+this.layer+'1 select.cat')
				//template type selet element
				this.temp=$('#'+this.layer+'1 select.temp')
				
				
				
				for(i=2;i<=TEMPLATE.tabsize;i++){
					$('#'+TEMPLATE.layer+''+i).html(
							'<div class="info">'+
							'No template selected'+
							'<br>'+
							'<span>Please goto General tab and select/create template!</span>'+
							'</div>')	
				}
				
					
				//category element change action
					$(this.cat).change(function(){
						//empty all tabs, except first
						for(i=2;i<=TEMPLATE.tabsize;i++){
							$('#'+TEMPLATE.layer+''+i).html('')	
						}
						//load default data
						TEMPLATE.preset()
						
					});	
				
				//action on dropbox
				
				$('#win_device_template div.edit_action li').click(function(){
					switch(Number($(this).attr('m'))){
						
						case 1:
						//rename
						if(TEMPLATE.temp.val()>0){	
							
						TEMPLATE.rename()
						}
						break;
						
						case 2:
						//duplicate	
						if(TEMPLATE.temp.val()>0){	
						TEMPLATE.duplicate()
						}
						break;
						
						case 3:
						//export	
							id=TEMPLATE.temp.find('option:selected').val()
							if(id>0){
							
							name=TEMPLATE.temp.find('option:selected').text()
							
							window.open('basic/templates/export/devices/'+id+'/'+name+'.zip');
							}
							break;
						
						case 4:	
						//delete	
							
							TEMPLATE.remove(this)	
						break;
						
					}	
					
				});
				
				
				$('#win_device_template').find('a.import div.inner').each(function(i,e){im=new zipupload(e)});
				
				//type element change action 
				     this.temp.change(function(){
				    	 for(i=2;i<=TEMPLATE.tabsize;i++){
								$('#'+TEMPLATE.layer+''+i).html('')	
							}
				    	 //remove empty type element
				    	 $(this).find('option[value=0]').remove();

				   //load selected type tab data 	 
					TEMPLATE.load($(this).val())	
						
						
					});
					
				    //make new template button action 
					make=$('#'+TEMPLATE.layer+'1').find('a.make')
					
					make.click(function(){
						TEMPLATE.makeNew(this)
						
					})

					
					//remove template button action
					rem=$('#'+TEMPLATE.layer+'1').find('button.rem')
					
					rem.click(function(){
						TEMPLATE.remove(this)
						
					})
					
				
				this.preset();				
			
			}
			
			
			
		},
		e_remove:function(){
			v=this.temp.val()
			$(this.temp).find('option:selected').remove()
			
			for(i=2;i<=this.tabsize;i++) $('#'+TEMPLATE.layer+''+i).html('');	
				
			TEMPLATE.loading(true)
			$.postJSON('basic/templates/remove',{'tid':v}, function(json) {
				//console.log(json)
				
				if(DEVICE.catOb){
				if(TEMPLATE.cat.val()==DEVICE.catOb.val()){
					DEVICE.loadSel(json)
				}}
			
				val=$(TEMPLATE.temp).find('option:first').val()
				if(Number(val)>0)
				{
				TEMPLATE.load(val)
				}
				TEMPLATE.loading(false)
				
			});
			
		
		
		},
		remove:function(d){
			v=this.temp.val()
			if(v!=0){
				WIN.prompt('Delete template','All data will be erased, proceed with deleting?',2)
				
			}
			
			
			
		},
		rename:function(){
			
			this.win=new nocwin('Rename template','','rename_template');	

				this.win.zindex()
				

			d=this.win.data
			pre=this.temp.find('option:selected').text()
			$(d).html('<fieldset style="margin-top:10px;"><legend></legend></fieldset>'+
					  '<fieldset><legend>Template name:</legend><input value="'+pre+'" class="size_large2"></fieldset>'+		
					'<fieldset style="position:absolute;bottom:10px;right:10px;"><legend></legend>'+
						'<div style="float:right;margin-right:10px;"><a class="abutton save" href="#"><div class="inner">save</div></a></div>'+
						'<div style="float:right;margin-right:20px;"><a class="abutton cancel" href="#"><div class="inner">cancel</div></a></div></fieldset>'
			)	

			//close win
			$(this.win.div).find('div.win_close').click(function(){
				TEMPLATE.win.remove()
				WIN.show('#win_device_template') //set zindex back to 400
			});
			//add element
			$(this.win.div).find('a.save').click(function(){
				
				val=$(this).parent().parent().parent().find('input').val()
				tid=TEMPLATE.temp.val()
				
				if(val.length>0){
					$.postJSON('basic/templates/dataset/rename',{'tid':tid,'val':val}, function(json) {
						
						TEMPLATE.temp.find('option:selected').text(json.name)
						TEMPLATE.upName()
					TEMPLATE.win.remove()
					WIN.show('#win_device_template') //set zindex back to 400
						TEMPLATE.loading(false)
					});
					
				
				}
				
			});

			//cancel
			$(this.win.div).find('a.cancel').click(function(){
				TEMPLATE.win.remove()
				WIN.show('#win_device_template') //set zindex back to 400
			});	


				
			
			
			
		},
		
			duplicate:function(){
			
			this.win=new nocwin('Duplicate template','','dupl_template');	

			this.win.zindex()
				

			d=this.win.data
			pre=this.temp.find('option:selected').text()
			pre2=this.temp.find('option:selected').text()+'_copy'
			$(d).html('<div class="hidemask"></div><fieldset style="margin-top:10px;"><legend></legend></fieldset>'+
					  '<fieldset><legend>Template from:</legend><input value="'+pre+'" class="size_large2 old"></fieldset>'+
					  '<fieldset><legend>New Template name:</legend><input value="'+pre2+'" class="size_large2 new"></fieldset>'+
					'<fieldset style="position:absolute;bottom:10px;right:10px;"><legend></legend>'+
						'<div style="float:right;margin-right:10px;"><a class="abutton save" href="#"><div class="inner">duplicate</div></a></div>'+
						'<div style="float:right;margin-right:20px;"><a class="abutton cancel" href="#"><div class="inner">cancel</div></a></div></fieldset>'
			)	

			this.win.mask=$(d).find('div.hidemask')
			
			
			//close win
			$(this.win.div).find('div.win_close').click(function(){
				TEMPLATE.win.remove()
				WIN.show('#win_device_template') //set zindex back to 400
			});
			//add element
			$(this.win.div).find('a.save').click(function(){
			
				TEMPLATE.win.mask.show();
				
				$(TEMPLATE.win.icon).removeClass('win_icon')
				$(TEMPLATE.win.icon).addClass('imageLoader')
				
				val=$(this).parent().parent().parent().find('input.old').val()
				val2=$(this).parent().parent().parent().find('input.new').val()
				console.log(val,val2)
				tid=TEMPLATE.temp.val()
				
				
				
				
				if(val2.length>0){
					$.postJSON('basic/templates/dataset/duplicate',{'tid':tid,'val':val2}, function(json) {
					
						TEMPLATE.loading(false)
						if(json.status=='ok'){
		        		
		        		m=new Object();
		        		m.data=json.data.templates
		        		m.nid=json.data.device
		        			
		        		TEMPLATE.loadSel(m)	
		        		
		        		TEMPLATE.win.remove()
		        		WIN.show('#win_device_template') //set zindex back to 400
		        			
						}
						else{
							
							TEMPLATE.win.mask.hide();
							
							$(TEMPLATE.win.icon).addClass('win_icon')
							$(TEMPLATE.win.icon).removeClass('imageLoader')
							
							alert(json.status)
							
							
						}
						
					/*	
					TEMPLATE.temp.find('option:selected').text(json.name)	
					TEMPLATE.win.remove()
					WIN.show('#win_device_template') //set zindex back to 400
					*/
					});
					
				
				}
				
				
			});

			//cancel
			$(this.win.div).find('a.cancel').click(function(){
				TEMPLATE.win.remove()
				WIN.show('#win_device_template') //set zindex back to 400
			});	


				
			
			
			
		},
		
		
		makefield:function(d){
            
            
                console.log("MAKE TEMPLATE",d)
            
		//empty tabs
		for(i=2;i<=this.tabsize;i++){
			$('#'+TEMPLATE.layer+''+i).html('')	
		}	
		
		
		
		
		$.each(d.items,function(i,data){
		//layer 
		n=Number(data.tab)+1
		lay=$('#'+TEMPLATE.layer+''+n)	
	
	    if(data.static!=1){		
		fs=$('<fieldset/>').attr({'eid':data.id,'tab':n}).appendTo(lay)
		leg=$('<legend/>').addClass('fieldmenu').appendTo(fs)
		leg.html('<a class="menu_a" href="#"><div class="name">'+data.name+'</div><ul class="field_submenu"><li m="1">rename</li><li m="2">delete</li></ul></a>')
		el=$('<div/>').addClass('element').appendTo(fs)
	
		
		
			
		TEMPLATE.action(fs)	
	    }
	    else{
	    
	    	fs=$('<fieldset/>').attr({'eid':data.id,'tab':n}).appendTo(lay)
	    	
	    	if(data.nolegend=='ok'){
	    		
	    		//power suplly
				if(data.special=='powerfield'){
					
					POWER.json=data
					f= POWER.makeField(data,fs);
					
					}
					
				
				//power consumer
				if(data.special=='inpowerfield'){
					
					POWER.json=data
					f=POWER.onlyInputfield(data,fs);
					
					}
	    	
				//kvm suplly
				if(data.special=='kvmfield'){
					
					KVM.json=data
					f= KVM.makeField(data,fs);
					
					}
					
				
				//kvm consumer
				if(data.special=='inkvmfield'){
					
					KVM.json=data
					f=KVM.onlyInputField(data,fs);
					
					}
				
				
	    		
	    	}else{
	    	
	    	leg=$('<legend/>').addClass('fieldmenu').text(data.name).appendTo(fs)
	    	el=$('<div/>').addClass('element').attr('temp','ok').appendTo(fs)
	    
	    	switch(data.element){
	    	case 'none':
                        
	    		// IP ELEMENT
	    		if(data.special=='ipfield'){
					
					
					f= IP.makeIPField(data,el);
					
				}
	    		//ROUTER SWITCH element
				if(data.special=='macfield'){
					
					f= IP.makeMACField(data,el);
					
				}
				
                        //PATCH PANEL
				if(data.special=='panelfield'){

                                    PANEL.makePANELField(data,el);

                                }
				
				
				
	    		
	    		
	    		break;
	    	default:
	    		//$('<'+data.element+'/>').attr('autocomplete','off').appendTo(el)	
	    		break;
	    	
	    	}
	    	
	    			
	    		
	    	
	    	
	    }
		

		
		
	    }
		
		if(data.nolegend!='ok'){
		WIN.switchType(data,el)
		}
		TEMPLATE.editaction(fs)
		
	    
		
		});	
			
		//add  "adding elements"
		
		
		for(i=2;i<=this.tabsize;i++){
			t=$('#'+TEMPLATE.layer+''+i)
			
		
			
			
			
			
	
		fs=$('<fieldset/>').addClass('newfieldadd').attr('tab',i-1).appendTo(t)
			
			leg=$('<legend/>').addClass('fieldmenu').html('<span class="anew">Add new element</span>').appendTo(fs)
			
		
		
			$('<div/>').addClass('add_element').html('<div class="icons"></div>').appendTo(fs).click(function(){
				
			TEMPLATE.add_new_element(this);	
				
			})
		
			//TEMPLATE.addField(this)
				
			
			
			
		}	
		},
		valid_element:function(el){
			
			if(el[1]=='network'){
				
				cv=Number($(TEMPLATE.cat).val())
				//console.log('CV',cv)
				switch(cv){
				case 1:case 2:case 3:case 8:return true; break;
				default:return false; break;
				}}
			
			return true
			
		},
		
		add_new_element:function(w){
			
			this.container=w
			
			
			this.win=new nocwin('Add new element','','addelement');	
		
		
		d=this.win.data
		
		$(d).html('<fieldset style="margin-top:10px;"><legend>Element name:</legend><input class="size_large2"></fieldset>'+
				  '<fieldset><legend>Type of element:</legend><select class="size_large2"></select></fieldset>'+		
				'<fieldset style="position:absolute;bottom:10px;right:10px;"><legend></legend>'+
				'<div style="float:right;margin-right:10px;"><a class="abutton save" href="#"><div class="inner">add</div></a></div>'+
				'<div style="float:right;margin-right:20px;"><a class="abutton close" href="#"><div class="inner">cancel</div></a></div></fieldset>'
		)
		
		o=''
		
		$.each(this.elements, function(i,e){
			
			if(TEMPLATE.valid_element(e))	
			o+='<option value="'+i+'">'+e[0]+'</option>';	
		})
		$(d).find('select').html(o)
		
		
		//close win
		$(this.win.div).find('div.win_close').click(function(){
			TEMPLATE.win.remove()
		});
        //add element
		$(this.win.div).find('a.save').click(function(){
			TEMPLATE.addField()
		});
        
		//cancel
		$(this.win.div).find('a.close').click(function(){
			TEMPLATE.win.remove()
		});
        
		
			
		},
		

		makeAddField:function(type,name){
			
		fs=$('<fieldset/>')
		leg=$('<legend/>').addClass('fieldmenu').appendTo(fs)
		leg.html('<a class="menu_a" href="#"><div class="name"></div><ul class="field_submenu"><li m="1">rename</li><li m="2">delete</li></ul></a>')
		$(leg).find('div.name').text(name)
		
		el=$('<div/>').addClass('element').appendTo(fs)
		
		m=new Object();	
		m.element=type
		m.value=0
		m.noact=true
		//console.log(type,name)
		WIN.switchType(m,el)
		
			
		
			
		
		return fs
			
			
			
		},
		
		rename_field:function(d){
			p=$(d).parent().parent().parent().parent()
			this.old_name=$(p).find('div.name').text()
			$(p).find('a').hide()
			leg=$(p).find('legend')
			
			$('<input/>').addClass('smallsize').val(this.old_name).appendTo(leg)
			
			
			
			
			$(p).find('input.smallsize').bind('blur keydown',function(e){
				
				ent=false;
				if(e.type=='keydown'){
					if(e.keyCode==13){
						ent=true
					}
					
				}
				
				
				if(e.type=='blur' || ent){
					new_name=$(this).val()
					
					fid=$(this).parent().parent().attr('eid')
					
					
				
				
						$(this).parent().find('a').show()
						
					
				if(new_name.length<1){
					
					$(this).parent().find('div.name').text(TEMPLATE.old_name)
				
					
					
				}else{	
			
					$(this).parent().find('div.name').text($(this).val())
				
				
				
		if(TEMPLATE.old_name!=new_name){

			$.postJSON('basic/templates/element/rename',{'fid':fid,'name':new_name}, function(json) {
				//console.log(json)
				
				
			});
			
					
		}}
					$(this).parent().find('input.smallsize').remove()
				
				
				}	
				
			}).focus()
			
			
			
			
			
		},
		delete_field:function(d){
			p=$(d).parent().parent().parent().parent()
			fid=$(p).attr('eid')
			$(p).remove()
			
			$.postJSON('basic/templates/element/remove',{'fid':fid}, function(json) {
				
				
			});	
			
		},
		
		editaction:function(div){

			
			$(div).find('select.eselect').change(function(){
				
				eid=$(this).parent().parent().attr('eid')
				
				
				TEMPLATE.loading(true)
				
				$.postJSON('basic/templates/dataset/value',{'val':$(this).val(),'eid':eid}, function(json) {
				
					TEMPLATE.loading(false)	
					
				});	
				
				
			});			
			
$(div).find('input, textarea').bind('keydown focus blur',function(e){
				
	
	if(this==WIN.el_focused){
		WIN.el_focused=false;
	}
	
	
	
	tag=e.currentTarget.tagName
	eid=$(this).parent().parent().attr('eid')
	
	ent=false;
	if(e.type=='keydown'){
	
		if(e.keyCode==13){
			ent=true
		$(this).blur()
		}
		
	}
	
	if(e.type=='focus'){
		TEMPLATE.tmpval=$(this).val()
		$(this).addClass('focused')
	}
	
	
	if(e.type=='blur'){
		$(this).removeClass('focused')
	
	///if($(this).val().length>0){
		
		TEMPLATE.loading(true)
		
		$.postJSON('basic/templates/dataset/value',{'val':$(this).val(),'eid':eid}, function(json) {
		
			TEMPLATE.loading(false)	
			
		});	
		/*
	}else{
		$(this).val(TEMPLATE.tmpval)
		
	}
	*/	
	
	
	}				
	
	
				
				
				
			});

//other action for buttons, images, etc...



//image upload button action
$(div).find('a.imgupl div.inner').each(function(i,e){im=new imageupload(e,true);});

// hdd icon action
$(div).find('div.hdd_icon').each(function(i,el){$(el).click(function(){RAID.open(this,true)});});

// ram icon action
$(div).find('div.ram_icon').each(function(i,el){$(el).click(function(){RAM.open(this,true)});});

//export2PDF action
$(div).find('a.toPDF').each(function(i,el){$(el).click(function(){
	
//	DEVICE.print(this,true)
alert("Template printing is under development....")	
	
});});

//add note action
//$(w).find('button.addNote').each(function(i,el){$(el).click(function(){DEVICE.addNote(this)});});








			
			
		},
		
		action:function(div){
		
			
			
			$(div).find('li').click(function(){
				
			switch($(this).attr('m')){
			case '1':
				TEMPLATE.rename_field(this)
			break;
			case '2':
				TEMPLATE.delete_field(this)
			break;
			
			}	
				
				
				
			});
			
			
			
			
		},
		_checkbox:function(d){
			
			val=ELEMENT._checkbox(d)
			eid=$(d).parent().parent().attr('eid')
			
			
			$.postJSON('basic/templates/dataset/value',{'eid':eid,'val':val,'id':TEMPLATE.templateID}, function(json) {
				
				TEMPLATE.loading(false)
			});	
			
			
			
			
			
		},
		
		addField:function(){
		
			
			
			
		win=TEMPLATE.win.data	
		field=$(this.container).parent()
		tab=$(field).attr('tab')	
		
		name=$(win).find('input').val()
		v=$(win).find('select').val()
		if(name.length>0){
		
			
		nf=this.makeAddField(this.elements[v][1],name)
		
		TEMPLATE.loading(true)
		
		this.nf=nf
		this.tab=tab
		$.postJSON('basic/templates/element/new',{'tid':this.templateID,'tab':tab,'type':v,'name':name}, function(json) {
			
			$(TEMPLATE.nf).attr({'eid':json.id,'tab':TEMPLATE.tab})
			
			TEMPLATE.loading(false)
			
		});
		
		
		
		
		nf.insertBefore(field)
		this.action(nf)
		this.editaction(nf)
		this.win.remove()
		objDiv=$('#win_device_template div.win_data')
		objDiv[0].scrollTop = objDiv[0].scrollHeight;
		}else{
			$(win).find('input').focus()
			
		}
		
		

			
			
			
		},
		
		saveField:function(){
			
			
		},
		
		load:function(a){
			this.templateID=a
			$.postJSON(
					"basic/templates/data", 
					{'id':a},
					function(d){
						
						TEMPLATE.upName()
						
						
						TEMPLATE.makefield(d)
						
					});
			
			
			
		},
		
		loading:function(key){
			if(key)
			$('#win_device_template div.win_icon').addClass('deviceLoader').removeClass('default');
			else
			$('#win_device_template div.win_icon').removeClass('deviceLoader').addClass('default');
		},
		makeNew:function(a){
			
			inp=$(a).parent().parent().find('input')
			name=inp.val()
			inp.val('')
			this.loading(true)
			if(name.length>1){
			$.postJSON(
					"basic/templates/create",{'name':name,'cat':TEMPLATE.cat.val()}, 
					function (m) {
							sel=TEMPLATE.loadSel(m)
							
							//update device template list
							if(DEVICE.catOb){
							if(TEMPLATE.cat.val()==DEVICE.catOb.val()){
								DEVICE.loadSel(m)
							}}
							
									
							TEMPLATE.loading(false)
							
					
						
						
					});
			}
		},
		upName:function(){
			$('#win_device_template div.win_header_name span').text(':: '+TEMPLATE.cat.find('option:selected').text()+' : '+TEMPLATE.temp.find('option:selected').text())
			
		},
		loadSel:function(m){
			
			
			//dev_sel=$('#win_dev_1')
			//dev_sv=dev_sel.val()
			this.temp.html('')
			//for device window
			//dev_sel.html('<option value="0">Unknown</option>')
			selected=false
			$.each(m.data,function(i,d){
				o=$('<option/>').val(d.id).text(d.name).appendTo(TEMPLATE.temp)
				//os=$('<option/>').val(d.id).text(d.name).appendTo(dev_sel)
				
				if(m.nid==d.id){
					o.attr('selected','selected')
					TEMPLATE.load(d.id)
				selected=true
				}
				/*
				if(dev_sv==d.id){
					os.attr('selected','selected')
					
				}	
				*/
				
			});
			if(!selected){
				o=$('<option/>').val(0).text('..').appendTo(TEMPLATE.temp)
				o.attr('selected','selected')
			}
			
			TEMPLATE.upName()
			
			
			
		},
		
		preset:function(){
			
			
			if(!this.set) this.init()
			
			
			//load data from server
				$.postJSON(
						"basic/templates/window",{'cat':TEMPLATE.cat.val()}, 
						function (m) {
						
						
								
							
						TEMPLATE.loadSel(m)	
							
					
							
						
						});	
				
				
		}
		
		
}