<?php
require_once __DIR__ . "/vendor/autoload.php";
// Connect to db
$collection = (new MongoDB\Client)->amazon_accounts->account_mapping;
$insertManyResult = $collection->insertMany([
  [
    '_id' => 1,
    'email_id' => 'ayushs56@gmail.com',
    'token_file' => 'token.pl',
    'avs_file'  => 'token.avs',
    '_userId' => 'amzn1.ask.account.AHGDMLTSSI3SFU752PBM76C7DCKT7C7EZTJL7ZOCTKSS576DBOREQ355QQVHCZJBH2A7SS2LW3EZHMTW5K5B7JOMQNWXAPQXYT2VEX6REKLOZCTLAZM7IPZWMZ3CCZRBTR5DHEUH2D6RRTUMXF453QRPGRYZNDRO77U6ZYM2XACPNGJE6VT6KR6MYYAWKHCAZ7EYDBV57DJ3ANQ',
    'source_extension' => 0000,
    'is_available' => 1
  ],
  [
    '_id' => 2,
    'email_id' => 'aps00707@gmail.com',
    'token_file' => 'token_007.pl',
    'avs_file'  =>  'token_007.avs',
    '_userId' => 'amzn1.ask.account.AE6IL2GAO7Z46A6EGEZVBXNLY3KWIYSZP2GGRJVNBULOX7YVXPOEOMLXUDX3GGNS7WDLTNGCSW5FC7T37GC7PGSHF45OZR2KHQWDQTDVJP4WF3U2QLIBCN3J6I45XPIAZADQTBOYTTMSOZPMALXVGFOIZRD66DHI2CCWGDC3GODACQV6SZAZKZRS23AQKDEM4LM5ZSZYI45XBBY',
    'source_extension' => 0000,
    'is_available' => 1
  ]
]);
var_dump($insertManyResult->getInsertedIds());
?>
