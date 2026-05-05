import React from 'react';
import { SOP } from '@/types/api';
import { LoadingSkeleton } from '@/components/common';

interface SOPTableProps {
    sops: SOP[];
    loading: boolean;
    onEdit?: (sop: SOP) => void;
    onDelete?: (sop: SOP) => void;
}

export function SOPTable({ sops, loading, onEdit, onDelete }: SOPTableProps) {
    if (loading) {
        return <LoadingSkeleton count={5} />;
    }

    if (!sops || sops.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Tidak ada SOP</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b bg-gray-50">
                        <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                            Judul
                        </th>
                        <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                            Kategori
                        </th>
                        <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                            Deskripsi
                        </th>
                        <th className="text-right px-6 py-3 text-sm font-semibold text-gray-900">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sops.map((sop) => (
                        <tr key={sop.id} className="border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{sop.title}</td>
                            <td className="px-6 py-4 text-sm">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                    {sop.category}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                {sop.description}
                            </td>
                            <td className="px-6 py-4 text-right text-sm space-x-2">
                                {onEdit && (
                                    <button
                                        onClick={() => onEdit(sop)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Edit
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        onClick={() => onDelete(sop)}
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
