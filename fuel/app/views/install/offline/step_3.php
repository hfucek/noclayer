<form class="install" action="?step=4" method="post">
	<input type="hidden" name="licenseKey" value="<?php echo $licenseKey ;?>" />
	<input type="hidden" name="licensePost" value="<?php echo $licensePost; ?>" />
<div class="card mid">

		<h2>Final step</h2>
		<div class="card_data">
			<div class="small">The following installation will install the license key onto your computer:</div>
			<table width="100%">
				<tr>
					<td width="30%">License key:</td>
					<td width="30%">
						<input type="text" disabled="disabled" value="<?php echo $licenseKey;?>">
					</td>
					<td width="40%"></td>
				</tr>
			</table>
		</div>	
	
	<h2>Admin</h2>
	<div class="card_data">
		<table width="100%">
		<tr>
			<td width="30%">Name:</td>
			<td width="30%">
				<input value="<?php echo $d['admin_name'];?>"  name="admin_name" id="admin_name">
			</td>
			<td width="40%">

			</td>
		</tr>
		<tr>
			<td width="30%">Password:</td>
			<td width="30%">
				<input type="password" value="<?php echo $d['admin_pass'];?>"  name="admin_pass" id="admin_pass">
			</td>
			<td width="40%"></td>
		</tr>
		</table>
	</div>

	<h2>Mysql</h2>
	<div class="card_data">
		<div class="small">You must now create Mysql database in your control panel and assign a user to it. Once this is complete, enter the connection details below.</div>
		<table width="100%">
		<tr>
			<td width="30%">Host:</td>
			<td width="30%">
				<input value="<?php echo $d['mysql_host'];?>" name="mysql_host" id="mysql_host">
			</td>
			<td valign="top" width="40%"></td>
		</tr>
		<tr>
			<td width="30%">Database:</td>
			<td width="30%">
				<input value="<?php echo $d['mysql_database'];?>" name="mysql_database"  id="mysql_database">
			</td>
			<td valign="top" width="40%"></td>
		</tr>
		<tr>
			<td width="30%">Username:</td>
			<td width="30%">
				<input value="<?php echo $d['mysql_username'];?>" name="mysql_username" id="mysql_username">
			</td>
			<td valign="top" width="40%"></td>
		</tr>
		<tr>
			<td width="30%">Password:</td>
			<td width="30%">
				<input type="password" value="<?php echo $d['mysql_password'];?>" name="mysql_password"  id="mysql_password">
			</td>
			<td valign="top" width="40%"></td>
		</tr>
	</table>
</div>



<?php if(count($errors)>0){

	echo' <div id="inst_err">';
	
	foreach ($errors as $err){
		
	echo '<div  class="error">'.$err.'</div>';	
		
	}
	echo'</div>';
	
 }	
	?>

<div id="engage" class="buttons">

	<button type="submit" name="action" value="step4">Install</button>


<div id="inst_info"><div class="throbber"></div><div class="data"> Install in progress.. please wait.. </div></div>

</div>
</form>