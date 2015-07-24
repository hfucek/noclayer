
var MINIMAP={
    close:function(){
	
        //$('#view_minimap div.clasp').removeClass('claspAct')	
        this.active=false;
        $('#view_minimap').attr('act',0)
        $('#view_minimap').parent().find('div.clasp').removeClass('claspAct')	
	
    },
    init:function(){
        $(window).resize(function() {
            MINIMAP.render()
        })
	
        this.set=true	
        WIN.show('#win_minimap')
        this.active=true;
        //minimap window
        this.div=$('#win_minimap div.win_data')

        this.racks=$('<div/>').addClass('miniracks').appendTo(this.div).attr('id','minirack')
	
        $('#minirack').click(function(e){
	
	
            var l = e.pageX - $(this).parent().parent().position().left;
            mt=Number($(this).css('margin-top').replace('px',''))
            var t = e.pageY - $(this).parent().parent().position().top-60-mt
	

            //console.log(t,mt,$(this).parent().parent().position().top)
	
            //$('#status2').html(x +', '+ y);
	
	
	
	
            w=$('#miniwin').width()
            ww=$('#miniwin').parent().width()
            h=$('#miniwin').height()
            hh=$('#miniwin').parent().height()
	
	
            lu=l+Math.round(w/2)
            l-=Math.round(w/2)
            if(l<0) l=0
            cm=$('#miniwinc').width()
            if(lu>cm) l=cm-w-3
	
	
            hu=Math.round(h/2)
            t-=hu
            if(t<0) t=0
	
            h2=(t+hu)+3
	
            if(h2>hh) t=hh-h-3
	
	
	
            $('#miniwin').css('left',l)
            $('#miniwin').css('top',t)
	
            cw=$('#cableview').width()
            ch=$('#cableview').height()
            ll=Math.round((l/ww)*cw)
            $("#content").scrollLeft(ll)
            tt=Math.round((t/hh)*ch)
            $("#content").scrollTop(tt)
	
	
	
        /*
	t=$(this).position().top
	h=$(this).parent().height()-10
	ch=$('#cableview').height()
	tt=Math.round((t/h)*ch)
	$("#content").scrollTop(tt)
	*/
	
	
        });	

        //$('<div/>').	
        //draw racks
	
	
	
        this.render();

    },
    drawRacks:function(){ 

        ref_h=$('#minirack').height()-20
	
        $('#minirack').html('')

        w=ref_h/3.6
        
        var units=0
        var b=10
        var c=0
        $.each(CABLE.items,function(i,e){

            col=e.col-1
            
            if(c!=col) {    
                c=col
                units=0;
                b=10;   
            }
            
            units+=Number(e.units)
            pt=Math.round((e.units/48)*ref_h);
            
            //console.log(e.units,pt,w)
            //48=100%
            
            ll=col*w+col*11+5;
            
            $('<div/>').addClass('mrack').css({
                'bottom':b+'px',
                'height':pt+'px',
                'width':w+'px',
                'left':ll+'px'
                }).appendTo(MINIMAP.racks).html('<div class="wrap"></div>')	
            
            b+=pt
        });
	
	
    },

    render:function(){
        me_h=$('#minirack').parent().height()	
        me_w=$('#minirack').width()	
        cw=$('#cableview').width()
        ch=$('#cableview').height()

		
        size=cw/ch;

        ii=CABLE.items.length
        w=(me_h-20)/3.6
        uw=Math.round(ii*w+ii*11+5);



        if(uw>me_w){
		
            //racks dont fit use width for reference	
            w=Math.round(((me_w-5)/ii)-11);
            hh=(w*3.6)+20
            tt=Math.round((me_h-hh)/2)


            $('#minirack').css({
                'height':hh+'px',
                'margin-top':tt
            })

        }else{
            $('#minirack').css({
                'height':me_h+'px',
                'margin-top':0
            })	
		
        }	
	
        this.drawRacks()	
        this.winPosition()
	
	
	
    },

    resize:function(){

        if(MINIMAP.timer) clearTimeout(MINIMAP.timer);

        MINIMAP.timer=setTimeout("MINIMAP.render()",500); 
    },


    winPosition:function(){
	
        $('#miniwinc').remove()
	
	
        sl=$("#content").scrollLeft()
        st=$("#content").scrollTop()
	
        me_w=$('#minirack').width()
        me_h=$('#minirack').height()
        ii=CABLE.items.length
        w=(me_h-20)/3.6
        uw=Math.round(ii*w+ii*11+5);
	
	
        cw=$('#cableview').width()
        ch=$('#cableview').height()
	
        w=Math.round((winw/cw)*uw)-4
        h=Math.round((winh/ch)*me_h)-4
        l=Math.round((sl/cw)*uw)
        t=Math.round((st/ch)*(me_h-20))
        if(uw<w) uw=w;
	
	
        wcp=$('<div/>').addClass('wcont').attr('id','miniwinc').css({
            'width':uw,
            'height':'100%'
        }).appendTo(MINIMAP.racks)
	
        $('<div/>').addClass('window').attr('id','miniwin').css({
            'top':t+'px',
            'height':h+'px',
            'width':w+'px',
            'left':l+'px'
            }).appendTo(wcp).html('<div class="wrap"></div>')
	



        $('#miniwin').draggable({
            'containment': 'parent' ,
            start: function(event, ui) { 
	
            // postavit sve ostale prozore na 1
	
	

            },
            drag:function(){
	
                l=$(this).position().left
                w=$(this).parent().width()
                cw=$('#cableview').width()
                ll=Math.round((l/w)*cw)
                $("#content").scrollLeft(ll)
	
                t=$(this).position().top
                h=$(this).parent().height()-10
                ch=$('#cableview').height()
                tt=Math.round((t/h)*ch)
                $("#content").scrollTop(tt)
	
		
		
            },
            stop:function(event, ui) { 
	
            }
        });

}


		
		
}
