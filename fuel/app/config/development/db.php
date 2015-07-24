<?php
return array(
	'default' => 
	array(
		'connection' => 
		array(
			'dsn' => 'mysql:host=localhost;dbname=premium',
			'username' => 'premium',
			'password' => 'tvoj8sam',
		),
	),
        'debugger' => 
	array(
            'table_prefix'=>'',
	'type'=>'mysql',	
            'connection' => 
		array(
			'dsn' => 'mysql:host=localhost;dbname=debuger',
		'database'=>'debuger',	
                    'username' => 'root',
			'password' => 'big$erif',
		),
	),
);
