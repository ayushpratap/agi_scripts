<?php
require_once __DIR__ .'../vendor/autoload.php';

//	Get the instace
$dotenv = Dotenv\Dotenv::create(__DIR__);

//	Load the enviroment variables
$dotenv->load();

//	Get the url to connect to the database
define('DB_URL', env('DB_URL','mongodb://34.199.158.57:27017/'));

//	Get the database name to be used
define('DB_NAME',env('DB_NAME','local'));

//  Get the collection which is to be used
define('DB_COLLECTION',env('DB_COLLECTION','mapping'));

//	Get the exit message of the script
define('EXIT_MESSAGE',env('EXIT_MESSAGE','User already exists in database'));

//	Basename of the recording file
define('REC_FILE_NAME',env('REC_FILE_NAME','ReqAudioFile'));

//  Basename if the final request file
define('REQ_FILE_NAME',env('REQ_FILE_NAME','ReqFile.dat'));

//	Basename of the file which contains the response from AVS
define('RES_FILE_NAME',env('RES_FILE_NAME','responseFile'));

//	Temp directory path
define('TMP_DIR',env('TMP_DIR','/tmp/'));

//	Format in which asterisk will record the audio
define('SLN',env('SLN','sln'));

//	Ecapse digit, user can stop recording by pressing this key
define('ESCAPE_DIGIT',env('ESCAPE_DIGIT','#'));

//	This is the amount of time for which the recording will go on, -1 idinicates infinite recording 
define('TIMEOUT',env('ESCAPE_DIGIT',-1));

define('OFFSET',env('OFFSET',NULL));

//	This prameter is used to toggle between beep sound on or off when starting the recording
define('BEEP',env('BEEP',true));

//	This is the amount of silnce in seconds which is when detected the recording will stop automatically
define('SILENCE',env('SILENCE',2));

define('SPLIT_TERM',env('SPLIT_TERM','application/octet-stream'));

define('TMP_FILE',env('TMP_FILE','tmp_file'));

define('DAT',env('DAT','.dat'));

define('MP3',env('MP3','.mp3'));

define('WAV',env('WAV','.wav'));

define('THANK_YOU_FILE',env('THANK_YOU_FILE','/usr/share/asterisk/sounds/en/auth-thankyou'));

define('SOX_PLAY_CONVERT',env('SOX_PLAY_CONVERT'," -r 8000 "));

define('SOX_AVS_ENCODE',env('SOX_AVS_ENCODE'," -b 16 -e signed-integer -r 16000 -L "));

define('SOX',env('SOX',"/usr/bin/sox "));

define('BOUNDARY_TERM',env('BOUNDARY_TERM',"--boundary12345"));

define('BOUNDARY_END',env('BOUNDARY_END',"--boundary12345--"));

define('ALEXA_URL',env('ALEXA_URL',"https://avs-alexa-eu.amazon.com/v20160207/events"));
?>