import React from 'react';
import { Vendor } from '@/types/api';
import { LoadingSkeleton } from '@/components/common';
import { useCurrency } from '@/hooks';

interface VendorTableProps {
    vendors: Vendor[];
    loading: boolean;
    onEdit?: (vendor: Vendor) => void;
    onDelete?: (vendor: Vendor) => void;
}

export function VendorTable({ vendors, loading, onEdit, onDelete }: VendorTableProps) {
    const { format: formatCurrency } = useCurrency();

    if (loading) {
        return <LoadingSkeleton count={5} />;
    }

    if (!vendors || vendors.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Tidak ada vendor</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b bg-gray-50">
                        <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                            Vendor
                        </th>
                        <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                            Kategori
                        </th>
                        <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                            Kontak
                        </th>
                        <th className="text-center px-6 py-3 text-sm font-semibold text-gray-900">
                            Rating
                        </th>
                        <th className="text-right px-6 py-3 text-sm font-semibold text-gray-900">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {vendors.map((vendor) => (
                        <tr key={vendor.id} className="border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{vendor.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                {vendor.vendor_category?.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <div>{vendor.phone}</div>
                                <div className="text-xs text-gray-500">{vendor.email}</div>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <span className="text-yellow-500 font-medium">★ {vendor.rating || 0}</span>
                            </td>
                            <td className="px-6 py-4 text-right text-sm space-x-2">
                                {onEdit && (
                                    <button
                                        onClick={() => onEdit(vendor)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Edit
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        onClick={() => onDelete(vendor)}
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
