import React, { useState } from 'react';
import { usePaginatedQuery, useMutation } from '@/hooks';
import { sopService } from '@/lib/services';
import { SOP, CreateSOPRequest } from '@/types/api';
import { SOPForm, SOPTable } from '@/components/sop/SOPForm';
import { LoadingSkeleton, ErrorMessage, Pagination } from '@/components/common';

export default function SOPsPage() {
    const [showForm, setShowForm] = useState(false);
    const [editingSOP, setEditingSOP] = useState<SOP | null>(null);
    const [filterCategory, setFilterCategory] = useState<string>('');

    // Fetch SOPs
    const { data: sops, loading, error, page, setPage, total, refetch } = 
        usePaginatedQuery((page) => sopService.getSops(filterCategory || undefined, undefined, page));

    // Save SOP
    const { mutate: saveSOP, loading: isSaving } = useMutation(
        (data: CreateSOPRequest) =>
            editingSOP
                ? sopService.updateSop(editingSOP.id, data)
                : sopService.createSop(data),
        {
            onSuccess: () => {
                setShowForm(false);
                setEditingSOP(null);
                refetch();
            },
        }
    );

    // Delete SOP
    const { mutate: deleteSOP } = useMutation(
        (id: number) => sopService.deleteSop(id),
        { onSuccess: () => refetch() }
    );

    const handleEdit = (sop: SOP) => {
        setEditingSOP(sop);
        setShowForm(true);
    };

    const handleDelete = (sop: SOP) => {
        if (confirm(`Hapus SOP "${sop.title}"?`)) {
            deleteSOP(sop.id);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingSOP(null);
    };

    const totalPages = Math.ceil(total / 15);

    // Unique categories for filter
    const categories = sops ? [...new Set(sops.map(s => s.category))] : [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">SOP Management</h1>
                    <p className="text-gray-600 mt-1">Kelola Standard Operating Procedures</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        + Tambah SOP
                    </button>
                )}
            </div>

            {/* Filter */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <label className="text-sm font-medium text-gray-700">Filter Kategori</label>
                <select
                    value={filterCategory}
                    onChange={(e) => {
                        setFilterCategory(e.target.value);
                        setPage(1);
                    }}
                    className="mt-2 w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Semua Kategori</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                        {editingSOP ? 'Edit SOP' : 'Tambah SOP Baru'}
                    </h2>
                    <SOPForm
                        sop={editingSOP || undefined}
                        onSubmit={saveSOP}
                        loading={isSaving}
                        onCancel={handleCancel}
                    />
                </div>
            )}

            {/* SOPs Table */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                {error ? (
                    <ErrorMessage onRetry={refetch} />
                ) : (
                    <>
                        <SOPTable
                            sops={sops || []}
                            loading={loading}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
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
