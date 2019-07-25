<?php
require_once __DIR__ . "/vendor/autoload.php";
$collection = (new MongoDB\Client)->Alexa->users;
$deleteResult = $collection->deleteMany([]);
print_r($deleteResult);
?>
