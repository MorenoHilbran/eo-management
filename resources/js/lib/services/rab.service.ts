// RAB Item API Service
import apiClient from '@/lib/api-client';
import {
    RABItem,
    CreateRABItemRequest,
    PaginatedResponse,
} from '@/types/api';

export const rabService = {
    // Get RAB items
    getItems: (eventId: number, page: number = 1) => 
        apiClient.get<PaginatedResponse<RABItem>>('/rab-items', { 
            params: { event_id: eventId, page } 
        }),

    // Get single RAB item
    getItem: (id: number) => 
        apiClient.get<RABItem>(`/rab-items/${id}`),

    // Create RAB item
    createItem: (data: CreateRABItemRequest) => 
        apiClient.post<RABItem>('/rab-items', data),

    // Update RAB item
    updateItem: (id: number, data: Partial<CreateRABItemRequest>) => 
        apiClient.put<RABItem>(`/rab-items/${id}`, data),

    // Delete RAB item
    deleteItem: (id: number) => 
        apiClient.delete(`/rab-items/${id}`),
};
