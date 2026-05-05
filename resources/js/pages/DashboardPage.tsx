import React from 'react';
import { useQuery } from '@/hooks';
import { eventService } from '@/lib/services';
import { useCurrency } from '@/hooks';
import { DashboardStats, Event } from '@/types/api';
import { LoadingSkeleton, ErrorMessage } from '@/components/common';

export default function DashboardPage() {
    const { format: formatCurrency } = useCurrency();

    // Dashboard stats
    const {
        data: stats,
        loading: statsLoading,
        error: statsError,
        refetch: refetchStats,
    } = useQuery<any>(() => eventService.getDashboardStats());

    // Recent events
    const {
        data: recentEvents,
        loading: eventsLoading,
    } = useQuery<any>(() => eventService.getEvents(1));

    /**
     * SAFE ARRAY HANDLER
     * Support:
     * - []
     * - { data: [] }
     * - null
     * - undefined
     */
    const events: Event[] = Array.isArray(recentEvents)
        ? recentEvents
        : Array.isArray(recentEvents?.data)
            ? recentEvents.data
            : [];

    const statCards = [
        {
            label: 'Total Event',
            value: stats?.total_events || 0,
            icon: '📅',
            color: 'bg-blue-50 border-blue-200',
        },
        {
            label: 'Sedang Berlangsung',
            value: stats?.ongoing_events || 0,
            icon: '🔄',
            color: 'bg-green-50 border-green-200',
        },
        {
            label: 'Selesai',
            value: stats?.completed_events || 0,
            icon: '✓',
            color: 'bg-gray-50 border-gray-200',
        },
        {
            label: 'Total Budget',
            value: formatCurrency(stats?.total_budget || 0),
            icon: '💰',
            color: 'bg-purple-50 border-purple-200',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">
                    Ringkasan data event dan keuangan
                </p>
            </div>

            {/* Stats */}
            {statsError ? (
                <ErrorMessage onRetry={refetchStats} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statsLoading
                        ? Array(4)
                            .fill(0)
                            .map((_, i) => (
                                <div
                                    key={i}
                                    className="h-28 bg-gray-200 rounded-lg animate-pulse"
                                />
                            ))
                        : statCards.map((card, index) => (
                            <div
                                key={index}
                                className={`border ${card.color} rounded-lg p-6 hover:shadow-md transition`}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">
                                            {card.label}
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mt-2">
                                            {card.value}
                                        </p>
                                    </div>
                                    <div className="text-4xl">{card.icon}</div>
                                </div>
                            </div>
                        ))}
                </div>
            )}

            {/* Recent Events */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                        Event Terbaru
                    </h2>
                    <a
                        href="/events"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        Lihat Semua →
                    </a>
                </div>

                {eventsLoading ? (
                    <LoadingSkeleton count={3} />
                ) : events.length === 0 ? (
                    <div className="text-center py-8 text-gray-600">
                        Belum ada event.{' '}
                        <a
                            href="/events/create"
                            className="text-blue-600 hover:underline"
                        >
                            Buat event baru
                        </a>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {events.slice(0, 5).map((event: Event) => (
                            <div
                                key={event.id}
                                className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50"
                            >
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        {event.name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {event.location}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">
                                        {formatCurrency(event.budget)}
                                    </p>

                                    <p
                                        className={`text-xs font-medium ${event.status === 'ongoing'
                                                ? 'text-green-600'
                                                : event.status === 'completed'
                                                    ? 'text-gray-600'
                                                    : 'text-blue-600'
                                            }`}
                                    >
                                        {event.status}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Aksi Cepat
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <a
                        href="/events/create"
                        className="p-4 bg-white border rounded-lg text-center hover:shadow-md"
                    >
                        <div className="text-2xl mb-2">+</div>
                        <div className="text-sm font-medium">Buat Event</div>
                    </a>

                    <a
                        href="/vendors"
                        className="p-4 bg-white border rounded-lg text-center hover:shadow-md"
                    >
                        <div className="text-2xl mb-2">👥</div>
                        <div className="text-sm font-medium">Kelola Vendor</div>
                    </a>

                    <a
                        href="/transactions"
                        className="p-4 bg-white border rounded-lg text-center hover:shadow-md"
                    >
                        <div className="text-2xl mb-2">💳</div>
                        <div className="text-sm font-medium">Transaksi</div>
                    </a>

                    <a
                        href="/sops"
                        className="p-4 bg-white border rounded-lg text-center hover:shadow-md"
                    >
                        <div className="text-2xl mb-2">📋</div>
                        <div className="text-sm font-medium">SOP</div>
                    </a>
                </div>
            </div>
        </div>
    );
}