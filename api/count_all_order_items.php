<?php
include_once '../config/core.php';
include_once '../config/database.php';
include_once '../objects/order.php';

$database = new Database();
$db = $database->getConnection();
$order = new Order($db);

$where = '%%';
$orderBy = 'o.item';
$orderType = 'asc';
$limit = 5;
$currentPage = 1;

if(isset($_GET['item']))
    if(!empty($_GET['item']))
        $where = '%' . $_GET['item'] . '%';

$results = $order->count_items($where);
echo $results;