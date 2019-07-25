<?php
function event()
{
    $event = array(
        "header"=>array(
            "dialogRequestId"=>123,
            "namespace"=>"namespaceEVENT",
            "name"=>"nameEVENT",
            "messageId"=>"messageIdEVENT"
        ),
        "payload"=>array(
            "profile"=>"profileEVENT",
            "format"=>"formatEVENT"
        )
    );
    return $event;
}
function context()
{
    $context = array(
        "header"=>array(
            "namespace"=>"AudioPlayerCONTEXT",
            "name"=>"PlaybackStateCONTEXT"
        ),
        "payload"=>array(
            "token"=>"",
            "playerActivity"=>"IDLE",
            "offsetInMilliseconds"=>"0"
        )
    );
    return [$context];
}
function meta(){
$dialogRequestId = 1234;
$nameSpace = "SpeechRecognizer";
$name="Recognize";
$messageId="dad784bc-09d9-4994-88f6-b711b2ca1810";
$profile="CLOSE_TALK";
$format="AUDIO_L16_RATE_16000_CHANNELS_1";
$context = array(
    "header"=>array(
        "namespace"=>"AudioPlayer",
        "name"=>"PlaybackState"
    ),
    "payload"=>array(
        "token"=>"",
        "playerActivity"=>"IDLE",
        "offsetInMilliseconds"=>"0"
    )
);
$obj = array(
    "event"=>array(
        "header"=>array(
            "dialogRequestId"=>$dialogRequestId,
            "namespace"=>$nameSpace,
            "name"=>$name,
            "messageId"=>$messageId
        ),
        "payload"=>array(
            "profile"=>$profile,
            "format"=>$format
        )
    ),
    "context"=>[$context]
);
$obj = json_encode($obj,JSON_PRETTY_PRINT);

//$obj2 = array();
$obj2 = new stdClass();
$obj2->event = event();
$obj2->context = context();
$obj2 = json_encode($obj2,JSON_PRETTY_PRINT);
return $obj2;
}


$res = meta();
echo $res;
?>
