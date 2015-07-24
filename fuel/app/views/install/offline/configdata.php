<div class="card mid">
<form class="install" action="install#engage" method="post">
<h2>Admin</h2>
<div class="card_data">
<table width="100%">
<tr><td width="30%">Name:</td><td width="30%"><input value="<?php echo $admin_name;?>"  name="admin_name" id="admin_name"></td><td width="40%"></td></tr>
<tr><td width="30%">Password:</td><td width="30%"><input type="password" value="<?php echo $admin_pass;?>"  name="admin_pass" id="admin_pass"></td><td width="40%"></td></tr>
</table>
</div>



<h2>Mysql</h2>
<div class="card_data">
<div class="small">You must now create Mysql database in your control panel and assign a user to it. Once this is complete, enter the connection details below.</a></div>
<table width="100%">
<tr><td width="30%">Host:</td><td width="30%"><input value="<?php echo $mysql_host;?>" name="mysql_host" id="mysql_host"></td><td valign="top" width="40%"></td></tr>
<tr><td>Database:</td><td><input value="<?php echo $mysql_database;?>" name="mysql_database"  id="mysql_database"></td></tr>
<tr><td>Username:</td><td><input value="<?php echo $mysql_username;?>" name="mysql_username" id="mysql_username"></td></tr>
<tr><td>Password:</td><td><input type="password" value="<?php echo $mysql_password;?>" name="mysql_password"  id="mysql_password"></td></tr>
</table>
</div>





<div id="engage" class="buttons">

	<button>Install</button>


<div id="inst_info"><div class="throbber"></div><div class="data"> Install in progress.. please wait.. </div></div>

</div>

</form>
</div>
<script type="text/javascript">
	var offlineInstallPreform = new (function () {
		this.getFieldLicenseKey = function () { return $('input[name="license"]'); }
		this.getFieldLicense = function () { return $('input[name="licenseInput"]'); }
		this.getFieldAdminName = function () { return $('#admin_name'); }
		this.getFieldAdminPass = function () { return $('#admin_pass'); }
		this.getFieldDbHost = function () { return $('#mysql_host'); }
		this.getFieldDbName = function () { return $('#mysql_database'); }
		this.getFieldDbUser = function () { return $('#mysql_username'); }
		this.getFieldDbPass = function () { return $('#mysql_password'); }
		
		this.getSubmitData = function () {
			return {
				admin_name		: this.getFieldAdminName().val(),
				admin_pass		: this.getFieldAdminPass().val(),
				mysql_host		: this.getFieldDbHost().val(),
				mysql_database	: this.getFieldDbName().val(),
				mysql_username	: this.getFieldDbUser().val(),
				mysql_password	: this.getFieldDbPass().val(),
				license_key		: this.getFieldLicenseKey().val(),
				license			: this.getFieldLicense().val()
			}
		};
		
		this.submitRegistration = function () {
			$.ajax({
				url : 'installoffline/finish',
				data : this.getSubmitData(),
				type: 'POST',
				dataType: 'json',
				success: function (data) {
					console.log(data);
				}
			});
		}
	});
</script>


