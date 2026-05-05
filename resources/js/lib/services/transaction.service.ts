// Transaction API Service
import apiClient from '@/lib/api-client';
import {
    Transaction,
    CreateTransactionRequest,
    PaginatedResponse,
} from '@/types/api';

export const transactionService = {
    // Get transactions
    getTransactions: (eventId?: number, status?: string, page: number = 1) => 
        apiClient.get<PaginatedResponse<Transaction>>('/transactions', { 
            params: { 
                ...(eventId && { event_id: eventId }), 
                ...(status && { status }), 
                page 
            } 
        }),

    // Get single transaction
    getTransaction: (id: number) => 
        apiClient.get<Transaction>(`/transactions/${id}`),

    // Create transaction
    createTransaction: (data: CreateTransactionRequest) => 
        apiClient.post<Transaction>('/transactions', data),

    // Update transaction
    updateTransaction: (id: number, data: Partial<CreateTransactionRequest>) => 
        apiClient.put<Transaction>(`/transactions/${id}`, data),

    // Delete transaction
    deleteTransaction: (id: number) => 
        apiClient.delete(`/transactions/${id}`),

    // Approve transaction
    approveTransaction: (id: number) => 
        apiClient.post<Transaction>(`/transactions/${id}/approve`, {}),

    // Reject transaction
    rejectTransaction: (id: number, reason: string) => 
        apiClient.post<Transaction>(`/transactions/${id}/reject`, { 
            rejection_reason: reason 
        }),
};
