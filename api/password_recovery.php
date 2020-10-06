<?php 
if($_POST) {
    include_once '../config/core.php';
    include_once '../config/database.php';
    include_once '../objects/user.php';
    include_once '../ChromePhp.php';

    //ChromePhp::log($_POST['token']);

    $database = new Database();
    $db = $database->getConnection();
    $user = new User($db);

    $result = 'true';
    if(is_null($_POST['password']) || empty($_POST['password'])) {
        $result = "The password field is required.";
    } else if(is_null($_POST['password_confirmation']) || empty($_POST['password_confirmation'])) {
        $result = "The password confirmation field is required.";
    } else if($_POST['password_confirmation'] != $_POST['password']) {
        $result = "The password confirmation did not match.";
    } else {
        $new_pass = $_POST['password'];
        $new_pass_c = $_POST['password_confirmation'];

        $token = $_POST['token'];
        if (empty($new_pass) || empty($new_pass_c)) array_push($errors, "Password is required");
        if ($new_pass !== $new_pass_c) array_push($errors, "Password do not match");
        if (count($errors) == 0) {
            $user->token = $token;
            $obj = $user->getEmailByToken();
            $email = json_decode($obj)[0];
            if (!empty($email)) {
                $user->email = $email;
                $user->password = $new_pass;
                $obj = $user->update();
                $result = $obj;
            } else {
                array_push($errors, "Password do not match");
            }
        }
    }
    ChromePhp::log($result);
    echo $result;
}