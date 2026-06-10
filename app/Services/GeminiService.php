<?php

namespace App\Services;

use App\Models\Event;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    protected string $apiKey;
    protected string $model;

    public function __construct()
    {
        $this->apiKey = (string) (config('services.gemini.key') ?: env('GEMINI_API_KEY') ?: '');
        $this->model = (string) (config('services.gemini.model') ?: 'gemini-2.5-flash');
    }

    /**
     * Generate budget items and timeplans for an event using Gemini AI.
     *
     * @param Event $event
     * @param string|null $additionalPrompt
     * @return array
     */
    public function generateEventPlan(Event $event, ?string $additionalPrompt = null): array
    {
        if (empty($this->apiKey)) {
            Log::error('Gemini API Key is not set in environment variables.');
            throw new \Exception('API Key Gemini belum diatur di file .env server.');
        }

        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent?key={$this->apiKey}";

        $systemInstructions = "Anda adalah asisten perencana acara profesional (Event Organizer) di Indonesia. Tugas Anda adalah menghasilkan draf Rencana Anggaran Biaya (RAB) dan Jadwal Kegiatan (Timeplan) yang logis dan detail untuk sebuah event berdasarkan informasi dasar yang diberikan oleh pengguna.
RAB harus dialokasikan secara logis ke dalam item-item anggaran dengan mata uang Rupiah dan total harga seluruh item anggaran diusahakan mendekati target budget acara.
Timeplan harus dibagi menjadi dua bagian:
1. Tahap Persiapan (Plan by Day): Tugas/kegiatan koordinasi sebelum hari pelaksanaan, menggunakan day_offset seperti 'H-30', 'H-14', 'H-7', 'H-3', 'H-1'.
2. Hari Pelaksanaan (Rundown): Jadwal jam-demi-jam pada hari H, menggunakan day_offset 'Hari Pelaksanaan' dengan format time_start dan time_end jam spesifik (e.g. '08:00', '09:00').

Semua output wajib ditulis dalam Bahasa Indonesia yang profesional.";

        $prompt = "Buatkan rekomendasi budget (RAB) dan jadwal kegiatan (timeplan) untuk event berikut:\n" .
            "- Nama Event: {$event->name}\n" .
            "- Deskripsi: " . ($event->description ?: 'Tidak ada deskripsi.') . "\n" .
            "- Tanggal Acara: " . ($event->event_date ? $event->event_date->format('d F Y H:i') : 'Belum ditentukan') . "\n" .
            "- Lokasi: {$event->location}\n" .
            "- Target Budget Total: Rp " . number_format($event->budget, 0, ',', '.') . "\n";

        if ($additionalPrompt) {
            $prompt .= "- Instruksi Tambahan Pengguna: {$additionalPrompt}\n";
        }

        $prompt .= "\nPastikan total RAB tidak melebihi Target Budget Total dan mencakup item yang realistis sesuai jenis acaranya.";

        $schema = [
            'type' => 'OBJECT',
            'properties' => [
                'budget_items' => [
                    'type' => 'ARRAY',
                    'description' => 'Daftar rincian item anggaran biaya (RAB)',
                    'items' => [
                        'type' => 'OBJECT',
                        'properties' => [
                            'name' => [
                                'type' => 'STRING',
                                'description' => 'Nama item anggaran, contoh: Sewa Panggung, Konsumsi Panitia, Honor Pembicara'
                            ],
                            'unit' => [
                                'type' => 'STRING',
                                'description' => 'Satuan item, contoh: Hari, Pax, Set, Unit, Jam'
                            ],
                            'quantity' => [
                                'type' => 'INTEGER',
                                'description' => 'Jumlah kuantitas item'
                            ],
                            'unit_price' => [
                                'type' => 'INTEGER',
                                'description' => 'Harga satuan dalam Rupiah'
                            ],
                            'notes' => [
                                'type' => 'STRING',
                                'description' => 'Keterangan tambahan untuk item anggaran tersebut'
                            ]
                        ],
                        'required' => ['name', 'unit', 'quantity', 'unit_price']
                    ]
                ],
                'timeplan_items' => [
                    'type' => 'ARRAY',
                    'description' => 'Daftar rundown persiapan dan pelaksanaan acara',
                    'items' => [
                        'type' => 'OBJECT',
                        'properties' => [
                            'day_offset' => [
                                'type' => 'STRING',
                                'description' => 'Offset hari relatif terhadap hari H. Contoh: H-30, H-7, H-1, atau Hari Pelaksanaan'
                            ],
                            'time_start' => [
                                'type' => 'STRING',
                                'description' => 'Waktu mulai dalam format HH:MM. Isi null untuk persiapan hari sebelum hari H. Contoh: 08:00'
                            ],
                            'time_end' => [
                                'type' => 'STRING',
                                'description' => 'Waktu selesai dalam format HH:MM. Isi null jika tidak ada waktu berakhir. Contoh: 09:00'
                            ],
                            'activity' => [
                                'type' => 'STRING',
                                'description' => 'Nama kegiatan atau tugas yang harus dilakukan'
                            ],
                            'pic' => [
                                'type' => 'STRING',
                                'description' => 'Pihak penanggung jawab (Person In Charge). Contoh: PJ Acara, Humas, Vendor, Seluruh Panitia'
                            ],
                            'notes' => [
                                'type' => 'STRING',
                                'description' => 'Detail deskripsi tugas atau catatan khusus'
                            ]
                        ],
                        'required' => ['day_offset', 'activity', 'pic']
                    ]
                ]
            ],
            'required' => ['budget_items', 'timeplan_items']
        ];

        try {
            $response = Http::timeout(60)->post($url, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                'systemInstruction' => [
                    'parts' => [
                        ['text' => $systemInstructions]
                    ]
                ],
                'generationConfig' => [
                    'responseMimeType' => 'application/json',
                    'responseSchema' => $schema,
                    'temperature' => 0.7
                ]
            ]);

            if ($response->failed()) {
                Log::error('Gemini API Error: ' . $response->body());
                throw new \Exception('Gagal menghubungi API Gemini: ' . ($response->json('error.message') ?: 'Koneksi gagal.'));
            }

            $result = $response->json();
            $textResponse = $result['candidates'][0]['content']['parts'][0]['text'] ?? '';
            
            if (empty($textResponse)) {
                throw new \Exception('Respon dari Gemini kosong.');
            }

            $decoded = json_decode($textResponse, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception('Gagal melakukan parsing data JSON dari AI.');
            }

            return $decoded;

        } catch (\Exception $e) {
            Log::error('Gemini Service Exception: ' . $e->getMessage());
            throw $e;
        }
    }
}
