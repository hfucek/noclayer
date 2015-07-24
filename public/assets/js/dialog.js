var ALERTS = {
    warn: function(txt) {
        var pop = new POPUP.init(
                'ALERT', //popup title
                'alert_sram', //popup name
                'win_update', //parent window
                {
                    w: 380, //width 
                    h: 130, //height
                    wdclass: 'orange2'
                })
        data = '<div ><div class="pop_warn">' + txt + '</div></div>'

        s = 0


        pop.data(
                {
                    save: false, //save button
                    rem: false, //remove button
                    cancel: true, //cancel 
                    add: false      //add
                },
        data
                );
        pop.actionSet('win_update', ['close', 'cancel'], function() {

            pop.win.remove()
        });



    }

}


var POPUP = {
    init: function(title, name, win, dim) {


        this.win = new nocwin(title, '', name);

        this.win.setPosition(win, dim)

        this.win.setpid(name)



        if (win != 'windows')
            this.win.zindex()

        this.loading = function(key) {

            if (key) {
                $(this.win.div).find('div.win_icon').addClass('deviceLoader').removeClass('default');

            }
            else {

                $(this.win.div).find('div.win_icon').removeClass('deviceLoader').addClass('default');
            }
        }


        this.data = function(ob, data) {

            d = this.win.data

            set = (ob.set) ? '<div style="float:left;margin-right:20px;"><a class="abutton el_set" href="#"><div class="inner">Set</div></a></div>' : '';
            move = (ob.move) ? '<div style="float:left;margin-right:20px;"><a class="abutton el_move" href="#"><div class="inner">Move</div></a></div>' : '';
            disconnect = (ob.disconnect) ? '<div style="float:left;margin-right:20px;"><a class="abutton el_disconnect" href="#"><div class="inner">Disconnect</div></a></div>' : '';
            rem = (ob.rem) ? '<div style="float:left;margin-right:20px;"><a class="abutton el_rem" href="#"><div class="inner">Remove</div></a></div>' : '';
            add = (ob.add) ? '<div style="float:left;margin-right:20px;"><a class="abutton el_adds" href="#"><div class="inner">Add</div></a></div>' : '';
            save = (ob.save) ? '<div style="float:left;margin-right:20px;"><a class="abutton el_save" href="#"><div class="inner">Save</div></a></div>' : '';
            test = (ob.test) ? '<div style="float:left;margin-right:20px;"><a class="abutton el_test" href="#"><div class="inner">Test</div></a></div>' : '';
            cancel = (ob.cancel) ? '<div style="float:left;margin-right:20px;"><a class="abutton el_cancel" href="#"><div class="inner">Cancel</div></a></div>' : '';

            close = (move == disconnect == rem == add == save == cancel) ? '<div style="float:left;margin-right:20px;"><a class="abutton el_close" href="#"><div class="inner">Close</div></a></div>' : '';

            $(d).html(data +
                    '<fieldset style="position:absolute;bottom:10px;right:10px;"><legend></legend>' +
                    disconnect +
                    move +
                    set +
                    rem +
                    save +
                    add +
                    test +
                    cancel +
                    close +
                    '</fieldset>'
                    )

        }
        this.onchange = function(out) {
            $(this.win.div).find('select').bind('change', function(e) {
                out(e, this)
            });
            $(this.win.div).find('input').bind('change', function(e) {
                out(e, this)
            });

        }


        /*
         * new function for action with better source 
         */

        this.actionSet = function(focuswin, type, feedback) {

            var map = {
                'disconnect': {'act': 'a.el_disconnect', 'show': false},
                'close': {'act': 'div.win_close', 'show': true},
                'add': {'act': 'a.el_adds', 'show': false},
                'save': {'act': 'a.el_save', 'show': false},
                'rem': {'act': 'a.el_rem', 'show': true},
                'cancel': {'act': 'a.el_cancel', 'show': true},
                'set': {'act': 'a.el_set', 'show': false},
                'move': {'act': 'a.el_move', 'show': false}
            }


            var div = this.win.div

            if (typeof type !== 'object') {
                type = [type]

            }


            $.each(type, function(i, e) {
                obj = map[e]

                if (typeof obj !== 'object') {
                    console.warn('type: ' + type + ' is not mapped! Please check source')
                    return false

                }



                $(div).find(obj.act).click(function() {
                    feedback()
                    if (focuswin != 'windows' && obj.show)
                    {
                        WIN.show('#' + focuswin) //set zindex back to 400
                        console.log("focusback" + focuswin)
                    }
                });

            });








        }

        /*
         * Menu force action
         */
        
        this.forceMenu=function(num){
            $(this.win.div).find('div.win_menu li').removeClass('aktive')
            $($(this.win.div).find('div.win_menu li')[num]).addClass('aktive')
            $(this.win.div).find('div.win_layer').removeClass('win_visible')
            
            $($(this.win.div).find('div.win_layer')[num]).addClass('win_visible')
            
        }

        /**
         * 
         * Use for menu 
         */

        this.menuAction = function() {

            $(this.win.div).find('div.win_menu li').click(function() {
                $(this).parent().find('li').removeClass('aktive')

                l = Number($(this).attr('layout')) - 1

                $(this).addClass('aktive')
                $(this).parent().parent().parent().find('div.win_layer').removeClass('win_visible')
                $($(this).parent().parent().parent().find('div.win_layer')[l]).addClass('win_visible')


            })

        }


        /**
         * this is old function for action, use new function instead ->actionSet
         */

        this.action = function(focuswin, add, save, rem, cancel) {


//close win
            $(this.win.div).find('div.win_close').click(function() {
                cancel()
                if (focuswin != 'windows')
                    WIN.show('#' + focuswin) //set zindex back to 400
            });
//add element
            $(this.win.div).find('a.el_adds').click(function() {
                add()
                //IP.vlanset(this)
            });
//cancel
            $(this.win.div).find('a.el_save').click(function() {
                save()
                //IP.win.remove()
                //WIN.show('#'+focuswin) //set zindex back to 400
            });

//cancel
            $(this.win.div).find('a.el_rem').click(function() {
                rem()
                //IP.win.remove()
                if (focuswin != 'windows')
                    WIN.show('#' + focuswin) //set zindex back to 400
            });

//cancel
            $(this.win.div).find('a.el_cancel').click(function() {
                cancel()
                //IP.win.remove()
                if (focuswin != 'windows')
                    WIN.show('#' + focuswin) //set zindex back to 400
            });

//close
            $(this.win.div).find('a.el_close').click(function() {
                cancel()
                //IP.win.remove()
                if (focuswin != 'windows')
                    WIN.show('#' + focuswin) //set zindex back to 400
            });

        }



    }}




function nocwin(title, text, type, key) {



//make new win
    switch (type) {
        case 'error':

            $('#win_mask2').show()
            this.div = $('<div/>').css({'width': '520px', 'height': '320px', 'z-index': 400, 'display': 'block'}).addClass('win win_alert_class').appendTo($('#windows'))

            this.data = $('<div/>').appendTo(this.div)
            break;

        case 'alert':
        case 'prompt':
        case 'device':

            this.div = $('<div/>').css({'z-index': 400, 'display': 'block'}).addClass('win win_alert_class').appendTo($('#windows'))

            $('<div/>').addClass('float size_medium').html('<div class="win_warning"></div>').appendTo(this.div)

            l = $('<div/>').addClass('float size_large3').appendTo(this.div)

            $('<div/>').addClass('win_alert_h').html(title).appendTo(l)
            $('<div/>').addClass('win_alert_p').html(text).appendTo(l)

            b = $('<div/>').addClass('win_alert_nav').attr('align', 'right').appendTo(this.div)

            break;
        default:
            this.width = 400
            this.height = 220

            this.div = $('<div/>').css({'left': x + 'px', 'top': y + 'px', 'z-index': 406, 'display': 'block', 'width': this.width + 'px', 'height': this.height + 'px'}).addClass('win win_add_element_class').appendTo($('#windows'))
            $('<div/>').addClass('win_header').html('<div class="win_close"></div><div class="win_icon default"></div><div class="win_header_name">' + title + '</div>').appendTo(this.div)
            this.data = $('<div/>').addClass('pop_win_data').appendTo(this.div)
            this.icon = $(this.div).find('div.win_icon')

            break;

        case 'licence':
        case  'cabrem':
        case  'monitor':
        case 'conndevice':
        case 'addelement':
        case 'addvps':
        case 'addstorage':
        case 'addvlan':
        case 'graph':
        case 'graphing':
        case 'rename_template':
        case 'dupl_template':
            this.width = 400
            this.height = 220


            if (type == 'licence') {
                win = 'win_license'
                this.height = 135
                this.width = 480
            }
            if (type == 'monitor') {
                win = 'win_monitor_settings'
                this.height = 280
            }

            if (type == 'graphing') {

                win = 'win_graphing_settings'
                this.height = 240
            }


            if (type == 'graph') {

                win = 'win_graphing'
                this.height = 220
            }


            if (type == 'addvlan') {
                win = 'win_ip'
                this.height = 150
            }
            if (type == 'conndevice') {
                win = 'win_ip'
                this.height = 220
            }

            if (type == 'cabrem') {
                win = false
                this.height = 130
            }

            if (type == 'addelement' || type == 'rename_template' || type == 'dupl_template') {
                win = 'win_device_template'
            }
            if (type == 'rename_template') {
                this.height = 150

            }

            if (type == 'addvps') {
                this.width = 680
                this.height = 300
                win = 'win_device'
            }

            if (type == 'addstorage') {
                this.width = 480
                this.height = 380
                win = 'win_device'
            }




            if (!win) {
                $('#win_mask5').show()
                y = (winh - this.height) / 2
                x = (winw - this.width) / 2

            } else {


                $('#win_mask3').show()

                l = $('#' + win).position().left
                t = $('#' + win).position().top

                y = (($('#' + win).height() - this.height) / 2) + t
                x = (($('#' + win).width() - this.width) / 2) + l
            }





            this.div = $('<div/>').css({'left': x + 'px', 'top': y + 'px', 'z-index': 406, 'display': 'block', 'width': this.width + 'px', 'height': this.height + 'px'}).addClass('win win_add_element_class').appendTo($('#windows'))
            $('<div/>').addClass('win_header').html('<div class="win_close"></div><div class="win_icon default"></div><div class="win_header_name">' + title + '</div>').appendTo(this.div)
            this.data = $('<div/>').addClass('win_data').appendTo(this.div)
            this.icon = $(this.div).find('div.win_icon')


            break;

    }

    switch (type) {
        case 'alert':


            //this.bb=$('<button/>').text('ok').appendTo(b)
            this.bb = $('<div/>').css({'float': 'right', 'margin-right': '10px'}).html('<a class="abutton" href="#"><div class="inner">ok</div></a>').appendTo(b)

            $(this.bb).find('a').click(jQuery.proxy(WIN, "e_return"));





            break;

        case 'prompt':
            /*
             this.bb=$('<button/>').text('no').appendTo(b)
             this.bb2=$('<button/>').text('ok').appendTo(b)
             */
            this.bb = $('<div/>').css({'float': 'right', 'margin-right': '20px'}).html('<a class="abutton" href="#"><div class="inner">cancel</div></a>').appendTo(b)
            this.bb2 = $('<div/>').css({'float': 'right', 'margin-right': '20px'}).html('<a class="abutton" href="#"><div class="inner">ok</div></a>').appendTo(b)


            $(this.bb).find('a').click(function() {
                WIN.e_return(false, key)
            });
            $(this.bb2).find('a').click(function() {
                WIN.e_return(true, key)
            });


            break;

    }


    $(this.div).find("div.win_header").mousedown(function() {
        w = $(this).parent()
        w.draggable({containment: 'parent', start: function(event, ui) {
                $("div.win").css("z-index", 398);
                $(this).css("z-index", 406);
            }, stop: function(event, ui) {
                w.draggable("destroy");

            }});
    });


    this.setPosition = function(win, dim) {

        $('#win_mask3').show()
        this.winParent = win
        l = $('#' + win).position().left
        t = $('#' + win).position().top
        this.height = dim.h
        this.width = dim.w
        y = (($('#' + win).height() - this.height) / 2) + t
        x = (($('#' + win).width() - this.width) / 2) + l

        $(this.div).find('div.pop_win_data').height(this.height - 25).addClass(dim.wdclass)

        $(this.div).css({'width': this.width + 'px', 'height': this.height + 'px', 'left': x + 'px', 'top': y + 'px', 'z-index': 406});
    },
            this.zindex = function() {
        $("div.win").css("z-index", 398);
        $(this.div).css("z-index", 406);

    }
    this.setid = function(id) {
        $('#win_mask3').hide()
        $('#win_mask2').show()
        this.win_name = id
        $(this.div).attr("id", "win_name_" + id);
    }

    this.setpid = function(id) {
        $(this.div).attr("id", "pop_" + id);
    }

    this.loading = function(key) {

        if (key) {
            $(this.div).find('div.win_icon').addClass('deviceLoader').removeClass('default');

        }
        else {

            $(this.div).find('div.win_icon').removeClass('deviceLoader').addClass('default');
        }


    }



    this.animatedClose = function(mask) {


        win = this.div


//        $(this.div).css("z-index",407).removeClass('win').addClass('win2');	
        $('#' + this.winParent).css("z-index", 406)

        this.aw = $(win).width()
        this.ah = $(win).height()

        $(win).animate({
            left: '+=' + this.aw / 2,
            top: '+=' + this.ah / 2,
            height: "1%",
            width: "1%",
            opacity: 0.3
        }, {
            duration: 300,
            complete: function() {

                $(this).remove()
                if (!mask) {
                    $('#win_mask3').hide()
                    $('#win_mask5').hide()
                }


            }
        });

        /*
         console.log('closing')
         win = this.div
         $(this.div).css("z-index", 406)
         $(win).css('text-indent','0px')
         var aw = $(win).width()
         this.ah = $(win).height()
         
         $(win).animate({
         textIndent:90,
         
         }, {
         step:function(now,fx){
         
         $(this).css({
         '-moz-transform':'rotate('+now+'deg)',
         '-webkit-transform':'rotate('+now+'deg)',
         'transform':'rotate('+now+'deg)'
         }); 
         
         
         },
         duration: 400,
         complete: function() {
         $(this).css("z-index", 397)
         $(this).animate({
         top:'-'+aw+'px',
         opacity:0.4,
         
         }, {
         duration: 400,
         complete: function() {
         $(this).remove()
         $('#win_mask3').hide()
         $('#win_mask5').hide()
         
         }
         
         });
         
         
         
         
         
         }
         },'linear');
         
         */
    },
            this.remove = function(mask) {
        this.animatedClose(mask)
        if (this.win_name == 'ip_vps') {
            $('#win_mask2').hide()

        }

    }


}