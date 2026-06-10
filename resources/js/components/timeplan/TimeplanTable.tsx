import React, { useState, useEffect } from 'react';
import { EventTimeplan, CreateTimeplanRequest } from '@/types/api';
import { Calendar, Clock, User, FileText, Edit, Trash2, Plus } from 'lucide-react';

interface TimeplanTableProps {
    items: EventTimeplan[];
    loading?: boolean;
    onEdit?: (item: EventTimeplan) => void;
    onDelete?: (item: EventTimeplan) => void;
}

export function TimeplanTable({ items, loading, onEdit, onDelete }: TimeplanTableProps) {
    if (loading) {
        return (
            <div className="space-y-4">
                {Array(3)
                    .fill(0)
                    .map((_, i) => (
                        <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse"></div>
                    ))}
            </div>
        );
    }

    if (!items || items.length === 0) {
        return (
            <div className="text-center py-12 border border-dashed border-slate-200 bg-slate-50/50 rounded-2xl text-slate-500">
                <Calendar className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                Tidak ada agenda jadwal (Timeplan) ditemukan. Gunakan AI Generator atau tambahkan secara manual.
            </div>
        );
    }

    // Group items by day_offset
    const groupedItems: Record<string, EventTimeplan[]> = {};
    items.forEach((item) => {
        const key = item.day_offset || 'Hari Pelaksanaan';
        if (!groupedItems[key]) {
            groupedItems[key] = [];
        }
        groupedItems[key].push(item);
    });

    // Determine the sorting order of the groups
    const sortedGroups = Object.keys(groupedItems).sort((a, b) => {
        const getVal = (str: string) => {
            if (str.toLowerCase() === 'hari pelaksanaan') return 1000;
            const match = str.match(/H-(\d+)/i);
            if (match) {
                return -1 * parseInt(match[1]);
            }
            return 999; // fallback other values
        };
        return getVal(a) - getVal(b);
    });

    return (
        <div className="space-y-6">
            {sortedGroups.map((groupName) => {
                const groupItems = groupedItems[groupName];
                const isDDay = groupName.toLowerCase() === 'hari pelaksanaan';

                return (
                    <div key={groupName} className="border border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div className={`px-5 py-3.5 flex items-center justify-between border-b ${
                            isDDay ? 'bg-sky-50 text-sky-800' : 'bg-slate-50 text-slate-700'
                        }`}>
                            <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${
                                    isDDay ? 'bg-sky-600 text-white' : 'bg-slate-600 text-white'
                                }`}>
                                    {isDDay ? 'H' : groupName}
                                </span>
                                <h3 className="font-semibold text-slate-900">
                                    {isDDay ? 'Hari Pelaksanaan (Rundown)' : `Fase Persiapan (${groupName})`}
                                </h3>
                            </div>
                            <span className="text-xs font-medium bg-white px-2.5 py-1 rounded-full border shadow-2xs">
                                {groupItems.length} Kegiatan
                            </span>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {groupItems.map((item) => (
                                <div key={item.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex flex-wrap items-center gap-3">
                                            {isDDay && (item.time_start || item.time_end) && (
                                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200/50">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {item.time_start || '??:??'}{item.time_end ? ` - ${item.time_end}` : ''}
                                                </span>
                                            )}
                                            <p className="font-medium text-slate-950">{item.activity}</p>
                                        </div>

                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <User className="h-3.5 w-3.5 text-slate-400" />
                                                PIC: <span className="font-medium text-slate-700">{item.pic}</span>
                                            </span>
                                            {item.notes && (
                                                <span className="flex items-center gap-1">
                                                    <FileText className="h-3.5 w-3.5 text-slate-400" />
                                                    {item.notes}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 border-t pt-3 md:border-t-0 md:pt-0 border-slate-100">
                                        {onEdit && (
                                            <button
                                                onClick={() => onEdit(item)}
                                                className="inline-flex items-center justify-center p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                                                title="Edit kegiatan"
                                            >
                                                <Edit className="h-4.5 w-4.5" />
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={() => onDelete(item)}
                                                className="inline-flex items-center justify-center p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                title="Hapus kegiatan"
                                            >
                                                <Trash2 className="h-4.5 w-4.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

interface TimeplanFormProps {
    item?: EventTimeplan;
    onSubmit: (data: CreateTimeplanRequest) => Promise<void>;
    loading?: boolean;
    onCancel?: () => void;
}

export function TimeplanForm({ item, onSubmit, loading, onCancel }: TimeplanFormProps) {
    const [formData, setFormData] = useState<CreateTimeplanRequest>({
        day_offset: 'Hari Pelaksanaan',
        time_start: '',
        time_end: '',
        activity: '',
        pic: 'Panitia',
        notes: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (item) {
            setFormData({
                day_offset: item.day_offset,
                time_start: item.time_start || '',
                time_end: item.time_end || '',
                activity: item.activity,
                pic: item.pic,
                notes: item.notes || '',
            });
        } else {
            setFormData({
                day_offset: 'Hari Pelaksanaan',
                time_start: '',
                time_end: '',
                activity: '',
                pic: 'Panitia',
                notes: '',
            });
        }
        setErrors({});
    }, [item]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        if (!formData.day_offset) newErrors.day_offset = 'Fase hari persiapan wajib diatur';
        if (!formData.activity) newErrors.activity = 'Aktivitas wajib diisi';
        if (!formData.pic) newErrors.pic = 'PIC wajib ditentukan';

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

    const isDDay = formData.day_offset.toLowerCase() === 'hari pelaksanaan';

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-200/80">
            <h4 className="font-semibold text-slate-800 text-sm border-b pb-2 mb-3">
                {item ? 'Edit Kegiatan Jadwal' : 'Tambah Kegiatan Baru'}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Fase Jadwal</label>
                    <select
                        name="day_offset"
                        value={formData.day_offset}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    >
                        <option value="Hari Pelaksanaan">Hari Pelaksanaan (Rundown)</option>
                        <option value="H-1">H-1 (Satu Hari Sebelum)</option>
                        <option value="H-3">H-3 (Persiapan Akhir)</option>
                        <option value="H-7">H-7 (Satu Minggu Sebelum)</option>
                        <option value="H-14">H-14 (Dua Minggu Sebelum)</option>
                        <option value="H-30">H-30 (Satu Bulan Sebelum)</option>
                        <option value="Persiapan">Tahap Awal/Persiapan</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Aktivitas / Kegiatan</label>
                    <input
                        type="text"
                        name="activity"
                        value={formData.activity}
                        onChange={handleChange}
                        placeholder="Contoh: Registrasi peserta, Sewa Gedung"
                        className={`w-full px-3 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${
                            errors.activity ? 'border-red-500' : 'border-slate-200'
                        }`}
                    />
                    {errors.activity && <span className="text-red-600 text-xs mt-1">{errors.activity}</span>}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">PIC (Penanggung Jawab)</label>
                    <input
                        type="text"
                        name="pic"
                        value={formData.pic}
                        onChange={handleChange}
                        placeholder="Contoh: PJ Acara, Vendor"
                        className={`w-full px-3 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${
                            errors.pic ? 'border-red-500' : 'border-slate-200'
                        }`}
                    />
                    {errors.pic && <span className="text-red-600 text-xs mt-1">{errors.pic}</span>}
                </div>
            </div>

            {isDDay && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Waktu Mulai</label>
                        <input
                            type="time"
                            name="time_start"
                            value={formData.time_start}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Waktu Selesai</label>
                        <input
                            type="time"
                            name="time_end"
                            value={formData.time_end}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                    </div>
                </div>
            )}

            <div className="border-t border-slate-100 pt-3">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Catatan Tambahan</label>
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Masukkan instruksi khusus atau catatan detail (opsional)"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
            </div>

            <div className="flex gap-2.5 pt-3 border-t border-slate-100">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                    {loading ? 'Menyimpan...' : item ? 'Simpan Perubahan' : 'Tambah Kegiatan'}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 text-sm font-semibold rounded-lg transition-colors"
                    >
                        Batal
                    </button>
                )}
            </div>
        </form>
    );
}
