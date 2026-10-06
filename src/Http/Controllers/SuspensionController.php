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
                    $table->timestamp('terminated_at')->nullable();
                    $table->text('notes')->nullable();
                    $table->timestamps();
                });
            } catch (\Throwable $e) {
                Log::warning('ServerSuspension table creation note: ' . $e->getMessage());
            }
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
}
