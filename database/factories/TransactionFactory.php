<?php

namespace Database\Factories;

use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;

class TransactionFactory extends Factory
{
    protected $model = Transaction::class;

    public function definition(): array
    {
        return [
            'event_id' => $this->faker->numberBetween(1, 5),
            'amount' => $this->faker->numberBetween(1000000, 20000000),
            'description' => $this->faker->sentence(),
            'status' => $this->faker->randomElement(['pending', 'approved', 'rejected']),
            'transaction_date' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'created_by' => 1,
            'approved_by' => null,
            'approved_at' => null,
            'rejection_reason' => null,
        ];
    }
}
