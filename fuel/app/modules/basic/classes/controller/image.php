<?php

namespace Basic;

class Controller_Image extends Basic {

    public function before() {

        parent::before();
    }

    public function action_remove() {
        $val = \Validation::forge();
        $val->add_field('eid', 'Element id', 'required|min_length[1]|max_length[20]');
        $val->add_field('im', 'Image id', 'required|min_length[1]|max_length[20]');
        $val->add_field('tmpl', 'Template or device', 'required|min_length[1]|max_length[20]');
        if ($val->run()) {


            if ($val->validated('tmpl') == 'true') {
                $element = Model_Device_Template_Field::find($val->validated('eid'));

                $img = Model_Device_Template_Image::find()->where('id', $val->validated('im'))->where('elementID', $element->id)->get_one();
            } else {
                $element = Model_Device_Fieldset::find($val->validated('eid'));

                $img = Model_Image::find()->where('id', $val->validated('im'))->where('elementID', $element->id)->get_one();
            }
            if ($img) {

                $img->delete();

                echo json_encode(array('stat' => 'ok'));
            }
        }
    }

    private function sizeType($sizes) {
        if ($sizes->width >= $sizes->height) {
            return 'w';
        }
        return 'h';
    }

    public function action_upload() {


        $out = Array('status' => 'no');


        $val = \Validation::forge();
        $val->add_field('key2', 'Element id', 'required|min_length[1]|max_length[20]');
        $val->add_field('key1', 'Device id', 'required|min_length[1]|max_length[20]');
        $val->add_field('key3', 'Template or device', 'required|min_length[1]|max_length[20]');
        if ($val->run()) {



            $uploaddir = DOCROOT . 'images/uploads/';
            $name = basename($_FILES['image']['name']);
            $uploadfile = $uploaddir . $name;



            if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadfile)) {

                if ($val->validated('key3') != 'true') {
                    $this->tmpl = false;
                    $element = Model_Device_Fieldset::find($val->validated('key2'));
                } else {
                    $this->tmpl = true;
                    $element = Model_Device_Template_Field::find($val->validated('key2'));
                }



                if ($element) {


                    $imageOnHdd = \Image::forge()
                            ->load($uploadfile);

                    $sizes = $imageOnHdd->sizes();

                    //add new image in database
                    $props = Array(
                        'name' => $name,
                        'elementID' => $element->id,
                        'type' => $this->sizeType($sizes),
                        'width' => 0,
                        'height' => 0
                    );

                    if ($this->tmpl) {
                        $img = new Model_Device_Template_Image($props);
                        $prefix = 'temp';
                    } else {
                        $prefix = '';
                        $img = new Model_Image($props);
                    }

                    $new_width = $sizes->width >= 1000 ? 1000 : $sizes->width;
                    $new_height = $sizes->height >= 750 ? 750 : $sizes->height;


                    //resize original image 1000x1000px to folder > public/images 
                    //make thumb 135x135px to folder public/images/thumb

                    if ($img->save()) {

                        $imageOnHdd->resize($new_width, $new_height, true, false)
                                ->save(DOCROOT . 'images/' . $prefix . $img->id . '.png')
                                ->config('quality', 70)
                                ->crop_resize(85, 85, true, false)
                                ->save(DOCROOT . 'images/tumb/' . $prefix . $img->id . '.png');


                        $resized = \Image::forge()
                                        ->load(DOCROOT . 'images/' . $prefix . $img->id . '.png')->sizes();


                        $img->width = $resized->width;
                        $img->height = $resized->height;

                        $img->save();
                        unlink($uploadfile);

                        $out = Array('id' => $img->id, 'type' => $img->type, 'status' => 'ok', 'h' => $img->height, 'w' => $img->width);
                    }
                }
            }
        }


        echo json_encode($out);
    }

}