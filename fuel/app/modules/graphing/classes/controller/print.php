<?php 
namespace Graphing;
class PDF extends \FPDF{
	
	
	function Rotate($angle,$x=-1,$y=-1) {
	
		if($x==-1)
			$x=$this->x;
		if($y==-1)
			$y=$this->y;
		if($this->angle!=0)
			$this->_out('Q');
		$this->angle=$angle;
		if($angle!=0)
	
		{
			$angle*=M_PI/180;
			$c=cos($angle);
			$s=sin($angle);
			$cx=$x*$this->k;
			$cy=($this->h-$y)*$this->k;
	
			$this->_out(sprintf('q %.5f %.5f %.5f %.5f %.2f %.2f cm 1 0 0 1 %.2f %.2f cm',$c,$s,-$s,$c,$cx,$cy,-$cx,-$cy));
		}
	
	
	}
	
	
	function _graph($graph,$num,$ret,$y){
		
		$g=$this->cacti->graph($graph,5,$ret);
		
		
		
		$img=imagecreatefromstring($g['ret']);
		
		$width=imagesx ($img);
		$height=imagesy ($img);
		
		
		
		//list($width, $height) = getimagesize();
		$temp = tmpfile();
		
		$tmpfname = tempnam("/tmp", "FOO");
		
		$tmpfname.='.png';
		
		
		imagepng($img,$tmpfname);
		
		//graphing/graph/get/2/26/1/1
		$this->Image($tmpfname,80,$y,$width*$this->zoom,$height*$this->zoom);
		
		unlink($tmpfname);
	}
	
	public function init($graph,$dev,$port,$sourceID){
		
		//$graph=Model_Graphing_Cacti::find()->where('graphID',$id)->where('deviceID',$dev);
		
		$this->port=$port;
		
		ob_start();
		$this->device=\Basic\Model_Device::find($dev);
		
		$this->heightlimit=750;
			
		$this->_setTitle();
		
		
		$this->_AddPage();
		
		$this->zoom=0.75;
		
		
		$source=Model_Source::find($sourceID);
		
		if($source){
				
			$this->cacti=new \Cacti($source->content);
			$code=$this->cacti->authentication($source->user, $source->pass);
				
		
			if($code==200){
				$this->angle=0;
				$this->SetFont('Verdana','',12);
				$this->SetTextColor(0,0,0);
				
					$this->_graph($graph, 5, 1,20);
					
					
					///$this->Ln(-180);
					$this->Rotate(90);
					$this->text(-80,72,'Daily');
					$this->Rotate(0);
					$this->_graph($graph, 5, 2,205);
					
					$this->Rotate(90);
					$this->text(-265,72,'Weekly');
					$this->Rotate(0);
						
					$this->_graph($graph, 5, 3,390);
					
					$this->Rotate(90);
					$this->text(-450,72,'Monthly');
					$this->Rotate(0);
						
					$this->_graph($graph, 5, 4,575);
					
					$this->Rotate(90);
					$this->text(-635,72,'Yearly');
					$this->Rotate(0);
						
			}
		
		}
		
		
		
		/*
		$this->setTypeOfDevice();
		
		$this->rack=Model_Rack::find($this->device->rack);
		
		$this->template=Model_Device_Template::find($this->device->get('type'));
		
		$this->heightlimit=750;
			
		$this->_setTitle();
		
		
		
		$this->_AddPage();
		$this->zoom=0.75;
		
		$this->rack_set(90,50,$this->rack->size);
		
		
		
		
		
		
		
		
		$this->device_general();
		
		if($this->action[0]==1)
		$this->device_hardware();
		
		if($this->action[1]==1)
		$this->device_network();
		
		if($this->action[2]==1)
		$this->device_notes();
		
		$this->device_power();
		
		
		*/
	}
	

	

	
	private function _setTitle(){
		$this->title='Device graphs';
		
	
	}
	

	private function _AddPage(){
		$this->AddPage();
		$this->components();
		$this->fillFooter();
	
	}
	
	function AcceptPageBreak(){
		$this->AddPage();
		$this->components();
		$this->fillFooter();
		$this->SetTextColor(50,50,50);
	}
	
	private function components(){
	
		$this->SetLineWidth(0.7);
		$this->SetDrawColor(0,0,0);
	
		//horizontal line top
		$this->Line(56.7,14.2,581,14.2);
	
		//vertical line right
		$this->Line(581,14.2,581,827.7);
	
		//horizontal bottom
		$this->Line(581,827.7,56.7,827.7);
	
		//vertical left
		$this->Line(56.7,827.7,56.7,14.2);
	
	
		$this->Line(156,827.7,156,771);
	
	
		$this->Line(156,771,581,771);
	
		//799
	
		$this->Line(420,827.7,420,771);
		$this->Line(420,799,581,799);
	
		//$this->Line(156,771,581,771);
	
		$this->Line(540,827.7,540,771);
	
	
	}
	
	private function fillFooter(){
		$this->SetFont('Arial','',18);
		$this->SetTextColor(0,0,0);
		//name
		$this->text(200,804,$this->device->get('hostname'));
	
		$this->SetFont('Arial','',12);
		//values
		$this->text(430,793,$this->device->category->get('name'));
		$this->text(430,823,$this->port);
		$this->text(545,793,$this->device->get('rack_units'));
		$this->text(545,823,$this->device->get('rack_pos'));
	
	
		$this->SetFont('Arial','',8);
		$this->SetTextColor(30,144,250);
	
		//titels
		$this->text(165,785,$this->title);
	
		$this->text(430,780,'Category of device');
		$this->text(430,808,'PORT Number');
	
		$this->text(545,780,'RU');
		$this->text(545,808,'RP');
	
	
	
	}
	
	
	


	
	
	

	private function device_title(){
		$this->SetTextColor(158,158,158);
		$this->SetFont('Verdana','',18);
		$this->Write(18,'DEVICE: ');
		$this->SetTextColor(100,100,100);
		$this->Write(18,$this->device->hostname);
		$this->Ln(30);
	}
	
	
	
	private function add_text($title,$text){
	if($this->GetY()>=$this->heightlimit){
	$this->_AddPage();
	
	}
	
	$this->SetTextColor(158,158,158);
	$this->Write(14,$title.' ok');
	
	$this->Ln(14);
	$this->SetTextColor(50,50,50);
	$this->MultiCell(260, 14, $text);
	$this->Ln(18);
	
	
	}
	
	private function check_box($title,$key){

		$this->SetTextColor(158,158,158);
		$this->Write(14,$title);
		$text='YES';
		if($key==0){
		$text='NO';	
		}
		$this->Ln(14);
		$this->SetTextColor(50,50,50);
		$this->Write(14,$text);
		$this->Ln(18);
		
		
	}
	
	
	
	private function add_line($title,$text){
		if($this->GetY()>=$this->heightlimit){
			$this->_AddPage();
	
		}
	
		$this->SetTextColor(158,158,158);
		$this->Write(14,$title);
	
		$this->Ln(14);
		$this->SetTextColor(50,50,50);
		$this->Write(14,$text);
		$this->Ln(18);
	
	
	}
	
	private function device_general(){
		$this->SetLeftMargin(295);
		
		$this->SetFont('Verdana','',10);
		$this->Ln(20);
	
		$this->SetTextColor(30,144,250);
	
		$this->Write(18,'General');
		$this->SetTextColor(158,158,158);
		$this->Ln(18);
	
		//$this->add_line('Category of device', $this->template->category->get('name'));
		// $this->add_line('Template', $this->template->get('name'));
		// $this->add_line('Name/hostname', $this->device->hostname);
		$this->add_line('Parent device', $this->parent_device());
		$this->add_line('Rack name', $this->rack->name);
		//$this->add_line('Rack position', $this->device->rack_pos);
		// $this->add_line('Rack units', $this->device->rack_units);
	
	}
	
	private function validate($val){
		if(strlen($val)==0) return '...';
		return $val;
	
	}
	
	
	

	
	
	
	
	
	
	
}



class Controller_Print extends Graphing{
	
	public function before(){
		parent::before();
		
	}
	
	public function action_get($graph,$dev,$port,$source){
	
	
	
	
		if($graph){
	
			
			define('FPDF_FONTPATH','../fuel/app/views/fonts');
			$pdf = new PDF('P','pt',array(595.28,841.89));
			$pdf->AddFont('Verdana');
			$pdf->SetLineWidth(0.1);
			$pdf->SetAutoPageBreak(true ,80);
			
			//$pdf->action=explode(',',$data);
			
			$pdf->init($graph,$dev,$port,$source);
			
			
	
	
			$pdf->Output('Device:'.$pdf->device->hostname.'.pdf','I');
	
	
		}
	}
	
	public function action_template($id=null,$data,$name){
	
	
	
	
		if($id and $data and $name){
	
				
			define('FPDF_FONTPATH','../fuel/app/views/fonts');
			$pdf = new PDF('P','pt',array(595.28,841.89));
			$pdf->AddFont('Verdana');
			$pdf->SetLineWidth(0.1);
			$pdf->SetAutoPageBreak(true ,80);
				
			$pdf->action=explode(',',$data);
				
			$pdf->init($id);
				
				
	
	
			$pdf->Output('Graph:'.$pdf->device->hostname.'.pdf','I');
	
	
		}
	}
	
	
		
	
	

}