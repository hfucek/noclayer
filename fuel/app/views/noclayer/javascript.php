
<!--JQUERY main data-->

<script src="assets/js/jquery-1.9.1.js"></script>
<script src="assets/js/jquery-ui-1.10.1.custom.js"></script>
<script src="assets/js/jquery.jqcrypt.pack.js"></script>
<script src="assets/js/jquery.jstree.js"></script>
<script src="assets/js/jquery.sizes.js"></script>
<script src="assets/js/jquery.svg.js"></script>
<script src="assets/js/jquery.numeric.js"></script>
<script src="assets/js/json.js"></script>
<script src="assets/js/jquery.dataTables.js"></script>

<!--javascript core data-->
<script src="assets/js/main.js"></script>
<script src="assets/js/nocwin.js"></script>
<script src="assets/js/dialog.js"></script>
<?php 



foreach ($manifest->modules as $module){
echo'
<!-- JS from module '.$module.'
=================================================================================-->
';
	

foreach(glob(DOCROOT.'assets/modules/'.$module.'/js/include/*.js') as $js_name) {
	
$name=str_replace(DOCROOT, '', $js_name);
echo'<script src="'.$name.'"></script>
';
	}


foreach(glob(DOCROOT.'assets/modules/'.$module.'/js/*.js') as $js_name) {
	
$name=str_replace(DOCROOT, '', $js_name);
echo'<script src="'.$name.'"></script>
';
	}
	
	
}




/*
?>

<script src="assets/js/zoom.js"></script>
<script src="assets/js/stable.js"></script>
<script src="assets/js/noc6.js"></script>
<script src="assets/js/rack6.js"></script>
<script src="assets/js/nocwin.js"></script>
<script src="assets/js/tree.js"></script>

<script src="assets/js/template.js"></script>
<script src="assets/js/ajaxupload.js"></script>
<script src="assets/js/image.js"></script>
<script src="assets/js/jquery.numeric.js"></script>
<script src="assets/js/network.js"></script>

<script src="assets/js/wiki.js"></script>
<script src="assets/js/jquery.svg.js"></script>

<script src="assets/js/kvm.js"></script>
<script src="assets/js/power.js"></script>
<script src="assets/js/demo.js"></script>
<script src="assets/js/jquery.markitup.js"></script>
<script src="assets/js/springy.js"></script>
<script src="assets/js/springyui.js"></script>
<script src="assets/js/vps.js"></script>
<script src="assets/js/json.js"></script>
<script src="assets/js/jquery.jqcrypt.pack.js"></script>
<script src="assets/js/dragsvg.js"></script>
<script src="assets/js/taffy.js"></script>
<?php 
if($nocversion=='adv' or $nocversion=='pre')
{
		
?>
<!-- cables -->
<script src="assets/modules/js/cables/cables.js"></script>

<!-- monitoring -->
<script src="assets/modules/js/monitoring/init.js"></script>
<script src="assets/modules/js/monitoring/nagios.js"></script>
<script src="assets/modules/js/monitoring/message.js"></script>

<!-- graphing -->
<script src="assets/modules/js/graphing/init.js"></script>
<script src="assets/modules/js/graphing/cacti.js"></script>


<?php 
*/


?>


<script>
hlog='<?php echo $hlog;?>';
huser='<?php echo $huser;?>';
htyp=<?php echo $htyp;?>;
settings='<?php echo json_encode($settings);?>';
mainpath='<?php echo PUBLICPATH;?>'
mode='<?php echo $nocversion;?>';
upgrade='<?php echo json_encode($upgraded);?>';
licdata='<?php echo Request::forge('licensestate')->execute();?>';

</script>