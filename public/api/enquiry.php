<?php
/*
 * Website enquiry -> email.
 * The React contact form POSTs JSON here. This script emails the enquiry to info@padhyasoft.com
 * (Reply-To = the visitor, so "Reply" answers the customer) and sends the visitor a thank-you email.
 * SMTP login comes from mail-config.php on the server (see mail-config.sample.php) – never from the website code.
 */
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');

function out(int $code, array $data): void { http_response_code($code); echo json_encode($data); exit; }

/* ---------- settings ---------- */
$cfgFile = null;
foreach ([dirname(__DIR__, 2) . '/mail-config.php', __DIR__ . '/mail-config.php'] as $f) {
    if (is_file($f)) { $cfgFile = $f; break; }
}
if (!$cfgFile) out(500, ['ok' => false, 'error' => 'Mail is not configured on the server (mail-config.php missing).']);
$cfg = require $cfgFile;
if (!is_array($cfg) || empty($cfg['smtp_pass']) || $cfg['smtp_pass'] === 'PUT-THE-MAILBOX-PASSWORD-HERE') {
    out(500, ['ok' => false, 'error' => 'Mail password is not set in mail-config.php.']);
}

/* ---------- request checks ---------- */
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = $cfg['allowed_origins'] ?? [];
if ($origin && in_array($origin, $allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') out(204, []);
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') out(405, ['ok' => false, 'error' => 'POST only']);
if ($origin && !in_array($origin, $allowed, true)) out(403, ['ok' => false, 'error' => 'Origin not allowed']);

$raw = file_get_contents('php://input') ?: '';
if (strlen($raw) > 20000) out(413, ['ok' => false, 'error' => 'Too large']);
$in = json_decode($raw, true);
if (!is_array($in)) $in = $_POST;

$clean = static function ($v, int $max = 200): string {
    $v = is_scalar($v) ? (string)$v : '';
    $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v) ?? '';
    return mb_substr(trim($v), 0, $max);
};
$d = [
    'name'       => $clean($in['name'] ?? '', 100),
    'email'      => $clean($in['email'] ?? '', 150),
    'phone'      => $clean($in['phone'] ?? '', 30),
    'company'    => $clean($in['company'] ?? '', 150),
    'service'    => $clean($in['service'] ?? '', 120),
    'engagement' => $clean($in['engagement'] ?? '', 120),
    'budget'     => $clean($in['budget'] ?? '', 120),
    'timeline'   => $clean($in['timeline'] ?? '', 120),
    'message'    => $clean($in['message'] ?? '', 5000),
    'page'       => $clean($in['page'] ?? '', 300),
    'source'     => $clean($in['source'] ?? 'Website form', 60),
];
if (mb_strlen($d['name']) < 2) out(422, ['ok' => false, 'error' => 'Enter your full name.']);
if (!filter_var($d['email'], FILTER_VALIDATE_EMAIL)) out(422, ['ok' => false, 'error' => 'Enter a valid email address.']);
if (strlen(preg_replace('/\D/', '', $d['phone'])) < 8) out(422, ['ok' => false, 'error' => 'Enter a valid phone number.']);

/* ---------- spam filter ----------
 * Spam gets a normal "ok" answer (so bots don't learn what blocked them) but NO email is sent –
 * neither to info@ nor the thank-you mail, which spammers would otherwise use to mail strangers from our address.
 * Each blocked attempt is written to the server error log with the reason. */
$spam = static function (string $why) use ($d): void {
    error_log('Padhya enquiry: spam blocked (' . $why . ') from ' . ($_SERVER['REMOTE_ADDR'] ?? '?') . ' <' . $d['email'] . '>');
    out(200, ['ok' => true]);
};
// 1. hidden "website" field that only bots fill in
if (!empty($in['website'])) $spam('honeypot');
// 2. must come from our own website – browsers always send Origin; scripts posting directly usually don't
if (!$origin) $spam('no origin');
// 3. filled in too fast – a person needs at least a few seconds on the page
$elapsed = isset($in['elapsed']) && is_numeric($in['elapsed']) ? (int)$in['elapsed'] : -1;
if ($elapsed < (int)($cfg['min_seconds'] ?? 4) * 1000) $spam('too fast: ' . $elapsed . 'ms');
// 4. links in name/company, or many links in the message
$all = $d['name'] . ' ' . $d['company'] . ' ' . $d['message'];
if (preg_match('~https?://|www\.|\.(ru|cn|xyz|top)\b~i', $d['name'] . ' ' . $d['company'])) $spam('link in name/company');
if (preg_match_all('~https?://|www\.~i', $d['message']) > 2) $spam('too many links');
// 5. Russian / Chinese / Korean / Japanese text (Gujarati, Hindi and English pass)
if (preg_match('/[\x{0400}-\x{04FF}\x{4E00}-\x{9FFF}\x{3040}-\x{30FF}\x{AC00}-\x{D7AF}]/u', $all)) $spam('foreign script');
// 6. typical spam phrases (sales pitches to us, not real enquiries)
$words = $cfg['spam_words'] ?? ['backlink', 'casino', 'crypto', 'bitcoin', 'viagra', 'porn', 'guest post', 'first page of google',
    'rank your website', 'increase your traffic', 'seo ranking', 'domain authority', 'whatsapp me at', 'loan offer',
    'unsubscribe', 'investment opportunity', 'dear sir/madam, we are', 'we can redesign your website', 'outsource your'];
foreach ($words as $w) {
    if ($w !== '' && stripos($all, $w) !== false) $spam('spam word: ' . $w);
}
// 7. same visitor sends the identical message again
$dupFile = sys_get_temp_dir() . '/padhya-enquiry-last-' . md5($d['email']);
$sig = md5($d['name'] . '|' . $d['message']);
if (@file_get_contents($dupFile) === $sig && @filemtime($dupFile) > time() - 86400) $spam('duplicate');
// 8. daily safety cap for the whole site, so a bot wave can never flood the inbox
$dayFile = sys_get_temp_dir() . '/padhya-enquiry-day-' . gmdate('Ymd');
$dayCount = (int)@file_get_contents($dayFile);
if ($dayCount >= (int)($cfg['max_per_day'] ?? 40)) $spam('daily cap reached');
// (the duplicate and daily counters are only written after the email really went out – see below –
//  so a visitor whose first try failed can simply send again)

/* ---------- simple rate limit per IP ---------- */
$ip = $_SERVER['REMOTE_ADDR'] ?? '0';
$rlFile = sys_get_temp_dir() . '/padhya-enquiry-' . md5($ip);
$now = time();
$hits = array_filter(array_map('intval', explode(',', @file_get_contents($rlFile) ?: '')), static fn($t) => $t > $now - 3600);
if (count($hits) >= (int)($cfg['max_per_hour'] ?? 5)) out(429, ['ok' => false, 'error' => 'Too many requests. Please try again later.']);
$hits[] = $now;
@file_put_contents($rlFile, implode(',', $hits));

/* ---------- build the emails from the templates ---------- */
date_default_timezone_set('Asia/Kolkata');
$leadId = 'WEB-' . date('ymd-His') . '-' . strtoupper(substr(bin2hex(random_bytes(2)), 0, 3));
$h = static fn(string $v): string => htmlspecialchars($v, ENT_QUOTES, 'UTF-8');
$vars = [
    '{Name}' => $h($d['name']),
    '{Email}' => $h($d['email']),
    '{PhoneNo}' => $h($d['phone']),
    '{PhoneDigits}' => preg_replace('/\D/', '', $d['phone']),
    '{CompanyName}' => $h($d['company'] ?: '-'),
    '{Service}' => $h($d['service'] ?: '-'),
    '{BudgetRange}' => $h($d['budget'] ?: '-'),
    '{Expected_Timeline}' => $h($d['timeline'] ?: '-'),
    '{EngagementType}' => $h($d['engagement'] ?: '-'),
    '{ProjectDescription}' => nl2br($h($d['message'] ?: '-')),
    '{PageSource}' => $h($d['page'] ?: $d['source']),
    '{LeadId}' => $h($leadId),
    '{LeadDate}' => date('d M Y'),
    '{LeadTime}' => date('h:i A'),
    '{AdminUrl}' => $h((string)($cfg['admin_url'] ?? 'https://www.padhyasoft.com')),
    // icons in the emails load from the website the form was sent from (temporary domain or www.padhyasoft.com)
    '{AssetBase}' => $h(($origin && in_array($origin, $allowed, true)) ? $origin : rtrim((string)($cfg['site_url'] ?? 'https://www.padhyasoft.com'), '/')),
];
$tpl = static function (string $name) use ($vars): string {
    $body = @file_get_contents(__DIR__ . '/templates/' . $name) ?: '';
    $body = preg_replace('/^\xEF\xBB\xBF/', '', $body) ?? $body; // strip BOM
    return strtr($body, $vars);
};
$adminText = "New website enquiry ($leadId)\n\nName: {$d['name']}\nEmail: {$d['email']}\nPhone: {$d['phone']}\nCompany: {$d['company']}\n"
    . "Service: {$d['service']}\nEngagement: {$d['engagement']}\nBudget: {$d['budget']}\nTimeline: {$d['timeline']}\nPage: {$d['page']}\n\nMessage:\n{$d['message']}\n";

/* ---------- minimal SMTP client (STARTTLS / SSL + AUTH LOGIN) ---------- */
final class Smtp
{
    private $s;
    private array $cfg;
    public function __construct(array $cfg) { $this->cfg = $cfg; }

    private function read(): string {
        $data = '';
        while (($line = fgets($this->s, 515)) !== false) {
            $data .= $line;
            if (strlen($line) < 4 || $line[3] === ' ') break;
        }
        return $data;
    }
    private function cmd(string $c, array $okCodes): string {
        if ($c !== '') fwrite($this->s, $c . "\r\n");
        $r = $this->read();
        if (!in_array((int)substr($r, 0, 3), $okCodes, true)) {
            $shown = stripos($c, 'AUTH') === 0 || preg_match('/^[A-Za-z0-9+\/=]+$/', $c) ? '[login]' : $c;
            throw new RuntimeException("SMTP error after '$shown': " . trim($r));
        }
        return $r;
    }
    public function connect(): void {
        $c = $this->cfg;
        $ctx = stream_context_create(['ssl' => [
            'verify_peer' => (bool)($c['verify_ssl'] ?? true),
            'verify_peer_name' => (bool)($c['verify_ssl'] ?? true),
            'allow_self_signed' => !($c['verify_ssl'] ?? true),
        ]]);
        $secure = strtolower((string)($c['smtp_secure'] ?? 'tls'));
        $host = ($secure === 'ssl' ? 'ssl://' : 'tcp://') . $c['smtp_host'] . ':' . (int)$c['smtp_port'];
        $this->s = @stream_socket_client($host, $errno, $errstr, 20, STREAM_CLIENT_CONNECT, $ctx);
        if (!$this->s) throw new RuntimeException("Cannot connect to {$c['smtp_host']}:{$c['smtp_port']} ($errstr)");
        stream_set_timeout($this->s, 20);
        $this->cmd('', [220]);
        $ehlo = 'EHLO ' . ($_SERVER['SERVER_NAME'] ?? 'localhost');
        $this->cmd($ehlo, [250]);
        if ($secure === 'tls') {
            $this->cmd('STARTTLS', [220]);
            if (!stream_socket_enable_crypto($this->s, true, STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT | STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT)) {
                throw new RuntimeException('STARTTLS failed');
            }
            $this->cmd($ehlo, [250]);
        }
        $this->cmd('AUTH LOGIN', [334]);
        $this->cmd(base64_encode((string)$c['smtp_user']), [334]);
        $this->cmd(base64_encode((string)$c['smtp_pass']), [235]);
    }
    public function send(array $to, string $subject, string $html, string $text, ?string $replyTo = null): void {
        $c = $this->cfg;
        $from = (string)$c['from_email'];
        $enc = static fn(string $s): string => '=?UTF-8?B?' . base64_encode($s) . '?=';
        $this->cmd("MAIL FROM:<$from>", [250]);
        foreach ($to as $r) $this->cmd('RCPT TO:<' . $r . '>', [250, 251]);
        $this->cmd('DATA', [354]);
        $b = 'b' . bin2hex(random_bytes(8));
        $headers = [
            'Date: ' . date('r'),
            'From: ' . $enc((string)$c['from_name']) . " <$from>",
            'To: ' . implode(', ', array_map(static fn($r) => "<$r>", $to)),
            'Subject: ' . $enc($subject),
            'Message-ID: <' . bin2hex(random_bytes(12)) . '@' . substr(strrchr($from, '@'), 1) . '>',
            'MIME-Version: 1.0',
            "Content-Type: multipart/alternative; boundary=\"$b\"",
        ];
        if ($replyTo) $headers[] = "Reply-To: <$replyTo>";
        $msg = implode("\r\n", $headers) . "\r\n\r\n"
            . "--$b\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n" . chunk_split(base64_encode($text)) . "\r\n"
            . "--$b\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n" . chunk_split(base64_encode($html)) . "\r\n"
            . "--$b--\r\n";
        fwrite($this->s, $msg . ".\r\n");
        $this->cmd('', [250]);
        $this->cmd('RSET', [250]);
    }
    public function close(): void { if ($this->s) { @fwrite($this->s, "QUIT\r\n"); @fclose($this->s); } }
}

$adminTo = array_values(array_filter(array_map('trim', explode(',', (string)($cfg['admin_to'] ?? 'info@padhyasoft.com'))), static fn($e) => filter_var($e, FILTER_VALIDATE_EMAIL)));
$smtp = new Smtp($cfg);
try {
    $smtp->connect();
    $smtp->send($adminTo, ($cfg['admin_subject'] ?? 'New Website Enquiry') . ' - ' . $d['name'] . ($d['service'] ? ' (' . $d['service'] . ')' : ''), $tpl('admin.html'), $adminText, $d['email']);
    @file_put_contents($dupFile, $sig);                    // remember this message (duplicate check)
    @file_put_contents($dayFile, (string)($dayCount + 1)); // count it towards today's cap
    if (!empty($cfg['send_user_copy'])) {
        $userText = "Hi {$d['name']},\n\nThank you for contacting Padhya Software Technologies. We have received your enquiry ($leadId) and will reply within 24 hours.\n\nPadhya Software Technologies\n+91 90165 75815 · info@padhyasoft.com\nhttps://www.padhyasoft.com\n";
        try {
            $smtp->send([$d['email']], (string)($cfg['user_subject'] ?? 'Thank you for contacting Padhya Software Technologies'), $tpl('user.html'), $userText, (string)$cfg['from_email']);
        } catch (Throwable $e) {
            error_log('Padhya enquiry: thank-you email failed: ' . $e->getMessage()); // admin email already went out
        }
    }
    $smtp->close();
    out(200, ['ok' => true, 'leadId' => $leadId]);
} catch (Throwable $e) {
    $smtp->close();
    error_log('Padhya enquiry: ' . $e->getMessage());
    out(502, ['ok' => false, 'error' => 'Email could not be sent.']);
}
