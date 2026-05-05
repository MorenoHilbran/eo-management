import React from 'react';
import { Event } from '@/types/api';
import { useDateFormat, useCurrency, useStatusColor } from '@/hooks';
import { Badge } from './index';

interface EventCardProps {
    event: Event;
    onEdit?: (event: Event) => void;
    onDelete?: (event: Event) => void;
    onClick?: (event: Event) => void;
}

export function EventCard({ event, onEdit, onDelete, onClick }: EventCardProps) {
    const { format: formatDate } = useDateFormat();
    const { format: formatCurrency } = useCurrency();
    const { getEventStatusColor } = useStatusColor();

    return (
        <div
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onClick?.(event)}
        >
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{event.location}</p>
                </div>
                <Badge className={getEventStatusColor(event.status)}>
                    {event.status}
                </Badge>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div>📅 {formatDate(event.event_date, true)}</div>
                <div>💰 Budget: {formatCurrency(event.budget)}</div>
            </div>

            {event.description && (
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">{event.description}</p>
            )}

            <div className="flex gap-2">
                {onEdit && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(event);
                        }}
                        className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
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
                        className="flex-1 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                        Hapus
                    </button>
                )}
            </div>
        </div>
    );
}

interface EventListProps {
    events: Event[];
    loading?: boolean;
    onEdit?: (event: Event) => void;
    onDelete?: (event: Event) => void;
    onClick?: (event: Event) => void;
}

export function EventList({ events, loading, onEdit, onDelete, onClick }: EventListProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array(6)
                    .fill(0)
                    .map((_, i) => (
                        <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
                    ))}
            </div>
        );
    }

    if (!events || events.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Tidak ada event ditemukan</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
                <EventCard
                    key={event.id}
                    event={event}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onClick={onClick}
                />
            ))}
        </div>
    );
}
