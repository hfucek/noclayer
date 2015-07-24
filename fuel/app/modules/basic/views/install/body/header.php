<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Install Noclayer</title>
	
	<link rel="stylesheet" href="assets/css/css5.css" type="text/css" media="all" />
	<script src="assets/js/jquery.js"></script>
	<script src="assets/js/install.js"></script>
	<style>
	*{
	margin:0;
	}
	
body{
background:url(/assets/img/back2.png);
}	
		#logo{
			display: block;
			background-image: url(logo-large.png);
			width: 220px;
			height: 55px;
			position: relative;
			top: 0px;
		}
		#header{
			background:white;
			border-bottom:1px solid #ccc;
			height: 55px;
			width: 100%;
			margin-bottom: 40px;
		}
		#header .row , .container .row{
			width: 940px;
			margin-left: 20px;
		}
		a{
			color: #883ced;
		}
		a:hover{
			color: #af4cf0;
		}
		.btn.primary{color:#ffffff!important;background-color:#883ced;background-repeat:repeat-x;background-image:-khtml-gradient(linear, left top, left bottom, from(#fd6ef7), to(#883ced));background-image:-moz-linear-gradient(top, #fd6ef7, #883ced);background-image:-ms-linear-gradient(top, #fd6ef7, #883ced);background-image:-webkit-gradient(linear, left top, left bottom, color-stop(0%, #fd6ef7), color-stop(100%, #883ced));background-image:-webkit-linear-gradient(top, #fd6ef7, #883ced);background-image:-o-linear-gradient(top, #fd6ef7, #883ced);background-image:linear-gradient(top, #fd6ef7, #883ced);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#fd6ef7', endColorstr='#883ced', GradientType=0);text-shadow:0 -1px 0 rgba(0, 0, 0, 0.25);border-color:#883ced #883ced #003f81;border-color:rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);
		body { margin: 0px 0px 40px 0px; }
	</style>
</head>
<body>
	<div id="header">
		<div class="row2">
			<div id="logo"></div>
		</div>
	</div>
	<div class="container">
		<div class="row">
<?php  if(!$instaled and $title){?>
<h1 class="card" style="background:#f8f8f8;width:600px;"><?php echo $title;?></h1>

<br><br>
<?php }?>
