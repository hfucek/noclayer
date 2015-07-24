<?php
namespace Basic;
class Controller_Testing_User extends Controller_Login{
	public function before()
	{

		parent::before();
	}


	public function action_index(){
		echo 'ok'.$this->user;

		
		
		//$this->newuserdata($this->user);
		
			$n=new demouser($this->user);
		
			//Sentry::login($val->validated('n'), $val->validated('p'), true);
			
		
	}
}








class demouser{

	private function insertStaticField($name,$type,$tab,$device,$static){



		$field=New Model_Device_Fieldset();
		$field->name=$name;
		$field->type=$type[0];
		$field->static=$static;
		$field->deviceID=$device->id;
		$field->tab=$tab;

		if($type[1]!=null)
			$field->extra=$type[1];
		if($type[2]!=null)
			$field->value=$type[2];


		$field->save();


		if($type=='network'){

			$prop=Array(
					'fieldsetID'=>$field->id,
					'deviceID'=>$field->device->id,
					'nics'=>0,
					'vports'=>0,
					'ports'=>0,
					'uplinks'=>0,
					'config_data'=>'',
					'type'=>$this->net_type
			);

			$network=new Model_Device_Network($prop);
			//$network->save();


		}

		return true;
	}
	private function add_device_default_fields($device){

		//template or device
		if(isset($device->categoryID))
			$cat=$device->categoryID;
		else
			$cat=$device->cat;


		//adding default field depends of device category

		//manufacturer
		$this->insertStaticField('Manufacturer',Array('input',null,null),1,$device,1);
			
		//model
		$this->insertStaticField('Model',Array('input',null,null),1,$device,1);
			
		switch($cat){
			case 1: //server
				//cpu type
				$this->insertStaticField('Processor Type',Array('input',null,null),1,$device,1);
				//cpu core speed
				$this->insertStaticField('Core speed (GHz)',Array('input',null,'2.66'),1,$device,1);
				//Processor Sockets
				$this->insertStaticField('Processor Sockets',Array('eselect','1,2,3,4,5,6,7,8',1),1,$device,1);
				//Core per sockets
				$this->insertStaticField('Cores per Socket',Array('eselect','1,2,3,4,5,6,7,8,10,12,14,16,18,20,30,40,80,160',2),1,$device,1);
				//Core per sockets
				$this->insertStaticField('Hyperthreading',Array('checkbox',null,1),1,$device,1);

				$this->insertStaticField('Storage',Array('hdd',null,null),1,$device,1);

				$this->insertStaticField('Memory',Array('ram',null,null),1,$device,1);
				break;
					
					
		}


		switch($cat){
			case 4: //PDU
			case 7: //APC ATS
			case 10: // UPS
				$this->insertStaticField('Power distribution','power_out',5,$device,1);
				break;

			case 1: //server
			case 2: // switch
			case 3: // router
				
			case 6: //KVM switch
				
			case 8: // FC switch
			case 9: // UPS
				$this->insertStaticField('Power supply','power_in',5,$device,1);
				break;

		}

		switch($cat){

			case 1: //server
			case 2: // switch
			case 3: // router
			case 4: //PDU
			case 6: //KVM switch
			case 7: //APC ATS
			case 8: // FC switch
			case 10: // UPS
				//ip address
				$this->insertStaticField('Admin url',Array('input',null,null),2,$device,1);
					
				// network field
				$this->insertStaticField('Ports',Array('network',null,null),2,$device,1);
					
					
				break;

			default:
				//ip address
				$this->insertStaticField('Admin url',Array('input',null,null),2,$device,1);

				break;

		}
			
			
		if($cat==6)
			$this->insertStaticField('KVM settings',Array('kvm_out',null,null),2,$device,1);
			
			
		switch($cat){
			case 1: //server
			case 2: // switch
			case 3: // router
			case 4: //PDU
			case 7: //APC ATS
			case 8: // FC switch
			case 9: // UPS
			case 10: // UPS
					
				$this->insertStaticField('KVM settings',Array('kvm_in',null,null),2,$device,1);
				break;

		}
			
			
			
		switch($cat){
			case 4: //PDU
			case 7: //APC ATS
			case 10: // UPS
				$this->insertStaticField('Power distribution',Array('power_out',null,null),5,$device,1);
				break;

			case 1: //server
			case 2: // switch
			case 3: // router

			case 6: //KVM switch

			case 8: // FC switch
			case 9: // UPS
				$this->insertStaticField('Power supply',Array('power_in',null,null),5,$device,1);
				break;

		}
			
			
			
			
		//images
		$this->insertStaticField('Images',Array('img',null,null),3,$device,0);
			
			
		//export to pdf
		$this->insertStaticField('Export to pdf',Array('print',null,null),3,$device,0);

		return true;
	}

	function demouser($user_id){

		$this->newuserdata($user_id);
		
		//$this->action_userset($name, $pass);

	}


	private function add_pdu($rack,$user){

		$props = array(
				'hostname' => 'vertical pdu',
				'type' => 0,
				'cat' => 4,
				'rack' => $rack->id,
				'rack_pos' => 0,
				'rack_units' => 0,
				'parent_device' => 0,
				'meta_default_data' => 1,
				'meta_update_time' => time(),
				'meta_update_user' => $user
		);
		//print_r($props);

		$dev = new Model_Device($props);

		$dev->save();


		$this->add_device_default_fields($dev);




		$power=Model_Device_Power::find()->where('deviceID',$dev->id)->get_one();

		$this->tmpl=false;
		$power->pos=0;
		$power->input=1;
		$power->output=42;
		$power->save();

			
			
		$sockets=array();

		for($i=1;$i<=42;$i++){
				
			$prop=Array(
					'powerID'=> $power->id,
					'conn_type'=>1,
					'type' =>2
			);
				
				

			$socket=new Model_Device_Power_Socket($prop);


			$socket->save();
				
			array_push($sockets, $socket->id);
				
		}
			
			
		return Array('id'=>$dev->id,'sockets'=>$sockets);
	}

	private function add_server($pos,$rack,$user,$sw,$macs,$pdu){

		$pduid=$pdu['id'];

		$sockets=$pdu['sockets'];

		$hostnames=Array("","","","","","","","","","akcp-sp2","c1-activedirectory-1","c1-activedirectory-2","c1-activedirectory-3","c1-dns-1","c1-dns-2","c1-dns-3","c1-dns-4","c1-exchange-1","c1-exchange-2","c1-exchange-3","c1-exchange-4","c1-linux-1","c1-linux-2","c1-linux-3","c1-linux-4","c1-linux-5","c1-mysql-1","c1-mysql-2","c1-mysql-3","c1-mysql-4","c1-web-1","c1-web-2","c1-web-3","c1-web-4","c1-windows-1","c1-windows-2","c1-windows-3","c1-windows-4","c1-windows-5","c1-windows-6","c2-exchange-3","c2-exchange-4","c2-mysql-1","c2-mysql-2","c2-web-1","c2-windows-1","c2_windows-2","c3-linux-1","c3-linux-2","c3-linux-3","c3-linux-4","c3-windows-1","c3-windows-2","c3-windows-3","fujitsu-tx-s2","knuerr-diview","knuerr-rmsII","messpc","sensatronics-e4","sensatronics-em1","sensatronics-senturion");

		$props = array(
				'hostname' => $hostnames[$pos],
				'type' => 0,
				'cat' => 1,
				'rack' => $rack->id,
				'rack_pos' => $pos,
				'rack_units' => 1,
				'parent_device' => 0,
				'meta_default_data' => 0,
				'meta_update_time' => time(),
				'meta_update_user' => $user
		);
		//print_r($props);

		$server = new Model_Device($props);

		$server->save();

		$this->net_type=1;

		$this->add_device_default_fields($server);



		$network= Model_Device_Network::find()->where('deviceID',$server->id)->get_one();


		$network->nics=2;
		$network->save();

		for($i=0;$i<=1;$i++){
			$prop=Array(
					'networkID'=> $network->id,
					'nic_name'=>'',
					'ipv4'=>'192.168.8.'.$i,
					'ipv6'=>'',
					'conn_type'=>1,
					'conn_speed'=>3,
					'type' =>1
			);
				
			$ip=new Model_Network_Ip($prop);

			$ip->save();
		}


		//add cabel




		$props=Array(
				'dev1'=>$sw,
				'port1'=>$macs[$pos-9],
				'dev2'=>$server->id,
				'port2'=>$ip->id,
				'name1'=>$pos-9,
				'name2'=>2,
				'type'=>1,
				'meta_update_time'=>time(),
				'meta_update_user'=>$user
		);
		$cable=new Model_Cable($props);
		$cable->save();

		$power= Model_Device_Power::find()->where('deviceID',$server->id)->get_one();

		$powsockets=$power->socket;

		foreach ($powsockets as $sock){

			$n=$pos-9;

			$props=Array(
					'dev1'=>$pduid,
					'port1'=>$sockets[38-$n],
					'dev2'=>$server->id,
					'port2'=>$sock->id,
					'name1'=>$pos-9,
					'name2'=>1,
					'type'=>2,
					'meta_update_time'=>time(),
					'meta_update_user'=>$user
			);
			$cable=new Model_Cable($props);
			$cable->save();

		}

		/*


		$props=Array(
				'dev1'=>$sw,
				'port1'=>$macs[$pos-9],
				'dev2'=>$server->id,
				'port2'=>$ip->id,
				'name1'=>$pos-9,
				'name2'=>1,
				'type'=>2,
				'meta_update_time'=>time(),
				'meta_update_user'=>$user
		);
		$cable=new Model_Cable($props);
		$cable->save();
		*/




		return $server;

	}


	private function add_switch($rack,$user,$pos,$name){

		$props = array(
		 	'hostname' => $name,
		 	'type' => 0,
		 	'cat' => 2,
		 	'rack' => $rack->id,
		 	'rack_pos' => $pos,
		 	'rack_units' => 1,
		 	'parent_device' => 0,
		 	'meta_default_data' => 0,
		 	'meta_update_time' => time(),
		 	'meta_update_user' => $user
		);
		//print_r($props);
		$this->net_type=2;

		$sw = new Model_Device($props);

		$sw->save();

		$this->add_device_default_fields($sw);


		$network= Model_Device_Network::find()->where('deviceID',$sw->id)->get_one();


		$network->ports=48;
		$network->save();



		$macc=Array();






		for($i=1;$i<=48;$i++){
			$prop=Array(
					'networkID'=>$network->id,
					'mac_address'=>'',
					'conn_device'=>0,
					'vlan'=>0,
					'type'=>1
			);
				
			$macs=new Model_Network_Mac($prop);
			$macs->save();
			array_push($macc, $macs->id);
		}
		return array('id'=>$sw->id,'macs'=>$macc);
	}

	protected function newuserdata($user){

		//add new building
		$props=Array(
				'name'	=> 'Building DEMO',
				'meta_update_time' => time(),
				'meta_update_user' => $user
		);

		$building=new Model_Building($props);

		$building->save();



		//add defualt floor
		$props=Array(
				'name'	=> 'Floor 1',
				'building' => $building->id,
				'meta_update_time' => time(),
				'meta_update_user' => $user
		);

		$floor=new Model_Floor($props);
		$floor->save();


		//add default room
		$props=Array(
				'name'	=> 'Room A',
				'floor' => $floor->id,
				'meta_update_time' => time(),
				'meta_update_user' => $user
		);

		$room=new Model_Room($props);
		$room->save();


		//add default room
		$props=Array(
				'name'	=> 'Default rack',
				'room' => $room->id,
				'room_pos'=>0,
				'hidden_rack'=>0,
				'size'=>48,
				'numbering_direction'=>0,
				'meta_default_data' => 0,
				'meta_update_time' => time(),
				'meta_update_user' => $user
		);

		$rack=new Model_Rack($props);
		$rack->save();





		//$switch=$this->add_switch($rack,$user,2,'c1-switch-windows');

		$switch=$this->add_switch($rack,$user,48,'c1-switch-linux');



		$pdu=$this->add_pdu($rack,$user);




		for($i=10;$i<=47;$i++){
			$this->add_server($i, $rack, $user,$switch['id'],$switch['macs'],$pdu);
		}





		//monitoring

		$qmonitor=array(
				'iconw'=>1,
				'iconc'=>1,
				'iconu'=>1,
				'osdw'=>1,
				'osdu'=>1,
				'osdc'=>1,
				'soundw'=>1,
				'soundu'=>1,
				'soundc'=>1,
				'meta_update_user'=>$user
		);

		$monitor=new Model_Monitoring_Data($qmonitor);
		$monitor->save();




		$q=Array(
				'typeID'=>1,
				'user'=>'guest',
				'pass'=>'guest',
				'content'=>'https://nagios.demo.netways.de/nagios/cgi-bin/status.cgi',
				'meta_update_time'=>time(),
				'meta_update_user'=>$user
		);

		$source=new Model_Monitoring_Source($q);
		$source->save();





		/*
		 //server

		//cables
		DB::query("INSERT INTO `cables` (`id`, `dev1`, `port1`, `name1`, `dev2`, `port2`, `name2`, `type`, `meta_update_time`, `meta_update_user`) VALUES
				('', 1, 1, 1, 2, 1, 1, 1, 1337743207, 2),
				('', 1, 2, 2, 2, 2, 2, 1, 1337743221, 2);")->execute();

		//device_fieldset
		DB::query("INSERT INTO `device_fieldset` (`id`, `name`, `type`, `deviceID`, `tab`, `value`, `static`) VALUES
				('', 'Manufacturer', 'input', 1, 1, NULL, 1),
				('', 'Model', 'input', 1, 1, NULL, 1),
				('', 'Admin url', 'input', 1, 2, NULL, 1),
				('', 'Ports', 'network', 1, 2, NULL, 1),
				('', 'Images', 'img', 1, 3, NULL, 0),
				('', 'Export to pdf', 'print', 1, 3, NULL, 0),
				('', 'Manufacturer', 'input', 2, 1, NULL, 1),
				('', 'Model', 'input', 2, 1, NULL, 1),
				('', 'Admin url', 'input', 2, 2, NULL, 1),
				('', 'Ports', 'network', 2, 2, NULL, 1),
				('', 'Images', 'img', 2, 3, NULL, 0),
				('', 'Export to pdf', 'print', 2, 3, NULL, 0);")->execute();

		//device network
		DB::query("INSERT INTO `device_network` (`id`, `fieldsetID`, `deviceID`, `nics`, `vports`, `ports`, `uplinks`, `config_data`, `type`) VALUES
				('', 4, 1, 2, 0, 0, 0, '', 1),
				('', 10, 2, 0, 0, 24, 0, '', 2);")->execute();

		DB::query("INSERT INTO `network_ip_ports` (`id`, `networkID`, `nic_name`, `ipv4`, `ipv6`, `conn_type`, `conn_speed`, `type`) VALUES
				('', 1, '', '', '', 1, 1, 1),
				('', 1, '', '', '', 1, 3, 1);")->execute();

		DB::query("INSERT INTO `network_mac_ports` (`id`, `networkID`, `mac_address`, `conn_device`, `vlan`, `type`) VALUES
				('', 2, '', 0, 0, 1),
				('', 2, '', 0, 0, 1),
				('', 2, '', 0, 0, 1),
				('', 2, '', 0, 0, 1),
				('', 2, '', 0, 0, 1),
				('', 2, '', 0, 0, 1),
				('', 2, '', 0, 0, 1),
				('', 2, '', 0, 0, 1),
				('', 2, '', 0, 0, 1),
				('', 2, '', 0, 0, 1),
				('', 2, '', 0, 0, 1),
				('', 2, '', 0, 0, 1),
				('', 2, '', 0, 0, 1),
				('', 2, '', 0, 0, 1),
				('', 2, '', 0, 0, 1),
				('', 2, '', 0, 0, 1),
				('', 2, '', 0, 0, 1),
				('', 2, '', 0, 0, 1),
				('', 2, '', 0, 0, 1),
				('', 2, '', 0, 0, 1),
				('', 2, '', 0, 0, 1),
				('', 2, '', 0, 0, 1),
				('', 2, '', 0, 0, 1),
				('', 2, '', 0, 0, 1);")->execute();
		*/
	}

	public function action_userset($name,$pass){



		$user_id=false;




		try
		{
			// create the user - no activation required
			$vars = array(
					'username'    => $name,
					'password' => $pass,
					'email'	=> $name
			);

			//print_r($vars);
			$user_id = Sentry::user()->create($vars, false);

			if ($user_id)
			{
					

				$this->newuserdata($user_id);

				// the user was created - send email notifying user account was created
			}
			else
			{

					
				// something went wrong - shouldn't really happen
			}
		}
		catch (SentryUserException $e)
		{
			$errors = $e->getMessage(); // catch errors such as user exists or bad fields

		}


		return $user_id;
	}


}
