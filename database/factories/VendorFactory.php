<?php

namespace Database\Factories;

use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\Factory;

class VendorFactory extends Factory
{
    protected $model = Vendor::class;

    public function definition(): array
    {
        $vendorNames = [
            'PT. Sejahtera Jaya Catering',
            'Rumah Sewa Permata',
            'Sinar Suara Profesional',
            'Cahaya Spektakuler Indonesia',
            'Dekorasi Elegan Terpadu',
            'Lensa Indah Fotografi',
            'Armada Transportasi Handal',
            'Keamanan Prima Nusantara',
            'Bintang Hiburan Artista',
            'Percetakan Berkah Printing',
            'Aroma Kuliner Nusantara',
            'Ruang Serbaguna Bersama',
            'Audio Visual Cemerlang',
            'Efek Cahaya Megah',
            'Bunga Tata Penghias Ruang',
        ];

        return [
            'name' => $this->faker->randomElement($vendorNames),
            'category_id' => $this->faker->numberBetween(1, 10),
            'contact_person' => $this->faker->firstName() . ' ' . $this->faker->lastName(),
            'email' => $this->faker->companyEmail(),
            'phone' => '+62' . $this->faker->numberBetween(8, 9) . $this->faker->numerify('##########'),
            'address' => 'Jl. ' . $this->faker->streetName() . ', ' . $this->faker->city() . ', Indonesia',
            'rating' => $this->faker->randomFloat(2, 3.5, 5),
            'status' => $this->faker->randomElement(['active', 'inactive']),
        ];
    }
}
