<?php
include_once '../config/core.php';
include_once '../config/database.php';
include_once '../objects/order.php';

try {
    $userEmail = $_POST['userEmail'];
    $orderTime = $_POST['orderTime'];
    $emailContent = $_POST['emailContent'];

    $to = $userEmail;
    $subject = "WHS Farm2Table Order Confirmation";
    $msg = "Hello, this email is confirming your order placed on ";
    $msg .= $orderTime;
    $msg .= " for the following items: \n\n\n";
    $msg .= $emailContent;
    $msg .= "\n\nOur volunteers will be doing their best to fulfill this for you.";
    $msg = wordwrap($msg,70);
    $headers = "From: noreply@whsfarm2table.org" . "\r\n";
    $headers  = 'MIME-Version: 1.0' . "\r\n";
    $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
    mail($to, $subject, $msg, $headers);
    $response = 1;
    echo 'Message has been sent';
} catch (Exception $e) {
    echo "Message could not be sent.";
}