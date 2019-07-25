<?php
$url = "https://www.amazon.com/ap/oa?";
$client_id = "amzn1.application-oa2-client.c899b6675aaa44b59d650b9f5b793a4b";
$scope = "alexa:all";
$productID = "ACIPPB2D3SE0C";
$deviceSerialNumber = "abc1234";
$response_type = "code";
$redirect_uri = "https://10.0.97.220:5000/code";
$scope_data = array(
    $scope => array(
        "productID" => $productID,
        "productInstanceAttributes" => array(
            "deviceSerialNumber" => $deviceSerialNumber
        )));
$scope_data_json = json_encode($scope_data);
//echo $scope_data_json;
$url = $url."client_id=".$client_id."&scope=".urlencode($scope)."&scope_data=".urlencode($scope_data_json)."&response_type=".$response_type."&redirect_uri=".urlencode($redirect_uri);
echo $url;
/*
const authUrl = `https://www.amazon.com/ap/oa?client_id=${this._clientId}&scope=${encodeURIComponent(scope)}&scope_data=${encodeURIComponent(JSON.stringify(scopeData))}&response_type=${responseType}&redirect_uri=${encodeURI(this._redirectUri)}`
*/
/*

*/
?>
