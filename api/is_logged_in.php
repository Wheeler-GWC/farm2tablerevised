<?php
include_once '../config/core.php';
include_once '../config/database.php';
include_once '../objects/user.php';

session_start();

$result = 'false';
if(isset($_SESSION['id'])) {
    $result = "true";
}
echo $result;