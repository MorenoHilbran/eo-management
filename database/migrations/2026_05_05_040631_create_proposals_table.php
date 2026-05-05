<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('proposals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
            $table->string('template_name');
            $table->text('content')->nullable();
            $table->enum('status', ['sent', 'signed', 'expired', 'draft', 'rejected'])->default('draft');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->dateTime('sent_at')->nullable();
            $table->dateTime('signed_at')->nullable();
            $table->dateTime('expires_at')->nullable();
            $table->string('signature_file')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proposals');
    }
};
