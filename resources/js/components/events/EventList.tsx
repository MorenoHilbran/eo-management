import React, { useState } from 'react';
import { Event } from '@/types/api';
import { LoadingSkeleton, Modal } from '@/components/common';
import { useDateFormat, useCurrency } from '@/hooks';

interface EventListProps {
    events: Event[];
    loading: boolean;
    onEdit?: (event: Event) => void;
    onDelete?: (event: Event) => void;
}

export function EventList({ events, loading, onEdit, onDelete }: EventListProps) {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
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
        <>
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
                            <tr key={event.id} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => setSelectedEvent(event)}
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        {event.name}
                                    </button>
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
                                            onClick={() => onEdit(event)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            Edit
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            onClick={() => onDelete(event)}
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

            {/* Event Detail Modal */}
            {selectedEvent && (
                <Modal onClose={() => setSelectedEvent(null)}>
                    <div className="w-full max-w-2xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedEvent.name}</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600">Tanggal Event</p>
                                <p className="font-medium text-gray-900">{formatDate(selectedEvent.event_date)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Lokasi</p>
                                <p className="font-medium text-gray-900">{selectedEvent.location}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Deskripsi</p>
                                <p className="font-medium text-gray-900">{selectedEvent.description}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Budget</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(selectedEvent.budget)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Status</p>
                                <p className="font-medium text-gray-900">{selectedEvent.status}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedEvent(null)}
                            className="mt-6 w-full px-4 py-2 bg-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-300"
                        >
                            Tutup
                        </button>
                    </div>
                </Modal>
            )}
        </>
    );
}
