<?php
if($POST) {
    include_once '../config/core.php';
    include_once '../config/database.php';
    include_once '../objects/user.php';

    $database = new Database();
    $db = $database->getConnection();
    $user = new User($db);

    $email = $POST['email'];
    if (empty($email)) {
        array_push($errors, "Your email is required");
    } else {
        $user->email = $email;
        $results = $user->getUserByEmail();
        if(mysqli_num_rows($results) <= 0) {
            array_push($errors, "Sorry, no user exists on our system with that email");
        } else {
            $token = bin2hex(random_bytes(50));
            if (count($errors) == 0) {
                $user->insertIntoPasswordResets();

                // $to = $email;
                // $subject = "Reset your password on whsfarm2table.org";
                // $msg = "Hi there, click on this <a href=\"new_password.php?token=" . $token . "\">link</a> to reset your password on our site";
                // $msg = wordwrap($msg,70);
                // $headers = "From: noreply@whsfarm2table.org";
                // mail($to, $subject, $msg, $headers);
                // header('location: pending.php?email=' . $email);
            }
        }
    }
}