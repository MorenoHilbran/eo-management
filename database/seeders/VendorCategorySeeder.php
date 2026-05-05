<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\VendorCategory;

class VendorCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Catering', 'description' => 'Food and beverage services'],
            ['name' => 'Venue', 'description' => 'Event venue and location'],
            ['name' => 'Sound & Audio', 'description' => 'Sound system and audio equipment'],
            ['name' => 'Lighting', 'description' => 'Lighting and visual effects'],
            ['name' => 'Decoration', 'description' => 'Decoration and arrangement'],
            ['name' => 'Photography', 'description' => 'Photography and videography'],
            ['name' => 'Transportation', 'description' => 'Transportation services'],
            ['name' => 'Security', 'description' => 'Security services'],
            ['name' => 'Entertainment', 'description' => 'Entertainment and performers'],
            ['name' => 'Printing', 'description' => 'Printing and promotional materials'],
        ];

        foreach ($categories as $category) {
            VendorCategory::create($category);
        }
    }
}
