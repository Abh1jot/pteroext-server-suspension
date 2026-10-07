<?php

declare(strict_types=1);

namespace ServerSuspension\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Pterodactyl\Models\Server;
use Pterodactyl\Facades\Daemon;
use ServerSuspension\Services\SuspensionMailService;

class ProcessSuspensionsCommand extends Command
{
    protected $signature = 'p:server-suspension:process';
    protected $description = 'Process due server suspensions, send owner alerts, and enforce terminations.';

    public function handle(SuspensionMailService $mailService): int
    {
        if (!Schema::hasTable('ext_server_suspensions')) {
            $this->warn('Suspension table does not exist yet. Run migrations first.');
            return self::SUCCESS;
        }

        $now = now();
        $panelUrl = config('app.url') ?? 'https://panel.example.com';

        // 1. Process Pre-Suspension Warnings (within 24 hours of suspension)
        $warningMailEnabled = (bool) $mailService->getSetting('warning_mail_enabled', true);
        if ($warningMailEnabled && Schema::hasColumn('ext_server_suspensions', 'warning_sent_at')) {
            $upcomingSuspensions = DB::table('ext_server_suspensions')
                ->whereNotNull('suspension_date')
                ->where('suspension_date', '>', $now)
                ->where('suspension_date', '<=', $now->copy()->addHours(24))
                ->whereNull('warning_sent_at')
                ->whereIn('status', ['active', 'scheduled'])
                ->get();

            foreach ($upcomingSuspensions as $warnRecord) {
                $server = Server::find($warnRecord->server_id);
                if (!$server || !$warnRecord->notify_user || !$server->user) continue;

                try {
                    $warnSubjectTpl = (string) $mailService->getSetting('warning_mail_subject', SuspensionMailService::DEFAULT_WARNING_SUBJECT);
                    $warnBodyTpl = (string) $mailService->getSetting('warning_mail_body', SuspensionMailService::DEFAULT_WARNING_BODY);

                    $suspFormatted = $warnRecord->suspension_date ? date('M d, Y H:i', strtotime($warnRecord->suspension_date)) : 'N/A';
                    $termFormatted = $warnRecord->termination_date ? date('M d, Y H:i', strtotime($warnRecord->termination_date)) : 'N/A';

                    $vars = [
                        '{username}' => $server->user->username,
                        '{user_name}' => $server->user->username,
                        '{server_name}' => $server->name,
                        '{server_id}' => (string) $server->id,
                        '{server_uuid}' => (string) ($server->uuidShort ?? $server->uuid),
                        '{suspension_date}' => $suspFormatted,
                        '{termination_date}' => $termFormatted,
                        '{panel_url}' => $panelUrl,
                    ];

                    $subject = $mailService->replacePlaceholders($warnSubjectTpl, $vars);
                    $bodyText = $mailService->replacePlaceholders($warnBodyTpl, $vars);
                    $html = $mailService->renderHtmlEmail($subject, $bodyText, 'warning', [
                        'Server' => $server->name,
                        'Server ID' => '#' . $server->id,
                        'Scheduled Suspension' => $suspFormatted,
                        'Grace Period Expiration' => $termFormatted,
                    ]);

                    $mailService->sendEmail($server->user->email, $subject, $html, $bodyText);

                    DB::table('ext_server_suspensions')
                        ->where('id', $warnRecord->id)
                        ->update(['warning_sent_at' => now()]);

                    $this->info("Sent expiration warning for server: {$server->name} (#{$server->id})");
                } catch (\Throwable $warnErr) {
                    $this->warn("Failed sending warning for #{$server->id}: " . $warnErr->getMessage());
                }
            }
        }

        // 2. Process Due Suspensions
        $dueSuspensions = DB::table('ext_server_suspensions')
            ->whereNotNull('suspension_date')
            ->where('suspension_date', '<=', $now)
            ->whereIn('status', ['active', 'scheduled'])
            ->get();

        $this->info("Found {$dueSuspensions->count()} servers due for suspension.");

        $suspMailEnabled = (bool) $mailService->getSetting('mail_notifications_enabled', true);
        $suspSubjectTpl = (string) $mailService->getSetting('mail_subject', SuspensionMailService::DEFAULT_SUSPENSION_SUBJECT);
        $suspBodyTpl = (string) $mailService->getSetting('mail_body', SuspensionMailService::DEFAULT_SUSPENSION_BODY);

        foreach ($dueSuspensions as $record) {
            $server = Server::find($record->server_id);
            if (!$server) continue;

            try {
                // Suspend the server
                $server->fill(['status' => Server::STATUS_SUSPENDED])->save();
                try {
                    Daemon::server($server)->suspend();
                } catch (\Throwable $daemonErr) {}

                // Send email notification to server owner if enabled
                if ($suspMailEnabled && $record->notify_user && $server->user) {
                    $ownerEmail = $server->user->email;
                    $ownerName = $server->user->username;
                    $serverName = $server->name;
                    $suspFormatted = $record->suspension_date ? date('M d, Y H:i', strtotime($record->suspension_date)) : date('M d, Y H:i');
                    $termFormatted = $record->termination_date ? date('M d, Y H:i', strtotime($record->termination_date)) : 'N/A';

                    $vars = [
                        '{username}' => $ownerName,
                        '{user_name}' => $ownerName,
                        '{server_name}' => $serverName,
                        '{server_id}' => (string) $server->id,
                        '{server_uuid}' => (string) ($server->uuidShort ?? $server->uuid),
                        '{suspension_date}' => $suspFormatted,
                        '{termination_date}' => $termFormatted,
                        '{panel_url}' => $panelUrl,
                    ];

                    $subject = $mailService->replacePlaceholders($suspSubjectTpl, $vars);
                    $bodyText = $mailService->replacePlaceholders($suspBodyTpl, $vars);
                    $html = $mailService->renderHtmlEmail($subject, $bodyText, 'suspension', [
                        'Server' => $serverName,
                        'Server ID' => '#' . $server->id,
                        'Suspended At' => $suspFormatted,
                        'Grace Period Expiration' => $termFormatted,
                    ]);

                    try {
                        $mailService->sendEmail($ownerEmail, $subject, $html, $bodyText);
                    } catch (\Throwable $mailErr) {
                        $this->warn("Mail send error for #{$server->id}: " . $mailErr->getMessage());
                    }
                }

                DB::table('ext_server_suspensions')
                    ->where('id', $record->id)
                    ->update([
                        'status' => 'suspended',
                        'suspended_at' => now(),
                        'updated_at' => now(),
                    ]);

                $this->info("Suspended server: {$server->name} (#{$server->id})");
            } catch (\Throwable $e) {
                $this->error("Failed to suspend server #{$server->id}: " . $e->getMessage());
            }
        }

        // 3. Process Due Terminations
        $dueTerminations = DB::table('ext_server_suspensions')
            ->whereNotNull('termination_date')
            ->where('termination_date', '<=', $now)
            ->where('status', 'suspended')
            ->get();

        $this->info("Found {$dueTerminations->count()} servers due for termination.");

        $termMailEnabled = (bool) $mailService->getSetting('termination_mail_enabled', true);
        $termSubjectTpl = (string) $mailService->getSetting('termination_mail_subject', SuspensionMailService::DEFAULT_TERMINATION_SUBJECT);
        $termBodyTpl = (string) $mailService->getSetting('termination_mail_body', SuspensionMailService::DEFAULT_TERMINATION_BODY);

        foreach ($dueTerminations as $termRecord) {
            $server = Server::find($termRecord->server_id);
            if (!$server) continue;

            try {
                if ($termMailEnabled && $termRecord->notify_user && $server->user) {
                    $ownerEmail = $server->user->email;
                    $ownerName = $server->user->username;
                    $serverName = $server->name;
                    $termFormatted = date('M d, Y H:i');

                    $vars = [
                        '{username}' => $ownerName,
                        '{user_name}' => $ownerName,
                        '{server_name}' => $serverName,
                        '{server_id}' => (string) $server->id,
                        '{server_uuid}' => (string) ($server->uuidShort ?? $server->uuid),
                        '{suspension_date}' => 'Past Due',
                        '{termination_date}' => $termFormatted,
                        '{panel_url}' => $panelUrl,
                    ];

                    $subject = $mailService->replacePlaceholders($termSubjectTpl, $vars);
                    $bodyText = $mailService->replacePlaceholders($termBodyTpl, $vars);
                    $html = $mailService->renderHtmlEmail($subject, $bodyText, 'termination', [
                        'Server' => $serverName,
                        'Server ID' => '#' . $server->id,
                        'Terminated At' => $termFormatted,
                    ]);

                    try {
                        $mailService->sendEmail($ownerEmail, $subject, $html, $bodyText);
                    } catch (\Throwable $mailErr) {}
                }

                // Mark terminated
                DB::table('ext_server_suspensions')
                    ->where('id', $termRecord->id)
                    ->update([
                        'status' => 'terminated',
                        'terminated_at' => now(),
                        'updated_at' => now(),
                    ]);

                $this->warn("Marked server #{$server->id} as terminated.");
            } catch (\Throwable $e) {
                $this->error("Termination failed for #{$server->id}: " . $e->getMessage());
            }
        }

        $this->info('Suspension processing completed successfully.');
        return self::SUCCESS;
    }
}
