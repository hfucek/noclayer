
var DEBUGGING = {
    
    init: function() {

        this.data = Array()

        this.recmode = 0
        this.group = 0
        this.record = 0
        this.test = 0
        this.sel = 0
        
        this.tot_group = 0
        this.tot_test = 0
        this.avg_cpu = 0
        this.avg_ram = 0
        this.max_cpu = 0
        this.max_ram = 0
        this.events_on = 0
        this.records = 0
        this.el = 0
        
        this.buffer = Array()

        if (!this.loaded) {
            
            console.log("debugging init");
            
            // load containers.json
            $.getJSON('assets/modules/debugger/containers.json', function(data) {
                DEBUGGING.containers = data
            });
 
            this.render()
            this.render_data()
            this.actions()
            this.loaded = true
            
            //type {input,select..}
            //selector (path)
            //    ->window[yes/no]->tab->element
        }
    },
    
    loading:function(key){
        if(key)
            $('#win_debugging div.win_icon').addClass('deviceLoader').removeClass('default');
        else
            $('#win_debugging div.win_icon').removeClass('deviceLoader').addClass('default');
    },
    
    render: function() {

        var _id = $(DEBUGGING.sel).attr('id')
        var _init = (typeof this.sel !== 'undefined') ? [_id] : ["group_1", "test_1"]
        
        $("#debugging_tree")
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
                    "url": "./debugger/tree",
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
                "valid_children": ["group"],
                "types": {
                    // The default type
                    "record": {
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
                    "test": {
                        // can have files and other folders inside of it, but NOT `drive` nodes
                        "valid_children": ["record"],
                        "icon": {
                            "image": "assets/img/icons.png",
                            "position": "-100px -75px"
                        }

                    },
                    // The `building` nodes 
                    "group": {
                        // can have files and folders inside, but NOT other `drive` nodes
                        "valid_children": ["test"],
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
                "initially_open": ["group_1", "test_1"]
            }
            
        })
        .bind("select_node.jstree", function(e, data) {

            DEBUGGING.sel = data.rslt.obj
            DEBUGGING.sel_type = data.rslt.obj.attr('rel')
            var _rel = data.rslt.obj.attr('rel')
            
            switch(_rel){
                
                case 'group':
                    $('.debug_edit_menu li.group').show()
                    $('.debug_edit_menu li.test').hide()
                    $('.debug_edit_menu li.record').hide()
                    $('.debug_edit_menu li.nadd').hide()
                    break;
                
                case 'test':
                    $('.debug_edit_menu li.group').hide()
                    $('.debug_edit_menu li.test').show()
                    $('.debug_edit_menu li.record').hide()
                    $('.debug_edit_menu li.nadd').show()
                    break;
                    
                case 'record':
                    $('.debug_edit_menu li.group').hide()
                    $('.debug_edit_menu li.test').hide()
                    $('.debug_edit_menu li.record').show()
                    $('.debug_edit_menu li.nadd').hide()
                    break;
            }
        });
    },
    
    // groups
    create_group: function(name, desc) {
        
        // load containers from file
        $.postJSON('debugger/set', {
            'cat': 'group',
            'act': 'new',
            'name': name,
            'desc': desc
        },function(data) {
            
            DEBUGGING.render()
            DEBUGGING.openPop.loading(false)
            DEBUGGING.openPop.win.remove()
            DEBUGGING.loading(false)
        });
    },
            
    edit_group: function(name, desc) {
        
        DEBUGGING.loading(true)
        
        var _id = $(DEBUGGING.sel).attr('id')
        var _gid = _id.replace('group_','')
        
        // load containers from file
        $.postJSON('debugger/set', {
            'id': _gid,
            'cat': 'group',
            'act': 'update',
            'name': name,
            'desc': desc
        },function(data) {
            
            DEBUGGING.openPop.loading(false)
            DEBUGGING.openPop.win.remove()
            DEBUGGING.loading(false)
        });
    },
            
    delete_group: function(gid) {

        DEBUGGING.loading(true)
        
        var _id = $(DEBUGGING.sel).attr('id')
        var _gid = _id.replace('group_','')

        $.postJSON('debugger/rem', {
            'cat': 'group',
            'id':_gid
        },function(data) {
            
            DEBUGGING.render()
            DEBUGGING.openPop.loading(false)
            DEBUGGING.openPop.win.remove()
            DEBUGGING.loading(false)
        });
    },


    //tests
    create_test: function(_name, _desc, _priority) {
    
        DEBUGGING.loading(true)
        
        // load containers from file
        $.getJSON('debugger/set', {
            'cat': 'test',
            'act': 'new',
            'name': name,
            'desc': desc
        },function(data) {
            
            DEBUGGING.render()
            DEBUGGING.loading(false)
        });
    },
    
    edit_test: function(name, desc, priority) {
        
        var _id = $(DEBUGGING.sel).attr('id')
        var _tid = _id.replace('test_','')
        
        var _id = $(DEBUGGING.sel).parent().parent().attr('id')
        var _gid = _id = _id.replace('group_','')
        
        DEBUGGING.loading(true)
        
        // load containers from file
        $.postJSON('debugger/set', {
            'id': _tid,
            'cat': 'test',
            'act': 'update',
            'name': name,
            'priority': priority,
            'desc': desc,
            'gid': _gid
        },function(data) {
            
            DEBUGGING.render()
            DEBUGGING.openPop.loading(false)
            DEBUGGING.openPop.win.remove()
            DEBUGGING.loading(false)
        });
    },
    
    delete_test: function(tid) {
        
        var _id = $(DEBUGGING.sel).attr('id')
        var _gid = _id.replace('test_','')
       
        DEBUGGING.loading(true)

        $.postJSON('debugger/rem', {
            'cat': 'test',
            'id':_gid
        },function(data) {
            
            DEBUGGING.render()
            DEBUGGING.loading(false)
        });
       
    },
    
    clear_test: function(tid) {
        
        /*
        $.each($('#save_act input'), function() {
            $(this).val('');
        });
        */
    },
    
    
    //records
    create_records: function(tid, object, type, action) {
        
        DEBUGGING.loading(true)
        
        $.postJSON('debugger/set', {
            'cat': 'record',
            'tid': tid, 
            'act': 'new',
            'type': type,
            'object': object, 
            'action': action,
        },function(data) {
            
            DEBUGGING.render()
            DEBUGGING.loading(false)
        });
    },
            
    edit_record: function(tid, object, type, action) {
        
        DEBUGGING.loading(true)
        
        $.postJSON('debugger/set', {
            'cat': 'record',
            'tid': tid, 
            'act': 'update',
            'type': type,
            'object': object, 
            'action': action,
        },function(data) {
            
            DEBUGGING.render()
            DEBUGGING.loading(false)
        });
    },
            
    delete_record: function() {
       
        DEBUGGING.loading(true)

        $.postJSON('debugger/rem', {
            'cat': 'record',
            'id': rid
        },function(data) {
            
            DEBUGGING.render()
            DEBUGGING.loading(false)
        });
    },
   
    actions: function() {
    
        group_actions = function(t) {
            
            switch(t) {
                case 1:
                    // add
                    DEBUGGING.group_pop('new')
                    break;
                    
                case 2:
                    // edit
                    DEBUGGING.loading(true)
                    
                    var _id = $(DEBUGGING.sel).attr('id')
                    var _gid = Number(_id.replace('group_',''))
                    
                    $.postJSON('debugger/get', {
                        'cat': 'group',
                        'id': _gid
                    },function(data) {
                        
                        DEBUGGING.loading(false)
                        DEBUGGING.pop_data = data.group[0];
                        DEBUGGING.group_pop('edit')
                    });
                    
                    break;
                    
                case 3:
                    // delete
                    DEBUGGING.del_pop()
                    break;
            }
        }
        
        test_actions = function(t) {
            
            switch(t) {
                case 1:
                    // add
                    DEBUGGING.test_pop('new')
                    break;
                    
                case 2:
                    // edit
                    DEBUGGING.loading(true)
                     
                    var _id = $(DEBUGGING.sel).attr('id')
                    var _tid = Number(_id.replace('test_',''))
                    
                    $.postJSON('debugger/get', {
                        'cat': 'test',
                        'id': _tid
                    },function(data) {
                        
                        DEBUGGING.loading(false)
                        DEBUGGING.pop_data = data.test[0];
                        DEBUGGING.test_pop('edit')
                    });
                    break;
                    
                case 3:
                    // delete
                    DEBUGGING.delete_test()
                    break;
            }
        }
        
        record_actions = function(t) {
            
            switch(t) {
                case 1:
                    // add
                    DEBUGGING.add_record()
                    break;
                case 2:
                    // edit
                    DEBUGGING.edit_record()
                    break;
                case 3:
                    // delete
                    DEBUGGING.delete_record()
                    break;
            }
        }
        
        $('.debug_edit_menu li').click(function() {

            var _cat = Number($(this).attr('cat'))
            var _act = Number($(this).attr('act'))
            
            switch(_cat) {
                
                case 0:
                    if(_act==1) {
                        
                        //start recording
                        DEBUGGING.recmode = true
                        if(!DEBUGGING.events_on) DEBUGGING.selector_events()
                        
                        $(this).hide()
                        $(this).parent().find('.stop').show()
                    }
                    else {
                        // stop recording
                        DEBUGGING.recmode = false
                        $(this).hide()
                        $(this).parent().find('.rec').show()
                    }
                    break;
                
                case 1:
                    group_actions(_act)
                    break;
                
                case 2:
                    test_actions(_act)
                    break;
                    
                case 3:
                    record_actions(_act)
                    break;
            }
            
        });
    },
    
    selector_events: function() {

        var _events = Array(
            
            'blur input',                       //input; text|file
            'blur textarea',                    //textarea
            'change select',                    //select
            
            'click a.abutton div',              //round window button
            'click #win_button',                //window rect button
            'click .icon_button',               //storage, ram buttons with icon
            'click div.icons',                  //add, checkbox buttons
            'click div.win_close',              //close win button
            'click div.win_menu ul li',         //tabs
            'click div.cdiv',                   //rack edit popup
            'click div.rack_unit',              //devices
            'click div.screw',                  //devices
            'click .icon',                      //menu icon div
            
            'click ul.menu li a',               //menu icon div
            'click ul.sub_menu_div',            //menu icon div
            
            'mouseenter div.rack_edit',         //edit rack
            'mouseenter menu_name'              //navigation
        );
        
        $.each(_events, function(i, selector){
            
            var split = selector.split(" ");
            var _event = split[0]
            var _obj = selector.substr(_event.length + 1,selector.length)
            
            $(_obj).on(_event,function(e) {
            
                if(DEBUGGING.recmode) {
                    
                    console.log("object", $(this), "event", _event)
                    
                    DEBUGGING.el = $(this)
                    DEBUGGING.get_selector($(this))
                    
                    /*
                    if (DEBUGGING.find_container($(this).prop('tagName')))
                    
                    this.buffer[0] = $(this);
                    DEBUGGING.get_selector($(this));

                    if (DEBUGGING.find_container($(this).prop('tagName')))
                        console.log("save record");

                    // unset array
                    this.buffer = new Array();
                    */
                }
            });
        });
    },
    
    get_selector: function(el) {

        var _pel = $(el).parent()
        var _id = _pel.attr('id')
        
        if (typeof _id !== 'undefined') 
            this.find_pos(_pel);
        else
            this.get_selector(_pel);
    },
    
    find_pos: function(pel) {
        
        find_div = function(_el, _id) {

            var _events = ''
            var _btnCls = new Array(
                    'abutton',
                    'icon_button',
                    'icons',
                    'win_close',
                    'rack_edit'
                    );

            var _isBtn = false
            var _bn = ''
            
            // chekc if button
            $.each(_btnCls, function(k, v) {
                _events += '#' + _id + ' .abutton,'
                if ($(_el).hasClass(v))
                    _isBtn = true
            });

            //return position
            if (_isBtn) {
                $.each($('#' + _id + ' .abutton, #' + _id + ' .icon_button, #' + _id + ' .icons, #' + _id + ' .win_close'), function(k, v) {
                    console.log("button ", $(v))
                    if ($(_el).is($(v)))
                        _bn = 'button[' + k + ']'
                });
                return _bn
            }

            return false
        }
        
        find_select = function(_el, _id) {
            
            $.each($('#' + _id + ' select'), function(k, v) {
                if ($(_el).is($(v)))
                    return 'select[' + k + ']'
            });
            return false
        }
        
        find_li = function(_el, _id) {

            // tabs
            var _tn = ''
            $.each($('#' + _id + ' li'), function(k, v) {
                if ($(_el).is($(v))) {
                    _tn = 'tab[' + k + ']'
                    return _tn
                }
            });
            return false
        }

        find_input = function(_el, _id) {

            // file
            var _fn = ''
            if (element.attr('type') == 'file') {
                $.each($('#' + _id + ' input[type="text"]'), function(k, v) {
                    if ($(_el).is($(v)))
                        _fn = 'file[' + k + ']'
                });
                return _fn
            }
            else {

                // input
                var _in = ''
                $.each($('#' + _id + ' input'), function(k, v) {
                    if ($(_el).is($(v)))
                        _in = 'input[' + k + ']'
                });
                return _in
            }
            return false
        }
        
        console.log("parent", pel, "element", DEBUGGING.el)
        
        var _el = $(DEBUGGING.el)
        var _id = $(pel).attr('id');
        var _tagname = $(_el).prop('tagName')

        switch (_tagname) {

            case 'DIV':
                var _bn = find_div(_el, _id)
                if(_bn)
                this.buffer.push(_bn)
                break;

            case 'SELECT':
                var _sn = find_select(_el, _id)
                console.log("sn",_sn)
                if(_sn)
                this.buffer.push(_sn)
                break;

            case 'INPUT':
                var _in = find_input(_el, _id)
                if(_in)
                this.buffer.push(_in)
                break;

            case 'LI':
                var _li = find_li(_el, _id)
                if(_li)
                this.buffer.push(_li)
                break;
        }
        
    },
            
    find_container: function(type) {
        
        windows = DEBUGGING.containers.windows;
        devices = windows[0].win_device;
        others = DEBUGGING.containers.others;
        
        path=this.buffer.join(' ')
        
        $.each(devices, function(k, v) {
            
            if (v.path == path) {
                
                // call container func
                if (typeof v.action == 'function')
                    v.action();

                // call view func
                if (typeof this[v.action] == 'function')
                    this[v.action]();
            }
        });
    },
    
    copy_test: function(server, group) {
        // copy test to group on new server
    },
    
    // popups
    group_pop: function(act) {

        var pop = new POPUP.init(
                'New/Edit group', //popup title
                'debug_group', //popup name
                'win_debugging', //parent window
                {
                    w: 350, //width 
                    h: 280, //height
                    wdclass: 'orange2'
                })

        var _args = {
            cancel: true //cancel 
        }
        
        _args['add'] = (act == 'new') ? true : false
        _args['set'] = (act == 'edit') ? true : false
        
        DEBUGGING.openPop = pop

        var _name = (act == 'edit') ? DEBUGGING.pop_data.name : ''
        var _desc = (act == 'edit') ? DEBUGGING.pop_data.description : ''
        
        pop.data(_args,
                '<div class="win_data" style="height:280px;">'
                + '<div class="win_layer win_visible">'
                + '<div class="datadiv" style="width:255px;">'
                + '<fieldset><legend>Name:</legend><input id="debug_group_name" style="width:320px;" value="' + _name +'"></input></fieldset>'
                + '<fieldset><legend>Description:</legend><textarea id="debug_group_desc" style="width:320px;">' + _desc + '</textarea></fieldset>'
                + '</div>'
                + '</div>'
                + '</div>'
                );


        pop.actionSet('win_panel', ['close', 'cancel'], function() {
            pop.win.remove()
        });

        pop.actionSet('windows', ['set','add'], function() {

            pop.loading(true)

            var _name = $('#debug_group_name').val()
            var _desc = $('#debug_group_desc').val()

            if(act == 'new') 
                DEBUGGING.create_group(_name, _desc)
            else
                DEBUGGING.edit_group(_name, _desc)
        });
    },
    
    test_pop: function(act) {

        var pop = new POPUP.init(
                'New/Edit test', //popup title
                'debug_test', //popup name
                'win_debugging', //parent window
                {
                    w: 350, //width 
                    h: 340, //height
                    wdclass: 'orange2'
                })

        var _args = {
            cancel: true //cancel 
        }
        
        _args['new'] = ((act == 'new') ? {add: true } : false)
        _args['set'] = ((act == 'edit') ? {set: true } : false)

        DEBUGGING.openPop = pop
        
        var _name = (act == 'edit') ? DEBUGGING.pop_data.name : ''
        var _desc = (act == 'edit') ? DEBUGGING.pop_data.description : ''

        pop.data(_args,
                '<div class="win_data" style="height:315px;">'
                + '<div class="win_layer win_visible">'
                + '<div class="datadiv" style="width:260px;">'
                + '<fieldset><legend>Name:</legend><input id="debug_test_name" value="' + _name + '" style="width:320px;"></input></fieldset>'
                + '<fieldset><legend>Description:</legend><textarea id="debug_test_desc" style="width:320px;">' + _desc + '</textarea></fieldset>'
                + '<fieldset><legend>Priority:</legend><select id="debug_test_priority">'
                + '<option value="0">Low</option>'
                + '<option value="1">Medium</option>'
                + '<option value="2">High</option>'
                + '</select></fieldset>'
                + '</div>'
                + '</div>'
                + '</div>'
                );

        if(act == 'edit')
            $('#debug_test_priority').val(DEBUGGING.pop_data.priority)

        pop.actionSet('win_panel', ['close', 'cancel'], function() {
            pop.win.remove()
        });
        
        pop.actionSet('windows', ['set','add'], function() {

            var _name = $('#debug_test_name').val()
            var _desc = $('#debug_test_desc').val()
            var _priority = $('#debug_test_priority').val()

            if(act == 'new') 
                DEBUGGING.create_test(_name, _desc, _priority)
            else
                DEBUGGING.edit_test(_name, _desc, _priority)
        });
    },

    copy_pop: function() {

        var pop = new POPUP.init(
                   'Copy test', //popup title
                   'debug_copy', //popup name
                   'win_rack', //parent window
                   {
                       w: 350, //width 
                       h: 430, //height
                       wdclass: 'orange2'
                   })

           var _args = {
               cancel: true //cancel 
           }

           _args.push((act == 'new') ? {add: true } : {set: true })

           DEBUGGING.openPop = pop

           pop.data(_args,
                   '<div class="win_data" style="height:400px;">'
                   + '<div class="win_layer win_visible">'
                   + '<div class="datadiv" style="width:260px;">'
                   + '<fieldset><legend>Server:</legend><input id="debug_copy_server" style="width:320px;"></input></fieldset>'
                   + '<fieldset><legend>Group:</legend><textarea id="debug_copy_group" style="width:320px;"></textarea></fieldset>'
                   + '</div>'
                   + '</div>'
                   + '</div>'
                   );

           pop.actionSet('win_panel', ['close', 'cancel'], function() {
               pop.win.remove()
           });

           pop.actionSet('windows', ['set','add'], function() {

               var _server = $('#debug_copy_server').val()
               var _group = $('#debug_copy_group').val()

               DEBUGGING.copy_test(_server, _group)
           });

    },

    del_pop: function() {

        var pop = new POPUP.init(
                'Remove', //popup title
                'debug_rem', //popup name
                'win_debugging', //parent window
                {
                    w: 350, //width 
                    h: 100, //height
                    wdclass: 'orange2'
                })

        var _args = {
            cancel: true, //cancel 
            rem: true
        }

        DEBUGGING.openPop = pop 

        pop.data(_args,
                '<div class="win_data" style="height:400px;">'
                + '<div class="win_layer win_visible">'
                + '<div class="datadiv" style="width:260px;">'
                + '<fieldset><legend>You sure want to remove it?</legend></fieldset>'
                + '</div>'
                + '</div>'
                + '</div>'
                );

        pop.actionSet('win_panel', ['close', 'cancel'], function() {
            pop.win.remove()
        });

        pop.actionSet('windows', ['rem'], function() {
            
            switch(DEBUGGING.sel_type) {
                
                case 'group':
                    DEBUGGING.delete_group()
                    break;
                    
                case 'test':
                    DEBUGGING.delete_test()
                    break; 
                
                case 'record':
                    DEBUGGING.delete_record()
                    break;
            }
        });
    },
            
    render_data: function() {
        
        display_row = function(i, check) {
                            
                var _cpu = Math.round(Number(check.cpu) * 100) / 100
                var _ram = Math.round(Number(check.ram) * 100) / 100
               
                // store benchmark data
                DEBUGGING.avg_cpu += _cpu
                DEBUGGING.avg_ram += _ram
                
                DEBUGGING.max_cpu = (_cpu > DEBUGGING.max_cpu) ? _cpu : DEBUGGING.max_cpu
                DEBUGGING.max_ram = (_ram > DEBUGGING.max_ram) ? _ram : DEBUGGING.max_ram
                
                var _class = (i%2 == 0) ? 'even' : 'odd'
                _class += Number(check.status) ? ' row_selected' : ' row_error'
                
                var _row = '<tr class = "' + _class + '">'
                        + '<td class = ""> ' + check.id + ' </td>'
                        + '<td class = "">  ' + check.test_name + ' </td>'
                        + '<td class = " sorting_1"> ' + check.time_taken + ' </td>'
                        + '<td class = "center usage">'
                        + '<div class = "bar">'
                        + '<span style = "position:relative;z-index:2;"> ' + _cpu + '% </span>'
                        + '<div style = "width:' + _cpu + '%"> </div>'
                        + '</div>'
                        + '</td>'
                        + '<td class = "center usage">'
                        + '<div class = "bar">'
                        + '<span style = "position:relative;z-index:2;" >' + _ram + 'Mb </span>'
                        + '<div style = "width:' + 100 / check.total_ram * _ram+ '%" > </div>'
                        + '</div>'
                        + '</td>'
                        + '<td class = "selectspace">'
                        + '<div class = "icon" > </div>'
                        + '</td>'
                        + '</tr>';
                
                $(_row).css('background','#ffffff');
                $('#checks_list tbody').append(_row);
        }
        
        
        $.postJSON('./debugger/get/checks', function(data) {

            // fill table with data
            DEBUGGING.checks = data.checks
            $.each(data.checks, function(i, check) {
                display_row(i, check)
            });
            $('#debug_list_info').html('Showing 1 to 15 of ' + data.checks.length + ' entries')
            
            // fill summary with data
            $('.tot_group').html(DEBUGGING.checks.length)
            $('.avg_cpu').html(Math.round((DEBUGGING.avg_cpu / DEBUGGING.checks.length) * 100 / 100) + '%')
            $('.avg_ram').html(DEBUGGING.avg_ram / DEBUGGING.checks.length + 'Mb')
            $('.max_cpu').html(DEBUGGING.max_cpu + '%')
            $('.max_ram').html(DEBUGGING.max_ram + 'Mb')
            
        });
    }
};


/*
DEBUGGING.Models.Record = Backbone.Model.extend({
    // Default attributes for the record item.
    defaults: function() {
        return {
            id: 0,
            path: new Array(),
            event: null
        };
    }
});

DEBUGGING.Collections.Records = Backbone.Collection.extend({
    model: DEBUGGING.Models.Record
});


DEBUGGING.Models.Test = Backbone.Model.extend({
    // Default attributes for the test item.
    defaults: function() {
        return {
            id: 0,
            name: "Untitled",
            category: 0,
            desc: 'Wrote desc here...'
        };
    }
});


DEBUGGING.Collections.Tests = Backbone.Collection.extend({
    model: DEBUGGING.Models.Test
});


DEBUGGING.Views.TestView = Backbone.View.extend({
    el: $("body"),
    events: {
        "click div#toggle_rec": "toggleRec",
        "click div#edit_test": "edit_test",
        "click div#delete_test": "delete_test",
        "click a.save_test": "saveTest",
        "click div#clear_test": "clear_test",
        
        "blur input": "createRec",              //input; text|file
        "blur textarea": "createRec",           //textarea
        "change select": "createRec",           //select
        "click .abutton": "createRec",          //round window button
        "click #win_button": "createRec",       //window rect button
        "click .icon_button": "createRec",      //storage, ram buttons with icon
        "click .icons": "createRec",            //add, checkbox buttons
        "click .win_close": "createRec",        //close win button
        "click .win_menu ul li": "createRec"    //tabs
    },
    initialize: function() {

        this.recmod = false;
        this.selector = new Array();
        this.path = '';
        this.state = false;

        // init models
        this.record = DEBUGGING.Models.Record;
        this.test = DEBUGGING.Models.Test;

        // init collections
        this.records = new DEBUGGING.Collections.Records();
        this.tests = new DEBUGGING.Collections.Tests();

        // load containers.json
        $('#win_debugging div.win_data').append($('<div/>').addClass('dataLoad').html('loading data..'))
        
        $.getJSON('assets/debug/containers.json', function(data) {
            DEBUGGING.Views.TestView.containers = data
        });
        
        $('#win_debugging div.dataLoad').remove()
        
        // bind this view to the add and remove events of the collection
        this.records.bind('add', this.render(this.records, this.tests));
        this.records.bind('remove', this.render(this.records, this.tests));
        
        this.tests.bind('add', this.render(this.records, this.tests));
        this.tests.bind('remove', this.render(this.records, this.tests));        
    },
    render:function(records, tests) {
        
        
        // pošalji data
        // vrati JSON
        
        // pospuni kolekcije
        // update view
        
        console.log(records);
        console.log(tests);
        
        console.log("something changed, please render")
    },
    toggleRec: function(e) {

        target = $(e.currentTarget);
        if (!this.recmode) {
            this.recmode = true;
            target.find('.stop').css('display', 'block');
            target.find('.start').css('display', 'none');

            $('#records_act').css('display', 'block');
            $('#save_act').css('display', 'none');
            console.log('recording is on');
        }
        else {
            this.recmode = false;
            
            target.find('.stop').css('display', 'none');
            target.find('.start').css('display', 'block');
            
            if(this.records.length > 0) {
                $('#save_act .test_title').focus();
                $('#records_act').css('display', 'none');
                $('#save_act').css('display', 'block');
            }
            
            console.log('recording is off');
        }
    },
    createRec: function(e) {

        if (this.recmode) {

            target = $(e.currentTarget);
            this.selector[0] = target;
            this.get_selector(target);

            console.log(this.selector);
            
            if (this.findContainer(target.prop('tagName')))
                console.log("save record");
                this.records.add(new this.record({
                    id: this.records.length,
                    path: this.path,
                    event: e.type
                }));
            
            console.log(this.records.length)
            
            // unset array
            this.selector = new Array();
        }
    },
    get_selector: function(el) {

        pel = el.parent();
        id = pel.attr('id');

        if (pel.length) {

            if (typeof id !== 'undefined')
                this.selector.push(pel);

            // window, stop
            if (pel.hasClass('win'))
                this.find_pos();
            else
                this.get_selector(pel);
        }
        else {
            this.find_pos();
        }
    },
    find_pos: function() {
        
        element = $(this.selector[0]);
        this.selector.reverse();
        pc = this.selector[0].attr('id');

        console.log(element.prop('tagName'));

        switch (element.prop('tagName')) {

            case 'DIV':

                btnCls = new Array('abutton', 'icon_button', 'icons');
                isBtn = false

                $.each(btnCls, function(k, v) {
                    if (element.hasClass(v))
                        isBtn = true
                });
                
                if(isBtn) {
                    $.each($('#'+pc+' .abutton, #'+pc+' .icon_button, #'+pc+'.icons'), function(k, v) {
                    if ($(this).is(element)) 
                        butName = 'button['+k+']';
                    });
                    this.selector[this.buffer.length-1] = butName;
                }
                break;

            case 'SELECT':
                $.each($('#'+pc+' select'), function(k, v) {
                    if ($(this).is(element)) 
                        selName = 'select['+k+']';
                });
                this.selector[this.selector.length-1] = selName;
                break;

            case 'INPUT':
                if (element.attr('type') == 'file') { 
                    // file
                    $.each($('#'+pc+' input[type="text"]'), function(k, v) {
                        if ($(this).is(element)) 
                            fileName = 'file['+k+']';
                    });
                    this.selector[this.selector.length-1] = fileName;
                }
                else {
                    
                    // input
                    $.each($('#'+pc+' input'), function(k, v) {
                        if ($(this).is(element)) 
                            inpName = 'input['+k+']';
                    });
                    this.selector[this.selector.length-1] = inpName;
                }
                break;

            case 'LI':
                // tabs
                $.each($('#'+pc+' li'), function(k, v) {
                    if ($(this).is(element)) 
                        tabName = 'tab['+k+']';
                });
                this.selector[this.selector.length-1] = tabName;
                break;
        }
        
        // fill selector with ids
        len = this.selector.length;
        for(var i=0; i<len-1; i++) 
            this.selector[i] = '#'+this.selector[i].attr('id');
        
    },
    edit_test: function(e) {

        target = $(e.currentTarget);
        dis = target.hasClass('disabled');

        if (!dis) {
            console.log('edit');
        }
    },
    delete_test: function(e) {

        target = $(e.currentTarget);
        dis = target.hasClass('disabled');

        if (!dis) {
            console.log('delete');
        }
    },
    saveTest: function(e) {

        name = $('div.save_act').val();
        category = $('div.test_cat').val();
        desc = $('div.test_desc').val();
        
        len = this.tests.length
        console.log("Len: " + len)
        
        this.tests.add(new this.test({
            id: this.tests.length,
            name: name,
            category: category,
            desc: desc
        }));
        
        if(len != this.tests.length) {
            $('#records_act').css('display', 'block');
            $('#save_act').css('display', 'none');
        }
    },
    clear_test: function(e) {
        $.each($('#save_act input'), function() {
            $(this).val('');
        });
    },
    findContainer: function(type) {
        
        windows = DEBUGGING.Views.TestView.containers.windows;
        devices = windows[0].win_device;
        others = DEBUGGING.Views.TestView.containers.others;
        
        path=this.selector.join(' ')
        
        $.each(devices, function(k, v) {
            
            if (v.path == path) {

                console.log(v.action);

                // call container func
                if (typeof v.action == 'function')
                    v.action();

                // call view func
                if (typeof this[v.action] == 'function')
                    this[v.action]();
            }
        });
    },
    saveRec: function() {
        // save path as string
        console.log("saveRec");
        this.path = this.selector.join(' ');
    }
});

*/
