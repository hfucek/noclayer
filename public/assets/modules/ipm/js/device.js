var IPM_device={
    
    init:function(td,ip,id){
        
        this.data=ip
        inp=$(td).find('input[m="2"]')
        
        IPM_device.onlyfree=true;
        //this.findAddrInput(td)
        
        v=(ip.length>0)?ip:'none';
        this.id=id
        
        but=$('<div  class="ipm_addr_selector"><div class="icon"></div><span>'+v+'</span></div>').attr('ipid',id)
        $(inp).replaceWith(but)
 
        $(but).bind('click',function(i,e){
            if(IP.tmpl){
                //template can't get ip address
                IPM_device.ontemplate()
            }else{
                IPM_device.wintype='device'
                IPM_device.but=this
                IPM_device.editIP(this)
            }
        });
        
    },
    vps:function(d,data){
        
        $('#vps_add_addr').html('<legend>IP addresss:</legend><div style="float: left;margin-left:0px;"><a id="vps_new_ip_add" class="abutton" href="#"><div class="ipm_addr_selector" class="inner ipedit" tmp="0"><div class="icon"></div><span>add</span></div></a></div><div id="vpsip"></div>')
        
        $('#vps_new_ip_add').bind('click',function(i,e){
            IPM_device.wintype='vps'
            IPM_device.but=this
            IPM_device.editVPS(this)
            
        });
    },
    
    ontemplate:function(){
        
        
         
           
        var pop=new POPUP.init(
            'Template IP address notification',   //popup title
            'editadd',    //popup name
            'win_ip',      //parent window
            {
                w:380,     //width 
                h:160,      //height
                wdclass:'orange2'
            })
                   
                   
        pop.data(
             
        {
                save:false,     //save button
                rem:false,     //remove button
                cancel:false,   //cancel 
                add:false      //add
                
            },
            "<div class='pop_warn'>Template can not have the assigned IP address</div>"
            
            );
            
        
            
        pop.onchange(
            
            function(e,d){
        
        
        
            
            }
            
            )
            
            
        pop.action(
            'win_ip',
            //add
            function(){
               
                pop.win.remove()
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
    isIpFromSubnet:function(ip,subnet){
        
        IPAM_object.init(subnet)
        
        return IPAM_object.isIpFromSubnet(ip)
        
    },
    getSubnet:function(){
        $.postJSON('ipm/device/subnet',{
            'id':DEVICE.id,
            'eid':NETWORK.eid
        }
        , function(data) {
            html= []
            if(data.data.length==0){
                $('#ip_add_win').html('<div class="pop_warn">Please goto IP management and add subnet location first!</div>')
                $('#ip_add_win').parent().find('a.el_save').hide()
                $('#ip_add_win').parent().find('a.el_cancel div.inner').html('Close')
            }else{
                //check if ipv4
         
                ipv4=IPM_device.getDottedIPv4()
        
         
                $.each(data.data,function(i,e){
                    sel=''
                    if(IPM_device.isIpFromSubnet(ipv4, e.subnet)){
                        sel='selected'
                        IPM_device.fieldDisable(e.subnet,false)
                    }
                 
             
                
             
             
                    html.push('<option '+sel+' value="'+e.id+'">'+e.subnet+'</option>')
         
                });
            
            
            
                $('#ipm_dev_np').html(html.join('')).bind('change',function(){
             
                    IPM_device.onSubnetChange(this)
                })
        
                IPM_device.subnetData=data.data
                IPM_device.getSubnetData()
                IPM_device.ipList()
            
                IPM_device.updateInputs()
            } 
        });
        
        
    },
    
    
    fieldDisable:function(subnet,mask){
        
        
        
        var ipv4=IPAM_object.init(subnet)
        
        a=subnet.split('/')
        b=a[0].split('.')
        sig=IPAM_object.significant()
       
          
       
        for(var i=0;i<=3;i++){
            if(sig[i]==0){
                $('#ipm_dev_fa'+i).prop('disabled',true).val(b[i])
               
            }else{
                if(mask)
                    $('#ipm_dev_fa'+i).prop('disabled',false).val('')
                else
                    $('#ipm_dev_fa'+i).prop('disabled',false)
            
            }
           
        }
       
       
        
    },
    getSubnetData:function(){
        v=$('#ipm_dev_np').val()
            
        out=false
        $.each(this.subnetData,function(i,e){
            
            if(Number(e.id)==Number(v)){
                out=e
            }
            
            
        })
        return out;
    },
   
    ipList:function(){
        
    
        subdata=this.getSubnetData()    
        
        
        
        IPAM_object.init(subdata.subnet)
        
        used=subdata.used
        
        hosts=IPAM_object.hosts()
        //remove first and last
        hosts.pop()
        hosts.shift()
        data=[]
        
        $.each(hosts,function(i,e){
            
            m=e.split('.')
            if($.inArray( e, used)!=-1)
            {
            
            
                data.push([m[0],m[1],m[2],m[3],true])
            }else{
                data.push([m[0],m[1],m[2],m[3],false])
            }
            
        })
        
     
        this.iplist=data
        
    },
    onSubnetChange:function(d){
        this.ipList()
         
        
        sub=$('#ipm_dev_np option:selected').html()
                    
        this.fieldDisable(sub,true)
    },
    
    updateInputs:function(){
         
         
                   
        if(this.ipv4!='none'){
            var ipv4=this.ipv4.split('.')
            ip1=ipv4[0]
            ip2=ipv4[1]
            ip3=ipv4[2]
            ip4=ipv4[3]
                      
                      
        }else{
            ip1=ip2=ip3=ip4=0
                    
            sub=$('#ipm_dev_np option:selected').html()
                    
            this.fieldDisable(sub,true)
        }
                   
        
    },
    
    makeDrop:function(inp,data){
       
        
        l=data.length
        dr=$('<div/>').attr('id','ipm_drop').css('width',l*62+'px')
        usage=[]
        xx=0
        for(i=0;i<l;i++){
            
            x=60*i;
            ul=$('<ul></ul>').addClass('input_ip_ul').appendTo($(dr)).css('left',x+'px').attr('x',i)
            max=0;
            yy=0
            
            
            $.each(data[i],function(s,e){
                
                if(yy<=9){
                    if(IPM_device.onlyfree){
               
                        if(!e.u){
              
               
                            ul.append($('<li >'+e.n+'</li>').attr('y',yy))
                            yy++;    
                        
                        }    
                    }else{
                        z=(e.u)?'class="used"':'';
               
                        ul.append($('<li '+z+'>'+e.n+'</li>').attr('y',yy))
                        yy++
                    }
                }
            })
            usage[i]=yy //count 
        }
        IPM_device.keys=[0,0]
      
        if(usage[0]==0){
            IPM_device.keys=[1,0]
    
            if(usage[1]==0){
                IPM_device.keys=[2,0]
            }    
        }
        
        // console.log(IPM_device.keys)
        
      
        $(dr).insertBefore($(inp))
     
        $(dr).find('li').bind('mousedown',function(e){
            t=$(this).text()
        
            $(inp).val(t)
            $('#ipm_drop').remove()
        })
        
        $(dr).find('li').bind('mousemove',function(e){
            
            IPM_device.mouseover(this)
            
        })
        
        
        
        ul=$('#ipm_drop ul')[0]
        li=$(ul).find('li')[0]
        $(li).addClass('ac')  
     
    },
    isValidIp:function(e,n){
        valid=true;
        for(var i=0;i<n;i++){
            v=Number($('#ipm_dev_fa'+i).val())
            if(v!=e[i]) valid =false
        
        }
        return valid;
    },
    
    trimArray:function(n){
        m=[]
        $.each(this.iplist,function(i,e){
           
            if(IPM_device.isValidIp(e, n)){
              
                var result = $.grep(m, function(a){
                    return a.n == e[n];
                });
                if(result.length==0)     
                    m.push({
                        n:e[n],
                        u:e[4]
                    })
            }
            
        })
     
     
     
        return m
        
        
        
    },
    mouseover:function(li){
        $('#ipm_drop li').removeClass('ac')
    
        x=Number($(li).parent().attr('x'))
        y=Number($(li).attr('y'))
    
        ul=$('#ipm_drop ul')[x]
        li=$(ul).find('li')[y]
        $(li).addClass('ac')  
   
        IPM_device.keys=[x,y] //[x,y]
    
    
        
    },
    makeDropData:function(n,v){
        data=this.trimArray(n)

      
      
        m=v.length
      
     
      
        n1=[]
        n10=[]
        n100=[]
      
        var x=1;
      
     
        $.each(data,function(i,e){
           
           
            var n=e.n.substr(0,m) 
            if(n==v){
                 
                if(e.n.length>=3){
                    if(n100.length<=255){
                        var result = $.grep(n100, function(a){
                            return a.n == e.n;
                        });
                              
                        if(result.length==0)
                            n100.push(e)
                    }
               
                }else{
         
                    if(e.n.length>=2){
                        if(n10.length<=99){
                       
                            var result = $.grep(n10, function(a){
                                return a.n == e.n;
                            });
                              
                            if(result.length==0)
                                n10.push(e)
                        
                        }
               
                    }else{
               
                        if(e.n.length>=1){
                            if(n1.length<=9){
                                var result = $.grep(n1, function(a){
                                    return a.n == e.n;
                                });
                              
                                if(result.length==0)
                                    n1.push(e)
                            }
               
                        }   
                    }
                }
               
       
            }
     
        });
       
     
        m=[1,10,100]
        out=[]
        for(i=0;i<3;i++){
            xx=eval('n'+m[i])
            if(xx.length>0){
                out.push(xx) 
            } 
           
        }
        
       
        return out
        
    },
    getFirstFree:function(){
        var l,i;
        l=this.iplist.length
        for(i=0;i<l;i++){
            if(!this.iplist[i][4]){ //get not used !
         
                return this.iplist[i];
                break;
 
            }
 
        }
  
        return false;
  
    },
    keystroke:function(code){
    
        keys=IPM_device.keys //[x,y]
        x=keys[0]
        y=keys[1]
    
        tot_ul=$('#ipm_drop ul').length
    
        $('#ipm_drop li').removeClass('ac')
    
        ul=$('#ipm_drop ul')[x]
        li=$(ul).find('li')[y]
        tot_li=$(ul).find('li').length
   
   
    
        //down
        if(code==40){
            y++;
            if(y>=tot_li) y=0;
    
        }
               
        //up
        if(code==38){
            y--;
            if(y<0) y=tot_li-1;               
        }
       
        //left
        if(code==37){
            x--;
            if(x<0) x=tot_ul-1;               
        }
        
        //right
        if(code==39){
            x++;
            if(x>=tot_ul) x=0;             
    
        }       
               
        ul=$('#ipm_drop ul')[x]
        li=$(ul).find('li')[y]
        $(li).addClass('ac')  
   
        IPM_device.keys=[x,y] //[x,y]
    
    },
    checkForValidInput:function(n,value){
         
        if(value.length==0) return false;
        data=this.trimArray(n)
        //console.log(n,value)
        var l= data.length
        for(var i=0;i<l;i++)
            if(Number(data[i].n)==Number(value) && !data[i].u) return true;
        
        return false;
        
    },
    
    setActions:function(){
   
   
        NOC.hintset('ip_add_win');
   
   
        $('#ip_add_win div.ip_set').bind('click',function(e){
   
            free=IPM_device.getFirstFree();
   
            if(free){
                for(var i=0;i<=3;i++){
                    $('#ipm_dev_fa'+i).val(free[i])
                }
                
            }
  
        });
   
        $('#ip_add_win div.check_box').bind('click',function(e){
            m=Number($(this).attr('m'))
            ac=Number($(this).attr('act'))
            if(ac==1){
                stat=false
                $(this).attr('act','0')
                $(this).find('div.icons').removeClass('active')
            }else{
                stat=true
                $(this).attr('act','1')
                $(this).find('div.icons').addClass('active')
            }
            switch(m){
                case 1:
                
                    IPM_device.onlyfree=stat
                    break;
                case 2:
                    IPM_device.onlyreserved=stat
                    break;
            }
       
        });
   
        $('#ip_add_win input').numeric().bind('click focus keyup blur',function(e){
        
            data=[1,10,11,12,15]
        
            v=$(this).val()
            if(v=='-') {
                $(this).val('');
                v=''
            }
            switch(e.type){
                case 'focus':
               
                    n=Number($(this).attr('id').replace('ipm_dev_fa',''))
                    data=IPM_device.makeDropData(n,v)
               
                    IPM_device.makeDrop(this, data)
               
               
                    break;
                case 'keyup':
                
                    IPM_device.keystroke(e.keyCode)
               
                    if(e.keyCode==13){
        
                        t=$('#ipm_drop li.ac').text()
        
                        $(this).val(t)       
                        $('#ipm_drop').remove()
                        $(this).blur()       
                
                    }else{
               
                        if(e.keyCode!=40 && e.keyCode!=38 && e.keyCode!=39 && e.keyCode!=37){
                            data=IPM_device.makeDropData(n,v)
                            $('#ipm_drop').remove()
                            IPM_device.makeDrop(this, data)
                        }
                    }
                 
               
                   
                   
                    break;
                case 'click':
                    break;
               
                case 'blur':
                    if(v=='') $(this).val('-')       
                    $('#ipm_drop').remove()
                    n=Number(this.id.replace('ipm_dev_fa',''))
                    
                    if(!IPM_device.checkForValidInput(n, v)){
                        $(this).val('-')       
                    }
                    
                        
                        
                        
        
                    break;
            }
       
        }) ;   
        
    },
    getDottedIPv4:function(){
        ip=[]
        for(i=0;i<=3;i++){
            v=$('#ipm_dev_fa'+i).val()
            if(v.length==0) return false
            if(v=='-') return false
            ip.push(v)
        }
        return ip.join('.')
    },
    editVPS:function(){
        id=$(m).attr('ipid')
        this.ipv4='none'
        
         var pop=new POPUP.init(
            'EDIT IP address',   //popup title
            'editadd',    //popup name
            'win_name_ip_vps',      //parent window
            {
                w:380,     //width 
                h:250,      //height
                wdclass:'orange2'
            })
                   
            if(this.ipv4!='none'){
            var ipv4=this.ipv4.split('.')
            ip1=ipv4[0]
            ip2=ipv4[1]
            ip3=ipv4[2]
            ip4=ipv4[3]
        }else{
            ip1=ip2=ip3=ip4=0
        }
                   
                   
        pop.data(
             
        {
                save:true,     //save button
                rem:false,     //remove button
                cancel:true,   //cancel 
                add:false      //add
            },
            '<div id="ip_add_win">'+
            '<fieldset><legend>Network subnet:</legend><select  id="ipm_dev_np" style="width:220px;"><option>loading..</option></select></fieldset>'+		
            '<fieldset class="iplarge"><legend>IP address:</legend>'+
            '<div class="ip_inp_div"><input id="ipm_dev_fa0" style="width:30px;" value="'+ip1+'">.</div>'+
            '<div class="ip_inp_div"><input id="ipm_dev_fa1" style="width:30px;" value="'+ip2+'">.</div>'+
            '<div class="ip_inp_div"><input id="ipm_dev_fa2" style="width:30px;" value="'+ip3+'">.</div>'+
            '<div class="ip_inp_div"><input id="ipm_dev_fa3" style="width:30px;" value="'+ip4+'"></div>'+
            '<div hint="use first available!" class="hint icon ip_set"></div>'
            +'</fieldset>'
            +'<fieldset><legend>Show only :</legend><div class="element button_element">'+
            '<div class="print_checkboxs"><div act="1" m="1" class="check_box"><div class="icons active"></div><div class="name">Free</div></div><div act="1" m="2" class="check_box"><div class="icons active"></div><div class="name">Reserved</div></div></fieldset></div>'
        
            );
            
        this.getSubnet()
            
        this.setActions()
            
            
        pop.action(
            'win_name_ip_vps',
            //add
            function(){
            pop.win.remove()
            //
             
            },    
            //save
            function(){
             
                val=IPM_device.getDottedIPv4()
                ipid=$(IPM_device.but).attr('ipid')
                if(val){
             
                    $.postJSON('ipm/vps/set',{
                        'eid':VPS.vpsID,
                        'val':val
                    },function(data){
                        if(data.status=='ok'){
                            //$(IPM_device.but).find('span').html(data.old)
                            //IP.updateVal(val,2,data.ip)
                                
            
                            pop.win.remove()
                            WIN.show('#win_name_ip_vps') //set zindex back to 400
                            ips=$('#win_device_layer7_1').find('div.vps[vps_id='+data.data.vps+'] div.ip div')
                            console.log(ips)
                            ht=$(ips).html()
                            $(ips).html(ht+'; '+data.data.val)
                            new_ip=$('<div/>').addClass('vpip').attr('ipid',data.data.id).html('<span>'+data.data.val+'</span><div class="rem" onclick="VPS.remip(this)">remove</div>')
                            
                            $('#vpsip').append($(new_ip))
                            
                            //$out['data'] = Array('id' => $port->id, 'val' => $ip, 'vps' => $vps->id);
                            
                            
                        }
        
                    });
          
                }else{
                    for(i=0;i<=3;i++){
                        v=$('#ipm_dev_fa'+i).val()
                        if(v=='' || v=='-'){
                            $('#ipm_dev_fa'+i).focus()
                            break;
                        }
                    }
              
                }
         
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
    
    editIP:function(m){
        
        id=$(m).attr('ipid')
        this.ipv4=$(m).find('span').text()
        this.editWindow(id)
    
    },


    editWindow:function(id){
        
    
           
        var pop=new POPUP.init(
            'EDIT IP address',   //popup title
            'editadd',    //popup name
            'win_ip',      //parent window
            {
                w:380,     //width 
                h:250,      //height
                wdclass:'orange2'
            })
                   
             
                   
                   
        if(this.ipv4!='none'){
            var ipv4=this.ipv4.split('.')
            ip1=ipv4[0]
            ip2=ipv4[1]
            ip3=ipv4[2]
            ip4=ipv4[3]
        }else{
            ip1=ip2=ip3=ip4=0
        }
                   
                   
        pop.data(
             
        {
                save:true,     //save button
                rem:false,     //remove button
                cancel:true,   //cancel 
                add:false      //add
            },
            '<div id="ip_add_win">'+
            '<fieldset><legend>Network subnet:</legend><select  id="ipm_dev_np" style="width:220px;"><option>loading..</option></select></fieldset>'+		
            '<fieldset class="iplarge"><legend>IP address:</legend>'+
            '<div class="ip_inp_div"><input id="ipm_dev_fa0" style="width:30px;" value="'+ip1+'">.</div>'+
            '<div class="ip_inp_div"><input id="ipm_dev_fa1" style="width:30px;" value="'+ip2+'">.</div>'+
            '<div class="ip_inp_div"><input id="ipm_dev_fa2" style="width:30px;" value="'+ip3+'">.</div>'+
            '<div class="ip_inp_div"><input id="ipm_dev_fa3" style="width:30px;" value="'+ip4+'"></div>'+
            '<div hint="use first available!" class="hint icon ip_set"></div>'
            +'</fieldset>'
            +'<fieldset><legend>Show only :</legend><div class="element button_element">'+
            '<div class="print_checkboxs"><div act="1" m="1" class="check_box"><div class="icons active"></div><div class="name">Free</div></div><div act="1" m="2" class="check_box"><div class="icons active"></div><div class="name">Reserved</div></div></fieldset></div>'
        
            );
            
        this.getSubnet()
            
        this.setActions()
            
        pop.onchange(
            
            function(e,d){
        
        
        
            
            }
            
            )
            
            
        pop.action(
            'win_ip',
            //add
            function(){
               
                pop.win.remove()
            //
             
            },    
            //save
            function(){
             
                val=IPM_device.getDottedIPv4()
                ipid=$(IPM_device.but).attr('ipid')
                if(val){
             
                    $.postJSON('basic/network/ip/set',{
                        'm':2,
                        'tmpl':false,
            
                        'eid':NETWORK.eid,
                        'ip':ipid,
                        'val':val
                    },function(data){
                        if(data.status=='ok'){
                            $(IPM_device.but).find('span').html(data.old)
                            if(DEVICE.cat==2 || DEVICE.cat==3){
                                IP.updateIPval(val,2,data.ip)
                            }else{
                                   IP.updateVal(val,2,data.ip)
                            }
                            
                            
                            
            
                            pop.win.remove()
                            WIN.show('#win_ip') //set zindex back to 400
                        }
        
                    });
          
                }else{
                    for(i=0;i<=3;i++){
                        v=$('#ipm_dev_fa'+i).val()
                        if(v=='' || v=='-'){
                            $('#ipm_dev_fa'+i).focus()
                            break;
                        }
                    }
              
                }
         
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
    win:function(d){
       
       
        
    }
    
    
}