import React from 'react';
import { SOP, CreateSOPRequest } from '@/types/api';

interface SOPFormProps {
    sop?: SOP;
    onSubmit: (data: CreateSOPRequest) => void;
    loading?: boolean;
    onCancel?: () => void;
}

export function SOPForm({ sop, onSubmit, loading, onCancel }: SOPFormProps) {
    const [formData, setFormData] = React.useState<CreateSOPRequest>(
        sop ? {
            name: sop.name,
            description: sop.description,
            category: sop.category,
            content: sop.content || '',
        } : {
            name: '',
            description: '',
            category: '',
            content: '',
        }
    );

    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name) newErrors.name = 'Judul harus diisi';
        if (!formData.description) newErrors.description = 'Deskripsi harus diisi';
        if (!formData.category) newErrors.category = 'Kategori harus diisi';
        if (!formData.content) newErrors.content = 'Konten harus diisi';
        return newErrors;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Judul
                </label>
                <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`mt-2 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nama SOP"
                    disabled={loading}
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

            {/* Category */}
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Kategori
                </label>
                <input
                    type="text"
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={`mt-2 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g. Catering, Venue, Sound"
                    disabled={loading}
                />
                {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Deskripsi Singkat
                </label>
                <input
                    type="text"
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`mt-2 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Deskripsi singkat"
                    disabled={loading}
                />
                {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
            </div>

            {/* Content */}
            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Konten Lengkap
                </label>
                <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className={`mt-2 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.content ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Isi lengkap SOP"
                    rows={8}
                    disabled={loading}
                />
                {errors.content && <p className="mt-1 text-xs text-red-600">{errors.content}</p>}
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                    {loading ? 'Menyimpan...' : sop ? 'Update SOP' : 'Buat SOP'}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="px-6 py-2 bg-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-300 disabled:bg-gray-100 transition-colors"
                    >
                        Batal
                    </button>
                )}
            </div>
        </form>
    );
}

// Export SOPTable component too
export { SOPTable } from './SOPTable';
