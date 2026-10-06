# Auto Server Suspension & Termination Extension for Pterodactyl 2.0

Manage automated server lifecycles, schedule suspension dates, notify server owners by email upon suspension, and enforce grace-period termination.

## Features
- Dedicated Admin Dashboard under Admin -> Suspensions
- Custom suspension dates per server or bulk-scheduled across nodes
- Automated suspension via Wings API
- Automatic user email alerts when suspension occurs
- Grace-period scheduled termination / deletion
- Cron command: `php artisan p:server-suspension:process`
