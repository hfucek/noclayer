
<!-- stylesheets -->
<link rel="stylesheet" href="assets/css/core.css" type="text/css" media="all" />
<?php 
foreach ($manifest->modules as $module){
echo'
<!-- CSS from module '.$module.'
=================================================================================-->
';

foreach(glob(DOCROOT.'assets/modules/'.$module.'/css/*.css') as $css_name) {
$name=str_replace(DOCROOT, '', $css_name);
echo'<link rel="stylesheet" href="'.$name.'" type="text/css" media="all" />
';
	}
}


?>