<?php

namespace Basic;

class Model_Wikicat extends \Orm\Model {

    protected static $_table_name = 'wiki_categories';
    protected static $_properties = array(
        'id',
        'name'
    );

}