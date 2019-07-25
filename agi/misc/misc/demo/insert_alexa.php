<?php
require_once __DIR__ . "/vendor/autoload.php";
// Connect to db
$connection = new MongoDB\Client('mongodb://127.0.0.1:27017/');
define('DB_NAME','local');
define('DB_COLLECTION','users');
$db = $connection->local;
$collection = $db->users;

$deleteResult = $collection->deleteMany([]);
$insertManyResult = $collection->insertMany([
  [
    '_id' => 1,
    'Name' => 'john',
    'Extension' => '2800',
    'Mobile_Number'  => '0000000000',
  ],
  [
    '_id' => 2,
    'Name' => 'steve',
    'Extension' => '2801',
    'Mobile_Number'  => '0000000000',
  ],
  [
    '_id' => 3,
    'Name' => 'bob',
    'Extension' => '3036',
    'Mobile_Number'  => '0000000000',
  ]
]);


var_dump($insertManyResult->getInsertedIds());
?>
