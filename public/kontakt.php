<?php
/**
 * Kontaktformular-Handler – Paul Grunau Brandschutz & Elektrotechnik
 * Nimmt POST aus components/contact-form.tsx entgegen und versendet eine E-Mail.
 * Auf PHP-Hosting ablegen; $empfaenger anpassen.
 */
declare(strict_types=1);

$empfaenger = 'paul@grunau.mobi';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /kontakt/');
    exit;
}

function feld(string $key): string {
    return trim(htmlspecialchars($_POST[$key] ?? '', ENT_QUOTES, 'UTF-8'));
}

$name    = feld('name');
$email   = feld('email');
$phone   = feld('phone');
$subject = feld('subject');
$type    = feld('type');
$message = feld('message');
$privacy = isset($_POST['privacy']);

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $subject === '' || $message === '' || !$privacy) {
    http_response_code(400);
    echo 'Bitte füllen Sie alle Pflichtfelder korrekt aus.';
    exit;
}

$betreff = "[Kontakt] {$type}: {$subject}";
$body = "Neue Kontaktanfrage über die Website\n\n"
      . "Name: {$name}\n"
      . "E-Mail: {$email}\n"
      . "Telefon: {$phone}\n"
      . "Art der Anfrage: {$type}\n"
      . "Betreff: {$subject}\n\n"
      . "Nachricht:\n{$message}\n";

$headers = "From: Website <noreply@grunau.mobi>\r\n"
         . "Reply-To: {$name} <{$email}>\r\n"
         . "Content-Type: text/plain; charset=UTF-8\r\n";

$ok = mail($empfaenger, $betreff, $body, $headers);

if ($ok) {
    header('Location: /kontakt/?status=ok');
} else {
    http_response_code(500);
    header('Location: /kontakt/?status=error');
}
exit;
