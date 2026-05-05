import React from 'react';
import { Event } from '@/types/api';
import { LoadingSkeleton } from '@/components/common';
import { useDateFormat, useCurrency } from '@/hooks';

interface EventListProps {
    events: Event[];
    loading: boolean;
    onEdit?: (event: Event) => void;
    onDelete?: (event: Event) => void;
    onClick?: (event: Event) => void;
}

export function EventList({ events, loading, onEdit, onDelete, onClick }: EventListProps) {
    const { format: formatDate } = useDateFormat();
    const { format: formatCurrency } = useCurrency();

    if (loading) {
        return <LoadingSkeleton count={5} />;
    }

    if (!events || events.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-600">Tidak ada event</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
                <thead>
                    <tr className="border-b bg-gray-50">
                        <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                            Event
                        </th>
                        <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                            Tanggal
                        </th>
                        <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                            Lokasi
                        </th>
                        <th className="text-right px-6 py-3 text-sm font-semibold text-gray-900">
                            Budget
                        </th>
                        <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                            Status
                        </th>
                        <th className="text-right px-6 py-3 text-sm font-semibold text-gray-900">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event) => (
                        <tr
                            key={event.id}
                            onClick={() => onClick?.(event)}
                            className={`border-b transition hover:bg-gray-50 ${onClick ? 'cursor-pointer' : ''}`}
                        >
                            <td className="px-6 py-4">
                                <span className="font-medium text-gray-900 hover:text-blue-700">
                                    {event.name}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                {formatDate(event.event_date)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                {event.location}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-right text-gray-900">
                                {formatCurrency(event.budget)}
                            </td>
                            <td className="px-6 py-4 text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    event.status === 'planning'
                                        ? 'bg-blue-100 text-blue-800'
                                        : event.status === 'ongoing'
                                        ? 'bg-green-100 text-green-800'
                                        : event.status === 'completed'
                                        ? 'bg-gray-100 text-gray-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {event.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right text-sm space-x-2">
                                {onEdit && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(event);
                                        }}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Edit
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(event);
                                        }}
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
