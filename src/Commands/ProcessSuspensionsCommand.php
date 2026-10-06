<?php

declare(strict_types=1);

namespace ServerSuspension\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;
use Pterodactyl\Models\Server;
use Pterodactyl\Facades\Daemon;

class ProcessSuspensionsCommand extends Command
{
    protected $signature = 'p:server-suspension:process';
    protected $description = 'Process due server suspensions, send owner alerts, and enforce terminations.';

    public function handle(): int
    {
        if (!Schema::hasTable('ext_server_suspensions')) {
            $this->warn('Suspension table does not exist yet. Run migrations first.');
            return self::SUCCESS;
        }

        $now = now();

        // 1. Process Due Suspensions
        $dueSuspensions = DB::table('ext_server_suspensions')
            ->whereNotNull('suspension_date')
            ->where('suspension_date', '<=', $now)
            ->whereIn('status', ['active', 'scheduled'])
            ->get();

        $this->info("Found {$dueSuspensions->count()} servers due for suspension.");

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
                if ($record->notify_user && $server->user) {
                    $ownerEmail = $server->user->email;
                    $ownerName = $server->user->username;
                    $serverName = $server->name;
                    $termDate = $record->termination_date ? date('M d, Y H:i', strtotime($record->termination_date)) : 'N/A';

                    $content = "Hello {$ownerName},\n\nYour server '{$serverName}' has reached its scheduled expiration date and has been suspended.\n\nGrace period termination date: {$termDate}\nPlease contact support or renew your service to prevent data deletion.\n\nThank you.";

                    try {
                        Mail::raw($content, function ($message) use ($ownerEmail, $serverName) {
                            $message->to($ownerEmail)
                                ->subject("[Notice] Server Suspended: {$serverName}");
                        });
                    } catch (\Throwable $mailErr) {}
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

        // 2. Process Due Terminations
        $dueTerminations = DB::table('ext_server_suspensions')
            ->whereNotNull('termination_date')
            ->where('termination_date', '<=', $now)
            ->where('status', 'suspended')
            ->get();

        $this->info("Found {$dueTerminations->count()} servers due for termination.");

        foreach ($dueTerminations as $termRecord) {
            $server = Server::find($termRecord->server_id);
            if (!$server) continue;

            try {
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
