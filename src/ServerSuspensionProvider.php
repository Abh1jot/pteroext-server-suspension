<?php

namespace ServerSuspension;

use Pterodactyl\Extensions\ExtensionProvider;
use ServerSuspension\Commands\ProcessSuspensionsCommand;

class ServerSuspensionProvider extends ExtensionProvider
{
    /**
     * Boot the Server Suspension extension services.
     */
    public function boot(): void
    {
        $this->registerApiRoutes();
        $this->loadExtensionMigrations();

        $this->commands([
            ProcessSuspensionsCommand::class,
        ]);

        $this->registerPermissions('Server Suspension', [
            'manage' => 'Manage automated server suspension and expiration schedules',
        ]);
    }
}
