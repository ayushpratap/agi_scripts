#!/usr/bin/php -q
<?php
/**
 * @author Ayush Pratap Singh (ayushs56@gmail.com)
 */
namespace Orbit\NECTI;

require_once __DIR__.'/vendor/autoload.php';

//	Include get the configurations parameters
include_once('./config/config.php');
include_once('./includes/phpagi.php');
include_once('./includes/custom/C_Logger.php');

/**
 * Maimux execution time for this script is 30 seconds,
 * can be changed if required.
 * Enable error reporting for all errors
 */
set_time_limit(30);
error_reporting(E_ALL);

/**
 * Setting this paramter as true enables us to 
 * catch and handle the interrupt signals
 */	
pcntl_async_signals(true);

/**
 * Use the the files which are custom to this project
 */
//use Orbit\Includes\Custom\C_Logger as C_Logger;



/**
 * ----------------------------------------------------------------------------
 * 
 * ----------------------------------------------------------------------------
 */
class Core
{   
    //  Private class members
    private $_id;
    private $agi;
    private $availableAcc;
    private $avsFile;
    private $collection;
    private $db;
    private $logger;
    private $source;
    private $recordFileName;
    private $requestFileName;
    private $responseFileName;
    private $token;
    private $tokenFileName;
    private $uniqueId;

//----------------------- CONSTRUCTOR ------------------------------------------    

	function __construct(array $params)
	{
        //  Setup the signal handling
        pcntl_signal(SIGTERM, [$this, 'signalHandler']);
        pcntl_signal(SIGHUP, [$this, 'signalHandler']);
        pcntl_signal(SIGINT, [$this, 'signalHandler']);
        pcntl_signal(SIGQUIT, [$this, 'signalHandler']);
        pcntl_signal(SIGUSR1, [$this, 'signalHandler']);
        pcntl_signal(SIGUSR2, [$this, 'signalHandler']);
        pcntl_signal(SIGALRM, [$this, 'signalHandler']);

        //  Set the logger
        $this->setLogger($params['fileName'],$params['loggerName']);

        //  Get the AGI object
        $this->setAgi();	
        
        //  Setup the connection to database
        $this->connectDB();

        /**
         *  Check if the caller already exists in DB.
         *  If caller already exists in db then
         *  Hangup the call and terminate the script.
         *  If caller do not exists in database then
         *  set the $source, $uniquieId, $recordFileName
         *  $availableAcc
         */
        if($this->existsInDB())
        {
            $agi = $this->getAgi();
            // Play user exists error message
            $agi->hangup();
            exit(EXIT_MESSAGE);
        }
        else
        {
            //  Set the current call details in database
            $this->setInDb();

            //  Run the token script for current call
            $this->runToken();

            //  Set the $token for current call
            $this->setToken();

            //  Set $uniquieId for current call
            $this->setUniqueId();

            //  Set $source for current call
            $this->setSource();

            //  Set the recording filename for current call
            $this->setRecFileName();
        }
    }

//---------------------- START GETTERS & SETTERS -------------------------------
    /**
     * @desc This function is used to set the AGI() instance
     * @return self
     */
    private function setAgi()
    {
        $this->agi = new AGI();
        return $this;
    }

    /**
     * @desc This function is used to 
     *       get the AGI() instance
     *
     * @return void
     */
    public function getAgi()
    {
        return $this->agi;
    }

    /**
     * @desc This function is used to set the value of _id of
     *       account used to initiate connection with AVS
     * @param string $_id 
     * @return self
     */
    private function setId(string $_id)
    {
        $this->_id = $_id;
        return $this;
    }

    /**
     * @desc This function is used to get the value of _id of 
     *       the account used to initiate connection with AVS
     * @return string
     */
    private function getId()
    {
        return $this->_id;
    }

    /**
     * @desc This function is used to 
     *       get the available account
     *       used for the current call
     * @return array
     */
    private function getAvailableAcc()
    {
        return $this->getCollection()->findOne([
            'is_available'  =>  1
        ]);
    }

    /**
     * @desc This function is used to set
     *       the available account for 
     *       the current call
     * @param object $availableAcc
     * @return self
     */
    private function setAvailableAcc(object $availableAcc)
    {
        $this->availableAcc = $availableAcc;
        return $this;
    }

    /**
     * @desc This function is used to set the
     *       file which contains the access token
     * @param string $avsFile 
     * @return self
     */
    private function setAvsFile(string $avsFile)
    {
        $this->avsFile = $avsFile;
        return $this;
    }
    /**
     * @desc This function sets the filename 
     *       which contains the AVS access token
     * @return string
     */
    private function getAvsFile()
    {
        return $this->avsFile;
    }
    /**
     * @desc This function is used to 
     *       set the database collection 
     *       to be used
     *
     * @param object $db
     * @return self
     */
    private function setCollection($db)
    {
        // 'mapping' is the name of collections
        $this->collection = $db->mapping;
        return $this;
    }

    /**
     * @desc This function is used to get the 
     *       database collection to be used
     *
     * @return void
     */
    private function getCollection()
    {
        return $this->collection;
    }
    /**
     * @desc This function is used to get 
     *       the database connection
     * @return void
     */
    private function getDb()
    {
        return $this->db;
    }

    /**
     * @desc This function is used to set 
     *       the database connection
     * @param object $db
     * @return self
     */
    private function setDb($db)
    {
        $this->db = $db;
        return $this;
    }

    /**
     * @desc This function is used to set the logger
     * @param string $fileName
     * @param string $loggerName
     * @return self
     */
    private function setLogger(string $fileName,string $loggerName)
    {
        echo("private function setLogger");
        $this->logger = new C_Logger($fileName,$loggerName);
        return $this;
    }

    /**
     * @desc This function is used to get the logger
     * @return void
     */
    private function getLogger()
    {
        return $this->logger;
    }

    /**
     * @desc This function extracts 
     *       the 'agi_calleridname' 
     *       and set it as the source 
     *       address of the incoming call
     *
     * @return self
     */
    private function setSource()
    {
        //  Set the source addres of the incoming call
        $this->source = (int)$agi->request['agi_calleridname'];
        return $this;
    }

    /**
     * @desc This function is used 
     *       to get the source address 
     *       of the incoming call
     *
     * @return int
     */
    private function getSource()
    {
        //  Return the source address of the incoming call
        return $this->source;
    }

    /**
     * @desc This function is used to set 
     *       file name which will be used 
     *       for recording the audio
     * @return self
     */
    private function setRecFileName()
    {
        //  Prefix of the record file name
        $prefix = $this->getSource();
        return $this;

        //  Set the recording filename
        $this->recordFileName = TMP_DIR.$prefix.'_'.REC_FILE_NAME;
    }

    private function getRecFileName()
    {
        return $this->recordFileName;
    }

    private function setRequestFileName()
    {
        $prefix = $this->getSource();
        $this->requestFileName = TMP_DIR.$prefix.'_'.REQ_FILE_NAME;
    }
    private function getRequestFileName()
    {
        return $this->requestFileName;
    }
    /**
     * @desc This function is used to get the file name
     *       which will contain the response of the
     *       request made to Alexa Voice Services
     * @return String
     */
    private function getResponseFileName()
    {
        return $this->responseFileName;
    }
    /**
     * @desc This function is used to set the file name
     *       which will contain the response of the 
     *       request made to Alexa Voice Services
     * @return self
     */
    private function setResponseFileName()
    {
        //  Prefix of the record file name
        $prefix = getSource();

        //  Set the response filename
        $this->responseFileName = TMP_DIR.$prefix.'_'.RES_FILE_NAME;
        return $this;
    }

    /**
     * @desc This functions set the access token 
     *       for this call which is used to 
     *       authorize the request with 
     *       alexa voice service (AVS)
     * @return self
     */
    private function setToken()
    {
        /**
         * Read the avs file corresponding to this
         * call and get the avs token for this call
         */
        $avsFile = $this->getAvsFile();
        $path = TMP_DIR.$avsFile;
        $this->token = file_get_contents($path);
        return $this;
    }

    /**
     * @desc This function is used to get the access token
     *       which will be used to authenticate the
     *       request sent to Alexa Voice Services
     * @return type
     */
    private function getToken()
    {
        return $this->token;
    }

    /**
     * @desc This function is used to set the file name
     *       which would have to be ran to generate
     *       corresponding avs file
     * @param string $tokenFileName 
     * @return self
     */
    private function setTokenFileName(string $tokenFileName)
    {
        $this->tokenFileName = $tokenFileName;
        return $this;
    }

    /**
     * @desc This function is used to get the name 
     *       of token file which will be used to
     *       get the avs token for this call
     * @return string
     */
    private function getTokenFileName()
    {
        return $this->tokenFileName;
    }

    /**
     * @desc This function extracts the 'agi_uniqueid' 
     *       and set it for the incoming call
     *
     * @return self
     */
    private function setUniqueId()
    {
        //  Set the uniqueId of the incoming call
        $this->uniqueId = (int)$agi->request['agi_uniqueid'];
        return $this;
    }

    /**
     * This function is used to get the uniqueId of the incoming call
     *
     * @return int
     */
    public function getUniqueId()
    {
        //  Return the uniqueId of the incoming call
        return $this->uniqueId;
    }
//---------------------- END GETTERS & SETTERS ---------------------------------
    /**
     * @desc This function runs the pearl script
     *       which will generate avs token and 
     *       will keep it in /tmp/ of the system
     * @return type
     */
    private function runToken()
    {
        //$command = TOKEN_FILE_DIR.$this->getTokenFileName();
        $command = TMP_DIR.$this->getTokenFileName();
        shell_exec($command);
    }

    
    
    /**
     * @desc This function is used to setup the 
     *       connection to the database
     * @return void
     */
	private function connectDB()
	{
        //  Setup connection to the database
        $connection = new MongoDB\Client(DB_URL);
        
        //  Set the database to be used
        //  setDb($connection->DB_NAME);
        // 'local' is the database name
        $this->setDb($connection->local);

        //  Set the collection to be used
        $this->setCollection($this->getDb());
	}

    /**
     * @desc This function is used to check if the 
     *       $source already exists in the database
     * @return bool
     */
    private function existsInDB()
    {
        /**
         * Search if $source exists in database
         * If it already exists in database then
         * retrun true
         * If it do not exists in database then
         * retrun false
         */
        $collection = $this->getCollection();
        $source     = $this->getSource();
        $return     = true;
        $result     = $collection->findOne(['source' => $source]);
        if(!(is_null($result))) //  Incoming source is already exists in database
        {
            $this->logger->error('User already exists in database');
            //$return = false;
            $return = true;
        }
        else    //  Incoming source does not exists in database
        {
            $this->logger->info('User does not exists in database');
            //$return = true;
            $return = false;
        }
        return $return;
    }

    private function setInDb()
    {        
        /**
         * Get the available account from database
         * If no account is available then end the
         * script. 
         * If account is available then update that 
         * account with information of current call.
         */
        $acc = $this->getAvailableAcc();
        if(is_null($acc))
        {
            //  No accounts are available
            $this->logger->info('No accounts are available , end the script');

            //  End the script
            die('No accounts are available');
        }
        else
        {
            //  Set the available account
            $this->setAvailableAcc($acc);

            //  Update the available account with information of current call
            $this->updateAvailableAcc();

        }
    }

    /**
     * @desc This function is used to update 
     *       the available account with the 
     *       information of current call
     * @return void
     */
    private function updateAvailableAcc()
    {
        /**
         * Update the source and is_available
         * fields of available account with 
         * the detials of current call
         */
        
        //  Set the avs for this call
        $acc = $this->getAvailableAcc();
        $avsFile = $acc['avs_file'];
        $this->setAvsFile($avsFile);
        $result = $this->getCollection()->updateOne(
                    [
                        '_id'   =>  $this->getId()
                    ],
                    [
                        '$set'  =>  [
                                        'is_available'  =>  0,
                                        'source'    =>  $this->getSource()
                                    ]
                ]);
    }

    
    
    
    /** 
     * @desc This function is used to record
     *       the audio from the current call.
     * @return void
     */
    private function recordeAudio()
    {
        $this->getLogger()->info('Start the recording of the call audio');
        $this->agi->record_file(
            $this->getRecFileName(),
            SLN,
            ESCAPE_DIGIT,
            TIMEOUT,
            OFFSET,
            BEEP,
            SILENCE
        );
    }

    /**
     * Description
     * @param int $playback 
     * @return type
     */
    private function playbackAudio(int $playback)
    {
        $logger = $this->getLogger();
        $logger->info('Start the playback of the audio');
        switch ($playback) {
            case 'THANK_YOU':
                $logger->info('Play thank you');
                $audioFileToBePlayed = THANK_YOU_FILE;

                //  Play the file
                $this->audioPlayback($audioFileToBePlayed);
            break;
            
            case 'RESPONSE':
                
                //  Parse the response obtained from AVS and 
                //  get the file which is to be played
                $audioFileToBePlayed = $this->praseResponse();
                $logger->info('Play the response');
                //  Play the file
                $this->audioPlayback($audioFileToBePlayed);

            default:
                exit('Error : trying wrong case');
                break;
        }
    }

    /**
     * Description
     * @param string $filename 
     * @return void
     */
    private function audioPlayback(string $filename)
    {
        $this->logger->info('Playing back the audio');
        $agi = getAgi();
        $result = $agi->stream_file(
                    $filename,
                    ESCAPE_DIGIT,
                    OFFSET
                );
    }
    /**
     * Description
     * @return type
     */
    private function praseResponse()
    {
        $file = $this->getResponseFileName();
        
        //  Read the reponse file
        $data = file_get_contents($file);

        //  Split the data using the SPLIT_TERM
        $splitedData = explode(SPLIT_TERM,$data);
        $source = $this->getSource();
        //  Create an empty file
        $tmpFile = TMP_DIR.$source.'_'.TMP_FILE.DAT;
        $fp = fopen($tmpFile,"w");
        fwrite($fp,$splitedData[1]);    //  Write data to tmp file
        fclose($fp);

        //  Remove the empaty lines
        $lines = file($tmpFile);
        $lastLine = sizeof($lines)-1;
        unset($lines[$lastLine]);
        unset($lines[0]);
        unset($lines[1]);

        //  Create tmp mp3 file
        $tmpMp3 = TMP_DIR.$source.'_'.TMP_FILE.MP3;
        $fp = fopen($tmpMp3,"w");
        fwrite($fp,implode("",$lines));
        fclose($fp);

        //  Convert mp3 to wav
        $tmpWav = TMP_DIR.$source.'_'.TMP_FILE.WAV;
        $command = "mpg123 -w".$tmpMp3." ".$tmpWav;
        $this->shell($command);

        //  Change the permision of wav response file
        $command = "chmod 777 ".$tmpWav;
        $this->shell($command);
        
        //  Change the rate of the file corresponding to asterisk support
        $playfile = TMP_DIR.$source."_".TMP_FILE."_play".WAV;
        $command = SOX.$tmpWav.SOX_PLAY_CONVERT.$playfile;
        $this->shell($command);

        //  Return the file response file name which is to be played
        return $playfile;
    }

    /**
     * Description
     * @param string $command 
     * @return type
     */
    private function shell(string $command)
    {
        shell_exec($command);
    }

    public function signalHandler($signalNumber)
    {
        $this->handleInterrupt();
    }

    private function handleInterrupt()
    {
        $this->cleanupDB();
    }
    public function cleanupDB()
    {
        $collection = $this->getCollection();
        $acc = $this->getAvailableAcc();
        $collection->updateOne(
            [
                'call_id' => $acc['_id']
            ],
            [
                '$set' => [
                            'is_available' => 1,
                            'source_extension'=> 0000
                        ]
            ]);

            //  Change the permission of the files
            $mode = 0777;
            chmod($this->getAvsFile(),$mode);
            chmod($this->getRecFileName(),$mode);
            chmod($this->getRequestFileName(),$mode);
            chmod($this->getResponseFileName(),$mode);
            chmod($this->getTokenFileName(),$mode);

            //  Clear the files
            unlink($this->getAvsFile());
            unlink($this->getRecFileName());
            unlink($this->getRequestFileName());
            unlink($this->getResponseFileName());
            unlink($this->getTokenFileName());
    }

    /**
     * @desc This function is used to convert the 
     *       audio recorded by asterisk in SLN 
     *       format to WAV format the in the 
     *       format which AVS dictates
     * @return void
     */
    private function encodeSLNtoWAV()
    {
        $slnFile = getRecFileName().SLN;
        $wavFile = getRecFileName().WAV;
        $command = SOX.$slnFile.SOX_AVS_ENCODE.$wavFile;
        $this->shell($command);

        //  To change the permission of newly created WAV file
        $command = "chmod 777 ".$wavFile;
        $this->shell($command);
    }

    private function createRequest()
    {
        /**
         * Create the meta data
         * add boundary terms
         * read audio data
         * append audio data to existing meta data
         * add boundary term
         * save this request to file
         */

        //  Get the metadata
         $metaData = $this->createMetadata();
        
        //  Get the audio data
         $audioData = $this->getAudioData();
        
        //  Get the request file name
         $reqFile = $this->getRequestFileName();

        //  Create the equest data
         $reqData = BOUNDARY_TERM;
         $reqData .= '\n';
         $reqData .= 'Content-Disposition: form-data; name="metadata"';
         $reqData .= '\n';
         $reqData .= 'Content-Type: application/json; charset=UTF-8';
         $reqData .= '\n';

        // Add metadata
        $reqData .= $metaData;
        $reqData .= '\n';
        $reqData .= BOUNDARY_TERM;
        $reqData .= '\n';
        $reqData .= 'Content-Disposition: form-data; name="audio"';
        $reqData .= '\n';
        $reqData .= 'Content-Type: application/octet-stream';
        $reqData .= '\n';

        //  Add audiodata
        $reqData .= $audioData;
        $reqData .= '\n';
        $reqData .= BOUNDARY_END;

        //  Write the metadata to the request file
        file_put_contents($reqFile,$reqData);
    }

    private function getAudioData()
    {
        $audioFile = $this->getRecFileName();
        $audioData = file_get_contents($audioFile);
        return $audioData;
    }
    private function createMetadata()
    {
        //  Create empty object
        $obj = new stdClass();
        
        //  Add event data to the object
        $obj->event = $this->createEventData();

        //  Add context data to the object
        $obj->context = $this->createContextData();

        //  Encode this object to JSON
        $obj = json_encode($obj,JSON_PRETTY_PRINT);

        //  Return the json encoded object
        return $metadata;
    }

    private function createEventData()
    {
        /**
         * "event": {
         *   "header": {
         *      "dialogRequestId": "dialogRequestId-155144a4-7caa-4d02-be8c-fc30ba647276",
         *      "namespace": "SpeechRecognizer",
         *      "name": "Recognize",
         *      "messageId": "dad784bc-09d9-4994-88f6-b711b2ca1810"
         *   },
         *  "payload": {
         *      "profile": "CLOSE_TALK",
         *      "format": "AUDIO_L16_RATE_16000_CHANNELS_1"
         *   }
         *  },
         */
        $dialogRequestId = null;
        $namespace = null;
        $name = null;
        $messageId = null;

        $profile = null;
        $format = null;
        $event = array(
            "header"=>array(
                "dialogRequestId"=>$dialogRequestId,
                "namespace"=>$namespace,
                "name"=>$name,
                "messageId"=>$messageId
            ),
            "payload"=>array(
                "profile"=>$profile,
                "format"=>$format
            )
        );
        return $event;
    }

    private function createContextData()
    {
        $namespace = null;
        $name = null;
        $token = null;
        $playerActivity = null;
        $offsetInMilliseconds = null;
        $context = array(
            "header"=>array(
                "namespace"=>$namespace,
                "name"=>$name
            ),
            "payload"=>array(
                "token"=>$token,
                "playerActivity"=>$playerActivity,
                "offsetInMilliseconds"=>$offsetInMilliseconds
            )
        );
        return [$context];
    }

    private function makeRequest()
    {
        $responseFileName = $this->responseFileName();
        $accessToken = $this->getToken();
        $reqFile = $this->getRequestFileName();
        //$command = 'curl --http2 -s -X POST --output '.$responseFileName.' -H "authorization: Bearer"';
        $command = 'curl --http2 -s -X POST --output '.$responseFileName.' -H "authorization: Bearer '.$accessToken.'" -H "content-type: multipart/form-data; boundary='.BOUNDARY_TERM.'" --data-binary @'.$reqFile.' '.ALEXA_URL;
    }
//----------------------------- END OF CLASS ----------------------------------
}


/**
 * This array contains the parameters 
 * which are required to initiate 
 * the object of CORE class
 */
$params = array(
    'fileName' => '/tmp/coreLogs.json',
    'loggerName' => 'core'
);

//  Get the instance of CORE
$core = new Core($params);

//  Get the logger to start creating logs
$logger = $core->getLogger();

$logger->info('Starting up the script');


while(1)
{
    $logger->info('Loop started');
    $core->recordeAudio();
    $core->playbackAudio(THANK_YOU);
    $core->encodeSLNtoWAV();
    $core->createRequest();
    $core->makeRequest();
    $core->playbackAudio(RESPONSE);
    $ocre->playbackAudio(THANK_YOU);
}
?>
