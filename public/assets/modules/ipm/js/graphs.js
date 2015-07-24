
var IPM_GRAPHS={
    
    getRandomInt:function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    pie:function(a,b,c){
       cc=c-a-b;
       console.log(a,b,cc,c)
        var datas = [
        ['Used', a],['Reserved', b], ['Free', cc]
    
        ];
        var plot1 = jQuery.jqplot ('ipm_pie', [datas],
        {
            seriesDefaults: {
                // Make this a pie chart.
                renderer: jQuery.jqplot.PieRenderer,
                rendererOptions: {
                    diameter:170,
                    // Put data labels on the pie slices.
                    // By default, labels show the percentage of the slice.
                    showDataLabels: true
                }
            },
            grid: {
                shadowAlpha: 0.0, 
                drawGridLines: false,
                background: '#f8f8f8',
                borderWidth: 0           // pixel width of border around grid.    
            }
            ,
            legend: {
                show:true, 
                location: 'se'
            }
        }
        );
        
    },
  
    barNavigation:function(from,size,data){
        
        $('#ipm_bar_wrap div.ipm_graph_nav div.semafor').show()
        
        if(data[0].length==0){
            
            $('#ipm_bar_wrap div.ipm_graph_nav div.semafor').hide() 
        }
        
        f=from*size
        n=f+size
        
        if(size>data.length){
            f=from*data.length
            n=data.length
        
             
        }
         
         
        
        
        //left
        if(from==0){
            $('#ipm_bar_wrap div.ipm_graph_nav div.left').addClass('ldis').attr('act','no')
        }else{
            $('#ipm_bar_wrap div.ipm_graph_nav div.left').removeClass('ldis').attr('act','ok')
        }
        
        //right
        if(data.length<=n){
            $('#ipm_bar_wrap div.ipm_graph_nav div.right').addClass('rdis').attr('act','no')
            
        }else{
            $('#ipm_bar_wrap div.ipm_graph_nav div.right').removeClass('rdis').attr('act','ok')
        }
        
        
        if(n>data.length) n=data.length
        m='Showing '+(f+1)+' to '+n+' of '+data.length+' entries'
        $('#ipm_bar_wrap div.ipm_graph_nav div.semafor').html(m)
    //console.log(m)
        
    },
    
    bardata:function(data,size,from){
        used=[]
        reserved=[]
        free=[]
        f=from*size+size
        for(i=from*size;i<f;i++){
            e=data[i]
            if(e){
                used.push([e[0],e[1]])
                reserved.push([e[0],e[2]])
                free.push([e[0],e[3]])
            }
        }
        
        return [used,reserved,free]
    },
    
    calculateSize:function(container){
        w=$('#'+container).width()
        return Math.floor(w/125)
        
    },
    //resort data from server
    sortData:function(){
        m=[]
        $.each(IPM_layers.data.subnets,function(i,e){
            
            m.push([e.subnet, e.used,e.reserved,e.size-e.used-2])
            
        });
        
        return m
        
    },
    bar:function(container){
        
        //get data  
        var data=this.sortData()
        
        //empty old data
        $('#'+container).html('')
        
        //get from integer
        if(!$('#'+container).attr('from')){
            $('#'+container).attr('from',0)
            from=0
            
        }else{
            from=Number($('#'+container).attr('from'))
        }
        
           
        //width of bar container
        w=$('#'+container).width()
        
        if(data.length==0) 
        {
            data=[[]];
            plotvar={
                seriesDefaults: {
                    renderer:$.jqplot.BarRenderer
                }
                
            }
   
        }else{
            plotvar={
   
                seriesDefaults: {
                    showMarker: true,   // render the data point markers or not.
                    pointLabels:{
                        show:true, 
                        stackedValue: true
                    },
                    renderer:$.jqplot.BarRenderer,
                    rendererOptions: {
                        barPadding: 8,      // number of pixels between adjacent bars in the same
          
                        formatString:'%d',
                        barMargin: 10,      // number of pixels between adjacent groups of bars.
                        barDirection: 'vertical', // vertical or horizontal.
                        barWidth: 30,     // width of the bars.  null to calculate automatically.
                        shadowOffset: 2,    // offset from the bar edge to stroke the shadow.
                        shadowDepth: 2,     // nuber of strokes to make for the shadow.
                        shadowAlpha: 0.3,   // transparency of the shadow.
                        showLabel: true    // wether to show the text label at the tick,
                    }        
        
        
                },
                axes: {
                    xaxis: {
                        renderer: $.jqplot.CategoryAxisRenderer
        
                    },
                    yaxis:{
                        min:0,
                        padMin: 0
           
                    }
                }
   
            }
        
        }
    
    
        //number of graphs regarding to size of container
        size=this.calculateSize(container)
        
       
        //update navigation
        this.barNavigation(from, size,data)
        
        //resorted data
        m=this.bardata(data,size,from)
        
       
         
        //render bar       
        $.jqplot('ipm_bar', m, plotvar);
        
    }
    
    
}

