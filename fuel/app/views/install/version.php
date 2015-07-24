<?php
include 'body/header.php';

?>



<div class="card">
<h2>Version <?php echo $version['value']?></h2>

<div>last update: <?php  echo date('d/m/Y', $version['meta_update_time'])?></div>

<div class="small">Thank you for choosing our product, Noclayer development team! </div>

</div>

<div class="card">

<div style=""><a class="mainlink" href="/">Goto main noclayer page</a></div>
    
</div>


<?php 
include 'body/footer.php';
?>
