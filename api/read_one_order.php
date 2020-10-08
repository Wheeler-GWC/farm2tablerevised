<?php
include_once '../config/core.php';
include_once '../config/database.php';
include_once '../objects/order.php';

$last_id = $_POST['lastId'];
$database = new Database();
$db = $database->getConnection();
$order = new Order($db);
$order->id = $last_id;
$results = $order->readOneWithDetails();
echo $results;