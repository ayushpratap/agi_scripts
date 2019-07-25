<?php
require_once __DIR__ . "/vendor/autoload.php";
$collection = (new MongoDB\Client)->amazon_accounts->account_mapping;
$result = $collection->updateOne(
  ['_id' => 1],
  ['$set' => [
    'is_available' => 1
    ]]);

//    printf("Matched %d document(s)\n", $updateResult->getMatchedCount());
  //  printf("Modified %d document(s)\n", $updateResult->getModifiedCount());
?>
