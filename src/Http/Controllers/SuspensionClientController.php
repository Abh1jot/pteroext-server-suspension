<?php

namespace ServerSuspension\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Pterodactyl\Models\Server;

class SuspensionClientController extends Controller
{
    /**
     * Resolve the Server model from request route or query parameters.
     */
    protected function resolveServer(Request $request, mixed $server = null): ?Server
    {
        if ($server instanceof Server) {
            return $server;
        }

        $param = $server ?? $request->route('server');

        if ($param instanceof Server) {
            return $param;
        }

        if (is_string($param) && !empty($param)) {
            return Server::query()
                ->where(strlen($param) === 8 ? 'uuidShort' : 'uuid', $param)
                ->first();
        }

        // Fallback from query or header
        $queryParam = $request->query('server_id') ?? $request->query('identifier');
        if (!empty($queryParam)) {
            return Server::query()
                ->where(is_numeric($queryParam) ? 'id' : (strlen($queryParam) === 8 ? 'uuidShort' : 'uuid'), $queryParam)
                ->first();
        }

        return null;
    }

    /**
     * Get suspension and termination schedule for the target server.
     */
    public function getServerStatus(Request $request, mixed $server = null): JsonResponse
    {
        try {
            $serverModel = $this->resolveServer($request, $server);
            if (!$serverModel) {
                return response()->json(['scheduled' => false, 'message' => 'Server not found'], 404);
            }

            if (!Schema::hasTable('ext_server_suspensions')) {
                return response()->json(['scheduled' => false]);
            }

            $sched = DB::table('ext_server_suspensions')
                ->where('server_id', $serverModel->id)
                ->first();

            if (!$sched || !$sched->suspension_date) {
                return response()->json(['scheduled' => false]);
            }

            return response()->json([
                'scheduled' => true,
                'server_id' => $serverModel->id,
                'server_name' => $serverModel->name,
                'server_identifier' => $serverModel->uuidShort ?? substr((string) $serverModel->uuid, 0, 8),
                'suspension_date' => $sched->suspension_date,
                'termination_date' => $sched->termination_date,
                'sched_status' => $sched->status ?? 'active',
                'notes' => $sched->notes ?? '',
            ]);
        } catch (\Throwable $e) {
            return response()->json(['scheduled' => false, 'error' => $e->getMessage()]);
        }
    }
}
