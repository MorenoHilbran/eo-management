import React from 'react';
import { Transaction } from '@/types/api';
import { LoadingSkeleton } from '@/components/common';
import { useCurrency, useDateFormat } from '@/hooks';

interface TransactionTableProps {
    transactions: Transaction[];
    loading: boolean;
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
        return <LoadingSkeleton count={5} />;
    }

    if (!transactions || transactions.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Tidak ada transaksi</p>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b bg-gray-50">
                        <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                            Deskripsi
                        </th>
                        <th className="text-right px-6 py-3 text-sm font-semibold text-gray-900">
                            Jumlah
                        </th>
                        <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                            Tanggal
                        </th>
                        <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                            Status
                        </th>
                        <th className="text-right px-6 py-3 text-sm font-semibold text-gray-900">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((tx) => (
                        <tr key={tx.id} className="border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{tx.description}</td>
                            <td className="px-6 py-4 text-right font-medium text-gray-900">
                                {formatCurrency(tx.amount)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                {formatDate(tx.transaction_date)}
                            </td>
                            <td className="px-6 py-4 text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                                    {tx.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right text-sm space-x-2">
                                {tx.status === 'pending' && onApprove && (
                                    <button
                                        onClick={() => onApprove(tx)}
                                        className="text-green-600 hover:text-green-800"
                                    >
                                        Setujui
                                    </button>
                                )}
                                {tx.status === 'pending' && onReject && (
                                    <button
                                        onClick={() => onReject(tx)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Tolak
                                    </button>
                                )}
                                {onEdit && (
                                    <button
                                        onClick={() => onEdit(tx)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Edit
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        onClick={() => onDelete(tx)}
                                        className="text-red-600 hover:text-red-800"
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
