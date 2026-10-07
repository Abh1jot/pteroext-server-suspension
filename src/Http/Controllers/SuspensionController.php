<?php

namespace ServerSuspension\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Pterodactyl\Models\Server;
use Pterodactyl\Models\Node;
use Pterodactyl\Facades\Daemon;
use ServerSuspension\Services\SuspensionMailService;

class SuspensionController extends Controller
{
    public function getOverview(): JsonResponse
    {
        // Auto-create table if migration hasn't been run yet
        if (!Schema::hasTable('ext_server_suspensions')) {
            try {
                Schema::create('ext_server_suspensions', function ($table) {
                    $table->id();
                    $table->unsignedInteger('server_id')->unique();
                    $table->timestamp('suspension_date')->nullable();
                    $table->timestamp('termination_date')->nullable();
                    $table->boolean('notify_user')->default(true);
                    $table->string('status', 32)->default('active');
                    $table->timestamp('suspended_at')->nullable();
                    $table->timestamp('warning_sent_at')->nullable();
                    $table->timestamp('terminated_at')->nullable();
                    $table->text('notes')->nullable();
                    $table->timestamps();
                });
            } catch (\Throwable $e) {
                Log::warning('ServerSuspension table creation note: ' . $e->getMessage());
            }
        } elseif (!Schema::hasColumn('ext_server_suspensions', 'warning_sent_at')) {
            try {
                Schema::table('ext_server_suspensions', function ($table) {
                    $table->timestamp('warning_sent_at')->nullable()->after('suspended_at');
                });
            } catch (\Throwable) {}
        }

        $schedules = Schema::hasTable('ext_server_suspensions')
            ? DB::table('ext_server_suspensions')->get()->keyBy('server_id')
            : collect();

        try {
            $servers = Server::query()
                ->with(['user:id,username,email', 'node:id,name'])
                ->get()
                ->map(function ($s) use ($schedules) {
                    $sched = $schedules->get($s->id);
                    $identifier = $s->uuidShort ?? substr((string) ($s->uuid ?? ''), 0, 8);
                    return [
                        'id' => $s->id,
                        'identifier' => $identifier,
                        'uuid' => $s->uuid,
                        'name' => $s->name,
                        'node' => $s->node?->name ?? 'Default Node',
                        'node_id' => $s->node_id,
                        'owner' => $s->user?->username ?? 'Unknown',
                        'owner_email' => $s->user?->email ?? '',
                        'server_status' => $s->status ?? 'active',
                        'suspension_date' => $sched?->suspension_date,
                        'termination_date' => $sched?->termination_date,
                        'notify_user' => (bool) ($sched?->notify_user ?? true),
                        'sched_status' => $sched?->status ?? 'active',
                        'notes' => $sched?->notes ?? '',
                    ];
                });
        } catch (\Throwable $e) {
            Log::error('ServerSuspension getOverview query error: ' . $e->getMessage());
            $servers = collect();
        }

        $total = $servers->count();
        $scheduled = $servers->whereNotNull('suspension_date')->where('sched_status', 'active')->count();
        $suspended = $servers->where('server_status', Server::STATUS_SUSPENDED)->count();
        $terminated = $servers->where('sched_status', 'terminated')->count();

        $nodes = Node::query()->get(['id', 'name']);

        return response()->json([
            'stats' => [
                'total' => $total,
                'scheduled' => $scheduled,
                'suspended' => $suspended,
                'terminated' => $terminated,
            ],
            'servers' => $servers->values(),
            'nodes' => $nodes,
        ]);
    }

    public function updateSchedule(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'server_id' => 'required|integer',
            'suspension_date' => 'nullable|date',
            'termination_date' => 'nullable|date',
            'notify_user' => 'nullable|boolean',
            'notes' => 'nullable|string|max:500',
        ]);

        if (!Schema::hasTable('ext_server_suspensions')) {
            try {
                Schema::create('ext_server_suspensions', function ($table) {
                    $table->id();
                    $table->unsignedInteger('server_id')->unique();
                    $table->timestamp('suspension_date')->nullable();
                    $table->timestamp('termination_date')->nullable();
                    $table->boolean('notify_user')->default(true);
                    $table->string('status', 32)->default('active');
                    $table->timestamp('suspended_at')->nullable();
                    $table->timestamp('terminated_at')->nullable();
                    $table->text('notes')->nullable();
                    $table->timestamps();
                });
            } catch (\Throwable $e) {}
        }

        $suspDate = !empty($validated['suspension_date']) ? date('Y-m-d H:i:s', strtotime($validated['suspension_date'])) : null;
        $termDate = !empty($validated['termination_date']) ? date('Y-m-d H:i:s', strtotime($validated['termination_date'])) : null;

        DB::table('ext_server_suspensions')->updateOrInsert(
            ['server_id' => $validated['server_id']],
            [
                'suspension_date' => $suspDate,
                'termination_date' => $termDate,
                'notify_user' => $validated['notify_user'] ?? true,
                'notes' => $validated['notes'] ?? '',
                'status' => 'active',
                'updated_at' => now(),
            ]
        );

        return response()->json(['message' => 'Server schedule updated successfully.']);
    }

    public function bulkSchedule(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'server_ids' => 'required|array|min:1',
            'suspension_date' => 'required|date',
            'termination_days_after' => 'nullable|integer|min:0',
            'notify_user' => 'nullable|boolean',
        ]);

        $suspDate = date('Y-m-d H:i:s', strtotime($validated['suspension_date']));
        $termDays = $validated['termination_days_after'] ?? 7;
        $termDate = date('Y-m-d H:i:s', strtotime("{$suspDate} +{$termDays} days"));
        $notify = $validated['notify_user'] ?? true;

        foreach ($validated['server_ids'] as $serverId) {
            DB::table('ext_server_suspensions')->updateOrInsert(
                ['server_id' => $serverId],
                [
                    'suspension_date' => $suspDate,
                    'termination_date' => $termDate,
                    'notify_user' => $notify,
                    'status' => 'active',
                    'updated_at' => now(),
                ]
            );
        }

        $count = count($validated['server_ids']);
        return response()->json(['message' => "Successfully scheduled {$count} servers."]);
    }

    public function executeAction(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'server_id' => 'required|integer',
            'action' => 'required|in:suspend,unsuspend,cancel',
        ]);

        $server = Server::findOrFail($validated['server_id']);

        if ($validated['action'] === 'suspend') {
            $server->fill(['status' => Server::STATUS_SUSPENDED])->save();
            try {
                Daemon::server($server)->suspend();
            } catch (\Throwable $e) {}

            DB::table('ext_server_suspensions')->updateOrInsert(
                ['server_id' => $server->id],
                ['status' => 'suspended', 'suspended_at' => now(), 'updated_at' => now()]
            );

            return response()->json(['message' => "Server {$server->name} suspended."]);
        }

        if ($validated['action'] === 'unsuspend') {
            $server->fill(['status' => null])->save();
            try {
                Daemon::server($server)->unsuspend();
            } catch (\Throwable $e) {}

            DB::table('ext_server_suspensions')->updateOrInsert(
                ['server_id' => $server->id],
                ['status' => 'active', 'suspended_at' => null, 'updated_at' => now()]
            );

            return response()->json(['message' => "Server {$server->name} unsuspended."]);
        }

        if ($validated['action'] === 'cancel') {
            DB::table('ext_server_suspensions')->where('server_id', $server->id)->delete();
            return response()->json(['message' => 'Scheduled expiration cancelled.']);
        }

        return response()->json(['error' => 'Invalid action.'], 400);
    }

    public function processDue(): JsonResponse
    {
        Artisan::call('p:server-suspension:process');
        return response()->json(['message' => 'Processed all due suspensions and terminations.']);
    }

    public function getMailTemplates(SuspensionMailService $mailService): JsonResponse
    {
        $templates = $mailService->getAllTemplates();
        $templates['admin_email'] = auth()->user()?->email ?? '';
        return response()->json($templates);
    }

    public function updateMailTemplates(Request $request, SuspensionMailService $mailService): JsonResponse
    {
        $validated = $request->validate([
            'mail_notifications_enabled' => 'nullable|boolean',
            'mail_subject' => 'required|string|max:255',
            'mail_body' => 'required|string|max:10000',
            'warning_mail_enabled' => 'nullable|boolean',
            'warning_mail_subject' => 'required|string|max:255',
            'warning_mail_body' => 'required|string|max:10000',
            'termination_mail_enabled' => 'nullable|boolean',
            'termination_mail_subject' => 'required|string|max:255',
            'termination_mail_body' => 'required|string|max:10000',
        ]);

        $mailService->setSetting('mail_notifications_enabled', $validated['mail_notifications_enabled'] ?? true);
        $mailService->setSetting('mail_subject', $validated['mail_subject']);
        $mailService->setSetting('mail_body', $validated['mail_body']);

        $mailService->setSetting('warning_mail_enabled', $validated['warning_mail_enabled'] ?? true);
        $mailService->setSetting('warning_mail_subject', $validated['warning_mail_subject']);
        $mailService->setSetting('warning_mail_body', $validated['warning_mail_body']);

        $mailService->setSetting('termination_mail_enabled', $validated['termination_mail_enabled'] ?? true);
        $mailService->setSetting('termination_mail_subject', $validated['termination_mail_subject']);
        $mailService->setSetting('termination_mail_body', $validated['termination_mail_body']);

        return response()->json([
            'message' => 'Email notification templates saved successfully.',
        ]);
    }

    public function sendTestMail(Request $request, SuspensionMailService $mailService): JsonResponse
    {
        $validated = $request->validate([
            'template_type' => 'required|in:suspension,warning,termination',
            'subject' => 'nullable|string',
            'body' => 'nullable|string',
            'email' => 'nullable|email',
        ]);

        $recipientEmail = $validated['email'] ?? $request->user()?->email;
        if (!$recipientEmail) {
            return response()->json(['error' => 'No target email specified. Provide an email address or log in.'], 422);
        }

        $type = $validated['template_type'];
        $subjectTpl = $validated['subject'];
        $bodyTpl = $validated['body'];

        if (empty($subjectTpl)) {
            $key = match ($type) {
                'warning' => 'warning_mail_subject',
                'termination' => 'termination_mail_subject',
                default => 'mail_subject',
            };
            $default = match ($type) {
                'warning' => SuspensionMailService::DEFAULT_WARNING_SUBJECT,
                'termination' => SuspensionMailService::DEFAULT_TERMINATION_SUBJECT,
                default => SuspensionMailService::DEFAULT_SUSPENSION_SUBJECT,
            };
            $subjectTpl = (string) $mailService->getSetting($key, $default);
        }

        if (empty($bodyTpl)) {
            $key = match ($type) {
                'warning' => 'warning_mail_body',
                'termination' => 'termination_mail_body',
                default => 'mail_body',
            };
            $default = match ($type) {
                'warning' => SuspensionMailService::DEFAULT_WARNING_BODY,
                'termination' => SuspensionMailService::DEFAULT_TERMINATION_BODY,
                default => SuspensionMailService::DEFAULT_SUSPENSION_BODY,
            };
            $bodyTpl = (string) $mailService->getSetting($key, $default);
        }

        $panelUrl = config('app.url') ?? 'https://panel.example.com';
        $vars = [
            '{username}' => $request->user()?->username ?? 'Administrator',
            '{user_name}' => $request->user()?->username ?? 'Administrator',
            '{server_name}' => 'Demo Survival Minecraft',
            '{server_id}' => '142',
            '{server_uuid}' => 'a8f39b1c',
            '{suspension_date}' => date('M d, Y H:i', strtotime('+1 day')),
            '{termination_date}' => date('M d, Y H:i', strtotime('+8 days')),
            '{panel_url}' => $panelUrl,
        ];

        $subject = '[TEST] ' . $mailService->replacePlaceholders($subjectTpl, $vars);
        $bodyText = $mailService->replacePlaceholders($bodyTpl, $vars);

        $badgeType = match ($type) {
            'warning' => 'warning',
            'termination' => 'termination',
            default => 'suspension',
        };

        $html = $mailService->renderHtmlEmail($subject, $bodyText, $badgeType, [
            'Test Recipient' => $recipientEmail,
            'Template Type' => ucfirst($type),
            'Sample Server' => 'Demo Survival Minecraft',
            'Sample Expiration' => date('M d, Y H:i', strtotime('+8 days')),
        ]);

        try {
            $mailService->sendEmail($recipientEmail, $subject, $html, $bodyText);
            return response()->json([
                'message' => "Test email successfully sent to {$recipientEmail}.",
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => "Failed to deliver email: {$e->getMessage()}",
            ], 500);
        }
    }
}

