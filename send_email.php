<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $message = $_POST['message'];

    $to = "dylankavundama@gmail.com";
    $subject = "New Contact Form Submission";
    $body = "Name: $name\nEmail: $email\nPhone: $phone\n\n$message";

    if (mail($to, $subject, $body)) {
        echo '<script>alert("Your message has been sent. Thank you!"); window.location.href = "contact.html";</script>';
    } else {
        echo '<script>alert("There was a problem sending your message. Please try again later."); window.location.href = "contact.html";</script>';
    }
} else {
    echo '<script>alert("Method not allowed."); window.location.href = "contact.html";</script>';
}
?>
