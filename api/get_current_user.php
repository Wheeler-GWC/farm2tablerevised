<?php

session_start();

include_once '../config/core.php';
include_once '../config/database.php';
include_once '../objects/user.php';

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

$userObject = '';

if(isset($_SESSION['id'])) {
    $user->id = $_SESSION['id'];
    $userObject = $user->readOne();
}
echo $userObject;