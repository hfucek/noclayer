
/*
* To change this template, choose Tools | Templates
* and open the template in the editor.
*/
/*
* To change this template, choose Tools | Templates
* and open the template in the editor.
*/
var CONN={
init:function(){
// connection goes here
console.log("SOCKET");
/*
var socket = io.connect('http://192.168.10.223:8080');
socket.on('news', function (data) {
console.log(data);
socket.emit('my other event', { my: 'data' });
});
*/
//when we get connected to server make proceed to noclayer initalisation

this.next()
},
next:function(){
$.getJSON('assets/modules/manifest.json','', function(data) {
if(mode!=data.version){
console.warn('Wrong module assets!');
}else{
if(!UPDATE.init()){
$.each(data.next,function(i,e){
eval(e).init()
});
}
}
////console.log(data)
});
}
}
