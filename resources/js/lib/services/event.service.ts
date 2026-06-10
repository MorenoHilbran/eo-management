// Event API Service
import apiClient from '@/lib/api-client';
import {
    Event,
    CreateEventRequest,
    PaginatedResponse,
    RABItem,
    RABTotal,
    BudgetStatus,
    EventTimeplan,
    CreateTimeplanRequest,
    AIPlanGenerationResponse,
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

    // AI Generation
    generateAIPlan: (eventId: number, prompt?: string) =>
        apiClient.post<AIPlanGenerationResponse>(`/events/${eventId}/generate-ai-plan`, { prompt }),

    // Apply AI Plan
    applyAIPlan: (eventId: number, data: { mode: 'append' | 'overwrite', budget_items: any[], timeplan_items: any[] }) =>
        apiClient.post(`/events/${eventId}/apply-ai-plan`, data),

    // Timeplan Management
    getTimeplans: (eventId: number) =>
        apiClient.get<EventTimeplan[]>(`/events/${eventId}/timeplans`),

    storeTimeplan: (eventId: number, data: CreateTimeplanRequest) =>
        apiClient.post<EventTimeplan>(`/events/${eventId}/timeplans`, data),

    updateTimeplan: (id: number, data: Partial<CreateTimeplanRequest>) =>
        apiClient.put<EventTimeplan>(`/timeplans/${id}`, data),

    destroyTimeplan: (id: number) =>
        apiClient.delete(`/timeplans/${id}`),
};
