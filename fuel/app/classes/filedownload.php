<?php

class fileDownload
{
	
	
	protected $_name;
	
	protected $_mimeType;
	
	protected $_content;
	
	protected $_filename;
	
	public function __construct($content = null, $filename = null)
	{
		$this->_mimeType = 'application/octet-stream';
		$this->_filename =		empty($filename)
							?	'file_'.str_replace(array(' ','-','.'),'-',microtime(true)).'.txt'
							:	$filename;
		$this->_content = $content;
	}
	
	public function download()
	{
		header('Content-Description: File Transfer');
		header('Content-Type: ',$this->_mimeType);
		header('Content-Disposition: attachment; filename="'.$this->_filename.'"');
		header('Content-Transfer-Encoding: chunked');
        header('Expires: 0');
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        header('Pragma: public');
		
		echo $this->_content;
		exit;
	}
	
}