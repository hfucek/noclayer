<?php 
include('header.php');
$max_upload = (int)(ini_get('upload_max_filesize'));
?>

<div class="card mid">
<h2>Rackmonkey migration</h2>
</div>


<form enctype="multipart/form-data" method="POST" action="/basic/migrations/monkey">
    
 <div class="card mid">
			<h2>File</h2>
			<div class="card_data">
				<div class="small">Max file size (current <?php echo $max_upload;?>MB)</div>
				<table width="100%">
					<tr>
						<td width="30%">Excel [.xls]:</td>
						<td width="30%"><input accept="application/xls" type="file" name="file"></td>
						<td width="40%"></td>
					</tr>
					
				</table>
			</div>
	</div>

	<div class="card mid">
			<h2>Continue</h2>
			<div class="card_data">
				<div>Migration will auto populate all fields , after that, check data structure from Noclayer</div>
				<div><button type="submit" name="action" value="step2" id="continue">Continue</button></div>
			</div>
	</div>  
    
    
    
</form>

<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
?>
