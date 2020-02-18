<?php
include_once '../config/core.php';
include_once '../config/database.php';
include_once '../objects/food.php';

$database = new Database();
$db = $database->getConnection();
$food = new Food($db);
$food->id=$_POST['id'];
$results=$food->readOne();

echo $results;