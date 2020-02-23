<?php

include_once '../config/core.php';
include_once '../config/database.php';
include_once '../objects/food.php';

// class instance
$database = new Database();
$db = $database->getConnection();
$food = new Food($db);

$where = '%%';
$orderBy = 'f.item';
$orderType = 'asc';
$limit = 5;
$currentPage = 1;

if(isset($_GET['item']))
    if(!empty($_GET['item']))
        $where = '%' . $_GET['item'] . '%';

if(isset($_GET['order_by']))
    if(!empty($_GET['order_by']))
        $orderBy = $_GET['order_by'];

if(isset($_GET['order_type']))
    if(!empty($_GET['order_type']))
        $orderType = $_GET['order_type'];

if(isset($_GET['page']))
    if(!empty($_GET['page']))
        $currentPage = $_GET['page'];

if(isset($_GET['item_per_page']))
    if(!empty($_GET['item_per_page']))
        $limit = $_GET['item_per_page'];

//$results = $food->readAll();
$results = $food->paginate($where, $currentPage, $limit, $orderBy, $orderType);
// output in json format
echo $results;
