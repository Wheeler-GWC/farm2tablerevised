<?php
if($_POST){
    include_once '../config/core.php';
    include_once '../config/database.php';
    include_once '../objects/user.php';

    $database = new Database();
    $db = $database->getConnection();
    $user = new User($db);

    $msg = 'true';
    $result = null;
    if(is_null($_POST['email']) || empty($_POST['email'])) {
        $msg = "The email field is required.";
    } else if(!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
        $msg = "The email is invalid.";
    } else if(is_null($_POST['password']) || empty($_POST['password'])) {
        $msg = "The password field is required.";
    } else {
        $user->email = $_POST['email'];
        $user->password = $_POST['password'];
        $obj = $user->auth();
        $result = $obj;
        if($obj != null)
            $msg = 'true';
        else
            $msg = 'Invalid email / password';
    }

    $data = [
        'message'   => $msg,
        'user'      => $result
    ];

    echo json_encode($data);
}