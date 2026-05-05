import React, { useState } from 'react';
import { usePaginatedQuery, useMutation, useQuery } from '@/hooks';
import { eventService } from '@/lib/services';
import { Event, CreateEventRequest } from '@/types/api';
import { EventForm, EventList, LoadingSkeleton, ErrorMessage, Pagination } from '@/components/common';
import { EventCard } from '@/components/events/EventCard';

export default function EventsPage() {
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);

    // Fetch events
    const { data: events, loading, error, page, setPage, hasMore, total, refetch } = 
        usePaginatedQuery((page) => eventService.getEvents(page));

    // Create/Update event mutation
    const { mutate: saveEvent, loading: isSaving } = useMutation(
        (data: CreateEventRequest) => 
            editingEvent 
                ? eventService.updateEvent(editingEvent.id, data)
                : eventService.createEvent(data),
        {
            onSuccess: () => {
                setShowForm(false);
                setEditingEvent(null);
                refetch();
            },
        }
    );

    // Delete event mutation
    const { mutate: deleteEvent } = useMutation(
        (id: number) => eventService.deleteEvent(id),
        {
            onSuccess: () => refetch(),
        }
    );

    const handleEdit = (event: Event) => {
        setEditingEvent(event);
        setShowForm(true);
    };

    const handleDelete = (event: Event) => {
        if (confirm(`Hapus event "${event.name}"?`)) {
            deleteEvent(event.id);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingEvent(null);
    };

    const totalPages = Math.ceil(total / 15);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
                    <p className="text-gray-600 mt-1">Kelola semua event Anda</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        + Buat Event Baru
                    </button>
                )}
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                        {editingEvent ? 'Edit Event' : 'Buat Event Baru'}
                    </h2>
                    <EventForm
                        event={editingEvent || undefined}
                        onSubmit={saveEvent}
                        loading={isSaving}
                        onCancel={handleCancel}
                    />
                </div>
            )}

            {/* Events List */}
            {error ? (
                <ErrorMessage onRetry={refetch} />
            ) : (
                <>
                    <EventList
                        events={events || []}
                        loading={loading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    )}
                </>
            )}
        </div>
    );
}
