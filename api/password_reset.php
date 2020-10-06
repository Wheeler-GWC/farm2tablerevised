<?php
if($_POST) {
    include_once '../config/core.php';
    include_once '../config/database.php';
    include_once '../objects/user.php';

    $database = new Database();
    $db = $database->getConnection();
    $user = new User($db);
    $errors = [];

    $email = $_POST['email'];
    if (empty($email)) {
        echo "Your email is required";
    } else {
        $user->email = $email;
        $result = $user->getUserByEmail();
        if($result) {
            try {
                $token = bin2hex(random_bytes(50));
                $user->token = $token;
                $user->insertIntoPasswordResets();
                $to = $email;
                $subject = "Reset your password on whsfarm2table.org";
                $msg = "Hi there, click on this <a href=\"" . $database->site . "/#reset?token=" . $token . "\">link</a> to reset your password on our site";
                $msg = wordwrap($msg,70);
                $headers = "From: noreply@whsfarm2table.org";
                mail($to, $subject, $msg, $headers);
                $response = 1;
            }
            catch(Exception $e) {
                $response = 0;
            }
        }
    }
    echo $response;
}