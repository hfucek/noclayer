<?php

namespace Basic;

class Model_Wiki extends \Orm\Model {

    protected static $_table_name = 'wiki';
    protected static $_properties = array(
        'id',
        'catID',
        'title',
        'content',
        'meta_update_user',
        'meta_update_time'
    );

}