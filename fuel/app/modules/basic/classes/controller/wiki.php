<?php

namespace Basic;

class Controller_Wiki extends Basic {

    public function before() {
        parent::before();
    }

    public function action_prew() {


        $val = \Validation::forge();
        $val->add_field('data', 'node type', 'required|min_length[1]');
        if ($val->run()) {

            $m = new \WikiParser();
            $data = $m->parse($val->validated('data'));
            echo json_encode(Array('data' => urlencode($data)));
        }
    }

    /*
     * Wiki category list
     * 
     * @param string 
     * */

    public function action_getcat() {


        if (isset($_POST['cat'])) {
            $key = $_POST['cat'];



            $out = Array('cats' => Array(), 'data' => Array(), 'selected' => $key);


            $cats = Model_Wikicat::find()->get();

            foreach ($cats as $cat) {
                array_push($out['cats'], Array('id' => $cat->id, 'title' => $cat->name));
            }


            $wikis = Model_Wiki::find()->where('catID', $key)->where('meta_update_user', $this->user)->get();


            foreach ($wikis as $wiki) {

                array_push($out['data'], Array('id' => $wiki->id, 'title' => $wiki->title, 'time' => date('d-m-Y H:i:s', $wiki->meta_update_time)));
            }


            echo json_encode($out);
        }
    }

    public function action_remcat() {


        if (isset($_POST['cat'])) {
            $key = $_POST['cat'];




            $cat = Model_Wikicat::find($key);

            if ($cat) {

                $wikis = Model_Wiki::find()->where('catID', $key)->get();

                foreach ($wikis as $wiki) {
                    $wiki->delete();
                }

                $cat->delete();
            }


            $cat = Model_Wikicat::find()->limit(1)->get_one();
            $key = $cat->id;


            $out = Array('cats' => Array(), 'data' => Array(), 'selected' => $key);


            $cats = Model_Wikicat::find()->get();

            foreach ($cats as $cat) {
                array_push($out['cats'], Array('id' => $cat->id, 'title' => $cat->name));
            }


            $wikis = Model_Wiki::find()->where('catID', $key)->where('meta_update_user', $this->user)->get();


            foreach ($wikis as $wiki) {

                array_push($out['data'], Array('id' => $wiki->id, 'title' => $wiki->title, 'time' => date('d-m-Y H:i:s', $wiki->meta_update_time)));
            }



            echo json_encode($out);
        }
    }

    public function action_renamecat() {


        $val = \Validation::forge();

        $val->add_field('cat', 'category wiki', 'required|min_length[1]');
        $val->add_field('val', 'new name wiki', 'required|min_length[1]');
        if ($val->run()) {


            $iscat = Model_Wikicat::find($val->validated('cat'));


            if ($iscat) {

                $iscat->name = $val->validated('val');
                $iscat->save();
            }

            $key = $val->validated('cat');



            $out = Array('cats' => Array(), 'data' => Array(), 'selected' => $key);


            $cats = Model_Wikicat::find()->get();

            foreach ($cats as $cat) {
                array_push($out['cats'], Array('id' => $cat->id, 'title' => $cat->name));
            }


            $wikis = Model_Wiki::find()->where('catID', $key)->where('meta_update_user', $this->user)->get();


            foreach ($wikis as $wiki) {

                array_push($out['data'], Array('id' => $wiki->id, 'title' => $wiki->title));
            }


            echo json_encode($out);
        }
    }

    public function action_setcat() {


        if (isset($_POST['cat'])) {
            $key = $_POST['cat'];


            $iscat = Model_Wikicat::find()->where('name', $key)->get_one();

            if (count($iscat) == 0) {

                $prop = Array('name' => $key);
                $cat = new Model_Wikicat($prop);
                $cat->save();
                $key = $cat->id;
            }





            $out = Array('cats' => Array(), 'data' => Array(), 'selected' => $key);


            $cats = Model_Wikicat::find()->get();

            foreach ($cats as $cat) {
                array_push($out['cats'], Array('id' => $cat->id, 'title' => $cat->name));
            }


            $wikis = Model_Wiki::find()->where('catID', $key)->where('meta_update_user', $this->user)->get();


            foreach ($wikis as $wiki) {

                array_push($out['data'], Array('id' => $wiki->id, 'title' => $wiki->title));
            }


            echo json_encode($out);
        }
    }

    public function action_titles() {

        $out = Array('data' => Array());
        $key = false;
        if (isset($_GET['key']))
            $key = $_GET['key'];


        if (strlen($key) > 0) {
            $key = '%' . $key . '%';
            $wikis = Model_Wiki::find()->where('title', 'like', $key)->limit(5)->where('meta_update_user', $this->user)->get();
        } else {
            $wikis = Model_Wiki::find()->limit(5)->where('meta_update_user', $this->user)->get();
        }





        foreach ($wikis as $wiki) {

            array_push($out['data'], Array('id' => $wiki->id, 'title' => $wiki->title, 'catID' => $wiki->catID));
        }






        echo json_encode($out);
    }

    private function customCode($data) {

        $data = str_replace('&lt;pre&gt;', '<pre>', $data);
        $data = str_replace('&lt;/pre&gt;', '</pre>', $data);
        $data = str_replace('&lt;code&gt;', '<code>', $data);
        $data = str_replace('&lt;/code&gt;', '</code>', $data);

        $data = str_replace('&lt;tt&gt;', '<tt>', $data);
        $data = str_replace('&lt;/tt&gt;', '</tt>', $data);


        return $data;
    }

    public function action_html() {

        $val = \Validation::forge();
        $val->add_field('wid', 'node type', 'required|min_length[1]');
        if ($val->run()) {

            if ($val->validated('wid') == 0)
                $wiki = Model_Wiki::find()->get_one();
            else
                $wiki = Model_Wiki::find($val->validated('wid'));



            $m = new \WikiParser();
            $data = $m->parse(htmlspecialchars($wiki->content));
            $data = $this->customCode($data);

            echo json_encode(Array('data' => urlencode($data), 'id' => $wiki->id, 'title' => $wiki->title, 'catID' => $wiki->catID));
        }
    }

    public function action_rem() {

        $val = \Validation::forge();
        $val->add_field('wid', 'node type', 'required|min_length[1]');
        if ($val->run()) {

            $wiki = Model_Wiki::find($val->validated('wid'));
            if ($wiki) {
                $wiki->delete();

                $wiki = Model_Wiki::find()->get_one();
                $m = new \WikiParser();
                if ($wiki) {
                    $data = $m->parse(htmlspecialchars($wiki->content));
                    $data = $this->customCode($data);



                    echo json_encode(Array('data' => urlencode($data), 'id' => $wiki->id, 'title' => $wiki->title, 'catID' => $wiki->catID));
                } else {
                    echo json_encode(Array('nop' => 'ok'));
                }
            }
        }
    }

    public function action_set() {

        $val = \Validation::forge();
        $val->add_field('wid', 'node type', 'required|min_length[1]');
        $val->add_field('data', 'data wiki', '');
        $val->add_field('cat', 'category wiki', 'required|min_length[1]');
        $val->add_field('title', 'title wiki', 'required|min_length[1]');
        if ($val->run()) {

            if ($val->validated('wid') == 'new') {

                $props = Array(
                    'catID' => $val->validated('cat'),
                    'content' => $val->validated('data'),
                    'title' => $val->validated('title'),
                    'meta_update_time' => time(),
                    'meta_update_user' => $this->user
                );

                $wiki = new Model_Wiki($props);
                $wiki->save();
            } else {

                if ($val->validated('wid') == 0) {
                    $wiki = Model_Wiki::find()->get_one();
                } else {
                    $wiki = Model_Wiki::find($val->validated('wid'));
                }


                if ($wiki) {
                    $wiki->content = $val->validated('data');
                    $wiki->title = $val->validated('title');
                    $wiki->catID = $val->validated('cat');
                    $wiki->meta_update_time = time();
                    $wiki->save();
                }
            }


            $m = new \WikiParser();
            $data = $m->parse(htmlspecialchars($wiki->content));

            $data = $this->customCode($data);



            echo json_encode(Array('data' => urlencode($data), 'id' => $wiki->id, 'title' => $wiki->title, 'catID' => $wiki->catID));
        }
    }

    public function action_get() {

        $val = \Validation::forge();
        $val->add_field('wid', 'node type', 'required|min_length[1]');
        if ($val->run()) {

            if ($val->validated('wid') == 0)
                $wiki = Model_Wiki::find()->get_one();
            else
                $wiki = Model_Wiki::find($val->validated('wid'));



            echo json_encode(Array('data' => urlencode($wiki->content), 'id' => $wiki->id, 'title' => $wiki->title, 'catID' => $wiki->catID));
        }
    }

    public function action_index() {

        $wiki = Model_Wiki::find(1);


        echo json_encode(Array('data' => urlencode($wiki->content)));
    }

}