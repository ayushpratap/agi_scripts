<?php
/*

$core = new CORE();

//	Get the logger
$logger = $core->getLogger(__DIR__);

// Start loop
$logger->info('Starting the loop');
while(){
	$core->addToDatabase();
}

#	Get the AVS TOKEN
// Set code and source extension in DB
$collection = (new MongoDB\Client)->amazon_accounts->account_mapping;

$numberResult = $collection->findOne(['source_extension' => $calleridName]);
if(!(is_null($numberResult)))
{
$call_id = $numberResult['_id'];
$result = $collection->updateOne(['call_id' => $_id],['$set' => ['is_available' => 1,'source_extension'=> $calleridName]]);
//    die("Number is in use");
}
$result = $collection->findOne(['is_available' => 1]);
if(is_null($result))
{
//    die('No account available');

    /**
     * @return mixed
     */
    /*
    public function getDb()
    {
        return $this->db;
    }

    /**
     * @param mixed $db
     *
     * @return self
     */
    /*
    public function setDb($db)
    {
        $this->db = $db;

        return $this;
    }
}
$tokenFile = $result['token_file'];
$avsFile = $result['avs_file'];
$token = file_get_contents($tokenFile);
$_id = $result['_id'];
$result = $collection->updateOne(['_id' => $_id],['$set' => ['is_available' => 0,'source_extension'=> $calleridName]]);
shell_exec("/home/alexa-vm/".$tokenFile);
$access_token = file_get_contents("/tmp/".$avsFile);


$tmpDir = '/tmp/';

#	Start the recording of user's request
$file = '/tmp/request_audio'.$uId;	// Path to the file in which audio will be recorded
$agi->conlog($file,1);
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


$audio_file_name = $file.".wav";
$audio_data = file_get_contents($audio_file_name);
$request_template = file_get_contents("/home/alexa-vm/request_template.dat");
$boundary_term = "boundary12345";
$boundary_end = "--".$boundary_term."--";
$request_data = $request_template;
$request_data = $request_data.$audio_data;
$request_data = $request_data."\n"; //adding a new line at the end
$request_data = $request_data.$boundary_end;
$response_data_file = $file."_response.dat";

file_put_contents($file.".dat",$request_data);
$request_url = "https://avs-alexa-eu.amazon.com/v20160207/events";
$request_command = 'curl --http2 -s -X POST --output '.$response_data_file.' -H "authorization: Bearer '.$access_token.'" -H "content-type: multipart/form-data; boundary='.$boundary_term.'" --data-binary @'.$file.'.dat '.$request_url;
$agi->conlog($request_command,1);
//Make request
shell_exec($request_command);
shell_exec("chmod 777 ".$response_data_file);
// Parse response
$split_term = "application/octet-stream";
//Read the file
$content_response = file_get_contents($response_data_file);
//Split the file
$split = explode($split_term,$content_response);
//Remove the empyt lines
$tempfile = "/tmp/temp_".$uId.".dat";
$fp = fopen($tempfile,"w");
fwrite($fp,$split[1]);
fclose($fp);
$lines = file($tempfile);
$last_line = sizeof($lines)-1;
unset($lines[$last_line]);
unset($lines[0]);
unset($lines[1]);
$temp_response = "/tmp/response".$uId;
$fp = fopen($temp_response.".mp3","w");
fwrite($fp,implode("",$lines));
fclose($fp);
//Stream response
shell_exec("mpg123 -w ".$temp_response.".wav ".$temp_response.".mp3");
shell_exec("chmod 777 ".$temp_response.".wav");
shell_exec("sox ".$temp_response.".wav -r 8000 ".$temp_response."_play.wav");
$agi->stream_file($temp_response."_play",$escape_digits,$offset);
$collection->updateOne(['_id' => $_id],['$set' => ['is_available' => 1,'source_extension'=> 0000]]);
//$result = $collection->updateOne(['_id' => $_id],['$set' => ['is_available' => 1,'source_extension'=>0]]);
/*shell_exec("rm ".$file.".sln");
print_r("rm ".$file.".sln");
shell_exec("rm ".$file.".wav");
shell_exec("rm ".$file.".dat");
shell_exec("rm ".$file."_response.dat");
shell_exec("rm ".$response_data_file);
shell_exec("rm ".$tempfile);
shell_exec("rm ".$temp_response.".mp3");
shell_exec("rm ".$temp_response.".wav");
shell_exec("rm ".$temp_response."_play.wav");
*/