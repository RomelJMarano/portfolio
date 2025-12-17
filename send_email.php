<?php
// Import PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Load Composer's autoloader
require 'vendor/autoload.php';

header('Content-Type: application/json');

// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display errors to user
ini_set('log_errors', 1);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}

// Get and validate form data
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
    exit;
}

// Create PHPMailer instance
$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'mromel0624@gmail.com';           // Your Gmail
    $mail->Password   = 'sjou tnno ksna rrwn';            // Your App Password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    
    // Optional: Enable debug output (comment out in production)
    // $mail->SMTPDebug = 2;
    // $mail->Debugoutput = function($str, $level) {
    //     error_log("SMTP Debug level $level; message: $str");
    // };

    // Recipients
    // IMPORTANT: Gmail requires the "From" address to be your authenticated email
    $mail->setFrom('mromel0624@gmail.com', 'Portfolio Website');
    $mail->addAddress('mromel0624@gmail.com', 'Romel Maraño');  // Where you receive emails
    $mail->addReplyTo($email, $name);  // This allows you to reply directly to the sender

    // Content
    $mail->isHTML(true);
    $mail->Subject = "Portfolio Contact: " . $subject;
    
    // HTML email body
    $mail->Body = "
        <html>
        <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
            <div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;'>
                <h2 style='color: #00ff88; border-bottom: 2px solid #00ff88; padding-bottom: 10px;'>
                    New Contact Form Submission
                </h2>
                <div style='margin: 20px 0;'>
                    <p><strong>From:</strong> {$name}</p>
                    <p><strong>Email:</strong> <a href='mailto:{$email}'>{$email}</a></p>
                    <p><strong>Subject:</strong> {$subject}</p>
                </div>
                <div style='background: #f5f5f5; padding: 15px; border-left: 4px solid #00ff88;'>
                    <p><strong>Message:</strong></p>
                    <p>" . nl2br(htmlspecialchars($message)) . "</p>
                </div>
                <div style='margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #888; font-size: 12px;'>
                    <p>This email was sent from your portfolio contact form.</p>
                    <p>To reply, just click the reply button in your email client.</p>
                </div>
            </div>
        </body>
        </html>
    ";
    
    // Plain text version for email clients that don't support HTML
    $mail->AltBody = "New Contact Form Submission\n\n" .
                     "From: {$name}\n" .
                     "Email: {$email}\n" .
                     "Subject: {$subject}\n\n" .
                     "Message:\n{$message}\n\n" .
                     "---\n" .
                     "This email was sent from your portfolio contact form.";

    // Send email
    $mail->send();
    
    echo json_encode([
        'success' => true, 
        'message' => 'Thank you for reaching out! I will get back to you soon.'
    ]);
    
} catch (Exception $e) {
    // Log the actual error for debugging
    error_log("PHPMailer Error: " . $mail->ErrorInfo);
    
    // Return user-friendly error message
    echo json_encode([
        'success' => false, 
        'message' => 'Failed to send message. Please try again later or email me directly at mromel0624@gmail.com'
    ]);
}
?>