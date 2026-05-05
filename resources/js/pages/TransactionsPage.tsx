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
    const { data: events = [] } = usePaginatedQuery(
        (page) => eventService.getEvents(page)
    );

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

    const totalPages = Math.ceil(total / 15);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manajemen Transaksi</h1>
                    <p className="text-gray-600 mt-1">Kelola pengeluaran dan persetujuan budget</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        + Tambah Transaksi
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <label className="text-sm font-medium text-gray-700">Filter Event</label>
                <select
                    value={selectedEvent || ''}
                    onChange={(e) => {
                        setSelectedEvent(e.target.value ? Number(e.target.value) : undefined);
                        setPage(1);
                    }}
                    className="mt-2 w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Semua Event</option>
                    {events?.map((event) => (
                        <option key={event.id} value={event.id}>
                            {event.name} ({formatCurrency(event.budget)})
                        </option>
                    ))}
                </select>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
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
            <div className="bg-white rounded-lg border border-gray-200 p-6">
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
