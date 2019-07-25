<?php
//------------------------------------------------------------------------------
// Includes
//------------------------------------------------------------------------------
require_once __DIR__ . "../vendor/autoload.php";
require('phpagi.php');


//------------------------------------------------------------------------------
//  Macros
//------------------------------------------------------------------------------
define('TOKEN', '/tmp/token.avs');
define('FILE','request_audio');
define('FORMAT',array('sln','wav'));
define('ESCAPE_DIGITS','#');
define('TIMEOUT',-1);
define('OFFSET',NULL);
define('BEEP',true);
define('SILENCE',2);
define('THANK_YOU','/usr/share/asterisk/sounds/en/auth-thankyou');
define('SOX','/usr/bin/sox ');
define('ENCODING',' -b 16 -e signed-integer -r 16000 -L ');
define('BOUNDARY_TERM','boundary12345');
define('END_TERM','--');
define('DB_CONNECT','mongodb://localhost:27017');
define('DB_NAME','amazon_accounts');
define('DB_COLLECTION','account_mapping');
define('ACCOUNTS',array(
  'ayushs56@gmail.com' => 'token.pl',
  'aps00707@gmail.com' => 'token_007.pl'
));
define('BASE_URL',"https://avs-alexa-eu.amazon.com/");
define('STATE',array(
  'NET_STATE_IDLE'=>0,
  'NET_STATE_PING'=>1,
  'NET_STATE_SEND_EVENT'=>2,
  'NET_STATE_SEND_STATE'=>3
));

/**
 *
 */
class CORE
{
//------------------------------------------------------------------------------
// Class members
//------------------------------------------------------------------------------
  private $agi;
  private $token;
  private $recorded_audio_file;
  private $uniqueId;
  private $source;
  private $file;
  private $dbClinet;
  private $dbCollection;
  private $SyncSateJson;
  public $coreLog;


//------------------------------------------------------------------------------
// Class methods
//------------------------------------------------------------------------------
  function __construct()
  {
    setCoreLog(); // Set the logger for current file
    setAGI(); // Set the PHPAGI object
    setUniqueId();  // Set the uniqueId
    setcalleridName();  // Set the calleridName
    setFiles(); // Set the file names
    connectDB();  // Connect to database
    setToken(); // Set the token for calleridName
  }
  public function getLogger($DIR)
  {
    return (new Katzgrau\KLogger\Logger($DIR.'/logs'));
  }
  


    /**
     * @return mixed
     */
    public function getCoreLog()
    {
        return $this->coreLog;
    }

    /**
     * @return self
     */
    public function setCoreLog($coreLog)
    {
        $this->coreLog = new Katzgrau\KLogger\Logger();

        return $this;
    }
}
?>
