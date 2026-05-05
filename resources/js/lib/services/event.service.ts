// Event API Service
import apiClient from '@/lib/api-client';
import {
    Event,
    CreateEventRequest,
    PaginatedResponse,
    RABItem,
    RABTotal,
    BudgetStatus,
} from '@/types/api';

export const eventService = {
    // Get all events
    getEvents: (page: number = 1) => 
        apiClient.get<PaginatedResponse<Event>>('/events', { params: { page } }),

    // Get single event
    getEvent: (id: number) => 
        apiClient.get<Event>(`/events/${id}`),

    // Create event
    createEvent: (data: CreateEventRequest) => 
        apiClient.post<Event>('/events', data),

    // Update event
    updateEvent: (id: number, data: Partial<CreateEventRequest>) => 
        apiClient.put<Event>(`/events/${id}`, data),

    // Delete event
    deleteEvent: (id: number) => 
        apiClient.delete(`/events/${id}`),

    // Get dashboard stats
    getDashboardStats: () => 
        apiClient.get('/dashboard/stats'),

    // Get RAB items for event
    getRabItems: (eventId: number, page: number = 1) => 
        apiClient.get<PaginatedResponse<RABItem>>('/rab-items', { params: { event_id: eventId, page } }),

    // Get RAB total
    getRabTotal: (eventId: number) => 
        apiClient.get<RABTotal>(`/events/${eventId}/rab-total`),

    // Get budget status
    getBudgetStatus: (eventId: number) => 
        apiClient.get<BudgetStatus>(`/events/${eventId}/budget-status`),
};
