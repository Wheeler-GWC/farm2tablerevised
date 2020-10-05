<?php
include_once '../config/core.php';
include_once '../config/database.php';
include_once '../objects/order.php';
include_once './send_email.php';

function getOrderDetails($last_id) {
    // $database = new Database();
    // $db = $database->getConnection();
    // $order = new Order($db);
    // $order->id=$last_id;
    // $results=$order->readOne();

    // sendEmail($results);
    sendEmail();
}