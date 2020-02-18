<?php
if($_POST){
    include_once '../config/core.php';
    include_once '../config/database.php';
    include_once '../objects/food.php';

    $database = new Database();
    $db = $database->getConnection();
    $food = new Food($db);

    $ins = "";
    foreach($_POST['del_ids'] as $id){
        $ins.="{$id},";
    }
    $ins = trim($ins, ",");
    echo $food->delete($ins) ? "true" : "false";
}