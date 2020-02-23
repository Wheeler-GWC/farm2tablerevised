<?php
if($_POST){
    include_once '../config/core.php';
    include_once '../config/database.php';
    include_once '../objects/order.php';

    $database = new Database();
    $db = $database->getConnection();
    $order = new Order($db);
    $order->id=$_POST['order_id'];
    echo $order->fulfill() ? "true" : "false";
}