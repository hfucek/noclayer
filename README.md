#Noclayer
!(public/logo.png)  
Data center rack management 

[<img src="https://s-a.github.io/license/img/mit.svg" />](/LICENSE.md#mit "Massachusetts Institute of Technology (MIT)")
[![Donate](http://s-a.github.io/donate/donate.svg)](http://s-a.github.io/donate/)

##Installing Noclayer
-----------------------------------------------------------------------------
	The following steps will guide you through the process:

1. There are two folders: public and fuel 

2. Upload the content of the entire public folder on your website (usual public_html 
or www and so on) - if you experience problems, try uploading in binary model

3. Upload entire fuel folder to a parent folder of the public folder (example: if public 
folder is home/user_folder/public_html then upload fuel folder to /home/user_folder/fuel)

4. Goto public_html and rename default.htaccess to .htaccess

5. Now visit the installation script at http://www.yourdomain.com/install to run the 
installing process

6. Follow the installing instructions on your screen. They will involve setting file 
permissions as listed below, entering your license key and setting up your primary admin account


Required file & folders permissions
-----------------------------------------------------------------------------
	/public_html/images                             CHMOD 777 Writeable
	/public_html/images/tumb                        CHMOD 777 Writeable
	/public_html/images/uploads                     CHMOD 777 Writeable
	/fuel/app/license                               CHMOD 777 Writeable
	/fuel/app/tmp                                   CHMOD 777 Writeable
	/fuel/app/config                                CHMOD 777 Writeable
	/fuel/app/config/production                     CHMOD 777 Writeable


System Requirements
-----------------------------------------------------------------------------
Most current web servers with PHP & MySQL installed will be capable of 
running Noclayer. However, the specific system requirements are:


	PHP Version 5.3 or later
	MySQL Version 5.x or later
	GD2 Image Library	
	
License
-----------------------------------------------------------------------------
Copyright (c) 2015 Hrvoje Fucek hrvoje.fucek@gmail.com
This software is licensed under MIT.