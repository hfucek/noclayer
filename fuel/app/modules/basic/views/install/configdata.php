<div class="card mid">
<form class="install" action="install#engage" method="post">
<h2>Admin</h2>
<div class="card_data">
<table width="100%">
<tr><td width="30%">Name:</td><td width="30%"><input value="<?php echo $admin_name;?>"  name="admin_name"></td><td width="40%"></td></tr>
<tr><td width="30%">Password:</td><td width="30%"><input type="password" value="<?php echo $admin_pass;?>"  name="admin_pass"></td><td width="40%"></td></tr>
</table>
</div>

<h2>License key</h2>
<div class="card_data">
<div class="small">You will find your license key in the <a href="http://users.noclayer.com">Noclayer memeber area</a></div>

<table width="100%">
<tr><td width="30%">License key:</td><td width="30%"><input  value="<?php echo $licensekey;?>" name="licensekey"></td><td width="40%"></td></tr>

</table>
</div>



<h2>Mysql</h2>
<div class="card_data">
<div class="small">You must now create Mysql database in your control panel and assign a user to it. Once this is complete, enter the connection details below.</a></div>
<table width="100%">
<tr><td width="30%">Host:</td><td width="30%"><input value="<?php echo $mysql_host;?>" name="mysql_host"></td><td valign="top" width="40%"></td></tr>
<tr><td>Database:</td><td><input value="<?php echo $mysql_database;?>" name="mysql_database"></td></tr>
<tr><td>Username:</td><td><input value="<?php echo $mysql_username;?>" name="mysql_username"></td></tr>
<tr><td>Password:</td><td><input type="password" value="<?php echo $mysql_password;?>" name="mysql_password"></td></tr>
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

<div  href="#" class="button install">
<a href="#start_me_up">install</a>
</div>


<div id="inst_info"><div class="throbber"></div><div class="data"> Install in progress.. please wait.. </div></div>

</div>

</form>
</div>



