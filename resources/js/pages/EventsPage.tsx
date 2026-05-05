import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaginatedQuery, useMutation, useQuery } from '@/hooks';
import { eventService } from '@/lib/services';
import { Event, CreateEventRequest } from '@/types/api';
import { EventForm, EventList, LoadingSkeleton, ErrorMessage, Pagination } from '@/components/common';
import { EventCard } from '@/components/events/EventCard';

export default function EventsPage() {
    const navigate = useNavigate();
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
        <div className="space-y-8">
            {/* Header */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Operations</p>
                        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Event Management</h1>
                        <p className="mt-1 text-slate-500">Kelola semua event dengan tampilan yang lebih sederhana dan jelas.</p>
                    </div>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
                        >
                            + Buat Event Baru
                        </button>
                    )}
                </div>
            </div>

            {/* Form */}
            {showForm && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-slate-900">
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
<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <EventList
                        events={events || []}
                        loading={loading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onClick={(event) => navigate(`/events/${event.id}`)}
                    />
                </div>

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
