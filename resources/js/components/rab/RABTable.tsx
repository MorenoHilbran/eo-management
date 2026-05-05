import React from 'react';
import { RABItem } from '@/types/api';
import { RABForm } from '@/components/rab/RABForm';
import { LoadingSkeleton } from '@/components/common';
import { useCurrency } from '@/hooks';

interface RABTableProps {
    items: RABItem[];
    loading: boolean;
    onEdit?: (item: RABItem) => void;
    onDelete?: (item: RABItem) => void;
}

export function RABTable({ items, loading, onEdit, onDelete }: RABTableProps) {
    const { format: formatCurrency } = useCurrency();

    if (loading) {
        return <LoadingSkeleton count={5} />;
    }

    if (!items || items.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Tidak ada item RAB</p>
            </div>
        );
    }

    const totalCost = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const totalMargin = totalCost * 0.15;

    return (
        <div>
            <div className="overflow-x-auto mb-6">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                                Item
                            </th>
                            <th className="text-center px-6 py-3 text-sm font-semibold text-gray-900">
                                Qty
                            </th>
                            <th className="text-right px-6 py-3 text-sm font-semibold text-gray-900">
                                Harga Unit
                            </th>
                            <th className="text-right px-6 py-3 text-sm font-semibold text-gray-900">
                                Total
                            </th>
                            <th className="text-right px-6 py-3 text-sm font-semibold text-gray-900">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                                <td className="px-6 py-4 text-center text-gray-600">{item.quantity}</td>
                                <td className="px-6 py-4 text-right text-gray-600">
                                    {formatCurrency(item.unit_price)}
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-gray-900">
                                    {formatCurrency(item.quantity * item.unit_price)}
                                </td>
                                <td className="px-6 py-4 text-right text-sm space-x-2">
                                    {onEdit && (
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            Edit
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            onClick={() => onDelete(item)}
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

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-900">Total Biaya</p>
                    <p className="font-bold text-lg text-gray-900">{formatCurrency(totalCost)}</p>
                </div>
                <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-900">Margin (15%)</p>
                    <p className="font-bold text-lg text-gray-900">{formatCurrency(totalMargin)}</p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                    <p className="font-bold text-gray-900">Total + Margin</p>
                    <p className="font-bold text-xl text-blue-600">
                        {formatCurrency(totalCost + totalMargin)}
                    </p>
                </div>
            </div>
        </div>
    );
}
