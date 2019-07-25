<?php
require_once __DIR__ . "/vendor/autoload.php";
$connection = new MongoDB\Client('mongodb://127.0.0.1:27017/');
define('DB_NAME','local');
define('DB_COLLECTION','mapping');
$db = $connection->local;
$collection = $db->mapping;
//print_r($collection);
echo "\n";
$deleteResult = $collection->deleteMany([]);
$insertManyResult = $collection->insertMany([
  [
    '_id' => 1,
    'email_id' => 'ayushs56@gmail.com',
    'token_file' => 'token.pl',
    'avs_file'  => 'token.avs',
    'userId' => 'amzn1.ask.account.AHOLWRRKAIPG6ERWS77GSRJ323PWMCZHD2J2ZQMI5U3W47XYIBHGEUIL6KYMJ54BXCRY572E5VWWJEHDQJ3UDOYBKFQYRVRP5XP7GPCVBLBZ6SDYDDMJMRP5I33EOHDUAVKTQVMVLMDZGMFEW5C4IHAEOVVFRJT42BRQ3OJ23DSPATMJAUUSSX7WFEUV3NXTLHZZQQZTVBZJS3Y',
    'source' => 0000,
    'is_available' => 1
  ],
  [
    '_id' => 2,
    'email_id' => 'aps00707@gmail.com',
    'token_file' => 'token_007.pl',
    'avs_file'  =>  'token_007.avs',
    'userId' => 'amzn1.ask.account.AE6IL2GAO7Z46A6EGEZVBXNLY3KWIYSZP2GGRJVNBULOX7YVXPOEOMLXUDX3GGNS7WDLTNGCSW5FC7T37GC7PGSHF45OZR2KHQWDQTDVJP4WF3U2QLIBCN3J6I45XPIAZADQTBOYTTMSOZPMALXVGFOIZRD66DHI2CCWGDC3GODACQV6SZAZKZRS23AQKDEM4LM5ZSZYI45XBBY',
    'source' => 0000,
    'is_available' => 1
  ]
]);
var_dump($insertManyResult->getInsertedIds());
?>
