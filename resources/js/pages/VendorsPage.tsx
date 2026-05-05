import React, { useState } from 'react';
import { usePaginatedQuery, useMutation, useQuery } from '@/hooks';
import { vendorService } from '@/lib/services';
import { Vendor, VendorCategory, CreateVendorRequest } from '@/types/api';
import { VendorForm, VendorTable } from '@/components/vendors/VendorForm';
import { LoadingSkeleton, ErrorMessage, Pagination } from '@/components/common';

export default function VendorsPage() {
    const [showForm, setShowForm] = useState(false);
    const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

    // Fetch vendors
    const { data: vendors, loading, error, page, setPage, total, refetch } = 
        usePaginatedQuery((page) => vendorService.getVendors(page));

    // Fetch categories
    const { data: categoriesResponse } = useQuery<any>(
        () => vendorService.getCategories(),
        { enabled: showForm || editingVendor !== null }
    );

    const categories = Array.isArray(categoriesResponse)
        ? categoriesResponse
        : categoriesResponse?.data || [];

    // Save vendor
    const { mutate: saveVendor, loading: isSaving } = useMutation(
        (data: CreateVendorRequest) =>
            editingVendor
                ? vendorService.updateVendor(editingVendor.id, data)
                : vendorService.createVendor(data),
        {
            onSuccess: () => {
                setShowForm(false);
                setEditingVendor(null);
                refetch();
            },
        }
    );

    // Delete vendor
    const { mutate: deleteVendor } = useMutation(
        (id: number) => vendorService.deleteVendor(id),
        {
            onSuccess: () => refetch(),
        }
    );

    const handleEdit = (vendor: Vendor) => {
        setEditingVendor(vendor);
        setShowForm(true);
    };

    const handleDelete = (vendor: Vendor) => {
        if (confirm(`Hapus vendor "${vendor.name}"?`)) {
            deleteVendor(vendor.id);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingVendor(null);
    };

    const totalPages = Math.ceil(total / 15);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Master data</p>
                        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Vendor Management</h1>
                        <p className="mt-1 text-slate-500">Kelola database vendor dengan tampilan yang lebih rapi.</p>
                    </div>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
                        >
                            + Tambah Vendor
                        </button>
                    )}
                </div>
            </div>

            {/* Form */}
            {showForm && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-slate-900">
                        {editingVendor ? 'Edit Vendor' : 'Tambah Vendor Baru'}
                    </h2>
                    <VendorForm
                        vendor={editingVendor || undefined}
                        categories={categories}
                        onSubmit={saveVendor}
                        loading={isSaving}
                        onCancel={handleCancel}
                    />
                </div>
            )}

            {/* Vendors Table */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                {error ? (
                    <ErrorMessage onRetry={refetch} />
                ) : (
                    <>
                        <VendorTable
                            vendors={vendors || []}
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
