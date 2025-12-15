<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('cafes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('description');
            $table->string('address');
            $table->enum('price_category', ['murah', 'sedang', 'mahal']);
            $table->json('facilities')->nullable();
            $table->decimal('rating', 3, 2)->default(0);
            $table->enum('status', ['pending', 'approved', 'rejected', 'hidden'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cafes');
    }
};
