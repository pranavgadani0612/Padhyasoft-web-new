<?php
/*
 * SAMPLE mail settings for the website enquiry form (api/enquiry.php).
 *
 * How to use (on Hostinger, File Manager):
 *   1. Copy this file and name the copy  mail-config.php
 *      Best place: ONE folder ABOVE public_html  (e.g. /home/<user>/domains/padhyasoft.com/mail-config.php)
 *      Also works: inside public_html/api/  (direct web access to it is blocked by api/.htaccess)
 *   2. Fill in the password of the info@padhyasoft.com mailbox below and save.
 *
 * Never put the real password in this sample file or in the website's source code / zip.
 */
return [
    // SMTP server of the info@padhyasoft.com mailbox
    'smtp_host'   => 'mail.padhyasoft.com',
    'smtp_port'   => 587,          // 587 = STARTTLS, 465 = SSL
    'smtp_secure' => 'tls',        // 'tls' for port 587, 'ssl' for port 465
    'smtp_user'   => 'info@padhyasoft.com',
    'smtp_pass'   => 'PUT-THE-MAILBOX-PASSWORD-HERE',

    // Set to false only if the mail server's SSL certificate does not match its name
    // (sending then still uses encryption, it just skips the certificate-name check).
    'verify_ssl'  => true,

    // Who sends the emails, and who receives new enquiries
    'from_email'  => 'info@padhyasoft.com',
    'from_name'   => 'Padhya Software Technologies',
    'admin_to'    => 'info@padhyasoft.com',      // add more with a comma: 'info@padhyasoft.com, someone@padhyasoft.com'
    'admin_subject' => 'New Website Enquiry',

    // Send the "Thank you" email to the person who filled the form
    'send_user_copy' => true,
    'user_subject'   => "Thank You for Your Email - We've Received Your Message",

    // Link used in the "Login to Admin Panel" button of the admin email
    'admin_url'   => 'https://aliceblue-wasp-870365.hostingersite.com',

    // Websites allowed to post to this form (protects against other sites using it)
    'allowed_origins' => [
        'https://www.padhyasoft.com',
        'https://padhyasoft.com',
        'https://casual-cyan-porpoise-73.hostingersite.com',
    ],

    // Anti-spam: max enquiries from one visitor (IP) per hour
    'max_per_hour' => 5,

    // Anti-spam (optional – these are the defaults):
    // 'max_per_day' => 40,     // never more than this many enquiry emails per day for the whole site
    // 'min_seconds' => 4,      // a person needs at least this long on the page before sending
    // 'spam_words'  => ['backlink', 'casino', ...],  // replaces the built-in list in enquiry.php
];
