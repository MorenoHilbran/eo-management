import React, { useState, useEffect } from 'react';
import { Transaction, CreateTransactionRequest } from '@/types/api';
import { useCurrency, useDateFormat } from '@/hooks';

interface TransactionTableProps {
    transactions: Transaction[];
    loading?: boolean;
    onEdit?: (transaction: Transaction) => void;
    onDelete?: (transaction: Transaction) => void;
    onApprove?: (transaction: Transaction) => void;
    onReject?: (transaction: Transaction) => void;
}

export function TransactionTable({
    transactions,
    loading,
    onEdit,
    onDelete,
    onApprove,
    onReject,
}: TransactionTableProps) {
    const { format: formatCurrency } = useCurrency();
    const { format: formatDate } = useDateFormat();

    if (loading) {
        return (
            <div className="space-y-3">
                {Array(5)
                    .fill(0)
                    .map((_, i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                    ))}
            </div>
        );
    }

    if (!transactions || transactions.length === 0) {
        return (
            <div className="text-center py-8 text-gray-600">
                Tidak ada transaksi ditemukan
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Deskripsi</th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-900">Jumlah</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-900">Status</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-900">Tanggal</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-900">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-900 font-medium">{tx.description}</td>
                            <td className="px-4 py-3 text-right font-medium text-gray-900">
                                {formatCurrency(tx.amount)}
                            </td>
                            <td className="px-4 py-3 text-center">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    tx.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : tx.status === 'approved'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {tx.status}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-center text-gray-600">
                                {formatDate(tx.transaction_date)}
                            </td>
                            <td className="px-4 py-3 text-center space-x-1">
                                {tx.status === 'pending' && (
                                    <>
                                        {onApprove && (
                                            <button
                                                onClick={() => onApprove(tx)}
                                                className="text-green-600 hover:text-green-800 text-xs"
                                            >
                                                ✓ Approve
                                            </button>
                                        )}
                                        {onReject && (
                                            <button
                                                onClick={() => onReject(tx)}
                                                className="text-red-600 hover:text-red-800 text-xs"
                                            >
                                                ✕ Reject
                                            </button>
                                        )}
                                    </>
                                )}
                                {onEdit && tx.status === 'pending' && (
                                    <button
                                        onClick={() => onEdit(tx)}
                                        className="text-blue-600 hover:text-blue-800 text-xs"
                                    >
                                        Edit
                                    </button>
                                )}
                                {onDelete && tx.status === 'pending' && (
                                    <button
                                        onClick={() => onDelete(tx)}
                                        className="text-red-600 hover:text-red-800 text-xs"
                                    >
                                        Hapus
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

interface TransactionFormProps {
    transaction?: Transaction;
    eventId?: number;
    onSubmit: (data: CreateTransactionRequest) => Promise<void>;
    loading?: boolean;
    onCancel?: () => void;
}

export function TransactionForm({
    transaction,
    eventId,
    onSubmit,
    loading,
    onCancel,
}: TransactionFormProps) {
    const [formData, setFormData] = useState<CreateTransactionRequest>(
        transaction
            ? {
                  ...transaction,
                  event_id: transaction.event_id || eventId || 0,
                  amount: Number(transaction.amount) || 0,
                  description: transaction.description || '',
                  transaction_date: transaction.transaction_date?.split('T')[0] || new Date().toISOString().split('T')[0],
              }
            : {
                  event_id: eventId || 0,
                  amount: 0,
                  description: '',
                  transaction_date: new Date().toISOString().split('T')[0],
              }
    );
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        setFormData(
            transaction
                ? {
                      ...transaction,
                      event_id: transaction.event_id || eventId || 0,
                      amount: Number(transaction.amount) || 0,
                      description: transaction.description || '',
                      transaction_date: transaction.transaction_date?.split('T')[0] || new Date().toISOString().split('T')[0],
                  }
                : {
                      event_id: eventId || 0,
                      amount: 0,
                      description: '',
                      transaction_date: new Date().toISOString().split('T')[0],
                  }
        );
        setErrors({});
    }, [transaction, eventId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'amount'
                ? value === ''
                    ? 0
                    : Number.isNaN(Number(value))
                        ? prev.amount
                        : Number(value)
                : value,
        }));
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        if (!formData.description) newErrors.description = 'Deskripsi wajib diisi';
        if (formData.amount <= 0) newErrors.amount = 'Jumlah harus lebih dari 0';
        if (!formData.transaction_date) newErrors.transaction_date = 'Tanggal wajib diisi';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await onSubmit(formData);
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={2}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Deskripsi transaksi"
                />
                {errors.description && <span className="text-red-600 text-sm mt-1">{errors.description}</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah (Rp)</label>
                    <input
                        type="number"
                        name="amount"
                        value={Number.isFinite(formData.amount) ? formData.amount : 0}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.amount ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0"
                    />
                    {errors.amount && <span className="text-red-600 text-sm mt-1">{errors.amount}</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Transaksi</label>
                    <input
                        type="date"
                        name="transaction_date"
                        value={formData.transaction_date}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.transaction_date ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.transaction_date && <span className="text-red-600 text-sm mt-1">{errors.transaction_date}</span>}
                </div>
            </div>

            <div className="flex gap-2 pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {loading ? 'Menyimpan...' : transaction ? 'Update Transaksi' : 'Tambah Transaksi'}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Batal
                    </button>
                )}
            </div>
        </form>
    );
}
