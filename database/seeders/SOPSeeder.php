<?php

namespace Database\Seeders;

use App\Models\SOP;
use Illuminate\Database\Seeder;

class SOPSeeder extends Seeder
{
    public function run(): void
    {
        SOP::factory(10)->create();
    }
}
