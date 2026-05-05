// Vendor API Service
import apiClient from '@/lib/api-client';
import {
    Vendor,
    VendorCategory,
    CreateVendorRequest,
    PaginatedResponse,
} from '@/types/api';

export const vendorService = {
    // Vendor Categories
    getCategories: (page: number = 1) => 
        apiClient.get<PaginatedResponse<VendorCategory>>('/vendor-categories', { params: { page } }),

    getCategory: (id: number) => 
        apiClient.get<VendorCategory>(`/vendor-categories/${id}`),

    createCategory: (data: { name: string; description?: string }) => 
        apiClient.post<VendorCategory>('/vendor-categories', data),

    updateCategory: (id: number, data: { name?: string; description?: string }) => 
        apiClient.put<VendorCategory>(`/vendor-categories/${id}`, data),

    deleteCategory: (id: number) => 
        apiClient.delete(`/vendor-categories/${id}`),

    // Vendors
    getVendors: (page: number = 1) => 
        apiClient.get<PaginatedResponse<Vendor>>('/vendors', { params: { page } }),

    getVendor: (id: number) => 
        apiClient.get<Vendor>(`/vendors/${id}`),

    createVendor: (data: CreateVendorRequest) => 
        apiClient.post<Vendor>('/vendors', data),

    updateVendor: (id: number, data: Partial<CreateVendorRequest>) => 
        apiClient.put<Vendor>(`/vendors/${id}`, data),

    deleteVendor: (id: number) => 
        apiClient.delete(`/vendors/${id}`),
};
