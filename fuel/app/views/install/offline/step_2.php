
<form class="install" method="post" action="?step=3" enctype="multipart/form-data">
<div class="card mid">

		<h2>License validation</h2>
		<div class="card_data">
			<div class="small">Please copy the content of license provided to you for the following license key</div>
			<table width="100%">
				<tr>
					<td width="30%">License key:</td>
					<td width="30%">
						<input type="text" disabled="disabled" value="<?php echo $licenseKey;?>">
						<input type="hidden" id="licenseInput" value="<?php echo $licenseKey;?>" name="licenseKey">
					</td>
					<td width="40%"></td>
				</tr>
				<?php /*<tr id="inputRowUpload">
					<td width="30%">License file:</td>
					<td width="30%">
						<input type="file" name="licenseUpload">
					</td>
					<td width="40%"></td>
				</tr>*/?>
				<tr id="inputRowUpload">
					<td colspan="3">
						<textarea <?php if (!$validManifest): ?>disabled="disabled" <?php endif; ?>name="licenseInput" style="width: 100%; height: 200px; font-size: 11px;"><?php echo $licenseInput; ?></textarea>
					</td>
				</tr>
			</table>
			<?php if (!$validManifest):?>
			<div id="inst_err">
				<div class="error">Provided license key is not valid for current Noclayer version. Input disabled. Please download and install correct version of Noclayer.</div>
			</div>
			<?php endif; ?>
			<?php if ($stepBack):?>
			<div id="inst_err">
				<div class="error">Provided license was not valid for given license key.</div>
			</div>
			<?php endif; ?>
		</div>
	</div>

	<?php if ($validManifest):?>
	<div class="card mid">
			<h2>Continue</h2>
			<div class="card_data">
				<div>In the license file input box, select the file you have been sent via email.</div>
				<div><button type="submit" name="action" value="step3" id="continue">Continue</button></div>
			</div>
	</div>
	<?php endif; ?>
</form>