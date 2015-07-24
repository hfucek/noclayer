<div class="card">
<h2>Requirements:</h2>


<div class="req"><div class="name">PHP > 5.3</div><div class="alert <?php echo $req['php']['class'];?>"><span style="font-size:14px;color:#ccc;float:left;position:relative;height:18px;width:160px;overflow:hidden;">(<?php echo $req['php']['ver'];?>)</span><?php echo $req['php']['value'];?></div></div>

<div class="req"><div class="name">Gd library</div><div class="alert <?php echo $req['gd']['class'];?>"><?php echo $req['gd']['value'];?></div></div>			
<div class="req"><div class="name">Folder permission:</div></div>			
<?php 
foreach ($req['files'] as $file){
?>
<div class="req sub"><div class="name"><?php echo $file['file'];?></div><div class="alert <?php echo $file['class'];?>"><span>(<?php echo $file['perm'];?>)</span><?php echo $file['writable'];?></div></div>

<?php }?>


<div class="req"><div class="name">GET (license.noclayer.com:80)</div><div class="alert <?php echo $req['home']['class'];?>"><?php echo $req['home']['value'];?></div></div>

<?php if(!$next):?>
<div class="buttons">
<div  class="button refresh">
<a href="?step=0">refresh</a>
</div>
</div>
<?php else: ?>
<div id="engage" class="buttons">
	<form action="?step=1">
	<button type="submit" name="step" value="1">Continue</button>
	</form>
</div>
<?php endif; ?>
</div>