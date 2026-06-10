import React, { useMemo, useState } from 'react';
import { EventTimeplan } from '@/types/api';
import { Calendar, Clock, User, Flag, ChevronDown, ChevronUp } from 'lucide-react';

interface TimeplanTimelineProps {
    items: EventTimeplan[];
    eventDate: string;
    loading?: boolean;
    onEdit?: (item: EventTimeplan) => void;
    onDelete?: (item: EventTimeplan) => void;
}

// ─── Date Helpers ───────────────────────────────────────────────────────────

function resolveDate(dayOffset: string, eventDate: Date): Date {
    if (dayOffset.toLowerCase() === 'hari pelaksanaan') return new Date(eventDate);
    const match = dayOffset.match(/H-(\d+)/i);
    if (match) {
        const result = new Date(eventDate);
        result.setDate(result.getDate() - parseInt(match[1]));
        return result;
    }
    // Unknown offset → place 2 days before event
    const result = new Date(eventDate);
    result.setDate(result.getDate() - 2);
    return result;
}

function formatDateShort(date: Date): string {
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

function formatDateLong(date: Date): string {
    return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function daysBetween(a: Date, b: Date): number {
    return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

// ─── Phase Styling ───────────────────────────────────────────────────────────

function getPhaseStyle(offset: string): {
    barGradient: string;
    dotColor: string;
    badgeCls: string;
    label: string;
} {
    if (offset.toLowerCase() === 'hari pelaksanaan') {
        return {
            barGradient: 'from-sky-500 via-sky-400 to-emerald-400',
            dotColor: 'bg-sky-500',
            badgeCls: 'bg-sky-100 text-sky-800 ring-1 ring-sky-300',
            label: 'Hari Pelaksanaan',
        };
    }
    const match = offset.match(/H-(\d+)/i);
    if (match) {
        const days = parseInt(match[1]);
        if (days >= 21) return {
            barGradient: 'from-slate-400 to-slate-500',
            dotColor: 'bg-slate-500',
            badgeCls: 'bg-slate-100 text-slate-700 ring-1 ring-slate-300',
            label: offset,
        };
        if (days >= 10) return {
            barGradient: 'from-indigo-400 to-blue-500',
            dotColor: 'bg-blue-500',
            badgeCls: 'bg-blue-100 text-blue-800 ring-1 ring-blue-300',
            label: offset,
        };
        if (days >= 5) return {
            barGradient: 'from-amber-400 to-orange-500',
            dotColor: 'bg-amber-500',
            badgeCls: 'bg-amber-100 text-amber-800 ring-1 ring-amber-300',
            label: offset,
        };
        return {
            barGradient: 'from-rose-400 to-rose-500',
            dotColor: 'bg-rose-500',
            badgeCls: 'bg-rose-100 text-rose-800 ring-1 ring-rose-300',
            label: offset,
        };
    }
    return {
        barGradient: 'from-purple-400 to-purple-500',
        dotColor: 'bg-purple-500',
        badgeCls: 'bg-purple-100 text-purple-800 ring-1 ring-purple-300',
        label: offset,
    };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface PhaseRowProps {
    offset: string;
    activities: EventTimeplan[];
    phaseDate: Date;
    barStartPct: number;
    barWidthPct: number;
    isDDay: boolean;
    isLast: boolean;
    onEdit?: (item: EventTimeplan) => void;
    onDelete?: (item: EventTimeplan) => void;
}

function PhaseRow({
    offset,
    activities,
    phaseDate,
    barStartPct,
    barWidthPct,
    isDDay,
    onEdit,
    onDelete,
}: PhaseRowProps) {
    const [expanded, setExpanded] = useState(false);
    const style = getPhaseStyle(offset);

    return (
        <div className={`group relative ${isDDay ? 'bg-sky-50/40' : 'bg-white'} border border-slate-200 rounded-2xl overflow-hidden transition-shadow hover:shadow-sm`}>
            <div className="flex items-stretch min-h-[64px]">
                {/* Left: Phase meta */}
                <div className="w-[200px] shrink-0 flex flex-col justify-center px-4 py-3 border-r border-slate-100 bg-slate-50/50">
                    <span className={`inline-block self-start text-xs font-bold px-2 py-0.5 rounded-full ${style.badgeCls} mb-1`}>
                        {style.label}
                    </span>
                    <p className="text-xs text-slate-500 font-medium">{formatDateShort(phaseDate)}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{activities.length} kegiatan</p>
                </div>

                {/* Right: Timeline track */}
                <div className="flex-1 relative flex items-center py-3 px-2 overflow-hidden">
                    {/* Horizontal track background */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 bg-slate-100 rounded-full mx-2" />

                    {/* Gantt bar */}
                    {isDDay ? (
                        /* D-Day: just a dot/flag at the position */
                        <div
                            className="absolute top-1/2 -translate-y-1/2 z-10"
                            style={{ left: `calc(${barStartPct}% - 10px)` }}
                        >
                            <div className={`flex flex-col items-center`}>
                                <div className={`h-5 w-5 rounded-full ${style.dotColor} ring-4 ring-white shadow-lg flex items-center justify-center`}>
                                    <Flag className="h-2.5 w-2.5 text-white" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Bar */}
                            <div
                                className={`absolute top-1/2 -translate-y-1/2 h-5 rounded-full bg-gradient-to-r ${style.barGradient} shadow-sm z-10 flex items-center px-2 overflow-hidden`}
                                style={{
                                    left: `${barStartPct}%`,
                                    width: `${Math.max(barWidthPct, 1.5)}%`,
                                }}
                            >
                                {/* Start dot */}
                                <div className="h-2 w-2 bg-white/70 rounded-full shrink-0 mr-1.5" />
                                {/* Activity names (first 2) */}
                                <div className="flex gap-1 overflow-hidden min-w-0">
                                    {activities.slice(0, 2).map((act, i) => (
                                        <span key={i} className="text-[9px] text-white/90 font-semibold truncate">
                                            {act.activity}
                                        </span>
                                    ))}
                                    {activities.length > 2 && (
                                        <span className="text-[9px] text-white/70 font-semibold shrink-0">
                                            +{activities.length - 2}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Expand toggle */}
                    <button
                        onClick={() => setExpanded((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-6 w-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-400 transition-colors shadow-sm"
                        title="Tampilkan kegiatan"
                    >
                        {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                </div>
            </div>

            {/* Expanded: Activities list */}
            {expanded && (
                <div className="border-t border-slate-100 bg-slate-50/30 divide-y divide-slate-100">
                    {activities.map((act) => (
                        <div key={act.id} className="flex items-start gap-3 px-5 py-2.5 text-sm hover:bg-white/60 transition-colors group/item">
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-900 truncate">{act.activity}</p>
                                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                                    {isDDay && (act.time_start || act.time_end) && (
                                        <span className="inline-flex items-center gap-1 text-xs text-sky-700">
                                            <Clock className="h-3 w-3" />
                                            {act.time_start || '??:??'}{act.time_end ? ` – ${act.time_end}` : ''}
                                        </span>
                                    )}
                                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                                        <User className="h-3 w-3" />
                                        {act.pic}
                                    </span>
                                    {act.notes && (
                                        <span className="text-xs text-slate-400 italic truncate max-w-xs">{act.notes}</span>
                                    )}
                                </div>
                            </div>
                            {(onEdit || onDelete) && (
                                <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0">
                                    {onEdit && (
                                        <button onClick={() => onEdit(act)} className="p-1 text-slate-400 hover:text-sky-600 rounded transition-colors" title="Edit">
                                            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button onClick={() => onDelete(act)} className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors" title="Hapus">
                                            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Main Timeline Component ──────────────────────────────────────────────────

export function TimeplanTimeline({ items, eventDate, loading, onEdit, onDelete }: TimeplanTimelineProps) {
    // Parse event date to midnight local
    const eventDateObj = useMemo(() => {
        const d = new Date(eventDate);
        d.setHours(0, 0, 0, 0);
        return d;
    }, [eventDate]);

    // Group items by day_offset and compute actual dates
    const phases = useMemo(() => {
        const groups: Record<string, EventTimeplan[]> = {};
        items.forEach((item) => {
            const key = item.day_offset;
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
        });

        return Object.entries(groups)
            .map(([offset, acts]) => ({
                offset,
                activities: acts,
                date: resolveDate(offset, eventDateObj),
                isDDay: offset.toLowerCase() === 'hari pelaksanaan',
            }))
            .sort((a, b) => a.date.getTime() - b.date.getTime());
    }, [items, eventDateObj]);

    // Determine full timeline range
    const { timelineStart, timelineEnd, totalDays } = useMemo(() => {
        const earliest = phases.length > 0 ? phases[0].date : eventDateObj;
        const spanDays = daysBetween(earliest, eventDateObj);
        const paddingLeft = Math.max(3, Math.ceil(spanDays * 0.04));
        const paddingRight = 4;

        const start = new Date(earliest);
        start.setDate(start.getDate() - paddingLeft);

        const end = new Date(eventDateObj);
        end.setDate(end.getDate() + paddingRight);

        const total = Math.max(1, daysBetween(start, end));
        return { timelineStart: start, timelineEnd: end, totalDays: total };
    }, [phases, eventDateObj]);

    // Convert a date to a percentage position in the timeline
    const getPosPct = (date: Date): number => {
        const diff = daysBetween(timelineStart, date);
        return Math.max(0, Math.min(100, (diff / totalDays) * 100));
    };

    // Date ruler ticks
    const dateTicks = useMemo(() => {
        const ticks: Date[] = [];
        const interval = totalDays > 60 ? 14 : totalDays > 30 ? 7 : totalDays > 14 ? 3 : 2;
        const cur = new Date(timelineStart);
        while (cur <= timelineEnd) {
            ticks.push(new Date(cur));
            cur.setDate(cur.getDate() + interval);
        }
        return ticks;
    }, [timelineStart, timelineEnd, totalDays]);

    // Month separators for the header
    const monthSeparators = useMemo(() => {
        const seps: { label: string; leftPct: number }[] = [];
        const cur = new Date(timelineStart);
        cur.setDate(1);
        while (cur <= timelineEnd) {
            const pct = getPosPct(cur);
            seps.push({
                label: cur.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
                leftPct: Math.max(0, pct),
            });
            cur.setMonth(cur.getMonth() + 1);
        }
        return seps;
    }, [timelineStart, timelineEnd, totalDays]);

    // Today & Event day positions
    const today = useMemo(() => { const t = new Date(); t.setHours(0, 0, 0, 0); return t; }, []);
    const todayPct = getPosPct(today);
    const eventPct = getPosPct(eventDateObj);
    const todayVisible = todayPct > 1 && todayPct < 99;

    if (loading) {
        return (
            <div className="space-y-3 p-2">
                {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (!items || items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 border border-dashed border-slate-200 bg-slate-50/50 rounded-2xl">
                <Calendar className="h-10 w-10 mb-3 text-slate-300" />
                <p className="font-semibold text-slate-600">Belum ada agenda</p>
                <p className="text-sm mt-1">Gunakan AI Generator atau tambahkan jadwal secara manual.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3 select-none">
            {/* ── Legend ── */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pb-1">
                <span className="font-semibold text-slate-700">Keterangan:</span>
                {[
                    { cls: 'from-slate-400 to-slate-500', label: 'H-21+' },
                    { cls: 'from-indigo-400 to-blue-500', label: 'H-10 s/d H-21' },
                    { cls: 'from-amber-400 to-orange-500', label: 'H-5 s/d H-10' },
                    { cls: 'from-rose-400 to-rose-500', label: 'H-1 s/d H-5' },
                    { cls: 'from-sky-500 to-emerald-400', label: 'Hari Pelaksanaan' },
                ].map((l) => (
                    <span key={l.label} className="flex items-center gap-1.5">
                        <span className={`inline-block h-2.5 w-8 rounded-full bg-gradient-to-r ${l.cls}`} />
                        {l.label}
                    </span>
                ))}
                {todayVisible && (
                    <span className="flex items-center gap-1.5">
                        <span className="inline-block h-3 w-0.5 bg-emerald-500 rounded-full" />
                        Hari ini
                    </span>
                )}
                <span className="flex items-center gap-1.5">
                    <span className="inline-block h-3 w-0.5 bg-sky-600 rounded-full" />
                    Hari Event
                </span>
            </div>

            {/* ── Timeline card ── */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                {/* Date ruler */}
                <div className="flex border-b border-slate-200 bg-slate-50/80">
                    {/* Left column spacer */}
                    <div className="w-[200px] shrink-0 border-r border-slate-200 px-4 py-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fase</p>
                    </div>

                    {/* Ruler area */}
                    <div className="flex-1 relative h-10 overflow-hidden">
                        {/* Month separators */}
                        {monthSeparators.map((sep, i) => (
                            <div
                                key={i}
                                className="absolute top-0 flex flex-col"
                                style={{ left: `${sep.leftPct}%` }}
                            >
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider pl-1 pt-0.5 truncate max-w-[120px]">
                                    {sep.label}
                                </span>
                            </div>
                        ))}

                        {/* Day ticks */}
                        {dateTicks.map((tick, i) => {
                            const pct = getPosPct(tick);
                            return (
                                <div
                                    key={i}
                                    className="absolute bottom-0 flex flex-col items-center"
                                    style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}
                                >
                                    <div className="h-1.5 w-px bg-slate-300" />
                                    <span className="text-[9px] text-slate-500 font-medium whitespace-nowrap">
                                        {formatDateShort(tick)}
                                    </span>
                                </div>
                            );
                        })}

                        {/* Event day tick label */}
                        <div
                            className="absolute bottom-0 flex flex-col items-center z-10"
                            style={{ left: `${eventPct}%`, transform: 'translateX(-50%)' }}
                        >
                            <div className="h-1.5 w-px bg-sky-500" />
                            <span className="text-[9px] text-sky-700 font-bold whitespace-nowrap bg-sky-50 px-1 rounded-sm">
                                {formatDateShort(eventDateObj)}
                            </span>
                        </div>

                        {/* Today tick label */}
                        {todayVisible && (
                            <div
                                className="absolute bottom-0 flex flex-col items-center z-10"
                                style={{ left: `${todayPct}%`, transform: 'translateX(-50%)' }}
                            >
                                <div className="h-1.5 w-px bg-emerald-500" />
                                <span className="text-[9px] text-emerald-700 font-bold whitespace-nowrap bg-emerald-50 px-1 rounded-sm">
                                    Hari ini
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Phase rows with embedded gantt track */}
                <div className="divide-y divide-slate-100">
                    {phases.map((phase, idx) => {
                        const nextPhaseDate = phases[idx + 1]?.date ?? eventDateObj;
                        const barStartPct = getPosPct(phase.date);
                        const barEndPct = getPosPct(phase.isDDay ? phase.date : nextPhaseDate);
                        const barWidthPct = Math.max(0, barEndPct - barStartPct);
                        const style = getPhaseStyle(phase.offset);

                        return (
                            <div
                                key={phase.offset}
                                className={`flex items-stretch min-h-[60px] ${phase.isDDay ? 'bg-sky-50/30' : ''}`}
                            >
                                {/* Left: Phase info */}
                                <div className="w-[200px] shrink-0 flex flex-col justify-center px-4 py-3 border-r border-slate-100">
                                    <span className={`inline-block self-start text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 ${style.badgeCls}`}>
                                        {style.label}
                                    </span>
                                    <p className="text-xs font-semibold text-slate-700">{formatDateShort(phase.date)}</p>
                                    <p className="text-[10px] text-slate-400">{phase.activities.length} kegiatan</p>
                                </div>

                                {/* Right: Gantt track + activities */}
                                <div className="flex-1 flex flex-col">
                                    {/* Track */}
                                    <div className="flex-1 relative flex items-center px-2" style={{ minHeight: '48px' }}>
                                        {/* Background track */}
                                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 rounded-full mx-2" />

                                        {/* Today vertical guide */}
                                        {todayVisible && (
                                            <div
                                                className="absolute top-0 bottom-0 w-px bg-emerald-400/60 z-10"
                                                style={{ left: `${todayPct}%` }}
                                            />
                                        )}

                                        {/* Event day vertical guide */}
                                        <div
                                            className="absolute top-0 bottom-0 w-0.5 bg-sky-400/50 z-10"
                                            style={{ left: `${eventPct}%` }}
                                        />

                                        {phase.isDDay ? (
                                            /* Flag for execution day */
                                            <div
                                                className="absolute top-1/2 -translate-y-1/2 z-20"
                                                style={{ left: `calc(${barStartPct}% - 8px)` }}
                                            >
                                                <div className={`h-6 w-6 rounded-full ${style.dotColor} ring-4 ring-white shadow-lg flex items-center justify-center`}>
                                                    <Flag className="h-3 w-3 text-white" />
                                                </div>
                                            </div>
                                        ) : (
                                            /* Gantt bar */
                                            <div
                                                className={`absolute top-1/2 -translate-y-1/2 h-7 rounded-full bg-gradient-to-r ${style.barGradient} shadow-sm z-20 flex items-center gap-1.5 px-2.5 overflow-hidden transition-all duration-150 hover:h-8`}
                                                style={{
                                                    left: `${barStartPct}%`,
                                                    width: `${Math.max(barWidthPct, 2)}%`,
                                                    minWidth: '24px',
                                                }}
                                                title={phase.activities.map((a) => a.activity).join(', ')}
                                            >
                                                {/* Start circle */}
                                                <div className="h-2.5 w-2.5 rounded-full bg-white/80 shrink-0" />
                                                {/* Activity pills (compact) */}
                                                <div className="flex gap-1 overflow-hidden flex-1 min-w-0">
                                                    {phase.activities.slice(0, 3).map((act, i) => (
                                                        <span key={i} className="text-[9px] text-white/90 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                                                            {act.activity}
                                                            {i < Math.min(phase.activities.length, 3) - 1 && <span className="opacity-60 mx-0.5">·</span>}
                                                        </span>
                                                    ))}
                                                    {phase.activities.length > 3 && (
                                                        <span className="text-[9px] text-white/70 font-semibold shrink-0">
                                                            +{phase.activities.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Activities detail (always shown, compact) */}
                                    <div className="border-t border-slate-50 bg-slate-50/30 px-4 py-1.5 flex flex-wrap gap-x-4 gap-y-1">
                                        {phase.activities.map((act) => (
                                            <div key={act.id} className="flex items-center gap-1.5 group/act">
                                                <span className={`h-1.5 w-1.5 rounded-full ${style.dotColor} shrink-0`} />
                                                <span className="text-[11px] text-slate-700 font-medium">
                                                    {phase.isDDay && act.time_start ? (
                                                        <span className="text-sky-600 mr-1 font-semibold">{act.time_start}</span>
                                                    ) : null}
                                                    {act.activity}
                                                </span>
                                                <span className="text-[10px] text-slate-400">({act.pic})</span>
                                                {(onEdit || onDelete) && (
                                                    <span className="flex gap-0.5 opacity-0 group-hover/act:opacity-100 transition-opacity">
                                                        {onEdit && (
                                                            <button
                                                                onClick={() => onEdit(act)}
                                                                className="p-0.5 rounded text-slate-300 hover:text-sky-600 transition-colors"
                                                                title="Edit"
                                                            >
                                                                <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                                                            </button>
                                                        )}
                                                        {onDelete && (
                                                            <button
                                                                onClick={() => onDelete(act)}
                                                                className="p-0.5 rounded text-slate-300 hover:text-rose-600 transition-colors"
                                                                title="Hapus"
                                                            >
                                                                <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                                            </button>
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom bar: timeline info */}
                <div className="flex items-center gap-4 px-5 py-3 border-t border-slate-100 bg-slate-50/70 text-xs text-slate-500">
                    <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span>
                        Timeline: <strong className="text-slate-700">{formatDateShort(timelineStart)}</strong> —{' '}
                        <strong className="text-slate-700">{formatDateShort(timelineEnd)}</strong>
                    </span>
                    <span className="ml-auto">
                        Hari Pelaksanaan:{' '}
                        <strong className="text-sky-700">{formatDateLong(eventDateObj)}</strong>
                    </span>
                </div>
            </div>
        </div>
    );
}
