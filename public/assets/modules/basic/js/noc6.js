//IE dont have console
if (typeof window.console == 'undefined')
    console = {
        log: function() {
        },
        info: function() {
        },
        warn: function() {
        }
    };


$(document).ready(function() {

    /*
     * fff
     * */

    NOC.init()






// automake numbers of rack
    $(window).mouseup(function(e) {

        SEARCH.docmouseup(e)

        if (CAGE.drag) {
            CAGE.stopDrag()
        }

        if (RACK.pdumove)
            RACK.pdustopDrag()



        if (CAGE.screw) {
            $(CAGE.screw).show()
        }

    });





});

var HEADER = {
    init: function() {
//add room menu
        $('#headmenu_room').html(
                '<a class="menu_a" id="room_action" href="#">' +
                '<div class="icon_menu"><div class="icons head_action"></div>&nbsp;</div>' +
                '</a>' +
                '<ul style="display: none;" class="sub_menu">' +
                '<li class="sub_menu_div"><a class="rack_click" href="#"><div>Add new Rack</div></a></li>' +
                '</ul>'
                )

        $('a.rack_click').click(function() {

            RACK.new_r()

        });




        this.first = false;
        this.getdata()

    },
    currentRoom: function() {


        this.makeNavData(RACK.header[0], RACK.header[1], RACK.header[2])
        this.bid = RACK.header[0];
        this.fid = RACK.header[1];
        this.rid = RACK.header[2];

        $('#room_reload').hide()
    },
    navclick: function(d) {
        u = undefined;

        t = $(d).attr('t')
        i = $(d).attr('i')
        switch (t) {
            case 'a':
                if (i == 'new') {
                    RACK.new_r()
                }
                if (i == 'back') {
                    HEADER.currentRoom()


                }
                break;
            case 'b':
                if (i != this.bid) {
                    this.bid = i
                    this.fid = u
                    this.rid = u
                    this.makeNavData(i, u, u, true)
                }

                break;
            case 'f':
                if (i != this.fid) {
                    this.fid = i
                    this.rid = u
                    this.makeNavData(this.bid, i, u, true)
                }
                break;

            case 'r':
                if (i != this.rid) {
                    this.rid = i
                    this.makeNavData(this.bid, this.fid, i, true)
                }
                break;


        }

    },
    updateRoom: function(rid) {

        WIN.close('#win_device')
        if (typeof CABLE != 'undefined') {
            if (CABLE.mode) {
                if (rid != undefined) {

                    CABLE.plot()
                }
            }
            else {

                if (rid != undefined) {

                    RACK.init();
                    if (!this.first) {
                        CAGE.init();
                        this.first = true;
                    }


                }
            }
        }

        else {
            if (rid != undefined) {

                RACK.init();
                if (!this.first) {
                    CAGE.init();
                    this.first = true;
                }


            }

        }


    },
    makeNavData: function(key, f_key, r_key, uprom) {

        if (uprom == undefined) {
            uprom = true
        }

        div = $('#building_nav')
        div.html('')
//building

        $('<li></li>').addClass('menu_div menu_ico menu_building').css('margin-left', '10px').appendTo(div)

        b = $('<li></li>').addClass('menu_div').appendTo(div)
        b_a = $('<a/>').addClass('menu_a').attr('href', '#').appendTo(b)
        $('<div/>').addClass('menu_name').appendTo(b_a)
        b_ul = $('<ul/>').addClass('sub_menu').appendTo(b)
//arrow
//$('<li></li>').addClass('menu_div menu_arrow').appendTo(div)
//$('<li></li>').addClass('menu_div').html('<a href="#"><div class="menu_name">>></div></a>').appendTo(div)

//floor
        $('<li></li>').addClass('menu_div menu_ico menu_floor').appendTo(div)

        f = $('<li></li>').addClass('menu_div').appendTo(div)
        f_a = $('<a/>').addClass('menu_a').attr('href', '#').appendTo(f)
        $('<div/>').addClass('menu_name').appendTo(f_a)
        f_ul = $('<ul/>').addClass('sub_menu').appendTo(f)

//arrow

        $('<li></li>').addClass('menu_div menu_ico menu_room').appendTo(div)
//$('<li></li>').addClass('menu_div').html('<a href="#"><div class="menu_name">>></div></a>').appendTo(div)

//room
        r = $('<li></li>').addClass('menu_div').appendTo(div)
        r_a = $('<a/>').addClass('menu_a').attr('href', '#').appendTo(r)
        $('<div/>').addClass('menu_name').appendTo(r_a)
        r_ul = $('<ul/>').addClass('sub_menu').appendTo(r)

//arrow
//$('<li></li>').addClass('menu_div menu_arrow').appendTo(div)

//$('<li></li>').addClass('menu_div').html('<a href="#"><div class="menu_name" style="width:10px;">&nbsp;</div></a>').appendTo(div)



        /*
         a=$('<li></li>').addClass('menu_div').appendTo(div)
         a_a=$('<a/>').attr('id','room_action').addClass('menu_a').attr('href','#').appendTo(a)
         $('<div/>').addClass('icon_menu').html('<div class="icons head_action"></div>').appendTo(a_a)
         a_ul=$('<ul/>').addClass('sub_menu').appendTo(a)
         
         
         li=$('<li></li>').addClass('sub_menu_div').appendTo(a_ul)
         li_a=$('<a/>').attr({'href':'#','t':'a','i':'new'}).appendTo(li)
         d=$('<div/>').appendTo(li_a)
         $(d).html('add new rack')
         */
        /*
         a=$('<li></li>').attr('id','room_reload').css('display','none').addClass('menu_div').appendTo(div)
         a_a=$('<a/>').addClass('menu_a').attr('href','#').appendTo(a)
         $('<div/>').addClass('icon_menu').html('<div class="icons head_reload"></div>').appendTo(a_a)
         a_ul=$('<ul/>').addClass('sub_menu').appendTo(a)
         
         
         li=$('<li></li>').addClass('sub_menu_div').appendTo(a_ul)
         li_a=$('<a/>').attr({'href':'#','t':'a','i':'back'}).appendTo(li)
         d=$('<div/>').appendTo(li_a)
         $(d).html('current room')
         */


        $.each(this.navdata, function(i, item) {		//buildings
            if (key == undefined) {
                key = item.id
                HEADER.bid = key
            }

            if (key == item.id) {
                $(b_a).find('div').html(item.name)


                if (item.floors.length == 0) {
                    $(f_a).find('div').html('<span class="notset">not set</span>')
                    $(r_a).find('div').html('<span class="notset">not set</span>')
                    $('#room_action').hide()
                }


                //get floors
                $.each(item.floors, function(ii, floor) {		//floors
                    if (f_key == undefined) {
                        f_key = floor.id;
                        HEADER.fid = f_key
                    }
                    if (f_key == floor.id) {

                        $(f_a).find('div').html(floor.name)

                        if (floor.rooms.length == 0) {
                            $('#room_action').hide()
                            $(r_a).find('div').html('<span class="notset">not set</span>')
                        }

                        //get rooms
                        $.each(floor.rooms, function(ii, room) {		//floors
                            if (r_key == undefined) {
                                r_key = room.id;
                                HEADER.rid = r_key
                            }
                            if (r_key == room.id) {

                                $('#room_action').show()
                                $(r_a).find('div').html(room.name)

                            }
                            li = $('<li></li>').addClass('sub_menu_div').appendTo(r_ul)
                            li_a = $('<a/>').attr({'href': '#', 't': 'r', 'i': room.id}).appendTo(li)
                            d = $('<div/>').appendTo(li_a)
                            $(d).html(room.name)


                        });






                    }
                    li = $('<li></li>').addClass('sub_menu_div').appendTo(f_ul)
                    li_a = $('<a/>').attr({'href': '#', 't': 'f', 'i': floor.id}).appendTo(li)
                    d = $('<div/>').appendTo(li_a)
                    $(d).html(floor.name)




                });



            }



            li = $('<li></li>').addClass('sub_menu_div').appendTo(b_ul)
            li_a = $('<a/>').attr({'href': '#', 't': 'b', 'i': item.id}).appendTo(li)
            d = $('<div/>').appendTo(li_a)
            $(d).html(item.name)




        });

        this.setNavAction()
        if (uprom)
            this.updateRoom(r_key)
    },
    setLogoAction: function() {

        $("ul.menu_noc li").mouseover(function() {
            $(this).parent().find("ul.sub_menu").show()
            $(this).parent().hover(function() {
            }, function() {
                $(this).parent().find("ul.sub_menu").slideUp('fast'); //When the mouse hovers out of the subnav, move it back up  
            });

        });


    },
    setNavAction: function() {

        NOC.setNavAction();



        $("#building_nav li.sub_menu_div a").click(function() {

            HEADER.navclick(this);

        });

        NOC.tooltipset()
    },
    getdata: function() {
        $.postJSON('basic/ajax/headnav', function(data) {

            if (data.license) {

                WIN.show('#win_license')
                HEADER.setLogoAction();



            } else {
                HEADER.navdata = data
                HEADER.makeNavData();
            }
        });


    }



}




var ELEMENT = {
    _checkbox: function(d) {

        atr = Number($(d).attr('act'))

        m = $(d).find('div.icons')[0]


        if (atr == 0) {

            $(d).attr('act', 1)
            $(m).addClass('active')
            a = 1;
        } else {
            $(d).attr('act', 0)
            $(m).removeClass('active')

            a = 0;
        }

        return a;
    }


}








var RAID = {
    init: function(d) {

        this.set = true
        this.inp = $('#win_raid select.raid_size')

        for (i = 0; i <= 64; i++) {
            $('<option/>').val(i).html(i).appendTo(this.inp)

        }
        
        this.row = 0
        this.add = 0
        this.data = false
        this.select = false

        this.sel = $('#win_raid select.raid_type')
        this.tot = $('#win_raid input.raid_total')
        this.tab = $('#win_raid div.disc_table')

        this.tot.numeric();
        this.tot.addClass('disabled');
        this.ctot = 0;

        this.sel.change(function() {
            v = $(this).val()
            $.postJSON('basic/device/raid/type', {'eid': eid, 'type': v, 'tmp': RAID.tmp}, function(json) {

            });

            RAID.updateValue()


        });

        this.inp.change(function(e) {

            //$('<div></div>').addClass('disk_id').html('<div class="wnums">'+c+'.</div>').appendTo(div)
            //$('<div></div>').addClass('hdd_detail').appendTo(div)

            v = $(this).val()
            if (v.length < 0) {
                $(this).val(RAID.size)

            } else {
                RAID.setsize(v)

            }
        });

        
        $('#win_raid_layer1 div.edit_action li').click(function(){
            switch(Number($(this).attr('m'))){
                case 1:
                    RAID.win_new_hdd()
                    break;
            }
        });
        
    },
    updateValue: function() {

        winp = $(this.div).parent().find('input')

        if (this.sel.val() > 1) {

            r = this.sel.find('option:selected').text() + ', discs:' + this.inp.val() + ', cap:' + RAID.ctot + ' GB'

        } else {
            r = 'Raid:none, discs:' + this.inp.val() + ', cap:' + RAID.ctot + ' GB'
        }

        winp.val(r)

    },
    setsize: function(s) {
        if (s != this.size) {

            WIN.show('#win_raid')

            $('#win_raid div.win_data').append($('<div/>').addClass('dataLoad').html('loading data..'))
            if (s > 50)
                s = 50;

            $.postJSON('basic/device/raid/size', {'eid': eid, 'size': s, 'tmp': RAID.tmp}, function(json) {
                RAID.make(json)
            });

            this.updateValue()
            RAID.last = 0

        }
    },
    remove: function(obj) {

        $.postJSON('basic/device/raid/delete', {'eid': 80, 'rid': obj.attr('row'), 'type': 2, 'val': 50, 'tmp': false}, function(json) {
            obj.remove();
            RAID.size--;
            RAID.settotal();
            
            $.postJSON('basic/device/raid/get', {'eid': eid, 'tmp': RAID.tmp}, function(json) {
                RAID.make(json)
            });
        });
    },
    settotal: function() {

        RAID.ctot = 0;

        $.each($(RAID.tab).find('.dsize'), function() {
            if ($(this).val() != '') {
                RAID.ctot += Number($(this).val());
            }
        });

        if (RAID.ctot != this.total) {

            $('#win_raid div.win_mask').show()

            $('#win_raid div.win_data').append($('<div/>').addClass('dataLoad').html('loading data..'))
            
            console.log("total " + RAID.ctot)
            
            $.postJSON('basic/device/raid/total', {'eid': eid, 'total': RAID.ctot, 'tmp': RAID.tmp}, function(json) {
                RAID.make(json)
            });

            this.updateValue()

        }

    },
    open: function(d, tmp, data) {

        this.div = d
        this.tmp = tmp

        RAID.data = true;

        if (typeof data !== 'undefined') {
            eid = data.id
            RAID.data = data
        }
        else {
            RAID.data = false;
            eid = $(d).parent().parent().attr('eid')
        }

        WIN.show('#win_raid')
        $('#win_raid div.win_mask').show()
        //$('#win_raid div.win_layer').removeClass('win_visible');
        $('#win_raid div.win_data').append($('<div/>').addClass('dataLoad').html('loading data..'))

        $.postJSON('basic/device/raid/get', {'eid': eid, 'tmp': tmp}, function(json) {
            RAID.make(json)
        });
    },
    addRow: function(d, div, c) {

        RAID.row = d.id;

        div = $(div).addClass('row').attr('row', d.id)
        $('<div></div>').addClass('disk_id').html('<div class="wnums">' + c + '.</div>').appendTo(div)
        $('<div></div>').addClass('hdd_detail').appendTo(div)

        $('<div></div>').addClass('cell').html(
                '<fieldset><legend>VPort:</legend><input class="vport" placeholder="none" n="1" value="' + d.port + '">' +
                '</fieldset><fieldset><legend>Size:</legend><input class="dsize" placeholder="-" n="2" value="' + d.size + '">' +
                '</fieldset>').appendTo(div);

        $('<div></div>').addClass('cell').html('<fieldset><legend>Model / Type:</legend>' +
                '<input class="dmodel" placeholder="model/type" n="3" value="' + d.model + '"></fieldset>' +
                '<fieldset><legend>Serial Number:</legend><input class="dsn" placeholder="S/N" n="4" value="' + d.sn + '">' +
                '</fieldset>').appendTo(div);

        $('<div class="remove icons"></div><div class="clear:both"></div>').appendTo(div)
        $(div).appendTo(this.tab);
    },
    make: function(json) {
        if (!this.set)
            this.init()
        this.id = json.eid;

        $('#win_raid div.dataLoad').remove()

        //$('#win_raid_layer1').addClass('win_visible');
        //$('#win_raid div.win_menu li').removeClass('aktive')
        //$('#win_raid div.win_menu li:first').addClass('aktive')

        this.type = json.type
        this.size = json.size
        this.total = json.total

        this.sel.val(json.type)
        this.inp.val(json.size)

        this.tab.html('')

        $.each(json.items, function(i, e) {

            div = $('<div></div>')
            RAID.addRow(e, div, i + 1)

            div.appendTo(RAID.win)

        });

        RAID.ctot = 0;

        $.each($(this.tab).find('.dsize'), function() {
            if ($(this).val() != '') {
                RAID.ctot += Number($(this).val());
            }
        });

        this.tot.val(RAID.ctot)
        this.updateValue()

        addhdd = $('<div></div>').html(
                '<fieldset class="newdiscadd" tab="2">' +
                '<legend class="fieldmenu"><span class="anew">Add new disc</span></legend>' +
                '<div class="add_element"><div class="icons"></div></div></fieldset>').appendTo(this.tab)

        $('.newdiscadd').bind('click', function() {
            RAID.setsize(RAID.size + 1)
        });

        $('.row .remove').click(function() {
            RAID.remove($(this).parent());
        });
        
        if (RAID.data) {
            
            rid = this.data.rid
            wid = $('#win_raid div.disc_table').closest('.win_layer').attr('id')
            wid = wid.substring(wid.length - 1, wid.length)

            $('#win_raid div.win_menu').find('li[layout="' + wid + '"]').click()

            row = $('#win_raid').find('div[row="' + rid + '"]')
            pos=0
            $.each(json.items,function(k,v) {
                if(v.id == row.attr('row'))
                   pos=k;
            });
            
            $('#win_raid .win_data').scrollTop(pos*100)
            row.addClass('active');
        }

        $('#win_raid div.win_mask').hide()
        $(this.tab).find('input').bind('blur focus keydown', function(e) {

            //enter pressed
            if (e.type == 'keydown') {
                if (e.keyCode == 13) {
                    $(this).blur()
                }
            }


            if (e.type == 'focus')
                $(this).addClass('focused')

            if (e.type == 'blur') {

                $(this).removeClass('focused')

                v = $(this).val()
                //id of data
                rid = $(this).parents('.row').attr('row')
                type = $(this).attr('n')

                $.postJSON('basic/device/raid/set', {'eid': RAID.id, 'rid': rid, 'type': type, 'val': v, 'tmp': RAID.tmp}, function(json) {

                });
                RAID.settotal();
            }

        });

        //m='<tr><td><input class="size_small" value="p"></td><td><input class="size_small2" value="279.39 GB"></td><td><input class="size_large" value="SEAGATE ST3300657SS"></td></tr>'
    }, 

    setsize2: function(data, pop) {
        
        RAID.ctot = RAID.size + data.val
        
        $.postJSON('basic/device/raid/new', {
            'eid': data.eid,
            'val': RAID.ctot,
            'vport': data.vport,
            'dsize': data.dsize,
            'dmodel': data.dmodel,
            'dsn': data.dsn,
            'tmp': RAID.tmp
        }, function(json) {
            RAID.make(json)
            RAID.settotal()
            pop.win.remove()
        });
        
    },
    
    getWinField: function(win, type) {
        var fields={}
        $.each($(win).find(type),function(i,e) {
            fields[$(e).attr('class')]=$(e).val()
        })
        return fields
    },
    
    win_new_hdd: function() {

        var pop = new POPUP.init(
                'Add HDD/RAID', //popup title
                'win_add_hdd', //popup name
                'win_raid', //parent window
                {
                    w: 350, //width 
                    h: 330, //height
                    wdclass: 'orange2'
                })

        var args = {
            save: false, //save button
            rem: false, //remove button
            cancel: true, //cancel
            add: true, //add
        }

        pop.data(
                args,
                '<div class="win_data" style="height:400px;">'
                + '<div class="win_layer win_visible">'
                + '<div class="datadiv" style="width:260px;">'
        	+ '<fieldset class="dta"><legend>Discs to add:</legend><select class="discs_to_add"></select></fieldset>'
                + '<fieldset><legend>VPort:</legend><input class="vport" placeholder="none" n="1" value="">'
                + '</fieldset><fieldset><legend>Size:</legend><input class="dsize" placeholder="-" n="2" value="">'
                + '</fieldset><fieldset><legend>Model / Type:</legend><input class="dmodel" placeholder="model/type" n="3" value="">'
                + '</fieldset><fieldset><legend>Serial Number:</legend><input class="dsn" placeholder="S/N" n="4" value="">'
                + '<fieldset style="position:absolute;bottom:10px;right:10px;"><legend></legend>'
                + '</div>'
                + '</div>'
                );

         for (i = 0; i <= 32; i++) 
            $('<option/>').val(i).html(i).appendTo($('#pop_win_add_hdd .discs_to_add'))

         $('#pop_win_add_hdd .dsize').numeric();

        pop.actionSet('win_rack', ['close', 'cancel'], function() {
            
            pop.win.remove()
        });

        pop.actionSet('windows', ['add'], function() {

            var fields = RAID.getWinField('#pop_win_add_hdd', 'input')
            var val = Number($('#pop_win_add_hdd .discs_to_add').val())
            
            RAID.setsize2({
                'eid': RAID.id,
                'val': val,
                'vport': fields['vport'],
                'dsize': fields['dsize'],
                'dmodel': fields['dmodel'],
                'dsn': fields['dsn'],
                'tmp': RAID.tmp
            },pop)
            
        });

    }

}





var RAM = {
    init: function(d) {
        this.set = true

        this.tot = $('#win_ram input.ram_total')
        this.tot.addClass('disabled');
        this.tot.numeric();
        
        this.ctot = 0;
        this.row = 0
        this.add = 0
        this.data = false
        this.select = false
        
        this.sel = $('#win_ram select.ram_type')
        this.tab = $('#win_ram div.ram_table')

        this.inp = $('#win_ram select.ram_size')
        this.mta = $('#win_ram select.modules_to_add')

        for (i = 0; i <= 32; i++)
            $('<option/>').val(i).html(i).appendTo(this.inp)

        $('<option>').val('0').html('Choose...').appendTo(this.mta)
        for (i = 0; i <= 32; i++)
            $('<option/>').val(i).html(i).appendTo(this.mta)    

        this.sel.change(function() {
            v = $(this).val()
            $.postJSON('basic/device/ram/type', {'eid': eid, 'type': v, 'tmp': RAM.tmp}, function(json) {

            });

            RAM.updateValue()


        });



        this.inp.change(function(e) {


            v = $(this).val()
            if (v.length < 0) {
                $(this).val(RAM.size)

            } else {
                RAM.setsize(v)

            }


        });

        $('#win_ram_layer1 div.edit_action li').click(function() {
            switch (Number($(this).attr('m'))) {
                case 1:
                    RAM.win_new_ram(this);
                    break;
            }
        });
        
    },
    updateValue: function() {

        winp = $(this.div).parent().find('input')

        if (this.sel.val() > 1) {
            r = this.sel.find('option:selected').text() + ', modules:' + this.inp.val() + ', cap:' + this.tot.val() + ' MB'
        } else {
            r = 'Ram: none, modules:' + this.inp.val() + ', cap:' + this.tot.val() + ' MB'
        }

        winp.val(r)

    },
    setsize: function(s) {
        if (s != this.size) {
            $('#win_ram div.win_mask').show()

            $('#win_ram div.win_data').append($('<div/>').addClass('dataLoad').html('loading data..'))
            //if(s>50) s=50;	

            $.postJSON('basic/device/ram/size', {'eid': eid, 'size': s, 'tmp': RAM.tmp}, function(json) {
                RAM.make(json)
            });

            this.updateValue()

        }

    },         
    remove: function(obj) {

        $.postJSON('basic/device/ram/delete', {'eid': 9, 'rid': obj.attr('row'), 'type': 2, 'val': 50, 'tmp': false}, function(json) {
            obj.remove();
            RAM.size--;
            RAM.settotal();
            
            $.postJSON('basic/device/ram/get', {'eid': eid, 'tmp': RAM.tmp}, function(json) {
                RAM.make(json)
            });
        });
    },           
    settotal: function() {

        RAM.ctot = 0;
        $.each($(RAM.tab).find('.dsize'), function() {
            if ($(this).val() != '') {
                RAM.ctot += Number($(this).val());
            }
        });

        if (RAM.ctot != this.total) {
            $('#win_ram div.win_mask').show()

            $('#win_ram div.win_data').append($('<div/>').addClass('dataLoad').html('loading data..'))
            //if(s>100) s=100;	

            $.postJSON('basic/device/ram/total', {'eid': eid, 'total': RAM.ctot, 'tmp': RAM.tmp}, function(json) {
                RAM.make(json)
            });

            this.updateValue()

        }

    },
    open: function(d, tmp, data) {
        this.div = d
        this.tmp = tmp
        eid = $(d).parent().parent().attr('eid')

        RAM.data = true;

        if (typeof data !== 'undefined') {
            eid = data.id
            RAM.data = data
        }
        else {
            RAM.data = false;
            eid = $(d).parent().parent().attr('eid')
        }

        WIN.show('#win_ram')

        $('#win_ram div.win_mask').show()
        $('#win_ram div.win_data').append($('<div/>').addClass('dataLoad').html('loading data..'))

        $.postJSON('basic/device/ram/get', {'eid': eid, 'tmp': RAM.tmp}, function(json) {
            RAM.make(json)
        });





    },
    addRow: function(d, tr, c) {

        RAM.row = d.id;

        div = $(div).addClass('row').attr('row', d.id)
        $('<div></div>').addClass('disk_id').html('<div class="wnums">' + c + '.</div>').appendTo(div)
        $('<div></div>').addClass('mem_detail').appendTo(div)

        $('<div></div>').addClass('cell').html(
                '<fieldset><legend>VPort:</legend><input class="vport" placeholder="none" n="1" value="' + d.port + '">' +
                '</fieldset><fieldset><legend>Size:</legend><input class="dsize" placeholder="-" n="2" value="' + d.size + '">' +
                '</fieldset>').appendTo(div);

        $('<div></div>').addClass('cell').html('<fieldset><legend>Model / Type:</legend>' +
                '<input class="dmodel" placeholder="model/type" n="3" value="' + d.model + '"></fieldset>' +
                '<fieldset><legend>Serial Number:</legend><input class="dsn" placeholder="S/N" n="4" value="' + d.sn + '">' +
                '</fieldset>').appendTo(div);

        $('<div class="remove icons"></div><div class="clear:both"></div>').appendTo(div)
        $(div).appendTo(this.tab);

    },
    make: function(json) {
        if (!this.set)
            this.init()
        this.id = json.eid;

        $('#win_ram div.dataLoad').remove()


        this.type = json.type
        this.size = json.size
        this.total = json.total

        this.sel.val(json.type)
        this.inp.val(json.size)

        this.tab.html('')

        $.each(json.items, function(i, e) {


            div = $('<div></div>')
            RAM.addRow(e, div, i + 1)

            div.appendTo(RAM.win)

        });


        RAM.ctot = 0;

        $.each($(this.tab).find('.dsize'), function() {
            if ($(this).val() != '') {
                RAM.ctot += Number($(this).val());
            }
        });

        this.tot.val(RAM.ctot)
        this.updateValue()

        $('<div></div>').html(
        '<fieldset class="newmoduleadd" tab="2">' +
        '<legend class="fieldmenu"><span class="anew">Add new module</span></legend>' +
        '<div class="add_element"><div class="icons"></div></div></fieldset>').appendTo(this.tab)

        $('.newmoduleadd').bind('click', function() {
            RAM.setsize(RAM.size + 1)
        });

        $('.row .remove').click(function() {
            RAM.remove($(this).parent());
        });

        if (RAM.data) {
            rid=this.data.rid

            wid=this.tab.closest('.win_layer').attr('id')
            wid=wid.substring(wid.length - 1, wid.length)

            $('#win_ram div.win_menu').find('li[layout="' + wid + '"]').click()
            
            row=$('#win_ram').find('div[row="' + rid + '"]')
            pos=0
            $.each(json.items,function(k,v) {
                if(v.id == row.attr('row'))
                   pos=k;
            });
            
            $('#win_ram .win_data').scrollTop(pos*100)

            row.addClass('active');
        }

        $('#win_ram div.win_mask').hide()

        $(this.tab).find('input').bind('blur focus keydown', function(e) {

            //enter pressed
            if (e.type == 'keydown') {
                if (e.keyCode == 13) {
                    $(this).blur()
                }
            }


            if (e.type == 'focus')
                $(this).addClass('focused')

            if (e.type == 'blur') {

                $(this).removeClass('focused')

                v = $(this).val()
                //id of data
                rid = $(this).parents('.row').attr('row')
                type = $(this).attr('n')
                
                $.postJSON('basic/device/ram/set', {'eid': RAM.id, 'rid': rid, 'type': type, 'val': v, 'tmp': RAM.tmp}, function(json) {

                });

                RAM.settotal();
            }


        });

    },
    setsize2: function(data, pop) {
        
        RAM.ctot = RAM.size + data.val
        
        $.postJSON('basic/device/ram/new', {
            'eid': data.eid,
            'val': RAM.ctot,
            'vport': data.vport,
            'dsize': data.dsize,
            'dmodel': data.dmodel,
            'dsn': data.dsn,
            'tmp': RAM.tmp
        }, function(json) {
            RAM.make(json)
            RAM.settotal()
            pop.win.remove()
        });
        
    },
    
    getWinField: function(win, type) {
        var fields={}
        $.each($(win).find(type),function(i,e) {
            fields[$(e).attr('class')]=$(e).val()
        })
        return fields
    },
    
    win_new_ram: function(div) {

        var pop = new POPUP.init(
                'Add RAM', //popup title
                'win_add_ram', //popup name
                'win_ram', //parent window
                {
                    w: 350, //width 
                    h: 330, //height
                    wdclass: 'orange2'
                })

        var args = {
            save: false, //save button
            rem: false, //remove button
            cancel: true, //cancel
            add: true, //add
        }

        pop.data(
                args,
                '<div class="win_data" style="height:400px;">'
                + '<div class="win_layer win_visible">'
                + '<div class="datadiv" style="width:260px;">'
        	+ '<fieldset class="dta"><legend>Modules to add:</legend><select class="discs_to_add"></select></fieldset>'
                + '<fieldset><legend>VPort:</legend><input class="vport" placeholder="none" n="1" value="">'
                + '</fieldset><fieldset><legend>Size:</legend><input class="dsize" placeholder="-" n="2" value="">'
                + '</fieldset><fieldset><legend>Model / Type:</legend><input class="dmodel" placeholder="model/type" n="3" value="">'
                + '</fieldset><fieldset><legend>Serial Number:</legend><input class="dsn" placeholder="S/N" n="4" value="">'
                + '<fieldset style="position:absolute;bottom:10px;right:10px;"><legend></legend>'
                + '</div>'
                + '</div>'
                );

         for (i = 0; i <= 32; i++) 
            $('<option/>').val(i).html(i).appendTo($('#pop_win_add_ram .discs_to_add'))

        $('#pop_win_add_ram .dsize').numeric();

        pop.actionSet('win_ram', ['close', 'cancel'], function() {
            
            pop.win.remove()
        });

        pop.actionSet('windows', ['add'], function() {

            var fields = RAM.getWinField('#pop_win_add_ram', 'input')
            var val = Number($('#pop_win_add_ram .discs_to_add').val())
            
            RAM.setsize2({
                'eid': RAM.id,
                'val': val,
                'vport': fields['vport'],
                'dsize': fields['dsize'],
                'dmodel': fields['dmodel'],
                'dsn': fields['dsn'],
                'tmp': RAM.tmp
            },pop)
            
        });

    }

}


var BUILDING = {
    init: function() {

        if (!this.loaded) {
            this.loaded = true;
            this.settree();
        }

    },
    getObject: function(id, rel) {

        sameid = getObjects(HEADER.navdata, "id", id)
        m = getObjects(sameid, "rel", rel)

        return m[0]



    },
    getNavOb: function(obj) {

        rel = $(obj).attr('rel')
        id = $(obj).attr('id').replace(rel + '_', '')
        return this.getObject(id, rel);


    },
    getNavParentOb: function(obj) {

        rel = $(obj).parent().parent().attr('rel')
        id = $(obj).parent().parent().attr('id').replace(rel + '_', '')
        return this.getObject(id, rel);

    },
    createData: function(val) {
        //attributes
        rel = $(val).attr('rel')
        id = $(val).attr('id').replace(rel + '_', '')
        n = $(val).find('a:first').text()


        //new object data
        data = new Object();
        data.name = n.substring(1, n.length)
        data.id = id
        data.rel = rel
        return data

    },
    removeByValue: function(arr, val) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == val) {

                arr.splice(i, 1);
                break;
            }
        }
   },
    updateHeadNav: function(c, val) {

        upset = false
        rel = $(val).attr('rel')
        //switch action	
        switch (c) {
            case 'create':
                data = this.createData(val)
                switch (rel) {
                    //switch action rel
                    case 'building':
                        data.floors = Array();
                        HEADER.navdata.push(data)

                        break;
                    case 'floor':
                        data.rooms = Array();
                        p = this.getNavParentOb(val)
                        p.floors.push(data)

                        break;
                    case 'room':
                        p = this.getNavParentOb(val)
                        p.rooms.push(data)

                        break;


                }


                break;
            case 'rename':
                data = this.createData(val)
                p = this.getNavOb(val)
                p.name = data.name


                break;

            case 'remove':

                rel = val.rslt.obj.attr('rel')


                switch (rel) {
                    case 'building':
                        bid = val.rslt.obj.attr('id').replace('building_', '')
                        if (HEADER.bid == bid) {
                            HEADER.bid = undefined;
                            HEADER.fid = undefined;
                            HEADER.rid = undefined;
                            upset = true
                        }

                        p = HEADER.navdata


                        break;
                    case 'floor':

                        fid = val.rslt.obj.attr('id').replace('floor_', '')
                        if (HEADER.fid == fid) {

                            HEADER.fid = undefined;
                            HEADER.rid = undefined;
                            upset = true
                        }

                        pt = this.getNavOb(val.rslt.parent)
                        p = pt.floors

                        break;
                    case 'room':

                        rid = val.rslt.obj.attr('id').replace('room_', '')
                        if (HEADER.rid == rid) {
                            HEADER.rid = undefined;
                            upset = true
                        }


                        pt = this.getNavOb(val.rslt.parent)
                        p = pt.rooms

                        break;

                }

                o = this.getNavOb(val.rslt.obj)
                this.removeByValue(p, o)



                break;

        }

        HEADER.makeNavData(HEADER.bid, HEADER.fid, HEADER.rid, upset)


    },
    settree: function() {




        $("#building_tree")
                .bind("before.jstree", function(e, data) {
            $("#alog").append(data.func + "<br />");
        })
                .jstree({
            // List of active plugins
            "plugins": [
                "themes", "json_data", "ui", "crrm", "dnd", "types"
            ],
            // I usually configure the plugin that handles the data first
            // This example uses JSON as it is most common
            "json_data": {
                // This tree is ajax enabled - as this is most common, and maybe a bit more complex
                // All the options are almost the same as jQuery's AJAX (read the docs)
                "ajax": {
                    // the URL to fetch the data
                    "url": "./basic/building",
                    //type 
                    "type": 'POST',
                    // the `data` function is executed in the instance's scope
                    // the parameter is the node being loaded 
                    // (may be -1, 0, or undefined when loading the root nodes)
                    "data": function(n) {
                        // the result is fed to the AJAX request `data` option
                        return {
                            "rel": n.attr ? n.attr("rel") : 'root',
                            "id": n.attr ? n.attr("id").replace(n.attr("rel") + '_', '') : '0'
                        };
                    }
                }
            },
            // Using types - most of the time this is an overkill
            // read the docs carefully to decide whether you need types
            "types": {
                // I set both options to -2, as I do not need depth and children count checking
                // Those two checks may slow jstree a lot, so use only when needed
                "max_depth": -2,
                "max_children": -2,
                // I want only `drive` nodes to be root nodes 
                // This will prevent moving or creating any other type as a root node
                "valid_children": ["building"],
                "types": {
                    // The default type
                    "room": {
                        // I want this type to have no children (so only leaf nodes)
                        // In my case - those are files
                        "valid_children": "none",
                        // If we specify an icon for the default type it WILL OVERRIDE the theme icons
                        "icon": {
                            "image": "assets/img/icons.png",
                            "position": "-125px -75px"
                        }
                    },
                    // The `floor` type
                    "floor": {
                        // can have files and other folders inside of it, but NOT `drive` nodes
                        "valid_children": ["room"],
                        "icon": {
                            "image": "assets/img/icons.png",
                            "position": "-100px -75px"
                        }

                    },
                    // The `building` nodes 
                    "building": {
                        // can have files and folders inside, but NOT other `drive` nodes
                        "valid_children": ["floor"],
                        "icon": {
                            "image": "assets/img/icons.png",
                            "position": "-75px -75px"
                        },
                        // those prevent the functions with the same name to be used on `drive` nodes
                        // internally the `before` event is used
                        "start_drag": false,
                        "move_node": false,
                        "remove": false
                    }
                }
        },
            "core": {
                // just open those two nodes up
                // as this is an AJAX enabled tree, both will be downloaded from the server
                "initially_open": ["building_1", "floor_1"]
            }


        })
                .bind("create.jstree", function(e, data) {




            $.postJSON(
                    "/basic/building/create",
                    {
                        "id": data.rslt.parent != -1 ? data.rslt.parent.attr("id").replace(data.rslt.parent.attr("rel") + "_", "") : 0,
                        "position": data.rslt.position,
                        "title": data.rslt.name,
                        "type": data.rslt.obj.attr("rel")
                    },
            function(m) {


                if (m.status) {

                    $(data.rslt.obj).attr("id", '' + m.id);

                    BUILDING.updateHeadNav('create', data.rslt.obj)
                    
                    $.postJSON('basic/ajax/headnav', function(data) {

                                    HEADER.navdata = data
                                    
                            });

                }
                else {
                    $.jstree.rollback(data.rlbk);
                }
            }
            );

        })
                .bind("remove.jstree", function(e, data) {


            BUILDING.updateHeadNav('remove', data)

            $.postJSON(
                    "/basic/building/remove",
                    {
                        "id": data.rslt.obj.attr("id").replace(data.rslt.obj.attr("rel") +"_", ""),
                        "type": data.rslt.obj.attr("rel")
                    },
            function(r) {
                if (!r.status) {
                    data.inst.refresh();//		$.jstree.rollback(data.rlbk);
                } else {


                }
            }
            );

            //
        })
                .bind("rename.jstree", function(e, data) {

            if (data.rslt.new_name != data.rslt.old_name) {

                $.postJSON(
                        "/basic/building/rename",
                        {
                            "id": data.rslt.obj.attr("id").replace(data.rslt.obj.attr("rel") + "_", ""),
                            "title": data.rslt.new_name,
                            "type": data.rslt.obj.attr("rel")
                        },
                function(r) {
                    if (!r.status) {
                        $.jstree.rollback(data.rlbk);
                    } else {

                        BUILDING.updateHeadNav('rename', data.rslt.obj)

                    }

                }
                );
            }
        })
                .bind("select_node.jstree", function(e, data) {

            BUILDING.selected = data.rslt.obj
            rel = data.rslt.obj.attr('rel')

            switch (rel) {
                default:
                    //root
                    set = Array(true, false, false, false, false, false, false, false, false)
                    break;
                case 'building':
                    //building
                    set = Array(true, true, true, true, false, false, false, false, false)
                    break;
                case 'floor':
                    //floor
                    set = Array(true, false, false, false, true, true, true, false, false)
                    break;
                case 'room':
                    //room
                    set = Array(true, false, false, false, false, false, false, true, true)
                    break;
            }

            butt = $('#win_building div.win_button')

            $.each(butt, function(i, e) {

                if (set[i]) {
                    $(this).removeClass('disabled')
                } else {
                    $(this).addClass('disabled')
                }



            });


        })
                ;


        $('#win_building div.win_button').click(function() {

            dis = $(this).hasClass('disabled')
            if (!dis) {
                BUILDING.action(this);
            }



        });


    },
    action: function(d) {

        t = $(d).parent().attr('id')
        m = $(d).attr('m')
        switch (t) {
            case 'bul_act':


                break;
            case 'fl_act':

                break;
            case 'rm_act':

                break;

        }

        switch (m) {
            case '1':

                if (t == 'bul_act') {
                    w = -1;
                } else {
                    w = null;
                }




                $("#building_tree").jstree("create", w, "last", "enter name");

                break;

            case '2':

                $("#building_tree").jstree("rename");

                break;

            case '3':
                switch (t) {
                    case 'bul_act':
                        tx = 'building'
                        break;
                    case 'fl_act':
                        tx = 'room'
                        break;
                    case 'rm_act':
                        tx = 'floor'
                        break;

                }

                WIN.prompt('Warning', 'Huh, are you sure want to delete ' + tx + '? all data will be erased !', 0);




                break;


        }


    },
    remove: function() {
        $("#building_tree").jstree("remove");
    }

}


function grayscale(src) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var imgObj = new Image();
    imgObj.src = src;
    canvas.width = imgObj.width;
    canvas.height = imgObj.height;
    ctx.drawImage(imgObj, 0, 0);
    var imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (var y = 0; y < imgPixels.height; y++) {
        for (var x = 0; x < imgPixels.width; x++) {
            var i = (y * 4) * imgPixels.width + x * 4;
            var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
            imgPixels.data[i] = avg;
            imgPixels.data[i + 1] = avg;
            imgPixels.data[i + 2] = avg;
        }
    }
    ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
    return canvas.toDataURL();
}


function zipupload(e) {

    //var elid=$(e).parent().parent().parent().attr('eid')
    //var cont=$(e).parent().parent().find('div.img_container')
    var div = $(e).parent().parent().parent()
    var count = 0;
    var butt = $(e).parent()



    this.upload = new AjaxUpload($(e), {
        action: './basic/templates/upload',
        name: 'image',
        data: {
        },
        autoSubmit: true,
        responseType: 'json',
        onChange: function(file, ext) {
        },
        onSubmit: function(file, ext) {


            WIN.interval = setInterval(function() {
                count += 4;
                if (count > 60)
                    count = 0;
                $(div).css({'background-position': count + 'px 10px'});


            }, 50)
            $(div).addClass('upload_track')
            $(butt).hide()

            // Allow only images. 
            if (ext && /^(zip)$/i.test(ext)) {
                this.setData({
                });
            } else {
                $(div).removeClass('upload_track')
                if (WIN.interval)
                    clearInterval(WIN.interval)
                $(butt).show()

                alert('That is not ZIP archive !');
                return false;
            }
        },
        onError: function(file, r) {
            console.log(file, r)

        },
        onComplete: function(file, r) {


            $(butt).show()
            $(div).removeClass('upload_track')
            if (WIN.interval)
                clearInterval(WIN.interval)

            if (r.err == 'NO') {

                TEMPLATE.cat.val(r.category)

                m = new Object();
                m.data = r.templates
                m.nid = r.device

                TEMPLATE.loadSel(m)


            } else {

                alert(r.err)

            }

            /*
             if(r.status=='ok'){
             r.tmpl=tmp
             
             WIN.addImageField(cont[0],r)	
             }
             */


        }
    });



}



function imageupload(e, t) {

    var elid = $(e).parent().parent().parent().parent().parent().attr('eid')
    var cont = $(e).parent().parent().parent().parent().find('div.img_container')
    var div = $(e).parent().parent().parent()
    var count = 0;

    var tmp = t;

    var butt = $(e).parent()


    this.upload = new AjaxUpload($(e), {
        action: './basic/image/upload',
        name: 'image',
        data: {
        },
        autoSubmit: true,
        responseType: 'json',
        onChange: function(file, ext) {
        },
        onSubmit: function(file, ext) {


            WIN.interval = setInterval(function() {
                count += 4;
                if (count > 60)
                    count = 0;
                $(div).css({'background-position': count + 'px 0px'});


            }, 50)
            $(div).addClass('upload_track')
            $(butt).hide()

            // Allow only images. 
            if (ext && /^(jpg|png|jpeg|gif)$/i.test(ext)) {
                this.setData({
                    'key1': DEVICE.id,
                    'key2': elid,
                    'key3': tmp
                });
            } else {
                $(div).removeClass('upload_track')
                if (WIN.interval)
                    clearInterval(WIN.interval)
                $(butt).show()
                alert('not image');
                return false;
            }
        },
        onError: function(file, r) {

            console.log(file, r)
        },
        onComplete: function(file, r) {



            $(butt).show()
            $(div).removeClass('upload_track')
            if (WIN.interval)
                clearInterval(WIN.interval)

            if (r.status == 'ok') {
                r.tmpl = tmp

                WIN.addImageField(cont[0], r)
            }


        }
    });


}

var DOMAINS = {
    init: function() {
        this.table = $('#domaintable')
        $.postJSON('/basic/domain/ip', '', function(json) {

            DOMAINS.make(json)
        });

    },
    make: function(json) {


        this.table.html('')

        tr = $('<tr/>').addClass('head')
        $('<td/>').text('IP address').attr({'valign': 'top'}).appendTo(tr)
        $('<td/>').text('Hostname/Domain').attr({'valign': 'top'}).appendTo(tr)
        tr.appendTo(this.table)


        $.each(json.data, function(i, e) {

            tr = $('<tr/>')
            td1 = $('<td/>').text(e.ip).attr({'valign': 'top'}).appendTo(tr)
            td2 = $('<td/>').text(e.host).attr({'valign': 'top'}).appendTo(tr)
            tr.appendTo(DOMAINS.table)

            $.each(e.vps, function(ii, vps) {

                tr = $('<tr/>')
                td1 = $('<td/>').css('padding-left', '10px').text('-').attr({'valign': 'top'}).appendTo(tr)
                td2 = $('<td/>').text(vps.host).attr({'valign': 'top'}).appendTo(tr)
                tr.appendTo(DOMAINS.table)

                $.each(vps.ips, function(iii, ip) {

                    tr = $('<tr/>')
                    td1 = $('<td/>').css('padding-left', '20px').text(ip.data).attr({'valign': 'top'}).appendTo(tr)
                    td2 = $('<td/>').text('...').attr({'valign': 'top'}).appendTo(tr)
                    tr.appendTo(DOMAINS.table)
                });

            });



        });



    }


}

var SEARCH = {
    docmouseup: function(a) {

        $('#searchdata').hide()

   },
    tabs: function(data) {

        num = 0;
        $.each(data, function(a, item) {
            set = false
            if (item.items.length > 0) {
                $.each(item.items, function(i, d) {

                    t = ''
                    if (!set) {
                        t = item.type
                        set = true
                    }
                    
                    newTR = $('<tr id="s_tab' + num + '" ind="' + num + '" class="card" style="overflow:hidden;"></tr>')

                    td = $('<td/>').addClass('title').attr('t', item.tn).html(t).appendTo(newTR)
                    td2 = $('<td/>').html('<div itd="' + d.id + '" tab="' + d.tab + '" dev="' + d.dev + '" rack="' + d.rack + '" f="' + d.floor + '" b="' + d.building + '" room="' + d.room + '" rid="' + d.rid + '" class="data">'+d.name+'</div>').appendTo(newTR)

                    num++;
                    //td2=$('<td/>').attr(data.id).html(data.name).appendTo(newTR)



                    $(SEARCH.table).append(newTR)


                });
            }


        });

        if (num > 0)
            $('#searchdata').show()

        $(SEARCH.table).find('tr.card').hover(function(e) {
            $(SEARCH.table).find('tr.card').removeClass('over');
            $(this).addClass('over')
            SEARCH.index = Number($(this).attr('ind'))
        }, function(e) {
        }).click(function() {

            SEARCH.seek($(this).attr('ind'))
        });

    },
    gethandler: function(id) {
        p = new Object();


        p.m = $('#rack_unit' + id).find('div.handler')
        p.dev = $('#rack_unit' + id)
        if (p.m.length > 0)
            return p


        this.rackRemoveCover(id)
        p.m = $('#vertPDU' + id).find('div.p_handler')
        p.dev = $('#vertPDU' + id)
        return p
    },
    rackRemoveCover: function(d) {
        mm = $('#vertPDU' + d)

        rack = $(mm).parent().parent().parent()
        li = $(rack).find('div.rack_edit li')[1]
        RACK.rid = rack.attr('id')
        if ($(li).find('a.nop').attr('active') != 'ok')
            RACK.cover($(li).find('a.nop')[0])


    },
    seekstat: function() {


        //room set

        //console.log(HEADER.rid)
        if (HEADER.rid != Number(this.data.room) && Number(this.data.room) > 0) {
            //console.log('romset')	
            HEADER.bid = Number(this.data.building)
            HEADER.rid = Number(this.data.room)
            HEADER.fid = Number(this.data.floor)
            HEADER.makeNavData(HEADER.bid, HEADER.fid, HEADER.rid, true)

        } else {

            //rack find

            //console.info(this.data.t)
            switch (Number(this.data.t)) {
                //DEVICE
                case 1:
                    if (Number(this.data.room) > 0) {
                        r = $('#rack' + this.data.rack)
                        if ($(r).offset().left > winw) {
                            CAGE.next();

                        } else {

                            this.stopSeek()
                            WIN.show('#win_device')

                            handler = SEARCH.gethandler(this.data.id)

                            DEVICE.window(handler.m)
                            DEVICE.forceMenu(0)

                            t = $(handler.dev).position().top + $('#rack' + this.data.rack).offset().top + 35 - winh
                            $('#content').scrollTop(t);


                        }

                    }
                    break;
                    //buildings
                case 2:
                    HEADER.bid = Number(this.data.id)
                    HEADER.makeNavData(HEADER.bid, undefined, undefined, true)
                    this.stopSeek()
                    $('#content').scrollTop(0);
                    break;
                    //floors
                case 3:
                    HEADER.fid = Number(this.data.id)
                    HEADER.bid = Number(this.data.building)
                    HEADER.makeNavData(HEADER.bid, HEADER.fid, undefined, true)
                    this.stopSeek()
                    $('#content').scrollTop(0);
                    break;
                    //rooms
                case 4:
                    HEADER.bid = Number(this.data.building)
                    HEADER.rid = Number(this.data.id)
                    HEADER.fid = Number(this.data.floor)
                    HEADER.makeNavData(HEADER.bid, HEADER.fid, HEADER.rid, true)
                    this.stopSeek()
                    $('#content').scrollTop(0);
                    break;


                    //RACK
                case 5:
                    if (Number(this.data.room) > 0) {
                        r = $('#rack' + this.data.id)
                        if ($(r).offset().left > winw) {
                            CAGE.next();

                        } else {
                            this.stopSeek()
                            RACK.rid = 'rack' + this.data.id
                            RACK.window()
                            $('#content').scrollTop(0);
                        }
                    }
                    break;
                    
                    //storage
                case 6:

                    if (Number(this.data.room) > 0) {
                        r = $('#rack' + this.data.rack)
                        if ($(r).offset().left > winw) {
                            CAGE.next();

                        } else {

                            this.stopSeek()
                            WIN.show('#win_device')
                            handler = this.gethandler(this.data.dev)

                            DEVICE.window(handler.m)

                            t = $(handler.dev).position().top + $('#rack' + this.data.rack).offset().top + 35 - winh
                            $('#content').scrollTop(t);

                            if(!DEVICE.editmode)
                                DEVICE.editModeSet();
                            
                            
                            DEVICE.forceMenu(Number(this.data.tab))
                            RAID.init();
                            RAID.open($('<div></div>'), false, this.data);
                        }

                    }
                    break;


                case 7:

                    if (Number(this.data.room) > 0) {
                        r = $('#rack' + this.data.rack)
                        if ($(r).offset().left > winw) {
                            CAGE.next();

                        } else {

                            this.stopSeek()
                            WIN.show('#win_device')


                            handler = this.gethandler(this.data.dev)

                            DEVICE.window(handler.m)

                            t = $(handler.dev).position().top + $('#rack' + this.data.rack).offset().top + 35 - winh
                            $('#content').scrollTop(t);


                            DEVICE.forceMenu(Number(this.data.tab))

                        }

                    }
                    break;

                case 8:

                    if (Number(this.data.room) > 0) {
                        r = $('#rack' + this.data.rack)
                        if ($(r).offset().left > winw) {
                            CAGE.next();

                        } else {

                            this.stopSeek()
                            WIN.show('#win_device')
                            handler = this.gethandler(this.data.dev)

                            DEVICE.window(handler.m)

                            t = $(handler.dev).position().top + $('#rack' + this.data.rack).offset().top + 35 - winh
                            $('#content').scrollTop(t);

                            if(!DEVICE.editmode)
                                DEVICE.editModeSet();
                            
                            DEVICE.forceMenu(Number(this.data.tab))
                            RAM.init();
                            RAM.open($('<div></div>'), false, this.data);
                        }

                    }
                    break;
            }




        }

    },
    stopSeek: function() {
        $('#icon_search').hide()
        $('#win_mask2').hide()
        $('#win_mask3').hide()
        $('#searchdata').hide()
        this.seeking = false;
        //remove mask..

    },
    seek: function(e) {
        $('#icon_search').show()
        $('#win_mask2').show()
        $('#win_mask3').show()
        m = $('#s_tab' + e)
        t = Number(m.find('td.title').attr('t'))
        id = m.find('div.data').attr('itd')
        room = m.find('div.data').attr('room')
        tab = m.find('div.data').attr('tab')
        rack = m.find('div.data').attr('rack')
        dev = Number(m.find('div.data').attr('dev'))
        b = m.find('div.data').attr('b')
        f = m.find('div.data').attr('f')
        rid = m.find('div.data').attr('rid')

        this.data = {'t': t, 'id': id, 'room': room, 'rack': rack, 'building': b, 'floor': f, 'tab': tab, 'dev': dev, 'rid': rid}

        this.seeking = true;
        this.seekstat();

        /*
         $.getJSON('search/details',{'type':t,'tid':id}, function(json) {
         console.log(json)
         });
         */
    },
    select: function(key) {
        n = $('#searchtable tr.card').length - 1
        $('#searchtable tr.card').removeClass('over')
        if (key == 'down') {
            SEARCH.index++;


        } else {
            SEARCH.index--;

        }

        if (SEARCH.index > n)
            SEARCH.index = 0
        if (SEARCH.index < 0)
            SEARCH.index = n

        //console.log(SEARCH.index,n)
        $('#searchtable tr:eq(' + SEARCH.index + ')').addClass('over')


    },
    headmenu: function() {

        $('#headmenu_search').html(
                '<div act="0" class="menu_search hint" hint="Click to activate search panel!"></div>' +
                '<ul class="sub_menu_null search_drop">' +
                '<li class="sub_menu_div"><div style="padding:0;"><div id="icon_search"></div><div class="info"><span>Search</span></div>' +
                '<input class="inputsearch" style="position:absolute;width:350px;margin-left:175px;height:25px;top:0px;margin-top:4px;" autocomplete="off">' +
                '<div id="searchdata" style="margin-left: -1px; padding-top: 0px; display: none;"><div class="back"></div><table id="searchtable"></table></div></div></li>' +
                '</ul>')




    },
    init: function() {
        this.index = -1;
        $('#searchdata').hide()
        this.table = ('#searchtable')

        NOC.hintset(null)
        this.headmenu()



        $('#header input.inputsearch').bind('keydown keyup focus', function(e) {

            next = true;


            if (e.keyCode == 13) {
                next = false;
                if (SEARCH.index >= 0) {
                    if (e.type == 'keydown') {
                        SEARCH.seek(SEARCH.index)
                    }
                }
            }
            if (e.keyCode >= 37 && e.keyCode <= 40) {
                next = false;
                if (e.type == 'keydown') {
                    if (e.keyCode == 38)
                        SEARCH.select('up')
                    if (e.keyCode == 40)
                        SEARCH.select('down')

                }
            }

            //escape
            if (e.keyCode == 27) {
                next = false;
                if (e.type == 'keydown') {
                    $('#searchdata').hide()
                    $(SEARCH.table).html('')
                    ms = $('#header div.menu_search')
                    $(ms).parent().find('ul.search_drop').slideUp('fast');
                    $(ms).attr('act', 0)
                    $(ms).removeClass('active_button')
                }



                //console.log(e.keyCode,$(this).val())
            }




            if (next && e.type == 'keyup') {

                $.getJSON('basic/search', {'key': $(this).val()}, function(json) {
                    $('#searchdata').hide()
                    $(SEARCH.table).html('')
                    SEARCH.tabs(json)

                    SEARCH.index = -1;
                });
            }



        });




        $('#header div.menu_search').bind('click mouseover mouseout', function(e) {

            act = Number($(this).attr('act'))
            if (act == 0) {
                $(this).removeClass('active_button')
                if (e.type == 'mouseover') {
                    $(this).addClass('active_button')

                }

                if (e.type == 'mouseout') {
                    $(this).removeClass('active_button')

                }
            }

            if (e.type == 'click') {


                if (act == 0) {
                    $(this).attr('act', 1)
                    $(this).parent().find('ul.search_drop').show()
                    $(this).addClass('active_button')
                    $('input.inputsearch').focus()

                } else {

                    $(this).parent().find('ul.search_drop').slideUp('fast');
                    $(this).attr('act', 0)
                }


            }



        });

    }



}

var HARDWARE = {
    init: function() {
//console.log('hardware init...')	


    }




}


var PRINT = {
    _checkbox: function(d) {
        val = ELEMENT._checkbox(d)


    },
    set: function() {






    }

}
