import React, { useState } from 'react';
import { Event, CreateEventRequest } from '@/types/api';

interface EventFormProps {
    event?: Event;
    onSubmit: (data: CreateEventRequest) => Promise<void>;
    loading?: boolean;
    onCancel?: () => void;
}

export function EventForm({ event, onSubmit, loading, onCancel }: EventFormProps) {
    const [formData, setFormData] = useState<CreateEventRequest>(
        event || {
            name: '',
            description: '',
            event_date: '',
            location: '',
            budget: 0,
            status: 'planning',
        }
    );
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'budget' ? (value === '' ? '' : parseFloat(value)) : value,
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

        if (!formData.name) newErrors.name = 'Nama event wajib diisi';
        if (!formData.event_date) newErrors.event_date = 'Tanggal event wajib diisi';
        if (!formData.location) newErrors.location = 'Lokasi wajib diisi';
        if (!formData.budget || formData.budget <= 0) newErrors.budget = 'Budget harus lebih dari 0';

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
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Event</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Masukkan nama event"
                />
                {errors.name && <span className="text-red-600 text-sm mt-1">{errors.name}</span>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan deskripsi event (opsional)"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal & Waktu Event</label>
                    <input
                        type="datetime-local"
                        name="event_date"
                        value={formData.event_date}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.event_date ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.event_date && <span className="text-red-600 text-sm mt-1">{errors.event_date}</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.location ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Masukkan lokasi event"
                    />
                    {errors.location && <span className="text-red-600 text-sm mt-1">{errors.location}</span>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget (Rp)</label>
                    <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.budget ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0"
                    />
                    {errors.budget && <span className="text-red-600 text-sm mt-1">{errors.budget}</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="planning">Perencanaan</option>
                        <option value="ongoing">Sedang Berlangsung</option>
                        <option value="completed">Selesai</option>
                        <option value="cancelled">Dibatalkan</option>
                    </select>
                </div>
            </div>

            <div className="flex gap-2 pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {loading ? 'Menyimpan...' : event ? 'Update Event' : 'Buat Event'}
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
