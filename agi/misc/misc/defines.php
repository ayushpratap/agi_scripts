<?php
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
?>