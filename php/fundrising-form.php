<?php
namespace PortoContactForm;

header('Content-Type: application/json; charset=utf-8');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/php-mailer/src/Exception.php';
require __DIR__ . '/php-mailer/src/PHPMailer.php';
require __DIR__ . '/php-mailer/src/SMTP.php';

try {
    // Match form field names
    $organization = trim((string) filter_input(INPUT_POST, 'organization', FILTER_SANITIZE_FULL_SPECIAL_CHARS));
    $firstname = trim((string) filter_input(INPUT_POST, 'firstname', FILTER_SANITIZE_FULL_SPECIAL_CHARS));
    $lastname = trim((string) filter_input(INPUT_POST, 'lastname', FILTER_SANITIZE_FULL_SPECIAL_CHARS));
    $contact_email = trim((string) filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL));
    $contact_phone = trim((string) filter_input(INPUT_POST, 'contact', FILTER_SANITIZE_FULL_SPECIAL_CHARS));
    
    // Sanitize phone - keep only digits, plus, spaces, parentheses, dash
    $contact_phone = preg_replace('/[^0-9+\-\(\) ]+/', '', $contact_phone);

    $recaptcha_response = isset($_POST['g-recaptcha-response']) ? trim((string) $_POST['g-recaptcha-response']) : '';

    // Validation
    if (!$contact_email || !filter_var($contact_email, FILTER_VALIDATE_EMAIL)) {
        throw new \Exception('Invalid email address');
    }
    if (!$organization || !$firstname || !$lastname) {
        throw new \Exception('Organization, first name, and last name are required');
    }
    if (!$contact_phone) {
        throw new \Exception('Phone number is required');
    }

    // reCAPTCHA verification
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

    // Database connection
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

    // Fixed SQL - matches form fields
    $sql = "INSERT INTO `fundrising` (`organization`, `firstname`, `lastname`, `email`, `phone`) VALUES (?, ?, ?, ?, ?)";
    $stmt = mysqli_prepare($conn, $sql);
    if (!$stmt) {
        throw new \Exception("Prepare failed: " . mysqli_error($conn));
    }

    // Bind 5 string parameters
    if (!mysqli_stmt_bind_param($stmt, "sssss", $organization, $firstname, $lastname, $contact_email, $contact_phone)) {
        throw new \Exception("Bind param failed: " . mysqli_stmt_error($stmt));
    }
    
    if (!mysqli_stmt_execute($stmt)) {
        throw new \Exception("Database error: " . mysqli_stmt_error($stmt));
    }
    
    mysqli_stmt_close($stmt);
    mysqli_close($conn);

    // Send email notification
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'office@mrsudzcarwash.com';
    $mail->Password   = 'kqob duwv ivtf oqwx';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    $full_name = $firstname . ' ' . $lastname;
    $mail->setFrom('office@mrsudzcarwash.com', 'Mr Sudz');
    $mail->addAddress('office@mrsudzcarwash.com', 'Mr Sudz'); // Internal notification
    $mail->addReplyTo($contact_email, $full_name);
    
    // Optional: Send confirmation to user
    // $mail->addAddress($contact_email, $full_name);

    $mail->isHTML(true);
    $mail->Subject = 'New Fundraising Request - ' . $organization;
    
    $mail_body = '<html><body style="font-family: Arial, sans-serif;">
        <h2>New Fundraising Request</h2>
        <p>A new fundraising request has been submitted:</p>
        <ul>
            <li><strong>Organization:</strong> ' . htmlspecialchars($organization, ENT_QUOTES, 'UTF-8') . '</li>
            <li><strong>Name:</strong> ' . htmlspecialchars($full_name, ENT_QUOTES, 'UTF-8') . '</li>
            <li><strong>Email:</strong> ' . htmlspecialchars($contact_email, ENT_QUOTES, 'UTF-8') . '</li>
            <li><strong>Phone:</strong> ' . htmlspecialchars($contact_phone, ENT_QUOTES, 'UTF-8') . '</li>
        </ul>
        <p>Please contact them to discuss their fundraising request.</p>
        <p>Best regards,<br>Mr Sudz Car Wash Team</p>
        </body></html>';
    
    $mail->Body = $mail_body;

    try {
        $mail->send();
    } catch (Exception $e) {
        error_log("Mail error: " . $mail->ErrorInfo);
        // Don't fail the whole process if email fails
    }

    echo json_encode([
        'success' => true, 
        'message' => 'Your fundraising request has been sent successfully. We\'ll contact you soon!'
    ]);

} catch (\Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>