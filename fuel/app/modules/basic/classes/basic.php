<?php

namespace Basic;

Class Basic extends \Controller_Login {

    public function before() {
        parent::before();
        $this->_module_Check(1);
    }

    public function action_index() {
        
    }

    public function TempsetTypeOfDevice() {

        if (isset($this->field)) {



            switch ($this->field->template->categoryID) {

                case 5:
                    $this->net_type = 3;
                $this->con_type = 1;

                    break;
                
                case 1: //server
                case 4: //PDU
                case 6: //KVM switch
                case 7: //APC ATS
                case 10: // UPS
                    $this->net_type = 1;
                    $this->con_type = 1;

                    break;

                case 2: //switch
                case 3: //router
                case 8: //fc switch
                    $this->con_type = 1;
                    $this->net_type = 2;
                    break;
            }
        }
    }

    public function setTypeOfDevice() {

        switch ($this->field->device->cat) {

            case 5:
                $this->net_type = 3;
                $this->con_type = 1;

                break;
            
            case 1: //server
            case 4: //PDU
            case 6: //KVM switch
            case 7: //APC ATS
            case 10: // UPS
                $this->net_type = 1;
                $this->con_type = 1;

                break;

            case 2: //switch
            case 3: //router
            case 8: //fc switch
                $this->con_type = 1;
                $this->net_type = 2;
                break;
        }
    }

    public function add_device_default_fields($device) {
        
        //template or device
        if (isset($device->categoryID))
            $cat = $device->categoryID;
        else
            $cat = $device->cat;


        //adding default field depends of device category
        //manufacturer
        $this->insertStaticField('Manufacturer', Array('input', null, null), 1, $device, 1);

        //model
        $this->insertStaticField('Model', Array('input', null, null), 1, $device, 1);

        switch ($cat) {
            case 1: //server
                //cpu type
                $this->insertStaticField('Processor Type', Array('input', null, null), 1, $device, 1);
                //cpu core speed
                $this->insertStaticField('Core speed (GHz)', Array('input', null, '2.66'), 1, $device, 1);
                //Processor Sockets
                $this->insertStaticField('Processor Sockets', Array('eselect', '1,2,3,4,5,6,7,8', 1), 1, $device, 1);
                //Core per sockets
                $this->insertStaticField('Cores per Socket', Array('eselect', '1,2,3,4,5,6,7,8,10,12,14,16,18,20,30,40,80,160', 2), 1, $device, 1);
                //Core per sockets
                $this->insertStaticField('Hyperthreading', Array('checkbox', null, 1), 1, $device, 1);

                $this->insertStaticField('Storage', Array('hdd', null, null), 1, $device, 1);

                $this->insertStaticField('Memory', Array('ram', null, null), 1, $device, 1);
                break;
        }


        switch ($cat) {

            case 1: //server
            case 2: // switch
            case 3: // router
            case 4: //PDU
            case 6: //KVM switch
            case 7: //APC ATS
            case 8: // FC switch
            case 10: // UPS
                //ip address
                $this->insertStaticField('Admin url', Array('input', null, null), 2, $device, 1);

                // network field
                $this->insertStaticField('Ports', Array('network', null, null), 2, $device, 1);


                break;

            default:
                //ip address
                $this->insertStaticField('Admin url', Array('input', null, null), 2, $device, 1);

                break;
        }
        
       
        if($cat ==5)
            $this->insertStaticField('Ports', Array('network', null, null), 2, $device, 1);

        
        
        if ($cat == 1)
            $this->insertStaticField('VPS', Array('vps', null, null), 6, $device, 1);


        if ($cat == 6)
            $this->insertStaticField('KVM settings', Array('kvm_out', null, null), 2, $device, 1);


        switch ($cat) {
            case 1: //server
            case 2: // switch
            case 3: // router
            case 4: //PDU
            case 7: //APC ATS
            case 8: // FC switch
            case 9: // UPS
            case 10: // UPS

                $this->insertStaticField('KVM settings', Array('kvm_in', null, null), 2, $device, 1);
                break;
        }



        switch ($cat) {
            case 4: //PDU
            case 7: //APC ATS
            case 10: // UPS
                $this->insertStaticField('Power distribution', Array('power_out', null, null), 5, $device, 1);
                break;

            case 1: //server
            case 2: // switch
            case 3: // router

            case 6: //KVM switch

            case 8: // FC switch
            case 9: // UPS
                $this->insertStaticField('Power supply', Array('power_in', null, null), 5, $device, 1);
                break;
        }




        //images
        $this->insertStaticField('Images', Array('img', null, null), 3, $device, 0);


        //export to pdf
        $this->insertStaticField('Export to pdf', Array('print', null, null), 3, $device, 0);
    }

}