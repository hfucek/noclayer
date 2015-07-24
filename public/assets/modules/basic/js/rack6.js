



;
(function($) {


    $.rack = {
        blocked: false,
        defaults: {
            delay: 200,
            fade: false,
            showURL: true,
            extraClass: "",
            top: 15,
            left: 15,
            id: "rack"
        }
    };

    $.fn.extend({
        rack: function(settings) {
            settings = $.extend({}, $.rack.defaults, settings);
            //createHelper(settings);
            return this.each(function() {
                //$.data(this, "tooltip", settings);
                //this.tOpacity = helper.parent.css("opacity");
                // copy tooltip into its own expando and remove the title
                //this.tooltipText = this.title;

                set_numbers(this)



                // also remove alt attribute to prevent default tooltip in IE
                this.alt = "";
            })

        }
    });
    function set_numbers(rack) {
        h = $(rack).height();
        num = Math.round((h - 41) / 18);
        html = '<ul>'
        for (i = num; i >= 1; i--) {
            html += '<li>' + i + '</li>';
        }
        html += '</ul>'
        $(rack).find('div.rack_num').html(html)

    }



})(jQuery);




var RACK = {
    addVertPdu: function() {

        p = $(this).attr('p')
        rid = $(this).parent().parent().parent().attr('id')

        lr = $(this).parent()
        $.postJSON('basic/device/pdu/new', {
            "rack": rid.replace('rack', ''),
            'p': p
        }, function(equ) {


            if (Number(equ.data) != 0) {



                t = 40 + Number(equ.data.pos) * 14;
                h = Number(equ.data.out) * 14;

                m = $('<div/>').attr({
                    'id': 'vertPDU' + equ.data.devid,
                    'e_c': 4,
                    'e_u': 0,
                    'e_t': 0,
                    'e_p': 0,
                    'pd': 0,
                    'out': equ.data.out,
                    'cur': equ.data.cur,
                    'ru': equ.data.ru,
                    'did': equ.data.devid,
                    'name': equ.data.name,
                    'pos': equ.data.pos,
                    'pduid': equ.data.id
                }).addClass('pdu').html('<div class="screw pu"></div><div class="p_handler"></div><div class="screw pb"></div>').css({
                    'height': h + 'px',
                    'top': t
                })



                $(m).appendTo(lr);
                h = $(m).find('div.p_handler')

                RACK.actionpdu(m)
                RACK.pduover(m)
                WIN.show('#win_device')


                DEVICE.window(h)
            } else {

                alert('NO space left for new pdu!')
            }
        });

    },
    pduover: function(p) {

        $(p).hover(
                function() {

                    $('#tooltip').show();

                    n = $(this).attr('name')

                    cur = $(this).attr('cur');

                    cat_nam = 'PDU';



                    out = $(this).attr('out');

                    $('#tooltip').html('<div>' + n + '</div>' + '<div><span class="name">Category:</span>' + cat_nam + '</div><div><span class="name">Current(max):</span>' + cur + ' A</div><span class="name">Output(sockets):</span>' + out + '</div>')

                },
                function() {
                    $('#tooltip').hide();

                }
        );



        $(p).mousemove(function() {
            bodyTop = 0
            if (typeof PLUGIN != 'undefined')
                bodyTop = $('#noclayer-plugin').offset().top;
            $('#tooltip').css({
                'left': mouseX + 10,
                'top': mouseY + 10 - bodyTop
            })
        });

        //click on pdu



        $(p).find('div.p_handler').click(function() {

            WIN.show('#win_device')
            DEVICE.pdu($(this))


        });

    },
    makematrix: function(d, p, cage) {
        num = $(d).parent().find('div.ru').length
        if (p == 'l') {
            pdus = $(cage).find('div.power_left').find('div.pdu')
        } else {
            pdus = $(cage).find('div.power_right').find('div.pdu')
        }

        matrix = []
        for (i = 0; i <= num; i++) {
            matrix[i] = 0
        }



        $.each(pdus, function(i, e) {
            if ($(e)[0] != $(RACK.me)[0]) {
                pos = Number($(e).attr('pos'))
                ru = Number($(e).attr('out'))
                uk = pos + ru
                for (i = pos; i <= uk; i++) {
                    matrix[i] = 1;
                }
            }
        });

        m = Number($(d).attr('n')) - 4;
        rur = Number($(RACK.me).attr('out')) + m + 2

        //console.log(matrix,m,rur)
        for (i = m; i <= rur; i++) {
            if (matrix[i] == 1) {
                return false;
            }


        }

        return true;

    },
    makegrid: function(d) {

        meh = $(RACK.me).height() + 20
        h = $(d).height() - 36 - meh
        p = $(d).attr('p')
        if (p == 'r')
            data = {
                'height': h + 'px',
                'right': '0px',
                'top': '18px'
            };
        else
            data = {
                'height': h + 'px',
                'left': '0px',
                'top': '18px'
            };
        grid = $('<div/>').attr('p', p).addClass('grid').css(data).appendTo($(d).parent())


        m = Math.floor(h / 14) + 1;
        for (i = 1; i <= m; i++) {
            c = $('<div/>').addClass('ru').attr('n', i).appendTo(grid)
            if (i > 2)
                $(c).mouseover(function() {

                    rack = $(this).parent().parent().parent().parent()
                    cage = $(this).parent().parent().parent()
                    if ($(cage) != $(RACK.clone).parent()) {
                        $(cage).append(RACK.clone)
                        RACK.onr = rack
                    }
                    cage = $(this).parent().parent().parent()

                    p = $(this).parent().attr('p')

                    t = $(this).offset().top
                    l = $(this).offset().left

                    tp = $(this).position().top
                    lp = $(this).position().left

                    if (p == 'l') {
                        ll = 0;
                    } else {
                        ll = 225;
                    }
                    //console.log(t,l,tp,lp,rack,p)

                    RACK.put = RACK.makematrix(this, p, cage)
                    tt = tp + 30;
                    RACK.onn = $(this).attr('n')
                    RACK.onp = p
                    RACK.onr = $(this).parent().parent().parent().attr('id').replace('rack', '')
                    //console.info($(this).parent().parent().parent())
                    $(RACK.clone).css({
                        'top': tt + 'px',
                        'left': ll + 'px'
                    }).removeClass('restricted')


                    if (!RACK.put) {
                        $(RACK.clone).addClass('restricted')

                    }

                });

            //if(i==1) {$(c).css('margin-top','35px')}

        }


    },
    pdustopDrag: function() {
        RACK.pdumove = false;

        $('#row div.grid').remove()
        $('#row div.power_mask').hide()
        $('#content').removeClass('no-select')
        $(RACK.clone).removeClass('pduclone')

        if (RACK.put) {
            tt = $(RACK.clone).position().top - 18
            $(RACK.me).css('top', tt + 'px').attr({
                'pos': Number(RACK.onn) - 3
            })
            pid = $(RACK.me).attr('pduid')
            if (RACK.onp == 'l') {
                $($(RACK.clone).parent()).find('div.power_left').append(RACK.me)
            } else {
                $($(RACK.clone).parent()).find('div.power_right').append(RACK.me)
            }


            $.postJSON('basic/device/pdu/update', {
                "rack": RACK.onr,
                'p': RACK.onp,
                'pid': pid,
                'n': RACK.onn
            }, function(equ) {


            });

        }

        $(RACK.clone).remove()
        $(RACK.me).removeClass('ghost')

        //console.log(RACK.onn)
    },
    setpdus: function(pdus, rack) {
        l = $(rack).find('div.power_left').attr('p', 'l').html('<div p="l" class="add"></div>')
        r = $(rack).find('div.power_right').attr('p', 'r').html('<div p="r" class="add"></div>');
        if (!RACK.pdudata) {
            RACK.pdudata = Array()
        }
        RACK.pdudata.push({
            'rack': rack,
            'pdu': pdus
        })

        //console.log(r)
        $.each(pdus, function(i, e) {


            t = 40 + Number(e.pos) * 14;
            h = Number(e.output) * 14;

            m = $('<div/>').attr({
                'id': 'vertPDU' + e.devid,
                'e_c': 4,
                'e_u': 0,
                'e_t': e.type,
                'e_p': 0,
                'pd': 0,
                'cur': e.cur,
                'out': e.out,
                'did': e.devid,
                'name': e.name,
                'ru': e.ru,
                'pos': e.pos,
                'pduid': e.id
            }).addClass('pdu').html('<div class="screw pu"></div><div class="p_handler"></div><div class="screw pb"></div>').css({
                'height': h + 'px',
                'top': t
            })
            //console.log(r)
            if (Number(e.side) == 1)
                $(m).appendTo(l);
            else
                $(m).appendTo(r);

            RACK.pduover(m)

        });


        $(l).find('div.add').click(this.addVertPdu);
        $(r).find('div.add').click(this.addVertPdu);
        this.actionpdu($(rack).find('div.rack_power'))

    },
    actionpdu: function(rid) {




        $(rid).find('div.screw').mousedown(function() {
            RACK.pdumove = true
            RACK.makematrix()
            $('#content').addClass('no-select')
            RACK.me = $(this).parent()
            p = $(this).parent().parent().attr('p')

            if (p == 'l') {
                ll = 0;
            } else {
                ll = 225;
            }
            tt = $(this).parent().position().top + 18
            RACK.clone = $(this).parent().clone()
            $(RACK.clone).addClass('pduclone dragg')
            $(RACK.me).addClass('ghost')


            $('#row div.power_mask').show()

            $($(this).parent().parent().parent()).append(RACK.clone)

            $(RACK.clone).css({
                'top': tt + 'px',
                'left': ll + 'px'
            })

            $.each($('#row div.panel_open'), function(i, e) {
                RACK.makegrid(e)
            })


        });
    },
    cover: function(d) {
        //console.info('cover',d)

        if ($(d).attr('active') == 'ok') {
            $(d).attr('active', 'no')
            $(d).find('div.cdiv').text('remove cover')

            $('#' + RACK.rid + ' div.rack_num').show()
            $('#' + RACK.rid + ' div.rack_power').hide().removeClass('panel_open')
        } else {

            $(d).attr('active', 'ok')
            $(d).find('div.cdiv').text('show cover')
            $('#' + RACK.rid + ' div.rack_num').hide()

            $('#' + RACK.rid + ' div.rack_power').show()


            pduleft = $('#' + RACK.rid + ' div.power_left').addClass('panel_open')
            pduright = $('#' + RACK.rid + ' div.power_right').addClass('panel_open')






        }


    },
    parseParent: function(id) {
        par = 'none';

        $.each(this.inventory.items, function(i, rack) {

            $.each(rack.equs, function(ii, dev) {

                if (dev.id == id) {
                    par = dev.host;
                }


            });

        });
        return par;
    },
    parseDevices: function() {
        DEVICE.categoryes = Array();

        $.each($('#win_dev_1 option'), function(i, e) {
            DEVICE.categoryes.push(Array($(e).val(), $(e).text()))


        });




    },
    makeSettings: function() {

        num = WIN.addMenu('win_settings', 'Rack')
        WIN.addLayer('win_settings', num)

        html = ''


        m = []
        $.each(this.heights, function(i, e) {
            m.push('<option value="' + e + '">' + e + '</option>')
        })

        $("#win_rack_layer1 select.rack_units").html(m.join(""))


        for (i = 48; i >= 2; i--) {
            if (this.heights.indexOf(i.toString()) != -1) {
                cl = 'set'
            } else {
                cl = 'nset'
            }

            html += '<div n="' + i + '" class="btn ' + cl + '"><div>' + i + '</div></div>'
        }



        $('#win_settings_layer' + num).html(
                '<fieldset style="margin-top:15px;"><legend>Heights</legend><div class="settings_rack_heights">' +
                html +
                '</div></fieldset>')

        $('#win_settings_layer' + num + ' div.btn').click(function() {
            n = $(this).attr('n')
            act = $(this).hasClass('set')
            cl = (act) ? 'noset' : 'set';
            $(this).attr('class', 'btn ' + cl)
            var hh = []
            $(this).parent().find('div.set').each(function(i, e) {
                hh.push($(e).attr('n'))
            })

hh.reverse()
            m = []
            $.each(hh, function(i, e) {
                m.push('<option value="' + e + '">' + e + '</option>')
            })

            $("#win_rack_layer1 select.rack_units").html(m.join(""))


            $.postJSON('settings/set', {
                'el': 'rack_heights',
                'val': hh.join(',')
            }
            , function(data) {
                //IPM_rack.render(data)
            });


        })




    },
    getSettings: function(val) {


        l = NOC.settings.length
        for (i = 0; i < l; i++) {
            if (NOC.settings[i].name == val)
                return NOC.settings[i].value
        }



    },
    init: function(c) {


        this.rtp = 0
        this.f = 0



        this.cols = []
        this.cols_tmp = []
        this.col = 0

        if (typeof c !== 'undefined') {
            WIN.close('#win_rack')
            WIN.close('#win_device')
        }

        if (!this.set) {
            var r_h = this.getSettings('room_height');
            $('#win_settings .max_rack_pos').val(r_h)
            RACK.rh = Math.round(r_h / 44.45 * 18)
            $('#room').css('height', RACK.rh)

            this.heights = this.getSettings('rack_heights').split(',');
            this.makeSettings()
            if (typeof CABLE != 'undefined')
                CABLE.init()


            $('#win_rack_layer1 div.edit_action li').click(function() {
                switch (Number($(this).attr('m'))) {
                    case 1:
                        RACK.movewin()
                        break;
                    case 2:
                        WIN.prompt('RACK remove', 'All devices will be deleted. Proceed with deleting?', 3)

                        RACK.pdudata = Array();
                        break;
                }
            });

            $('#win_rack button.rem').click(function() {

            })
            this.set = true
        }
        this.width = 260
        //this.units = Array(12, 16, 18, 24, 42, 48)
        this.equipment = []
        //	for(i=0;i<=1000;i++)  this.equipment[i]=[]



        if (CAGE.left_panel) {
            CAGE.left_panel.hide();
            CAGE.right_panel.hide();
        }

        $.getJSON('basic/ajax/room', {
            "rid": HEADER.rid
        }, function(json) {
            $('#row').html('');

            var items = [];

            //console.info(json)
            RACK.inventory = json
            RACK.parseDevices();

            if (typeof CABLE != 'undefined')
                CABLE.install(json.items)

            RACK.racksTot = json.items
            RACK.ord2 = 0

            $.each(json.items, function(i, item) {	//racks

                //RACK.rpos.val(item.position);

                h = 42 + 18 * item.units
                RACK.h = h
                m = RACK.rh - h;

                data = RACK.rackdata(item);
                cage = data[0]
                rack = data[1]

                /*
                 var rc_ob=new Object();
                 rc_ob.name=item.name
                 rc_ob.id=item.id
                 rc_ob.name=item.name
                 */

                $.each(item.equs, function(o, equ) {		//assets


                    RACK.equ_data(equ, cage)

                });
                RACK.set_numbers(rack)
                RACK.edit(rack)

            });

            CAGE.reset();
            CAGE.set = true;
            CAGE.action()

            if (typeof MONITOR != 'undefined')
                MONITOR.init()
            if (typeof GRAPHING != 'undefined')
                GRAPHING.init()

        });

        RACK.positionInit();

    },
    positionInit: function() {

        $.each(HEADER.navdata, function(k, building) {
            $.each(building.floors, function(k, floor) {
                $.each(floor.rooms, function(k, room) {
                    if (room.id == HEADER.rid) {
                        RACK.buildId = building.id
                        RACK.floorId = floor.id
                        RACK.roomId = room.id
                        RACK.ord = room.racks
                    }
                });
            });
        });
    },
    movewin: function() {

        var pop = new POPUP.init(
                'Rack position', //popup title
                'win_rack_pos', //popup name
                'win_rack', //parent window
                {
                    w: 320, //width 
                    h: 300, //height
                    wdclass: 'orange2'
                })

        var args = {
            save: false, //save button
            rem: false, //remove button
            cancel: true, //cancel 
            add: false, //add
            move: true, // move 
        }

        pop.data(
                args,
                '<div class="win_data" style="height:400px;">'
                + '<div class="win_layer win_visible">'
                + '<div class="datadiv" style="width:260px;">'
                + '<fieldset><legend>Bulding:</legend><select name="rmb" class="rack_move_build" style="width:200px;"></select></fieldset>'
                + '<fieldset><legend>Floor:</legend><select name="rmf" class="rack_move_floor" style="width:200px;"></select></fieldset>'
                + '<fieldset><legend>Room:</legend><select name="rmr" class="rack_move_room" style="width:200px;"></select></fieldset>'
                + '<fieldset><legend>Order:</legend><select name="rmp" class="rack_move_pos" style="width:200px;"></select></fieldset>'
                + '<fieldset style="position:absolute;bottom:10px;right:10px;"><legend></legend></fieldset>'
                + '</div>'
                + '</div>'
                + '</div>'
                );

        RACK.initMove()

        pop.actionSet('win_rack', ['close', 'cancel'], function() {
            pop.win.remove()
        });

        pop.actionSet('windows', ['move'], function() {

            pop.loading(true)

            var state = 1;
            state = !state ? 0 : Number(RACK.mfloor.val())
            state = !state ? 0 : Number(RACK.mroom.val())
            state = !state ? 0 : Number(RACK.mpos.val())

            if (state < 0) {
                NOC.alertBox('Move', 'Please select floor, room and position!', 'pop_win_rack_pos', 'orange2')
                pop.loading(false)
                //WIN.prompt('Move','Please select floor, room and position!','alert',1);
            } else {

                var oo = Number($('#' + RACK.rid).attr('ord'))
                var no = Number(RACK.mpos.val())
                var to = 0

                var nb = Number(RACK.mbuild.val())
                var ob = HEADER.bid

                var nf = Number(RACK.mfloor.val())
                var of = HEADER.fid

                var nr = Number(RACK.mroom.val())
                var or = HEADER.rid

                if (oo < no && nr == HEADER.rid)
                    no++

                //move
                $.postJSON('basic/ajax/rack/move', {
                    'id': RACK.rid.replace('rack', ''),
                    'room': RACK.mroom.val(),
                    'ord': no,
                    'to': to,
                }, function(json) {

                    $.postJSON('basic/ajax/headnav', function(data) {
                        HEADER.navdata = data
                        RACK.positionInit()
                    });

                    //goto room with copied rack
                    CAGE.matrix()

                    if (nr != or || nb != ob || nf != of) {
                        //  WIN.close('#win_rack')
                        HEADER.bid = nb
                        HEADER.fid = nf
                        HEADER.rid = nr
                        HEADER.makeNavData(nb, nf, nr, 1)
                    }
                    else
                        RACK.init()


                    pop.loading(false)
                    pop.win.remove()

                });
            }
        });

        pop.onchange(
                function(e, d) {
                    RACK.selecting(d)
                });

    },
    selecting: function(d) {

        selbox = ['pos', 'room', 'floor', 'build']

        setEmptyValue = function(from) {

            $.each(selbox, function(i, e) {
                if (i < from)
                    $('#pop_win_rack_pos .rack_move_' + e).html('<option value="-1">-</option>')
            });

        }

        generate = function(type) {

            //buildings
            $.each(HEADER.navdata, function(i, building) {
                if (building.id == RACK.mbuild.val()) {

                    //floors
                    $.each(building.floors, function(j, floor) {

                        if (type > 2)
                            $('<option/>').val(floor.id).html(floor.name).appendTo(RACK.mfloor);

                        if (floor.id == RACK.mfloor.val()) {

                            //rooms
                            $.each(floor.rooms, function(z, room) {
                                if (type > 1)
                                    $('<option/>').val(room.id).html(room.name).appendTo(RACK.mroom);

                                if (room.id == RACK.mroom.val()) {
                                    var ord = room.racks
                                    var to = RACK.ord
                                    if (Number(RACK.mroom.val()) != HEADER.rid)
                                        ord++;
                                    if (ord == 0)
                                        ord++
                                    for (var i = 1; i <= ord; i++)
                                        $('<option/>').val(i).html(i).appendTo(RACK.mpos);
                                }
                            });
                        }
                    });
                }
            });
        }

        if (d == 'init')
            name = init
        else
            name = $(d).attr('name')

        switch (name) {

            case 'rmb':

                // move building
                setEmptyValue(3)
                generate(3)
                RACK.mfloor.val(0)
                RACK.mroom.val(0)

                break;
            case 'rmf':

                // move floor
                setEmptyValue(2)
                generate(2)
                RACK.mroom.val(0)

                break;
            case 'rmr':

                //room
                setEmptyValue(1);
                generate(1)

                break;
        }
    },
    initMove: function() {

        RACK.rpos = $('#win_raid .rack_pos')
        RACK.mbuild = $('#pop_win_rack_pos .rack_move_build')
        RACK.mfloor = $('#pop_win_rack_pos .rack_move_floor')
        RACK.mroom = $('#pop_win_rack_pos .rack_move_room')
        RACK.mpos = $('#pop_win_rack_pos .rack_move_pos')

        RACK.rpos.val($('#' + RACK.rid).attr('pos'))

        RACK.mbuild.html('');
        RACK.mfloor.html('');
        RACK.mroom.html('');
        RACK.mpos.html('');

        $.each(HEADER.navdata, function(k, building) {

            //building
            $('<option/>').val(building.id).html(building.name).appendTo(RACK.mbuild)

            //floors
            var floors = building.floors
            $.each(floors, function(k, floor) {
                if (building.id == RACK.buildId)
                    $('<option/>').val(floor.id).html(floor.name).appendTo(RACK.mfloor)

                //rooms
                var rooms = floor.rooms
                $.each(rooms, function(k, room) {
                    if (building.id == RACK.buildId)
                        if (floor.id == RACK.floorId)
                            $('<option/>').val(room.id).html(room.name).appendTo(RACK.mroom)
                });
            });
        });

        RACK.mbuild.val(RACK.buildId)
        RACK.mfloor.val(RACK.floorId)
        RACK.mroom.val(RACK.roomId)

        $.postJSON('basic/ajax/headnav', function(data) {
            HEADER.navdata = data
            RACK.positionInit()
            console.log("headnav updated");
        });


        for (var i = 1; i <= RACK.ord; i++)
            $('<option/>').val(i).html(i).appendTo(RACK.mpos)

        RACK.mpos.val(Number($('#' + RACK.rid).attr('ord')) + 1)


    },
    loading: function(key) {
        if (key)
            $('#win_rack div.win_icon').addClass('deviceLoader').removeClass('default');
        else
            $('#win_rack div.win_icon').removeClass('deviceLoader').addClass('default');
    },
    removeRack: function() {

        id = RACK.rid.replace('rack', '')

        $('#win_mask3').show();

        $('#win_rack div.win_mask').show();
        $('#win_rack div.win_data').append($('<div/>').addClass('dataLoad').html('Updating data..'))


        //update cage
        CAGE.position()
        CAGE.matrix();
        RACK.loading(true)

        //remove rack
        $('#' + RACK.rid).remove();

        $.postJSON('basic/rack/remove', {
            'rid': id
        }, function(json) {

            WIN.close('#win_rack')
            $('#win_rack div.win_mask').hide();
            $('#win_rack div.dataLoad').remove()
            $('#win_mask3').hide();
            $.postJSON('basic/ajax/headnav', function(data) {
                HEADER.navdata = data
                RACK.positionInit()
                RACK.init()
            });
            RACK.loading(false)


        });

        //

        //update matrix




    },
    equ_data: function(equ, cage) {



        if (Number(equ.cat) == 4 && Number(equ.position) == 0) {


        } else {
            equ_b = equ.position * 18 + 3
            hh = RACK.h - 21


            equ_h = equ.units * 18

            var number = 1 + Math.floor(Math.random() * 3);


            dev = $('<div>').attr({
                'class': 'rack_unit ru' + equ.units + ' equ' + equ.cat,
                'id': 'rack_unit' + equ.id,
                'e_u': equ.units,
                'e_t': equ.type,
                'e_c': equ.cat,
                'e_p': equ.position,
                'pd': equ.parent
            }).css({
                'height': equ_h + 'px',
                'bottom': equ_b + 'px'

            }).html(
                    //<div class="status st'+number+'"></div>
                    '<div class="handler"></div><div class="device_graph"></div><div class="device_status"></div><div class="monitor"><div class="activ stat' + equ.cat + '"></div><div class="data"></div></div><div class="equ"><div class="equ_icon"></div><div class="equ_head"></div><div class="equ_mid"></div><div class="equ_foot"></div></div>' +
                    '<a class="screw" href="#" ><div class="left"></div></a>' +
                    '<a class="screw s_r" href="#" ><div class="right"></div></a>' +
                    '<div class="name"></div>').appendTo(cage);

            if (!equ.type)
                equ.type = 0

            dev.find('div.name').text(equ.host)

        }
        //equ.rack=RACK.equipment[equ.type].push(equ)



    },
    getFreeSpace: function() {



        for (i = 1; i <= RACK.ru + 1; i++) {

            if (this.empty[i]) {
                return i;
            }
        }
        return false;
    },
    new_device: function() {
        //number of rack units
        RACK.ru = Number($('#' + RACK.rid).attr('ru'))

        //array with position of empty space
        this.empty_space();

        //get first avaliable space in rack
        pos = this.getFreeSpace()

        if (pos) {
            DEVICE.emptyMenu(5)

            $.postJSON('basic/ajax/device/new', {
                "rack": RACK.rid.replace('rack', '')
            }, function(equ) {

                //make device in rack
                cage = $('#' + RACK.rid + ' div.rack_cage')
                RACK.equ_data(equ, cage)
                CAGE.action('#rack_unit' + equ.id + ' ')

                WIN.show('#win_device')
                DEVICE.editmode = true
                DEVICE.menu(1)
                WIN.activateTab('#win_device', 1)
                //$('#win_device_layer0').hide()		
                DEVICE.window($('#rack_unit' + equ.id + ' div.handler'))

                //if(NAGIOS) NAGIOS.updateDevice(DEVICE.id,new_name)

            });


            //perform action on device in rack


        } else {
            //not enough space in rack	
            WIN.alert("There is no enough space left , rack is full!")

        }


    },
    empty_space: function() {



        //get empty space in rack
        this.empty = Array(RACK.ru + 1);


        //fill array with true statement
        $.each(this.empty, function(o, e) {
            RACK.empty[o] = true;
        });


        //rack inventory	
        racks = $('#' + RACK.rid + ' div.rack_unit')

        //
        $.each(racks, function(o, r) {
            p = Number($(r).attr('e_p'))
            u = Number($(r).attr('e_u')) + p

            for (i = p; i < u; i++) {
                RACK.empty[i] = false;
            }



        });




    },
    new_r: function() {

        $.postJSON('basic/ajax/rack/new', {
            "room": HEADER.rid
        }, function(data) {

            data.pdu = Array();

            //add new rack
            c_r = RACK.rackdata(data)

            //set rack numbers
            RACK.set_numbers(c_r[1])

            //set rack action
            RACK.edit(c_r[1])

            //new rack id's
            RACK.rid = 'rack' + data.id

            // col and order
            $('#' + RACK.rid).attr('col', RACK.cols.length)
            $('#' + RACK.rid).attr('ord', RACK.ord)

            //show edit window
            RACK.window()

            //update cage
            CAGE.position();
            CAGE.matrix();

            $.postJSON('basic/ajax/headnav', function(data) {
                HEADER.navdata = data
                RACK.positionInit()
            });

        });

    },
    rackdata: function(item) {

        h = 42 + 18 * item.units
        RACK.h = h
        var mt = RACK.rh - h;
        var ml = 10
        var pos = 0

        if (typeof RACK.cols !== 'undefined') {

            if (typeof RACK.cols[RACK.col] === 'undefined')
                RACK.cols[RACK.col] = []

            if (Number(item.position)) {

                RACK.f++;
                if (RACK.col == 0) {
                    RACK.cols[RACK.col].push(item)
                    RACK.col++;
                }

                else {
                    var h1 = RACK.h
                    var colh = RACK.h

                    $.each(RACK.cols[RACK.col - 1], function(i, rack) {
                        colh += (42 + 18 * rack.units)
                        h1 += (42 + 18 * rack.units)
                    });

                    if (h1 < RACK.rh) {
                        mt = RACK.rh - colh
                        ml = -250
                        f = 0
                        RACK.cols[RACK.col - 1].push(item);
                    }
                    else {
                        RACK.cols[RACK.col].push(item)
                        RACK.col++;
                    }
                }

                pos = 1
            }
            else {
                if (RACK.f > 0) {
                    RACK.cols[RACK.col] = []
                    RACK.f = 0
                }

                RACK.cols[RACK.col].push(item);
                RACK.col++;
            }
        }

        var ord = (item.order == RACK.ord2) ? item.order : RACK.ord2
        RACK.ord2++

        var rack = $("<div/>").attr({
            "class": "rack",
            "id": 'rack' + item.id,
            "ru": item.units,
            "pos": pos,
            "ord": ord,
            "col": RACK.col
        }).css({
            "height": h + 'px',
            "margin-top": mt + 'px',
            "margin-left": ml + 'px'
        }).appendTo("#row");

        span = $('<span/>').text(item.name)
        $('<div>').attr('class', 'rack_edit').appendTo(rack);
        $('<div>').attr('class', 'rack_head').append(span).appendTo(rack);
        var cage = $('<div>').attr('class', 'rack_cage').html('<div class="rack_num"></div><div class="power_mask"></div><div class="rack_power power_left"></div><div class="rack_power power_right"></div>').appendTo(rack);
        $('<div>').attr('class', 'rack_foot').appendTo(rack);

        //console.log(item.pdu)

        RACK.setpdus(item.pdu, rack)

        return Array(cage, rack)
    },
    getId: function(div) {
        m = $(div).parent()
        while ($(m).parent()) {
            m = $(m).parent()
            if ($(m).attr('id'))
                return $(m).attr('id');
        }


    },
    window: function() {
        if (!this.winsetaction) {
            //set action on input,select
            $('#win_rack select,input').bind('focus blur keydown', function(e) {

                name = $(this).attr('name')

                switch (name) {
                    case 'name':
                        if (e.type == 'keydown') {
                            if (e.keyCode == 13) {
                                $(this).blur()
                            }

                        }

                        if (e.type == 'focus')
                            $(this).addClass('focused')


                        if (e.type == 'blur') {

                            $(this).removeClass('focused')


                            name = $(this).val()
                            if (name.length < 1) {
                                $(this).val(RACK.name)

                            } else {
                                RACK.name = name
                                $('#' + RACK.rid).find('div.rack_head span').text(name)
                                NOC.update('basic/ajax/rack/' + RACK.rid.replace('rack', ''), {
                                    "up": "ok",
                                    "name": name
                                }, 1)
                            }

                        }
                        break;
                }

            })

            $('#win_rack select').change(function() {

                name = $(this).attr('name')
                switch (this.tagName.toLowerCase()) {

                    case 'input':
                        switch (name) {
                            case 'name':
                                name = $(this).val()
                                if (name.length < 1) {
                                    $(this).val(RACK.name)

                                } else {
                                    RACK.name = name
                                    $('#' + RACK.rid).find('div.rack_head span').text(name)
                                    NOC.update('basic/ajax/rack/' + RACK.rid.replace('rack', ''), {
                                        "up": "ok",
                                        "name": name
                                    })
                                }
                                break;

                        }
                        break;

                    case 'select':
                        switch (name) {

                            case 'ru':
                                if (RACK.setHeight($(this).val(), RACK.rid)) {
                                    RACK.presel = $(this).val()
                                    NOC.update('basic/ajax/rack/' + RACK.rid.replace('rack', ''), {
                                        "up": "ok",
                                        "size": RACK.presel
                                    }, 2)
                                } else {
                                    $(this).val(RACK.presel)
                                }
                                break;

                            case 'rp':

                                RACK.loading(true)
                                $('#win_rack div.win_data').append($('<div/>').addClass('dataLoad').html('Moving rack..'))

                                //change position
                                $.postJSON('basic/ajax/rack/pos', {
                                    'id': RACK.rid.replace('rack', ''),
                                    'pos': $(this).val()
                                }, function(json) {
                                    RACK.init()

                                    RACK.loading(false)
                                    $('#win_rack div.dataLoad').remove()
                                });
                        }
                        break;
                }
            });

            this.winsetaction = true;
        }

        WIN.show('#win_rack')

        $('#' + RACK.rid + ' div.rack_cage').addClass('rack_active')

        name = $('#' + RACK.rid).find('div.rack_head span').text()

        RACK.name = name
        ru = $('#' + RACK.rid).attr('ru')
        pos = Number($('#' + RACK.rid).attr('pos'))
        order = Number($('#' + RACK.rid).attr('ord'))
console.log(ru)


        sel = $('#win_rack').find('select.rack_units')
        sel.val(ru)
        RACK.presel = ru;

        $('#win_rack').find('input').val(name)
        $('#win_rack').find('select.rack_pos').val(pos)
        $('#win_rack').find('select.rack_move_pos').val(order);
    },
    edit: function(rack) {

        e = $(rack).find('div.rack_edit')
        e.html('<ul  rid="' + $(rack).attr('id') + '" class="vertical_menu"><li><a class="nop" t="1" href="#"><div class="cdiv">edit</div></a> </li>' +
                //'<li class="sub">'+
                //'<div class="cdiv">add new device </div>'+
                /*
                 '<ul class="vertical_submenu">'+
                 '<li><a href="#"><div>server</div></a></li>'+
                 '<li><a href="#"><div>switch</div></a></li>'+
                 '<li><a href="#"><div>router</div></a></li>'+
                 '</ul>'+
                 */
                //'</li>'+
                '<li><a  class="nop" t="3" href="#"><div class="cdiv">remove cover</div></a> </li>' +
                '<li><a  class="nop" t="2" href="#"><div class="cdiv">add new device</div></a> </li>' +
                '</ul>')

        a = e.find('a.nop')

        $.each(a, function(o, l) {

            $(l).click(function() {
                switch ($(this).attr('t')) {
                    case "1":

                        RACK.rid = RACK.getId($(this))
                        RACK.window()


                        break;
                    case "2":
                        RACK.rid = RACK.getId($(this))
                        RACK.new_device()

                        break;
                    case "3":
                        RACK.rid = RACK.getId($(this))
                        RACK.cover(this)

                        break;

                }

            });
        });

        e.hover(
                function() {
                    $(this).find('ul.vertical_menu').show();
                },
                function() {
                    $(this).find('ul.vertical_menu').hide();
                }
        );



        e.find('li.sub').hover(
                function() {
                    $(this).find('ul.vertical_submenu').show();
                },
                function() {
                    $(this).find('ul.vertical_submenu').hide();
                }
        );




    },
    setHeight: function(val, rack) {

        next = true

        h = val * 18 + 21
        units = $('#' + rack).find('div.rack_unit')

        $.each(units, function(o, unit) {

            b = Number($(unit).css('bottom').split('px')[0])
            b = b + $(unit).height()

            if (h < b) {
                next = false
            }
        });

        if (!next) {
            WIN.alert("Selected unit does not fit, please try a larger unit!")

            return false
        }
        return true

    },
    set_numbers: function(rack) {
        h = $(rack).height();
        num = Math.round((h - 41) / 18);
        html = '<ul>'
        for (i = num; i >= 1; i--) {
            html += '<li>' + i + '</li>';
        }
        html += '</ul>'
        $(rack).find('div.rack_num').html(html)







    }





}


Array.prototype.findIndex = function(value) {
    var ctr = "";
    for (var i = 0; i < this.length; i++) {
        // use === to check for Matches. ie., identical (===), ;
        if (this[i] == value) {
            return i;
        }
    }
    return ctr;
};






var CAGE = {
    _mt: function(z) {

        m = $(z).css('margin-top')
        if (typeof m !== 'undefined')
            return Number(m.replace('px', ''))
        else
            return 0

    },
    init: function() {
        console.log("cage init");
        this.hoverset = false
        this.drag = false
        this.x = 0;
        this.div = $('#cage');
        this.div.scrollLeft(0);

        $('#room').scrollLeft(0);


        //panels
        this.left_panel = $('#room_navig div.left_panel');
        this.right_panel = $('#room_navig div.right_panel');
        //right panel action
        this.right_panel.click(function() {
            CAGE.next()
        });
        //left panel action
        this.left_panel.click(function() {
            CAGE.prev()
        });

        this.right_panel.mouseover(function() {
            if (CAGE.drag)
                CAGE.next()
        });

        this.left_panel.mouseover(function() {
            if (CAGE.drag)
                CAGE.prev()
        });


    },
    setHeight: function() {





        t = 0

        if (typeof PLUGIN != 'undefined') {

            t = PLUGIN.findMenuParent()
            $('#noclayer-plugin').height(winh - t)
        }

        tt = t + 35
        $('#content').height(winh - tt)

    },
    matrix: function() {

        //store height and position from racks in multidimensional array

        //reset settings
        this.layout = Array();
        x = 0;
        y = 0;

        //array dimension number of racks in floor
        c = $('#cage').find('div.rack').length
        //make sub array
        for (i = 0; i <= c; i++)
            this.layout[i] = Array();

        //get all racks in cage

        if (typeof RACK.cols !== 'undefined') {

            $.each(RACK.cols, function(i, col) {

                $.each(col, function(i, rack) {

                    //diference in floor height  and rack height
                    mt = CAGE._mt('#rack' + rack.id)
                    h = $('#rack' + rack.id).height()
                    //reset counter
                    y = 0;

                    //all above and under rack is restricted ,we gona put two records at begining of array

                    CAGE.layout[x][y] = (mt - 20) + ',' + (mt + 20)  	//all above
                    y++;
                    CAGE.layout[x][y] = RACK.rh - 11 + ',' + RACK.rh + 20	//all under 
                    y++;

                    CAGE.layout[x][y] = (mt + h - 10) + ',' + (mt + h + 10)
                    y++;

                    //get all rack units in rack
                    $.each($('#rack' + rack.id).find('div.rack_unit'), function(i, r_unit) {

                        /*
                         y0----------------------------------------------------------  top
                         y1----------------------------------------------------------  top+height
                         */

                        y0 = $(r_unit).position().top + mt + 1
                        y1 = y0 + $(r_unit).height() - 2;

                        //store data in matrix
                        CAGE.layout[x][y] = y0 + ',' + y1
                        //increase counter of rack units
                        y++;
                    });

                    //increase counter of racks	
                    x++;
                });

            });

        }
    },
    restricted: function(d) {
        CAGE.drop = false
        d.addClass('restricted')
    },
    colision: function(d, rack) {

        //set initail settings
        d.removeClass('restricted')
        CAGE.drop = true

        //height above rack to master header
        //mt=RACK.rh-$(rack).height()
        mt = CAGE._mt($(rack))
        l = CAGE.me.position().left
        t0 = CAGE.me.position().top + mt
        t1 = t0 + CAGE.me.height()

        pos = CAGE.pos

        if (typeof CAGE.rack_tmp !== 'undefined') {

            nc = Number(CAGE.rack_tmp.attr('col')) - 1
            oc = Number(CAGE.rack.attr('col')) - 1

            if (nc == oc)
                nc = -1;
            CAGE.new_col = nc

            xx = Number(CAGE.rack_tmp.attr('ord')) - Number(CAGE.rack.attr('ord'))

            //count of +/- rack
            //xx=Math.round(l/260);

            //out of space right?
            left_rel = l + CAGE.r_l


            if (left_rel > CAGE.width) {
                CAGE.restricted(d)
                return
            }


            //for i<0 left rack or i>0 right rack
            //if(l!=0){
            pos += xx
            //    }

            //in wich rack to drop
            CAGE.drop_rack = pos;
        }

        //ignore self colision
        c_t0 = CAGE.me_data[1] + mt + 1
        c_t1 = c_t0 + CAGE.me.height() - 2

        /*
         shematic of dot position
         
         c_t0------------------------------------------------------------
         t0 -----------------------------------------------		        	clon	|	|	|	|	|	|
         me	|	|	|	|	|	c_t1-----------------------------------------------------------
         t1 ----------------------------------------------
         
         
         */

        self = false;
        num = 0
        if ((l == CAGE.me_data[0]) && ((c_t0 >= t0 && c_t0 <= t1) || (c_t1 >= t0 && c_t1 <= t1))) {
            self = true;
            num = -1
        }
        //we have self colision	
        //CAGE.restricted(d)
        //return	

        /*
         }else{
         */
        if (pos < 0) {
            CAGE.restricted(d)
            return
        }

        u = CAGE.layout[pos]
        //number of rack units  

        m = (typeof u !== 'undefined') ? u.length : 0;

        for (i = 0; i < m; i++) {
            //rack_unit left position and height
            p = u[i].split(',')

            /*
             shematic of dot position
             
             p[0]------------------------------------------------------------
             t0 -----------------------------------------------		        	object	|	|	|	|	|
             me	|	|	|	|	|	p[1]-----------------------------------------------------------
             t1 ----------------------------------------------
             
             
             */

            if ((t0 >= p[0] && t0 <= p[1]) || (t1 >= p[0] && t1 <= p[1]) || (t0 <= p[0] && t1 >= p[1])) {

                num++;
                if (num > 0) {
                    console.log(num);
                    CAGE.restricted(d)
                    return
                }

            }
        }
    },
    stopDrag: function() {
        //first check has device moved

        if (!this.hoverset) {
            CAGE.drop = false;

        }

        this.hoverset = false;

        this.makeTable(false)
        this.drag = false


        CAGE.me.removeClass('restricted')

        if (!CAGE.drop) {
            this.clon.removeClass('clone')
            this.action('#' + me.attr('id') + ' ')
            this.me.remove()
        } else {

            this.clon.remove()
            //mt=RACK.rh-CAGE.rack.height()

            mt = CAGE._mt(CAGE.rack);
            r = $('#cage div.rack')[CAGE.drop_rack]

            var colh = 0
            var dor = 0   // col height without dropping rack

            CAGE.col = CAGE.new_col != -1 ? CAGE.new_col : CAGE.col

            $.each(RACK.cols[CAGE.col], function(j, rack) {
                colh += $('#rack' + rack.id).height()
                if (Number(CAGE.rack_tmp.attr('id').replace('rack', '')) == rack.id)
                    return false;
                dor += $('#rack' + rack.id).height()
            });

            mt2 = RACK.rh - colh

            dif = mt2 - mt

            this.me.appendTo($(r).find('div.rack_cage')[0])

            t = this.me.position().top - dif


            if (RACK.cols[CAGE.col].length == 1)
                n = colh - t - this.me.height()
            else
                n = (colh - dor) - t - this.me.height()


            this.me.css('top', '')

            this.me.css('bottom', n)
            pos = Math.round((n - 3) / 18)
            //alert(pos)
            //this.me.
            this.me.attr('e_p', pos)
            this.me.css('left', '')
            CAGE.me.removeClass('dragg')
            //CAGE.me.removeClass('active')


            DEVICE.changePosition(this.me)


            DEVICE.dragStop(this.me)





            this.matrix()

            //RACK.empty_space()

        }
        $('body').removeClass('no_drop')
        $('#wraper').removeClass('no-select')
    },
    makeTable: function(key) {

        mask = $('#mask')

        if (key) {
            mask.show();
            rid = 0;

            $.each(RACK.cols, function(i, col) {
                sid2 = 0;

                $.each(col, function(j, el) {

                    rack = $('#rack' + el.id)

                    clon = $(rack).clone()

                    clon.appendTo(mask)
                    id = clon.attr('id')
                    clon.removeAttr('id')
                    mm = clon.find('div.rack_cage')
                    mm.html('')
                    clon.css('background', 'red')
                    ru = clon.attr('ru')

                    for (k = 0; k <= ru; k++) {
                        rm = $('<div/>').addClass('rack_mount').attr({
                            'id': 'rm' + id + '-' + k,
                            'l': rid,
                            't': j,
                            'n': k,
                            'ru': ru
                        })
                        rm.appendTo(mm)


                        //mouseover/out  fake rack units


                        rm.hover(
                                function() {
                                    $('body').removeClass('no_drop')

                                    //if no hover 
                                    CAGE.hoverset = true

                                    //nad

                                    r_l = $(this).attr('l')
                                    r_t = $(this).attr('t')
                                    r_n = $(this).attr('n') - 1

                                    CAGE.rack_tmp = $('#' + $(this).attr('id').split('-')[0].replace('rm', ''))

                                    //total height  of ru 
                                    r_z = r_n * 18 + 21;

                                    r_p = (r_l - CAGE.col) * 260 //rack position
                                    h2 = $(this).parent().parent().height()

                                    mt2 = RACK.rh - h2;


                                    mt23 = CAGE._mt($(this).parent().parent())


                                    mt = CAGE.me_data[2];


                                    hh = mt23 - mt

                                    tt = hh + r_z

                                    CAGE.me.css({
                                        'left': r_p,
                                        'top': tt
                                    })

                                    //COLISION DETECTION
                                    CAGE.screw.show()
                                    CAGE.colision(CAGE.me, CAGE.rack);

                                },
                                function() {
                                    //izvan
                                    $('body').addClass('no_drop')

                                }
                        );

                    }

                    //rid2++;
                });


                rid++;
            });

        }
        else {
            mask.html('')
            mask.hide()
        }

    },
    action: function(object) {

        data = ''

        if (object)
            data = object;
        /*
         $(data+"a.screw").bind('dblclick',function(e){
         e.preventDefault();
         });
         $(data+"a.screw").bind('click',function(e){
         e.preventDefault();
         });
         
         */

        $(data + "a.screw").mousedown(function() {

            $('#wraper').addClass('no-select')


            CAGE.clon = $(this).parent().clone()
            CAGE.clon.appendTo($(this).parent().parent());
            /*
             me2=$(this).parent().clone()
             me2.appendTo($(this).parent().parent()); 
             */
            me = $(this).parent()
            $(this).hide()
            CAGE.screw = $(this)

            //get rack
            rack = me.parent().parent()
            CAGE.rack = rack

            //make visual changes through css
            CAGE.clon.addClass('clone')

            //clon.css({ opacity: 0.55 ,outline:'1px solid orange'});
            CAGE.me = me
            me.addClass('dragg')

            //mt=RACK.rh-$(rack).height()
            mt = CAGE._mt($(rack));
            //rack left position px
            CAGE.r_l = $(rack).offset().left - $('#cage').position().left

            //position of rack relative
            CAGE.col = Math.round(CAGE.r_l / 260)

            CAGE.pos = $('#cage').find($(rack)).index()

            //initial settings
            CAGE.me_data = Array();
            //object to drag left and top position  ;relative	
            CAGE.me_data.push(me.position().left, me.position().top, mt)

            CAGE.makeTable(true)
            CAGE.drag = true

        }).mouseup(function() {

        });


        //action for device click 

        $('#cage div.handler').click(function() {

            WIN.show('#win_device')
            DEVICE.window($(this))


        });

        $("div.rack_unit div.handler").hover(
                function() {
                    $('#tooltip').show();
                    n = $(this).parent().find("div.name").html()

                    par = $(this).parent().attr('pd');
                    cat = $(this).parent().attr('e_c');

                    cat_nam = DEVICE.getCat(cat)



                    dev_par = RACK.parseParent(par)



                    $('#tooltip').html('<div>' + n + '</div>' + '<div><span class="name">Category:</span>' + cat_nam + '</div><div><span class="name">Parent:</span>' + dev_par + '</div>')

                },
                function() {
                    $('#tooltip').hide();
                }
        );

        $('#cage div.handler').mousemove(function() {
            bodyTop = 0
            if (typeof PLUGIN != 'undefined')
                bodyTop = $('#noclayer-plugin').offset().top;
            $('#tooltip').css({
                'left': mouseX + 10,
                'top': mouseY + 10 - bodyTop
            })
        });



        this.matrix();


    },
    next: function() {
        //260
        this.left_panel.hide();
        this.right_panel.hide();
        num = Math.round(winw / RACK.width)
        m = num * RACK.width

        //console.log(m,RACK.width)

        l = $('#cage').offset().left
        if (l == 0) {
            m -= 45
        }
        //this.div.css('left',-m)


        //n_r=$('#row').width()/RACK.width



        $("#cage").animate({
            left: "-=" + m + "px"
        }, 500, "linear",
                function() {
                    CAGE.position()
                });



    },
    prev: function() {
        this.left_panel.hide();
        this.right_panel.hide();
        num = Math.round(winw / RACK.width)
        m = num * RACK.width
        cl = $('#cage').offset().left
        z = cl + m



        if (z == 45) {
            m = m - 45;
        }



        $("#cage").animate({
            left: "+=" + m + "px"
        }, 500, "linear",
                function() {
                    CAGE.position()
                });


    },
    reset: function() {

        this.div.css('left', 0)

        this.position()
    },
    position: function() {

        cage_left = $('#cage').offset().left
        cage_width = $('#row').width() + $('#cage').offset().left
        this.right_panel.hide();
        this.left_panel.hide();


        if (cage_width > winw) {
            this.right_panel.show();
        }
        if (cage_left < 0) {
            this.left_panel.show();
        }


        //total cage width
        CAGE.width = $('#row').width()

        if (SEARCH.seeking)
            SEARCH.seekstat();
    }




}


var DEVICE = {
    init: function() {
        //default menu list length
        this.menuLEN = 7
        console.log("DEVICE INIT")

        /**
         * extend default menu with modules menu
         * 
         */

        Hook.call('deviceMenu', 0);

    },
    _checkbox: function(d) {

        eid = $(d).parent().parent().attr('eid')
        val = ELEMENT._checkbox(d)



        $.postJSON('basic/device/data/value', {
            'eid': eid,
            'val': val,
            'id': DEVICE.id
        }, function(json) {


        });





    },
    getCat: function(id) {
        name = '';
        $.each(this.categoryes, function(i, cat) {
            if (Number(cat[0]) == Number(id))
                name = cat[1];
        });
        return name;
    },
    /*
     make changes in device window
     */
    forceMenu: function(n) {
        n++;

        nn = n - 1
        if (!DEVICE.editmode) {
            if (n == 1) {
                n = 0;
                nn = 0
            }
        }

        $('#win_device div.win_menu li').removeClass('aktive')

        $($('#win_device div.win_menu li')[nn]).addClass('aktive')

        $('#win_device div.win_layer').removeClass('win_visible')

        $('#win_device_layer' + n).addClass('win_visible')


        this.menuActive = n

        if (this.menuArray[n] != 1 && n > 1) {

            this.loadData()

        }

        this.menuArray[n] = 1;


    },
    menu: function(n) {

        if (!DEVICE.editmode) {
            if (n == 1)
                n = 0;
        }
        $('#win_device div.win_layer').removeClass('win_visible')

        $('#win_device_layer' + n).addClass('win_visible')




        this.menuActive = n
        if (n == 7)
            this.loadData();
        if (this.menuArray[n] != 1 && n > 1 && n != 7) {

            this.loadData()

        }

        this.menuArray[n] = 1;



    },
    remove: function(key) {


        did = $(this.dev).attr('id').replace('rack_unit', '').replace('vertPDU', '')
        if (!key) {
            WIN.prompt('Delete Device', 'All data will be erased, proceed with deleting?', 1);
        } else {

            $(this.dev).remove()

            WIN.close('#win_device')

            CAGE.makeTable(false)
            CAGE.matrix()


            $.postJSON('basic/device/remove', {
                'did': did
            }, function(json) {







            });

        }
    },
    e_return: function(key, type) {

        console.log('EEEE')
    },
    changeParent: function(d) {

        if ($(this.dev).attr('pduid')) {
            did = $(this.dev).attr('did')
        } else {
            did = $(this.dev).attr('id').replace('rack_unit', '')
        }
        par = $(d).val().replace('rack_unit', '')

        $(this.dev).attr('pd', par)

        $.postJSON('basic/device/parent', {
            'did': did,
            'par': par
        }, function(json) {




        });


    },
    changePosition: function(d) {


        if ($(d)) {
            did = $(d).attr('id').replace('rack_unit', '')
            rid = $(d).parent().parent().attr('id').replace('rack', '')
            pos = $(d).attr('e_p')

            $.postJSON('basic/device/position', {
                'did': did,
                'rid': rid,
                'pos': pos
            }, function(json) {




            });
        }

    },
    changeRUsize: function(d) {

        did = $(d).attr('id').replace('rack_unit', '')
        rid = $(d).parent().parent().attr('id').replace('rack', '')
        ru = $(d).attr('e_u')

        $.postJSON('basic/device/rackunit', {
            'did': did,
            'rid': rid,
            'ru': ru
        }, function(json) {



        });


    },
    print: function(d, temp) {
        cc = $(d).parent().parent().parent().find('div.check_box')
        data = []
        $.each(cc, function(i, e) {
            data.push($(e).attr('act'))
        });

        if (temp) {
            id = TEMPLATE.templateID
            name = TEMPLATE.temp.find('option:selected').text()
            data.push(1)
        }
        else {
            id = DEVICE.id
            name = DEVICE.name
            data.push(0)
        }




        window.open('basic/print/get/' + id + '/' + data.join(',') + '/' + name, '_blank');

    },
    loadings: function(key) {
        if (key)
            $('#win_device div.win_icon').addClass('deviceLoader').removeClass('default');
        else
            $('#win_device div.win_icon').removeClass('deviceLoader').addClass('default');
    },
    loadData: function() {

        if (this.menuActive != 7) {
            this.winicon = $('#win_device div.win_icon')

            this.container = $('#win_device_layer' + this.menuActive)
            this.container.html('')
            this.container.append($('<div/>').addClass('dataLoad').html('loading data..'))

            $('#win_device div.win_icon').removeClass('default').addClass('imageLoader')

            //parseTab:function(from,where,data,name){
            WIN.parseTab('device/window/' + this.id, this.container, {
                'tab': this.menuActive - 1
            }, 'win_device');
        } else {
            VPS.load()

        }


    },
    addNote: function(d) {
        f = $(d).parent().parent().parent()
        t = f.find('textarea')
        if (t.val().length > 0) {
            v = t.val()
            t.val('')
            $.postJSON('basic/device/notes/add', {
                'did': DEVICE.id,
                'txt': v
            }, function(json) {
                DEVICE.noteField(json)
            });

        }



    },
    notes: function(json) {


        this.noteset = $('<fieldset/>').appendTo(this.container)

        this.addNoteEl = $('<div>').css('margin-bottom', 20 + 'px').appendTo(this.noteset)

        $('<textarea/>').css({
            'width': '100%',
            'height': '69px'
        }).appendTo(this.addNoteEl)

        /*
         $('<button/>').addClass('addNote').text('add note').appendTo(this.addNoteEl)
         $('<button/>').addClass('clearNote').text('clear').appendTo(this.addNoteEl)
         */
        this.bb = $('<div/>').css({
            'height': '25px',
            'margin-left': '10px',
            'margin-top': '5px'
        }).html('<div style="float:left;"><a class="abutton addNote" href="#"><div class="inner">add note</div></a></div>').appendTo(this.addNoteEl)


        $.each(json.items, function(i, e) {

            DEVICE.noteField(e)

        })



    },
    delNote: function(d) {

        nid = $(d).attr('nid')
        $(d).parent().parent().remove()

        $.postJSON('basic/device/notes/rem', {
            'did': DEVICE.id,
            'nid': nid
        }, function(json) {

        });



    },
    noteField: function(e) {
        d = new Date(e.time * 1000)

        n = $('<div/>').addClass('notes').insertAfter(this.addNoteEl)
        h = $('<div/>').addClass('head').appendTo(n)

        del = $('<span/>').attr('nid', e.id).addClass('rm').html('delete').appendTo(h)
        $('<span/>').addClass('date').text(d.format('isoDateTime')).appendTo(h)

        $('<div/>').text(e.user).appendTo(h)

        $('<div/>').addClass('txt').html(e.txt).appendTo(n)

        del.click(function() {
            DEVICE.delNote(this)

        });

        $('#win_device div.win_data').prop({
            'scrollTop': 0
        });

    },
    valid_element: function(el) {

        if (el[1] == 'network') {

            cv = Number($(DEVICE.cat).val())

            switch (cv) {
                case 1:
                case 2:
                case 3:
                case 8:
                    return true;
                    break;
                default:
                    return false;
                    break;
            }
        }

        return true

    },
    add_new_element: function(w) {
        TEMPLATE.init()
        this.container = w


        this.win = new nocwin('Add new element', '', 'addelement');


        d = this.win.data

        $(d).html('<fieldset style="margin-top:10px;"><legend>Element name:</legend><input class="size_large2"></fieldset>' +
                '<fieldset><legend>Type of element:</legend><select class="size_large2"></select></fieldset>' +
                '<fieldset style="position:absolute;bottom:10px;right:10px;"><legend></legend>' +
                '<div style="float:right;margin-right:10px;"><a class="abutton save" href="#"><div class="inner">add</div></a></div>' +
                '<div style="float:right;margin-right:20px;"><a class="abutton close" href="#"><div class="inner">cancel</div></a></div></fieldset>'
                )

        o = ''

        $.each(TEMPLATE.elements, function(i, e) {

            if (DEVICE.valid_element(e))
                o += '<option value="' + i + '">' + e[0] + '</option>';
        })
        $(d).find('select').html(o)


        //close win
        $(this.win.div).find('div.win_close').click(function() {
            DEVICE.win.remove()
        });
        //add element
        $(this.win.div).find('a.save').click(function() {
            DEVICE.addField()
        });

        //cancel
        $(this.win.div).find('a.close').click(function() {
            DEVICE.win.remove()
        });



    },
    action: function(div) {



        $(div).find('li').click(function() {

            switch ($(this).attr('m')) {
                case '1':
                    DEVICE.rename_field(this)
                    break;
                case '2':
                    DEVICE.delete_field(this)
                    break;

            }



        });

        /*
         $(div).find('div.check_box').click(function(){
         
         ic=$(this).find('div.icons')
         
         if($(ic).hasClass('active')){
         $(ic).removeClass('active')	
         
         }else{
         $(ic).addClass('active')	
         
         }
         
         })	
         */
    },
    disableWindow: function(key) {

        if (key) {
            $('#win_device_mask').show()
            $(this.icondiv).removeClass('win_icon')
            $(this.icondiv).addClass('imageLoader')

        } else {

            $(this.icondiv).addClass('win_icon')
            $(this.icondiv).removeClass('imageLoader')
            $('#win_device_mask').hide()

        }
    },
    addField: function() {


        DEVICE.disableWindow(false)
        win = DEVICE.win.data
        field = $(this.container).parent()
        tab = $(field).attr('tab')

        name = $(win).find('input').val()
        v = $(win).find('select').val()
        if (name.length > 0) {


            nf = this.makeAddField(TEMPLATE.elements[v][1], name)



            this.nf = nf
            this.tab = Number(tab) - 1
            $.postJSON('basic/device/element/new', {
                'tid': DEVICE.id,
                'tab': this.tab,
                'type': v,
                'name': name
            }, function(json) {

                $(DEVICE.nf).attr({
                    'eid': json.id,
                    'tab': DEVICE.menuActive
                })

                DEVICE.action(DEVICE.nf)
                //this.editaction(nf)
                WIN.elementActionSet(DEVICE.nf)


                DEVICE.disableWindow(false)
            });




            nf.insertBefore(field)
            this.win.remove()
            objDiv = $('#win_device_template div.win_data')
            objDiv[0].scrollTop = objDiv[0].scrollHeight;
        } else {
            $(win).find('input').focus()

        }






    },
    makeAddField: function(type, name) {

        fs = $('<fieldset/>')
        leg = $('<legend/>').addClass('fieldmenu').appendTo(fs)
        leg.html('<a class="menu_a" href="#"><div class="name"></div><ul class="field_submenu"><li m="1">rename</li><li m="2">delete</li></ul></a>')
        $(leg).find('div.name').text(name)

        el = $('<div/>').addClass('element').appendTo(fs)

        m = new Object();
        m.element = type
        m.value = 0
        m.action = 'device'
        m.noact = true
        //console.log(type,name)
        WIN.switchType(m, el)





        return fs



    },
    rename_field: function(d) {
        p = $(d).parent().parent().parent().parent()
        this.old_name = $(p).find('div.name').text()
        $(p).find('a').hide()
        leg = $(p).find('legend')

        $('<input/>').addClass('smallsize').val(this.old_name).appendTo(leg)




        $(p).find('input.smallsize').bind('blur keydown', function(e) {

            ent = false;
            if (e.type == 'keydown') {
                if (e.keyCode == 13) {
                    ent = true
                }

            }


            if (e.type == 'blur' || ent) {
                new_name = $(this).val()

                fid = $(this).parent().parent().attr('eid')




                $(this).parent().find('a').show()


                if (new_name.length < 1) {

                    $(this).parent().find('div.name').text(DEVICE.old_name)



                } else {

                    $(this).parent().find('div.name').text($(this).val())



                    if (DEVICE.old_name != new_name) {



                        $.postJSON('basic/device/element/rename', {
                            'fid': fid,
                            'name': new_name
                        }, function(json) {
                            //console.log(json)


                        });


                    }
                }
                $(this).parent().find('input.smallsize').remove()


            }

        }).focus()





    },
    delete_field: function(d) {
        p = $(d).parent().parent().parent().parent()
        fid = $(p).attr('eid')
        $(p).remove()

        $.postJSON('basic/device/element/remove', {
            'fid': fid
        }, function(json) {


        });

    },
    loadFinish: function(div) {

        //	this.container.append(this.copy)	






        if (this.menuActive <= 4 && this.editmode && Number(this.cat) > 0) {


            fs = $('<fieldset/>').addClass('newfieldadd').attr('tab', DEVICE.menuActive).appendTo(div)

            leg = $('<legend/>').addClass('fieldmenu').html('<span class="anew">Add new element</span>').appendTo(fs)



            $('<div/>').addClass('add_element').html('<div class="icons"></div>').appendTo(fs).click(function() {

                DEVICE.add_new_element(this);

            });

            //TEMPLATE.addField(this)

        }

        if (Number(this.cat) == 0) {

            $(div).html(
                    '<div class="info">' +
                    'No Device Category selected' +
                    '<br>' +
                    '<span>Please goto General tab and select category!</span>' +
                    '</div>')

        }





        $('#win_device_mask').hide()

        $('#win_device div.win_icon').addClass('default').removeClass('imageLoader')

//$(this.winicon).addClass('win_icon').removeClass('imageLoader')

//	this.windowSetData(0);	


    },
    dragStop: function(ob) {
        /*
         stop drag rack_unit.. if we have opened window with that device.. change device parametars
         
         */
        if ($(ob).attr('id') == $(this.dev).attr('id')) {
            DEVICE.window($(ob).find('div.handler'))
        }


    },
    windowClosed: function() {

        if (this.dev)
            this.dev.removeClass('active')
        this.dev = false;
        this.rid = false;

    },
    makeClone: function() {

        this.clone = this.dev.clone()
        this.clone.attr('id', '')
        this.clone.appendTo(this.dev.parent())
        this.clone.addClass('testClon')
        //revert top and bottom


        CAGE.me = this.clone
        CAGE.rack = this.clone.parent().parent()
        //mt=RAID.rh-$(CAGE.rack).height()	
        mt = CAGE._mt(CAGE.rack)
        //rack left position px
        CAGE.r_l = $(CAGE.rack).offset().left - $('#cage').position().left

        //position of rack relative
        CAGE.col = Math.round(CAGE.r_l / 260)
        CAGE.pos = $('#cage').find($(rack)).index()

        //initial settings
        CAGE.me_data = Array();
        //object to drag left and top position  ;relative	
        CAGE.me_data.push(this.clone.position().left, this.clone.position().top, mt)



//$(this.clone).css({'top'})
    },
    removeClone: function() {
        this.clone.remove()

    },
    check_positions: function() {

        $('#win_dev_5').html('')

        rack = $('#' + this.rid)
        r_l = $(rack).offset().left - $('#cage').position().left
        pos = Math.round(r_l / 260)


        //lets try all position in rack.. test for colision
        DEVICE.makeClone()
        data = []
        for (i = 0; i < DEVICE.ru; i++) {
            data[i] = true;
        }

        h = $(DEVICE.clone).height() - 2
        $(DEVICE.clone).css({
            'height': h + 'px'
        })


        for (x = 0; x < DEVICE.ru; x++) {
            b = x * 18 + 23

            $(DEVICE.clone).css({
                'bottom': b + 'px'
            })
            CAGE.colision(DEVICE.clone, CAGE.rack)
            data[x] = CAGE.drop


        }


        DEVICE.removeClone()


        for (i = 0; i < DEVICE.ru; i++) {
            if (data[i]) {
                a = i + 1
                $('#win_dev_5').append($('<option></option>').val(a).html(a))


            }
        }

        CAGE.drag = false
        CAGE.me = false
        CAGE.clone = false

    },
    changeDeviceType: function(t) {
        d = Number($('#win_dev_20').val())
        if (d != DEVICE.type) {

            DEVICE.loadings(true)

            $.postJSON('basic/templates/device/edit', {
                'did': DEVICE.id,
                'type': d
            }, function(json) {



                DEVICE.loadings(false)


                if (json.error) {



                    sel = ''
                    $.each($('#win_dev_20 option'), function(i, e) {
                        if ($(e).attr('value') == DEVICE.type)
                            sel = i


                    });


                    $('#win_dev_20').prop('selectedIndex', sel)

                    alert(json.error)
                } else {

                    DEVICE.type = Number(json.type)
                    DEVICE.cat = Number(json.cat)




                    vert = false;



                    DEVICE.emptyMenu()
                    if (DEVICE.cat == 4) {

                        if ($('#vertPDU' + json.id).length > 0) {
                            vert = true
                            h = Number(json.out) * 14;

                            $('#vertPDU' + json.id).attr({
                                'e_t': json.type,
                                'e_c': json.cat
                            }).attr('out', json.out).css('height', h + 'px')

                        }
                    }

                    if (!vert) {
                        $('#rack_unit' + DEVICE.id).removeClass('equ' + DEVICE.cat).attr({
                            'e_t': json.type,
                            'e_c': json.cat
                        }).addClass('equ' + json.cat)

                    }


                    if (DEVICE.sel20data) {

                        DEVICE.loadSel(DEVICE.sel20data)
                    }
                }
            });
        }
    },
    emptyMenu: function(num) {

        this.menuArray = Array(num);
        for (i = 0; i <= num; i++)
            this.menuArray[i] = 0;



    },
    pdu: function(h) {

        if (!this.menuActive) {
            this.menuActive = 1
        }


        if (this.dev)
            this.dev.removeClass('active')
        if (this.dev != h.parent()) {
            num = $('#win_device div.win_menu li').length


            this.emptyMenu()
        }


        /*
         this.dev=h.parent()	
         this.load()
         */

        //console.warn('win device menu:'+this.menuActive)
        this.dev = h.parent()
        this.id = $(this.dev).attr('did')
        this.windowSetData(h)
        this.menutype();
        this.menu(this.menuActive)

    },
    menutype: function() {
        //console.log('menutype')
        d_c = Number(this.dev.attr('e_c'))

        last = $('#win_device').find('div.win_menu li').last()



        if (d_c == 1) { //server
            $($('#win_device').find('div.win_menu li')[6]).show()

        } else {
            $($('#win_device').find('div.win_menu li')[6]).hide()
            if (this.menuActive == 7) {
                this.forceMenu(0)
            }

        }

    },
    window: function(h) {

        if (!this.menuActive) {
            this.menuActive = 1
        }



        if (this.dev)
            this.dev.removeClass('active')
        if (this.dev != h.parent()) {
            num = $('#win_device div.win_menu li').length


            this.emptyMenu()
        }
        /*
         this.dev=h.parent()	
         this.load()
         */

        //console.warn('win device menu:'+this.menuActive)
        this.dev = h.parent()

        this.menutype()

        this.id = $(this.dev).attr('id').replace('rack_unit', '').replace('vertPDU', '')

        this.windowSetData(h)
        this.menu(this.menuActive)

    },
    loadSel: function(m) {

        DEVICE.sel20data = m


        sel = $('#win_dev_20')

        sel.html('')
        //for device window



        selected = false
        $.each(m.data, function(i, d) {
            o = $('<option/>').val(d.id).text(d.name).appendTo(sel)
            //os=$('<option/>').val(d.id).text(d.name).appendTo(dev_sel)

            if (DEVICE.type == d.id) {
                o.attr('selected', 'selected')
                selected = true
            }


        });


        empty = false
        //if device type=0
        if (DEVICE.type == 0 || !selected) {
            empty = true
        }



        if (empty) {
            o = $('<option/>').val(0).text('..').attr('selected', 'selected').appendTo(sel)

        }
        $('#dev_data_temp').text($('#win_dev_20').find('option:selected').text())

    },
    loadDeviceType: function(auto, cat) {
        this.auto = auto
        if (cat > 0) {

            $.postJSON(
                    "/basic/device/category",
                    {
                        'cat': cat,
                        'did': DEVICE.id,
                        'auto': auto
                    },
            function(json) {

                if (json.auto == "false") {


                    $('#rack_unit' + DEVICE.id).removeClass('equ' + DEVICE.cat).attr({
                        'e_t': 0,
                        'e_c': json.cat
                    }).addClass('equ' + json.cat)
                    DEVICE.loadings(false)
                    DEVICE.type = 0
                    DEVICE.cat = Number(json.cat)
                    DEVICE.menutype();
                    DEVICE.emptyMenu()


                }



                DEVICE.loadSel(json.d)
                Hook.call('deviceOnCategory', DEVICE.dev)
            });

        }
        if (cat == 0) {
            $('#dev_data_temp').text('None')
            DEVICE.tempOb.html('<option>none</option>')
        }


    },
    editModeSet: function() {
        DEVICE.emptyMenu()

        if (DEVICE.editmode) {
            $('#dev_edit').html('Edit')
            $('#win_device div.win_header').removeClass('editmode')
            DEVICE.editmode = false
            WIN.activateTab('#win_device', 0)

            DEVICE.upLayer0();
        } else {
            $('#dev_edit').html('Close edit')

            //edit
            $('#win_device div.win_header').addClass('editmode')
            DEVICE.editmode = true
            WIN.activateTab('#win_device', 1)
        }
    },
    windowSetData: function(h) {

        if (!this.firstSet) {

            this.icondiv = $('#qin_device div.win_icon')

            //dev
            //action on dropbox

            $('#win_device_layer1 div.edit_action li').click(function() {
                switch (Number($(this).attr('m'))) {

                    case 1:
                        //edit
                        DEVICE.emptyMenu()
                        $('#win_device div.win_header').removeClass('editmode')
                        DEVICE.editmode = false
                        WIN.activateTab('#win_device', 0)
                        $('#dev_edit').html('Edit')
                        DEVICE.upLayer0();
                        //DEVICE.windowSetData(DEVICE.tempH)


                        break;

                    case 2:
                        //export	



                        name = $('#dev_data_host').text()

                        window.open('basic/device/export/devices/' + DEVICE.id + '/' + name + '.zip');


                        break;

                    case 3:
                        //delete	

                        DEVICE.remove(false)
                        break;

                }

            });

            //action on dropbox

            $('#win_device_layer0 div.edit_action li').click(function() {
                switch (Number($(this).attr('m'))) {

                    case 1:
                        DEVICE.emptyMenu()
                        //edit
                        $('#win_device div.win_header').addClass('editmode')
                        DEVICE.editmode = true
                        WIN.activateTab('#win_device', 1)
                        $('#dev_edit').html('Close edit')
                        break;

                    case 2:
                        //export	
                        name = $('#dev_data_host').text()

                        window.open('basic/device/export/devices/' + DEVICE.id + '/' + name + '.zip');

                        break;

                    case 3:
                        //delete	

                        DEVICE.remove(false)
                        break;

                }

            });


            $('#win_device_layer1 input').bind('keydown focus blur', function(e) {


                if (e.type == 'keydown') {
                    if (e.keyCode == 13) {
                        $(this).blur()
                    }

                }


                if (e.type == 'focus')
                    $(this).addClass('focused')


                if (e.type == 'blur') {

                    $(this).removeClass('focused')

                    id = Number($(this).attr('id').split('win_dev_')[1])

                    switch (id) {


                        case 2:
                            if (DEVICE.dev) {
                                if ($(this).val().length < 1) {
                                    alert("Please input correct hostname!")
                                    $(this).val('hostname')
                                }
                                name = $('#win_dev_2').val()
                                if (DEVICE.dev.attr('pduid')) {
                                    //PDU
                                    DEVICE.dev.attr('name', name)
                                }
                                else {
                                    DEVICE.dev.find('div.name').text(name)
                                }

                                if (typeof NAGIOS !== 'undefined')
                                    NAGIOS.updateDevice(DEVICE.id, name, DEVICE.name)


                                DEVICE.name = name

                                $.postJSON('basic/device/data/rename', {
                                    'id': DEVICE.id,
                                    'name': name
                                }, function(json) {


                                });
                            }
                            break;


                    }

                }


            })

            $('#win_device_layer1 select').change(function() {
                id = Number($(this).attr('id').split('win_dev_')[1])

                switch (id) {


                    //type of device
                    case 20:
                        DEVICE.changeDeviceType()

                        break;

                    case 1:
                        DEVICE.loadings(true)

                        DEVICE.loadDeviceType(false, $(this).val())



                        break;
                        //hostname
                    case 2:
                        if ($(this).val().length < 1) {
                            alert("Please input correct hostname!")
                            $(this).val('hostname')
                        }
                        name = $('#win_dev_2').val()


                        if (DEVICE.dev.attr('pduid')) {
                            //PDU
                            DEVICE.dev.attr('name', name)
                        }
                        else {
                            DEVICE.dev.find('div.name').text(name)
                        }
                        DEVICE.loadings(true)
                        $.postJSON('basic/device/data/rename', {
                            'id': DEVICE.id,
                            'name': name
                        }, function(json) {

                            DEVICE.loadings(false)

                        });

                        break;
                        //parent device
                    case 3:
                        DEVICE.changeParent(this)

                        break;

                        //rack position
                    case 5:
                        //##############################################################################################
                        val = Number($(this).val())
                        bb = val - 1
                        b = bb * 18 + 21;
                        $(DEVICE.dev).attr('e_p', val).css('bottom', b)
                        DEVICE.changePosition(DEVICE.dev)

                        CAGE.matrix()
                        break;

                        //num of rack units
                    case 6:
                        //##############################################################################################
                        //make clone and see if there colision
                        new_u = Number($(this).val())
                        old_u = Number(DEVICE.dev.attr('e_u'))

                        h = new_u * 18
                        //if new heights is greater than old height
                        set = true;
                        if (new_u > old_u) {

                            DEVICE.makeClone()
                            //lets try desired height

                            $(DEVICE.clone).css('height', h + 'px')
                            CAGE.colision(DEVICE.clone, CAGE.rack)
                            DEVICE.removeClone()
                            if (!CAGE.drop) {
                                $(this).val(old_u)
                                alert("There is not enough space in rack, please select smaller number of units.")
                                set = false;
                            }
                        }

                        if (set) {
                            $(DEVICE.dev).css('height', h + 'px').attr('e_u', new_u)
                            CAGE.matrix()
                            DEVICE.check_positions()
                            d_rp = DEVICE.dev.attr('e_p')
                            $('#win_dev_5').val(d_rp)

                            DEVICE.changeRUsize(DEVICE.dev)

                        }

                        break;
                }



            });
            this.firstSet = true;
        }



        this.dev.addClass('active')

//category of device
        d_c = Number(this.dev.attr('e_c'))
        $('#win_dev_1').val(d_c)
        $('#dev_data_cat').text($('#win_dev_1').find('option:selected').text())
        this.cat = d_c
        this.catOb = $('#win_dev_1')
        this.tempOb = $('#win_dev_20')

//type of device


        d_t = Number(this.dev.attr('e_t'))
        this.type = d_t
//load from server
        this.loadDeviceType(true, this.cat)


//hostname
        d_h = this.dev.find('div.name').text()
        if (this.dev.attr('pduid')) {
            d_h = this.dev.attr('name')
            $('#win_dev_1').attr('disabled', '')
            $('#win_dev_5').attr('disabled', '')
            $('#win_dev_6').attr('disabled', '')
        } else {
            $('#win_dev_1').removeAttr('disabled')
            $('#win_dev_5').removeAttr('disabled')
            $('#win_dev_6').removeAttr('disabled')
        }

        $('#win_dev_2').val(d_h)
        $('#dev_data_host').text(d_h)


        DEVICE.name = d_h
//parent device
        /*
         server -> parent -> switch, router,server
         router ->router
         switch ->parent ->router,switch
         ---------------------------------------------------------------------------------------
         server->server
         switch->switch,server
         router->witch,server,router
         ---------------------------------------------------------------------------------------
         */


        pd = Number($(this.dev).attr('pd'))

        this.roomdevices('#win_dev_3', pd, true)

//rack
        this.rid = RACK.getId(this.dev)
        d_rn = $('#' + this.rid).find('div.rack_head span').text()

        $('#dev_data_rack').text(d_rn)
        $('#win_dev_4').val(d_rn)

//rack units
        d_ru = this.dev.attr('e_u')

        $('#win_dev_6').val(d_ru)
        $('#dev_data_ru').text(d_ru)

//rack position
        d_rp = this.dev.attr('e_p')


//total r_units
        this.ru = $('#' + this.rid).attr('ru') - d_ru + 1


        DEVICE.check_positions()

        $('#win_dev_5').val(d_rp)
        $('#dev_data_pos').text(d_rp)

        this.upName()


        this.tempH = h

    },
    upLayer0: function() {
        //hostname
        d_h = this.dev.find('div.name').text()
        if (this.dev.attr('pduid')) {
            d_h = this.dev.attr('name')
        }

        $('#dev_data_host').text(d_h)
        //category
        $('#dev_data_cat').text($('#win_dev_1').find('option:selected').text())
        //template
        $('#dev_data_temp').text($('#win_dev_20').find('option:selected').text())
        //parentdevice
        $('#dev_data_parent').text($('#win_dev_3').find('option:selected').text())

        //rack name
        $('#dev_data_rack').text($('#win_dev_4').val())

        //rack units
        d_ru = this.dev.attr('e_u')
        $('#dev_data_ru').text(d_ru)

        //rack position
        d_rp = this.dev.attr('e_p')
        $('#dev_data_pos').text(d_rp)

    },
    upName: function() {
        $('#win_device div.win_header_name span').text(':: ' + $('#win_dev_2').val())

    },
    roomdevices: function(select, pd, none) {

        items = $('#row div.rack_unit')



        devices = []
        cats = $('#win_dev_1 option')

        if (none) {
            $(select).html('<option value="0">None</option>')
        }
        $.each(items, function(i, item) {
            write = false
            //type of device 
            type = Number($(item).attr('e_t'))

            cat = Number($(item).attr('e_c'))
            //id 

            if (DEVICE.dev.attr('pduid')) {
                //PDU

                if (cat == 4 || cat == 7 || cat == 10) {

                    write = true
                }
                ;
            }
            else {
                if (cat > 0)
                    write = true;


            }


            id = $(item).attr('id')
            name = $(item).find('div.name').html()
            //rack
            rack = RACK.getId(item)	//loop parent id







            if (write) {

                c = cat != 0 ? $(cats[cat]).text() : undefined;

                pid = Number(id.replace('rack_unit', ''))



                op = $('<option></option>').addClass('option_small').attr({
                    'value': id,
                    'rack': rack
                }).html(name + ' / ' + c)

                $(select).append(op)
                if (pd == pid) {
                    op.attr('selected', 'selected')
                }


            }

        });


        if ($(this.dev).attr('pduid')) {
            items = $('#row div.pdu')
            $.each(items, function(i, item) {
                id = $(item).attr('did')
                name = $(item).attr('name')
                rack = RACK.getId(item)	//loop parent id
                op = $('<option></option>').addClass('option_small').attr({
                    'value': id,
                    'rack': rack
                }).html(name + ' / PDU (v)')

                if (pd == id) {
                    op.attr('selected', 'selected')
                }

                $(select).append(op)

            });
        }


        $('#dev_data_parent').text($('#win_dev_3').find('option:selected').text())
    }

}

