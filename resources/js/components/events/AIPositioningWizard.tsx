import React, { useState, useEffect } from 'react';
import { Sparkles, X, Plus, Trash2, CheckCircle2, ChevronRight, DollarSign, Calendar, RefreshCw, AlertTriangle } from 'lucide-react';
import { eventService } from '@/lib/services';
import { useCurrency } from '@/hooks';
import { AIPlanGenerationResponse } from '@/types/api';
import { toast } from 'sonner';

interface AIPositioningWizardProps {
    eventId: number;
    eventBudget: number;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AIPositioningWizard({ eventId, eventBudget, isOpen, onClose, onSuccess }: AIPositioningWizardProps) {
    const { format: formatCurrency } = useCurrency();

    const [step, setStep] = useState<1 | 2>(1); // 1: Input Prompt, 2: Preview Results
    const [prompt, setPrompt] = useState('');
    const [generating, setGenerating] = useState(false);
    const [applying, setApplying] = useState(false);

    // AI Suggestions State
    const [suggestedBudget, setSuggestedBudget] = useState<AIPlanGenerationResponse['budget_items']>([]);
    const [suggestedTimeplan, setSuggestedTimeplan] = useState<AIPlanGenerationResponse['timeplan_items']>([]);
    const [activeTab, setActiveTab] = useState<'budget' | 'timeplan'>('budget');
    const [applyMode, setApplyMode] = useState<'append' | 'overwrite'>('append');

    // Reset all state every time the modal is (re)opened
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setPrompt('');
            setGenerating(false);
            setApplying(false);
            setSuggestedBudget([]);
            setSuggestedTimeplan([]);
            setActiveTab('budget');
            setApplyMode('append');
        }
    }, [isOpen]);

    if (!isOpen) return null;


    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setGenerating(true);
        try {
            const response = await eventService.generateAIPlan(eventId, prompt);
            const data = response.data;

            setSuggestedBudget(data.budget_items || []);
            setSuggestedTimeplan(data.timeplan_items || []);
            setStep(2);
            toast.success('Rekomendasi AI berhasil dihasilkan!');
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Gagal generate plan dengan AI.');
        } finally {
            setGenerating(false);
        }
    };

    const handleSave = async () => {
        setApplying(true);
        try {
            await eventService.applyAIPlan(eventId, {
                mode: applyMode,
                budget_items: suggestedBudget,
                timeplan_items: suggestedTimeplan,
            });
            toast.success('Rekomendasi AI berhasil disimpan!');
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Gagal menyimpan rekomendasi AI.');
        } finally {
            setApplying(false);
        }
    };

    // Item management helper inside preview
    const updateBudgetItem = (index: number, key: string, value: any) => {
        setSuggestedBudget((prev) => {
            const newItems = [...prev];
            newItems[index] = { ...newItems[index], [key]: value };
            return newItems;
        });
    };

    const removeBudgetItem = (index: number) => {
        setSuggestedBudget((prev) => prev.filter((_, i) => i !== index));
    };

    const updateTimeplanItem = (index: number, key: string, value: any) => {
        setSuggestedTimeplan((prev) => {
            const newItems = [...prev];
            newItems[index] = { ...newItems[index], [key]: value };
            return newItems;
        });
    };

    const removeTimeplanItem = (index: number) => {
        setSuggestedTimeplan((prev) => prev.filter((_, i) => i !== index));
    };

    const totalRAB = suggestedBudget.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const budgetOver = totalRAB > eventBudget;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
            <div className="relative flex flex-col w-full max-w-4xl max-h-[85vh] bg-white rounded-3xl border border-slate-200 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-sky-500 to-indigo-600 text-white shadow-md">
                            <Sparkles className="h-4.5 w-4.5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 text-base">Asisten Perencana AI (Gemini)</h3>
                            <p className="text-xs text-slate-500">Penyusunan jadwal & budget otomatis</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {step === 1 ? (
                        /* Step 1: Input Form */
                        <form onSubmit={handleGenerate} className="space-y-6">
                            <div className="space-y-3 bg-linear-to-br from-sky-50 to-indigo-50/30 p-5 rounded-2xl border border-sky-100/50">
                                <h4 className="font-semibold text-sky-950 text-sm">Bagaimana cara kerjanya?</h4>
                                <p className="text-xs leading-5 text-sky-800">
                                    AI Gemini akan menganalisis nama event, tanggal, lokasi, dan budget target Anda. Tulis instruksi tambahan di bawah jika Anda ingin mengarahkan AI untuk mendistribusikan budget atau mengatur rundown secara khusus (misal: "fokus anggaran pada konsumsi makan siang", " rundown mulai jam 8 pagi").
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Instruksi Tambahan Pengguna (Opsional)
                                </label>
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Masukkan detail tambahan, e.g. Acara butuh pembisnis kawakan, butuh katering makanan khas sunda, pembukaan oleh Rektor..."
                                    rows={4}
                                    disabled={generating}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 disabled:opacity-50 resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-5 py-2.5 border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 text-sm font-semibold rounded-xl transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={generating}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-50"
                                >
                                    {generating ? (
                                        <>
                                            <RefreshCw className="h-4 w-4 animate-spin" />
                                            Sedang Menyusun Draft...
                                        </>
                                    ) : (
                                        <>
                                            Generate AI Plan
                                            <ChevronRight className="h-4.5 w-4.5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* Step 2: Preview Results */
                        <div className="space-y-6">
                            {/* Warning if over budget */}
                            {budgetOver && (
                                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-xs">
                                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                                    <span>
                                        <strong>Peringatan Budget:</strong> Total usulan RAB AI (<strong>{formatCurrency(totalRAB)}</strong>) melebihi target anggaran event (<strong>{formatCurrency(eventBudget)}</strong>). Anda dapat mengedit harga/jumlah item di bawah.
                                    </span>
                                </div>
                            )}

                            {/* Tabs & Save Mode Selector */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b gap-3 pb-3">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setActiveTab('budget')}
                                        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border transition ${
                                            activeTab === 'budget'
                                                ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <DollarSign className="h-4 w-4" />
                                        Preview RAB ({suggestedBudget.length})
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('timeplan')}
                                        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border transition ${
                                            activeTab === 'timeplan'
                                                ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <Calendar className="h-4 w-4" />
                                        Preview Timeplan ({suggestedTimeplan.length})
                                    </button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-slate-500">Metode Simpan:</span>
                                    <select
                                        value={applyMode}
                                        onChange={(e) => setApplyMode(e.target.value as any)}
                                        className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus:outline-none"
                                    >
                                        <option value="append">Append (Tambahkan ke yang ada)</option>
                                        <option value="overwrite">Overwrite (Hapus data lama)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Tab Content: Budget */}
                            {activeTab === 'budget' && (
                                <div className="space-y-4">
                                    <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                                        <table className="w-full text-sm">
                                            <thead className="bg-slate-50 border-b text-slate-800 font-semibold text-xs uppercase tracking-wider text-left">
                                                <tr>
                                                    <th className="px-4 py-3">Nama Anggaran</th>
                                                    <th className="px-3 py-3 w-24">Satuan</th>
                                                    <th className="px-3 py-3 w-20">Qty</th>
                                                    <th className="px-4 py-3 w-40">Harga Satuan</th>
                                                    <th className="px-4 py-3 w-36">Total</th>
                                                    <th className="px-3 py-3 w-12 text-center">Hapus</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y text-slate-700">
                                                {suggestedBudget.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} className="text-center py-6 text-slate-400">Tidak ada item anggaran</td>
                                                    </tr>
                                                ) : (
                                                    suggestedBudget.map((item, index) => (
                                                        <tr key={index} className="hover:bg-slate-50/50">
                                                            <td className="px-4 py-2.5">
                                                                <input
                                                                    type="text"
                                                                    value={item.name}
                                                                    onChange={(e) => updateBudgetItem(index, 'name', e.target.value)}
                                                                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-sm"
                                                                />
                                                            </td>
                                                            <td className="px-3 py-2.5">
                                                                <input
                                                                    type="text"
                                                                    value={item.unit}
                                                                    onChange={(e) => updateBudgetItem(index, 'unit', e.target.value)}
                                                                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-sm"
                                                                />
                                                            </td>
                                                            <td className="px-3 py-2.5">
                                                                <input
                                                                    type="number"
                                                                    value={item.quantity}
                                                                    onChange={(e) => updateBudgetItem(index, 'quantity', parseInt(e.target.value) || 0)}
                                                                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-sm"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-2.5">
                                                                <input
                                                                    type="number"
                                                                    value={item.unit_price}
                                                                    onChange={(e) => updateBudgetItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                                                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-sm"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-2.5 font-semibold text-slate-900 align-middle">
                                                                {formatCurrency(item.quantity * item.unit_price)}
                                                            </td>
                                                            <td className="px-3 py-2.5 text-center">
                                                                <button
                                                                    onClick={() => removeBudgetItem(index)}
                                                                    className="text-slate-400 hover:text-rose-600 rounded p-1 transition-colors"
                                                                >
                                                                    <Trash2 className="h-4.5 w-4.5" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="flex justify-between items-center bg-slate-900 text-white px-5 py-4 rounded-2xl">
                                        <span className="font-medium text-slate-300 text-sm">Target Anggaran: {formatCurrency(eventBudget)}</span>
                                        <span className={`font-bold text-lg ${budgetOver ? 'text-rose-400' : 'text-emerald-400'}`}>
                                            Estimasi Total: {formatCurrency(totalRAB)}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Tab Content: Timeplan */}
                            {activeTab === 'timeplan' && (
                                <div className="space-y-4">
                                    <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                                        <table className="w-full text-sm">
                                            <thead className="bg-slate-50 border-b text-slate-800 font-semibold text-xs uppercase tracking-wider text-left">
                                                <tr>
                                                    <th className="px-4 py-3 w-36">Fase/Offset</th>
                                                    <th className="px-3 py-3 w-28">Mulai</th>
                                                    <th className="px-3 py-3 w-28">Selesai</th>
                                                    <th className="px-4 py-3">Kegiatan / Aktivitas</th>
                                                    <th className="px-4 py-3 w-40">PIC</th>
                                                    <th className="px-3 py-3 w-12 text-center">Hapus</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y text-slate-700">
                                                {suggestedTimeplan.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} className="text-center py-6 text-slate-400">Tidak ada item jadwal</td>
                                                    </tr>
                                                ) : (
                                                    suggestedTimeplan.map((item, index) => (
                                                        <tr key={index} className="hover:bg-slate-50/50">
                                                            <td className="px-4 py-2.5">
                                                                <input
                                                                    type="text"
                                                                    value={item.day_offset}
                                                                    onChange={(e) => updateTimeplanItem(index, 'day_offset', e.target.value)}
                                                                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-sm font-semibold"
                                                                />
                                                            </td>
                                                            <td className="px-3 py-2.5">
                                                                <input
                                                                    type="text"
                                                                    value={item.time_start || ''}
                                                                    onChange={(e) => updateTimeplanItem(index, 'time_start', e.target.value)}
                                                                    placeholder="e.g. 08:00"
                                                                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-sm"
                                                                />
                                                            </td>
                                                            <td className="px-3 py-2.5">
                                                                <input
                                                                    type="text"
                                                                    value={item.time_end || ''}
                                                                    onChange={(e) => updateTimeplanItem(index, 'time_end', e.target.value)}
                                                                    placeholder="e.g. 17:00"
                                                                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-sm"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-2.5">
                                                                <input
                                                                    type="text"
                                                                    value={item.activity}
                                                                    onChange={(e) => updateTimeplanItem(index, 'activity', e.target.value)}
                                                                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-sm"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-2.5">
                                                                <input
                                                                    type="text"
                                                                    value={item.pic}
                                                                    onChange={(e) => updateTimeplanItem(index, 'pic', e.target.value)}
                                                                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-sm"
                                                                />
                                                            </td>
                                                            <td className="px-3 py-2.5 text-center">
                                                                <button
                                                                    onClick={() => removeTimeplanItem(index)}
                                                                    className="text-slate-400 hover:text-rose-600 rounded p-1 transition-colors"
                                                                >
                                                                    <Trash2 className="h-4.5 w-4.5" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-5 py-2.5 border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 text-sm font-semibold rounded-xl transition-colors"
                                >
                                    Kembali ke Input
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={applying}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-50"
                                >
                                    {applying ? (
                                        <>
                                            <RefreshCw className="h-4 w-4 animate-spin" />
                                            Menyimpan Plan...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="h-4.5 w-4.5" />
                                            Simpan Rekomendasi
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
