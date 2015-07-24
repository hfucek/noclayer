var IPM_rack={
    init:function(){
        
        if(this.num==3){
        RACK.loading(true);
        
        $('#win_rack_layer3').html(
                        '<div class="table_list">'+
                        '<table cellspacing="0" cellpadding="0" id="rack_ipm_list" width="100%" ></table> '+
                        '</div>')
        
        
        $.postJSON('ipm/rack/get',{
            'id':RACK.rid.replace('rack','')
        }
        , function(data) {
        IPM_rack.render(data)
                    
                    
        
            RACK.loading(false);                            
                                    
        });
        }
    },
    
    sortData:function(data){
       
       var m=[]
        $.each(data, function(i,e){
            m.push(
        [e.hostname,
        e.ipv4,
        e.port,
        e.conn_type]
                )
            
        })
      
        return m
        
        
    },
    render:function(data){
        tdata=this.sortData(data)
        
        
         oTable=$('#rack_ipm_list').dataTable( {
                        "bDestroy": true,
                        "aaSorting": [[ 0, "desc" ]],
                        "oLanguage": {
                            "oPaginate": {
                                "sNext": "",
                                "sPrevious": ""
                            }
                        },
                        "iDisplayLength": 10,
                        "bFilter": false,
                        "bLengthChange": false,
                        "fnRowCallback": function( nRow, aData, iDisplayIndex ) {
                            if ( jQuery.inArray(aData.DT_RowId, this.aSelected) !== -1 ) {
                                $(nRow).addClass('row_selected');
                            }
                        },
                        "aaData": tdata,
                        "aoColumns": [
            
                        {
                            "sTitle": "Device" ,
                            "sClass": "width30"
                        },
                        {
                            "sTitle": "IP Address",
                            "sClass": "width30"
                        },
                        {
                            "sTitle": "Port",
                             "sClass": "center width5"
                        },
                        {
                            "sTitle": "Connector", 
                            "sClass": "center"
                        }
            
           
                        ]
                    } );  
        
        
    }
    
    
}