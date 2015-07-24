<style>
<!--
/* Main */
#main { 
font:14px Verdana;
padding: 20px;
width:800px; }
 
#browserlist:after { clear: both; } 

#browserlist li { width: 232px; float: left; margin: 0; }
#browserlist li .icon { width: 125px; height: 135px; margin: 0 auto 20px; background: url(assets/img/browse-sprite.gif) no-repeat; }
#browserlist li#chrome .icon { background-position: 0 0; }
#browserlist li#firefox .icon { background-position: -125px 0; }
#browserlist li#opera .icon { background-position: -250px 0; }
#browserlist li#safari .icon { background-position: -375px 0; }
#browserlist li#ie .icon { background-position: -500px 0; }
#browserlist h2 { float:left;font: 140%/1 Impact, Helvetica, sans-serif; 
	text-align: left; text-transform: uppercase; color: #DC1E14; text-shadow: 0 1px 0 #fff;
	background-color: rgba(255,255,255,.3); margin: 0 0 10px; line-height: 1; padding: 8px 0;
	 }

#browserlist a{
text-decoration:none;
color:#888;
}
#browserlist .info{
width:180px;
}


#browserlist a:hover{
cursor:pointer;
color:#1e90ff;;
}
#browserlist a:hover h2{
background:#f8f8f8;
}


-->
</style>

<div id="main">
		
<div class="iebox">
This page is not designed for Intenet Explorer.  If you want to see this webpage as intended, please use a standards compliant browser, such as:</a>
</div>

		<ul id="browserlist" class="wrap">
			<li id="chrome">
				<a href="http://www.google.com/chrome" title="Google Chrome">
					<div class="icon"></div>
					<h2>Google Chrome</h2>
					<p class="info">&#8220;A fast new browser from Google. Try&nbsp;it&nbsp;now!&#8221;</p>

					
					<p class="website">Visit website for more info</p>
				</a>
				
			</li><!-- #chrome -->
			<li id="firefox">
				<a href="http://www.firefox.com/" title="Mozilla Firefox">

					<div class="icon"></div>
					<h2>Mozilla Firefox</h2>
					<p class="info">&#8220;Your online security is Firefox's top priority. Firefox is free, and made to help you get the most out of the&nbsp;web.&#8221;</p>
					
					<p class="website">Visit website for more info</p>
				</a>

				
			</li><!-- #firefox -->
			<li id="safari">
				<a href="http://www.apple.com/safari/" title="Apple Safari">
					<div class="icon"></div>
					<h2>Safari</h2>
					<p class="info">&#8220;Safari for Mac and Windows from Apple, the world's most innovative&nbsp;browser.&#8221;</p>

					
					<p class="website">Visit website for more info</p>
				</a>
							</li><!-- #safari -->
			
		</ul><!-- #browserlist -->
	</div><!-- #main -->
