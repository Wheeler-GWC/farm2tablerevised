<?php
include_once '../config/core.php';
include_once '../config/database.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
require '../vendor/autoload.php';

// function sendEmail($orderResult) {
//     $msg = "You have placed an order at: "; //. $orderResult->created_at;
//     mail("mattaecole@gmail.com","My subject",$msg);
// }

// $msg = "You have placed an order at: "; //. $orderResult->created_at;
// $headers = "From: webmaster@example.com";
// mail("mattaecole@gmail.com","My subject",$msg);
$mail = new PHPMailer();

try {
    //Recipients
    $mail->setFrom('wheeler@gmail.com', 'Wheeler');
    $mail->addAddress('mattaecole@gmail.com');     // Add a recipient

    // Content
    $mail->isHTML(true);                                  // Set email format to HTML
    $mail->Subject = 'Here is the subject';
    $mail->Body    = 'This is the HTML message body <b>in bold!</b>';
    $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

    $mail->send();
    echo 'Message has been sent';
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}