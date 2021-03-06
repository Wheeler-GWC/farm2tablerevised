<?php
if($_POST){

    include_once '../config/core.php';
    include_once '../config/database.php';
    include_once '../objects/user.php';

    $database = new Database();
    $db = $database->getConnection();
    $user = new User($db);

    $result = 'true';
    if(is_null($_POST['email']) || empty($_POST['email'])) {
        $result = "The email field is required.";
    } else if(!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
        $result = "The email is invalid.";
    } else if(is_null($_POST['password']) || empty($_POST['password'])) {
        $result = "The password field is required.";
    } else if(is_null($_POST['password_confirmation']) || empty($_POST['password_confirmation'])) {
        $result = "The password confirmation field is required.";
    } else if($_POST['password_confirmation'] != $_POST['password']) {
        $result = "The password confirmation did not match.";
    } else {
        $user->email = $_POST['email'];
        $user->password = $_POST['password'];
        $user->is_admin = false;
        $result = $user->create();
    }

    echo $result;
}