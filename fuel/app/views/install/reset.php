<?php
include 'body/header.php';

?>



<div class="card">
<h2>Password resset</h2>
<div class="card_data">
<form class="p_reset" action="password" method="post">
<table width="100%">
<tr><td width="30%">New password:</td><td width="30%"><input type="password" value="<?php echo $pass1;?>"  name="pass1"></td><td width="40%"></td></tr>
<tr><td width="30%">Repeat:</td><td width="30%"><input type="password" value="<?php echo $pass2;?>"  name="pass2"></td><td width="40%"></td></tr>
</table>

<?php if(is_array($errors)){
echo'<div class="errors">';
	foreach ($errors as $err){
		
	echo '<div class="error">'.$err.'</div>';	
		
	}
echo'</div>';	
 }	
	?>

<div class="buttons">

<div  href="#" class="button p_reset">
<a href="#">Send</a>
</div>




</div>

</div>




<?php 
include 'body/footer.php';
?>

