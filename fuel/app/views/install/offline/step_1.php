<form class="install" action="?step=2" method="post">
	<div class="card mid">
			<h2>License key</h2>
			<div class="card_data">
				<div class="small">You will find your license key in the <a target="_new" href="http://users.noclayer.com">Noclayer memeber area</a></div>
				<table width="100%">
					<tr>
						<td width="30%">License key:</td>
						<td width="30%"><input id="licenseKey" value="<?php echo $licensekey;?>" name="licenseKey"></td>
						<td width="40%"></td>
					</tr>
					<tr>
						<td width="30%"></td>
						<td width="30%"><button name="action" value="downloadLicense" type="submit" id="downloadLicenseInfoButton">Download license information file</button></td>
						<td width="40%"></td>
					</tr>
				</table>
			</div>
	</div>

	<div class="card mid">
			<h2>Continue</h2>
			<div class="card_data">
				<div>Once you download your license information file, email it to us at license-offline@noclayer.com, and upon receiving the license file continue on to next step</div>
				<div><button type="submit" name="action" value="step2" id="continue">Continue</button></div>
			</div>
	</div>
</form>

<script type="text/javascript">
	var offlineInstallerS1 = new (function () {
		this.getLicenseInput			= function () { return $('#licenseKey');				};
		this.getLicenseDownloadButton	= function () { return $('#downloadLicenseInfoButton');	};
		this.getContinueButton			= function () { return $('#continue');					};
		this.isLicenseValid				= function ()
		{ 
			pattern = '[A-Za-z0-9]+\/<?php echo $subscription_type; ?>\_[A-Za-z0-9]+';
			val = $.trim(offlineInstallerS1.getLicenseInput().val());
			return val.match(pattern);
		}
		this.preformCheck	= function () {
			if (this.isLicenseValid())
			{
				this.getLicenseDownloadButton().removeAttr('disabled');
				this.getContinueButton().removeAttr('disabled');
			} else {
				this.getLicenseDownloadButton().attr('disabled','disabled');
				this.getContinueButton().attr('disabled','disabled');
			}
		};
		this.init = function () {
			this.preformCheck();
			this.getLicenseInput().keyup(function () { offlineInstallerS1.preformCheck() });
			this.getLicenseInput().blur(function () { offlineInstallerS1.preformCheck() });
			this.getLicenseInput().change(function () { offlineInstallerS1.preformCheck() });
		};
	});
	offlineInstallerS1.init();
//var offlineInstaller = new (function () {
//	
//	this.getDownloadLicenseButton = function () { return $('#downloadLicenseInfoButton') };
//	this.getLicenseInput = function () { return $('#licenseInput'); }
//	this.getContinueLink = function () { return $('#continueLink'); }
//	this.getSubmitLicenseField = function () { return $('#submitLicense'); };
//	this.old_val = '';
//	
//	this.checkLicenseType = function ()
//	{
//		_t = this;
//		_t.copyLicenseValues();
//		val = this.getLicenseInput().val();
//		if (val != this.old_val)
//		{
//			_t.downloadButtonLock(true);
//			this.old_val = val;
//			$.ajax({
//				url : 'installoffline/validateLicenseType',
//				data : {licensekey : $('input[name="licensekey"]').val() },
//				dataType : 'json',
//				type : 'POST',
//				success : function (data) {
//					if (data.valid && (data.license == _t.getLicenseInput().val()))
//					{
//						_t.downloadButtonLock( false );
//					} else {
//						_t.downloadButtonLock( true );
//					}
//				}
//			})
//		}
//	};
//	
//	this.downloadButtonLock = function ( state )
//	{
//		if ( state )
//		{
//			this.getDownloadLicenseButton().attr('disabled','disabled').addClass('disabled');
//			this.getContinueLink().attr('disabled','disabled').addClass('disabled');
//		} else  {
//			this.getDownloadLicenseButton().removeAttr('disabled').removeClass('disabled');
//			this.getContinueLink().removeAttr('disabled').removeClass('disabled');
//		}
//	}
//	
//	this.copyLicenseValues = function ()
//	{
//		i = this.getLicenseInput();
//		i_val = i.val();
//		this.getSubmitLicenseField().val(i_val);
//	}
//});
//// Preform initial check, and setup
//offlineInstaller.checkLicenseType();
//
//offlineInstaller.getLicenseInput()
//	.keyup(function () { offlineInstaller.checkLicenseType(); })
//	.blur(function () { offlineInstaller.checkLicenseType(); })
//	.change(function () { offlineInstaller.checkLicenseType(); })
//;
//offlineInstaller.getLicenseInput().blur(function () { offlineInstaller.checkLicenseType(); });
</script>