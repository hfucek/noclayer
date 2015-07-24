//startup action
$(document).ready(function(){
INSTALL.init();	
	
	
});

var INSTALL={
init:function(){
	
$('div.install').click(function(){
	
	INSTALL.validate()
})	

$('div.p_reset').click(function(){
	
	$('form.p_reset').submit();
})	

$('div.refresh').click(function(){
	
	location.reload()
})	
	


	
},
		


validate:function(){
	$('#instmask').show()
	$('#inst_info').show()
	$('#inst_err').hide();
	
	$('#engage div.button').hide()
	
	
	$('form.install').submit();	
	
	
	
}		
		
		
		
}