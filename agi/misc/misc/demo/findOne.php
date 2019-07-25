<?php
require_once __DIR__ . "/vendor/autoload.php";
$collection = (new MongoDB\Client)->amazon_accounts->account_mapping;
$document = $collection->findOne(['is_available' => 1000]);
//echo $document['email_id'],"\n";
if(!(is_null($document)))
{
	echo "Sahi khel gaya\n";
}
else
{
	echo "Oh shit\n";
}
var_dump($document);
?>
