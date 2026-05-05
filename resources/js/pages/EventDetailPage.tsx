import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePaginatedQuery, useMutation, useQuery, useCurrency } from '@/hooks';
import { eventService, rabService } from '@/lib/services';
import { Event, RABItem, RABTotal, CreateRABItemRequest } from '@/types/api';
import { RABTable, RABForm } from '@/components/rab/RABForm';
import { LoadingSkeleton, ErrorMessage, Pagination } from '@/components/common';

export default function EventDetailPage() {
    const { eventId } = useParams<{ eventId: string }>();
    const { format: formatCurrency } = useCurrency();
    
    const [showRABForm, setShowRABForm] = useState(false);
    const [editingItem, setEditingItem] = useState<RABItem | null>(null);

    // Fetch event
    const { data: event, loading: eventLoading, error: eventError, refetch: refetchEvent } = 
        useQuery<Event>(() => eventService.getEvent(Number(eventId)));

    // Fetch RAB items
    const { data: rabItems, loading: rabLoading, error: rabError, page, setPage, total, refetch: refetchRAB } = 
        usePaginatedQuery((page) => eventService.getRabItems(Number(eventId), page));

    // Fetch RAB total
    const { data: rabTotal, refetch: refetchRABTotal } = 
        useQuery<RABTotal>(() => eventService.getRabTotal(Number(eventId)));

    // Fetch budget status
    const { data: budgetStatus } = 
        useQuery(() => eventService.getBudgetStatus(Number(eventId)));

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

    const totalPages = Math.ceil(total / 15);

    return (
        <div className="space-y-6">
            {/* Event Header */}
            {eventLoading ? (
                <LoadingSkeleton count={1} height="h-20" />
            ) : eventError ? (
                <ErrorMessage onRetry={refetchEvent} />
            ) : event ? (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
                            <p className="text-gray-600 mt-2">{event.location}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            event.status === 'planning' ? 'bg-blue-100 text-blue-800' :
                            event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                            event.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                            {event.status}
                        </span>
                    </div>
                </div>
            ) : null}

            {/* Budget Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Total Budget</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                        {event ? formatCurrency(event.budget) : '-'}
                    </p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Total Pengeluaran</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                        {rabTotal ? formatCurrency(rabTotal.total_cost) : '-'}
                    </p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Margin (15%)</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                        {rabTotal ? formatCurrency(rabTotal.margin) : '-'}
                    </p>
                </div>
                <div className={`rounded-lg border p-4 ${
                    budgetStatus?.budget_alert 
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-white border-gray-200'
                }`}>
                    <p className={`text-sm ${budgetStatus?.budget_alert ? 'text-red-600' : 'text-gray-600'}`}>
                        Sisa Budget
                    </p>
                    <p className={`text-2xl font-bold mt-2 ${budgetStatus?.budget_alert ? 'text-red-900' : 'text-gray-900'}`}>
                        {budgetStatus ? formatCurrency(budgetStatus.remaining) : '-'}
                    </p>
                    {budgetStatus?.budget_alert && (
                        <p className="text-xs text-red-600 mt-2">⚠️ Budget menipis!</p>
                    )}
                </div>
            </div>

            {/* RAB Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Rencana Anggaran Biaya (RAB)</h2>
                    {!showRABForm && (
                        <button
                            onClick={() => setShowRABForm(true)}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            + Tambah Item
                        </button>
                    )}
                </div>

                {showRABForm && (
                    <div className="mb-6 pb-6 border-b">
                        <RABForm
                            item={editingItem || undefined}
                            onSubmit={(data) => saveRABItem({ ...data, event_id: Number(eventId) })}
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
        </div>
    );
}
