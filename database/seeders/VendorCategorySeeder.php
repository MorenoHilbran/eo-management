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
            ['name' => 'Katering & Minuman', 'description' => 'Layanan katering makanan dan minuman untuk acara'],
            ['name' => 'Venue & Lokasi', 'description' => 'Penyediaan tempat dan lokasi untuk acara'],
            ['name' => 'Sound & Audio', 'description' => 'Sistem audio dan peralatan sound berkualitas tinggi'],
            ['name' => 'Lighting & Proyeksi', 'description' => 'Pencahayaan profesional dan efek visual'],
            ['name' => 'Dekorasi & Tata Ruang', 'description' => 'Dekorasi tematik dan pengaturan interior ruang'],
            ['name' => 'Fotografi & Videografi', 'description' => 'Dokumentasi profesional foto dan video acara'],
            ['name' => 'Transportasi & Logistik', 'description' => 'Layanan transportasi dan pengiriman barang'],
            ['name' => 'Keamanan & Proteksi', 'description' => 'Tim keamanan profesional dan sistem proteksi'],
            ['name' => 'Hiburan & Performer', 'description' => 'Artis, DJ, dan performer untuk hiburan acara'],
            ['name' => 'Percetakan & Merchandise', 'description' => 'Percetakan materi promosi dan merchandise berkualitas'],
        ];

        foreach ($categories as $category) {
            VendorCategory::create($category);
        }
    }
}
