// SOP API Service
import apiClient from '@/lib/api-client';
import {
    SOP,
    CreateSOPRequest,
    PaginatedResponse,
} from '@/types/api';

export const sopService = {
    // Get SOPs
    getSops: (category?: string, page: number = 1) => 
        apiClient.get<PaginatedResponse<SOP>>('/sops', { 
            params: { ...(category && { category }), page } 
        }),

    // Get single SOP
    getSop: (id: number) => 
        apiClient.get<SOP>(`/sops/${id}`),

    // Create SOP
    createSop: (data: CreateSOPRequest) => 
        apiClient.post<SOP>('/sops', data),

    // Update SOP
    updateSop: (id: number, data: Partial<CreateSOPRequest>) => 
        apiClient.put<SOP>(`/sops/${id}`, data),

    // Delete SOP
    deleteSop: (id: number) => 
        apiClient.delete(`/sops/${id}`),

    // Get categories
    getCategories: () => 
        apiClient.get<string[]>('/sops/categories/list'),
};
