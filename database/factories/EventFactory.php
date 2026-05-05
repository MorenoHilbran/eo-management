<?php

namespace Database\Factories;

use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->paragraph(),
            'event_date' => $this->faker->dateTimeBetween('+1 week', '+3 months'),
            'location' => $this->faker->address(),
            'budget' => $this->faker->numberBetween(5000000, 100000000),
            'status' => $this->faker->randomElement(['planning', 'ongoing', 'completed', 'cancelled']),
            'created_by' => 1,
        ];
    }
}
