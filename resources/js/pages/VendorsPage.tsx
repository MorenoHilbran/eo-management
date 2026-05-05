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
    const { data: categories = [] } = useQuery<VendorCategory[]>(
        () => vendorService.getCategories(),
        { enabled: showForm || editingVendor !== null }
    );

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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
                    <p className="text-gray-600 mt-1">Kelola database vendor</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        + Tambah Vendor
                    </button>
                )}
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                        {editingVendor ? 'Edit Vendor' : 'Tambah Vendor Baru'}
                    </h2>
                    <VendorForm
                        vendor={editingVendor || undefined}
                        categories={categories || []}
                        onSubmit={saveVendor}
                        loading={isSaving}
                        onCancel={handleCancel}
                    />
                </div>
            )}

            {/* Vendors Table */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
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
