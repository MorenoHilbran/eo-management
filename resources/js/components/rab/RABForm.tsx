import React, { useState, useEffect } from 'react';
import { RABItem, CreateRABItemRequest } from '@/types/api';
import { useCurrency } from '@/hooks';

interface RABTableProps {
    items: RABItem[];
    loading?: boolean;
    onEdit?: (item: RABItem) => void;
    onDelete?: (item: RABItem) => void;
}

export function RABTable({ items, loading, onEdit, onDelete }: RABTableProps) {
    const { format: formatCurrency } = useCurrency();

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

    if (!items || items.length === 0) {
        return (
            <div className="text-center py-8 text-gray-600">
                Tidak ada item RAB ditemukan
            </div>
        );
    }

    const total = items.reduce((sum, item) => sum + parseFloat(item.total_price), 0);

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Nama Item</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Qty</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Unit</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Harga Satuan</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Total</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                            <td className="px-4 py-3 text-right text-sm text-gray-600">{item.quantity}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{item.unit}</td>
                            <td className="px-4 py-3 text-right text-sm text-gray-600">
                                {formatCurrency(item.unit_price)}
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                                {formatCurrency(item.total_price)}
                            </td>
                            <td className="px-4 py-3 text-center text-sm space-x-2">
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
            <div className="bg-gray-50 px-4 py-3 rounded-b-lg border-t">
                <div className="text-right font-semibold text-gray-900">
                    Total: {formatCurrency(total)}
                </div>
            </div>
        </div>
    );
}

interface RABFormProps {
    item?: RABItem;
    onSubmit: (data: CreateRABItemRequest) => Promise<void>;
    loading?: boolean;
    onCancel?: () => void;
}

export function RABForm({ item, onSubmit, loading, onCancel }: RABFormProps) {
    const [formData, setFormData] = useState<CreateRABItemRequest>(
        item || {
            event_id: 0,
            name: '',
            unit: '',
            quantity: 1,
            unit_price: 0,
            notes: '',
        }
    );
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        setFormData(
            item || {
                event_id: 0,
                name: '',
                unit: '',
                quantity: 1,
                unit_price: 0,
                notes: '',
            }
        );
        setErrors({});
    }, [item]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const parsedValue = name === 'quantity' || name === 'unit_price' ? Number(value) : value;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'quantity' || name === 'unit_price'
                ? value === ''
                    ? 0
                    : Number.isFinite(parsedValue)
                        ? parsedValue
                        : prev[name as keyof CreateRABItemRequest]
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

        if (!formData.name) newErrors.name = 'Nama item wajib diisi';
        if (!formData.unit) newErrors.unit = 'Unit wajib diisi';
        if (formData.quantity <= 0) newErrors.quantity = 'Qty harus lebih dari 0';
        if (formData.unit_price <= 0) newErrors.unit_price = 'Harga harus lebih dari 0';

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
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Item</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Catering, Sound System, dll"
                />
                {errors.name && <span className="text-red-600 text-sm mt-1">{errors.name}</span>}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Qty</label>
                    <input
                        type="number"
                        name="quantity"
                        value={Number.isFinite(formData.quantity) ? formData.quantity : 1}
                        onChange={handleChange}
                        min="1"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.quantity ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.quantity && <span className="text-red-600 text-sm mt-1">{errors.quantity}</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                    <input
                        type="text"
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.unit ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="orang, hari, set"
                    />
                    {errors.unit && <span className="text-red-600 text-sm mt-1">{errors.unit}</span>}
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Harga Satuan (Rp)</label>
                    <input
                        type="number"
                        name="unit_price"
                        value={Number.isFinite(formData.unit_price) ? formData.unit_price : 0}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.unit_price ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0"
                    />
                    {errors.unit_price && <span className="text-red-600 text-sm mt-1">{errors.unit_price}</span>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catatan (Opsional)</label>
                <textarea
                    name="notes"
                    value={formData.notes || ''}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Catatan tambahan untuk item ini"
                />
            </div>

            <div className="flex gap-2 pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {loading ? 'Menyimpan...' : item ? 'Update Item' : 'Tambah Item'}
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
