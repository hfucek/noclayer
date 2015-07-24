<?php

class Upgrade {

    /**
     * @var string Current installed version
     */
    protected $_installed_version;

    /**
     * @var string update version local
     */
    protected $_updated_version;

    /**
     * @var string update version remote
     */
    protected $_available_version;

    /**
     * @var Fuel::Model_Version data from database 
     */
    protected $_master_version;

    /**
     * @var Fuel::Model_Version data from database 
     */
    protected $_package_url;

    /**
     * licence instance
     */
    protected $_lic;

    /**
     * path to archive for download
     */
    protected $_archive_path;

    /**
     * zip archive 
     */
    protected $_zip;

    /**
     *      Some important data...
     */

    CONST NOCLAYER_DOWNLOAD_URL = 'http://noclayer.com/release/';
    CONST NOCLAYER_PUBLIC_KEY = 'R@nd0mK^Y555';
    CONST DOWNLOAD_ARCHIVE_NAME = 'archive.zip';
    CONST CONFIG_BACKUP = 'backup.zip';
    CONST NOCLAYER_UPDATE_PATH = 'http://noclayer.com/update/get/';

    /**
     * @return bool collect data
     */
    public function __construct() {
        //new available version
        Config::load('update', true);
        $this->_updated_version = Config::get('update.version');

        //version of installed mode
        Config::load('install', true);
        $this->_installed_version = Config::get('install.version');


        //download archive path
        $this->_archive_path = APPPATH . 'tmp/' . self::DOWNLOAD_ARCHIVE_NAME;


        //populate other data if we have database installed
        if ($this->_installed_version)
            $this->__populate_data();
    }

    /**
     * What is current version for upgrade
     * @return string
     */
    private function _available() {


        if ($this->_is_local_upgrade()) {
            return $this->_updated_version;
        } else {
            return $this->_available_version;
        }
    }

    /**
     * Call this only if database exist
     */
    private function __populate_data() {



        //master version currently installed
        $this->_master_version = Model_Version::find('last', array('order_by' => array('meta_update_time' => 'desc')));

        //current avaiable version
        $this->_available_version = $this->_master_version['mode'];

        //license
        $this->_lic = \Licen::load();
    }

    /**
     * 
     * @return bool is upgrade manual
     */
    protected function _is_local_upgrade() {

        return ($this->_installed_version != $this->_updated_version) ? true : false;
    }

    /*
     * Ping noclayer server, get lastest version
     */

    public function check_remote() {


        $updatepath=self::NOCLAYER_UPDATE_PATH . $this->_lic->getFromLicenceNocVersion().'/'.$this->_lic->getChannel();
      $data = @file_get_contents($updatepath);

        if ($data) {

            $arr = json_decode($data);

            $version = Model_Version::find('last', array('order_by' => array('meta_update_time' => 'desc')));

            //update time
            $version->lastcheck = time();

            //update newer version
            if ($version->mode != $arr->version)
                $version->mode = $arr->version;

            $version->save();
            
            $this->_master_version = $version;
            
            $this->_available_version = $version->mode;
            
            
        }
        
        
    }

    /**
     * 
     * @return boolean tell frontend to check update
     */
    protected function __need_check() {

        $lastcheck = $this->_master_version['lastcheck'];

        if ($lastcheck) {
            $nextday = (24 * 60 * 60) + $lastcheck;

            return (time() > $nextday) ? true : false;
        }
        return true;
    }

    /**
     * Is new version available
     * @return boolean 
     */
    private function _warn() {

        if ($this->_is_local_upgrade())
            return true;
        if ($this->_available_version != $this->_installed_version)
            return true;

        return false;
    }

    /**
     * @return array list of upgrade data
     */
    public function check() {

        if ($this->__need_check() and !$this->_lic->isOfflineLicense())
            $this->check_remote();


        return array(
            'warn' => $this->_warn(),
            'available' => $this->_available(),
            'version' => $this->_installed_version,
            'is_local' => $this->_is_local_upgrade(),
            'master' => $this->_master_version['value'],
            'update_time' => $this->_master_version['meta_update_time'],
            'quiet' => $this->_master_version['quiet'],
            'channel'=>$this->_lic->getChannel()
        );
    }

    /**
     * migrate database and update install file
     */
    private function __upgrade_local() {

        //reload update version
        Config::load('update', true,true,true);
        $this->_updated_version = Config::get('update.version');
        
        //write new changes to install file
        Config::set('install.version', $this->_updated_version);
        Config::save('install', 'install');

        //migrate database
        $this->__migrate();

        //set new upgrade time
        $this->__set_upgrade_date();

        //send end message to frontend
        $this->_comet_echo('end', 'ok');
    }

    /**
     * @return boolean  software installed
     */
    public function is_installed() {
        return ($this->_installed_version) ? true : false;
    }

    /**
     * 
     * @return string|boolean installed version
     */
    public function getVersion() {
        return ($this->_installed_version) ? $this->_installed_version : false;
    }

    /**
     * Encrypt lic_key
     * @return type urlencode(base64(rijandel))
     */
    private function __get_decoded_key() {


        if (!class_exists('PHPSecLib\\Crypt_Rijndael', false)) {
            import('phpseclib/Crypt/Rijndael', 'vendor');
        }

        $rijndael = new \PHPSecLib\Crypt_Rijndael();

        $rijndael->setKey(self::NOCLAYER_PUBLIC_KEY);



        return urlencode(base64_encode($rijndael->encrypt($this->_lic->getKey())));
    }

    /**
     * Url of noclayer server
     * @return type url
     */
    private function __package_url() {

        return self::NOCLAYER_DOWNLOAD_URL . 'get/' . $this->_lic->getFromLicenceNocVersionId() . '/'.$this->_lic->getChannel();
    }

    /**
     * extract portion of zip archive
     * @param type $source
     * @param type $target
     * 
     */
    private function __extract_stream($source, $target) {



        for ($i = 0; $i < $this->_zip->numFiles; $i++) {
            $name = $this->_zip->getNameIndex($i);

            // Skip files not in $source
            if (strpos($name, "{$source}/") !== 0)
                continue;

            // Determine output filename (removing the $source prefix)
            $file = $target . '/' . substr($name, strlen($source) + 1);

            // Create the directories if necessary
            $dir = dirname($file);
            if (!is_dir($dir))
                mkdir($dir, 0777, true);


            //if (is_file($file)) {
                // Read from Zip and write to disk
                $fpr = $this->_zip->getStream($name);

                $fpw = fopen($file, 'w+');
                while ($data = fread($fpr, 1024)) {
                    fwrite($fpw, $data);
                }
                fclose($fpr);
                fclose($fpw);
            //}
        }
    }

    /**
     * Extract zip directory to directory on disk
     * 
     */
    private function folderToZip($folder, &$zipFile, $exclusiveLength) {
        $handle = opendir($folder);
        while ($f = readdir($handle)) {
            if ($f != '.' && $f != '..') {
                $filePath = "$folder/$f";
                // Remove prefix from file path before add to zip.
                $localPath = substr($filePath, $exclusiveLength);
                if (is_file($filePath)) {
                    $zipFile->addFile($filePath, $localPath);
                } elseif (is_dir($filePath)) {
                    // Add sub-directory.
                    $zipFile->addEmptyDir($localPath);
                    self::folderToZip($filePath, $zipFile, $exclusiveLength);
                }
            }
        }
        closedir($handle);
    }

    /**
     * Zip a folder (include itself).
     * Usage:
     *   zipDir('/path/to/sourceDir', '/path/to/out.zip');
     *
     * @param string $sourcePath Path of directory to be zip.
     * @param string $outZipPath Path of output zip file.
     */
    private function _zipDir($sourcePath, $outZipPath) {
        $pathInfo = pathInfo($sourcePath);
        $parentPath = $pathInfo['dirname'];
        $dirName = $pathInfo['basename'];

        $z = new ZipArchive();
        $res = $z->open($outZipPath, ZIPARCHIVE::CREATE);
        if ($res === TRUE) {
            $z->addEmptyDir($dirName);
            self::folderToZip($sourcePath, $z, strlen("$parentPath/"));
            $z->close();
            $this->_comet_echo('backup', 'true');
            return true;
        }
        $this->_comet_echo('backup', 'false');
        return false;
    }

    private function __extract_zip() {
        if (Fuel::$env == 'development') {
            $path = Array(
                'app' => APPPATH . 'tmp/app',
                'core' => APPPATH . 'tmp/core',
                'packages' => APPPATH . 'tmp/packages',
                'public' => APPPATH . 'tmp/public',
            );
        } else {
            $path = Array(
                'app' => APPPATH,
                'core' => COREPATH,
                'packages' => PKGPATH,
                'public' => DOCROOT,
            );
        }
       
        $this->_zip = new ZipArchive;

        $res = $this->_zip->open($this->_archive_path);
        if ($res === TRUE) {

            //app folder
            $this->__extract_stream('fuel/app', $path['app']);
            $this->_comet_echo('extract', 'fuel/app');

            //core folder
            $this->__extract_stream('fuel/core', $path['core']);
            $this->_comet_echo('extract', 'fuel/core');

            //package folder
            $this->__extract_stream('fuel/packages', $path['packages']);
            $this->_comet_echo('extract', 'fuel/packages');

            //public folder
            $this->__extract_stream('public', $path['public']);
            $this->_comet_echo('extract', 'public');

            $this->_zip->close();
            echo 'ok';
            return true;
        } else {
            return false;
            echo 'failed, code:' . $res;
        }
    }

    /**
     * calculate kb,mb,gb from bytes
     * @param integer $bytes
     * @param integer $precision
     * @return string
     * 
     */
    private function _formatBytes($bytes, $precision = 2) {
        $units = array('B', 'KB', 'MB', 'GB', 'TB');

        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);

        // Uncomment one of the following alternatives
        $bytes /= pow(1024, $pow);
        // $bytes /= (1 << (10 * $pow)); 

        return round($bytes, $precision) . ' ' . $units[$pow];
    }

    /**
     * Fetch update from server
     * @return boolean
     */
    
    private function __download_package() {

        //url from noclayer server    
        $package_url = $this->__package_url();




        //Send POST request to noclayer server, get filesize
        $file_size = file_get_contents($package_url);

        //flush size to frontend
        $this->_comet_echo("size", $file_size);

        //make post data array and pack it
        $postdata = http_build_query(
                array(
                    'key' => $this->__get_decoded_key(),
                    'var2' => 'doh'
                )
        );
        //place header data
        $opts = array('http' =>
            array(
                'method' => 'POST',
                'header' => 'Content-type: application/x-www-form-urlencoded',
                'content' => $postdata
            )
        );

        //pack content    
        $context = stream_context_create($opts);

        //open socket to server(POST encrypted data key)
        $sock = @fopen($package_url, "rb", false, $context);


        if ($sock and (int) $file_size > 1000) {

            $body = "";  //data buffer
            $down = 0;   //total bytes
            $onethen = (int) $file_size / 10; // ten % of total
            $progress = $onethen;
            $num = 0; //numerical 
            //place archive to buffer

            while (!feof($sock)) {
                $get = fgets($sock, 4096); //get 4096 bytes
                $body .=$get;
                $down+=strlen($get); //count bytes
                if ($progress < $down) {
                    $num++;
                    $progress+=$onethen;
                    //send notification to frontend
                    $this->_comet_echo("total", 'Received ' . $this->_formatBytes($down) . ' (' . ($num * 10) . ' %)');
                }
            }

            $this->_comet_echo("total", 'Received ' . $this->_formatBytes($file_size) . ' (' . (100) . ' %)');

            //close socket to server      
            fclose($sock);


            //save downloaded archive to disk      
            file_put_contents($this->_archive_path, $body);
            return true;
        }
        return false;
    }

    /** Test is APPPATH and COREPATH writeable
     * Can script write to disk
     * @return bool 
     */
    public function isWritable() {
       
        return (is_writeable(APPPATH) and is_writeable(COREPATH)) ? true : false;
    }

    /**
     * 
     * @return boolean
     * 
     */
    private function __migrate_modules() {

        $modules = Manifestreader::getDataKey('modules');

        foreach ($modules as $modul) {
            $this->_comet_echo('migrate', $modul);
            if (!\Migrate::latest($modul, 'module')) {
             //   return false;
            }
        }

        return true;
    }

 
    
    /** Migrate all to lastest version
     * 
     * @return boolean
     */
    private function __migrate() {

       
        
        //migrate nucleus 
        $this->_comet_echo('migrate', 'coredata');
        $app = Migrate::latest('default', 'app');

        //migrate moduels 
        $mod = $this->__migrate_modules();


        return ($app and $mod) ? true : false;
    }

    /**
     * @return boolean make update 
     */
    private function __makeupdate() {


        //download package from server
        if (!$this->__download_package())
            return false;

        //backup old config folder
        if (!$this->_zipDir(APPPATH . 'config', APPPATH . 'tmp/' . self::CONFIG_BACKUP))
            return false;

        //backup old license folder
        if (!$this->_zipDir(APPPATH . 'license', APPPATH . 'tmp/' . self::CONFIG_BACKUP))
            return false;

        //extract to temp directory
        if (!$this->__extract_zip())
            return false;

        //migrate and save changes
        $this->__upgrade_local();
    }

    /**
     * update database set notification visible
     */
    public function unmute() {

        $this->_master_version->quiet = 0;
        $this->_master_version->save();
    }
 
    /**
     * set notification invisible
     */
    public function mute() {

        $this->_master_version->quiet = 1;
        $this->_master_version->save();
    }
    
    /**
     * Comet echo 
     * @param type $type
     * @param type $msg
     * 
     */
    protected function _comet_echo($type, $msg) {

        echo '<script>parentWindow.warn("' . $type . '","' . $msg . '")</script><br>';

        echo str_repeat(" ", 1250);



        //@ob_flush();
        //flush();
    }

    /**
     * update database date of upgrade
     */
    private function __set_upgrade_date() {

        $this->_master_version->meta_update_time = time();
        $this->_master_version->save();
    }

    /**
     * set headers for comet
     */
    public function headers() {
        //Remove cache

        set_time_limit(0);

        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

        echo str_repeat(" ", 1250);

        //Flush all levels of the buffer to start
        while (ob_get_level())
            ob_end_flush();





        ob_implicit_flush(true);
    }

   

    public function manual(){
        header('Content-type: application/zip');
        header('Content-Disposition: attachment; filename="update.zip"'); 
        
      //url from noclayer server    
        $package_url = $this->__package_url();



        //make post data array and pack it
        $postdata = http_build_query(
                array(
                    'key' => $this->__get_decoded_key(),
                    'var2' => 'doh'
                )
        );
        //place header data
        $opts = array('http' =>
            array(
                'method' => 'POST',
                'header' => 'Content-type: application/x-www-form-urlencoded',
                'content' => $postdata
            )
        );

        //pack content    
        $context = stream_context_create($opts);

        //open socket to server(POST encrypted data key)
        $sock = @fopen($package_url, "rb", false, $context);


        if ($sock) {

            

            while (!feof($sock)) {
                echo $get = fgets($sock, 4096); //get 4096 bytes
                
            }

            

            //close socket to server      
            fclose($sock);

     
        }
    }
    
    /**
     * Autoupgrade method 
     * @return type comet echo
     * 
     */
    public function auto() {

        if ($this->_is_local_upgrade()) {
            $this->__upgrade_local();
            return true;
        }

        if ($this->isWritable()) {
            $this->_comet_echo('writeable', 'ok');
            return $this->__makeupdate();
        } else {
            $this->_comet_echo('writeable', 'no');
            return false;
        }
    }

}

?>
