<?php

namespace Database\Factories;

use App\Models\Proposal;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProposalFactory extends Factory
{
    protected $model = Proposal::class;

    public function definition(): array
    {
        return [
            'event_id' => $this->faker->numberBetween(1, 5),
            'template_name' => $this->faker->words(3, true),
            'content' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement(['draft', 'sent', 'signed', 'expired', 'rejected']),
            'created_by' => 1,
            'sent_at' => $this->faker->optional()->dateTimeBetween('-1 month', 'now'),
            'signed_at' => $this->faker->optional()->dateTimeBetween('-1 week', 'now'),
            'expires_at' => $this->faker->dateTimeBetween('+1 week', '+1 month'),
            'signature_file' => null,
        ];
    }
}
