// Proposal API Service
import apiClient from '@/lib/api-client';
import {
    Proposal,
    CreateProposalRequest,
    PaginatedResponse,
} from '@/types/api';

export const proposalService = {
    // Get proposals
    getProposals: (eventId?: number, page: number = 1) => 
        apiClient.get<PaginatedResponse<Proposal>>('/proposals', { 
            params: { ...(eventId && { event_id: eventId }), page } 
        }),

    // Get single proposal
    getProposal: (id: number) => 
        apiClient.get<Proposal>(`/proposals/${id}`),

    // Create proposal
    createProposal: (data: CreateProposalRequest) => 
        apiClient.post<Proposal>('/proposals', data),

    // Update proposal
    updateProposal: (id: number, data: Partial<CreateProposalRequest>) => 
        apiClient.put<Proposal>(`/proposals/${id}`, data),

    // Delete proposal
    deleteProposal: (id: number) => 
        apiClient.delete(`/proposals/${id}`),

    // Send proposal
    sendProposal: (id: number) => 
        apiClient.post<Proposal>(`/proposals/${id}/send`, {}),

    // Sign proposal
    signProposal: (id: number, signature?: string) => 
        apiClient.post<Proposal>(`/proposals/${id}/sign`, { signature_file: signature }),
};
