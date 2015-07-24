<?php

class Controller_Update extends Controller_Login {

    public function before() {
        parent::before();
        $this->upgrade = new Upgrade();
    }

    public function action_index() {
        echo 'ping';
    }

    public function action_manual() {
        //dont show track on screen, only icon
        $this->upgrade->manual();
    }
    
    public function action_mute() {
        //dont show track on screen, only icon
        $this->upgrade->mute();
    }

    public function action_check() {
        //set track visible on screen
        $this->upgrade->unmute();
        //check server for newer version
        $this->upgrade->check_remote();
        //return data to frontend
        return json_encode($this->upgrade->check());
    }

    public function action_auto() {
        //for comet we need forced flush
        $this->upgrade->headers();

        //local iframe js scripts
        echo '<script>var parentWindow = window.parent;</script>';
        echo '<script>parentWindow.warn("start","")</script>';

        //run autoupgrade 
        $this->upgrade->auto();
    }

}

?>
