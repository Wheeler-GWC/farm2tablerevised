<?php
include_once '../config/core.php';
include_once '../config/database.php';
include_once '../objects/food.php';

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

$results = $food->count($where);
echo $results;