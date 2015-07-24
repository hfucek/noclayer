var IMAGE={
init:function(){
this.win=$('#win_image')	
this.set=true	
this.icondiv=this.win.find('div.win_icon')
this.back=this.win.find('div.image_background')

$('#image').load(function(){

	IMAGE.loaded(this)	
	
})

},

load:function(a){
	
	if(!this.set) this.init()
	src=$(a).attr('src')
	
	
	
	
	
	w=Number($(a).attr('w'))
	h=Number($(a).attr('h'))
	
	this.win.css({'height':h+25,'width':w})
	
	this.back.css({'height':h,'width':w})
	
	src=src.replace('tumb/','')
		
		WIN.show('#win_image')

		
		$(this.icondiv).removeClass('win_icon')
		$(this.icondiv).addClass('imageLoader')
		
		
		
	$('#image').attr('src',src);
	
},

loaded:function(a){
	h=$(a).height();
	w=$(a).width();
	wh=h+60
	//this.load.remove()
	
	$(this.icondiv).addClass('win_icon')
	$(this.icondiv).removeClass('imageLoader')
	
	
	if(wh>=winh){
	/*
	o=h/w
	
	
	h=winh-60	
	w=Math.round(h/o)	
*/
	//$(a).css({'height':h,'width':w})
	
	}
	
	
	this.win.css({'height':h+25,'width':w})
	this.win.find('div.image_mask').css('height',h)
	
	this.back.css({'height':h,'width':w})
	
	if(this.win.position().top<0){
		
		this.win.css('top','0px')
	}
	
	//im.parent().css('height',(winh-75)+'px')	
	
},
resize:function(){
if(!this.set) this.init()
	
	/*
 * default image size 1000x750
 * 
 */
if(this.win.position().top<0){
	
	this.win.css('top','0px')
}
/*
height=winh+35

im=this.win.find('img')

im.removeClass('horizontal')
im.removeClass('vertical')
	
if(winh<785){
this.win.css('height',(winh-55)+'px')	
im.parent().css('height',(winh-75)+'px')

im.addClass('vertical')

}else{
	this.win.css('height',750+'px')	
	
}	
	*/
}
		
		
		
		
		
}