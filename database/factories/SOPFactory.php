<?php

namespace Database\Factories;

use App\Models\SOP;
use Illuminate\Database\Eloquent\Factories\Factory;

class SOPFactory extends Factory
{
    protected $model = SOP::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->words(4, true),
            'category' => $this->faker->randomElement(['event_planning', 'vendor_management', 'budgeting', 'quality_assurance']),
            'description' => $this->faker->paragraph(),
            'content' => $this->faker->paragraphs(5, true),
            'file_path' => null,
            'created_by' => 1,
        ];
    }
}
