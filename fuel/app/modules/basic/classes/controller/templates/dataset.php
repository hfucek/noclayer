<?php 
namespace Basic;
class Controller_Templates_Dataset extends Controller_Templates{
	public function before()
	{
	
		parent::before();
	}

	
	public function action_rename(){
		
		$val = \Validation::forge();
		
		
		$val->add_field('tid', 'Template id', 'required|min_length[1]|max_length[25]');
		$val->add_field('val', 'name', 'min_length[0]');
			
		if($val->run()){
			$template=Model_Device_Template::find($val->validated('tid'));
			
			if($template){
				$template->name=$val->validated('val');
				$template->save();
				
				echo json_encode(array('name'=>$template->name));
				
			}
		
		
		}
		
		
		
	}
	
	
	public function action_duplicate(){
	
		$val = \Validation::forge();
	
		
		$val->add_field('tid', 'Template id', 'required|min_length[1]|max_length[25]');
		$val->add_field('val', 'new duplicate name', 'min_length[0]');
			
		if($val->run()){
			
			$json=Array();
			
			$template=Model_Device_Template::find($val->validated('tid'));

			$iscopy=Model_Device_Template::find()->where('name',$val->validated('val'))->get_one();

			if($iscopy){
			$status='Template with this name already exist!';	
				
			}else{
			$status='Strange error!';
				
			if($template){
			$status='ok';
			
			
				//device_template

				$prop=array(
					'name'=>$val->validated('val'),
					'categoryID'=>$template->categoryID,
					'hidden'=>0,
					'meta_update_user'=>$this->user,
					'rack_unit'=>0
				);
			
			
				$new=new Model_Device_Template($prop);
			
				$new->save();
				
				//get device_temp_field

				foreach($template->field as $field){
					
					//basic data for field
					$prop=Array(
							'templateID'=>$new->id,
							'tab'=>$field->tab,
							'name'=>$field->name,
							'type'=>$field->type,
							'static'=>$field->static,
							'value'=>$field->value,
							'extra'=>$field->extra
					);
					
					
					//insert into temp field
					
					$new_field=new Model_Device_Template_Field($prop);
					
					$new_field->save();
					
					
					#hdd element data
					#####################################################################################
					if($field->type=='hdd'){

     				//get raid data
	  				$old_raid=Model_Raid::find()->where('tempfieldID',$field->id)->get_one();	
						
					
						//create new hardware_raid
					
						$prop=Array(
								'raid_type'=>$old_raid->raid_type,
								'size'=>$old_raid->size,
								'total'=>$old_raid->total,
								'meta_update_time'=>time(),
								'meta_update_user'=>$this->user,
								'tempfieldID'=>$new_field->id
						);
					
						$hdd=new Model_Raid($prop);
					
						$hdd->save();
					
						
						
						
						//get all discs from array
						foreach ($old_raid->rows as $disc){
							$m=Array(
								'model'=> $disc->model,
								'size' => $disc->size,
								'vport'	=>$disc->vport,
								'serial_number' =>  $disc->serial_number,
								'hardware_raid'=>$hdd->id,
								'meta_update_time'=>time(),
								'meta_update_user'=>$this->user,
							);
							$discs=new Model_Raid_Data($m);
					
							$discs->save();
					
								
						}
							
					}
					
					//ram
					#####################################################################################
					
					if($field->type=='ram'){
						
						//get ram data
						$old_ram=Model_Ram::find()->where('tempfieldID',$field->id)->get_one();
					
						//create new hardware_ram
					
						$prop=Array(
										'ram_type'=>$old_ram->ram_type,
										'size'=>$old_ram->size,
										'total'=>$old_ram->total,
										'meta_update_time'=>time(),
										'meta_update_user'=>$this->user,
										'tempfieldID'=>$new_field->id
						);
					
						$ram=new Model_Ram($prop);
					
						$ram->save();
					
						//get all modules from array
						foreach ($old_ram->rows as $modul){
							$m=Array(
										'hardware_ram'=>$ram->id,
										'meta_update_time'=>time(),
										'meta_update_user'=>$this->user,
										'model'=> $modul->model,
										'size' => $modul->size,
										'port'	=>$modul->port,
										'serial_number' =>  $modul->serial_number									
							);
							$rams=new Model_Ram_Data($m);
					
							$rams->save();
					
								
						}
					
					}
					
					//images
					#####################################################################################
					
					if($field->type=='img'){
							
						//get field images
						$temp_imags=Model_Device_Template_Image::find()->where('elementID',$field->id)->get();
						
						
						
							
						foreach($temp_imags as $img){
					
							$props=Array(
												'name'=>$img->name,
												'elementID'=>$new_field->id,
												'type'=> $img->type,
												'width'=>$img->width,
												'height'=>$img->height
							);
								
					
							$imgs=new Model_Device_Template_Image($props);
					
							$imgs->save();
					
					
							copy(DOCROOT.'images/temp'.$img->id.'.png',  DOCROOT.'images/temp'.$imgs->id.'.png');
							copy(DOCROOT.'images/tumb/temp'.$img->id.'.png',DOCROOT.'images/tumb/temp'.$imgs->id.'.png');
					
					
					
						}
							
							
					}
					
					
					
					
					
					//power out (PDU,ATS,UPS)
					#####################################################################################
						
						
					if($field->type=='power_out'){
						//power is set automatic as field saved
						$power=Model_Device_Template_Power::find()->where('fieldsetID',$new_field->id)->get_one();
					
						$extra=$field->power;
							
						//update default data with template power data
						$power->input=$extra->input;
						$power->output=$extra->output;
						$power->type=$extra->type;
						$power->current=$extra->current;
						$power->ru=$extra->ru;
						$power->pos=$extra->pos;
						$power->save();
					
						//delete any default socket
						$defsockets=Model_Device_Template_Power_Socket::find()->where('powerID',$power->id)->get();
						foreach ($defsockets as $ds)
						$ds->delete();
					
					
					
					
						foreach ($field->power->socket as $socket)
						{
							$prop=Array(
									'powerID'=> $power->id,
									'conn_type'=>$socket->conn_type,
									'type' =>$socket->type
							);
								
							$newsocket=new Model_Device_Template_Power_Socket($prop);
							$newsocket->save();
								
					
					
						}
					
					}
					
					
					//power in (Server,Switch,Router,...)
					#####################################################################################
					
					
					if($field->type=='power_in'){
						//power is set automatic as field saved
						$power=Model_Device_Template_Power::find()->where('fieldsetID',$new_field->id)->get_one();
					
						$extra=$field->power;
							
						//update default data with template power data
						$power->input=$extra->input;
						$power->output=$extra->output;
						$power->type=$extra->type;
						$power->current=$extra->current;
						$power->ru=$extra->ru;
						$power->pos=$extra->pos;
						$power->save();
					
						//delete any default socket
						$defsockets=Model_Device_Template_Power_Socket::find()->where('powerID',$power->id)->get();
						foreach ($defsockets as $ds)
						$ds->delete();
					
					
					
					
						foreach ($field->power->socket as $socket)
						{
							$prop=Array(
										'powerID'=> $power->id,
										'conn_type'=>$socket->conn_type,
										'type' =>$socket->type
							);
					
							$newsocket=new Model_Device_Template_Power_Socket($prop);
							$newsocket->save();
					
					
					
						}
					
					}
					
					
					//kvm out (KVM switch)
					#####################################################################################
					
					
					if($field->type=='kvm_out'){
						//power is set automatic as field saved
						$kvm=Model_Device_Template_Kvm::find()->where('fieldsetID',$new_field->id)->get_one();
					
						$extra=$field->kvm;
							
						//update default data with template power data
						$kvm->input=$extra->input;
						$kvm->output=$extra->output;
						$kvm->type=$extra->type;
						$kvm->save();
					
						//delete any default socket
						$defsockets=Model_Device_Template_Kvm_Socket::find()->where('kvmID',$kvm->id)->get();
						foreach ($defsockets as $ds)
						$ds->delete();
					
					
					
					
						foreach ($field->kvm->socket as $socket)
						{
							$prop=Array(
								'kvmID'=> $kvm->id,
								'conn_type'=>$socket->conn_type,
								'type' =>$socket->type
							);
					
							$newsocket=new Model_Device_Template_Kvm_Socket($prop);
							$newsocket->save();
					
					
					
						}
					
					}
					
					//KVM in (Server,Switch,Router,...)
					#####################################################################################
					
					
					if($field->type=='kvm_in'){
						//kvm is set automatic as field saved
						$kvm=Model_Device_Template_Kvm::find()->where('fieldsetID',$new_field->id)->get_one();
					
						$extra=$field->kvm;
							
						//update default data with template kvm data
						$kvm->input=$extra->input;
						$kvm->output=$extra->output;
						$kvm->type=$extra->type;
						$kvm->save();
					
						//delete any default socket
						$defsockets=Model_Device_Template_Kvm_Socket::find()->where('kvmID',$kvm->id)->get();
						foreach ($defsockets as $ds)
						$ds->delete();
					
					
					
					
						foreach ($field->kvm->socket as $socket)
						{
							$prop=Array(
								'kvmID'=> $kvm->id,
								'conn_type'=>$socket->conn_type,
								'type' =>$socket->type
							);
					
							$newsocket=new Model_Device_Template_Kvm_Socket($prop);
							$newsocket->save();
					
					
					
						}
					
					}
					
					
					
					
					//network
					#####################################################################################
					
					
					if($field->type=='network'){
						
						
						//newtwork is set automatic as field saved
						$network=Model_Device_Template_Network::find()->where('fieldID',$new_field->id)->get_one();
							
						$extra=$field->network;
						
						//update default data with old template network data
						$network->type=$extra->type;
						$network->nics=$extra->nics;
						$network->vports=$extra->vports;
						$network->ports=$extra->ports;
						$network->uplinks=$extra->uplinks;
						$network->save();
						
						
						
						switch($network->type){
							case 1:
						//IP addresses
								foreach ($field->network->ip as $ip)
								{
									
									$prop=Array(
									'tempnetID'=>$network->id,
									'nic_name'=>$ip->nic_name,
									'ipv4'=>$ip->ipv4,
									'ipv6'=>$ip->ipv6,
									'conn_type'=>$ip->conn_type,
									'conn_speed'=>$ip->conn_speed,
									'type'=>$ip->type
									);
										
									$ips=new Model_Device_Template_Network_Ip($prop);
									$ips->save();
									
									
								}
								
						
						break;
						//MAC and VLAN 
							case 2:
								
								$vlan2port=Array();
									
								//if no vlan is set to mac
								$vlan2port[0]=0;
								
								
								foreach ($field->network->vlan as $vlan){
									$prop=Array(
									'tempnetID'=>$network->id,
									'name'=>$vlan->name
										
									);
										
									$vlans=new Model_Device_Template_Network_Vlan($prop);
									$vlans->save();
									
									$vlan2port[$vlan->id]=$vlans->id;
									
									
								}
								
								foreach ($field->network->mac as $mac){
									
									$prop=Array(
									'tempnetID'=>$network->id,
									'mac_address'=>$mac->mac_address,
									'conn_device'=>$mac->conn_device,
									'vlan'=>$vlan2port[$mac->vlan],
									'type'=>$mac->type
									);
									
									$macs=new Model_Device_Template_Network_Mac($prop);
									$macs->save();
								}		
								
						break;
                                                
                                                //patch panels
							case 3:
								
								$vlan2port=Array();
									
								//if no vlan is set to mac
								$vlan2port[0]=0;
								
								
								foreach ($field->network->vlan as $vlan){
									$prop=Array(
									'tempnetID'=>$network->id,
									'name'=>$vlan->name
										
									);
										
									$vlans=new Model_Device_Template_Network_Vlan($prop);
									$vlans->save();
									
									$vlan2port[$vlan->id]=$vlans->id;
									
									
								}
								
								foreach ($field->network->mac as $mac){
									
									$prop=Array(
									'tempnetID'=>$network->id,
									'mac_address'=>$mac->mac_address,
									'conn_device'=>$mac->conn_device,
									'vlan'=>$mac->vlan,
									'type'=>$mac->type
									);
									
									$macs=new Model_Device_Template_Network_Mac($prop);
									$macs->save();
								}		
								
						break;
						
						}
						
					}
					
					
					
				}	
				
				
			
			
					
				
				$d=Array();
				$d['templates']=$new;
				
				$d['import']=true;
				
				$d['alltemplates']=Model_Device_Template::find()->where('hidden',0)->where('categoryID',$template->categoryID)->get();
				$d['category']=$template->categoryID;
				
				
				$json=json_decode(\View::forge('template/data',$d));
				
				
				
				
				
				
			
	
			}
	
	
		}}
		
		echo json_encode(array('status'=>$status,'data'=>$json));
	
	
	
	}
	
	public function action_value(){
		
		
		$val = \Validation::forge();
		
		
		$val->add_field('eid', 'Device element id', 'required|min_length[1]|max_length[25]');
		$val->add_field('val', 'Device element val', 'min_length[0]');
			
		if($val->run()){
			$field=Model_Device_Template_Field::find($val->validated('eid'));
			if($field){
				
					
				$field->value=$val->validated('val');
				
				$field->save();
		
				echo json_encode(Array('status'=>'ok'));
		
			}
		
		
		
		}
		
		
		
		
	}
	
	public function action_index(){
		
		echo 'ok';
		
		
	}
	
	
	
}
	?>