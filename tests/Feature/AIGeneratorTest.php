<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\EventTimeplan;
use App\Models\RABItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AIGeneratorTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Event $event;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->event = Event::factory()->create([
            'created_by' => $this->user->id,
            'budget' => 10000000,
        ]);
    }

    public function test_guests_cannot_access_ai_generator()
    {
        $response = $this->postJson("/api/events/{$this->event->id}/generate-ai-plan");
        $response->assertStatus(401);
    }

    public function test_authenticated_users_can_generate_ai_plan()
    {
        $this->actingAs($this->user, 'sanctum');

        // Mock the Gemini API call
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                [
                                    'text' => json_encode([
                                        'budget_items' => [
                                            [
                                                'name' => 'Sewa Gedung',
                                                'unit' => 'Hari',
                                                'quantity' => 1,
                                                'unit_price' => 5000000,
                                                'notes' => 'Gedung Serbaguna',
                                            ]
                                        ],
                                        'timeplan_items' => [
                                            [
                                                'day_offset' => 'H-1',
                                                'time_start' => null,
                                                'time_end' => null,
                                                'activity' => 'Geladi Resik',
                                                'pic' => 'Seksi Acara',
                                                'notes' => 'Wajib hadir semua panitia',
                                            ]
                                        ]
                                    ])
                                ]
                            ]
                        ]
                    ]
                ]
            ], 200)
        ]);

        // Put a fake key in config for testing
        config(['services.gemini.key' => 'fake-key']);

        $response = $this->postJson("/api/events/{$this->event->id}/generate-ai-plan", [
            'prompt' => 'Tolong buatkan plan yang hemat',
        ]);

        $response->assertOk();
        $response->assertJsonStructure([
            'budget_items' => [
                '*' => ['name', 'unit', 'quantity', 'unit_price', 'notes']
            ],
            'timeplan_items' => [
                '*' => ['day_offset', 'time_start', 'time_end', 'activity', 'pic', 'notes']
            ]
        ]);
    }

    public function test_users_can_apply_ai_plan_to_event()
    {
        $this->actingAs($this->user, 'sanctum');

        $payload = [
            'mode' => 'overwrite',
            'budget_items' => [
                [
                    'name' => 'Konsumsi Peserta',
                    'unit' => 'Pax',
                    'quantity' => 100,
                    'unit_price' => 25000,
                    'notes' => 'Nasi Kotak',
                ]
            ],
            'timeplan_items' => [
                [
                    'day_offset' => 'Hari Pelaksanaan',
                    'time_start' => '08:00',
                    'time_end' => '09:00',
                    'activity' => 'Registrasi Ulang',
                    'pic' => 'Penerima Tamu',
                    'notes' => 'Bawa fotokopi KTM',
                ]
            ]
        ];

        $response = $this->postJson("/api/events/{$this->event->id}/apply-ai-plan", $payload);

        $response->assertOk();
        $response->assertJson([
            'message' => 'Rekomendasi AI berhasil diterapkan ke event!'
        ]);

        // Verify items exist in DB
        $this->assertDatabaseHas('rab_items', [
            'event_id' => $this->event->id,
            'name' => 'Konsumsi Peserta',
            'total_price' => 2500000,
        ]);

        $this->assertDatabaseHas('event_timeplans', [
            'event_id' => $this->event->id,
            'activity' => 'Registrasi Ulang',
            'time_start' => '08:00',
        ]);
    }

    public function test_timeplan_crud_operations()
    {
        $this->actingAs($this->user, 'sanctum');

        // Test Store Timeplan
        $response = $this->postJson("/api/events/{$this->event->id}/timeplans", [
            'day_offset' => 'H-1',
            'activity' => 'Briefing Panitia',
            'pic' => 'Ketua Pelaksana',
            'notes' => 'Di aula',
        ]);
        $response->assertStatus(201);
        $timeplanId = $response->json('id');

        // Test Get Timeplans
        $getResponse = $this->getJson("/api/events/{$this->event->id}/timeplans");
        $getResponse->assertOk();
        $getResponse->assertJsonCount(1);

        // Test Update Timeplan
        $updateResponse = $this->putJson("/api/timeplans/{$timeplanId}", [
            'activity' => 'Briefing Final Panitia',
        ]);
        $updateResponse->assertOk();
        $this->assertDatabaseHas('event_timeplans', [
            'id' => $timeplanId,
            'activity' => 'Briefing Final Panitia',
        ]);

        // Test Delete Timeplan
        $deleteResponse = $this->deleteJson("/api/timeplans/{$timeplanId}");
        $deleteResponse->assertStatus(204);
        $this->assertDatabaseMissing('event_timeplans', [
            'id' => $timeplanId,
        ]);
    }
}
