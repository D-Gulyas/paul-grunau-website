<?php
/**
 * Bewerbungsformular-Handler – Paul Grunau Brandschutz & Elektrotechnik
 * Nimmt POST (multipart) aus components/application-form.tsx entgegen,
 * prüft die PDF-Anhänge und versendet die Bewerbung per E-Mail.
 * Auf PHP-Hosting ablegen; $empfaenger anpassen.
 */
declare(strict_types=1);

$empfaenger = 'paul@grunau.mobi';
$maxCv = 5 * 1024 * 1024;   // 5 MB
$maxAtt = 10 * 1024 * 1024; // 10 MB gesamt

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /karriere/');
    exit;
}

function feld(string $key): string {
    return trim(htmlspecialchars($_POST[$key] ?? '', ENT_QUOTES, 'UTF-8'));
}

$firstname  = feld('firstname');
$lastname   = feld('lastname');
$email      = feld('email');
$phone      = feld('phone');
$position   = feld('position');
$motivation = feld('motivation');
$privacy    = isset($_POST['privacy']);

if ($firstname === '' || $lastname === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $position === '' || !$privacy) {
    http_response_code(400);
    echo 'Bitte füllen Sie alle Pflichtfelder korrekt aus.';
    exit;
}

// Lebenslauf (Pflicht)
if (empty($_FILES['cv']['tmp_name']) || $_FILES['cv']['type'] !== 'application/pdf' || $_FILES['cv']['size'] > $maxCv) {
    http_response_code(400);
    echo 'Bitte laden Sie einen gültigen Lebenslauf (PDF, max. 5 MB) hoch.';
    exit;
}

$boundary = md5((string) time());
$subject  = "[Bewerbung] {$position}: {$firstname} {$lastname}";

$text = "Neue Bewerbung über die Website\n\n"
      . "Name: {$firstname} {$lastname}\n"
      . "E-Mail: {$email}\n"
      . "Telefon: {$phone}\n"
      . "Position: {$position}\n\n"
      . "Motivationsschreiben:\n{$motivation}\n";

$headers  = "From: Website <noreply@grunau.mobi>\r\n";
$headers .= "Reply-To: {$firstname} {$lastname} <{$email}>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: multipart/mixed; boundary=\"{$boundary}\"\r\n";

$message  = "--{$boundary}\r\n";
$message .= "Content-Type: text/plain; charset=UTF-8\r\n\r\n{$text}\r\n";

// Anhänge sammeln (CV + weitere)
$attachments = [['tmp_name' => $_FILES['cv']['tmp_name'], 'name' => $_FILES['cv']['name']]];
$attTotal = (int) $_FILES['cv']['size'];

if (!empty($_FILES['attachments']['tmp_name'][0])) {
    foreach ($_FILES['attachments']['tmp_name'] as $i => $tmp) {
        if ($_FILES['attachments']['type'][$i] !== 'application/pdf') continue;
        $attTotal += (int) $_FILES['attachments']['size'][$i];
        $attachments[] = ['tmp_name' => $tmp, 'name' => $_FILES['attachments']['name'][$i]];
    }
}

if ($attTotal > $maxCv + $maxAtt) {
    http_response_code(400);
    echo 'Die Anhänge überschreiten die maximale Gesamtgröße.';
    exit;
}

foreach ($attachments as $att) {
    $content = chunk_split(base64_encode((string) file_get_contents($att['tmp_name'])));
    $safeName = htmlspecialchars($att['name'], ENT_QUOTES, 'UTF-8');
    $message .= "--{$boundary}\r\n";
    $message .= "Content-Type: application/pdf; name=\"{$safeName}\"\r\n";
    $message .= "Content-Transfer-Encoding: base64\r\n";
    $message .= "Content-Disposition: attachment; filename=\"{$safeName}\"\r\n\r\n{$content}\r\n";
}
$message .= "--{$boundary}--";

$ok = mail($empfaenger, $subject, $message, $headers);

if ($ok) {
    header('Location: /karriere/?status=ok');
} else {
    http_response_code(500);
    header('Location: /karriere/?status=error');
}
exit;
