import React, { useState, useEffect } from 'react';
import { usePaginatedQuery, useMutation } from '@/hooks';
import { transactionService, eventService } from '@/lib/services';
import { Transaction, CreateTransactionRequest, Event } from '@/types/api';
import { TransactionForm, TransactionTable } from '@/components/transactions/TransactionForm';
import { LoadingSkeleton, ErrorMessage, Pagination } from '@/components/common';
import { useCurrency } from '@/hooks';

export default function TransactionsPage() {
    const [showForm, setShowForm] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<number | undefined>();
    const { format: formatCurrency } = useCurrency();

    // Fetch transactions
    const { data: transactions, loading, error, page, setPage, total, refetch } = 
        usePaginatedQuery((page) => transactionService.getTransactions(selectedEvent, undefined, page));

    // Fetch events for filter
    const { data: eventsData } = usePaginatedQuery(
        (page) => eventService.getEvents(page)
    );
    const events = Array.isArray(eventsData) ? eventsData : eventsData?.data || [];

    // Save transaction
    const { mutate: saveTransaction, loading: isSaving } = useMutation(
        (data: CreateTransactionRequest) =>
            editingTransaction
                ? transactionService.updateTransaction(editingTransaction.id, data)
                : transactionService.createTransaction(data),
        {
            onSuccess: () => {
                setShowForm(false);
                setEditingTransaction(null);
                refetch();
            },
        }
    );

    // Approve transaction
    const { mutate: approveTransaction } = useMutation(
        (id: number) => transactionService.approveTransaction(id),
        { onSuccess: () => refetch() }
    );

    // Reject transaction
    const { mutate: rejectTransaction } = useMutation(
        (id: number, reason: string) => transactionService.rejectTransaction(id, reason),
        { onSuccess: () => refetch() }
    );

    // Delete transaction
    const { mutate: deleteTransaction } = useMutation(
        (id: number) => transactionService.deleteTransaction(id),
        { onSuccess: () => refetch() }
    );

    const handleEdit = (tx: Transaction) => {
        setEditingTransaction(tx);
        setShowForm(true);
    };

    const handleApprove = (tx: Transaction) => {
        if (confirm('Approve transaksi ini?')) {
            approveTransaction(tx.id);
        }
    };

    const handleReject = (tx: Transaction) => {
        const reason = prompt('Alasan penolakan:');
        if (reason) {
            rejectTransaction(tx.id, reason);
        }
    };

    const handleDelete = (tx: Transaction) => {
        if (confirm('Hapus transaksi ini?')) {
            deleteTransaction(tx.id);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingTransaction(null);
    };

    const handleOpenForm = () => {
        if (!selectedEvent && Array.isArray(events) && events.length > 0) {
            setSelectedEvent(events[0]?.id);
        }
        setShowForm(true);
    };

    const totalPages = Math.ceil(total / 15);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Finance</p>
                        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Manajemen Transaksi</h1>
                        <p className="mt-1 text-slate-500">Kelola pengeluaran dan persetujuan budget dengan lebih ringkas.</p>
                    </div>
                    {!showForm && (
                        <button
                            onClick={handleOpenForm}
                            disabled={!Array.isArray(events) || events.length === 0}
                            className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:bg-slate-300"
                        >
                            + Tambah Transaksi
                        </button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <label className="text-sm font-medium text-slate-700">Filter Event</label>
                <select
                    value={selectedEvent || ''}
                    onChange={(e) => {
                        setSelectedEvent(e.target.value ? Number(e.target.value) : undefined);
                        setPage(1);
                    }}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 md:w-80"
                >
                    <option value="">Semua Event</option>
                    {Array.isArray(events) && events.map((event) => (
                        <option key={event.id} value={event.id}>
                            {event.name} ({formatCurrency(event.budget)})
                        </option>
                    ))}
                </select>
            </div>

            {/* Form */}
            {showForm && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-slate-900">
                        {editingTransaction ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}
                    </h2>
                    <TransactionForm
                        transaction={editingTransaction || undefined}
                        eventId={selectedEvent}
                        onSubmit={saveTransaction}
                        loading={isSaving}
                        onCancel={handleCancel}
                    />
                </div>
            )}

            {/* Transactions Table */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                {error ? (
                    <ErrorMessage onRetry={refetch} />
                ) : (
                    <>
                        <TransactionTable
                            transactions={transactions || []}
                            loading={loading}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onApprove={handleApprove}
                            onReject={handleReject}
                        />

                        {/* Pagination */}
                        {!loading && totalPages > 1 && (
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
