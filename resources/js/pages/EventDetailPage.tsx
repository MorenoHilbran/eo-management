import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePaginatedQuery, useMutation, useQuery, useCurrency } from '@/hooks';
import { eventService, rabService } from '@/lib/services';
import { Event, RABItem, RABTotal, BudgetStatus, CreateRABItemRequest, EventTimeplan, CreateTimeplanRequest } from '@/types/api';
import { RABTable, RABForm } from '@/components/rab/RABForm';
import { TimeplanTable, TimeplanForm } from '@/components/timeplan/TimeplanTable';
import { TimeplanTimeline } from '@/components/timeplan/TimeplanTimeline';
import { AIPositioningWizard } from '@/components/events/AIPositioningWizard';
import { LoadingSkeleton, ErrorMessage, Pagination } from '@/components/common';
import { Sparkles, DollarSign, Calendar, Plus, LayoutList, GanttChartSquare } from 'lucide-react';

export default function EventDetailPage() {
    const { eventId } = useParams<{ eventId: string }>();
    const { format: formatCurrency } = useCurrency();
    
    const [activeTab, setActiveTab] = useState<'rab' | 'timeplan'>('rab');
    const [isAIWizardOpen, setIsAIWizardOpen] = useState(false);
    const [timeplanView, setTimeplanView] = useState<'list' | 'timeline'>('timeline');

    // RAB states
    const [showRABForm, setShowRABForm] = useState(false);
    const [editingItem, setEditingItem] = useState<RABItem | null>(null);

    // Timeplan states
    const [showTimeplanForm, setShowTimeplanForm] = useState(false);
    const [editingTimeplan, setEditingTimeplan] = useState<EventTimeplan | null>(null);

    // Fetch event
    const { data: event, loading: eventLoading, error: eventError, refetch: refetchEvent } = 
        useQuery<Event>(() => eventService.getEvent(Number(eventId)));

    // Fetch RAB items
    const { data: rabItemsData, loading: rabLoading, error: rabError, page, setPage, total, refetch: refetchRAB } = 
        usePaginatedQuery((page) => eventService.getRabItems(Number(eventId), page));
    const rabItems = Array.isArray(rabItemsData) ? rabItemsData : [];

    // Fetch RAB total
    const { data: rabTotal, refetch: refetchRABTotal } = 
        useQuery<RABTotal>(() => eventService.getRabTotal(Number(eventId)));

    // Fetch budget status
    const { data: budgetStatus, refetch: refetchBudgetStatus } = 
        useQuery<BudgetStatus>(() => eventService.getBudgetStatus(Number(eventId)));

    // Fetch Timeplans
    const { data: timeplansData, loading: timeplanLoading, error: timeplanError, refetch: refetchTimeplan } = 
        useQuery<EventTimeplan[]>(() => eventService.getTimeplans(Number(eventId)));
    const timeplans = Array.isArray(timeplansData) ? timeplansData : [];

    // Save RAB item
    const { mutate: saveRABItem, loading: isSavingRAB } = useMutation(
        (data: CreateRABItemRequest) =>
            editingItem
                ? rabService.updateItem(editingItem.id, data)
                : rabService.createItem(data),
        {
            onSuccess: () => {
                setShowRABForm(false);
                setEditingItem(null);
                refetchRAB();
                refetchRABTotal();
                refetchBudgetStatus();
            },
        }
    );

    // Delete RAB item
    const { mutate: deleteRABItem } = useMutation(
        (id: number) => rabService.deleteItem(id),
        {
            onSuccess: () => {
                refetchRAB();
                refetchRABTotal();
                refetchBudgetStatus();
            },
        }
    );

    // Save Timeplan Item
    const { mutate: saveTimeplan, loading: isSavingTimeplan } = useMutation(
        (data: CreateTimeplanRequest) =>
            editingTimeplan
                ? eventService.updateTimeplan(editingTimeplan.id, data)
                : eventService.storeTimeplan(Number(eventId), data),
        {
            onSuccess: () => {
                setShowTimeplanForm(false);
                setEditingTimeplan(null);
                refetchTimeplan();
            },
        }
    );

    // Delete Timeplan Item
    const { mutate: deleteTimeplan } = useMutation(
        (id: number) => eventService.destroyTimeplan(id),
        {
            onSuccess: () => {
                refetchTimeplan();
            },
        }
    );

    const handleEditRAB = (item: RABItem) => {
        setEditingItem(item);
        setShowRABForm(true);
    };

    const handleDeleteRAB = (item: RABItem) => {
        if (confirm(`Hapus item "${item.name}"?`)) {
            deleteRABItem(item.id);
        }
    };

    const handleCancelRAB = () => {
        setShowRABForm(false);
        setEditingItem(null);
    };

    const handleEditTimeplan = (item: EventTimeplan) => {
        setEditingTimeplan(item);
        setShowTimeplanForm(true);
    };

    const handleDeleteTimeplan = (item: EventTimeplan) => {
        if (confirm(`Hapus kegiatan "${item.activity}"?`)) {
            deleteTimeplan(item.id);
        }
    };

    const handleCancelTimeplan = () => {
        setShowTimeplanForm(false);
        setEditingTimeplan(null);
    };

    const handleAIWizardSuccess = () => {
        refetchRAB();
        refetchRABTotal();
        refetchBudgetStatus();
        refetchTimeplan();
    };

    const totalPages = Math.ceil(total / 15);

    return (
        <div className="space-y-6">
            {/* Event Header */}
            {eventLoading ? (
                <LoadingSkeleton count={1} height="h-20" />
            ) : eventError ? (
                <ErrorMessage onRetry={refetchEvent} />
            ) : event ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
                    <div className="flex justify-between items-start gap-4 flex-wrap">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">{event.name}</h1>
                            <p className="text-slate-500 mt-2 flex items-center gap-1.5 text-sm">
                                📍 {event.location || 'Lokasi belum diatur'}
                            </p>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                            event.status === 'planning' ? 'bg-sky-50 text-sky-700 ring-1 ring-sky-200' :
                            event.status === 'ongoing' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' :
                            event.status === 'completed' ? 'bg-slate-100 text-slate-700 ring-1 ring-slate-200' :
                            'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
                        }`}>
                            {event.status}
                        </span>
                    </div>
                </div>
            ) : null}

            {/* Budget Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Target Budget</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">
                        {event ? formatCurrency(event.budget) : '-'}
                    </p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Estimasi Pengeluaran</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">
                        {rabTotal ? formatCurrency(rabTotal.total_cost) : '-'}
                    </p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rekomendasi Margin (15%)</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">
                        {rabTotal ? formatCurrency(rabTotal.margin) : '-'}
                    </p>
                </div>
                <div className={`rounded-2xl border p-4 shadow-2xs transition-colors ${
                    budgetStatus?.budget_alert 
                        ? 'bg-rose-50/50 border-rose-200' 
                        : 'bg-white border-slate-200'
                }`}>
                    <p className={`text-xs font-semibold uppercase tracking-wider ${budgetStatus?.budget_alert ? 'text-rose-600' : 'text-slate-500'}`}>
                        Sisa Budget
                    </p>
                    <p className={`text-2xl font-bold mt-2 ${budgetStatus?.budget_alert ? 'text-rose-900' : 'text-slate-900'}`}>
                        {budgetStatus ? formatCurrency(budgetStatus.remaining) : '-'}
                    </p>
                    {budgetStatus?.budget_alert && (
                        <p className="text-[10px] font-semibold text-rose-600 mt-1">⚠️ Sisa anggaran menipis!</p>
                    )}
                </div>
            </div>

            {/* Navigation Tabs & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 gap-4">
                <div className="flex space-x-6">
                    <button
                        onClick={() => setActiveTab('rab')}
                        className={`py-3 px-1 border-b-2 font-semibold text-sm transition-colors flex items-center gap-2 ${
                            activeTab === 'rab'
                                ? 'border-sky-600 text-sky-700'
                                : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        <DollarSign className="h-4 w-4" />
                        Rencana Anggaran Biaya (RAB)
                    </button>
                    <button
                        onClick={() => setActiveTab('timeplan')}
                        className={`py-3 px-1 border-b-2 font-semibold text-sm transition-colors flex items-center gap-2 ${
                            activeTab === 'timeplan'
                                ? 'border-sky-600 text-sky-700'
                                : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        <Calendar className="h-4 w-4" />
                        Jadwal Kegiatan (Timeplan)
                    </button>
                </div>

                <button
                    onClick={() => setIsAIWizardOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-linear-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors mb-2 sm:mb-0"
                >
                    <Sparkles className="h-3.5 w-3.5" />
                    ⚡ Generate AI Plan
                </button>
            </div>

            {/* Tab content: RAB */}
            {activeTab === 'rab' && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
                    <div className="flex justify-between items-center flex-wrap gap-3">
                        <h2 className="text-xl font-bold text-slate-900">Rencana Anggaran Biaya (RAB)</h2>
                        {!showRABForm && (
                            <button
                                onClick={() => setShowRABForm(true)}
                                className="inline-flex items-center gap-1 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-2xs"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                Tambah Item
                            </button>
                        )}
                    </div>

                    {showRABForm && (
                        <div className="mb-6 pb-6 border-b border-slate-100">
                            <RABForm
                                item={editingItem || undefined}
                                onSubmit={async (data) => {
                                    await saveRABItem({ ...data, event_id: Number(eventId) });
                                }}
                                loading={isSavingRAB}
                                onCancel={handleCancelRAB}
                            />
                        </div>
                    )}

                    {rabError ? (
                        <ErrorMessage onRetry={refetchRAB} />
                    ) : (
                        <>
                            <RABTable
                                items={rabItems || []}
                                loading={rabLoading}
                                onEdit={handleEditRAB}
                                onDelete={handleDeleteRAB}
                            />

                            {!rabLoading && totalPages > 1 && (
                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChange={setPage}
                                />
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Tab content: Timeplan */}
            {activeTab === 'timeplan' && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
                    {/* Header row */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Jadwal Acara &amp; Persiapan</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Berdasarkan tanggal acara: <strong className="text-slate-600">{event?.event_date ? new Date(event.event_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</strong></p>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* View toggle */}
                            <div className="flex bg-slate-100 rounded-xl p-1 gap-0.5">
                                <button
                                    onClick={() => setTimeplanView('timeline')}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                        timeplanView === 'timeline'
                                            ? 'bg-white text-slate-900 shadow-xs'
                                            : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                    title="Tampilan Timeline"
                                >
                                    <GanttChartSquare className="h-3.5 w-3.5" />
                                    Timeline
                                </button>
                                <button
                                    onClick={() => setTimeplanView('list')}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                        timeplanView === 'list'
                                            ? 'bg-white text-slate-900 shadow-xs'
                                            : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                    title="Tampilan List"
                                >
                                    <LayoutList className="h-3.5 w-3.5" />
                                    List
                                </button>
                            </div>
                            {!showTimeplanForm && (
                                <button
                                    onClick={() => setShowTimeplanForm(true)}
                                    className="inline-flex items-center gap-1 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-2xs"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    Tambah Jadwal
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Add/Edit form */}
                    {showTimeplanForm && (
                        <div className="pb-5 border-b border-slate-100">
                            <TimeplanForm
                                item={editingTimeplan || undefined}
                                onSubmit={async (data) => {
                                    await saveTimeplan(data);
                                }}
                                loading={isSavingTimeplan}
                                onCancel={handleCancelTimeplan}
                            />
                        </div>
                    )}

                    {/* Content based on view mode */}
                    {timeplanError ? (
                        <ErrorMessage onRetry={refetchTimeplan} />
                    ) : timeplanView === 'timeline' ? (
                        <TimeplanTimeline
                            items={timeplans}
                            eventDate={event?.event_date || new Date().toISOString()}
                            loading={timeplanLoading}
                            onEdit={handleEditTimeplan}
                            onDelete={handleDeleteTimeplan}
                        />
                    ) : (
                        <TimeplanTable
                            items={timeplans}
                            loading={timeplanLoading}
                            onEdit={handleEditTimeplan}
                            onDelete={handleDeleteTimeplan}
                        />
                    )}
                </div>
            )}

            {/* AI Wizard Modal */}
            <AIPositioningWizard
                eventId={Number(eventId)}
                eventBudget={event ? parseFloat(event.budget) : 0}
                isOpen={isAIWizardOpen}
                onClose={() => setIsAIWizardOpen(false)}
                onSuccess={handleAIWizardSuccess}
            />
        </div>
    );
}
