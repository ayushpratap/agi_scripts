<?php
require_once __DIR__ . "/vendor/autoload.php";
$collection = (new MongoDB\Client)->amazon_accounts->account_mapping;
$result = $collection->find(['is_available'=>1]);
/*foreach ($result as $doc) {
  print_r($doc);
  echo "\n";
}*/
print_r($result);
?>
