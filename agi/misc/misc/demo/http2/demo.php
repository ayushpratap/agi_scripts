<?php
use MyCLabs\Enum\Enum;
define('HANDLECOUNT',3);
define('DOWN_HANDLE', 0);
define('PING_HANDLE', 1);
define('EVENT_HANDLE', 2);
define('DEL_HTTPHEAD_EXPECT',"Expect:");
define('DEL_HTTPHEAD_ACCEPT',"Accept:");
define('token',"");
define('NET_STATE_PING',0);
define('NET_STATE_SEND_STATE',1);
define('NET_STATE_SEND_EVENT',2);
define('NET_STATE_IDLE',3);
define('NORMAL_EVENT',0);
define('EXPECT_SPEECH',1);
define('SYNCHRONIZESTATE',2);
define('AUTH',"authorization: Bearer ".TOKEN);
$state = 0;
$delimiter = "---";
$boundaryTerm = "boundary12345";
$boundary = $delimiter.$boundaryTerm;
$endTerm = $boundary."--";
$eol = "\r\n";

class States extends Enum{
	private const NET_STATE_IDLE = 0;
	private const NET_STATE_PING = 1;
	private const NET_STATE_SEND_EVENT = 2;
	private const NET_STATE_SEND_STATE = 3;
}
function downData($ch,$data){
	echo "DOWN DATA\n";
	var_dump($data);
	return strlen($data);
}

function create_json_context()
{
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
	return $context;
}
function create_json_event($type)
{
	$id = rand(100,999);
	switch($type)
	{
		case NORMAL_EVENT:
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
		return $event;
		break;
		case EXPECT_SPEECH:
		return "NOT YET";
		break;
		case SYNCHRONIZESTATE:
		$event = array(
			'header'=>array(
				'namespace'=>"System",
				'name'=>"SynchronizeState",
				'messageId'=>"messageId-".$id
			),
			'payload'=>array()
		);
		return $event;
		break;
	}
}

function create_data($data,$line)
{
	$data = $data.$line.$eol;
	return $data;
}
function readFunc($ch,$fp,$len)
{
	static $pos = 0;
	global $data;
	$str = substr($data,$pos,$len);
	$pos += strlen($str);
	return $str;
}
function headFunc($ch,$header_lines)
{
	global $headers_curl_res;
	$headers_curl_res[] = $header_lines;
	var_dump($headers_curl_res);
	return strlen($header_lines);
}
$mh = curl_multi_init();
for($i = 0;$i < HANDLECOUNT; $i++)
{
	$handles[] = $ch = curl_init();
}

/*
	send audio cfg
*/
	
	
	
	
	
	
	
	
	
	curl_setopt($handles[EVENT_HANDLE],CURLOPT_POST,true);
	curl_setopt($handles[]);
	curl_setopt($handles[EVENT_HANDLE],CURLOPT_URL,"https://avs-alexa-eu.amazon.com/v20160207/events");
	curl_multi_add_handle($mh,$handles[EVENT_HANDLE]);
//==================================================

/*
	downchannel audio cfg
*/
	curl_setopt($handles[DOWN_HANDLE],CURLOPT_VERBOSE,true);
	curl_setopt($handles[DOWN_HANDLE],CURLOPT_HTTP_VERSION,CURL_HTTP_VERSION_2_0);
	$downHeaders[] = DEL_HTTPHEAD_ACCEPT;
	$downHeaders[] = "Path: /v20160207/directives";
	$downHeaders[] = AUTH;
	$downHeaders[] = "Host: avs-alexa-eu.amazon.com";
	curl_setopt($handles[DOWN_HANDLE],CURLOPT_HTTPHEADER,$downHeaders);
	curl_setopt($handles[DOWN_HANDLE],CURLINFO_HEADER_OUT,true);
	curl_setopt($handles[DOWN_HANDLE],CURLOPT_URL,"https://avs-alexa-eu.amazon.com/v20160207/directives");
	curl_setopt($handles[DOWN_HANDLE],CURLOPT_WRITEFUNCTION,downData);
	curl_multi_add_handle($mh,$handles[DOWN_HANDLE]);
//==================================================

/*
	ping cfg
*/
	curl_setopt($handles[PING_HANDLE],CURLOPT_VERBOSE,true);
	curl_setopt($handles[PING_HANDLE],CURLOPT_HTTP_VERSION,CURL_HTTP_VERSION_2_0);
	$pingHeader[] = DEL_HTTPHEAD_ACCEPT;
	$pingHeader[] = "Path: /ping";
	$pingHeader[] = AUTH;
	$pingHeader[] = "Host: avs-alexa-eu.amazon.com";
	curl_setopt($handles[PING_HANDLE],CURLOPT_HTTPHEADER,$pingHeader);
	curl_setopt($handles[PING_HANDLE],CURLINFO_HEADER_OUT,true);
	curl_setopt($handles[PING_HANDLE],CURLOPT_URL,"https://avs-alexa-eu.amazon.com/ping");
	curl_multi_add_handle($mh,$handles[PING_HANDLE]);
//==================================================
	curl_multi_setopt($mh, CURLMOPT_PIPELINING, CURLPIPE_MULTIPLEX);
	curl_multi_setopt($mh, CURLMOPT_MAX_HOST_CONNECTIONS, 1);

	do{
		switch ($state) {
			case NET_STATE_PING:
			# code...
			break;
			case NET_STATE_SEND_STATE:
				$context = create_json_context();
				$event = create_json_event(SYNCHRONIZESTATE);
				$obj->context=$context;
				$obj->event=$event;
				$json = json_encode($obj);
				$data = '';
				$data = create_data($data,$boundary);
				$data = create_data($data,'Content-Disposition: form-data; name="metadata"');
				$data = create_data($data,'Content-Type: application/json; charset=UTF-8');
				$data = create_data($data,'');
				$data = create_data($data,$json);
				$data = create_data($data,$eol);
				$data = create_data($data,$endTerm);
				curl_setopt($handles[EVENT_HANDLE],CURLOPT_VERBOSE, true);
				curl_setopt($handles[EVENT_HANDLE],CURLOPT_HTTP_VERSION,CURL_HTTP_VERSION_2_0);
				curl_setopt($handles[EVENT_HANDLE],CURLINFO_HEADER_OUT,true);
				curl_setopt($handles[EVENT_HANDLE],CURLOPT_RETURNTRANSFER,true);
				$evenHeaders[] = AUTH;
				$evenHeaders[] = "content-type: multipart/form-data; boundary=".$boundary;
				curl_setopt($handles[EVENT_HANDLE],CURLOPT_HTTPHEADER,$evenHeaders);
				/*
				curl_setopt($handles[EVENT_HANDLE],CURLOPT_READFUNCTION,'readFunc');
				curl_setopt($handles[EVENT_HANDLE],CURLOPT_HEADERFUNCTION,'headFunc');
				*/





			default:
			# code...
			break;
		}

	}while(1);
	?>