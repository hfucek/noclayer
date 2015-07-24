<?php

namespace Basic;

class PDF extends \FPDF {

    public function init($id) {



        $this->device = Model_Device::find($id);

        $this->setTypeOfDevice();

        $this->rack = Model_Rack::find($this->device->rack);

        $this->template = Model_Device_Template::find($this->device->get('type'));

        $this->heightlimit = 750;

        $this->_setTitle();



        $this->_AddPage();
        $this->zoom = 0.75;

        $this->rack_set(90, 50, $this->rack->size);








        $this->device_general();

        if ($this->action[0] == 1)
            $this->device_hardware();

        if ($this->action[1] == 1)
            $this->device_network();

        if ($this->action[2] == 1)
            $this->device_notes();

        $this->device_power();
    }

    private function setTypeOfDevice() {

        switch ($this->device->cat) {




            case 2: //switch
            case 3: //router
            case 8: //fc switch

                $this->net_type = 2;
                break;
            default:
                $this->net_type = 1;
                break;
        }
    }

    private function parent_device() {
        if ($this->device->get('parent_device') == 0)
            return 'none';

        $pd = Model_Device::find($this->device->get('parent_device'));
        return $pd->get('hostname');
    }

    protected function conn_device($id) {
        if ($id == 0)
            return '-';

        $dev = Model_Device::find($id);
        if ($dev)
            return $dev->hostname;


        return '-';
    }

    private function _setTitle() {
        $this->title = 'General';
        if ($this->action[0] == 1) {
            $this->title = 'Hardware';
        } elseif ($this->action[1] == 1) {
            $this->title = 'Network';
        } elseif ($this->action[2] == 1) {
            $this->title = 'Notes';
        }
    }

    private function _AddPage() {
        $this->AddPage();
        $this->components();
        $this->fillFooter();
    }

    function AcceptPageBreak() {
        $this->AddPage();
        $this->components();
        $this->fillFooter();
        $this->SetTextColor(50, 50, 50);
    }

    private function components() {

        $this->SetLineWidth(0.7);
        $this->SetDrawColor(0, 0, 0);

        //horizontal line top
        $this->Line(56.7, 14.2, 581, 14.2);

        //vertical line right
        $this->Line(581, 14.2, 581, 827.7);

        //horizontal bottom
        $this->Line(581, 827.7, 56.7, 827.7);

        //vertical left
        $this->Line(56.7, 827.7, 56.7, 14.2);


        $this->Line(156, 827.7, 156, 771);


        $this->Line(156, 771, 581, 771);

        //799

        $this->Line(420, 827.7, 420, 771);
        $this->Line(420, 799, 581, 799);

        //$this->Line(156,771,581,771);

        $this->Line(540, 827.7, 540, 771);
    }

    private function fillFooter() {
        $this->SetFont('Arial', '', 18);
        $this->SetTextColor(0, 0, 0);
        //name
        $this->text(200, 804, $this->device->get('hostname'));

        $this->SetFont('Arial', '', 12);
        //values
        $this->text(430, 793, $this->device->category->get('name'));
        //	$this->text(430,823,$this->template->get('name'));
        $this->text(545, 793, $this->device->get('rack_units'));
        $this->text(545, 823, $this->device->get('rack_pos'));


        $this->SetFont('Arial', '', 8);
        $this->SetTextColor(30, 144, 250);

        //titels
        $this->text(165, 785, $this->title);

        $this->text(430, 780, 'Category of device');
        $this->text(430, 808, 'Template');

        $this->text(545, 780, 'RU');
        $this->text(545, 808, 'RP');
    }

    private function numbers($x, $y, $ru) {
        $this->SetFillColor(102, 102, 102);
        $this->Rect($x + 3, $y, 10, (18 * $this->zoom * $ru), 'F');

        $this->SetFont('Arial', '', 7);
        $this->SetTextColor(158, 158, 158);

        for ($i = 1; $i <= $ru; $i++) {

            $_y = ($i * 18 * $this->zoom) + $y - 5;
            $this->Text($x + 4, $_y, $ru - $i + 1);
        }
    }

    private function device($name, $pos, $units, $type, $x, $y, $ru) {

        $pos = $ru - $units - $pos + 1;

        $_y = $pos * 18 * $this->zoom + $y;





        //middle
        $this->Image(DOCROOT . 'assets/modules/basic/img/asset/mid.png', $x + (27 * $this->zoom), $_y, 196 * $this->zoom, $units * 18 * $this->zoom);

        //screw left
        $this->Image(DOCROOT . 'assets/modules/basic/img/asset/screw_l1.png', $x + (27 * $this->zoom), $_y, 7 * $this->zoom, 18 * $this->zoom);

        //screw right
        $this->Image(DOCROOT . 'assets/modules/basic/img/asset/screw_r1.png', $x + (216 * $this->zoom), $_y, 7 * $this->zoom, 18 * $this->zoom);

        $this->SetFont('Arial', '', 7);
        $this->SetTextColor(158, 158, 158);

        $this->Text($x + 30, $_y + 10, $name);

        $y_l = $_y + 18 * $this->zoom;

        $this->SetDrawColor(102, 102, 102);

        $this->Line($x + (27 * $this->zoom), $y_l, $x + (27 * $this->zoom) + 196 * $this->zoom, $y_l);
    }

    private function rack_unit($x, $y) {
        $this->Image('assets/modules/basic/img/rack/unit.png', $x, $y, 250 * $this->zoom, 18 * $this->zoom);
    }

    private function rack_set($x, $y, $ru) {


        $this->Image('assets/modules/basic/img/rack/head.png', $x, $y, 250 * $this->zoom, 21 * $this->zoom);

        $y+=(21 * $this->zoom);
        for ($i = 0; $i <= $ru; $i++) {

            $_y = ($i * 18 * $this->zoom) + $y;
            $this->rack_unit($x, $_y);
        }

        $this->numbers($x, $y, $ru);
        //$this->MultiCell(40,100, '1sdfsd f2sdfsdf 3sdf 4sdf 5sdf',0,'R',true);



        $this->device($this->device->hostname, $this->device->rack_pos, $this->device->rack_units, '', $x, $y, $ru);


        $this->Image('assets/modules/basic/img/rack/foot.png', $x, $_y, 250 * $this->zoom, 21 * $this->zoom);
    }

    private function device_title() {
        $this->SetTextColor(158, 158, 158);
        $this->SetFont('Verdana', '', 18);
        $this->Write(18, 'DEVICE: ');
        $this->SetTextColor(100, 100, 100);
        $this->Write(18, $this->device->hostname);
        $this->Ln(30);
    }

    private function add_text($title, $text) {
        if ($this->GetY() >= $this->heightlimit) {
            $this->_AddPage();
        }

        $this->SetTextColor(158, 158, 158);
        $this->Write(14, $title . ' ok');

        $this->Ln(14);
        $this->SetTextColor(50, 50, 50);
        $this->MultiCell(260, 14, $text);
        $this->Ln(18);
    }

    private function check_box($title, $key) {

        $this->SetTextColor(158, 158, 158);
        $this->Write(14, $title);
        $text = 'YES';
        if ($key == 0) {
            $text = 'NO';
        }
        $this->Ln(14);
        $this->SetTextColor(50, 50, 50);
        $this->Write(14, $text);
        $this->Ln(18);
    }

    private function add_line($title, $text) {
        if ($this->GetY() >= $this->heightlimit) {
            $this->_AddPage();
        }

        $this->SetTextColor(158, 158, 158);
        $this->Write(14, $title);

        $this->Ln(14);
        $this->SetTextColor(50, 50, 50);
        $this->Write(14, $text);
        $this->Ln(18);
    }

    private function device_general() {
        $this->SetLeftMargin(295);

        $this->SetFont('Verdana', '', 10);
        $this->Ln(20);

        $this->SetTextColor(30, 144, 250);

        $this->Write(18, 'General');
        $this->SetTextColor(158, 158, 158);
        $this->Ln(18);

        //$this->add_line('Category of device', $this->template->category->get('name'));
        // $this->add_line('Template', $this->template->get('name'));
        // $this->add_line('Name/hostname', $this->device->hostname);
        $this->add_line('Parent device', $this->parent_device());
        $this->add_line('Rack name', $this->rack->name);
        //$this->add_line('Rack position', $this->device->rack_pos);
        // $this->add_line('Rack units', $this->device->rack_units);
    }

    private function validate($val) {
        if (strlen($val) == 0)
            return '...';
        return $val;
    }

    private function ram_field($id, $name) {


        $rams = Model_Ram::find()->where('fieldsetID', $id)->get_one();

        if ($rams) {

            $modules = $rams->rows;





            $this->SetFont('Verdana', '', 10);

            if ($rams['ram_type']) {
                $rt = Model_Ram_Type::find($rams['ram_type']);
                $this->add_line($name, $rt['name']);
            }


            $this->SetLineWidth(0.7);
            $this->SetDrawColor(100, 100, 100);
            $this->SetFont('Verdana', '', 7);

            $this->SetTextColor(100, 100, 100);
            $this->SetFillColor(248, 248, 248);
            $this->Cell(30, 10, 'Slot', 'B', 0, 'L', true);
            $this->Cell(40, 10, 'Size', 'B', 0, 'L', true);
            $this->Cell(100, 10, 'Model', 'B', 0, 'L', true);
            $this->Cell(100, 10, 'Serial', 'B', 0, 'L', true);

            $this->Ln(15);

            foreach ($modules as $mod) {
                if ($this->GetY() >= $this->heightlimit) {
                    $this->_AddPage();
                }

                $d = Array(
                    'Slot' => $this->validate($mod['port']),
                    'Size' => $mod['size'],
                    'Model' => $mod['model'],
                    'Serial' => $mod['serial_number']
                );

                $this->add_ram($d);
                $this->Ln(10);
            }

            $this->Ln(10);
        }
    }

    private function hdd_field($id, $name) {

        $this->SetFont('Verdana', '', 10);
        $raids = Model_Raid::find()->where('fieldsetID', $id)->get_one();
        if ($raids) {

            $discs = $raids->rows;

            $rt = Model_Raid_Type::find($raids['raid_type']);


            $this->add_line($name, $rt['name']);

            if (count($discs) > 0) {
                $this->SetLineWidth(0.7);
                $this->SetDrawColor(100, 100, 100);
                $this->SetFont('Verdana', '', 7);
                $this->SetTextColor(100, 100, 100);
                $this->SetFillColor(248, 248, 248);
                $this->Cell(30, 10, 'Port', 'B', 0, 'L', true);
                $this->Cell(40, 10, 'Size', 'B', 0, 'L', true);
                $this->Cell(100, 10, 'Model', 'B', 0, 'L', true);
                $this->Cell(100, 10, 'Serial', 'B', 0, 'L', true);

                $this->Ln(15);

                foreach ($discs as $mod) {
                    if ($this->GetY() >= $this->heightlimit) {
                        $this->_AddPage();
                    }
                    $d = Array(
                        'port' => $this->validate($mod['vport']),
                        'Size' => $mod['size'],
                        'Model' => $mod['model'],
                        'Serial' => $mod['serial_number']
                    );

                    $this->add_hdd($d);
                    $this->Ln(10);
                }

                $this->Ln(10);
            }
        }
    }

    private function add_ram($d) {
        $this->SetTextColor(50, 50, 50);
        $this->Cell(30, 10, $d['Slot'], 0, 'C');
        $this->Cell(40, 10, $d['Size'], 0, 'C');
        $this->Cell(100, 10, $d['Model'], 0, 'C');
        $this->Cell(100, 10, $d['Serial'], 0, 'C');
    }

    private function add_hdd($d) {
        $this->SetTextColor(50, 50, 50);
        $this->Cell(30, 10, $d['port'], 0, 'C');
        $this->Cell(40, 10, $d['Size'], 0, 'C');
        $this->Cell(100, 10, $d['Model'], 0, 'C');
        $this->Cell(100, 10, $d['Serial'], 0, 'C');
    }

    private function connector($x, $y, $pin_num, $diode, $type) {

        $icons = Array('0' => 'notset', '1' => '_rj45', '2' => '_fiberlc', '3' => '_virtual');


        $this->Image('assets/modules/basic/img/print/' . $icons[$type] . '.png', $x, $y, 25 * $this->zoom, 25 * $this->zoom);

        if ($diode > 0) {
            $this->SetDrawColor(128, 128, 128);
            $fill = 'D';
            if ($diode > 1) {
                $this->SetFillColor(17, 200, 34);
                $fill = 'F';
            }
            $this->Rect($x, $y + 25 * $this->zoom, 5 * $this->zoom, 3 * $this->zoom, $fill);
        }

        $this->SetFont('Arial', '', 7);
        $this->SetTextColor(200, 200, 200);
        $_y = $y + 14 * $this->zoom;
        if ($type == 2)
            $_y = $y + 10 * $this->zoom;
        if ($type == 0)
            $_y = $y + 7 * $this->zoom;


        $_x = $x + 10 * $this->zoom;
        if ($pin_num > 9)
            $_x = $x + 7 * $this->zoom;

        $this->Text($_x, $_y, $pin_num);
    }

    private function ports($ports) {

        $this->title = 'Network';
        $this->_AddPage();

        $h = 25;
        $w = 70;

        $h_rec = 15;





        $total = count($ports);
        $i = 0;
        foreach ($ports as $port) {



            if ($i % 16 == 0) {
                $h+=28;
                $w = 70 + 28;
                $h_rec+=30;
                $this->SetFillColor(100, 100, 100);
                $this->Rect(80, $h_rec, 480, 30, 'F');
            } else {
                $w+=28;
            }

            $ct = 1;
            if ($this->device->cat == 8) {
                $ct = 2;
            }

            switch ($this->net_type) {
                case 1:
                    $ct = $port->conn_type;
                    if ($port->type == 2) {
                        $ct = 3; //virtual	
                    }
                    $diode = 0;
                    break;
                case 2:
                    if ($port->conn_device == 0) {
                        $diode = 1;
                    } else {
                        $diode = 2;
                    }

                    break;
            }




            $this->connector($w, $h, $i + 1, $diode, $ct);
            $i++;
        }
        return $h;
    }

    private function ip_table($ports) {
        $num = 1;
        $this->SetTextColor(50, 50, 50);
        foreach ($ports as $port) {
            if ($this->GetY() >= $this->heightlimit) {
                $this->_AddPage();
            }

            $this->SetFont('Verdana', '', 10);

            $this->SetDrawColor(222, 222, 222);


            $line = 0;
            if ($port->ipv6 == '') {
                $line = 'B';
            }

            $port->ipv4 == '' ? $ipv4 = 'notset' : $ipv4 = $port->ipv4;

            $this->Cell(20, 15, $num . '.', $line, 'C');
            $this->Cell(110, 15, 'IP:' . $ipv4, $line, 'C');






            $port->conn_type == 0 ? $ctype = '-' : $ctype = $port->ctype->name;
            $port->conn_speed == 0 ? $cspeed = '-' : $cspeed = $port->cspeed->name;


            $this->Cell(80, 15, $ctype, $line, 'C');

            $this->Cell(80, 15, $cspeed, $line, 'C');











            if ($port->ipv6 != '') {
                $this->Ln(15);
                $this->Cell(20, 15, ' ', 'B', 'C');
                $this->Cell(270, 15, 'IPv6:' . $port->ipv6, 'B', 'C');
                $this->Ln(20);
            } else {
                $this->Ln(20);
            }
            $num++;
        }
        //print_r($ports);
    }

    private function mac_table($ports) {
        $num = 1;
        foreach ($ports as $port) {

            if ($this->GetY() >= $this->heightlimit) {
                $this->_AddPage();
            }

            $this->SetFont('Verdana', '', 10);

            $this->SetDrawColor(222, 222, 222);

            $this->SetX(100);
            $this->SetTextColor(30, 144, 250);

            $this->SetTextColor(50, 50, 50);
            $this->Cell(30, 15, $num . '.', 'B', 'C');

            $port->mac_address == '' ? $mac = 'notset' : $mac = $port->mac_address;

            $port->vlan == 0 ? $vlan = '-' : $vlan = $port->vlans->name;

            $this->Cell(160, 15, 'MAC: ' . $mac, 'B', 'C');

            $conn_dev = $this->conn_device($port->conn_device);

            $this->Cell(160, 15, $conn_dev, 'B', 'C');


            $this->Cell(100, 15, $vlan, 'B', 'C');


            $num++;
            $this->Ln(20);
        }
        //print_r($ports);
    }

    private function device_notes() {
        $this->SetLeftMargin(80);
        $this->title = 'Notes';
        $this->_AddPage();



        $notes = Model_Notes::find()->where('deviceID', $this->device->id)->get();

        foreach ($notes as $note) {

            $this->Ln(10);
            $this->SetTextColor(150, 150, 150);
            $this->Cell(390, 10, 'Admin', 0);
            $this->Cell(70, 10, date('d-m-Y H:i:s', $note->meta_update_time), 0);
            $this->Ln(15);
            $this->SetTextColor(50, 50, 50);
            $this->MultiCell(470, 10, $note->txt, 0);
            $this->SetDrawColor(180, 180, 180);
            $this->MultiCell(470, 10, ' ', 'B');
        }
    }

    private function device_power() {
        
    }

    private function device_network() {

        $net = Model_Device_Network::find()->where('deviceID', $this->device->id)->get_one();

        switch ($this->net_type) {
            case 1:
                $ports = $net->ip;
                break;
            case 2:
                $ports = $net->mac;
                break;
        }



        $h = $this->ports($ports);

        $this->SetLeftMargin(80);
        $this->SetY($h + 60);


        $num = 1;


        switch ($this->net_type) {
            case 1:
                $this->ip_table($ports);
                break;
            case 2:
                $this->mac_table($ports);
                break;
        }
    }

    private function device_hardware() {

        $this->SetFont('Verdana', '', 10);
        $this->Ln(20);
        $this->SetTextColor(30, 144, 250);

        $this->Write(18, 'Hardware');
        $this->SetTextColor(158, 158, 158);
        $this->Ln(18);

        $data = Model_Device_Fieldset::find()->where('tab', 1)->where('deviceID', $this->device->id)->get();

        foreach ($data as $field) {

            switch ($field['type']) {
                case 'ram':
                    $this->ram_field($field->id, $field['name']);
                    break;
                case 'hdd':
                    $this->hdd_field($field->id, $field['name']);
                    break;
                case 'checkbox':
                    $this->check_box($field['name'], $field['value']);
                    break;

                case 'textarea':
                    $this->SetFont('Verdana', '', 10);
                    $this->add_text($field['name'], $this->validate($field['value']));
                    break;
                default:
                    $this->SetFont('Verdana', '', 10);
                    $this->add_line($field['name'], $this->validate($field['value']));
                    break;
            }
        }
    }

}

class Controller_Print extends Basic {

    public function before() {
        parent::before();
    }

    public function action_get($id = null, $data, $name) {




        if ($id and $data and $name) {


            define('FPDF_FONTPATH', APPPATH . 'views/fonts');
            $pdf = new PDF('P', 'pt', array(595.28, 841.89));
            $pdf->AddFont('Verdana');
            $pdf->SetLineWidth(0.1);
            $pdf->SetAutoPageBreak(true, 80);

            $pdf->action = explode(',', $data);

            $pdf->init($id);




            $pdf->Output('Device:' . $pdf->device->hostname . '.pdf', 'I');
        }
    }

    public function action_template($id = null, $data, $name) {




        if ($id and $data and $name) {


            define('FPDF_FONTPATH', '../fuel/app/views/fonts');
            $pdf = new PDF('P', 'pt', array(595.28, 841.89));
            $pdf->AddFont('Verdana');
            $pdf->SetLineWidth(0.1);
            $pdf->SetAutoPageBreak(true, 80);

            $pdf->action = explode(',', $data);

            $pdf->init($id);




            $pdf->Output('Device:' . $pdf->device->hostname . '.pdf', 'I');
        }
    }

}