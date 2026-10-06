<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ext_server_suspensions', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('server_id')->unique();
            $table->timestamp('suspension_date')->nullable();
            $table->timestamp('termination_date')->nullable();
            $table->boolean('notify_user')->default(true);
            $table->string('status', 32)->default('active'); // active, scheduled, suspended, terminated, exempt
            $table->timestamp('suspended_at')->nullable();
            $table->timestamp('terminated_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('server_id')->references('id')->on('servers')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ext_server_suspensions');
    }
};
