<?php
if($_POST){

    include_once '../config/core.php';
    include_once '../config/database.php';
    include_once '../objects/food.php';

    $database = new Database();
    $db = $database->getConnection();
    $food = new Food($db);

    $result = 'true';
    if(is_null($_POST['item']) || empty($_POST['item'])) {
        $result = "The food item name must be filled.";
    } else if(is_null($_POST['quantity']) || empty($_POST['quantity'])) {
        $result = "The quantity must be filled.";
    } else {
        $food->id = $_POST['id'];
        $food->item = $_POST['item'];
        $food->quantity = $_POST['quantity'];
        $food->expire_date = $_POST['expire_date'];
        $result = $food->update() ? "true" : 'false';
    }
    echo $result;
}
