<?php

declare(strict_types=1);

namespace ServerSuspension\Services;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SuspensionMailService
{
    public const DEFAULT_SUSPENSION_SUBJECT = '[Notice] Server Suspended: {server_name}';
    public const DEFAULT_SUSPENSION_BODY = "Hello {username},\n\nYour server '{server_name}' has reached its scheduled expiration date and has been suspended.\n\nDetails:\n• Server ID: {server_id}\n• Suspended Date: {suspension_date}\n• Grace Period Expiration: {termination_date}\n\nPlease renew your service or contact support to reactivate your server and prevent permanent data deletion.\n\nAccess your control panel:\n{panel_url}\n\nThank you,\nServer Management";

    public const DEFAULT_WARNING_SUBJECT = '[Warning] Your server {server_name} expires soon';
    public const DEFAULT_WARNING_BODY = "Hello {username},\n\nThis is an automated reminder that your server '{server_name}' is scheduled to expire and be suspended on {suspension_date}.\n\nDetails:\n• Server ID: {server_id}\n• Scheduled Suspension: {suspension_date}\n• Final Grace Period Termination: {termination_date}\n\nTo avoid service disruption, please renew your server before the expiration date.\n\nControl panel:\n{panel_url}\n\nThank you,\nServer Management";

    public const DEFAULT_TERMINATION_SUBJECT = '[Final Notice] Server Terminated: {server_name}';
    public const DEFAULT_TERMINATION_BODY = "Hello {username},\n\nYour server '{server_name}' has exceeded its grace period and has been terminated.\n\nDetails:\n• Server ID: {server_id}\n• Terminated Date: {termination_date}\n\nIf you have any questions or require data recovery assistance, please contact support immediately.\n\nControl panel:\n{panel_url}\n\nThank you,\nServer Management";

    public function getSetting(string $key, mixed $default = null): mixed
    {
        try {
            if (class_exists(\Pterodactyl\Services\Extensions\ExtensionManager::class)) {
                $val = app(\Pterodactyl\Services\Extensions\ExtensionManager::class)
                    ->settings('server-suspension')
                    ->get($key);
                if ($val !== null && $val !== '') {
                    return $val;
                }
            }
        } catch (\Throwable) {}

        try {
            if (class_exists(\Pterodactyl\Models\ExtensionSetting::class)) {
                $setting = \Pterodactyl\Models\ExtensionSetting::query()
                    ->where('extension', 'server-suspension')
                    ->where('key', $key)
                    ->first();
                if ($setting && $setting->value !== null && $setting->value !== '') {
                    $decoded = json_decode($setting->value, true);
                    return $decoded ?? $setting->value;
                }
            }
        } catch (\Throwable) {}

        return $default;
    }

    public function setSetting(string $key, mixed $value): void
    {
        try {
            if (class_exists(\Pterodactyl\Services\Extensions\ExtensionManager::class)) {
                app(\Pterodactyl\Services\Extensions\ExtensionManager::class)
                    ->settings('server-suspension')
                    ->set($key, $value);
                return;
            }
        } catch (\Throwable) {}

        try {
            if (class_exists(\Pterodactyl\Models\ExtensionSetting::class)) {
                \Pterodactyl\Models\ExtensionSetting::query()->updateOrCreate(
                    ['extension' => 'server-suspension', 'key' => $key],
                    ['value' => is_string($value) ? $value : json_encode($value), 'updated_at' => now()]
                );
            }
        } catch (\Throwable) {}
    }

    public function getAllTemplates(): array
    {
        return [
            'mail_notifications_enabled' => (bool) $this->getSetting('mail_notifications_enabled', true),
            'mail_subject' => (string) $this->getSetting('mail_subject', self::DEFAULT_SUSPENSION_SUBJECT),
            'mail_body' => (string) $this->getSetting('mail_body', self::DEFAULT_SUSPENSION_BODY),

            'warning_mail_enabled' => (bool) $this->getSetting('warning_mail_enabled', true),
            'warning_mail_subject' => (string) $this->getSetting('warning_mail_subject', self::DEFAULT_WARNING_SUBJECT),
            'warning_mail_body' => (string) $this->getSetting('warning_mail_body', self::DEFAULT_WARNING_BODY),

            'termination_mail_enabled' => (bool) $this->getSetting('termination_mail_enabled', true),
            'termination_mail_subject' => (string) $this->getSetting('termination_mail_subject', self::DEFAULT_TERMINATION_SUBJECT),
            'termination_mail_body' => (string) $this->getSetting('termination_mail_body', self::DEFAULT_TERMINATION_BODY),

            'placeholders' => [
                ['tag' => '{username}', 'description' => 'Server owner username'],
                ['tag' => '{server_name}', 'description' => 'Server display name'],
                ['tag' => '{server_id}', 'description' => 'Server numeric ID'],
                ['tag' => '{server_uuid}', 'description' => 'Server short UUID identifier'],
                ['tag' => '{suspension_date}', 'description' => 'Scheduled suspension date & time'],
                ['tag' => '{termination_date}', 'description' => 'Scheduled grace period termination date & time'],
                ['tag' => '{panel_url}', 'description' => 'Pterodactyl panel URL'],
            ],
        ];
    }

    public function replacePlaceholders(string $content, array $variables): string
    {
        foreach ($variables as $key => $val) {
            $valStr = (string) ($val ?? 'N/A');
            $content = str_ireplace($key, $valStr, $content);
        }
        return $content;
    }

    public function renderHtmlEmail(string $title, string $bodyText, string $badgeType, array $meta = []): string
    {
        $panelUrl = rtrim(config('app.url') ?? 'https://panel.example.com', '/');
        $appName = config('app.name', 'Pterodactyl');

        $badgeBg = '#ef4444'; // Red for suspension
        $badgeText = 'SUSPENDED';
        if ($badgeType === 'warning') {
            $badgeBg = '#f59e0b'; // Amber for warning
            $badgeText = 'EXPIRING SOON';
        } elseif ($badgeType === 'termination') {
            $badgeBg = '#991b1b'; // Dark red for termination
            $badgeText = 'TERMINATED';
        }

        $formattedBody = nl2br(htmlspecialchars($bodyText, ENT_QUOTES, 'UTF-8'));

        $metaRows = '';
        foreach ($meta as $label => $val) {
            $safeLabel = htmlspecialchars($label, ENT_QUOTES, 'UTF-8');
            $safeVal = htmlspecialchars((string) $val, ENT_QUOTES, 'UTF-8');
            $metaRows .= "<tr>
                <td style=\"padding: 8px 12px; color: #94a3b8; font-size: 13px; font-weight: 500; border-bottom: 1px solid #334155;\">{$safeLabel}</td>
                <td style=\"padding: 8px 12px; color: #f1f5f9; font-size: 13px; font-weight: 600; text-align: right; border-bottom: 1px solid #334155;\">{$safeVal}</td>
            </tr>";
        }

        $metaTable = '';
        if (!empty($metaRows)) {
            $metaTable = "<table style=\"width: 100%; border-collapse: collapse; background: #0f172a; border-radius: 8px; margin: 20px 0; overflow: hidden; border: 1px solid #334155;\">
                {$metaRows}
            </table>";
        }

        return "<!DOCTYPE html>
<html>
<head>
    <meta charset=\"utf-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
    <title>" . htmlspecialchars($title, ENT_QUOTES, 'UTF-8') . "</title>
</head>
<body style=\"margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0; line-height: 1.6;\">
    <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color: #0b0f19; padding: 32px 16px;\">
        <tr>
            <td align=\"center\">
                <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"max-width: 580px; background: #1e293b; border-radius: 12px; overflow: hidden; border: 1px solid #334155; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);\">
                    <!-- Header -->
                    <tr>
                        <td style=\"padding: 24px 28px; background: #0f172a; border-bottom: 1px solid #334155;\">
                            <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">
                                <tr>
                                    <td>
                                        <span style=\"font-size: 18px; font-weight: 700; color: #f8fafc; letter-spacing: -0.02em;\">{$appName}</span>
                                    </td>
                                    <td align=\"right\">
                                        <span style=\"display: inline-block; padding: 4px 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; background: {$badgeBg}; color: #ffffff; border-radius: 6px;\">{$badgeText}</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Main Content -->
                    <tr>
                        <td style=\"padding: 28px;\">
                            <h2 style=\"margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #f8fafc; line-height: 1.3;\">" . htmlspecialchars($title, ENT_QUOTES, 'UTF-8') . "</h2>
                            <div style=\"font-size: 14px; color: #cbd5e1; line-height: 1.7;\">
                                {$formattedBody}
                            </div>
                            {$metaTable}
                            <div style=\"margin-top: 28px; text-align: center;\">
                                <a href=\"{$panelUrl}\" target=\"_blank\" style=\"display: inline-block; padding: 12px 28px; background: #3b82f6; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);\">Open Control Panel &rarr;</a>
                            </div>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style=\"padding: 20px 28px; background: #0f172a; border-top: 1px solid #1e293b; text-align: center; font-size: 12px; color: #64748b;\">
                            This is an automated notification from {$appName}.<br>
                            If you require assistance or wish to renew, please log in to your dashboard or contact support.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>";
    }

    public function sendEmail(string $recipientEmail, string $subject, string $htmlContent, string $rawText): bool
    {
        try {
            Mail::html($htmlContent, function ($message) use ($recipientEmail, $subject) {
                $message->to($recipientEmail)
                    ->subject($subject);
            });
            return true;
        } catch (\Throwable $e) {
            Log::warning("SuspensionMailService Mail::html failed ({$e->getMessage()}), attempting Mail::raw fallback");
            try {
                Mail::raw($rawText, function ($message) use ($recipientEmail, $subject) {
                    $message->to($recipientEmail)
                        ->subject($subject);
                });
                return true;
            } catch (\Throwable $errFallback) {
                Log::error("SuspensionMailService Mail::raw failed: " . $errFallback->getMessage());
                throw $errFallback;
            }
        }
    }
}
