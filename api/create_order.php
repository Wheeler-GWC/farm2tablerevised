<?php
if($_POST){
    include_once '../config/core.php';
    include_once '../config/database.php';
    include_once '../objects/order.php';

    $database = new Database();
    $db = $database->getConnection();
    $order = new Order($db);

    $result;
    $order->items = json_decode($_POST['items'], false);
    $order->userId = $_POST['userId'];

    try {
        $last_id = $order->create();

        for ($i = 0; $i < count($order->items); $i++) {
            $order->last_id = $last_id;
            $order->item = $order->items[$i];
            $order->item_id = $order->item->id;
            $order->quantity = $order->item->quantity;
            if ($order->create_items()) {
                $result = true;
            } else {
                $result = false;
            }
        }
    }
    catch(PDOException $exception){
        $result = false;
    }

    echo $result;
}