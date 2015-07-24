var DEMO={
	init:function(){
	//console.log('demo init')	
	
	$('#win_demo div.win_layer').removeClass('win_visible')
	$('#win_demo_layer0').addClass('win_visible')
	
	data=LOGIN.settings
	if(data){
		if(data.length>0){
	
		
	if(Number(data[1].value)==0){
	
	$('#win_demo input.start').attr('checked','checked')
	WIN.show('#win_demo')	
	}else{
		$('#win_demo input.start').removeAttr('checked')	
		
	}
	}
	
	
	this.action()
	}}
	,
	startup:function(a){
		
		atr=1
		if(a) atr=0
		
		$.postJSON('settings/set',{'el':'tutorials','val':atr}, function(json) {
			
			
		});	
		
	},
	action:function(){
	
		$('#win_demo a.mainlink').click(function(){
                   
			
			$('#win_demo div.win_layer').removeClass('win_visible')
			f=$(this).attr('f')
			$('#win_demo_layer'+f).addClass('win_visible')
			
		});
		
		$('#win_demo a.home').click(function(){
			
			$('#win_demo div.win_layer').removeClass('win_visible')
			
			$('#win_demo_layer0').addClass('win_visible')
			
			
			
		});		

		$('#win_demo input.start').click(function(){
			
			ss=$(this).parent().find('input.start')
			
			m=ss.prop("checked");

			DEMO.startup(m)
			
			
			
		});	
	
		
		$('#win_demo a.start').click(function(){
			
			ss=$(this).parent().find('input.start')
			m=ss.prop("checked");
			ss.prop("checked",!m);
			DEMO.startup(!m)
			
		});	
		
		
		$('#win_demo a.sub').click(function(){
			m=$(this).parent().parent()
			
			if(Number(m.attr('act'))==1){
				m.attr('act','0')
				m.removeClass('open')
			}else{
				m.addClass('open')
				m.attr('act','1')
			}
			
			
			//console.log(m)
			//$('#win_demo div.win_layer').removeClass('win_visible')
			
			//$('#win_demo_layer0').addClass('win_visible')
			
		});			
			
		
		
		
		
	}
	
	
		
}