<?php
namespace PortoContactForm;

// do not output anything before sending JSON
header('Content-Type: application/json; charset=utf-8');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// load composer autoload or PHPMailer requires (adjust paths)
require __DIR__ . '/php-mailer/src/Exception.php';
require __DIR__ . '/php-mailer/src/PHPMailer.php';
require __DIR__ . '/php-mailer/src/SMTP.php';

try {
    // Use filter_input matching your form's field names (Name, Email, phone, message)
   // name and message: keep HTML entities escaped
$form_name = trim((string) filter_input(INPUT_POST, 'name', FILTER_SANITIZE_FULL_SPECIAL_CHARS));
$contact_email = trim((string) filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL));

// phone: keep only digits, plus, spaces, parentheses and dash
$raw_phone = trim((string) filter_input(INPUT_POST, 'phone', FILTER_DEFAULT));
$contact_phone = preg_replace('/[^0-9+\-\(\) ]+/', '', $raw_phone);

// message: escape special chars, preserve newlines
$raw_message = trim((string) filter_input(INPUT_POST, 'message', FILTER_DEFAULT));
$contact_message = htmlspecialchars($raw_message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

$recaptcha_response = isset($_POST['g-recaptcha-response']) ? trim((string) $_POST['g-recaptcha-response']) : '';

    // Basic validation
    if (!$contact_email || !filter_var($contact_email, FILTER_VALIDATE_EMAIL)) {
        throw new \Exception('Invalid email address');
    }
    if (!$form_name || !$contact_message) {
        throw new \Exception('Name and message are required');
    }
    if (strlen($contact_message) > 500) {
        throw new \Exception('Message too long');
    }
    if (preg_match('/http|www|\.com|\.org|\.net/i', $contact_message) || strtoupper($contact_message) === $contact_message) {
        throw new \Exception('Invalid message content');
    }

    // reCAPTCHA verify via cURL (more reliable than file_get_contents)
    $recaptcha_secret = '6LcYUO0rAAAAAAsUSAHWZ2gEQOXuRaT009QtLyPh';
    if (!$recaptcha_response) {
        throw new \Exception('Please complete the reCAPTCHA');
    }

    $ch = curl_init('https://www.google.com/recaptcha/api/siteverify');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'secret' => $recaptcha_secret,
        'response' => $recaptcha_response,
        'remoteip' => $_SERVER['REMOTE_ADDR'] ?? ''
    ]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    $verifyResponse = curl_exec($ch);
    $curlErr = curl_error($ch);
    curl_close($ch);

    if ($curlErr || !$verifyResponse) {
        throw new \Exception('reCAPTCHA verification failed (network).');
    }

    $recap = json_decode($verifyResponse);
    if (!($recap && !empty($recap->success))) {
        throw new \Exception('CAPTCHA verification failed');
    }

    // // Database insert (mysqli)
    // $servername = "localhost";
    // $username = "root";
    // $password = "";
    // $database = "mrsudz";

    
$servername = "127.0.0.1:3306";
 $username = "u768511311_mrsudz";
 $password = "Mrsudz@2210";
 $database = "u768511311_mrsudz";

    $conn = mysqli_connect($servername, $username, $password, $database);
    if (!$conn) {
        throw new \Exception("Database connection failed: " . mysqli_connect_error());
    }

    $sql = "INSERT INTO `contact` (`name`, `email`, `phone`, `message`) VALUES (?, ?, ?, ?)";
    $stmt = mysqli_prepare($conn, $sql);
    if (!$stmt) {
        throw new \Exception("Prepare failed: " . mysqli_error($conn));
    }

    // 4 strings => "ssss"
    if (!mysqli_stmt_bind_param($stmt, "ssss", $form_name, $contact_email, $contact_phone, $contact_message)) {
        throw new \Exception("Bind param failed: " . mysqli_stmt_error($stmt));
    }
    if (!mysqli_stmt_execute($stmt)) {
        throw new \Exception("Database error: " . mysqli_stmt_error($stmt));
    }
    mysqli_stmt_close($stmt);
    mysqli_close($conn);

    // Send email (PHPMailer)
    $mail = new PHPMailer(true);
    // SMTP config - replace and secure credentials (see note)
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'office@mrsudzcarwash.com';
    $mail->Password   = 'kqob duwv ivtf oqwx';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    $mail->setFrom('office@mrsudzcarwash.com', 'Mr Sudz');
    $mail->addAddress($contact_email, $form_name); // sends confirmation to user
    $mail->addReplyTo('office@mrsudzcarwash.com', 'Mr Sudz');
    $mail->addAddress('office@mrsudzcarwash.com'); // internal copy

    $mail->isHTML(true);
    $mail->Subject = 'Thank You for Contacting mrsudz car wash';
    $mail_body = '<html><body style="font-family: Arial, sans-serif;">
        <h2>Thank You for Reaching Out!</h2>
        <p>Dear ' . htmlspecialchars($form_name, ENT_QUOTES, 'UTF-8') . ',</p>
        <p>We’ve received your message and will get back to you soon.</p>
        <ul>
            <li><strong>Name:</strong> ' . htmlspecialchars($form_name, ENT_QUOTES, 'UTF-8') . '</li>
            <li><strong>Email:</strong> ' . htmlspecialchars($contact_email, ENT_QUOTES, 'UTF-8') . '</li>
            <li><strong>Phone:</strong> ' . htmlspecialchars($contact_phone, ENT_QUOTES, 'UTF-8') . '</li>
            <li><strong>Message:</strong> ' . nl2br(htmlspecialchars($contact_message, ENT_QUOTES, 'UTF-8')) . '</li>
        </ul>
        <p>Best regards,<br>mrsudz car wash Team</p>
        </body></html>';
    $mail->Body = $mail_body;

    // send; but if mail fails we still respond success for form saving — optional
    try {
        $mail->send();
    } catch (Exception $e) {
        // log mail error, but do not output raw error (avoid breaking JSON)
        error_log("Mail error: " . $mail->ErrorInfo);
        // continue — DB succeeded
    }

    echo json_encode(['success' => true, 'message' => 'Message sent successfully']);

} catch (\Exception $e) {
    // return a clean JSON error message only
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
