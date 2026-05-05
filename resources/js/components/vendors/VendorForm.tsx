import React, { useEffect, useState } from 'react';
import { Vendor, CreateVendorRequest, VendorCategory } from '@/types/api';

interface VendorTableProps {
    vendors: Vendor[];
    loading?: boolean;
    onEdit?: (vendor: Vendor) => void;
    onDelete?: (vendor: Vendor) => void;
}

export function VendorTable({ vendors, loading, onEdit, onDelete }: VendorTableProps) {
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

    if (!vendors || vendors.length === 0) {
        return (
            <div className="text-center py-8 text-gray-600">
                Tidak ada vendor ditemukan
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Nama Vendor</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Kategori</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Kontak</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {vendors.map((vendor) => (
                        <tr key={vendor.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{vendor.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{vendor.category?.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                                <div>{vendor.contact_person}</div>
                                <div className="text-xs text-gray-500">{vendor.phone}</div>
                            </td>
                            <td className="px-4 py-3 text-center text-sm">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    vendor.status === 'active' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {vendor.status}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-center text-sm space-x-2">
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

interface VendorFormProps {
    vendor?: Vendor;
    categories: VendorCategory[] | { data?: VendorCategory[] } | null | undefined;
    onSubmit: (data: CreateVendorRequest) => Promise<void>;
    loading?: boolean;
    onCancel?: () => void;
}

export function VendorForm({ 
    vendor, 
    categories, 
    onSubmit, 
    loading, 
    onCancel 
}: VendorFormProps) {
    const normalizedCategories = Array.isArray(categories)
        ? categories
        : categories?.data || [];

    const [formData, setFormData] = useState<CreateVendorRequest>(
        vendor || {
            name: '',
            category_id: normalizedCategories[0]?.id || 0,
            contact_person: '',
            email: '',
            phone: '',
            address: '',
            status: 'active',
        }
    );
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!vendor && !formData.category_id && normalizedCategories.length > 0) {
            setFormData((prev) => ({
                ...prev,
                category_id: normalizedCategories[0].id,
            }));
        }
    }, [formData.category_id, normalizedCategories, vendor]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'category_id' ? parseInt(value) : value,
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

        if (!formData.name) newErrors.name = 'Nama vendor wajib diisi';
        if (!formData.category_id) newErrors.category_id = 'Kategori wajib dipilih';
        if (!formData.contact_person) newErrors.contact_person = 'Nama kontak wajib diisi';
        if (formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            newErrors.email = 'Format email tidak valid';
        }

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
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Vendor</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nama vendor"
                    />
                    {errors.name && <span className="text-red-600 text-sm mt-1">{errors.name}</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                    <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.category_id ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                        <option value="">Pilih Kategori</option>
                        {normalizedCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    {errors.category_id && <span className="text-red-600 text-sm mt-1">{errors.category_id}</span>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Kontak</label>
                <input
                    type="text"
                    name="contact_person"
                    value={formData.contact_person}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.contact_person ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nama orang yang bisa dihubungi"
                />
                {errors.contact_person && <span className="text-red-600 text-sm mt-1">{errors.contact_person}</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="email@vendor.com"
                    />
                    {errors.email && <span className="text-red-600 text-sm mt-1">{errors.email}</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telepon</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="+62 8xx xxxx xxxx"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
                <textarea
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Alamat lengkap vendor"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
                </select>
            </div>

            <div className="flex gap-2 pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {loading ? 'Menyimpan...' : vendor ? 'Update Vendor' : 'Tambah Vendor'}
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
