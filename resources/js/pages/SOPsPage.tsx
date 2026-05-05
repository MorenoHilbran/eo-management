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
        if (confirm(`Hapus SOP "${sop.name}"?`)) {
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
        <div className="space-y-8">
            {/* Header */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Library</p>
                        <h1 className="mt-2 text-3xl font-semibold text-slate-900">SOP Management</h1>
                        <p className="mt-1 text-slate-500">Kelola Standard Operating Procedures dalam tampilan yang lebih ringan.</p>
                    </div>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
                        >
                            + Tambah SOP
                        </button>
                    )}
                </div>
            </div>

            {/* Filter */}
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <label className="text-sm font-medium text-slate-700">Filter Kategori</label>
                <select
                    value={filterCategory}
                    onChange={(e) => {
                        setFilterCategory(e.target.value);
                        setPage(1);
                    }}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 md:w-80"
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
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-slate-900">
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
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
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
