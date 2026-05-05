// Type definitions for API responses

export interface PaginatedResponse<T> {
    data: T[];
    links: {
        first: string;
        last: string;
        next: string | null;
        prev: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

// User
export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

// Vendor Category
export interface VendorCategory {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    vendors?: Vendor[];
}

// Vendor
export interface Vendor {
    id: number;
    name: string;
    category_id: number;
    contact_person: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    rating: string;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
    category?: VendorCategory;
    events?: Event[];
}

// Event
export interface Event {
    id: number;
    name: string;
    description: string | null;
    event_date: string;
    location: string;
    budget: string;
    status: 'planning' | 'ongoing' | 'completed' | 'cancelled';
    created_by: number;
    created_at: string;
    updated_at: string;
    creator?: User;
    rabItems?: RABItem[];
    vendors?: Vendor[];
    proposals?: Proposal[];
    transactions?: Transaction[];
}

// RAB Item
export interface RABItem {
    id: number;
    event_id: number;
    name: string;
    unit: string;
    quantity: number;
    unit_price: string;
    total_price: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
    event?: Event;
}

// RAB Total Response
export interface RABTotal {
    event_id: number;
    total_cost: string;
    margin: string;
    total_with_margin: string;
}

// Proposal
export interface Proposal {
    id: number;
    event_id: number;
    template_name: string;
    content: string | null;
    status: 'draft' | 'sent' | 'signed' | 'expired' | 'rejected';
    created_by: number;
    sent_at: string | null;
    signed_at: string | null;
    expires_at: string | null;
    signature_file: string | null;
    created_at: string;
    updated_at: string;
    event?: Event;
    creator?: User;
}

// Transaction
export interface Transaction {
    id: number;
    event_id: number;
    amount: string;
    description: string;
    status: 'pending' | 'approved' | 'rejected';
    transaction_date: string;
    created_by: number;
    approved_by: number | null;
    approved_at: string | null;
    rejection_reason: string | null;
    created_at: string;
    updated_at: string;
    event?: Event;
    creator?: User;
    approver?: User;
}

// Budget Status Response
export interface BudgetStatus {
    event_id: number;
    budget: string;
    spent: string;
    pending: string;
    remaining: string;
    budget_alert: boolean;
}

// SOP
export interface SOP {
    id: number;
    name: string;
    category: string;
    description: string | null;
    content: string;
    file_path: string | null;
    created_by: number;
    created_at: string;
    updated_at: string;
    creator?: User;
}

// Dashboard Stats
export interface DashboardStats {
    total_events: number;
    ongoing_events: number;
    completed_events: number;
    total_budget: string;
}

// Create Request Types
export interface CreateEventRequest {
    name: string;
    description?: string;
    event_date: string;
    location: string;
    budget: number;
    status?: 'planning' | 'ongoing' | 'completed' | 'cancelled';
}

export interface CreateRABItemRequest {
    event_id: number;
    name: string;
    unit: string;
    quantity: number;
    unit_price: number;
    notes?: string;
}

export interface CreateVendorRequest {
    name: string;
    category_id: number;
    contact_person: string;
    email?: string;
    phone?: string;
    address?: string;
    status?: 'active' | 'inactive';
}

export interface CreateProposalRequest {
    event_id: number;
    template_name: string;
    content?: string;
    expires_at?: string;
}

export interface CreateTransactionRequest {
    event_id: number;
    amount: number;
    description: string;
    transaction_date: string;
}

export interface CreateSOPRequest {
    name: string;
    category: string;
    description?: string;
    content: string;
    file_path?: string;
}
