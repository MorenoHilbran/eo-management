<?php

namespace Database\Seeders;

use App\Models\RABItem;
use Illuminate\Database\Seeder;

class RABItemSeeder extends Seeder
{
    public function run(): void
    {
        RABItem::factory(30)->create();
    }
}
