<?php

namespace Database\Factories;

use App\Models\RABItem;
use Illuminate\Database\Eloquent\Factories\Factory;

class RABItemFactory extends Factory
{
    protected $model = RABItem::class;

    public function definition(): array
    {
        $quantity = $this->faker->numberBetween(1, 100);
        $unitPrice = $this->faker->numberBetween(100000, 10000000);

        return [
            'event_id' => $this->faker->numberBetween(1, 5),
            'name' => $this->faker->words(5, true),
            'quantity' => $quantity,
            'unit' => $this->faker->randomElement(['pcs', 'box', 'paket', 'orang', 'hari']),
            'unit_price' => $unitPrice,
            'total_price' => $quantity * $unitPrice,
            'notes' => $this->faker->sentence(),
        ];
    }
}
