<?php

/**
 * 
 * This is main controller/router for frontend
 * @author hrvoje
 *
 */

namespace Basic;

class Controller_Ajax extends Basic {

    public function before() {



        parent::before();
    }

    public function action_index() {

        echo 'echo';
    }

    public function action_license($id = null) {

        $out = Array('license' => 'expired');

        $val = \Validation::forge();
        $val->add_field('data', 'licence data', 'required|min_length[10]|max_length[200]');
        if ($val->run()) {

            $active = \Licen::instance()->reactivate($lic);


            $out = Array('license' => $active);
        }



        echo json_encode($out);




        //print_r($this->valid);
    }

    public function action_logout() {
        if (Sentry::check()) {
            Sentry::logout();

            echo json_encode(Array('status' => 'ok'));
        }
    }

    protected function default_settings($user) {
        $props = Array(
            'name' => 'background',
            'value' => '2',
            'meta_update_user' => $user
        );
        $set0 = new Model_Settings($props);
        $set0->save();

        $props2 = Array(
            'name' => 'tutorials',
            'value' => '0',
            'meta_update_user' => $user
        );
        $set = new Model_Settings($props2);
        $set->save();

        return $set0;
    }

    public function action_upgrade() {

        $mig = \Migrate::latest();







        $version = \Model_Version::find('last', array('order_by' => array('meta_update_time' => 'desc')));


        Config::load('install', true);
        Config::set('install.version', $version['value']);
        Config::save('install', 'install');


        echo json_encode(Array('status' => true, 'ver' => $version['value'], 'dat' => Date('d/m/Y', $version['meta_update_time'])));
    }

    private function parse_settings() {

        //when no user loged in, defualt background
        $a = Array(Array('name' => 'background', 'value' => '2'), Array('name' => 'tutorials', 'value' => '0'));


        if (\Sentry::check()) {
            $a = Array();
            $user = \Sentry::user()->get('id');

            $query = \Model_Settings::find()->where('meta_update_user', $user);

            $data = $query->get();

            if ($query->count() == 0) {
                // user (demo) loged first time, make defualt settings
                $this->default_settings($user);
                $query = \Model_Settings::find()->where('meta_update_user', $user);

                $data = $query->get();
            }



            foreach ($data as $s) {
                $m = array('name' => $s->name, 'value' => $s->value);

                array_push($a, $m);
            }

            /*
              $data=Model_Monitoring_Data::find()->where('meta_update_user',$user)->get_one();

              $monitor=array(
              'iconw'=>$data['iconw'],
              'iconc'=>$data['iconc'],
              'iconu'=>$data['iconu'],
              'osdw'=>$data['osdw'],
              'osdu'=>$data['osdu'],
              'osdc'=>$data['osdc'],
              'soundw'=>$data['soundw'],
              'soundu'=>$data['soundu'],
              'soundc'=>$data['soundc']
              );

              $m=array('name'=>'monitoring','value'=>$monitor);

              array_push($a, $m);
              }
             */
        }
        return $a;
    }

    public function action_login() {


        if ($_POST) {

            \Config::load('sentry', true);
            $login_metod = Config::get('sentry.login_column');


            $val = \Validation::forge('users');
            if ($login_metod == 'email') {

                $val->add_field('n', 'Your email', 'required|valid_email');
                $val->add_field('p', 'Your email', 'required|valid_email');
            } else {
                $val->add_field('n', 'Your username', 'required|min_length[4]|max_length[20]');
                $val->add_field('p', 'Your password', 'required|min_length[4]|max_length[20]');
            }

            if ($val->run()) {


                try {

                    // log the user in
                    $valid_login = Sentry::login($val->validated('n'), $val->validated('p'), true);
                } catch (SentryAuthException $e) {
                    // issue logging in via Sentry - lets catch the sentry error thrown
                    // store/set and display caught exceptions such as a suspended user with limit attempts feature.
                    //$errors = $e->getMessage();


                    if (isset($_SERVER['HTTP_NOC_ENV'])) {
                        if ($_SERVER['HTTP_NOC_ENV'] == 'demo') {
                            include 'demo/user.php';
                        }
                    }
                }
            }
        }

        $data['settings'] = $this->parse_settings();


        return \Response::forge(\View::forge('ajax/login', $data));
    }

    public function action_headnav() {
        //print_r($this->valid);

        $data['building'] = Model_Building::find()->where('meta_update_user', $this->user)->get();

        return \Response::forge(\View::forge('ajax/headnav', $data));
    }

    /**
     * 
     * simple function for check is set post variable and 
     * then return value, else return false
     * @param unknown_type $var
     * @return unknown|boolean
     */
    private function isPost($var) {
        if (isset($_POST[$var]))
            return $_POST[$var];
        return false;
    }

    public function action_test() {
        echo'test';
    }

    public function action_room() {

        $rid = 'all';
        if ($_GET) {
            if (isset($_GET['rid']))
                $rid = $_GET['rid'];

            $room = Model_Room::find($rid);
            if ($room) {
                $data['room'] = $room;
                return \Response::forge(\View::forge('ajax/rack', $data));
            }
        }
    }

    /**
     * 
     * frontend device CRUD connector 
     */
    public function action_device($id = null) {


        if ($id) {
            if ($id != 'new') {
                
            } else {

                //create new device in rack, return value
                if ($id == 'new') {

                    $val = \Validation::forge();
                    $val->add_field('rack', 'rack id', 'required|min_length[1]|max_length[20]');

                    //validate rack
                    if ($val->run()) {



                        $rack = Model_Rack::find($val->validated('rack'));
                        //rack exist
                        if ($rack) {


                            //check position 
                            $pos = $this->check_device_position($rack);

                            if ($pos) {
                                $props = array(
                                    'hostname' => 'new device',
                                    'type' => 0,
                                    'cat' => 0,
                                    'rack' => $rack->id,
                                    'rack_pos' => $pos,
                                    'rack_units' => 1,
                                    'parent_device' => 0,
                                    'meta_default_data' => 0,
                                    'meta_update_time' => time(),
                                    'meta_update_user' => $this->user
                                );
                                //print_r($props);

                                $new = new Model_Device($props);



                                $new->save();


                                $dev = array(
                                    "id" => $new['id'],
                                    "position" => $new['rack_pos'],
                                    "units" => $new['rack_units'],
                                    "type" => $new['type'],
                                    "cat" => 0,
                                    "host" => $new['hostname'],
                                    "parent" => $new['parent_device']
                                );
                            }


                            echo json_encode($dev);
                        }
                    } else {
                        $error = $val->error();
                        print_r($error);
                    }
                }
            }
        }
    }

    /**
     * 
     * frontend CRUD connector for rack managment ...
     * @author hrvoje
     * @param unknown_type $id
     */
    public function action_rack($id = null) {
        if ($id) {
            if ($id != 'new') {
                $rack = Model_Rack::find($id);

                if ($rack) {
                    $update = $this->isPost('up');
                    if ($update) {
                        $set = false;
                        //name of rack
                        $name = $this->isPost('name');
                        if ($name) {
                            $rack->name = $name;
                            $set = true;
                        }
                        //rack size
                        $size = $this->isPost('size');
                        if ($size) {
                            $rack->size = $size;
                            $set = true;
                        }

                        //save data to rack
                        if ($set) {
                            $rack->meta_update_time = time();
                            $rack->meta_update_user = $this->user;
                            $rack->save();
                            echo json_encode(array('success'=>'ok'));
                        }
                    }
                }
                
            }

            //new rack
            if ($id == 'new') { 
                $val = \Validation::forge();
                $val->add_field('room', 'room id', 'required|min_length[1]|max_length[20]');
                if ($val->run()) {

                    $ord=0;
                    $rc=Model_Rack::find()->where('room', $val->validated('room'))->get();
                    foreach($rc as $rack)
                        if($rack->room_pos>$ord) 
                            $ord=$rack->room_pos;
                    
                    //check if room exist
                    $roomdata = Model_Room::find($_POST['room']);
                    if ($roomdata) {

                        $props = array(
                            'name' => 'new rack',
                            'room' => $_POST['room'],
                            'room_pos' => $ord+1,
                            'hidden_rack' => 0,
                            'size' => 42,
                            'position' => 0,
                            'notes' => null,
                            'meta_default_data' => 0,
                            'meta_update_time' => time(),
                            'meta_update_user' => $this->user,
                        );
                        //print_r($props);

                        $new = new Model_Rack($props);

                        $new->save();

                        $rack = array(
                            "name" => $new['name'],
                            "units" => $new['size'],
                            "id" => $new['id'],
                            "equs" => array()
                        );

                        
                        
                        
                        // delete gaps
                        $racks=Model_Rack::find()->where('room', $val->validated('room'))->order_by('room_pos', 'asc')->get();
                        
                        $i=1;
                        foreach ($racks as $r) {
                            $r->room_pos=$i;
                            $r->save();
                            $i++;
                        }
                        
                        echo json_encode($rack);
                    }
                }
            }
            
            if ($id == 'move') {
                
                $val = \Validation::forge();
                $val->add_field('id', 'rack id', 'required|min_length[1]|max_length[20]');
                $val->add_field('room', 'room id', 'required|min_length[1]|max_length[20]');
                $val->add_field('ord', 'order', 'required|min_length[1]|max_length[20]');
                $val->add_field('to', 'to another room', 'required|min_length[1]|max_length[1]');
                
                if ($val->run()) {
                    
                    $rack=Model_Rack::find()->where('id', $val->validated('id'))->get_one();
                    
                    if($rack){
                        
                        $nr=$val->validated('room');
                        $no=$val->validated('ord');
                        
                        $new_room_r=Model_Rack::find()->where('room', $nr)->where('room_pos','>=',$no)->order_by('room_pos', 'asc')->get();
                        $old_room_r=Model_Rack::find()->where('room', $rack->room)->where('room_pos','>=',$rack->room_pos)->order_by('room_pos', 'asc')->get();
                        
                        
                        // update room set room_pos
                        $n=$no+1; //2
                        foreach ($new_room_r as $new_rack) {
                            $new_rack->room_pos=$n;
                            $new_rack->save();
                            
                            $n++;
                        }
                        

                        $n = $rack->room_pos-1; //2
                        foreach ($old_room_r as $old_rack) {
                            
                            if($n==$no-1) {
                                $n++;
                                if(!$val->validated('to'))
                                    $no--;
                            }
                            
                            $old_rack->room_pos = $n;
                            $old_rack->save();

                            $n++;
                        }
                        
                        \Log::debug("no".$no);
                        
                        $rack->room=$nr;
                        $rack->room_pos=$no;
                        
                        $rack->save();
                        
                        // delete gaps
                        $new_room_r=Model_Rack::find()->where('room', $nr)->order_by('room_pos', 'asc')->get();
                        $old_room_r=Model_Rack::find()->where('room', $rack->room)->order_by('room_pos', 'asc')->get();
                        
                        $i=1;
                        foreach ($old_room_r as $old_rack) {
                            $old_rack->room_pos=$i;
                            $old_rack->save();
                            $i++;
                        }
                        
                        $i=1;
                        foreach ($new_room_r as $new_rack) {
                            $new_rack->room_pos=$i;
                            $new_rack->save();
                            $i++; 
                        }
                        
                        echo json_encode(array('status' => 'ok'));
                    }
                }
                
             }
             
             if ($id == 'pos') {
                
                $val = \Validation::forge();
                $val->add_field('id', 'rack id', 'required|min_length[1]|max_length[20]');
                $val->add_field('pos', 'position id', 'required|min_length[1]|max_length[20]');
                
                if ($val->run()) {
                    $rack = Model_Rack::find()->where('id', $val->validated('id'))->get_one();
                    if ($rack) {
                        $rack->position = $val->validated('pos');
                        $rack->save();
                    }
                    echo json_encode(array('status' => 'ok'));
                }
             }
        }
    }
    

    /**
     * 
     * When user atempt to create device in rack, we need to ensure 
     * that there is enough space left in rack ... 
     * in case of free space return first avaiable position for device 1 RU 
     * @author hrvoje
     * @return position / false

     */
    private function check_device_position(Model_Rack $rack) {

        $empty = array_fill(0, $rack->size + 1, true);

        $devices = $rack->device;

        foreach ($devices as $dev) {
            //position in rack
            $pos = $dev['rack_pos'];
            //rack units
            $uni = $dev['rack_units'] + $pos;

            //take space in array
            for ($i = $pos; $i < $uni; $i++) {
                $empty[$i] = false;
            }
        }

        for ($i = 1; $i <= $rack->size + 1; $i++) {
            if ($empty[$i])
                return $i;
        }
        return false;

        //simple solution-> get all device from database and fill "empty" array 
    }

}