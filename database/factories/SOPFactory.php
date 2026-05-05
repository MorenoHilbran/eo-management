<?php

namespace Database\Factories;

use App\Models\SOP;
use Illuminate\Database\Eloquent\Factories\Factory;

class SOPFactory extends Factory
{
    protected $model = SOP::class;

    public function definition(): array
    {
        $sopNames = [
            'Prosedur Perencanaan Event Komprehensif',
            'Panduan Seleksi dan Manajemen Vendor',
            'Tata Cara Pembuatan Budget & Alokasi Dana',
            'Standar Kualitas Assurance Acara',
            'Pedoman Koordinasi dengan Stakeholder',
            'Prosedur Penanganan Risiko & Mitigasi',
            'Panduan Tim Management & Leadership',
            'Standar Dokumentasi & Reporting',
            'Prosedur Evaluasi Pasca Acara',
            'Panduan Komunikasi & Customer Service',
        ];

        $categories = ['Perencanaan', 'Manajemen Vendor', 'Keuangan', 'Kualitas', 'Operasional'];
        
        $descriptions = [
            'Panduan lengkap untuk memastikan semua tahap perencanaan berjalan dengan terstruktur dan efisien.',
            'Prosedur untuk memilih, mengelola, dan menjalin hubungan baik dengan vendor mitra.',
            'Standar dalam membuat budget event dan mengalokasikan dana untuk berbagai kebutuhan.',
            'Kriteria kualitas yang harus dipenuhi untuk menghasilkan acara yang memuaskan stakeholder.',
            'Tata cara koordinasi dengan semua pihak terlibat untuk hasil optimal.',
            'Langkah-langkah mitigasi risiko untuk menjamin kelancaran acara.',
            'Panduan pembentukan tim dan penetapan peran dalam event management.',
            'Format dan prosedur dokumentasi untuk arsip dan audit.',
            'Metode evaluasi untuk pembelajaran dan improvement berkelanjutan.',
            'Standar komunikasi efektif dengan klien dan peserta acara.',
        ];

        return [
            'name' => $this->faker->randomElement($sopNames),
            'category' => $this->faker->randomElement($categories),
            'description' => $this->faker->randomElement($descriptions),
            'content' => implode('\n\n', $this->faker->paragraphs(8)),
            'file_path' => null,
            'created_by' => 1,
        ];
    }
}
