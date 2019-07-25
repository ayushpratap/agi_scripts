<?php
shell_exec("/home/alexa-vm/Desktop/goliath/asterisk_alexa_agi/token.pl");
$token = file_get_contents("/tmp/token.avs");
define('AUTH','authorization: Bearer '.$token);
$id = rand(100,999);
$audio_player = array(
		'header'=>array(
			'namespace'=>"AudioPlayer",
			'name'=>"PlaybackState"
		),
		'payload'=>array(
			'token'=>"abcd1234",
			'offsetInMilliseconds'=>7000,
			'playerActivity'=>"PLAYING"
		)
	);
$alerts = array(
		'header'=>array(
			'namespace'=>"Alerts",
			'name'=>"AlertsState"
		),
		'payload'=>array(
			'allAlerts'=>[
				'token'=>"foo-bar",
				'type'=>"ALARM",
				'scheduledTime'=>'2018-09-30T22:34:51+00:00'
			],
			'activeAlerts'=>[]
		)
	);
$speaker = array(
		'header'=>array(
			'namespace'=>'Speaker',
			'name'=>'VolumeState'
		),
		'payload'=>array(
			'volume'=>25,
			'muted'=>false
		)
	);
$speechsynthesizer = array(
		'header'=>array(
			'namespace'=>"SpeechSynthesizer",
			'name'=>"SpeechState"
		),
		'payload'=>array(
			'token'=>"zxcv8523",
			'offsetInMilliseconds'=>0,
			'playerActivity'=>"FINISHED"
		)
	);

$context = array();
array_push($context,$audio_player,$alerts,$speaker,$speechsynthesizer);
$event = array(
		'header'=>array(
			'namespace'=>"SpeechRecognizer",
			'name'=>"Recognize",
			'messageId'=>"messageId-".$id,
			'dialogRequestId'=>"dialogRequestId-".$id
			),
		'payload'=>array(
			'profile'=>"CLOSE_TALK",
			'format'=>"AUDIO_L16_RATE_16000_CHANNELS_1",
			)
		);
$obj->context = $context;
$obj->event = $event;
$boundaryTerm = rand(1000000000,9999999999);
$boundaryDelimiter = '----------';
$boundary = $boundaryDelimiter.$boundaryTerm;
$boundaryEnd = $boundary.'--';
$json = json_encode($obj,JSON_PRETTY_PRINT);
$audioData = file_get_contents("/home/alexa-vm/Desktop/goliath/asterisk_alexa_agi/req_res/open_nec_server.wav");
//$EOF = '\n\r';
$data = $boundary.PHP_EOL;
$data .= 'Content-Disposition: form-data; name="metadata"'.PHP_EOL;
$data .= 'Content-Type: application/json; charset=UTF-8\n'.PHP_EOL;
$data .= $json.PHP_EOL;
$data .= $boundary.PHP_EOL;
$data .= 'Content-Disposition: form-data; name="audio"'.PHP_EOL;
$data .= 'Content-Type: application/octet-stream'.PHP_EOL;
$audioData = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123012308794654d31xv1x3x3v54d6vf54d3fgv132sd1f0sdaw165we44f65s4d65sdf6s4d79';
$data .= $audioData.PHP_EOL;
$data .= $boundaryEnd.PHP_EOL;
$metadata = "Content-Type: application/json; charset=UTF-8".PHP_EOL.$json;
$audio = "Content-Type: application/octet-stream".PHP_EOL.$audioData;

$postData = array(
	'metadata' => $metadata,
	'audio'	=>	$audio
);
$ch = curl_init();
$headers = array();
$headers[] = AUTH;
//$headers[] = "content-type = multipart/form-data; boundary=".$boundary;
$endPoint = "http://requestbin.fullcontact.com/z28zibz2";
#$endPoint = "https://avs-alexa-eu.amazon.com/v20160207/events";
curl_setopt($ch,CURLOPT_VERBOSE,true);
curl_setopt($ch,CURLOPT_HTTP_VERSION,CURL_HTTP_VERSION_2_0);
curl_setopt($ch,CURLOPT_URL,$endPoint);
curl_setopt($ch,CURLOPT_HTTPHEADER,$headers);
curl_setopt($ch,CURLINFO_HEADER_OUT,true);
curl_setopt($ch,CURLOPT_POST,true);
curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
curl_setopt($ch,CURLOPT_READFUNCTION,'readFunc');
function readFunc($ch,$fp,$len)
{
	static $pos = 0;  
    global $data;    
    $str = substr($data, $pos, $len);     
    $pos += strlen($str);     
    return $str;
}
//curl_setopt($ch,CURLOPT_POSTFIELDS,$postData);
$result = curl_exec($ch);
echo "\n\n============================ RESULT ===============================\n\n";
print_r($result);
echo "\n\n============================ HEADERS ==============================\n\n";
$info = curl_getinfo($ch);
print_r($info['request_header']);
curl_close($ch);
?>
