myWikiSettings = {
    nameSpace:          "wiki", // Useful to prevent multi-instances CSS conflict
    previewParserPath:  "~/sets/wiki/preview.php",
    onShiftEnter:       {keepDefault:false, replaceWith:'\n\n'},
    markupSet:  [
        {name:'Heading 1', key:'1', openWith:'== ', closeWith:' ==', placeHolder:'Your title here...' },
        {name:'Heading 2', key:'2', openWith:'=== ', closeWith:' ===', placeHolder:'Your title here...' },
        {name:'Heading 3', key:'3', openWith:'==== ', closeWith:' ====', placeHolder:'Your title here...' },
        {name:'Heading 4', key:'4', openWith:'===== ', closeWith:' =====', placeHolder:'Your title here...' },
        {name:'Heading 5', key:'5', openWith:'====== ', closeWith:' ======', placeHolder:'Your title here...' },
        {separator:'--' },        
        {name:'Bold', key:'B', openWith:"'''", closeWith:"'''"}, 
        {name:'Italic', key:'I', openWith:"''", closeWith:"''"}, 
        {name:'Stroke through', key:'S', openWith:'<s>', closeWith:'</s>'}, 
        {separator:'--' },
        {name:'Bulleted list', openWith:'(!(* |!|*)!)'}, 
        {name:'Numeric list', openWith:'(!(# |!|#)!)'}, 
        {separator:'--' },
        {name:'Picture', key:'P', replaceWith:'[[Image:[![Url:!:http://]!]|[![name]!]]]'}, 
        {name:'Link', key:'L', openWith:'[[![Link]!] ', closeWith:']', placeHolder:'Your text to link here...' },
        {name:'Url', openWith:'[[![Url:!:http://]!] ', closeWith:']', placeHolder:'Your text to link here...' },
        {separator:'--' },
        {name:'Quotes', openWith:'(!(> |!|>)!)'},
        {name:'Code', openWith:'(!(<code>|!|<code>)!)',closeWith:'(!(</code>|!|</code>)!)'},
        {name:'Pre', openWith:'(!(<pre>|!|<pre>)!)',closeWith:'(!(</pre>|!|</pre>)!)'},
       // {name:'Code', openWith:'(!(<source lang="[![Language:!:php]!]">|!|<pre>)!)', closeWith:'(!(</source>|!|</pre>)!)'}, 
        {special:'--' },
        //{name:'Preview', call:'getData', className:'preview'}
    ]
}

var WIKI={
		
urldecode:function(str) {
return decodeURIComponent((str+'').replace(/\+/g, '%20'));
},

data:function(data){
	
	console.log(data)
	
	console.log('ok')
	
	
},

selectCat:function(data){

	
	select=$('div.wikicategory select')
	
	select.html('')
	
	$.each(data,function(i,e){
		
		$('<option/>').val(e.id).html(e.title).appendTo(select)
		
	});
	
	
	
	
},

/*
 * parse category data for index page
 * */
parseCategory:function(data){

	
	//this.wid=0;
	$('#wikicatind').html('<ul class="index"></ul>')
	
	ul=$('#wikicatind ul')
	$.each(data,function(i,e){
	
	$('<li/>').html('<a onclick="WIKI.load('+e.id+')" href="#">'+e.title+'</a>').appendTo(ul)
		//<span class="size10">(last update: '+e.time+')</span>
		
	});
	
	if(data.length==0)
	$('<div/>').addClass('nodata').html('There no articles in this category.').appendTo($(ul).parent())
	
	
	
	
	
	
	
},
loadCatData:function(c){
	this.wid=0;
	WIKI.loading(true)
	$('#wikidata').html('')	
	$('#mwikititle').val('Please click on existing title or create new!')
	$.postJSON('basic/wiki/getcat',{'cat':c}, function(data) {
		
		WIKI.parseCategory(data.data)
		$('div.wikicategory select').val(data.selected)
		WIKI.loading(false)
	});


},
loadCat:function(c){
	
	WIKI.loading(true)
	$('#wikidata').html('')	
	$('#mwikititle').val('Please click on existing title or create new!')
	$.postJSON('basic/wiki/getcat',{'cat':c}, function(data) {
		WIKI.selectCat(data.cats)
		
		WIKI.parseCategory(data.data)
		$('div.wikicategory select').val(data.selected)
		/*
		m=WIKI.urldecode(data.data)
		WIKI.wid=data.id
		$('#wikidata').html(m)	
		$('#mwikititle').val(data.title)
		WIKI.title=data.title
		*/
		WIKI.loading(false)
	});
	
},

load:function(m){

WIKI.loading(true)
$('#wikidata').html('')	


	
	$.postJSON('basic/wiki/html',{'wid':m}, function(data) {
		m=WIKI.urldecode(data.data)
		WIKI.wid=data.id
		$('#wikidata').html(m)	
		$('#mwikititle').val(data.title)
		WIKI.title=data.title
		WIKI.loading(false)
	});
	
		
	
},

loading:function(key){
	if(key)
	$('#win_wiki div.win_icon').addClass('deviceLoader').removeClass('default');
	else
	$('#win_wiki div.win_icon').removeClass('deviceLoader').addClass('default');
},
process:function(){
	m=$('#wtar').val()
	
	$.postJSON('basic/wiki/prew',{'data':m}, function(data) {
		m=WIKI.urldecode(data.data)
		$('#wikidata').html(m)	
		
	});
	
		
	
},
addnew:function(){
	$('#wikititle').val('')	
	$('#wikis').val('')	
	
	$('div.ewikicategory select').html($('div.wikicategory select').html())
	$('div.ewikicategory select').val($('div.wikicategory select').val())
	
	WIKI.layer(1)
	WIKI.isNew=true
	
	
	
},
catset2:function(d){
	val=$(WIKI.win.data).find('input').val()
	if(val.length>0){
		
		WIKI.loading(true)
		$('#wikidata').html('')	
		$('#mwikititle').val('Please click on existing title or create new!')
		
		cat=$('div.wikicategory select').val()
		
		$.postJSON('basic/wiki/renamecat',{'cat':cat,'val':val}, function(data) {
			
			WIKI.win.remove()
			WIKI.selectCat(data.cats)
			
			WIKI.parseCategory(data.data)
			
			$('div.wikicategory select').val(data.selected)
		
			WIKI.loading(false)
		});
		
		
		
	}
	
},

catset:function(d){
	
	
	
	val=$(WIKI.win.data).find('input').val()
	
	if(val.length>0){
		
		
		
		
		
		WIKI.loading(true)
		$('#wikidata').html('')	
		$('#mwikititle').val('Please click on existing title or create new!')
		$.postJSON('basic/wiki/setcat',{'cat':val}, function(data) {
			
			WIKI.win.remove()
			WIKI.selectCat(data.cats)
			
			WIKI.parseCategory(data.data)
			
			$('div.wikicategory select').val(data.selected)
		
			WIKI.loading(false)
		});
		
		
		
	}
	
},
cataddnew:function(){
	
	
	
	this.win=new nocwin('Add new category','','addvlan');	

	this.win.zindex()
	

d=this.win.data
pre=''
$(d).html('<fieldset style="margin-top:10px;"><legend></legend></fieldset>'+
		  '<fieldset><legend>Category name:</legend><input value="'+pre+'" class="size_large2"></fieldset>'+		
		'<fieldset style="position:absolute;bottom:10px;right:10px;"><legend></legend>'+
			'<button class="size_medium el_close">cancel</button>'+
			'<button class="size_medium el_add">add</button></fieldset>'
)	

//close win
$(this.win.div).find('div.win_close').click(function(){
	WIKI.win.remove()
	WIN.show('#win_wiki') //set zindex back to 400
});
//add element
$(this.win.div).find('button.el_add').click(function(){
	WIKI.catset(this)
});

//cancel
$(this.win.div).find('button.el_close').click(function(){
	WIKI.win.remove()
	WIN.show('#win_wiki') //set zindex back to 400
});	
	
	
},
catedit:function(){
	
	
	
	this.win=new nocwin('Rename category','','addvlan');	

	this.win.zindex()
	

d=this.win.data
pre=$('div.wikicategory select option:selected').html()
$(d).html('<fieldset style="margin-top:10px;"><legend></legend></fieldset>'+
		  '<fieldset><legend>Category name:</legend><input value="'+pre+'" class="size_large2"></fieldset>'+		
		'<fieldset style="position:absolute;bottom:10px;right:10px;"><legend></legend>'+
			'<button class="size_medium el_close">cancel</button>'+
			'<button class="size_medium el_add">set</button></fieldset>'
)	

//close win
$(this.win.div).find('div.win_close').click(function(){
	WIKI.win.remove()
	WIN.show('#win_wiki') //set zindex back to 400
});
//add element
$(this.win.div).find('button.el_add').click(function(){
	WIKI.catset2(this)
});

//cancel
$(this.win.div).find('button.el_close').click(function(){
	WIKI.win.remove()
	WIN.show('#win_wiki') //set zindex back to 400
});	
	
	
	
},
catremove:function(){
	
	val=$('div.wikicategory select').val()
	
	if(Number(val)>0)
	WIN.prompt('Delete Category','All data in category will be erased, proceed with deleting?',5);
	
	
	
},
catrem:function(){
	val=$('div.wikicategory select').val()
	
	WIKI.loading(true)
	$('#wikidata').html('')	
	$('#mwikititle').val('Please click on existing title or create new!')
	$.postJSON('basic/wiki/remcat',{'cat':val}, function(data) {
		
		
		WIKI.selectCat(data.cats)
		
		WIKI.parseCategory(data.data)
		
		$('div.wikicategory select').val(data.selected)
	
		WIKI.loading(false)
	});
	
	
},		
layer:function(m){
$('#win_wiki div.win_layer').removeClass('win_visible');	
$('#win_wiki_layer'+m).addClass('win_visible');

},

edit:function(){
	
	if(Number(this.wid)>0){
		
		
		$('div.ewikicategory select').html($('div.wikicategory select').html())
		
		$('div.ewikicategory select').val($('div.wikicategory select').val())
		
		$.postJSON('basic/wiki/get',{'wid':this.wid}, function(data) {
			m=WIKI.urldecode(data.data)
			$('#wikis').val(m)	
			$('#wikititle').val(data.title)	
			WIKI.layer(1)
		});	
		
	
	}else{
		alert('Please, select article/post first!')
		
	}
	
		
},
cancel:function(){
	WIKI.isNew=false
	WIKI.layer(0)	
},

rem:function(key){
	

	$('#wikidata').html('')
	$('#mwikititle').html('loading..')
		$.postJSON('basic/wiki/rem',{'wid':this.wid}, function(data) {
			
			cat=$('div.wikicategory select').val()
			WIKI.isNew=false;
			WIKI.wid=0
			WIKI.loadCat(cat)
			/*
			m=WIKI.urldecode(data.data)
			$('#wikis').val(m)	
			WIKI.layer(0)
			$('#wikidata').html(m)
			$('#mwikititle').val(data.title)
			$('#win_wiki_layer0 div.win_data').scrollTop(0)
			WIKI.title=data.title
			*/
			
		});	
},

save:function(){
	
	
//if(Number(this.wid)>0){
	
	
	//loading
	data=$('#wikis').val()	
	tit=$('#wikititle').val()	
	
	if(data.length>0 && tit.length>1){
	WIKI.layer(0)
	if(WIKI.isNew) this.wid='new';
	cat=$('div.ewikicategory select').val()
	WIKI.loading(true)
	$('#wikidata').html('')
	$('#mwikititle').html('loading..')
		$.postJSON('basic/wiki/set',{'wid':this.wid,'data':data,'title':tit,'cat':cat}, function(data) {
			m=WIKI.urldecode(data.data)
			$('#wikis').val(m)	
			WIKI.layer(0)
			$('#wikidata').html(m)
			$('#mwikititle').val(data.title)
			$('#win_wiki_layer0 div.win_data').scrollTop(0)
			WIKI.title=data.title
			WIKI.isNew=false;
			
			$('div.wikicategory select').val(data.catID)
			
			WIKI.reloadcat(cat)
			
			WIKI.wid=data.id
			
		});	
		
	}else{
		if(data.length==0){
			alert('Please input some text before save')
		}else{
			alert('Please input title')
		}
		
		
	}
	//}
	
},

reloadcat:function(c){
	WIKI.loading(true)
	$.postJSON('basic/wiki/getcat',{'cat':c}, function(data) {
		WIKI.selectCat(data.cats)
		
		WIKI.parseCategory(data.data)
		$('div.wikicategory select').val(data.selected)
		/*
		m=WIKI.urldecode(data.data)
		WIKI.wid=data.id
		$('#wikidata').html(m)	
		$('#mwikititle').val(data.title)
		WIKI.title=data.title
		*/
		WIKI.loading(false)
	});
	
},

remove:function(){
	if(Number(this.wid)>0){
	WIN.prompt('Delete Post','All data will be erased, proceed with deleting?',4);
	}else{
		alert('Please, select article/post first!')
	}
	
	
},
select:function(key){
	n=$('#wikisearchtable tr.card').length-1
	$('#wikisearchtable tr.card').removeClass('over')
	if(key=='down'){
		WIKI.index++;	
		
		
	}else{
		WIKI.index--;
		
	}
	
	if(WIKI.index>n) WIKI.index=0
	if(WIKI.index<0) WIKI.index=n
	
	//console.log(SEARCH.index,n)
	$('#wikisearchtable tr:eq('+WIKI.index+')').addClass('over')
	
	
},

tabs:function(data){
	
	num=0;
	$.each(data,function(a,d){
	set=false
	
	o=d
		t=''
		if(!set){
		
		set=true	
		}
		newTR=$('<tr id="ws_tab'+num+'" ind="'+num+'" class="card" style="overflow:hidden;"></tr>')
		
		//td=$('<td/>').addClass('title').html('').appendTo(newTR)
		td2=$('<td/>').html('<div itd="'+o.id+'"   ind="'+o.id+'" class="data">'+o.title+'</div>').appendTo(newTR)
		
		num++;
		//td2=$('<td/>').attr(data.id).html(data.name).appendTo(newTR)
		

		
		$(WIKI.table).append(newTR)
			
		
	});
	
	
	
	
if(num>0) 	$('#wikisearchdata').show()
	
$(WIKI.table).find('tr.card').hover(function(e){
	$(WIKI.table).find('tr.card').removeClass('over');
	$(this).addClass('over')
WIKI.index=Number($(this).attr('ind'))	
},function(e){}).mousedown(function(){

	WIKI.seek($(this).attr('ind'))
});

},	
seek:function(a){
	m=$('#ws_tab'+a)
	
	
	id=m.find('div.data').attr('itd')
	
	$('#mwikititle').val(m.find('div.data').text())
	$('#wikisearchdata').hide()
	WIKI.load(id)

	
},


init:function(){
	
	//add wiki menu
	$('#headmenu_wiki').html(
			'<a class="menu_a wiki_click" href="#"><div class="icon_menu">'+
			'<div class="icons wikicon hint" act="2" hint="Wiki"></div>'+
			'</div></a>'
	)	
	
	
$('a.wiki_click').click(function(){
		
		WIKI.start()
		
	});	
	
},
icon:function(key){
if(key)
	$('#header div.wikicon').addClass('wikactive');
	else
	$('#header div.wikicon').removeClass('wikactive');
},

start:function(){
	
	WIKI.icon(true)
	
	$('#wikisearchdata').hide()
	
	if(!this.set){
	
	$('div.wikicategory select').change(function(){
		
		//console.log()
		WIKI.loadCatData($(this).val())
	})	
		
		
		
	WIKI.table=$('#wikisearchtable')	
		
	$('#wikis').markItUp(myWikiSettings);
	
	$('#mwikititle').bind('blur',function(e){
		$('#wikisearchdata').hide()
		
		if(Number(WIKI.wid)==0) WIKI.title='' 
		$(this).val(WIKI.title)
		
	});	
	
$('#mwikititle').bind('keydown keyup focus',function(e){
		
		next=true;
		
		if(e.type=='focus'){	
			$(this).val('')
			
		}
		
		
		if(e.keyCode==13){
			next=false;			
			if(WIKI.index>=0){
				if(e.type=='keydown'){	
				WIKI.seek(WIKI.index)
				}
			}
		}
		if(e.keyCode>=37 && e.keyCode<=40){
			next=false;			
			if(e.type=='keydown'){	
			if(e.keyCode==38) WIKI.select('up')
			if(e.keyCode==40) WIKI.select('down')
			
		}}
			
		//escape
		if(e.keyCode==27){
				next=false;			
			if(e.type=='keydown'){	
			$('#searchdata').hide()
			$(SEARCH.table).html('')
			ms=$('#header div.menu_search')
			$(ms).parent().find('ul.search_drop').slideUp('fast');
			$(ms).attr('act',0)
			$(ms).removeClass('active_button')
			}
			
		
		
		//console.log(e.keyCode,$(this).val())
		}
			
		
		
		
		if(next && e.type=='keyup'){
		
		$.getJSON('basic/wiki/titles',{'key':$(this).val()}, function(json) {
			$('#wikisearchdata').hide()
			
			$(WIKI.table).html('')
			WIKI.tabs(json.data)
			
			WIKI.index=-1;
			
		});
		}
		
		
		
	});
	
	
//articles edit
	$('#win_wiki div.edit_action li').click(function(){
	ac=Number($(this).attr('m'))	
	switch(ac){
	case 1:
	WIKI.addnew()
	break;
	
	case 2:
		WIKI.edit()
	break;
	
	case 3:
		WIKI.remove()
	break;
	}
	
		
	});

	//categories edit
	$('#win_wiki div.category_action li').click(function(){
		ac=Number($(this).attr('m'))	
		switch(ac){
		case 1:
		WIKI.cataddnew()
		break;
		
		case 2:
			WIKI.catedit()
		break;
		
		case 3:
			WIKI.catremove()
		break;
		}
		
			
		});	
	

	WIKI.loadCat(1); 
	
	//WIKI.load(0); 
	
	this.set=true;
	}
	
	WIN.show('#win_wiki')
	
	
	
	
	
	
    
	
	
}		
		
		
}

