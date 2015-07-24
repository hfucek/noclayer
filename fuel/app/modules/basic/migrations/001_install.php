<?php

namespace Fuel\Migrations;

class Install {

    function up() {


        $user = \DB::select('id')->from('users')->limit(1)->execute()->current();



        /*         * *********************************************************************************************
          building
         * ********************************************************************************************* */
        $building = \DBUtil::checkIfExist('building');
        if (!$building) {
            \DBUtil::create_table('building', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'name' => array('constraint' => 250, 'type' => 'varchar'),
                'name_short' => array('constraint' => 250, 'type' => 'varchar', 'null' => true),
                'notes' => array('type' => 'text', 'null' => true),
                'meta_default_data' => array('constraint' => 11, 'type' => 'int', 'null' => true, 'default' => '0'),
                'meta_update_time' => array('constraint' => 11, 'type' => 'int', 'default' => '0'),
                'meta_update_user' => array('constraint' => 11, 'type' => 'int', 'default' => '0')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            // insert default building
            list($building_id, $rows_affected) = \DB::insert('building')->columns(
                            array(
                                'id',
                                'name',
                                'name_short',
                                'notes',
                                'meta_default_data',
                                'meta_update_time',
                                'meta_update_user'
                    ))->values(
                            array('1', 'Building Demo', '', '', '', time(), $user['id'])
                    )->execute();
        }

        /*         * *********************************************************************************************
          cables
         * ********************************************************************************************* */
        $cables = \DBUtil::checkIfExist('cables');
        if (!$cables) {
            \DBUtil::create_table('cables', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'dev1' => array('constraint' => 11, 'type' => 'int'),
                'port1' => array('constraint' => 11, 'type' => 'int'),
                'name1' => array('constraint' => 4, 'type' => 'int'),
                'dev2' => array('constraint' => 11, 'type' => 'int'),
                'port2' => array('constraint' => 11, 'type' => 'int'),
                'name2' => array('constraint' => 4, 'type' => 'int'),
                'type' => array('constraint' => 11, 'type' => 'int'),
                'meta_update_time' => array('constraint' => 11, 'type' => 'int', 'default' => '0'),
                'meta_update_user' => array('constraint' => 11, 'type' => 'int', 'default' => '0')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );


            //create indexes for cable devices
            \DBUtil::create_index('cables', 'dev1');
            \DBUtil::create_index('cables', 'dev2');
        }

        /*         * *********************************************************************************************
          connector speed
         * ********************************************************************************************* */
        $connector_speed = \DBUtil::checkIfExist('connector_speed');
        if (!$connector_speed) {
            \DBUtil::create_table('connector_speed', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'name' => array('constraint' => 250, 'type' => 'varchar')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            \DBUtil::truncate_table('connector_speed');
            // insert default connector speed
            list($insert_id, $rows_affected) = \DB::insert('connector_speed')->columns(array('id', 'name'))->values(
                            array('1', '10 MBs'), array('2', '10/100 MBs'), array('3', '1 GBs'), array('4', '10 GBs')
                    )->execute();
        }


        /*         * *********************************************************************************************
          connector type
         * ********************************************************************************************* */
        $connector_type = \DBUtil::checkIfExist('connector_type');
        if (!$connector_type) {
            \DBUtil::create_table('connector_type', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'name' => array('constraint' => 250, 'type' => 'varchar')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );


            \DBUtil::truncate_table('connector_type');

            // insert default connector type
            list($insert_id, $rows_affected) = \DB::insert('connector_type')->columns(array('id', 'name'))->values(
                            array('1', 'RJ45'), array('2', 'Fiber LC')
                    )->execute();
        }
        /*         * *********************************************************************************************
          device
         * ********************************************************************************************* */
        $device = \DBUtil::checkIfExist('device');
        if (!$device) {
            \DBUtil::create_table('device', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'hostname' => array('constraint' => 250, 'type' => 'varchar'),
                'type' => array('constraint' => 11, 'type' => 'int'),
                'cat' => array('constraint' => 11, 'type' => 'int'),
                'rack' => array('constraint' => 11, 'type' => 'int'),
                'rack_pos' => array('constraint' => 11, 'type' => 'int', 'default' => '0'),
                'rack_units' => array('constraint' => 11, 'type' => 'int', 'default' => '1'),
                'parent_device' => array('constraint' => 11, 'type' => 'int', 'default' => '0'),
                'meta_default_data' => array('constraint' => 11, 'type' => 'int', 'default' => '0'),
                'meta_update_time' => array('constraint' => 11, 'type' => 'int', 'default' => '0'),
                'meta_update_user' => array('constraint' => 11, 'type' => 'int', 'default' => '0')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for device
            \DBUtil::create_index('device', 'type');
            \DBUtil::create_index('device', 'cat');
            \DBUtil::create_index('device', 'rack');
        }
        /*         * *********************************************************************************************
          device category
         * ********************************************************************************************* */
        $device_category = \DBUtil::checkIfExist('device_category');
        if (!$device_category) {
            \DBUtil::create_table('device_category', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'name' => array('constraint' => 250, 'type' => 'varchar')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            \DBUtil::truncate_table('device_category');
            // insert default connector type
            list($insert_id, $rows_affected) = \DB::insert('device_category')->columns(array('id', 'name'))->values(
                            array('1', 'Server'), array('2', 'Switch'), array('3', 'Router'), array('4', 'PDU'), array('5', 'Patch Panel'), array('6', 'KVM Switch'), array('7', 'APC ATS'), array('8', 'FC Switch'), array('9', 'Human Interface'), array('10', 'UPS')
                    )->execute();
        }

        /*         * *********************************************************************************************
          device fieldset
         * ********************************************************************************************* */
        $device_fieldset = \DBUtil::checkIfExist('device_fieldset');
        if (!$device_fieldset) {
            \DBUtil::create_table('device_fieldset', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'name' => array('constraint' => 250, 'type' => 'varchar'),
                'type' => array('constraint' => 250, 'type' => 'varchar'),
                'deviceID' => array('constraint' => 11, 'type' => 'int'),
                'tab' => array('constraint' => 11, 'type' => 'int'),
                'value' => array('type' => 'text', 'null' => true),
                'extra' => array('constraint' => 250, 'type' => 'varchar', 'null' => true),
                'static' => array('constraint' => 1, 'type' => 'int')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for device
            \DBUtil::create_index('device_fieldset', 'deviceID');
            //\DBUtil::create_index('device_fieldset',array('name','type','deviceID'),'un_key_field','unique');
        }

        /*         * *********************************************************************************************
          device KVM
         * ********************************************************************************************* */
        $device_kvm = \DBUtil::checkIfExist('device_kvm');
        if (!$device_kvm) {
            \DBUtil::create_table('device_kvm', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'fieldsetID' => array('constraint' => 11, 'type' => 'int'),
                'deviceID' => array('constraint' => 11, 'type' => 'int'),
                'input' => array('constraint' => 11, 'type' => 'int'),
                'output' => array('constraint' => 11, 'type' => 'int'),
                'type' => array('constraint' => 11, 'type' => 'int')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for device kvm
            \DBUtil::create_index('device_kvm', 'fieldsetID');
            \DBUtil::create_index('device_kvm', 'deviceID');
        }

        /*         * *********************************************************************************************
          device KVM socket
         * ********************************************************************************************* */
        $device_kvm_socket = \DBUtil::checkIfExist('device_kvm_socket');
        if (!$device_kvm_socket) {
            \DBUtil::create_table('device_kvm_socket', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'kvmID' => array('constraint' => 11, 'type' => 'int'),
                'conn_type' => array('constraint' => 11, 'type' => 'int'),
                'type' => array('constraint' => 11, 'type' => 'int')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for device kvm socket
            \DBUtil::create_index('device_kvm_socket', 'kvmID');
        }


        /*         * *********************************************************************************************
          device network
         * ********************************************************************************************* */
        $device_network = \DBUtil::checkIfExist('device_network');
        if (!$device_network) {
            \DBUtil::create_table('device_network', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'fieldsetID' => array('constraint' => 11, 'type' => 'int'),
                'deviceID' => array('constraint' => 11, 'type' => 'int'),
                'nics' => array('constraint' => 11, 'type' => 'int'),
                'vports' => array('constraint' => 11, 'type' => 'int'),
                'ports' => array('constraint' => 11, 'type' => 'int'),
                'uplinks' => array('constraint' => 11, 'type' => 'int'),
                'config_data' => array('type' => 'text'),
                'type' => array('constraint' => 11, 'type' => 'int')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for device network
            \DBUtil::create_index('device_network', 'fieldsetID');
            \DBUtil::create_index('device_network', 'deviceID');
        }

        /*         * *********************************************************************************************
          device Power
         * ********************************************************************************************* */
        $device_power = \DBUtil::checkIfExist('device_power');
        if (!$device_power) {
            \DBUtil::create_table('device_power', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'fieldsetID' => array('constraint' => 11, 'type' => 'int'),
                'deviceID' => array('constraint' => 11, 'type' => 'int'),
                'input' => array('constraint' => 11, 'type' => 'int'),
                'output' => array('constraint' => 11, 'type' => 'int'),
                'current' => array('constraint' => 11, 'type' => 'int'),
                'ru' => array('constraint' => 11, 'type' => 'int'),
                'pos' => array('constraint' => 11, 'type' => 'int'),
                'type' => array('constraint' => 11, 'type' => 'int')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for device kvm
            \DBUtil::create_index('device_power', 'fieldsetID');
            \DBUtil::create_index('device_power', 'deviceID');
        }

        /*         * *********************************************************************************************
          device Power socket
         * ********************************************************************************************* */
        $device_power_socket = \DBUtil::checkIfExist('device_power_socket');
        if (!$device_power_socket) {
            \DBUtil::create_table('device_power_socket', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'powerID' => array('constraint' => 11, 'type' => 'int'),
                'conn_type' => array('constraint' => 11, 'type' => 'int'),
                'type' => array('constraint' => 11, 'type' => 'int')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for device kvm socket
            \DBUtil::create_index('device_power_socket', 'powerID');
        }

        /*         * *********************************************************************************************
          device template
         * ********************************************************************************************* */
        $device_template = \DBUtil::checkIfExist('device_template');
        if (!$device_template) {
            \DBUtil::create_table('device_template', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'name' => array('constraint' => 250, 'type' => 'varchar'),
                'categoryID' => array('constraint' => 11, 'type' => 'int'),
                'hidden' => array('constraint' => 11, 'type' => 'int', 'default' => '0'),
                'meta_update_user' => array('constraint' => 11, 'type' => 'int'),
                'rack_unit' => array('constraint' => 11, 'type' => 'int')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for device template
            \DBUtil::create_index('device_template', 'categoryID');
            \DBUtil::create_index('device_template', 'meta_update_user');
        }
        /*         * *********************************************************************************************
          device template field
         * ********************************************************************************************* */
        $device_temp_field = \DBUtil::checkIfExist('device_temp_field');
        if (!$device_temp_field) {
            \DBUtil::create_table('device_temp_field', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'templateID' => array('constraint' => 11, 'type' => 'int'),
                'tab' => array('constraint' => 2, 'type' => 'int'),
                'name' => array('constraint' => 250, 'type' => 'varchar'),
                'type' => array('constraint' => 250, 'type' => 'varchar'),
                'static' => array('constraint' => 1, 'type' => 'int'),
                'extra' => array('constraint' => 250, 'type' => 'varchar', 'null' => true),
                'value' => array('constraint' => 250, 'type' => 'varchar', 'null' => true),
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for device template field
            \DBUtil::create_index('device_temp_field', 'templateID');
        }
        /*         * *********************************************************************************************
          device template KVM
         * ********************************************************************************************* */
        $device_temp_kvm = \DBUtil::checkIfExist('device_temp_kvm');
        if (!$device_temp_kvm) {
            \DBUtil::create_table('device_temp_kvm', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'fieldsetID' => array('constraint' => 11, 'type' => 'int'),
                'templateID' => array('constraint' => 11, 'type' => 'int'),
                'input' => array('constraint' => 11, 'type' => 'int'),
                'output' => array('constraint' => 11, 'type' => 'int'),
                'type' => array('constraint' => 11, 'type' => 'int')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for device template kvm
            \DBUtil::create_index('device_temp_kvm', 'fieldsetID');
            \DBUtil::create_index('device_temp_kvm', 'templateID');
        }

        /*         * *********************************************************************************************
          device template KVM socket
         * ********************************************************************************************* */
        $device_temp_kvm_socket = \DBUtil::checkIfExist('device_temp_kvm_socket');
        if (!$device_temp_kvm_socket) {
            \DBUtil::create_table('device_temp_kvm_socket', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'kvmID' => array('constraint' => 11, 'type' => 'int'),
                'conn_type' => array('constraint' => 11, 'type' => 'int'),
                'type' => array('constraint' => 11, 'type' => 'int')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for device kvm socket
            \DBUtil::create_index('device_temp_kvm_socket', 'kvmID');
        }

        /*         * *********************************************************************************************
          device template network
         * ********************************************************************************************* */
        $device_temp_network = \DBUtil::checkIfExist('device_temp_network');
        if (!$device_temp_network) {
            \DBUtil::create_table('device_temp_network', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'fieldID' => array('constraint' => 11, 'type' => 'int'),
                'templateID' => array('constraint' => 11, 'type' => 'int'),
                'nics' => array('constraint' => 11, 'type' => 'int'),
                'vports' => array('constraint' => 11, 'type' => 'int'),
                'ports' => array('constraint' => 11, 'type' => 'int'),
                'uplinks' => array('constraint' => 11, 'type' => 'int'),
                'config_data' => array('type' => 'text'),
                'type' => array('constraint' => 11, 'type' => 'int')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for device network
            \DBUtil::create_index('device_temp_network', 'fieldID');
            \DBUtil::create_index('device_temp_network', 'templateID');
        }

        /*         * *********************************************************************************************
          device template Power
         * ********************************************************************************************* */
        $device_temp_power = \DBUtil::checkIfExist('device_temp_power');
        if (!$device_temp_power) {
            \DBUtil::create_table('device_temp_power', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'fieldsetID' => array('constraint' => 11, 'type' => 'int'),
                'templateID' => array('constraint' => 11, 'type' => 'int'),
                'input' => array('constraint' => 11, 'type' => 'int'),
                'output' => array('constraint' => 11, 'type' => 'int'),
                'current' => array('constraint' => 11, 'type' => 'int'),
                'ru' => array('constraint' => 11, 'type' => 'int'),
                'pos' => array('constraint' => 11, 'type' => 'int'),
                'type' => array('constraint' => 11, 'type' => 'int')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for device template power
            \DBUtil::create_index('device_temp_power', 'fieldsetID');
            \DBUtil::create_index('device_temp_power', 'templateID');
        }

        /*         * *********************************************************************************************
          device template Power socket
         * ********************************************************************************************* */
        $device_temp_power_socket = \DBUtil::checkIfExist('device_temp_power_socket');
        if (!$device_temp_power_socket) {
            \DBUtil::create_table('device_temp_power_socket', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'powerID' => array('constraint' => 11, 'type' => 'int'),
                'conn_type' => array('constraint' => 11, 'type' => 'int'),
                'type' => array('constraint' => 11, 'type' => 'int')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for device kvm socket
            \DBUtil::create_index('device_temp_power_socket', 'powerID');
        }


        /*         * *********************************************************************************************
          floor
         * ********************************************************************************************* */
        $floor = \DBUtil::checkIfExist('floor');
        if (!$floor) {
            \DBUtil::create_table('floor', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'name' => array('constraint' => 250, 'type' => 'varchar'),
                'building' => array('constraint' => 11, 'type' => 'int'),
                'has_rooms' => array('constraint' => 11, 'type' => 'int', 'default' => '0', 'null' => true),
                'notes' => array('type' => 'text', 'null' => true),
                'meta_default_data' => array('constraint' => 11, 'type' => 'int', 'default' => '0', 'null' => true),
                'meta_update_time' => array('constraint' => 11, 'type' => 'int', 'default' => '0'),
                'meta_update_user' => array('constraint' => 11, 'type' => 'int', 'default' => '0')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for floor
            \DBUtil::create_index('floor', 'building');


            // insert default building
            list($floor_id, $rows_affected) = \DB::insert('floor')->columns(
                            array(
                                'id',
                                'name',
                                'building',
                                'has_rooms',
                                'notes',
                                'meta_default_data',
                                'meta_update_time',
                                'meta_update_user'
                    ))->values(
                            array('1', 'Floor 1', $building_id[0], '', '', '', time(), $user['id'])
                    )->execute();
        }

        /*         * *********************************************************************************************
          hardware raid
         * ********************************************************************************************* */
        $hardware_raid = \DBUtil::checkIfExist('hardware_raid');
        if (!$hardware_raid) {
            \DBUtil::create_table('hardware_raid', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'fieldsetID' => array('constraint' => 11, 'type' => 'int', 'null' => true),
                'raid_type' => array('constraint' => 11, 'type' => 'int', 'null' => true),
                'size' => array('constraint' => 250, 'type' => 'varchar', 'null' => true),
                'total' => array('constraint' => 11, 'type' => 'int', 'null' => true),
                'meta_update_time' => array('constraint' => 11, 'type' => 'int', 'default' => '0'),
                'meta_update_user' => array('constraint' => 11, 'type' => 'int', 'default' => '0'),
                'tempfieldID' => array('constraint' => 11, 'type' => 'int', 'null' => true)
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for hardware raid
            \DBUtil::create_index('hardware_raid', 'raid_type');
            //\DBUtil::create_index('hardware_raid', 'fieldsetID');
        }

        /*         * *********************************************************************************************
          hardware raid data
         * ********************************************************************************************* */
        $hardware_raid_data = \DBUtil::checkIfExist('hardware_raid_data');
        if (!$hardware_raid_data) {
            \DBUtil::create_table('hardware_raid_data', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'hardware_raid' => array('constraint' => 11, 'type' => 'int'),
                'model' => array('constraint' => 250, 'type' => 'varchar'),
                'size' => array('constraint' => 250, 'type' => 'varchar', 'null' => true),
                'vport' => array('constraint' => 250, 'type' => 'varchar'),
                'meta_update_time' => array('constraint' => 11, 'type' => 'int', 'default' => '0'),
                'meta_update_user' => array('constraint' => 11, 'type' => 'int', 'default' => '0'),
                'serial_number' => array('constraint' => 250, 'type' => 'varchar')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for hardware raid
            \DBUtil::create_index('hardware_raid_data', 'hardware_raid');
        }
        /*         * *********************************************************************************************
          hardware ram
         * ********************************************************************************************* */
        $hardware_ram = \DBUtil::checkIfExist('hardware_ram');
        if (!$hardware_ram) {
            \DBUtil::create_table('hardware_ram', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'fieldsetID' => array('constraint' => 11, 'type' => 'int', 'null' => true),
                'ram_type' => array('constraint' => 11, 'type' => 'int', 'null' => true),
                'size' => array('constraint' => 250, 'type' => 'varchar', 'null' => true),
                'total' => array('constraint' => 11, 'type' => 'int', 'null' => true),
                'meta_update_time' => array('constraint' => 11, 'type' => 'int', 'default' => '0'),
                'meta_update_user' => array('constraint' => 11, 'type' => 'int', 'default' => '0'),
                'tempfieldID' => array('constraint' => 11, 'type' => 'int', 'null' => true)
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for hardware raid
            \DBUtil::create_index('hardware_ram', 'ram_type');
            //\DBUtil::create_index('hardware_ram', 'fieldsetID');
        }
        /*         * *********************************************************************************************
          hardware ram data
         * ********************************************************************************************* */
        $hardware_ram_data = \DBUtil::checkIfExist('hardware_ram_data');
        if (!$hardware_ram_data) {
            \DBUtil::create_table('hardware_ram_data', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'hardware_ram' => array('constraint' => 11, 'type' => 'int'),
                'model' => array('constraint' => 250, 'type' => 'varchar'),
                'size' => array('constraint' => 250, 'type' => 'varchar'),
                'port' => array('constraint' => 250, 'type' => 'varchar'),
                'meta_update_time' => array('constraint' => 11, 'type' => 'int', 'default' => '0'),
                'meta_update_user' => array('constraint' => 11, 'type' => 'int', 'default' => '0'),
                'serial_number' => array('constraint' => 250, 'type' => 'varchar')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for hardware ram
            \DBUtil::create_index('hardware_ram_data', 'hardware_ram');
        }
        /*         * *********************************************************************************************
          images
         * ********************************************************************************************* */
        $images = \DBUtil::checkIfExist('images');
        if (!$images) {
            \DBUtil::create_table('images', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'name' => array('constraint' => 250, 'type' => 'varchar'),
                'elementID' => array('constraint' => 11, 'type' => 'int'),
                'type' => array('constraint' => 1, 'type' => 'varchar'),
                'width' => array('constraint' => 11, 'type' => 'int'),
                'height' => array('constraint' => 11, 'type' => 'int')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for images
            \DBUtil::create_index('images', 'elementID');
        }

        /*         * *********************************************************************************************
          network ip ports
         * ********************************************************************************************* */
        $network_ip_ports = \DBUtil::checkIfExist('network_ip_ports');
        if (!$network_ip_ports) {
            \DBUtil::create_table('network_ip_ports', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'networkID' => array('constraint' => 11, 'type' => 'int'),
                'nic_name' => array('constraint' => 250, 'type' => 'varchar'),
                'ipv4' => array('constraint' => 15, 'type' => 'varchar'),
                'ipv6' => array('constraint' => 42, 'type' => 'varchar'),
                'conn_type' => array('constraint' => 11, 'type' => 'int'),
                'conn_speed' => array('constraint' => 11, 'type' => 'int'),
                'type' => array('constraint' => 11, 'type' => 'int')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for network ip ports
            \DBUtil::create_index('network_ip_ports', 'networkID');
            \DBUtil::create_index('network_ip_ports', 'conn_type');
            \DBUtil::create_index('network_ip_ports', 'conn_speed');
        }
        /*         * *********************************************************************************************
          network mac ports
         * ********************************************************************************************* */
        $network_mac_ports = \DBUtil::checkIfExist('network_mac_ports');
        if (!$network_mac_ports) {
            \DBUtil::create_table('network_mac_ports', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'networkID' => array('constraint' => 11, 'type' => 'int'),
                'mac_address' => array('constraint' => 18, 'type' => 'varchar'),
                'conn_device' => array('constraint' => 11, 'type' => 'int'),
                'vlan' => array('constraint' => 11, 'type' => 'int', 'null' => true),
                'type' => array('constraint' => 2, 'type' => 'int')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for network mac ports
            \DBUtil::create_index('network_mac_ports', 'networkID');
            \DBUtil::create_index('network_mac_ports', 'conn_device');
            \DBUtil::create_index('network_mac_ports', 'vlan');
        }
        /*         * *********************************************************************************************
          network vlans
         * ********************************************************************************************* */
        $network_vlans = \DBUtil::checkIfExist('network_vlans');
        if (!$network_vlans) {
            \DBUtil::create_table('network_vlans', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'networkID' => array('constraint' => 11, 'type' => 'int'),
                'name' => array('constraint' => 250, 'type' => 'varchar')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );
            //create indexes for network mac ports
            \DBUtil::create_index('network_vlans', 'networkID');
        }

        /*         * *********************************************************************************************
          notes
         * ********************************************************************************************* */
        $notes = \DBUtil::checkIfExist('notes');
        if (!$notes) {
            \DBUtil::create_table('notes', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'deviceID' => array('constraint' => 11, 'type' => 'int'),
                'txt' => array('type' => 'text'),
                'meta_update_time' => array('constraint' => 11, 'type' => 'int', 'default' => '0'),
                'meta_update_user' => array('constraint' => 11, 'type' => 'int', 'default' => '0')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for notes
            \DBUtil::create_index('notes', 'deviceID');
        }

        /*         * *********************************************************************************************
          RAID type
         * ********************************************************************************************* */
        $raid_type = \DBUtil::checkIfExist('raid_type');
        if (!$raid_type) {
            \DBUtil::create_table('raid_type', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'name' => array('constraint' => 250, 'type' => 'varchar')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            \DBUtil::truncate_table('raid_type');
            // insert default raid type
            list($insert_id, $rows_affected) = \DB::insert('raid_type')->columns(array('id', 'name'))->values(
                            array('1', 'none'), array('2', 'RAID 0'), array('3', 'RAID 1'), array('4', 'RAID 2'), array('5', 'RAID 3'), array('6', 'RAID 4'), array('7', 'RAID 5'), array('8', 'RAID 6'), array('9', 'RAID 7'), array('10', 'RAID 10'), array('11', 'RAID S (parity RAID)'), array('12', 'RAID-DP'), array('13', 'Matrix RAID'), array('14', 'RAID-K'), array('15', 'RAID-Z'), array('16', 'RAID 1.5'), array('17', 'RAIDn'), array('18', 'Linux MD RAID 10'), array('19', 'IBM ServeRAID 1E'), array('20', 'ineo Complex RAID'), array('21', 'Drobo BeyondRAID'), array('22', 'nunRAID')
                    )->execute();
        }
        /*         * *********************************************************************************************
          RAM type
         * ********************************************************************************************* */
        $ram_type = \DBUtil::checkIfExist('ram_type');
        if (!$ram_type) {
            \DBUtil::create_table('ram_type', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'name' => array('constraint' => 250, 'type' => 'varchar')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            \DBUtil::truncate_table('ram_type');
            // insert default ram type
            list($insert_id, $rows_affected) = \DB::insert('ram_type')->columns(array('id', 'name'))->values(
                            array('1', 'none'), array('2', 'SDRAM'), array('3', 'RDRAM'), array('4', 'DDR1'), array('5', 'DDR2'), array('6', 'DDR3'), array('7', 'DDR4')
                    )->execute();
        }
        /*         * *********************************************************************************************
          room
         * ********************************************************************************************* */
        $room = \DBUtil::checkIfExist('room');
        if (!$room) {
            \DBUtil::create_table('room', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'name' => array('constraint' => 250, 'type' => 'varchar'),
                'floor' => array('constraint' => 11, 'type' => 'int'),
                'has_racks' => array('constraint' => 11, 'type' => 'int', 'default' => '0', 'null' => true),
                'notes' => array('type' => 'text', 'null' => true),
                'meta_default_data' => array('constraint' => 11, 'type' => 'int', 'default' => '0', 'null' => true),
                'meta_update_time' => array('constraint' => 11, 'type' => 'int', 'default' => '0'),
                'meta_update_user' => array('constraint' => 11, 'type' => 'int', 'default' => '0')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );
            //create indexes for network mac ports
            \DBUtil::create_index('room', 'floor');

            //insert default room
            list($room_id, $rows_affected) = \DB::insert('room')->columns(
                            array(
                                'id',
                                'name',
                                'floor',
                                'has_racks',
                                'notes',
                                'meta_default_data',
                                'meta_update_time',
                                'meta_update_user'
                    ))->values(
                            array('1', 'Room A', $floor_id[0], '', '', '0', time(), $user['id'])
                    )->execute();
        }

        /*         * *********************************************************************************************
          rack
         * ********************************************************************************************* */
        $rack = \DBUtil::checkIfExist('rack');
        if (!$rack) {
            \DBUtil::create_table('rack', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'name' => array('constraint' => 250, 'type' => 'varchar'),
                'room' => array('constraint' => 11, 'type' => 'int'),
                'room_pos' => array('constraint' => 11, 'type' => 'int', 'default' => '0'),
                'hidden_rack' => array('constraint' => 11, 'type' => 'int', 'default' => '0'),
                'size' => array('constraint' => 11, 'type' => 'int', 'default' => '42'),
                'numbering_direction' => array('constraint' => 11, 'type' => 'int', 'default' => '0'),
                'notes' => array('type' => 'text', 'null' => true),
                'meta_default_data' => array('constraint' => 11, 'type' => 'int', 'default' => '0'),
                'meta_update_time' => array('constraint' => 11, 'type' => 'int', 'default' => '0'),
                'meta_update_user' => array('constraint' => 11, 'type' => 'int', 'default' => '0')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );
            //create indexes for network mac ports
            \DBUtil::create_index('rack', 'room');

            // insert default rack
            list($rack_id, $rows_affected) = \DB::insert('rack')->columns(
                            array(
                                'id',
                                'name',
                                'room',
                                'room_pos',
                                'hidden_rack',
                                'size',
                                'numbering_direction',
                                'notes',
                                'meta_default_data',
                                'meta_update_time',
                                'meta_update_user'
                    ))->values(
                            array('1', 'Default Rack', $room_id[0], 0, 0, 42, 0, '', '0', time(), $user['id'])
                    )->execute();
        }
        /*         * *********************************************************************************************
          template network ip ports
         * ********************************************************************************************* */
        $temp_network_ip_ports = \DBUtil::checkIfExist('temp_network_ip_ports');
        if (!$temp_network_ip_ports) {
            \DBUtil::create_table('temp_network_ip_ports', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'tempnetID' => array('constraint' => 11, 'type' => 'int'),
                'nic_name' => array('constraint' => 250, 'type' => 'varchar', 'null' => true),
                'ipv4' => array('constraint' => 15, 'type' => 'varchar', 'null' => true),
                'ipv6' => array('constraint' => 42, 'type' => 'varchar', 'null' => true),
                'conn_type' => array('constraint' => 11, 'type' => 'int', 'null' => true),
                'conn_speed' => array('constraint' => 11, 'type' => 'int', 'null' => true),
                'type' => array('constraint' => 11, 'type' => 'int')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for network ip ports
            \DBUtil::create_index('temp_network_ip_ports', 'tempnetID');
            \DBUtil::create_index('temp_network_ip_ports', 'conn_type');
            \DBUtil::create_index('temp_network_ip_ports', 'conn_speed');
        }
        /*         * *********************************************************************************************
          template network mac ports
         * ********************************************************************************************* */
        $temp_network_mac_ports = \DBUtil::checkIfExist('temp_network_mac_ports');
        if (!$temp_network_mac_ports) {
            \DBUtil::create_table('temp_network_mac_ports', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'tempnetID' => array('constraint' => 11, 'type' => 'int'),
                'mac_address' => array('constraint' => 18, 'type' => 'varchar'),
                'conn_device' => array('constraint' => 11, 'type' => 'int'),
                'vlan' => array('constraint' => 11, 'type' => 'int', 'null' => true),
                'type' => array('constraint' => 2, 'type' => 'int')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for network mac ports
            \DBUtil::create_index('temp_network_mac_ports', 'tempnetID');
            \DBUtil::create_index('temp_network_mac_ports', 'conn_device');
            \DBUtil::create_index('temp_network_mac_ports', 'vlan');
        }
        /*         * *********************************************************************************************
          template network vlans
         * ********************************************************************************************* */
        $temp_network_vlans = \DBUtil::checkIfExist('temp_network_vlans');
        if (!$temp_network_vlans) {
            \DBUtil::create_table('temp_network_vlans', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'tempnetID' => array('constraint' => 11, 'type' => 'int'),
                'name' => array('constraint' => 250, 'type' => 'varchar')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );
            //create indexes for network mac ports
            \DBUtil::create_index('temp_network_vlans', 'tempnetID');
        }

        /*         * *********************************************************************************************
          template images
         * ********************************************************************************************* */
        $temp_images = \DBUtil::checkIfExist('temp_images');
        if (!$temp_images) {
            \DBUtil::create_table('temp_images', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'name' => array('constraint' => 250, 'type' => 'varchar'),
                'elementID' => array('constraint' => 11, 'type' => 'int'),
                'type' => array('constraint' => 1, 'type' => 'varchar'),
                'width' => array('constraint' => 11, 'type' => 'int'),
                'height' => array('constraint' => 11, 'type' => 'int')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for images
            \DBUtil::create_index('temp_images', 'elementID');
        }
        /*         * *********************************************************************************************
          wiki category
         * ********************************************************************************************* */
        $wiki_categories = \DBUtil::checkIfExist('wiki_categories');
        if (!$wiki_categories) {
            \DBUtil::create_table('wiki_categories', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'name' => array('constraint' => 250, 'type' => 'varchar')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            \DBUtil::truncate_table('wiki_categories');
            // insert default connector type
            list($insert_id, $rows_affected) = \DB::insert('wiki_categories')->columns(array('id', 'name'))->values(
                            array('1', 'General'), array('2', 'Installation'), array('3', 'Devices'), array('4', 'Maintenance')
                    )->execute();
        }

        /*         * *********************************************************************************************
          wiki
         * ********************************************************************************************* */
        $wiki = \DBUtil::checkIfExist('wiki');
        if (!$wiki) {
            \DBUtil::create_table('wiki', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'catID' => array('constraint' => 11, 'type' => 'int'),
                'title' => array('constraint' => 250, 'type' => 'varchar'),
                'content' => array('type' => 'text', 'null' => true),
                'meta_update_time' => array('constraint' => 11, 'type' => 'int', 'default' => '0'),
                'meta_update_user' => array('constraint' => 11, 'type' => 'int', 'default' => '0')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for wiki
            \DBUtil::create_index('wiki', 'catID');
        }

        /*         * *********************************************************************************************
          vps
         * ********************************************************************************************* */
        $vps = \DBUtil::checkIfExist('vps');
        if (!$vps) {
            \DBUtil::create_table('vps', array(
                'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
                'masterID' => array('constraint' => 11, 'type' => 'int'),
                'hostname' => array('constraint' => 250, 'type' => 'varchar'),
                'cpu' => array('constraint' => 11, 'type' => 'int'),
                'ram' => array('constraint' => 11, 'type' => 'int'),
                'storage' => array('constraint' => 11, 'type' => 'int')
                    ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
            );

            //create indexes for wiki
            \DBUtil::create_index('vps', 'masterID');
        }

        /*         * *********************************************************************************************
          vps
         * ********************************************************************************************* */
        /*
          $vps_ip_ports = \DBUtil::checkIfExist('vps_ip_ports');
          if (!$vps_ip_ports) {
          \DBUtil::create_table('vps_ip_ports', array(
          'id' => array('constraint' => 11, 'type' => 'int', 'auto_increment' => true),
          'vpsID' => array('constraint' => 11, 'type' => 'int'),
          'data' => array('constraint' => 250, 'type' => 'varchar')
          ), array('id'), true, 'InnoDB', 'utf8_unicode_ci'
          );

          //create indexes for wiki
          \DBUtil::create_index('vps_ip_ports', 'vpsID');
          }
         */

        /*         * *********************************************************************************************
          FOREIGN KEYS
         * ********************************************************************************************* */

        if (!$cables) {
            $query = \DB::query('ALTER TABLE `cables`
		ADD CONSTRAINT `cables_ibfk_1` FOREIGN KEY (`dev1`) REFERENCES `device` (`id`) 
		ON DELETE CASCADE ON UPDATE CASCADE')->execute();
            $query = \DB::query('ALTER TABLE `cables`
  		ADD CONSTRAINT `cables_ibfk_2` FOREIGN KEY (`dev2`) REFERENCES `device` (`id`) 
		ON DELETE CASCADE ON UPDATE CASCADE')->execute();
        }


        if (!$device) {
            $query = \DB::query('ALTER TABLE `device`
		ADD CONSTRAINT `device_ibfk_2` FOREIGN KEY (`rack`) REFERENCES `rack` (`id`)
			ON DELETE CASCADE ON UPDATE CASCADE')->execute();
        }

        if (!$device_fieldset) {
            $query = \DB::query('ALTER TABLE `device_fieldset` ADD CONSTRAINT `device_fieldset_ibfk_1`
		FOREIGN KEY (`deviceID`) REFERENCES `device` (`id`) 
		ON DELETE CASCADE ON UPDATE CASCADE')->execute();
        }

        if (!$device_kvm) {
            $query = \DB::query('ALTER TABLE `device_kvm`
  			ADD CONSTRAINT `device_kvm_ibfk_1` FOREIGN KEY (`fieldsetID`) 
			REFERENCES `device_fieldset` (`id`) ON DELETE CASCADE ON UPDATE CASCADE')->execute();
        }

        if (!$device_kvm_socket) {
            $query = \DB::query('ALTER TABLE `device_kvm_socket`
  			ADD CONSTRAINT `device_kvm_socket_ibfk_1` FOREIGN KEY (`kvmID`) 
			REFERENCES `device_kvm` (`id`) ON DELETE CASCADE ON UPDATE CASCADE')->execute();
        }

        if (!$device_network) {
            $query = \DB::query('ALTER TABLE `device_network` ADD CONSTRAINT `device_network_ibfk_2`
		FOREIGN KEY (`fieldsetID`) REFERENCES `device_fieldset` (`id`) 
		ON DELETE  CASCADE ON UPDATE CASCADE;')->execute();
        }

        if (!$device_power) {
            $query = \DB::query('ALTER TABLE `device_power`
  			ADD CONSTRAINT `device_power_ibfk_1` FOREIGN KEY (`fieldsetID`) 
			REFERENCES `device_fieldset` (`id`) ON DELETE CASCADE ON UPDATE CASCADE')->execute();
        }

        if (!$device_power_socket) {
            $query = \DB::query('ALTER TABLE `device_power_socket`
  			ADD CONSTRAINT `device_power_socket_ibfk_1` FOREIGN KEY (`powerID`) 
			REFERENCES `device_power` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;')->execute();
        }


        if (!$device_template) {
            $query = \DB::query('ALTER TABLE `device_template` ADD CONSTRAINT `device_template_ibfk_1`
		FOREIGN KEY (`categoryID`) REFERENCES `device_category` (`id`) 
		ON DELETE CASCADE ON UPDATE CASCADE;')->execute();
        }

        if (!$device_temp_field) {
            $query = \DB::query('ALTER TABLE `device_temp_field` ADD CONSTRAINT `device_temp_field_ibfk_2`
		FOREIGN KEY (`templateID`) REFERENCES `device_template` (`id`) 
		ON DELETE CASCADE ON UPDATE CASCADE;')->execute();
        }

        if (!$device_temp_kvm) {
            $query = \DB::query('ALTER TABLE `device_temp_kvm`
  		ADD CONSTRAINT `device_temp_kvm_ibfk_1` FOREIGN KEY (`fieldsetID`) 
		REFERENCES `device_temp_field` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;')->execute();
        }

        if (!$device_temp_kvm_socket) {
            $query = \DB::query('ALTER TABLE `device_temp_kvm_socket`
  		ADD CONSTRAINT `device_temp_kvm_socket_ibfk_1` FOREIGN KEY (`kvmID`) 
		REFERENCES `device_temp_kvm` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;')->execute();
        }

        if (!$device_temp_network) {
            $query = \DB::query('ALTER TABLE `device_temp_network`
  		ADD CONSTRAINT `device_temp_network_ibfk_1` FOREIGN KEY (`fieldID`) 
		REFERENCES `device_temp_field` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;')->execute();
        }

        if (!$device_temp_power) {
            $query = \DB::query('ALTER TABLE `device_temp_power`
  		ADD CONSTRAINT `device_temp_power_ibfk_1` FOREIGN KEY (`fieldsetID`) 
		REFERENCES `device_temp_field` (`id`) ON DELETE CASCADE ON UPDATE CASCADE')->execute();
        }

        if (!$device_temp_power_socket) {
            $query = \DB::query('ALTER TABLE `device_temp_power_socket`
  		ADD CONSTRAINT `device_temp_power_socket_ibfk_1` FOREIGN KEY (`powerID`) 
		REFERENCES `device_temp_power` (`id`) ON DELETE CASCADE ON UPDATE CASCADE')->execute();
        }



        if (!$floor) {
            $query = \DB::query('ALTER TABLE `floor` ADD CONSTRAINT `floor_ibfk_4`
		FOREIGN KEY (`building`) REFERENCES `building` (`id`) 
		ON DELETE CASCADE ON UPDATE CASCADE;')->execute();
        }

        if (!$hardware_raid) {
            $query = \DB::query('ALTER TABLE `hardware_raid`  ADD CONSTRAINT `hardware_raid_ibfk_2`
		FOREIGN KEY (`raid_type`) REFERENCES `raid_type` (`id`);')->execute();
        }

        if (!$hardware_raid_data) {
            $query = \DB::query('ALTER TABLE `hardware_raid_data` ADD CONSTRAINT `hardware_raid_data_ibfk_2`
		FOREIGN KEY (`hardware_raid`) REFERENCES `hardware_raid` (`id`) 
		ON DELETE CASCADE ON UPDATE CASCADE;')->execute();
        }

        if (!$images) {
            $query = \DB::query('ALTER TABLE `images` ADD CONSTRAINT `images_ibfk_2`
		FOREIGN KEY (`elementID`) REFERENCES `device_fieldset` (`id`) 
		ON DELETE CASCADE ON UPDATE CASCADE;')->execute();
        }

        if (!$network_ip_ports) {
            $query = \DB::query('ALTER TABLE `network_ip_ports` ADD CONSTRAINT `network_ip_ports_ibfk_4`
		FOREIGN KEY (`networkID`) REFERENCES `device_network` (`id`) 
		ON DELETE CASCADE ON UPDATE CASCADE;')->execute();
        }

        if (!$network_mac_ports) {
            $query = \DB::query('ALTER TABLE `network_mac_ports` ADD CONSTRAINT `network_mac_ports_ibfk_1`
		FOREIGN KEY (`networkID`) REFERENCES `device_network` (`id`) 
		ON DELETE CASCADE ON UPDATE CASCADE;')->execute();
        }

        if (!$network_vlans) {
            $query = \DB::query('ALTER TABLE `network_vlans` ADD CONSTRAINT `network_vlans_ibfk_3`
		FOREIGN KEY (`networkID`) REFERENCES `device_network` (`id`) 
		ON DELETE CASCADE ON UPDATE CASCADE;')->execute();
        }



        if (!$notes) {
            $query = \DB::query('ALTER TABLE `notes` ADD CONSTRAINT `notes_ibfk_1`
		FOREIGN KEY (`deviceID`) REFERENCES `device` (`id`) 
		ON DELETE CASCADE ON UPDATE CASCADE;')->execute();
        }

        if (!$rack) {
            $query = \DB::query('ALTER TABLE `rack` ADD CONSTRAINT `rack_ibfk_2`
		FOREIGN KEY (`room`) REFERENCES `room` (`id`) 
		ON DELETE CASCADE ON UPDATE CASCADE;')->execute();
        }

        if (!$room) {
            $query = \DB::query('ALTER TABLE `room` ADD CONSTRAINT `room_ibfk_2`
		FOREIGN KEY (`floor`) REFERENCES `floor` (`id`) 
		ON DELETE CASCADE ON UPDATE CASCADE;')->execute();
        }
        if (!$temp_network_ip_ports) {
            $query = \DB::query('ALTER TABLE `temp_network_ip_ports` ADD CONSTRAINT `temp_network_ip_ports_ibfk_4`
		FOREIGN KEY (`tempnetID`) REFERENCES `device_temp_network` (`id`)
		ON DELETE CASCADE ON UPDATE CASCADE;')->execute();
        }

        if (!$temp_network_mac_ports) {
            $query = \DB::query('ALTER TABLE `temp_network_mac_ports` ADD CONSTRAINT `temp_network_mac_ports_ibfk_1`
		FOREIGN KEY (`tempnetID`) REFERENCES `device_temp_network` (`id`)
		ON DELETE CASCADE ON UPDATE CASCADE;')->execute();
        }

        if (!$temp_network_vlans) {
            $query = \DB::query('ALTER TABLE `temp_network_vlans` ADD CONSTRAINT `temp_network_vlans_ibfk_3`
		FOREIGN KEY (`tempnetID`) REFERENCES `device_temp_network` (`id`)
		ON DELETE CASCADE ON UPDATE CASCADE;')->execute();
        }


        //wiki
        if (!$wiki) {
            $query = \DB::query('ALTER TABLE `wiki`
				ADD CONSTRAINT `wiki_ibfk_1` FOREIGN KEY (`catID`) REFERENCES `wiki_categories` (`id`)
				ON DELETE CASCADE ON UPDATE CASCADE')->execute();
        }

        //virtual private server
        if (!$vps) {
            $query = \DB::query('ALTER TABLE `vps`
					ADD CONSTRAINT `vps_ibfk_1` FOREIGN KEY (`masterID`) REFERENCES `device` (`id`)
					ON DELETE CASCADE ON UPDATE CASCADE')->execute();
        }
        /*
          //ips of vps
          if (!$vps_ip_ports) {
          $query = \DB::query('ALTER TABLE `vps_ip_ports`
          ADD CONSTRAINT `vps_ip_ibfk_1` FOREIGN KEY (`vpsID`) REFERENCES `vps` (`id`)
          ON DELETE CASCADE ON UPDATE CASCADE')->execute();
          }

         */
    }

    public function down() {
        
    }

}