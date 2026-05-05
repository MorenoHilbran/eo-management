<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $this->call(VendorCategorySeeder::class);
        $this->call(EventSeeder::class);
        $this->call(VendorSeeder::class);
        $this->call(RABItemSeeder::class);
        $this->call(ProposalSeeder::class);
        $this->call(TransactionSeeder::class);
        $this->call(SOPSeeder::class);
    }
}
