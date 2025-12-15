<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('campus_cafe', function (Blueprint $table) {
            $table->foreignId('campus_id')->constrained()->cascadeOnDelete();
            $table->foreignId('cafe_id')->constrained()->cascadeOnDelete();
            $table->primary(['campus_id', 'cafe_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campus_cafe');
    }
};
