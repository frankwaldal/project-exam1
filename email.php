<?php
$name = strip_tags(utf8_decode($_POST['name']));
$email = $_POST['email'];
$message = strip_tags(utf8_decode($_POST['message']));

$emailcontent =" From: $name \n Message: $message";
$recipient = "fed@fwaldal.no";
$subject = "Inquiery from $name";
$mailheader = "From: $email";

mail($recipient, $subject, $emailcontent, $mailheader) or die("We are sorry, the email was not sent.");
?>
