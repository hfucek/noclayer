var DEBUG = {
    init: function() {
        
 
        this.div = $('<div/>').attr('id', 'debuger').addClass('debuger').html('<div class="head"><span>DEBUGER</span></div><div id="debugdata">sdadasdas</div>').appendTo($('#windows'))

        $('#debuger').hide()

        $("#debuger div.head").mousedown(function() {


            $(this).parent().draggable({
                'containment': 'parent',
                start: function(event, ui) {

                    // postavit sve ostale prozore na 1



                },
                drag: function() {


                },
                stop: function(event, ui) {
                    if ($(this).draggable)
                        $(this).draggable("destroy");
                }
            });
        });

    },
    log: function(l) {
        $('#debugdata').html(l)

    }



}

var CABLE = {
    close: function() {
        $('#win_minimap').hide()
        $('#win_tools').hide()
        //WIN.close('#win_minimap')
        //MINIMAP.close();


   },
    head_data: function() {
        $('#cable_head').html(
                '<li class="menu_div">' +
                '<a class="menu_a" style="width: 100px;" href="#"><div class="menu_name">View</div></a>' +
                '<ul class="sub_menu clasps">' +
                '<li class="sub_menu_div"><a m="1" class="clasp_click" id="view_minimap" act="1" href="#"><div>Minimap</div><div class="clasp claspAct"></div> </a></li>' +
                '<li class="sub_menu_div"><a m="2" class="clasp_click" id="view_tool" act="1" href="#"><div>Tools</div><div class="clasp claspAct"></div> </a></li></ul></li>' +
                '<li class="menu_div"><a class="menu_a" style="width: 100px;" href="#"><div class="menu_name">Cables</div></a>' +
                '<ul class="sub_menu chboxs">' +
                '<li class="sub_menu_div"><a m="1" class="chbox_click" act="1" href="#"><div>UTP/Fiber</div><div class="chbox chboxAct"></div> </a></li>' +
                '<li class="sub_menu_div"><a m="2" class="chbox_click" href="#"><div>Power supply</div><div class="chbox"></div> </a></li>' +
                '<li class="sub_menu_div"><a m="3" class="chbox_click" href="#"><div>KVM switch</div><div class="chbox"></div> </a></li>' +
                '<li class="sub_menu_div"><a m="4" class="chbox_click" href="#"><div>Patch panel</div><div class="chbox"></div> </a></li>' +
                '</ul></li>')

        //add head menu
        $('#headmenu_cable').html(
                '<a class="menu_a" style="width: 100px;" href="#"><div class="icon_menu">' +
                '<div class="icons cable_icon  hint" act="no" hint="Activate cable mode!"></div>' +
                '</div></a>'
                )

        NOC.setNavAction();


    },
    init: function() {

        this.toolsTmp = 0
        this.mode = false;
        this.devices = Array()
        this.racks = Array()
        this.panelPoints = Array()
        this.overPanel = 0
        this.tmpPoint = 0
        this.actionType = 0
        //DEBUG.init()
        this.tools = true
        //cable mode
        this.modset = 1
        this.head_data()
        //panel glass navigation



        $("#content").scrollTop(0)
        $("#content").scrollLeft(0)

        //          <ulstyle="background: #f8f8f8; right: 300px; position: absolute; display: none;"id="cableHead" class="menu">        






        this.loadingDiv = $('<div/>').addClass('cableload').html(
                '<div class="ico"></div><div class="data">Loading cable data...</div>').appendTo($('#windows'))



        this.div = $('#cableview');
        this.div.scrollLeft(0);

        $("div.tool div.ico").click(function() {

            t = Number($(this).attr('t'))



            $(this).parent().parent().find('div.tool').removeClass('tool_act')
            if (CABLE.actionType != t) {
                $(this).parent().addClass('tool_act')
                CABLE.actionType = t
                if (CABLE.plotWire) {
                    CABLE.plotWire = false

                }

                CABLE.activatePorts()

            } else {
                CABLE.escKey()

            }
            //$('#content').removeClass('cable_add').removeClass('cable_rem').removeClass('cable_move')

            // show/hide placeholder
            switch (t) {
                case 1:
                    if(!CABLE.showPlace || $('.tool_act').length)
                        CABLE.pointPlaceholder(true);
                    else
                        CABLE.pointPlaceholder(false);
                    break;
                case 2:
                case 3:
                    CABLE.pointPlaceholder(false);
            }
        });


        $("#win_minimap").resizable(
                {
                    minHeight: 220,
                    minWidth: 400,
                    maxHeight: 350,
                    maxWidth: 900
                });

        $("#win_minimap").resize(function(e) {

            //get header and menu height

            wh = $(this).find('div.win_header').height()
            wm = $(this).find('div.win_menu').height()

            h = $(this).height()
            w = $(this).width()
            ht = h - (wh + wm)
            $(this).find('div.win_data').css({
                'height': ht + 'px',
                'width': w + 'px'
            })


            MINIMAP.resize()






        });

        //$('#').scrollLeft(0);

        //local variables for mouse position

        $(document).mouseup(function(e) {

            CABLE.stopDrag()
        });
        $(this.div).mousemove(function(e) {
            CABLE.m_x = e.pageX;
            CABLE.m_y = e.pageY;
            CABLE.updatePosition()

        });

        $(document).keyup(function(e) {

            if (e.keyCode == 27) {

                CABLE.escKey()
            }

        });



        //panels
        /*
         this.left_panel=$('#cable_navig div.left_panel');
         this.right_panel=$('#cable_navig div.right_panel');
         //right panel action
         this.right_panel<.click(function(){
         CABLE.next()
         });
         //left panel action
         this.left_panel.click(function(){
         CABLE.prev()
         });
         */
        /*		
         this.right_panel.mouseover(function(){
         if(CAGE.drag) CAGE.next()
         });
         
         this.left_panel.mouseover(function(){
         if(CAGE.drag) CAGE.prev()
         });
         
         */



        //actions

        $('#header a.clasp_click').click(function() {


            m = Number($(this).attr('m'))
            act = Number($(this).attr('act'))

            switch (m) {
                case 1:
                    if (act == 1) {
                        MINIMAP.active = false;
                        WIN.close('#win_minimap')
                    } else {
                        WIN.show('#win_minimap')
                        MINIMAP.active = true;
                        MINIMAP.resize()
                    }
                    break;
                case 2:
                    if (act == 1) {
                        CABLE.tools = false;
                        WIN.close('#win_tools')
                    } else {
                        CABLE.tools = true;
                        WIN.show('#win_tools')

                    }

                    break;




            }


            if (act == 1) {
                $(this).attr('act', 0)
                $(this).parent().find('div.clasp').removeClass('claspAct')

            } else {

                $(this).attr('act', 1)
                $(this).parent().find('div.clasp').addClass('claspAct')

            }




            //

            //CABLE.modeset(m)



        });

        $('#header a.chbox_click').click(function() {

            $('#win_mask4').show()

            $(this).parent().parent().find('div.chbox').removeClass('chboxAct')

            $(this).parent().find('div.chbox').addClass('chboxAct')

            m = Number($(this).attr('m'))

            CABLE.modeset(m)

        });


        $('#header div.cable_icon').click(function() {

            ac = $(this).attr('act')
            if (ac != 'ok') {
                $(this).attr('act', 'ok')
                $(this).find('div').html('disable')

                $('#room_action').parent().hide()
                CABLE.mode = true;
                $('#room').hide()
                $('#cables').show()
                $('#cables').css('top', '0px')
                $('#content').addClass('overflowmode')
                $('#header').addClass('cablemode')
                $('#cable_head').show()
                $(this).attr('hint', 'Deactivate cable mode!')

                $(this).addClass('cable_icon2').removeClass('cable_icon')
                $('#cableview').html('')
                CABLE.plot()
            } else {
                $(this).attr('hint', 'Activate cable mode!')
                $(this).addClass('cable_icon').removeClass('cable_icon2')
                $(this).attr('act', 'no')
                $(this).find('div').html('enable')
                $('#content').removeClass('overflowmode')
                $('#cableview').html('')
                $('#cables').css('top', '-10000px')
                $('#cable_head').hide()
                $('#room_action').parent().show()
                $('#room').show()
                $('#cables').hide()
                $('#content').scrollLeft(0)
                $('#content').scrollTop(0)

                CABLE.close()
                CABLE.mode = false;
                $('#header').removeClass('cablemode')
            }







        });


    },
    reset: function() {

        $('#cableview').css({
            'left': '0px'
        })

        this.position()
    },
    rack: function(item, num, col, units, up) {

        x = 140 + col * 800
        y = 8900 - units * 180 - 120

        if (up && num != 0)
            y -= 10

        var g = CABLE.svg.group(CABLE.view, 'cable_rack' + num, {
            stroke: 'black',
            'ru': num,
            'stroke-width': 1,
            'col': item.col,
            'transform': 'translate(' + x + ',' + y + ')'
        });
        if (num >= 0) {

            CABLE.vertical[num] = [[0], [0], [0]]

        }
        color = '#1E90FF';

        for (i = 1; i <= item.units; i++) {

            this.svg.text(g, -123, item.units * 180 - 180 * i + 106, i + '', {
                'text-anchor': 'middle',
                'style': 'font-family:Coda;font-size:14px;stroke:#A1A1A1;fill:none;'
            });

            this.svg.line(g, -130, 180 * i, 620, 180 * i, {
                stroke: '#AFD4FA',
                fill: 'none',
                'stroke-width': 1,
                'shape-rendering': 'crispEdges',
                'stroke-dasharray': '25,10,2,10'
            });


        }

        /*
         this.svg.line(g, 0, -y+50, 510,-y+50,{stroke: color,fill:'none',
         'stroke-width': 1,'shape-rendering':'crispEdges'});
         
         this.svg.line(g, 0, -y+40, 0,-30,{stroke: color,fill:'none',
         'stroke-width': 1,'shape-rendering':'crispEdges','stroke-dasharray':'15,5'});
         
         this.svg.line(g, 510, -y+40, 510,-30,{stroke: color,fill:'none',
         'stroke-width': 1,'shape-rendering':'crispEdges','stroke-dasharray':'15,5'});
         
         
         
         this.svg.polygon(g, [[0,-y+50],[6,-y+53],[6,-y+47]],{stroke: 'none',fill:color,
         'stroke-width': 1,'shape-rendering':'crispEdges'});
         
         this.svg.polygon(g, [[510,-y+50],[504,-y+53],[504,-y+47]],{stroke: 'none',fill:color,
         'stroke-width': 1,'shape-rendering':'crispEdges'});
         
         */
        this.svg.text(g, 550 / 2, -15, item.name, {
            'text-anchor': 'middle',
            'style': 'font-family:Coda;font-size:16px;stroke:none;fill:' + color + ';'
        });
        //this.svg.text(g, 510/2, -y+60, item.units,{'text-anchor':'middle','style':'font-family:Coda;font-size:10px;stroke:none;fill:'+color+';'});


        this.svg.rect(g, -107, -10, 770, item.units * 180 + 10, {
            stroke: '#888',
            fill: 'none',
            'stroke-width': 1,
            'shape-rendering': 'crispEdges',
            'stroke-dasharray': '15,5,2,5'
        });



        return g;




    },
    diff: function(a, b) {
        if (a >= b)
            return a - b;
        else
            return b - a

    },
    half: function(q, z, y) {
        zz = 12 - z
        dy = 5 * zz

        if (q == 2)
            dy += 3;

        if (q <= 2) {
            y -= dy
        } else {
            y += dy

        }




        return y;
    },
    pathfinder: function(t1, t2, rack, clock, color, rackdata) {


            
        
       
            
            p11 = t1.pop()
            p22 = t2.pop()
        

        x1 = p11[0];
        y1 = p11[1];
        x2 = p22[0];
        y2 = p22[1];

        points = []


        //patch panel 
        if (rackdata.patch) {
            
            points.push([x1, y1])
            points.push([x1, y2])
            //points.push([xx1,CABLE.outsides+add])
            //points.push([xx2,CABLE.outsides+add])
            points.push([x2, y2])
            
            
            return points;
        }


        //points is in same rack
        if (rackdata.srack) {

            //is t1 and t2 on same side
            if (rackdata.r1 == rackdata.r2) {


                if (!CABLE.plotWire)
                    CABLE.vertical[rackdata.id1][rackdata.r1]++;

                if (CABLE.vertical[rackdata.id1][rackdata.r1] >= 12) {
                    CABLE.vertical[rackdata.id1][rackdata.r1] = 2
                }

                if (rackdata.r1 == 1) {
                    xx = rackdata.x1 - CABLE.vertical[rackdata.id1][rackdata.r1] * 5
                    if (CABLE.plotWire)
                        xx -= 5;
                } else {
                    xx = rackdata.x1 + CABLE.vertical[rackdata.id1][rackdata.r1] * 5 + 540
                    if (CABLE.plotWire)
                        xx += 5;
                }

                

                points.push([parseInt(xx), y1])
                points.push([parseInt(xx), y2])
                //points.push([x2,y2])




            } else {

                //check if wire come from vertical pdu

                if (rackdata.vert) {
                    //set wire to go from one side to another through floor 	





                    if (!CABLE.plotWire)
                        CABLE.vertical[rackdata.id1][1]++;
                    if (CABLE.vertical[rackdata.id1][1] >= 12)
                        CABLE.vertical[rackdata.id1][1] = 0

                    xx1 = rackdata.x1 - CABLE.vertical[rackdata.id1][1] * 5
                    if (CABLE.plotWire)
                        xx1 -= 5;




                    if (!CABLE.plotWire)
                        CABLE.vertical[rackdata.id1][2]++;
                    if (CABLE.vertical[rackdata.id1][2] >= 12)
                        CABLE.vertical[rackdata.id1][2] = 0
                    xx2 = rackdata.x1 + CABLE.vertical[rackdata.id1][2] * 5 + 540
                    if (CABLE.plotWire)
                        xx2 += 5;


                    add = (CABLE.plotWire) ? 10 : 0;

                    if (x1 > x2) {

                        points.push([xx2, y1])
                        points.push([xx2, CABLE.outsides + add])
                        points.push([xx1, CABLE.outsides + add])
                        points.push([xx1, y2])
                    } else {
                        points.push([xx1, y1])
                        points.push([xx1, CABLE.outsides + add])
                        points.push([xx2, CABLE.outsides + add])
                        points.push([xx2, y2])


                    }


                } else {


                    //t1 and t2 are not on same side
                    //first check where is less wires left or right 	
                    if (CABLE.vertical[rackdata.id1][1] < CABLE.vertical[rackdata.id1][2]) {
                        if (!CABLE.plotWire)
                            CABLE.vertical[rackdata.id1][1]++;
                        if (CABLE.vertical[rackdata.id1][1] >= 12)
                            CABLE.vertical[rackdata.id1][1] = 0

                        xx = rackdata.x1 - CABLE.vertical[rackdata.id1][1] * 5
                        if (CABLE.plotWire)
                            xx -= 5;
                    } else {
                        if (!CABLE.plotWire)
                            CABLE.vertical[rackdata.id1][2]++;
                        if (CABLE.vertical[rackdata.id1][2] >= 12)
                            CABLE.vertical[rackdata.id1][2] = 0
                        xx = rackdata.x1 + CABLE.vertical[rackdata.id1][2] * 5 + 540
                        if (CABLE.plotWire)
                            xx += 5;
                    }

                    

                    points.push([parseInt(xx), y1])
                    points.push([parseInt(xx), y2])

                   
                    
                }
            }

            //different racks	
        } else {
            //vertical for t1
            if (CABLE.vertical[rackdata.id1][1] <= CABLE.vertical[rackdata.id1][2]) {
                if (!CABLE.plotWire)
                    CABLE.vertical[rackdata.id1][1]++;
                if (CABLE.vertical[rackdata.id1][1] >= 12)
                    CABLE.vertical[rackdata.id1][1] = 0

                xx1 = rackdata.x1 - CABLE.vertical[rackdata.id1][1] * 5
                if (CABLE.plotWire)
                    xx1 -= 5;
            } else {
                if (!CABLE.plotWire)
                    CABLE.vertical[rackdata.id1][2]++;
                if (CABLE.vertical[rackdata.id1][2] >= 12)
                    CABLE.vertical[rackdata.id1][2] = 0
                xx1 = rackdata.x1 + CABLE.vertical[rackdata.id1][2] * 5 + 540
                if (CABLE.plotWire)
                    xx1 += 5;
            }

            //vertical for t2
            if (CABLE.vertical[rackdata.id2][1] <= CABLE.vertical[rackdata.id2][2]) {
                if (!CABLE.plotWire)
                    CABLE.vertical[rackdata.id2][1]++;
                if (CABLE.vertical[rackdata.id2][1] >= 12)
                    CABLE.vertical[rackdata.id2][1] = 0

                xx2 = rackdata.x2 - CABLE.vertical[rackdata.id2][1] * 5
                if (CABLE.plotWire)
                    xx2 -= 5;
            } else {
                if (!CABLE.plotWire)
                    CABLE.vertical[rackdata.id2][2]++;
                if (CABLE.vertical[rackdata.id2][2] >= 12)
                    CABLE.vertical[rackdata.id2][2] = 0
                xx2 = rackdata.x2 + CABLE.vertical[rackdata.id2][2] * 5 + 540
                if (CABLE.plotWire)
                    xx2 += 5;
            }
            if (!CABLE.plotWire)
                CABLE.outsides += 10;



            if (CABLE.outsides > 10010) {
                CABLE.outsides = 8795;


            }
            add = (CABLE.plotWire) ? 10 : 0;

            points.push([xx1, y1])
            points.push([xx1, CABLE.outsides + add])
            points.push([xx2, CABLE.outsides + add])
            points.push([xx2, y2])

            
        }

   

        return points
    },
    getRelPos: function(pin) {
        par = $(pin).parent().attr('transform')
        par = par.replace('translate(', '')
        par = par.replace(')', '')
        par = par.split(',')


        rh = Number(par[1])

        f = Math.floor(rh / 180)

        ff = Math.floor(f / 12);
        f -= ff * 12;
        return f;

    },
    kvmsockets: function(port, x, y, h, u, pin, vert) {
        x += 8;

        points = []
        m = port % 2;
        pp = Math.round(port / 2);

        f = this.getRelPos(pin)

        //input sockets	
        if (Number($(pin).attr('k')) == 1) {


            if (m == 1) {

                points.push([x, y])

                yy = y - (20 + pp * 5)


                points.push([x, yy])

                if (vert.x > x) {
                    xx = x + (600 - pp * 30)

                } else {
                    xx = x - (pp * 25) - 25 - f * 5
                }

                points.push([xx, yy])


            } else {

                points.push([x, y + 10])


                yy = y + (20 + pp * 5) + 8
                //device height
                if (h > 1)
                    yy += h * 50 - 50;

                points.push([x, yy])



                if (vert.x > x) {
                    xx = x + (600 - pp * 30)

                } else {
                    xx = x - (pp * 25) - 25 - f * 5
                }


                points.push([xx, yy])
                points.push([xx, yy])
            }


        }
        //output sockets	
        if (Number($(pin).attr('k')) == 2) {

            if (m == 1) {

                points.push([x, y])

                yy = y - (10 + pp * 5)
                points.push([x, yy])




                xx = x + (450 - pp * 30)



                points.push([xx, yy])

            } else {
                points.push([x, y + 10])





                yy = y + (10 + pp * 5) + 10
                //device height
                if (h > 1)
                    yy += h * 50 - 50;

                points.push([x, yy])



                mh = (460 - pp * 30)



                xx = x + mh

                points.push([xx, yy])

            }



        }



        return points;  },
    powersockets: function(port, x, y, h, u, pin, vert) {


        x += 2;

        points = []
        m = port % 2;
        pp = Math.round(port / 2);

        f = this.getRelPos(pin)
        //input sockets	


        if (Number($(pin).attr('t')) == 1) {



            if (m == 1) {

                points.push([x, y])

                yy = y - (20 + pp * 5)


                points.push([x, yy])

                if (Number(vert.s == 2)) {
                    xx = x + (590 - pp * 30) - f * 5

                } else {
                    xx = x - (pp * 25) - 10 - f * 5
                }



                points.push([xx, yy])


            } else {

                points.push([x, y + 10])


                yy = y + (20 + pp * 5) + 8
                //device height
                if (h > 1)
                    yy += h * 50 - 50;

                points.push([x, yy])



                if (Number(vert.s == 2)) {
                    xx = x + (590 - pp * 30) - f * 5

                } else {
                    xx = x - (pp * 25) - 15 - f * 5
                }


                points.push([xx, yy])

            }


        }
        //output sockets	
        if (Number($(pin).attr('t')) == 2) {

            if (m == 1) {

                points.push([x, y])

                yy = y - (10 + pp * 5)
                points.push([x, yy])




                xx = x + (420 - pp * 25)

                points.push([xx, yy])

            } else {
                points.push([x, y + 10])





                yy = y + (10 + pp * 5) + 10
                //device height
                if (h > 1)
                    yy += h * 50 - 50;

                points.push([x, yy])





                xx = x + (425 - pp * 25)

                points.push([xx, yy])

            }



        }



        return points;
    },
    out: function(port, x, y, h, u, pin, vert) {
        points = []







        if ($(pin).attr('vert')) {
            n = 0
            if ($(pin).attr('input'))
                n = Number($(pin).attr('input'))


            x += 2;
            side = Number($(pin).attr('side'))

            f = Math.floor(port / 12)

            dif = port - f * 12;




            //left
            if (side == 1) {
                xx = x + 17 + dif * 5 + n * 5
                points.push([x, y])
                points.push([x, y - 5])
                points.push([xx, y - 5])
                //points.push([xx,y-5])
            } else {
                xx = x - 17 - dif * 5 - n * 5
                points.push([x, y])
                points.push([x, y - 5])
                points.push([xx, y - 5])
                //points.push([xx,y-5])
            }






            return points;
        }




        //power sockets 
        if ($(pin).attr('t')) {
            return this.powersockets(port, x, y, h, u, pin, vert)
        }

        //power sockets 
        if ($(pin).attr('k')) {
            return this.kvmsockets(port, x, y, h, u, pin, vert)
        }


        //write port name






        if (u == 0) {

            if (port <= 12) {
                //upper left
                side = 1;

                points.push([x, y])

                yy = y - (15 + port * 5)
                points.push([x, yy])

                yy = y - (15 + port * 5)
                xx = x - (port * 20 + port * 5) - 5

                points.push([xx, yy])


            }

            if (port > 12 && port <= 24) {
                //upper right
                side = 2;
                points.push([x, y])

                pp = 25 - port

                yy = y - (10 + pp * 5) - 2
                points.push([x, yy])



                xx = x + (pp * 25) + 45

                points.push([xx, yy])


            }
            if (port > 24 && port <= 36) {
                //lower left
                side = 1;
                points.push([x, y + 10])

                pp = port - 24



                yy = y + (10 + pp * 5) + 8
                //device height
                if (h > 1)
                    yy += h * 50 - 50;

                points.push([x, yy])



                xx = x - (pp * 25)

                points.push([xx, yy])


            }

            if (port > 36 && port <= 48) {
                //upper right
                side = 2;
                points.push([x, y + 10])

                pp = 49 - port

                yy = y + (10 + pp * 5) + 14
                if (h > 1)
                    yy += h * 50 - 50;
                points.push([x, yy])



                xx = x + (pp * 25) + 45

                points.push([xx, yy])


            }
        }
        else {
            //UPLINKS
            side = 2;
            if (u <= 2) {
                points.push([x, y])

                pp = 4 - u

                yy = y - (10 + pp * 5) - 2
                points.push([x, yy])



                xx = x + (pp * 25) + 15

                points.push([xx, yy])

            } else {

                points.push([x, y + 8])

                pp = 7 - u

                yy = y + (10 + pp * 5) + 14
                if (h > 1)
                    yy += h * 50 - 50;
                points.push([x, yy])



                xx = x + (pp * 25) + 10

                points.push([xx, yy])

            }


        }

        // ignore vertical pdu when dragging patch panel
        //if (!CABLE.moveExtPanel) {

            //connection with vertical pdu oposite side left>right 
            if (Number(vert.s) == 1) {
                if (side == 2) {
                    xc = points.pop()
                    xc[0] = xc[0] - 595
                    points.push(xc)
                }
            }

            //connection with vertical pdu oposite side right>left 
            if (Number(vert.s) == 2) {
                if (side == 1) {
                    xc = points.pop()
                    xc[0] = xc[0] + 605
                    points.push(xc)
                }
            }
        //}



        return points;


    },
    getRack: function() {


    },
    sameRack: function(dev1, dev2) {

        //if($('#cable_dev'+dev1).attr('vert')) return 1;
        //if($('#cable_dev'+dev2).attr('vert')) return 2;




        if ($('#cable_dev' + dev1).parent().attr('id') == $('#cable_dev' + dev2).parent().attr('id'))
            return true;
        return false
    },
    rackDistance: function(rx1, rx2) {
        drx = this.diff(rx1, rx2);

        return Math.round(drx / 540);




    },
    quadrant: function(p) {
        if (p <= 12)
            return 1;
        if (p > 12 && p <= 24)
            return 2;
        if (p > 24 && p <= 36)
            return 3;
        if (p > 36)
            return 4;
   },
    clock: function(p1, p2) {


        /*1-12                  12-24
         * --------1--------x---------2------c------
         * --------3--------x---------4------------
         *25-36                 36-48
         */


        /*1-12                  12-24
         * --c------1--------x---------2------------
         * --------3--------x---------4------------
         *25-36                 36-48
         */

        q1 = this.quadrant(p1);
        q2 = this.quadrant(p2);

        z1 = p1
        z2 = p2

        if (q1 == 2) {
            z1 = 25 - p1
        }
        if (q1 == 3) {
            z1 = p1 - 24
        }
        if (q1 == 4) {
            z1 = 49 - p1
        }

        if (q2 == 2) {
            z2 = 25 - p2
        }
        if (q2 == 3) {
            z2 = p2 - 24
        }
        if (q2 == 4) {
            z2 = 49 - p2
        }

        return [q1, q2, z1, z2]

    },
    wireColor: function(dev1, dev2) {



        color = ['#aa0000', '#0000aa', '#FF7E00', '#000000', '#065F30', '#999999']

        //power distribution 
        if (this.modset == 2) {
            return color[3];

        }
        //KVM distribution 
        if (this.modset == 3) {
            return color[4];

        }



        c1 = Number($('#cable_dev' + dev1).attr('cat'))
        c2 = Number($('#cable_dev' + dev2).attr('cat'))

        //vertical pdu 
        if ($('#cable_dev' + dev1).attr('vert') || $('#cable_dev' + dev2).attr('vert')) {
            return color[4];
        }


        //switch>switch or router>router
        if (c1 == c2 && c1 > 1) {
            return color[1];

        }
        //server server
        if (c1 <= 1 && c2 <= 1) {
            return color[0];
        }

        if (c1 > 1 && c2 > 1) {
            return color[1];
        }


        if (c1 == 8 || c2 == 8) {
            return color[2];
        }




        return color[0];




   },
    elementPos: function(r1) {

        //fix when user go outside rack space to empty cage
        if ($(r1).attr('id') === undefined) {
            return [0, 0]
        }
        box1 = $(r1)[0].getScreenCTM();
        x = box1['e'] + $('#content').scrollLeft()
        y = box1['f'] - 35 + $('#content').scrollTop()


        return [x, y]


   },
    power: function(dev1, port1, dev2, port2, col, id) {

        console.info('power')

    },
    simulation_livepos: function(p1, p2, ld, pp, srack) {

        
        
        d1 = ld.dev

        vert = false
        if ($('#cable_dev' + d1).attr('vert'))
            vert = true


        t1 = p1[p1.length - 1]
        x1 = t1[0]

        t2 = p1[p2.length - 1]
        x2 = t2[0]


        data = new Object();
        r2 = $('#cable_rack' + pp.rack)
        
        if(CABLE.moveExtPanel){
            r1 = 0
            bx1 = CABLE.pin1live.points[0]
            
             if (x1 < bx1[0]) {
                data.r1 = 1 //left	
            } else {
                data.r1 = 2 //right
            }
        }
        else {
            r1 = $('#cable_dev' + d1).parent()
            bx1 = this.elementPos(r1)
            
             if (x1 < bx1[0]) {
                data.r1 = 1 //left	
            } else {
                data.r1 = 2 //right
            }
        }
    
        bx2 = this.elementPos(r2)
        data.x1 = bx1[0]
        data.x2 = bx2[0]

           
    

        if (x2 < bx2[0]) {
            data.r2 = 1 //left	
        } else {
            data.r2 = 2 //right
        }

        data.r2 = pp.rd //right

        //DEBUG.log(data.r1+' '+data.r2+' '+x1+' '+x2+''+pp.rd)

        if(CABLE.moveExtPanel)
            data.id1 = 0
        else
            data.id1 = Number(r1.attr('id').replace('cable_rack', ''))
            
            
        data.id2 = pp.rack
        
       
        data.srack = srack

        data.vert = vert;
        
       
        
        /*
         * 	rackdata={
         'srack':srack, // same rack
         'id1': id1,   //id of rack where is pin1 
         'id2': id2,	 // id of rack 2(we will simulate this)
         'x1': x1,   
         'x2': x2,
         'r1': r1,
         'r2': r2
         }
         * */

        return data;
    },
    rackposition: function(p1, p2, d1, d2) {

        /*
         * 
         *      * 
         *   -|  -|   |
         *   
         *   
         *   
         */
        t1 = p1[p1.length - 1]
        t2 = p2[p2.length - 1]
        x1 = t1[0]
        x2 = t2[0]

        data = new Object();
        r1 = $('#cable_dev' + d1).parent()
        r2 = $('#cable_dev' + d2).parent()



        vert = false
        if ($('#cable_dev' + d1).attr('vert') == 'ok' || $('#cable_dev' + d2).attr('vert') == 'ok')
            vert = true

        if (r1.attr('col') !== 'undefined')
            if (r1.attr('col') == r2.attr('col'))
                data.srack = true;
            else
                data.srack = false;

        bx1 = this.elementPos(r1)
        bx2 = this.elementPos(r2)

        if(CABLE.moveExtPanel)
            data.id1 = 0
        else
            data.id1 = Number(r1.attr('id').replace('cable_rack', ''))
        
        data.id2 = Number(r2.attr('id').replace('cable_rack', ''))

        data.x1 = bx1[0]
        data.x2 = bx2[0]

        if (x1 < bx1[0]) {
            data.r1 = 1 //left	
        } else {
            data.r1 = 2 //right
        }

        if (x2 < bx2[0]) {
            data.r2 = 1 //left	
        } else {
            data.r2 = 2 //right
        }

        //overwrite if vertical device
        data.vert = vert;



        return data;

    },
            
    pointPlaceholder: function(trigger) {   
        
       actions = function(rect) {
            
            $('#ext_panels rect').click(function() {
               
                CABLE.panel_win()
            });
                
            // external patch panel ports
            $('#ext_panels rect').hover(
                    function() {
                       
                        CABLE.overPanel=1
                    },
                    function() {
                    
                        CABLE.overPanel=0
                    }
            )
       }

        if (trigger) {

            //alert("cable show placeholder")
            
            var _pn = CABLE.ext_panel_number;
            var _x = Number(++_pn * 40)
            var _xx = _x + 40

            //device group 
            var pp = CABLE.svg.group(CABLE.ext_panel, 'pp', {
                stroke: 'black',
                'stroke-width': 1,
                'transform': 'translate(' + _x + ',' + 250 + ')'
            });

            var rect = CABLE.svg.rect(pp, 0, 0, 16, 10, {
                class: 'panel' + _pn,
                fill: '#FFD800',
                stroke: '#888',
                'stroke-width': 1,
                'shape-rendering': 'crispEdges',
                'did': ''
            });

            var txt = this.svg.text(pp, -25, 13, 'connect new patch', {
                'transform': 'rotate(-90,0,0)',
                'fill': '#FFD800',
                'text-anchor': 'end',
                'style': 'cursor:pointer;text-align:right;font-family:Coda;font-size:12px;stroke:none;fill:#333333;',
                'did': ''
            });
        
        
            pin = $('#ext_panels rect.panel' + _pn)
            

            var box = pin[0].getScreenCTM();

            scrollTop = $('#content').scrollTop()

            x = box['e'] + Number(pin.attr('x')) + 7 + $('#content').scrollLeft()
            y = box['f'] + Number(pin.attr('y')) - 35 + scrollTop

            points = []
            dx = _pn

            points.push([x, y])

            points.push([x, y - dx * 5])

            points.push([x - dx * 35, y - dx * 5])

            points.push([x - dx * 35, y - 250 + dx * 5])
        
            // store point for pathfinder
            CABLE.tmpPoint = points
            
            actions(rect)
            
            //pin = $('#ext_panels rect.panel' + CABLE.ext_panel_number)
            
            CABLE.showPlace=true;
        }
        else {
            
            //alert("cable hide placeholder")
            
            $('#pp').remove();
            CABLE.showPlace=false;
        }
  
    },
            
    panelPoint: function(pin) {
        
        //move point/port right 
        CABLE.ext_panel_number++;
        //we need pin only for patch name
        
   

        var _x = CABLE.ext_panel_number * 40
        var _did = pin[0]
        var _port = pin[1]

        var rect = CABLE.svg.rect(CABLE.ext_panel, _x, 250, 16, 10, {
            class: 'panel' + CABLE.ext_panel_number,
            fill: '#f8f8f8',
            stroke: '#888',
            'stroke-width': 1,
            'shape-rendering': 'crispEdges',
            'did': _did
        });


        this.svg.text(CABLE.ext_panel, _x + 8, 260, pin[1] + '', {
            'text-anchor': 'middle',
            'style': 'font-family:Coda;font-size:11px;stroke:none;fill:#333333;'
        });


        var txt = this.svg.text(CABLE.ext_panel, -275, _x + 12, pin[4], {
            'class': 'label',
            'transform': 'rotate(-90,0,0)',
            'text-anchor': 'end',
            'style': 'cursor:pointer;text-align:right;font-family:Coda;font-size:12px;stroke:none;fill:#333333;',
            'did': _did
        });
        
        CABLE.goto_room()

        pin = $('#ext_panels rect.panel' + CABLE.ext_panel_number)

        var box = pin[0].getScreenCTM();

        scrollTop = $('#content').scrollTop()

        x = box['e'] + Number(pin.attr('x')) + 7 + $('#content').scrollLeft()
        y = box['f'] + Number(pin.attr('y')) - 35 + scrollTop

        points = []
        dx = CABLE.ext_panel_number

        points.push([x, y])

        points.push([x, y - dx * 5])

        points.push([x - dx * 35, y - dx * 5])

        points.push([x - dx * 35, y - 250 + dx * 5])
        
        var _sp = {
            dev: _did,
            pin: _port,
            port: _port,
            d1: CABLE.faked1,
            points: jQuery.extend([], points)
        }
        
        CABLE.panelPoints.push(_sp)
        
        return points;
    },
    
    rackdata: function (p1, d1) {


        t1 = p1[p1.length - 1]

        x1 = t1[0]


        rdata = new Object();
        r1 = $('#cable_dev' + d1).parent()

        rdata.srack = false;

        bx1 = CABLE.elementPos(r1)
        
        rdata.id1 = Number(r1.attr('id').replace('cable_rack', ''))
        rdata.id2 = 0

        rdata.x1 = bx1[0]


        if (x1 < bx1[0]) {
            rdata.r1 = 1 //left	
        } else {
            rdata.r1 = 2 //right
        }


        //overwrite if vertical device
        rdata.vert = false;
        if(CABLE.moveExtPanel)
            rdata.patch = false
        else
        rdata.patch = true

        return rdata;
    },
    
    panelEXT: function(dev1, port1, dev2, port2, col, name1, name2, cable) {


        scrollTop = $('#content').scrollTop()




        d1 = $('#cable_dev' + dev1)
        d2 = $('#cable_dev' + dev2)

        points = Array()

        type = this.type


        if (d1.length > 0) {
            data1 = [dev1, port1, name1, d1,cable.hostname1, port2]
            data2 = [dev2, port2, name2, d2,cable.hostname2, port1]
        } else {
            data2 = [dev1, port1, name1, d1,cable.hostname1, port2]
            data1 = [dev2, port2, name2, d2,cable.hostname2, port1]

        }

        //witch device is in the room


       

        pin = $('#cable_dev' + data1[0] + ' rect.' + type + data1[1])

        $(pin).attr('class', 'svgpin1 ' + type + data1[1])

        if (pin[0] == undefined) {
            console.warn("wire undefined:1>", data1[0], data1[1])

            return false
        }

        var box = pin[0].getScreenCTM();


        p1x = box['e'] + Number(pin.attr('x')) + 5 + $('#content').scrollLeft()
        p1y = box['f'] + Number(pin.attr('y')) - 35 + scrollTop


        points1 = this.out(data1[2], p1x, p1y, $(data1[3]).attr('ru'), false, pin, false);

        //  d2 ->to panelPoint    

        // panelPoint will create rectangle
        
        points2 = this.panelPoint(data2)
        
        path = this.pathfinder(points1, points2, false, this.clock(data1[1], 1), col, CABLE.rackdata(points1, data1[0]));

	
        points = points1.concat(path);

        points2 = points2.reverse();

        points = points.concat(points2)

        nw = this.svg.polyline(this.view, points, {
            fill: 'none',
            stroke: '#b30cea',
            strokeWidth: 2,
            'port1': name1,
            'port2': name2,
            'dev1': dev1,
            'dev2': dev2,
            'num': cable.id,
            'id': 'cable_' + cable.id
        });



        CABLE.wireNum++;


        return id;


    },
            
    wire: function(dev1, port1, dev2, port2, col, id, name1, name2) {


        scrollTop = $('#content').scrollTop()

        d1 = $('#cable_dev' + dev1)
        d2 = $('#cable_dev' + dev2)

        points = Array()


        type = this.type



        pin1 = $('#cable_dev' + dev1 + ' rect.' + type + port1)

        isup1 = Number($(pin1).attr('uplink'))

        if (isup1 > 0) {
            $(pin1).attr('class', 'svgpin2 ' + type + port1)
        } else {

            $(pin1).attr('class', 'svgpin2 ' + type + port1)
        }






        if (pin1[0] == undefined) {
            console.warn("wire undefined:1>", dev1, port1)

            return false
        }

        box1 = pin1[0].getScreenCTM();





        p1x = box1['e'] + Number(pin1.attr('x')) + 5 + $('#content').scrollLeft()
        p1y = box1['f'] + Number(pin1.attr('y')) - 35 + scrollTop


        pin2 = $('#cable_dev' + dev2 + ' rect.' + type + port2)

        isup2 = Number($(pin2).attr('uplink'))

        if (isup2 > 0) {
            $(pin2).attr('class', 'svgpin2 ' + type + port2)
        } else {

            $(pin2).attr('class', 'svgpin2 ' + type + port2)
        }




        if (pin2[0] == undefined) {
            console.warn("undefined:2>", dev2, port2, dev1, port1)
            return false
        }
        box2 = pin2[0].getScreenCTM();

        p2x = box2['e'] + Number(pin2.attr('x')) + 5 + $('#content').scrollLeft()
        p2y = box2['f'] + Number(pin2.attr('y')) - 35 + scrollTop


        /*
         * port 1
         * */
        vert = new Object();
        vert.type = 0
        vert.s = 0
        if (d1.attr('vert') || d2.attr('vert')) {
            if (d1.attr('vert')) {

                vert.type = 1;
                vert.s = pin1.attr('side')
            }
            if (d2.attr('vert')) {

                vert.type = 2;
                vert.s = pin2.attr('side')
            }




        }

        //adding points to vertical databus port 1 
        points1 = this.out(name1, p1x, p1y, d1.attr('ru'), isup1, pin1, vert);



        //adding points to vertical databus port 2
        points2 = this.out(name2, p2x, p2y, d2.attr('ru'), isup2, pin2, vert);






        //pathfinder for databus


        path = []


        path = this.pathfinder(points1, points2, this.sameRack(dev1, dev2), this.clock(port1, port2), col, this.rackposition(points1, points2, dev1, dev2));


        points = points1.concat(path);

        points2 = points2.reverse();

        points = points.concat(points2)



        nw = this.svg.polyline(this.view, points, {
            fill: 'none',
            stroke: this.wireColor(dev1, dev2),
            strokeWidth: 2,
            'port1': name1,
            'port2': name2,
            'dev1': dev1,
            'dev2': dev2,
            'num': id,
            'id': 'cable_' + id
        });



        CABLE.wireNum++;


        return id;

    },
    splitwires: function(wires) {

        CABLE.wires = [[], [], [], [], []]

        $.each(wires, function(i, e) {
            t = Number(e.type);
            CABLE.wires[t].push(e)
        });

    },
    plot: function() {



        CABLE.reset();
        $('#cableview').html('');

        this.loadingDiv.show()


        $.postJSON('cables/get/', {
            'act': 'add',
            'room': HEADER.rid
        }, function(json) {


            if (typeof json.items === 'object') {
                var arr = []
                $.each(json.items, function(i, item) {
                    arr.push(item);
                });
                CABLE.items = arr;
            }
            else
                CABLE.items = json.items

            var col = 0;
            var h = 0;
            $.each(CABLE.items, function(i, e) {
                if (i == 0 || !Number(e.position)) {
                    h = 0
                    col++;
                }
                h += e.units * 18 + 41
                if (h > RACK.rh) {
                    h = e.units * 18 + 41
                    col++;
                }
                e.col = col
            });

            CABLE.splitwires(json.cables)
            CABLE.make()

        });


    },
    modeset: function(s) {

        this.modset = s;


        setTimeout("CABLE.make()", 300)


  },
    make: function() {



        CABLE.ext_panel_number = 0;
        CABLE.outsides = 8780;
        CABLE.vertical = [[], []]
        CABLE.wireNum = 0;
        racktot = this.items.length * 805
        if (racktot < winw)
            racktot = winw;

        this.set = true
        $('#cableview').css({
            'height': '8780px',
            'width': racktot + 'px'
        });
        $('#cableview').html('');
        $('#cableview').removeClass('hasSVG');

        cablew = (racktot > winw) ? racktot : winw;

        $('#cables').css('width', cablew)
        $('#content div.footer').css('width', cablew)

        //$('#cableview').html('<div id="cableview" style="width:8000px;height:8780px;"></div>')

        $('#cableview').svg();
        s = $('#cableview').svg('get');

        svg = $('#cableview').find('svg')

        //$('#cableview').append('<div id="cableback"></div>');


        svg.attr({
            'height': '9200',
            'xmlns': 'http://www.w3.org/2000/svg'
        })

        //svg.attr('width','8000')

        node = $('<defs><marker id="endArrow"  refX="0" refY="0" markerUnits="strokeWidth" orient="135" markerWidth="5" markerHeight="4">' +
                '<polyline points="0,0 10,5 0,10" fill="darkblue" />' +
                '</marker>' +
                '<marker id="startArrow" viewBox="0 0 10 10" refX="1" refY="5" markerUnits="strokeWidth" orient="auto" markerWidth="5" markerHeight="4">' +
                '  <polyline points="10,0 0,5 10,10 9,5" fill="darkblue" />' +
                '</marker>' +
                '<filter id="dropshadow">' +
                '<feOffset result="offOut" in="SourceGraphic" dx="2" dy="2" />' +
                '<feGaussianBlur result="blurOut" in="offOut" stdDeviation="1" />' +
                '<feBlend in="SourceGraphic" in2="blurOut" mode="normal" />' +
                '</filter>' +
                '</defs>');

        s.add(null, node);
        /*
         node='<rect x="400" y="100" width="400" height="200" filter="url(#svgf1)" fill="yellow" stroke="navy" stroke-width="10"  />'
         s.add(null, node);
         */
        //svg.css('position','absolute')


        //s.add($('<script/>').attr('xlink:href','http://adv.noclayer.com/assets/js/SVGPan.js'));
        back = s.group(null, 'cableback',
                {
                    'stroke-width': 1,
                    'style': 'width:100%;height:100%;',
                    'opacity': '0'
                });

        s.rect(back, 0, 0, '100%', '100%', {
            'uplink': "0",
            'fill': 'blue'
        });


        CABLE.view = s.group(null, 'viewport',
                {
                    'stroke-width': 1,
                    'style': 'width:100%;height:100%;'

                });

        CABLE.ext_panel = s.group(CABLE.view, 'ext_panels', {
            stroke: 'black',
            'stroke-width': 1,
            'transform': 'translate(0,8780)'
        });


        // create fake d1 for updatePosition
        var _d1p = $('<div ru="0"/>').appendTo(CABLE.ext_panel)
        CABLE.faked1 = $('<div/>').appendTo(_d1p)
        

        //node='<rect x="0" y="0" width="100%" height="100%" fill="yellow" stroke="navy" stroke-width="1" />'




        this.svg = s


        this.hardware()

        if (!MINIMAP.set)
            MINIMAP.init()
        else
            MINIMAP.render();

        $('#win_mask4').hide()
        if (MINIMAP.active) {
            $('#win_minimap').show()
            MINIMAP.resize()
        }
        if (CABLE.tools) {
            $('#win_tools').show()

        }




    },
    toolclose: function() {
        this.tools = false;
        $('#view_tool').attr('act', 0)
        $('#view_tool').parent().find('div.clasp').removeClass('claspAct')
        CABLE.escKey()

    },
    escKey: function() {

        CABLE.plotWire = false
        $('#testwire').remove()
        $('div.tool').removeClass('tool_act')
        CABLE.actionType = 0
        CABLE.activePort = false;
        $('#cable_mouseover').remove()
        CABLE.activatePorts()
        if (CABLE.inmove) {
            $(CABLE.inmove).css('opacity', 1)
            CABLE.inmove = false
        }

        $('polyline').css('opacity', 1)
        CABLE.toMove = false;
        CABLE.moveExtPanel = 0
    },
    wireSwitch: function(e) {
    
        function _get_panel_cable_type(e) {
            //get dev1
            var cid1 = $('#cable_dev' + e.dev1)
            //
            //get dev2
            var cid2 = $('#cable_dev' + e.dev2)

            return (cid1.length > 0 && cid2.length > 0)
            //if we get both then it is internal cable



        }

        id = false;
        switch (CABLE.modset) {
            /*
             * UTP FIBER cables
             */
            case 1:
                CABLE.type = 'pin'

                switch (Number(e.type)) {

                    case 1:
                        //mount rack


                        id = CABLE.wire(e.dev1, e.name1, e.dev2, e.name2, '#aa0000', e.id, e.name1, e.name2);
                        break;

                    case 2:
                        //vertical pdu
                        id = CABLE.power(e.dev1, e.name1, e.dev2, e.name2, '#aa0000', e.id);
                        break;
                }




                break;
                /*
                 * POWER supply
                 * */

            case 2:
                CABLE.type = 'power'

                id = CABLE.wire(e.dev1, e.port1, e.dev2, e.port2, '#aa0000', e.id, e.name1, e.name2);



                break;

                /*
                 * KVM switch
                 * */
            case 3:
                CABLE.type = 'kvm'

                id = CABLE.wire(e.dev1, e.port1, e.dev2, e.port2, '#aa0000', e.id, e.name1, e.name2);

                break;

            case 4:
                CABLE.type = 'panel'


                if (_get_panel_cable_type(e)) {
                    //internal
                    id = CABLE.wire(e.dev1, e.name1, e.dev2, e.name2, '#FF9977', e.id, e.name1, e.name2);
                } else {

                    CABLE.panelEXT(e.dev1, e.name1, e.dev2, e.name2, '#FF6600', e.name1, e.name2, e)
                    
                    
                    
                }



                //id=CABLE.wire(e.dev1, e.port1, e.dev2, e.port2,'#FF6600',e.id,e.name1,e.name2);

                break;



        }
        return id;
    },
    
    wireset: function() {

        $.each(CABLE.wires[this.modset], function(i, e) {

            CABLE.wireSwitch(e);

        })
        
        this.goto_room()
    },
    
    goto_room: function() {
        
        $('#ext_panels text').mouseover(function(e) {
            $('#tooltip').html('Click to show room!').css({
                'display': "block",
                'left': e.pageX + 10,
                'top': e.pageY + 10
            });
        });

        $('#ext_panels text').mouseout(function(e) {
            $('#tooltip').css('display', 'none')
        });

        $('#ext_panels text').click(function(e) {
            
            $.postJSON('basic/device/get', {
                'did': $(this).attr('did')
            }, function(json) {

                //goto new room
                HEADER.rid = json.room;
                HEADER.fid = json.floor;
                HEADER.bid = json.build;
                HEADER.makeNavData(json.build, json.floor, json.room, 1)
                CABLE.plot();
            });
        });
    },
    
        locationdata: function() {

        
        buildings = HEADER.navdata

        //building
        building_length = buildings.length
        html = []
        for (var i = 0; i < building_length; i++)
        {
            sel = ''
            html.push('<option ' + sel + ' value="' + buildings[i].id + '">' + buildings[i].name + '</option>')
        }

        $('#panel_loc_build').html(html.join(''))

        //floors
        floors = buildings[0].floors
        floors_length = floors.length
        html = []
        html.push('<option value="all">All</option>')
        for (var i = 0; i < floors_length; i++)
        {
            sel = ''
            html.push('<option ' + sel + ' value="' + floors[i].id + '">' + floors[i].name + '</option>')
        }

        $('#panel_loc_floor').html(html.join(''))

        
    },
    
    panel_win: function() {

        var _pop = new POPUP.init(
                'Select patch panel port', //popup title
                'ext_conn', //popup name
                'win_rack', //parent window
                {
                    w: 350, //width 
                    h: 430, //height
                    wdclass: 'orange2'
                })
                
         PANEL.poptmp = _pop
         
        _pop.data({
                    save: false, //save button
                    rem: false, //remove button
                    cancel: true, //cancel 
                    add: false, //add button
                    set: true, //set button
                },
                '<div class="win_data" style="height:400px;">'
                + '<div class="win_layer win_visible">'
                + '<div class="datadiv" style="width:260px;">'
                + '<fieldset><legend>Building:</legend><select id="panel_loc_build" style="width:320px;"><option>-</option></select></fieldset>'
                + '<fieldset><legend>Floor:</legend><select id="panel_loc_floor" style="width:320px;"><option>-</option></select></fieldset>'
                + '<fieldset><legend>Room:</legend><select id="panel_loc_room" style="width:320px;"><option>-</option></select></fieldset>'
                + '<fieldset><legend>Rack:</legend><select id="panel_loc_rack" style="width:220px;"><option>-</option></select></fieldset>'
                + '<fieldset><legend>Patch Panel:</legend><select id="panel_loc_patch" class="size_large2 devsel"><option>-</option></select></fieldset>'
                + '<fieldset><legend>Port:</legend><select id="panel_loc_port" class="size_large portsel"><option>-</option></select></fieldset>'
                + '<fieldset style="position:absolute;bottom:10px;right:10px;"><legend></legend>'
                + '</div>'
                + '</div>'
                + '</div>'
                );
        
        this.locationdata()
        
        _pop.actionSet('win_panel', ['close', 'cancel'], function() {
            _pop.win.remove()
        });

        _pop.actionSet('windows', ['set'], function() {
            
            var did = $('#panel_loc_patch').val()
            var mid = $('#panel_loc_port').val()
            var pin = $("#panel_loc_port")[0].selectedIndex+1
            
            //set attributes to placeholder
            $('#pp').attr({
                'did': did,
                'pin': pin
            })
            
            // first or second port
            if(CABLE.activePort) {
                
                var p1 = $('#pp')
                CABLE.special = 'p1'
                CABLE.newWire(p1, CABLE.activePort)
            }
            else {
                
                var p2 = $('#pp')
                CABLE.special = 'p2'
                CABLE.liveWire(p2)
            }
            
        });

        _pop.onchange(
                function(e, d) {
                    
                    PANEL.ext_selecting($(d).attr('id'))
                });
    },
    
    pin_points: function(d, menu, panel) {
        
        genPanelPoint = function() {
            
            var _points = false
            
            // find cable
            $.each(CABLE.wires[CABLE.modset], function(i,e) {
                
                dev1 = $(CABLE.toMove).parent().attr('id').replace('cable_dev', '')
                pin1 = Number($(CABLE.toMove).attr('pin'))

                _l1 = $('#cable_dev' + e.dev1).length
                _l2 = $('#cable_dev' + e.dev2).length

                

                _end1 = (e.dev1 == dev1 && e.name1 == pin1)
                _end2 = (e.dev2 == dev1 && e.name2 == pin1)

                // if cable is not fully in this room
                if ((_end1 && !_l2) || (_end2 && !_l1)) {
                    
                   
                    cat1 = $(CABLE.toMove).parent().attr('cat')
                    pin1 = $(CABLE.toMove).attr('pin')

                    // get did and port
                    if (_end1) {
                        dev = e.dev2
                        pin = e.name2
                    }

                    if (_end2) {
                        dev = e.dev1
                        pin = e.name1
                    }
                    
                    console.warn("cable not fully in this room")
                    
                    CABLE.moveExtPanel = 1
                }
            });
            
            
            
            // return points
           m=CABLE.panelPoints.length
           
           for(i=0; i<=m-1; i++) {
               e = CABLE.panelPoints[i]
               if(e.dev == dev && e.pin == pin) 
                    return e
           }

        }
        
        // if external panel cable, return stored points
        if(CABLE.modset===4 && CABLE.actionType==3 && ( !CABLE.moveExtPanel || CABLE.overPanel || panel)) {
            return genPanelPoint()
        
        }
        
        
        if (!menu) {
            
            pp = $(d).attr('class').split(' ')
            pow = pp[1].replace('pin', '').replace('power', '').replace('kvm', '').replace('panel', '')
        }

        dev = $(d).parent().attr('id').replace('cable_dev', '')

        //if(this.type=='power'){
        pin = $(d).attr('pin')

        
        
        if (this.type === undefined)
            this.type = 'pin'

        
        vert = new Object();
        vert.type = 0
        vert.s = 0

        pz = pin
        if (this.type != 'pin')
            pz = pow

        scrollTop = $('#content').scrollTop()

        d1 = $('#cable_dev' + dev)
        type = this.type

        switch (CABLE.modset) {
            case 1:
                type = 'pin'
                break;
            case 2:
                type = 'power'
                break;
            case 3:
                type = 'kvm'
                break;
            case 4:
                type = 'panel'
                break;
        }
        
        
        // if pz less than 48 search by pin tag
        // except kvm switches, can have 2 pins with same pin attribute
        
        if(pz<48 && CABLE.modset != 3)
            pin1 = $('#cable_dev' + dev).find('rect[pin="' + pz + '"]')
        
        else 
            pin1 = $('#cable_dev' + dev + ' rect.' + type + pz)
        
    
        isup1 = Number($(pin1).attr('uplink'))
        
        if (d1.attr('vert')) {

            vert.type = 1;
            vert.s = pin1.attr('side')
        }


        if (pin1[0] == undefined) {
            console.warn("undefined:1>")

            return false
        }

        box1 = pin1[0].getScreenCTM();



        p1x = box1['e'] + Number(pin1.attr('x')) + 5 + $('#content').scrollLeft()
        p1y = box1['f'] + Number(pin1.attr('y')) - 35 + scrollTop





        return {
            'dev': dev,
            'port': pin,
            'd1': d1,
            'p1x': p1x,
            'p1y': p1y,
            'isup1': isup1,
            'pin1': pin1,
            'vert': vert,
            'name1': pin
        }
  
    },
    liveWire: function(d) {

        $('#cableview polyline').css('stroke-opacity', '0.9')

        CABLE.pin1live = CABLE.pin_points(d, false)

        CABLE.rect1live=$('#cable_dev'+CABLE.pin1live.dev+' rect.'+CABLE.type+CABLE.pin1live.pin)[0]

        this.plotWire = true;

    },
    overPin: function(d) {

        this.overPinIs = true
        if (this.plotWire) {
            CABLE.pin2live = CABLE.pin_points(d, false)

        }
        
   },
   getLiveWire: function() {

        //get rack from mouse position
        ll = mouseX + $('#content').scrollLeft()
        rack = Math.floor(ll / 800)
        rd = Math.round(ll / 800)
        scrollTop = $('#content').scrollTop()

        l = rack * 800 + 85
        if (rd == 1)
            l += 680
        y = mouseY + scrollTop - 35




        return {
            'points': [l, y - 3],
            'rack': rack,
            'rd': rd - rack + 1 //simulated left or right of rack l=1 or r=2
        }


    },
    stopDrag: function() {

        if (this.dragme) {
            this.dragme = false;
            $('#dragmask').remove()
        }

    },
    updatePosition: function() {

        if (this.dragme) {

            x = CABLE.x_mouse - mouseX
            y = CABLE.y_mouse - mouseY



            $("#content").scrollTop(y).scrollLeft(x)
            MINIMAP.winPosition()

        }



        $('#testwire').remove()

        points = Array()

        //live wire 
        if (this.plotWire) {

            scrollTop = $('#content').scrollTop()


            if (CABLE.moveExtPanel){
                
                //begin point
                ld = CABLE.pin1live
                
                
                points1= CABLE.pin1live.points.slice(0)
                lco = points1.pop()
                points1.push(lco)
                points1.push(lco)
            }
            else {

                //begin point
                ld = CABLE.pin1live

                //adding points to vertical databus port 1 
                points1 = this.out(ld.name1, ld.p1x, ld.p1y, ld.d1.attr('ru'), ld.isup1, ld.pin1, ld.vert);
                    
                    
            }

            //consol.log(points1)
            
            // check if moving cable is external panel cable
            if (CABLE.overPanel) {
                 
                 points2 = CABLE.tmpPoint.slice(0);
                 lco = points2.pop()
                 points2.push(lco)
                 points2.push(lco)
                 
                 path = []
                 
                 path = this.pathfinder(points1, points2, false, this.clock(ld.port, 1), '#FF6600', CABLE.rackdata(points1, ld.dev));
                 
                 points = points1.concat(path);
                 
                 points2 = points2.reverse();
                 
                 points = points.concat(points2)
                 
            }
            
            else {
            
                if (CABLE.overPinIs && CABLE.pin2live || CABLE.moveEXTPanel) {


                    ld2 = CABLE.pin2live
                    points2 = this.out(ld2.name1, ld2.p1x, ld2.p1y, ld2.d1.attr('ru'), ld2.isup1, ld2.pin1, ld2.vert);
                    

                    path = this.pathfinder(points1, points2, this.sameRack(ld.dev, ld2.dev), this.clock(ld.port, ld2.port), '#ff0000', this.rackposition(points1, points2, ld.dev, ld2.dev));


                    points = points1.concat(path);

                    points2 = points2.reverse();

                    points = points.concat(points2)


                }
                else {
                    

                    var pp = this.getLiveWire()


                    var srack = (Number($(ld.d1).parent().attr('ru')) == pp.rack) ? true : false;

                    left = -$('#content').scrollLeft()

                    //livewire points 
                    points2 = []
                    l22 = mouseX - left

                    x22 = (pp.points[0] > l22) ? l22 + 10 : l22 - 10;

                    points2.push([x22, mouseY + scrollTop - 35])
                    points2.push(pp.points);
                    
                    
                    path=[]
                    path = this.pathfinder(points1, points2, srack, this.clock(ld.port, 1), '#ff0000', this.simulation_livepos(points1, points2, ld, pp, srack));

                    points = points1.concat(path);

                    points2 = points2.reverse();

                    points = points.concat(points2)
                    

                    //DEBUG.log($(ld.d1).parent().attr('ru')+' '+pp.rack+''+Number(srack))
                }
            }
            
            this.svg.polyline(this.view, points, {
                fill: 'none',
                stroke: '#3BBEDD',
                strokeWidth: 2,
                'id': 'testwire',
                'stroke-dasharray': '10,2'
            });


        }


    },
    makeDropMenu: function(r) {

        if ($('#pindropmenu').length > 0)
            $('#pindropmenu').remove();

        className = $(r).attr('class').split(' ')

        con = (className[0] == 'svgpin2') ? true : false;
        pin = className[1].replace('power', '').replace('pin', '').replace('kvm', '').replace('panel', '')
        dev = $(r).parent().attr('id').replace('cable_dev', '')

        x = $(r).attr('x')
        y = $(r).attr('y')



        box1 = r.getScreenCTM();


        p1x = box1['e'] + Number(x) + 2 + $('#content').scrollLeft()
        p1y = box1['f'] + Number(y) - 35 + $('#content').scrollTop() + 2


        $('<div/>').attr({
            'id': 'pindropmenu',
            'pin': pin,
            'dev': dev
        }).addClass('box').css({
            'top': p1y,
            'left': p1x
        }).appendTo('#cableview')

        if (con) {
            html = '<div t="3"><span>disconnect</span></div><div t="2"><span>move</span></div>'
        } else {
            html = '<div t="1"><span>connect</span></div>'

        }

        $('#pindropmenu').html(html);

        $('#pindropmenu div').click(function() {


            switch (Number($(this).attr('t'))) {
                case 1:

                    break;
                case 2:
                    break;
                case 3:
                    break;


            }

            CABLE.remDropMenu()


        });

        $('#pindropmenu').hover(function() {
            clearTimeout(CABLE.timer)

        }, function() {

            CABLE.remDropMenu()


        });

    },
    remDropMenu: function() {
        $('#pindropmenu').remove();  },
    activatePorts: function() {


        $.each($('rect.svgpin'), function(i, e) {

            cl = $(e).attr('class')
            //$(e, CABLE.svg).addClass('cable_add')		
            cl = cl.replace(' cable_add', '').replace(' cable_rem', '').replace(' cable_move', '')

            $(e).attr('class', cl)


        });

        $.each($('rect.svgpin2, rect.svgpin1'), function(i, e) {

            cl = $(e).attr('class')
            //$(e, CABLE.svg).addClass('cable_add')		
            cl = cl.replace(' cable_add', '').replace(' cable_rem', '').replace(' cable_move', '')

            $(e).attr('class', cl)

        });


        switch (CABLE.actionType) {


            case 1:
                $.each($('rect.svgpin'), function(i, e) {

                    cl = $(e).attr('class')
                    //$(e, CABLE.svg).addClass('cable_add')		
                    $(e).attr('class', cl + ' cable_add')


                })
                
                break;

            case 2:
                $.each($('rect.svgpin2, rect.svgpin1'), function(i, e) {

                    cl = $(e).attr('class')
                    //$(e, CABLE.svg).addClass('cable_add')		
                    $(e).attr('class', cl + ' cable_rem')


                })

                break;
            case 3:
                $.each($('rect.svgpin2, rect.svgpin1'), function(i, e) {

                    cl = $(e).attr('class')
                    //$(e, CABLE.svg).addClass('cable_add')		
                    $(e).attr('class', cl + ' cable_move')


                })

                break;
        }

    },
    actions: function() {



        //drag cable layout
        //$("#cableback").mousedown(function(){


        $("#cableback").mousedown(function() {

            cx = $('#content').scrollLeft()
            cy = $('#content').scrollTop()



            CABLE.x_mouse = cx + mouseX
            CABLE.y_mouse = cy + mouseY





            CABLE.dragme = true



            $(CABLE.div).append('<div id="dragmask"></div>')

            element = document.getElementById("content")

            element.draggable = false;
            // this works for older web layout engines
            element.onmousedown = function(event) {
                event.preventDefault();
                return false;
            };

        });

        //set cursor pointer on wires

        $('#viewport polyline').css('cursor', 'pointer')

        $('#viewport rect.svgpin, #viewport rect.svgpin2').hover(
                
                function() {
                    
                    cl = $(this).attr('class').split(' ')[0]
                    if (cl=='svgpin') {
                        
                        CABLE.overPin(this)
                    }

                },
                function() {

                    cl = $(this).attr('class').split(' ')[0]
                    if (cl=='svgpin') {
                        
                        CABLE.overPinIs = false
                    }
                    
                }

        );


        $('#viewport rect.svgpin, #viewport rect.svgpin2, #viewport rect.svgpin1').bind('mousedown', function() {

            cl = $(this).attr('class').split(' ')[0]




            if (cl == 'svgpin') {
                if (CABLE.actionType == 1) {



                    if (CABLE.activePort && CABLE.activePort != $(this)) {

                        if (CABLE.toMove) {
                            
                            CABLE.moveWire($(this))
                        } else {
                            CABLE.newWire($(this), CABLE.activePort)
                        }


                    } else {

                        CABLE.activePort = $(this)
                        CABLE.liveWire(this)
                    }




                } else {
                    if (CABLE.actionType == 3) {
                        
                        if (CABLE.toMove) {
                            
                            CABLE.moveWire($(this))
                        }
                    }

                }

            } else {

                if (CABLE.actionType == 2) {
                    CABLE.toRem = $(this)
                    CABLE.removeCable()

                }
                if (CABLE.actionType == 3) {

                    if (CABLE.inmove) {
                        $(CABLE.inmove).css('opacity', 1)
                        CABLE.inmove = false
                    }
                    CABLE.toMove = $(this)
                    CABLE.moveCable()
                    
                    
                }



            }


            //CABLE.makeDropMenu(this)


        });


        $('#viewport polyline').hover(
                function() {





                    $('#tooltip').show();

                    dev1 = $(this).attr('dev1')
                    dev2 = $(this).attr('dev2')
                    name1 = $('#cable_dev' + dev1 + ' text:first').text()
                    name2 = $('#cable_dev' + dev2 + ' text:first').text()

                    port1 = $(this).attr('port1')
                    port2 = $(this).attr('port2')

                    num = CABLE.prefix(Number($(this).attr('num')))

                    $('#tooltip').html('<div>Cabel: <b>#' + num + '</b></div><div><span class="name">From:</span>' + name1 + ' PORT:' + port1 +
                            '</div><div><span class="name">To:</span>' + name2 + ' PORT:' + port2 + '</div>')

                },
                function() {
                    $('#tooltip').hide();

                }
        );


        $('#viewport polyline').mousemove(function() {
            bodyTop = 0
            if (typeof PLUGIN != 'undefined')
                bodyTop = $('#noclayer-plugin').offset().top;
            $('#tooltip').css({
                'left': mouseX + 10,
                'top': mouseY + 10 - bodyTop
            })
        });


        $('#viewport polyline').click(function() {
            $('#cable_mouseover').remove()
            p = $(this).attr('points')




            points = CABLE.makearray(p)
            CABLE.svg.polyline(null, points, {
                fill: 'none',
                stroke: '#1e90ff',
                strokeWidth: 3,
                'id': 'cable_mouseover',
                'shape-rendering': 'crispEdges'
            });



        })

    },
    hardware: function() {

        console.info("hardware")

        var units = 0
        var c = 0
        $.each(this.items, function(i, item) {
            var up = 1
            col = item.col - 1
            if (c != col) {
                c = col
                units = 0;
                up = 0;
            }
            units += Number(item.units)
            rack = CABLE.rack(item, i, col, units, up)

            $.each(item.equs, function(o, equ) {
                //assets
                CABLE.device(item, rack, equ)

            });
        });


        CABLE.text = s.group(this.view, 'text', {
            'stroke-width': 1,
            'stroke': 'red',
            'style': 'width:100%;height:100%;font-family:Arial;font-size:8;fill:none;'
        });




        //plot wires 
        this.wireset()

        //default action  on wires
        this.actions();

        //setupHandlers(document.getElementById('viewport'));

        this.position()
        this.loadingDiv.hide()

    },
    prefix: function(number) {

        length = 4;
        var str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }

        return str;

    },
    makearray: function(string) {
        r = []
        m = string.split(' ')
        $.each(m, function(i, e) {
            a = e.split(',')
            r.push(a)

        })

        return r;
    },
    randomFromTo: function(from, to) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    },
    category: function(cat, dev) {
        switchNode = '<g transform="translate(483,-55)"><polygon fill="none" stroke="#CDCCCB" stroke-miterlimit="10" points="15.595,82.5 22.201,71.059 28.806,82.5 "/></g>';

        serverNode = '<g transform="translate(483,-3)"><circle fill="none" stroke="#CDCCCB" stroke-miterlimit="10" cx="22.128" cy="27.197" r="5.821"/></g>';

        routerNode = '<g transform="translate(483,-101)"><rect x="16.5" y="119.5" fill="none" stroke="#CDCCCB" stroke-miterlimit="10" width="12" height="12"/></g>';

        pduNode = '<g transform="translate(483,-151)"><line fill="none" stroke="#CDCCCB" stroke-miterlimit="10" x1="16" y1="164.5" x2="31" y2="164.5"/>' +
                '<line fill="none" stroke="#CDCCCB" stroke-miterlimit="10" x1="16" y1="184.5" x2="31" y2="184.5"/>' +
                '<polygon stroke="#CDCCCB" fill="#CDCCCB" points="25.163,174.626 31.742,167.44 27.347,173.575 32.03,174.352 24.64,181.729 29.181,175.137 "/>' +
                '<polygon stroke="#CDCCCB" fill="#CDCCCB" points="15.359,174.626 21.94,167.44 17.544,173.575 22.227,174.352 14.837,181.729 19.378,175.137 "/></g>';

        interfaceNode = '<g transform="translate(433,-101)"><rect x="66.5" y="118.5" fill="none" stroke="#CDCCCB" stroke-miterlimit="10" width="11" height="8"/>' +
                '<rect x="66.5" y="129.5" fill="none" stroke="#CDCCCB" stroke-miterlimit="10" width="11" height="2"/></g>'


        fiberswitchNode = '<g transform="translate(433,-53)"><circle fill="none" stroke="#CDCCCB" stroke-width="0.5" stroke-miterlimit="10" cx="70.958" cy="76.885" r="7.842"/>' +
                '<circle fill="#CDCCCB" stroke="#CDCCCB" cx="70.958" cy="76.885" r="3.484"/></g>';

        patchNode = '<g transform="translate(483,-203)"><rect x="16.5" y="218.5" fill="none" stroke="#CDCCCB" stroke-miterlimit="10" width="4" height="8"/>' +
                '<rect x="23.5" y="228.5" fill="none" stroke="#CDCCCB" stroke-miterlimit="10" width="5" height="7"/></g>'



        upsNode = '<g transform="translate(433,-153)"><line fill="none" stroke="#CDCCCB" stroke-miterlimit="10" x1="67" y1="178.5" x2="77" y2="178.5"/>' +
                '<line fill="none" stroke="#CDCCCB" stroke-miterlimit="10" x1="71.5" y1="179" x2="71.5" y2="188"/>' +
                '<line fill="none" stroke="#CDCCCB" stroke-miterlimit="10" x1="63" y1="175.5" x2="80" y2="175.5"/>' +
                '<line fill="none" stroke="#CDCCCB" stroke-miterlimit="10" x1="71.5" y1="165" x2="71.5" y2="176"/></g>'


        atsNode = '<g transform="translate(433,-3)"><polygon fill="#CDCCCB" stroke="#CDCCCB" points="66.686,25.876 78.564,14.74 70.629,24.25 79.083,25.45 65.742,36.887 73.938,26.67 "/></g>'

        kvmNode = '<g transform="translate(483,-250)"><polygon fill="none" stroke="#CDCCCB" stroke-miterlimit="10" points="16.896,272.5 22.851,263.207 28.806,272.5 "/>' +
                '<rect x="16.5" y="276.5" fill="none" stroke="#CDCCCB" stroke-miterlimit="10" width="12" height="2"/></g>';

        unknown = '<text x="505" y="30"  fill="#CDCCCB" stroke="#CDCCCB" font-size="18">?</text>'

        switch (Number(cat)) {
            case 1:
                this.svg.add(dev, serverNode)
                break;
            case 2:
                this.svg.add(dev, switchNode)
                break;
            case 3:
                this.svg.add(dev, routerNode)
                break;
            case 4:
                this.svg.add(dev, pduNode)
                break;
            case 5:
                this.svg.add(dev, patchNode)
                break;
            case 6:
                this.svg.add(dev, kvmNode)
                break;
            case 7:
                this.svg.add(dev, atsNode)
                break;
            case 8:
                this.svg.add(dev, fiberswitchNode)
                break;
            case 9:
                this.svg.add(dev, interfaceNode)
                break;
            case 10:
                this.svg.add(dev, upsNode)
                break;
            default:
                this.svg.add(dev, unknown)
                break;


        }




   },
    getPinFromClass: function(p) {

        cl = $(p).attr('class').split(' ');
        return cl[1].replace('power', '').replace('kvm', '')

    },
    moveWire: function(p1) {
        
        $('polyline').css('opacity', 1)
        
        if (CABLE.moveExtPanel) {
            
            p2 = CABLE.pin_points(false, true, true)
        
            name1 = $(p1).attr('pin')
            name2 = p2.pin
            port1 = 1;
            port2 = 1;

            dev1 = $(p1).parent().attr('id').replace('cable_dev', '')
            dev2 = p2.dev
        }
        else {
            
            p2 = CABLE.moveAxis 
            
            switch (this.modset) {
                case 1:
                case 4:
                    name1 = $(p1).attr('pin')
                    name2 = $(p2).attr('pin')
                    port1 = 1;
                    port2 = 1;
                    break;


                case 2:
                case 3:
                    name1 = $(p1).attr('pin')
                    name2 = $(p2).attr('pin')
                    port1 = this.getPinFromClass(p1)
                    port2 = this.getPinFromClass(p2)
                    break;
                case 5:
                    break;
            }

            dev1 = $(p1).parent().attr('id').replace('cable_dev', '')
            dev2 = $(p2).parent().attr('id').replace('cable_dev', '')

        }



        cab = $(CABLE.inmove).attr('id').replace('cable_', '')
        send = {
            'port1': port1,
            'port2': port2,
            'cab': cab,
            'act': 'move',
            'type': this.modset,
            'name1': name1,
            'name2': name2,
            'dev2': dev2,
            'dev1': dev1
        }
        wire = this.getWireFromPort(name2, dev2, true)

        CABLE.makePortAvailable(wire.dev1, wire.name1)
        CABLE.makePortAvailable(wire.dev2, wire.name2)

        $('#cable_' + wire.id).remove()





        $.postJSON('cables/set', send, function(json) {




            CABLE.wires[Number(json.cable.type)].push(json.cable)
            var id = CABLE.wireSwitch(json.cable)
            CABLE.newCablePortAction(json.cable.dev1, json.cable.name1)
            CABLE.newCablePortAction(json.cable.dev2, json.cable.name2)
            CABLE.newCableAction(id)



        });



        CABLE.escKey()

   },
    newWire: function(p1, p2) {
    
        switch (this.modset) {
            case 1:
            case 4:    
                name1 = $(p1).attr('pin')
                name2 = $(p2).attr('pin')
                port1 = 1;
                port2 = 1;
                break;

            case 2:
            case 3:
                name1 = $(p1).attr('pin')
                name2 = $(p2).attr('pin')
                port1 = this.getPinFromClass(p1)
                port2 = this.getPinFromClass(p2)
                break;
            case 5:
                break;

        }
        
        switch (this.special) {

            case 'p1':
                //second port to external patch
               
                
                dev1 = $(p1).attr('did')
                dev2 = $(p2).parent().attr('id').replace('cable_dev', '')
                break;
                
           case 'p2':
                //first port to external patch
                dev1 = $(p1).parent().attr('id').replace('cable_dev', '')
                dev2 = $(p2).attr('did')
                break;
                
            default:
                dev1 = $(p1).parent().attr('id').replace('cable_dev', '')
                dev2 = $(p2).parent().attr('id').replace('cable_dev', '')
                break;
        }

        send = {
            'port1': port1,
            'port2': port2,
            'cab': 0,
            'act': 'connect',
            'type': this.modset,
            'name1': name1,
            'name2': name2,
            'dev2': dev2,
            'dev1': dev1
        }


        if (dev1 != dev2) {

            $.postJSON('cables/set', send, function(json) {

                //if cable goes to another room return data
                if(CABLE.special) {
                    
                    CABLE.special = 0
                    CABLE.panelEXT(json.dev1, json.name1, json.dev2, json.name2, '#FF6600', json.name1, json.name2, json)
                    
                    CABLE.pointPlaceholder(false)
                    PANEL.poptmp.win.remove()
                }
                
                CABLE.wires[Number(json.cable.type)].push(json.cable)
                id = CABLE.wireSwitch(json.cable)
                CABLE.newCablePortAction(json.cable.dev1, json.cable.name1)
                CABLE.newCablePortAction(json.cable.dev2, json.cable.name2)
                CABLE.newCableAction(id)



            });
        }


        CABLE.escKey()

    },
    newCablePortAction: function(dev, port) {
//$('#cable_dev'+dev+' rect.'+this.type+port);

    },
    newCableAction: function(id) {




        $('#cable_' + id).hover(
                function() {





                    $('#tooltip').show();

                    dev1 = $(this).attr('dev1')
                    dev2 = $(this).attr('dev2')
                    name1 = $('#cable_dev' + dev1 + ' text:first').text()
                    name2 = $('#cable_dev' + dev2 + ' text:first').text()

                    port1 = $(this).attr('port1')
                    port2 = $(this).attr('port2')

                    num = CABLE.prefix(Number($(this).attr('num')))

                    $('#tooltip').html('<div>Cabel: <b>#' + num + '</b></div><div><span class="name">From:</span>' + name1 + ' PORT:' + port1 +
                            '</div><div><span class="name">To:</span>' + name2 + ' PORT:' + port2 + '</div>')

                },
                function() {
                    $('#tooltip').hide();

                }
        );


        $('#cable_' + id).mousemove(function() {
            bodyTop = 0
            if (typeof PLUGIN != 'undefined')
                bodyTop = $('#noclayer-plugin').offset().top;
            $('#tooltip').css({
                'left': mouseX + 10,
                'top': mouseY + 10 - bodyTop
            })
        });


        $('#cable_' + id).click(function() {
            $('#cable_mouseover').remove()
            p = $(this).attr('points')




            points = CABLE.makearray(p)
            CABLE.svg.polyline(null, points, {
                fill: 'none',
                stroke: '#1e90ff',
                strokeWidth: 3,
                'id': 'cable_mouseover',
                'shape-rendering': 'crispEdges'
            });



        });
    },
    ports: function(equ, dev) {
        //type of ports


        switch (Number(equ.cat)) {
            case 2:
            case 3:
            case 8:
                Numport = Number(equ.ports)
                uplink = Number(equ.uplinks)
                break;
            case 5:
                Numport = Number(equ.ports) / 2
                uplink = 0
                break;
            default:
                uplink = false
                Numport = equ.nics
                break;

        }

        /*
         * ports for device
         * */

        ports = Array(2, 8, 48, 24, 16, 48)
        pp = ports[this.randomFromTo(0, 5)]
        points = [[0, 0], [10, 0], [10, 5], [7, 5], [7, 8], [3, 8], [3, 5], [0, 5]]

        for (i = 1; i <= Numport; i++) {

            yy = 10
            if (i <= 24)
                m = i
            if (i > 24) {
                m = i - 24;
                yy += 20
            }
            x = m * 20
            //pin number
            ty = 9
            rx = 15
            if (navigator.userAgent.match(/mozilla/i)) {
                ty = 8
                rx = 14
            }

            this.svg.text(dev, x - 8, yy + ty, i + '', {
                'text-anchor': 'middle',
                'class': 'porttext'
            });

            // pin rectangle 
            this.svg.rect(dev, x - rx, yy, 14, 10, {
                'uplink': "0",
                'class': 'svgpin pin' + i,
                'pin': i,
                'shape-rendering': 'crispEdges'
            });


        }


        //only 4 uplinks!

        /*
         *  1    2 
         * 
         *  3    4
         *  
         */


        if (uplink) {
            num = Numport + 1;
            dx = 470
            dy = 10

            for (i = 1; i <= uplink; i++) {

                if (i <= 2) {
                    ii = i;
                    y = 10
                }
                else {
                    ii = i - 2;
                    y = 30
                }
                ux = dx + ii * 20
                ty = 9
                rx = 15
                if (navigator.userAgent.match(/mozilla/i)) {
                    ty = 8
                    rx = 14
                }

                this.svg.text(dev, ux + 6, y + ty, num + '', {
                    'text-anchor': 'middle',
                    'class': 'porttext'
                });
                //uplink rect
                this.svg.rect(dev, ux, y, 14, 10, {
                    'uplink': i,
                    'class': 'svgpin pin' + num,
                    'pin': num,
                    'shape-rendering': 'crispEdges'
                });
                //uplink number

                num++;
            }
        }

    },
    panel: function(equ, dev) {

//we need obnly patchpanel, so get only cat 5
        switch (Number(equ.cat)) {
            case 5:
                Numport = Number(equ.ports) / 2
                break;

            default:
                Numport = 0;
                break;

        }

        /*
         * ports for device
         * */

        ports = Array(2, 8, 48, 24, 16, 48)
        pp = ports[this.randomFromTo(0, 5)]


        for (i = 1; i <= Numport; i++) {

            yy = 10
            if (i <= 24)
                m = i
            if (i > 24) {
                m = i - 24;
                yy += 20
            }
            x = m * 20
            //pin number
            ty = 9
            rx = 15
            if (navigator.userAgent.match(/mozilla/i)) {
                ty = 8
                rx = 14
            }

            this.svg.text(dev, x - 8, yy + ty, i + '', {
                'text-anchor': 'middle',
                'class': 'porttext'
            });

            // pin rectangle 
            this.svg.rect(dev, x - rx, yy, 14, 10, {
                'uplink': "0",
                'class': 'svgpin panel' + i,
                'pin': i,
                'shape-rendering': 'crispEdges'
            });


        }





    },
    splitSockets: function(sockets) {
        soc = [[], [], []]

        $.each(sockets, function(i, s) {
            soc[Number(s.type)].push(s)
        })
        return soc

    },
    sockets: function(equ, dev) {

        if (equ.power.length > 0) {

            power = equ.power[0]


            m = 1

            sockets = this.splitSockets(power.socket)


            input = sockets[1].length
            output = sockets[2].length

            if (input > 0)
                this.svg.text(dev, 0, 40, 'INPUT', {
                    'transform': 'rotate(-90,0,25)',
                    'text-anchor': 'middle',
                    'style': 'font-family:Coda;font-size:9px;stroke:none;fill:#cccccc;'
                });
            if (output > 0)
                this.svg.text(dev, 0, 160, 'OUPUT', {
                    'transform': 'rotate(-90,0,25)',
                    'text-anchor': 'middle',
                    'style': 'font-family:Coda;font-size:9px;stroke:none;fill:#cccccc;'
                });






            for (i = 1; i <= Number(power.input); i++) {


                yy = 10
                a = i % 2;
                x = m * 30
                if (a == 0) {
                    yy = 30;
                    m++;
                }


                //pin number
                this.svg.text(dev, x - 3, yy + 7, i + '', {
                    'text-anchor': 'middle',
                    'style': 'font-family:Coda;font-size:7px;stroke:none;fill:#707070;'
                });

                // pin rectangle 
                if (sockets[1][i - 1])
                    this.svg.rect(dev, x - 10, yy, 15, 10, {
                        't': '1',
                        'pin': i,
                        'class': 'svgpin power' + sockets[1][i - 1].id,
                        'shape-rendering': 'crispEdges'
                    });


            }

            m = 5;
            for (i = 1; i <= Number(power.output); i++) {

                yy = 10
                a = i % 2;
                x = m * 30
                if (a == 0) {
                    yy = 30;
                    m++;
                }

                // pin rectangle 

                //pin number
                if (sockets[2][i - 1])
                    this.svg.text(dev, x - 3, yy + 7, i + '', {
                        'text-anchor': 'middle',
                        'style': 'font-family:Coda;font-size:7px;stroke:none;fill:#707070;'
                    });


                if (sockets[2][i - 1]) {
                    this.svg.rect(dev, x - 10, yy, 15, 10, {
                        'pin': i,
                        't': '2',
                        'class': 'svgpin power' + sockets[2][i - 1].id,
                        'shape-rendering': 'crispEdges'
                    });
                }
                else
                    console.warn("error:",equ, dev);

            }


        }


    },
    video: function(equ, dev) {
        if (equ.kvm.length > 0) {

            kvm = equ.kvm[0]


            m = 1

            sockets = this.splitSockets(kvm.socket)


            input = sockets[1].length
            output = sockets[2].length

            if (input > 0)
                this.svg.text(dev, 0, 40, 'INPUT', {
                    'transform': 'rotate(-90,0,25)',
                    'text-anchor': 'middle',
                    'style': 'font-family:Coda;font-size:9px;stroke:none;fill:#cccccc;'
                });
            if (output > 0)
                this.svg.text(dev, 0, 125, 'OUPUT', {
                    'transform': 'rotate(-90,0,25)',
                    'text-anchor': 'middle',
                    'style': 'font-family:Coda;font-size:9px;stroke:none;fill:#cccccc;'
                });






            for (i = 1; i <= Number(kvm.input); i++) {


                yy = 10
                a = i % 2;
                x = m * 35
                if (a == 0) {
                    yy = 30;
                    m++;
                }



                this.svg.text(dev, x - 3, yy + 7, i + '', {
                    'text-anchor': 'middle',
                    'style': 'font-family:Coda;font-size:7px;stroke:none;fill:#707070;'
                });
                // pin rectangle 
                if (sockets[1][i - 1])
                    this.svg.rect(dev, x - 15, yy, 25, 10, {
                        'k': '1',
                        'class': 'svgpin kvm' + sockets[1][i - 1].id,
                        'pin': i,
                        'shape-rendering': 'crispEdges'
                    });

                //pin number


            }

            m = 3;
            for (i = 1; i <= Number(kvm.output); i++) {

                yy = 10
                a = i % 2;
                x = m * 35 + 15
                if (a == 0) {
                    yy = 30;
                    m++;
                }

                //pin number
                this.svg.text(dev, x - 3, yy + 7, i + '', {
                    'text-anchor': 'middle',
                    'style': 'font-family:Coda;font-size:7px;stroke:none;fill:#707070;'
                });

                // pin rectangle 
                this.svg.rect(dev, x - 15, yy, 25, 10, {
                    'k': '2',
                    'class': 'svgpin kvm' + sockets[2][i - 1].id,
                    'pin': i,
                    'shape-rendering': 'crispEdges'
                });


            }


        }




    },
    mountrack: function(num, rack, equ) {


        h = num.units * 180
        p = Number(equ.position);
        eu = Number(equ.units);
        hd = p * 180 - eu * 70
        y2 = h - p * 180
        y2 -= eu * 180 - 180
        y = y2 + eu * 70
        xx = 10
        yy = y


        //device group 
        var dev = CABLE.svg.group(rack, 'cable_dev' + equ.id, {
            'cat': equ.cat,
            'ru': eu,
            stroke: 'black',
            'stroke-width': 1,
            'transform': 'translate(' + xx + ',' + yy + ')'
        });

        //main device rectangle
        this.svg.rect(dev, 0, 0, 530, equ.units * 50, {
            fill: '#f8f8f8',
            stroke: '#888',
            'stroke-width': 1,
            'shape-rendering': 'crispEdges'
        });

        //hostaname
        this.svg.text(dev, 530 / 2, equ.units * 50 / 2 + 2, equ.host, {
            'text-anchor': 'middle',
            'style': 'font-family:Arial;font-size:10px;stroke:none;fill:#707070;'
        });


        //add device symbol
        this.category(equ.cat, dev)

        switch (this.modset) {
            case 1:
                this.ports(equ, dev)
                break;
            case 2:
                this.sockets(equ, dev)
                break;
            case 3:
                this.video(equ, dev)
                break;
            case 4:
                this.panel(equ, dev)
                break;



        }






    },
    verticalPowerSockets: function(dev, equ) {

        power = equ.power[0]

        inp = Number(power.input)
        out = Number(power.output)


        y = pos * 140;


        h = 140 * (out) + 60

        //sockets

        sockets = this.splitSockets(power.socket)



        for (i = 1; i <= inp; i++) {

            yy = i * 20 - 10
            x = 15

            // pin rectangle 
            if (sockets[1][i - 1]) {
                //pin number

                this.svg.text(dev, x - 3, yy + 7, i + '', {
                    'text-anchor': 'middle',
                    'style': 'font-family:Coda;font-size:7px;stroke:none;fill:#707070;'
                });
                this.svg.rect(dev, x - 10, yy, 15, 10, {
                    'input': '1',
                    'side': equ.mount,
                    'vert': '1',
                    'class': 'svgpin power' + sockets[1][i - 1].id,
                    'pin': i,
                    'shape-rendering': 'crispEdges'
                });

            }

        }


        for (i = 1; i <= out; i++) {

            yy = i * 140 + 40
            x = 15

            // pin rectangle 
            if (sockets[2][i - 1]) {

                this.svg.text(dev, x - 3, yy + 7, i + '', {
                    'text-anchor': 'middle',
                    'style': 'font-family:Coda;font-size:7px;stroke:none;fill:#707070;'
                });
                this.svg.rect(dev, x - 10, yy, 15, 10, {
                    'input': '2',
                    'side': equ.mount,
                    'vert': '1',
                    'class': 'svgpin power' + sockets[2][i - 1].id,
                    'pin': i,
                    'shape-rendering': 'crispEdges'
                });

            }
            //pin number


        }



    },
    getWireFromPort: function(port, dev, from_name) {
        m = false;


        $.each(this.wires[this.modset], function(i, e) {

            if (Number(e.dev1) == dev && Number(e.name1) == port) {
                m = e
                return m;

            }
            if (Number(e.dev2) == dev && Number(e.name2) == port) {
                m = e
                return m;

            }





        });

        return m;

    },
    makePortAvailable: function(dev, port) {
        $('#cable_dev' + dev + ' rect.' + this.type + port).attr('class', 'svgpin ' + this.type + port);
    },
    rem: function() {
    
        if (CABLE.toRem) {


            pin = Number($(CABLE.toRem).attr('pin'))
            dev = Number($(CABLE.toRem).parent().attr('id').replace('cable_dev', ''))

            fn = (this.modeset == 1) ? true : false;
            wire = this.getWireFromPort(pin, dev, fn)
            
            
            send = {
                'id': wire.id
            }

            $.postJSON('cables/rem', send, function(json) {
                
                
                if (CABLE.type == 'pin') {
                    CABLE.makePortAvailable(wire.dev1, wire.name1)
                    CABLE.makePortAvailable(wire.dev2, wire.name2)
                }
                else {

                    CABLE.makePortAvailable(wire.dev1, wire.port1)
                    CABLE.makePortAvailable(wire.dev2, wire.port2)

                }

                var wires = CABLE.wires[CABLE.modset]
                var i = 0
                
                $.each(wires, function(i,e) {
                    
                    if(wire.id == e.id) {
                        CABLE.wires[CABLE.modset].splice(i,1)
                    }
                    i++
                })
                
                $('#cable_' + wire.id).remove()
                CABLE.escKey()
                CABLE.win.remove()
                
            });


        }
        CABLE.toRem = false

    },
    moveCable: function() {

        console.info("moveCable")

        if (CABLE.toMove) {

            pin = Number($(CABLE.toMove).attr('pin'))
            dev = Number($(CABLE.toMove).parent().attr('id').replace('cable_dev', ''))

            wire = this.getWireFromPort(pin, dev, true)

            $('polyline').css('opacity', 0.3)
            CABLE.inmove = $('#cable_' + wire.id).css('opacity', 1)

            if (this.type == 'pin' || this.type=='panel') {
                pz2 = wire.name2
                pz1 = wire.name1
            } else {
                pz2 = wire.port2
                pz1 = wire.port1


            }
            
            if (pin == wire.name1 && dev == wire.dev1)
                point2 = $('#cable_dev' + wire.dev2 + ' rect.' + this.type + pz2)
            else
                point2 = $('#cable_dev' + wire.dev1 + ' rect.' + this.type + pz1)
            
            
            
            CABLE.moveAxis = point2;

            $.each($('rect.svgpin'), function(i, e) {

                cl = $(e).attr('class')
                //$(e, CABLE.svg).addClass('cable_add')		
                cl = cl.replace(' cable_add', '').replace(' cable_rem', '').replace(' cable_move', '')

                $(e).attr('class', cl)


            });

            $.each($('rect.svgpin2, rect.svgpin1'), function(i, e) {

                cl = $(e).attr('class')
                //$(e, CABLE.svg).addClass('cable_add')		
                cl = cl.replace(' cable_add', '').replace(' cable_rem', '').replace(' cable_move', '')

                $(e).attr('class', cl)

            });


            $.each($('rect.svgpin'), function(i, e) {

                cl = $(e).attr('class')
                //$(e, CABLE.svg).addClass('cable_add')		
                $(e).attr('class', cl + ' cable_move')


            })

            this.liveWire(point2)
        }

   },
    removeCable: function() {

        this.win = new nocwin('REMOVE CABLE', '', 'cabrem');

        this.win.zindex()


        d = this.win.data



        $(d).html('<fieldset style="margin-top:10px;"><legend></legend></fieldset>' +
                '<fieldset><legend>You sure want to remove it?</fieldset>' +
                '<fieldset style="position:absolute;bottom:10px;right:10px;"><legend></legend>' +
                '<button class="size_medium el_close">cancel</button>' +
                '<button class="size_medium el_add">remove</button></fieldset>'
                )


        //close win
        $(this.win.div).find('div.win_close').click(function() {
            //$(NETWORK.conn_div).removeClass('selected')
            CABLE.win.remove()
            //WIN.show('#win_ip') //set zindex back to 400

        });
        //add element
        $(this.win.div).find('button.el_add').click(function() {

            CABLE.rem()

        });

        //cancel
        $(this.win.div).find('button.el_close').click(function() {
            //$(NETWORK.conn_div).removeClass('selected')

            CABLE.win.remove()
            //WIN.show('#win_ip') //set zindex back to 400

        });

    },
    verticalDevice: function(num, rack, equ) {

        pos = Number(equ.power[0].pos)
        out = Number(equ.power[0].output)


        y = pos * 140;
        h = 140 * (out) + 60

        if (Number(equ.mount) == 1) {

            x = -100
        } else {

            x = 630;
        }


        var dev = CABLE.svg.group(rack, 'cable_dev' + equ.id, {
            'vert': 'ok',
            'cat': equ.cat,
            'ru': eu,
            stroke: 'black',
            'stroke-width': 1,
            'col': rack.col,
            'transform': 'translate(' + x + ',' + y + ')'
        });

        this.svg.text(dev, 0, 265, equ.host, {
            'transform': 'rotate(-90,0,250)',
            'text-anchor': 'middle',
            'style': 'font-family:Coda;font-size:10px;stroke:none;fill:#757575;'
        });
        this.svg.rect(dev, 0, 0, 26, h, {
            fill: '#f8f8f8',
            stroke: '#757575',
            'stroke-width': 1,
            'shape-rendering': 'crispEdges'
        });






        //sockets
        if (this.modset == 1) {
            for (i = 1; i <= out; i++) {
                y = i * 140 + 40

                data = {
                    'uplink': "0",
                    'class': 'svgpin0 power' + i,
                    'shape-rendering': 'crispEdges',
                    'stroke-dasharray': '4,2'
                }

                // pin rectangle 
                this.svg.rect(dev, 5, y, 15, 10, data);


                //pin number
                //this.svg.text(dev, 14, y+7, i+'',{'text-anchor':'middle','style':'font-family:Coda;font-size:7px;stroke:none;fill:#707070;'});
            }
        }



        switch (this.modset) {
            case 1:
                //ports
                Numport = Number(equ.nics)

                for (i = 1; i <= Numport; i++) {



                    yy = i * 20 - 10
                    x = 8

                    this.svg.text(dev, x + 4, yy + 6, i + '', {
                        'text-anchor': 'middle',
                        'style': 'font-family:Coda;font-size:7px;stroke:none;fill:#707070;'
                    });
                    this.svg.rect(dev, x, yy, 10, 8, {
                        'side': equ.mount,
                        'uplink': "0",
                        'vert': 'ok',
                        'class': 'svgpin pin' + i,
                        'pin': i,
                        'shape-rendering': 'crispEdges'
                    });






                }


                break;

            case 2:

                this.verticalPowerSockets(dev, equ)



                break;
            case 3:

                break;
        }





    },
    device: function(num, rack, equ) {

        p = Number(equ.position);
        eu = Number(equ.units);
        if (p > 0 && eu > 0) {
            this.mountrack(num, rack, equ);
        } else {
            this.verticalDevice(num, rack, equ)

        }



   },
    install: function(items) {
        this.items = items


    },
    next: function() {
        //260
        this.left_panel.hide();
        this.right_panel.hide();
        move = winw - 120
        num = Math.floor(move / 720)

        //if(num<=0) num=1

        m = num * 720

        if (winw < 720)
            m = winw




        l = $('#cableview').offset().left
        if (l == 0) {
            m -= 120
        }
        //this.div.css('left',-m)


        //n_r=$('#row').width()/RACK.width



        $("#cableview").animate({
            left: "-=" + m + "px"
        }, 600, "linear",
                function() {
                    CABLE.position()
                });



    },
    prev: function() {
        this.left_panel.hide();
        this.right_panel.hide();
        move = winw - 120
        num = Math.floor(move / 720)

        //if(num<=0) num=1

        m = num * 720

        if (winw < 720)
            m = winw


        cl = $('#cableview').offset().left
        z = cl + m



        if (z == 120) {
            m = m - 120;
        }





        $("#cableview").animate({
            left: "+=" + m + "px"
        }, 600, "linear",
                function() {
                    CABLE.position()
                });


    },
    reset:function() {

        this.div.css('left', 0)

        this.position()
    },
            position: function() {

        svg = $('#cableview svg')

        left = $('#cableview').offset().left
        width = $('#cableview svg').width() + left
        //this.right_panel.hide();
        //this.left_panel.hide();




        if (width > winw) {

            //	this.right_panel.show();
        }
        if (left < 0) {

            //	this.left_panel.show();
        }
        //this.left_panel.show();
        w = svg.width()

        $('#cableview').css('width', w + 'px')

        //total cage width
        CABLE.width = Number(w)
    }




}

function randOrd() {
    return (Math.round(Math.random()) - 0.5);
} 
