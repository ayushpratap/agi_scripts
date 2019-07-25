<?php
define('DOWN_HANDLE',0);
define('PING_HANDLE',1);
define('EVENT_HANDLE',2);
define('HANDLECOUNT',3);
define('DEL_HTTPHEAD_ACCEPT', "Accept:");
define('DEL_HTTPHEAD_EXPECT', "Expect:");
$down_str = '';

function write_down($ch,$str_down)
{
    $length = strlen($str_down);
    $down_str = $str_down;
    return $length;
}
function down_cfg($ch)
{
    curl_setopt($ch, CURLOPT_VERBOSE, TRUE);
    curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_2_0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        DEL_HTTPHEAD_ACCEPT,
        "Path: /v20160207/directives",
        "Authorization:Bearer ",
        "Host: avs-alexa-eu.amazon.com"
    ));
    curl_setopt($ch, CURLOPT_URL, "https://avs-alexa-eu.amazon.com/v20160207/directives");
    curl_setopt($ch, CURLOPT_WRITEFUNCTION,'wirte_down');
}

function audio_cfg($ch)
{
    curl_setopt($ch , CURLOPT_VERBOSE, TRUE);
    curl_setopt($ch , CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_2_0 );
    $headers[] = DEL_HTTPHEAD_ACCEPT;
    $headers[] = DEL_HTTPHEAD_EXPECT;
    $headers[] = "Path: /v20160207/events";
    $headers[] = "Authorization:Bearer ";
    $headers[] = "Content-type: multipart/form-data";
    $headers[] = "Host: avs-alexa-eu.amazon.com";
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_URL, "https://avs-alexa-eu.amazon.com/v20160207/directives");
}

function ping_cfg($ch)
{

}
$mh = curl_multi_init();
$handles = array();
for($i = 0 ; $i<HANDLECOUNT; )
{
    $handles[$i] = curl_init();
    $i = $i+1;
}
///// SETOPT PING



?>
