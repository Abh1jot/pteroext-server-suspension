<?php

namespace ServerSuspension;

use Pterodactyl\Extensions\ExtensionProvider;
use Pterodactyl\Services\Extensions\ExtensionSettingDefinition;
use Pterodactyl\Services\Extensions\ExtensionSettingsDefinition;
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

        $this->app->booted(function () {
            if ($this->app->runningInConsole() && class_exists(\Illuminate\Console\Scheduling\Schedule::class)) {
                $schedule = $this->app->make(\Illuminate\Console\Scheduling\Schedule::class);
                $schedule->command(ProcessSuspensionsCommand::class)->everyMinute()->withoutOverlapping();
            }
        });

        $this->registerPermissions('Server Suspension', [
            'manage' => 'Manage automated server suspension and expiration schedules',
        ]);

        $defaultSuspensionBody = "Hello {username},\n\nYour server '{server_name}' has reached its scheduled expiration date and has been suspended.\n\nDetails:\n- Server ID: {server_id}\n- Suspended Date: {suspension_date}\n- Grace Period Termination: {termination_date}\n\nPlease renew your service or contact support to reactivate your server and prevent permanent data deletion.\n\nAccess your control panel:\n{panel_url}\n\nThank you.";

        $defaultWarningBody = "Hello {username},\n\nThis is an automated reminder that your server '{server_name}' is scheduled to expire and be suspended on {suspension_date}.\n\nDetails:\n- Server ID: {server_id}\n- Scheduled Suspension: {suspension_date}\n- Final Grace Period Termination: {termination_date}\n\nTo avoid service disruption, please renew your server before the expiration date.\n\nControl panel:\n{panel_url}\n\nThank you.";

        $defaultTerminationBody = "Hello {username},\n\nYour server '{server_name}' has exceeded its grace period and has been terminated.\n\nDetails:\n- Server ID: {server_id}\n- Terminated Date: {termination_date}\n\nIf you have any questions or require data recovery assistance, please contact support immediately.\n\nControl panel:\n{panel_url}\n\nThank you.";

        if (class_exists(ExtensionSettingsDefinition::class) && class_exists(ExtensionSettingDefinition::class)) {
            $this->registerSettings(new ExtensionSettingsDefinition($this->settings(), [
                ExtensionSettingDefinition::make('mail_notifications_enabled', 'toggle', true)
                    ->label('Enable Automated Suspension Emails')
                    ->help('Send automated email alerts to server owners when their server is suspended.')
                    ->field('toggle')
                    ->tab('Email Notifications')
                    ->frontend(),
                ExtensionSettingDefinition::make('mail_subject', 'text', '[Notice] Server Suspended: {server_name}')
                    ->label('Suspension Email Subject')
                    ->help('Subject line for suspension notice. Placeholders: {server_name}, {username}, {server_id}.')
                    ->tab('Email Notifications'),
                ExtensionSettingDefinition::make('mail_body', 'textarea', $defaultSuspensionBody)
                    ->label('Suspension Email Body')
                    ->help('Body template for suspension notice. Placeholders: {username}, {server_name}, {server_id}, {suspension_date}, {termination_date}, {panel_url}.')
                    ->field('textarea')
                    ->tab('Email Notifications'),

                ExtensionSettingDefinition::make('warning_mail_enabled', 'toggle', true)
                    ->label('Enable Expiration Warning Emails')
                    ->help('Send advance warning emails to owners before their server expires.')
                    ->field('toggle')
                    ->tab('Email Notifications')
                    ->frontend(),
                ExtensionSettingDefinition::make('warning_mail_subject', 'text', '[Warning] Your server {server_name} expires soon')
                    ->label('Warning Email Subject')
                    ->help('Subject line for expiration warning. Placeholders: {server_name}, {username}, {server_id}, {suspension_date}.')
                    ->tab('Email Notifications'),
                ExtensionSettingDefinition::make('warning_mail_body', 'textarea', $defaultWarningBody)
                    ->label('Warning Email Body')
                    ->help('Body template for expiration warning.')
                    ->field('textarea')
                    ->tab('Email Notifications'),

                ExtensionSettingDefinition::make('termination_mail_enabled', 'toggle', true)
                    ->label('Enable Termination Emails')
                    ->help('Send email notifications when an expired server is marked as terminated.')
                    ->field('toggle')
                    ->tab('Email Notifications')
                    ->frontend(),
                ExtensionSettingDefinition::make('termination_mail_subject', 'text', '[Final Notice] Server Terminated: {server_name}')
                    ->label('Termination Email Subject')
                    ->help('Subject line for final termination notice.')
                    ->tab('Email Notifications'),
                ExtensionSettingDefinition::make('termination_mail_body', 'textarea', $defaultTerminationBody)
                    ->label('Termination Email Body')
                    ->help('Body template for final termination notice.')
                    ->field('textarea')
                    ->tab('Email Notifications'),
            ]));
        }
    }
}
