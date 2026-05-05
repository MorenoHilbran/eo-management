<?php

namespace Database\Factories;

use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;

class TransactionFactory extends Factory
{
    protected $model = Transaction::class;

    public function definition(): array
    {
        $descriptions = [
            'Pembayaran layanan katering untuk acara',
            'Sewa tempat venue dan fasilitas penunjang',
            'Biaya rental audio dan sistem sound',
            'Biaya pencahayaan dan efek visual profesional',
            'Biaya dekorasi dan tata ruang acara',
            'Pembayaran jasa fotografi dan videografi',
            'Biaya transportasi dan logistik barang',
            'Biaya layanan keamanan dan proteksi',
            'Honorarium artis dan performer',
            'Biaya percetakan materi promosi',
            'Pembayaran uang muka untuk layanan vendor',
            'Biaya tambahan dan contingency fund',
            'Pembayaran final untuk layanan jasa',
            'Biaya akomodasi dan konsumsi tim',
            'Reimburse biaya operasional acara',
        ];

        $statuses = ['pending', 'approved', 'rejected'];
        $randomStatus = $this->faker->randomElement($statuses);

        return [
            'event_id' => $this->faker->numberBetween(1, 5),
            'amount' => $this->faker->numberBetween(5000000, 50000000),
            'description' => $this->faker->randomElement($descriptions),
            'status' => $randomStatus,
            'transaction_date' => $this->faker->dateTimeBetween('-60 days', 'now'),
            'created_by' => 1,
            'approved_by' => $randomStatus === 'approved' ? 1 : null,
            'approved_at' => $randomStatus === 'approved' ? $this->faker->dateTimeBetween('-30 days', 'now') : null,
            'rejection_reason' => $randomStatus === 'rejected' ? $this->faker->randomElement(['Tidak sesuai budget', 'Perlu klarifikasi lebih lanjut', 'Belum ada approval', 'Dana belum cair']) : null,
        ];
    }
}
