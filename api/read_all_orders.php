<?php
include_once '../config/core.php';
include_once '../config/database.php';
include_once '../objects/order.php';

// class instance
$database = new Database();
$db = $database->getConnection();
$order = new Order($db);

$results = $order->readAllWithDetails();
// output in json format
echo $results;