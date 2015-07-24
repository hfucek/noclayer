<?php

/**
 * 
 * Model for users ...
 * @author hrvoje
 *
 *
 */

namespace Basic;

class Model_Users extends Orm\Model {

    protected static $_table_name = 'Basic\users';
    protected static $_properties = array(
        'id',
        'username',
        'email',
        'password',
        'password_reset_hash',
        'temp_password',
        'remember_me'
    );

}

?>