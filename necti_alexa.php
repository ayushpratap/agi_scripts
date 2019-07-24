#!/usr/bin/php -q
<?php
set_time_limit(30);	//  Maimux execution time for this script is 30 seconds,						// can be changed if required

require('phpagi.php');	// Include the PHPAGI
require_once __DIR__ . "/vendor/autoload.php";
error_reporting(E_ALL);	// Set the error reporting to all ERRORS

/**---------------------------------------------------------------------------- 
*	Custom functions
**/
function getTextBetweenTags($string, $tagname)
 {
    $pattern = "/<$tagname>(.*?)<\/$tagname>/";
    preg_match($pattern, $string, $matches);
    return $matches[1];
 }
//-----------------------------------------------------------------------------

$agi = new AGI();	// Get the instace of PHPAGI
$agi->answer();	//  Answer the channel
#	Get the uniqueId for the current call
$uId = (int)($agi->request['agi_uniqueid']);
$calleridName = ($agi->request['agi_calleridname']); // TODO get calleridname

// Set code and source extension in DB
$connection = new MongoDB\Client('mongodb://127.0.0.1:27017/');
$db = $connection->local;
$collection = $db->users;

$tmpDir = '/tmp/';

#	Start the recording of user's request

$file = '/tmp/request_audio'.$uId;	// Path to the file in which audio will be recorded
$format = "sln";	// Format of the $file
$escape_digits = "#";	// Audio recording can be interrupted by pressing "#" key
$timeout = -1;	// Maximum amount of time for which audio should be recorded , -1 for no limit
$offset = NULL;	// Offset is set to NULL
$beep = true;	// If beep is true, a beep will be played to user before start of the recodring
$silence = 1;	// Amount of silence after which recording should stop
$record_resutlt = $agi->record_file($file,$format,$escape_digits,$timeout,$offset,$beep,$silence);	// Call the PHPAGI function to record the audio

#	Playback thank you message

$thank_filename = "/usr/share/asterisk/sounds/en/auth-thankyou";	// Path to file.extension which is to be payed back to the user
$thank_escape_digits = "#";	// Audio playback can be interrupted by pressing "#" key
$thank_offset = NULL;	// Offset is set to NULL
$thank_playback_result = $agi->stream_file($thank_filename,$thank_escape_digits,$thank_offset);	// Play the audio by calling stream_file function of PHPAGI

#	Encode sln audio file to wav

$encoding_command = "/usr/bin/sox ".$file.".sln -b 16 -e signed-integer -r 16000 -L ".$file.".wav";
shell_exec($encoding_command);
shell_exec("chmod 777 ".$file.".wav");

#	Send to julius

$sampleConfPath = "/home/alexa-vm/Downloads/julius/Sample.jconf";      //first model (NAME : BOB,STEVE,YOUNG) {OLD}

#	Create filelist file

$tempFileList = $file."_filelist.txt";
$fp = fopen($tempFileList,"w");
fwrite($fp,$file.".wav");
fclose($fp);
shell_exec("chmod 777 ".$tempFileList);
$command = "julius -input rawfile -filelist ".$tempFileList." -C ".$sampleConfPath." -outfile";
shell_exec($command);

#	Parse julius response

$outfile = $file.".out";
$outdata = file_get_contents($outfile);
$speechToText = getTextBetweenTags($outdata,"s");
$split = explode(" ",$speechToText);
$operation = $split[1];
$username = $split[2];
#	Search the username in database

// Convert to lowercase
$username = strtolower($username);
$result = $collection->findOne(['Name' => $username]);
$destination = $result['Extension'];

//$agi->exec('Goto',$destination);

#	If user exists then send the HTTP request to client service

//curl example : curl -d '{"source":"112",","destination":"111"} ' -H "Content-Type: application/json" -X POST http://127.0.0.1:8443/api/makeCall
//heredoc string for curl command
/*
$cmd = <<<TEXT
curl -d '{"source":"
TEXT;
$cmd .= $calleridName;
$cmd .= <<<TEXT
","destination":"
TEXT;
$cmd .= $destination;
$cmd .= <<<TEXT
"}' -H "Content-Type: application/json" -X POST http://127.0.0.1:8443/api/makeCall
TEXT;
$res=shell_exec($cmd);
*/

#	call transfer

//$agi->exec('Goto',"sv9100-exten,".$destination.",1");
$agi->exec('DIAL',"SIP/10.0.97.35/".$destination.",60");



// Else play sorry audio
?>
