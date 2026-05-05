<?php

namespace Database\Factories;

use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition(): array
    {
        $eventNames = [
            'Konferensi Teknologi Indonesia 2026',
            'Workshop Digital Marketing',
            'Seminar Bisnis & Entrepreneurship',
            'Pameran Industri Manufaktur',
            'Festival Seni & Budaya Nusantara',
            'Training Leadership Executive',
            'Konser Musik Charity Nasional',
            'Gathering Komunitas Developer Indonesia',
            'Expo Pertanian & Agroteknologi',
            'Kompetisi Inovasi Startup Indonesia',
        ];
        
        $locations = [
            'Jakarta Convention Center, Jakarta',
            'Balai Kartini, Jakarta',
            'Bali International Convention Center, Bali',
            'Surabaya Convention Hall, Surabaya',
            'Bandung Exhibition Center, Bandung',
            'Yogyakarta Cultural Park, Yogyakarta',
            'Medan International Trade Center, Medan',
            'Makassar Business Complex, Makassar',
            'Semarang Convention Place, Semarang',
            'Palembang Exhibition Hall, Palembang',
        ];
        
        $descriptions = [
            'Acara tahunan dengan menghadirkan pembicara internasional terkemuka dan workshop eksklusif.',
            'Pelatihan intensif untuk meningkatkan skill dan networking profesional.',
            'Membahas tren terkini dan strategi bisnis di era digital.',
            'Menampilkan inovasi produk terbaru dari para pelaku usaha.',
            'Mempromosikan warisan budaya dan seni tradisional Indonesia.',
            'Program pengembangan kepemimpinan untuk level manajemen menengah ke atas.',
            'Mengumpulkan artis terkenal untuk acara amal yang bermakna.',
            'Wadah berkumpulnya komunitas developer untuk sharing knowledge dan kolaborasi.',
            'Memamerkan teknologi pertanian terdepan dan hasil riset pertanian.',
            'Platform kompetisi untuk startup dengan ide inovatif dan berpotensi.',
        ];

        return [
            'name' => $this->faker->randomElement($eventNames),
            'description' => $this->faker->randomElement($descriptions),
            'event_date' => $this->faker->dateTimeBetween('+1 week', '+6 months'),
            'location' => $this->faker->randomElement($locations),
            'budget' => $this->faker->numberBetween(50000000, 500000000),
            'status' => $this->faker->randomElement(['planning', 'ongoing', 'completed']),
            'created_by' => 1,
        ];
    }
}
