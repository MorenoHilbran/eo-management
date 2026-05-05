import React from 'react';
import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    ClipboardList,
    CreditCard,
    DollarSign,
    LayoutDashboard,
    LineChart,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    Users,
} from 'lucide-react';
import { useQuery } from '@/hooks';
import { eventService } from '@/lib/services';
import { useCurrency } from '@/hooks';
import { Event } from '@/types/api';
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
            label: 'Event',
            value: stats?.total_events || 0,
            subtitle: formatCurrency(stats?.total_budget || 0),
            icon: CalendarDays,
            accent: 'from-sky-500 to-cyan-400',
            hint: 'Total Budget',
            href: '/events',
        },
        {
            label: 'Vendor',
            value: stats?.total_vendors || 0,
            subtitle: 'Data dalam database',
            icon: Users,
            accent: 'from-emerald-500 to-teal-400',
            hint: 'Mitra Terdaftar',
            href: '/vendors',
        },
        {
            label: 'SOP',
            value: stats?.total_sops || 0,
            subtitle: 'Dokumen tersimpan',
            icon: ClipboardList,
            accent: 'from-purple-500 to-pink-400',
            hint: 'Library prosedur',
            href: '/sops',
        },
        {
            label: 'Transactions',
            value: stats?.total_transactions || 0,
            subtitle: formatCurrency(stats?.total_spent || 0),
            icon: CreditCard,
            accent: 'from-amber-500 to-orange-400',
            hint: 'Total Pengeluaran',
            href: '/transactions',
        },
    ];

    const quickActions = [
        {
            label: 'Buat Event',
            href: '/events/create',
            icon: LayoutDashboard,
            description: 'Tambahkan agenda baru',
        },
        {
            label: 'Kelola Vendor',
            href: '/vendors',
            icon: Users,
            description: 'Pantau mitra kerja',
        },
        {
            label: 'Transaksi',
            href: '/transactions',
            icon: CreditCard,
            description: 'Lacak arus biaya',
        },
        {
            label: 'SOP',
            href: '/sops',
            icon: ClipboardList,
            description: 'Akses template standar',
        },
    ];

    const activeEvents = events.filter((event) => event.status === 'ongoing').length;
    const completedEvents = events.filter((event) => event.status === 'completed').length;
    const planningEvents = events.filter((event) => event.status === 'planning').length;
    const budgetUtilization = stats?.total_budget
        ? Math.min(100, Math.round(((stats?.total_spent || 0) / stats.total_budget) * 100))
        : 0;

    const eventStatusMeta = {
        ongoing: {
            label: 'Berjalan',
            className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
        },
        completed: {
            label: 'Selesai',
            className: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
        },
        planning: {
            label: 'Rencana',
            className: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
        },
        cancelled: {
            label: 'Dibatalkan',
            className: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
        },
    } as const;

    return (
        <div className="space-y-8">
            <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-br from-slate-950 via-slate-900 to-sky-900 px-6 py-8 text-white shadow-[0_24px_80px_-24px_rgba(15,23,42,0.55)] sm:px-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.28),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.18),transparent_30%)]" />
                <div className="relative grid gap-6 lg:grid-cols-[1.4fr_0.9fr] lg:items-center">
                    <div className="space-y-5">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-medium text-sky-100 backdrop-blur">
                            <Sparkles className="h-3.5 w-3.5" />
                            Central monitoring panel
                        </div>
                        <div className="space-y-3">
                            <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                                Dashboard yang lebih bersih untuk memantau event, budget, dan progres kerja.
                            </h1>
                            <p className="max-w-xl text-sm leading-6 text-slate-200 sm:text-base">
                                Semua metrik penting diringkas dalam satu tampilan agar tim bisa membaca kondisi operasional dengan cepat.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <a
                                href="/events/create"
                                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-sky-50"
                            >
                                Buat Event
                                <ArrowRight className="h-4 w-4" />
                            </a>
                            <a
                                href="/transactions"
                                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
                            >
                                Lihat Arus Dana
                            </a>
                        </div>
                    </div>

                    <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm sm:grid-cols-3 lg:grid-cols-1">
                        <div className="rounded-2xl bg-white/10 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Event aktif</p>
                            <p className="mt-2 text-3xl font-semibold">{activeEvents}</p>
                            <p className="mt-1 text-sm text-slate-300">Sedang berjalan</p>
                        </div>
                        <div className="rounded-2xl bg-white/10 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Tuntas</p>
                            <p className="mt-2 text-3xl font-semibold">{completedEvents}</p>
                            <p className="mt-1 text-sm text-slate-300">Event selesai</p>
                        </div>
                        <div className="rounded-2xl bg-white/10 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Rencana</p>
                            <p className="mt-2 text-3xl font-semibold">{planningEvents}</p>
                            <p className="mt-1 text-sm text-slate-300">Masih disiapkan</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Menu Stats */}
            {statsError ? (
                <ErrorMessage onRetry={refetchStats} />
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {statsLoading
                        ? Array(4)
                            .fill(0)
                            .map((_, i) => (
                                <div
                                    key={i}
                                    className="h-40 animate-pulse rounded-3xl border border-slate-200 bg-slate-100"
                                />
                            ))
                        : statCards.map((card, index) => (
                            <a
                                key={index}
                                href={card.href}
                                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
                            >
                                <div className={`absolute inset-x-0 top-0 h-1.5 bg-linear-to-r ${card.accent}`} />
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-4">
                                        <div className={`inline-flex rounded-2xl bg-linear-to-br ${card.accent} p-3 text-white shadow-lg`}>
                                            <card.icon className="h-5 w-5" />
                                        </div>
                                        <p className="text-3xl font-bold tracking-tight text-slate-900">
                                            {card.value}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
                                            {card.label}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 border-t border-slate-100 pt-3">
                                    <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-400">
                                        {card.hint}
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-slate-700">
                                        {card.subtitle}
                                    </p>
                                </div>
                                <div className="absolute top-4 right-4 opacity-0 transition group-hover:opacity-100">
                                    <ArrowRight className="h-4 w-4 text-slate-400" />
                                </div>
                            </a>
                        ))}
                </div>
            )}

            <div className="grid gap-8 xl:grid-cols-[1.3fr_0.9fr]">
                {/* Recent Events */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
                                Live activity
                            </p>
                            <h2 className="mt-2 text-xl font-semibold text-slate-900">
                                Event Terbaru
                            </h2>
                        </div>
                        <a
                            href="/events"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition hover:text-sky-800"
                        >
                            Lihat semua
                            <ArrowRight className="h-4 w-4" />
                        </a>
                    </div>

                    {eventsLoading ? (
                        <LoadingSkeleton count={4} />
                    ) : events.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-slate-600">
                            Belum ada event yang masuk ke dashboard.
                            <div className="mt-4">
                                <a
                                    href="/events/create"
                                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                                >
                                    Buat event baru
                                    <ArrowRight className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {events.slice(0, 5).map((event: Event) => {
                                const statusMeta =
                                    eventStatusMeta[event.status as keyof typeof eventStatusMeta] || {
                                        label: event.status,
                                        className: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
                                    };

                                return (
                                    <div
                                        key={event.id}
                                        className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition hover:border-sky-200 hover:bg-sky-50/60 md:flex-row md:items-center md:justify-between"
                                    >
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <p className="font-semibold text-slate-900">
                                                    {event.name}
                                                </p>
                                                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusMeta.className}`}>
                                                    {statusMeta.label}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500">
                                                {event.location || 'Lokasi belum diatur'}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between gap-6 md:justify-end">
                                            <div className="min-w-28 text-right">
                                                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                                                    Budget
                                                </p>
                                                <p className="mt-1 font-semibold text-slate-900">
                                                    {formatCurrency(event.budget)}
                                                </p>
                                            </div>
                                            <a
                                                href={`/events/${event.id}`}
                                                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 transition group-hover:text-sky-700"
                                            >
                                                <ArrowRight className="h-4 w-4" />
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Finance summary */}
                <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
                            Financial overview
                        </p>
                        <h3 className="mt-2 text-xl font-semibold text-slate-900">
                            Ringkasan Budget
                        </h3>
                    </div>

                    <div className="rounded-2xl bg-slate-950 p-5 text-white">
                        <div className="flex items-center gap-3 text-sm text-slate-300">
                            <div className="rounded-xl bg-white/10 p-2">
                                <TrendingUp className="h-4 w-4" />
                            </div>
                            Budget utilization
                        </div>
                        <p className="mt-4 text-3xl font-semibold">
                            {budgetUtilization}%
                        </p>
                        <p className="mt-1 text-sm text-slate-300">
                            Berdasarkan budget vs spending saat ini.
                        </p>
                        <div className="mt-4 h-2 rounded-full bg-white/10">
                            <div
                                className="h-2 rounded-full bg-linear-to-r from-sky-400 to-emerald-400"
                                style={{ width: `${budgetUtilization}%` }}
                            />
                        </div>
                    </div>

                    <div className="grid gap-3">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-sky-100 p-2 text-sky-700">
                                        <DollarSign className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Total Budget</p>
                                        <p className="text-lg font-semibold text-slate-900">{formatCurrency(stats?.total_budget || 0)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-amber-100 p-2 text-amber-700">
                                        <CreditCard className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Total Spend</p>
                                        <p className="text-lg font-semibold text-slate-900">{formatCurrency(stats?.total_spent || 0)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
                                        <ShieldCheck className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Estimated Profit</p>
                                        <p className="text-lg font-semibold text-slate-900">{formatCurrency((stats?.total_budget || 0) - (stats?.total_spent || 0))}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Status overview</p>
                                <p className="text-base font-semibold text-slate-900">Operasional event</p>
                            </div>
                            <LayoutDashboard className="h-5 w-5 text-slate-400" />
                        </div>
                        <div className="space-y-3">
                            <div>
                                <div className="mb-1 flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Berjalan</span>
                                    <span className="font-semibold text-slate-900">{activeEvents}</span>
                                </div>
                                <div className="h-2 rounded-full bg-slate-200">
                                    <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${events.length ? Math.round((activeEvents / events.length) * 100) : 0}%` }} />
                                </div>
                            </div>
                            <div>
                                <div className="mb-1 flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Selesai</span>
                                    <span className="font-semibold text-slate-900">{completedEvents}</span>
                                </div>
                                <div className="h-2 rounded-full bg-slate-200">
                                    <div className="h-2 rounded-full bg-slate-500" style={{ width: `${events.length ? Math.round((completedEvents / events.length) * 100) : 0}%` }} />
                                </div>
                            </div>
                            <div>
                                <div className="mb-1 flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Rencana</span>
                                    <span className="font-semibold text-slate-900">{planningEvents}</span>
                                </div>
                                <div className="h-2 rounded-full bg-slate-200">
                                    <div className="h-2 rounded-full bg-sky-500" style={{ width: `${events.length ? Math.round((planningEvents / events.length) * 100) : 0}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
                            Fast access
                        </p>
                        <h3 className="mt-2 text-xl font-semibold text-slate-900">
                            Aksi Cepat
                        </h3>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400" />
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {quickActions.map((action) => (
                        <a
                            key={action.href}
                            href={action.href}
                            className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-sky-200 hover:bg-white hover:shadow-md"
                        >
                            <div className="inline-flex rounded-2xl bg-slate-900 p-3 text-white transition group-hover:bg-sky-600">
                                <action.icon className="h-5 w-5" />
                            </div>
                            <div className="mt-4 flex items-center justify-between gap-4">
                                <div>
                                    <p className="font-semibold text-slate-900">{action.label}</p>
                                    <p className="mt-1 text-sm text-slate-500">{action.description}</p>
                                </div>
                                <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-sky-700" />
                            </div>
                        </a>
                    ))}
                </div>
            </section>
        </div>
    );
}