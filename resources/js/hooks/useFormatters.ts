// Hook untuk format currency (IDR)
export function useCurrency() {
    const format = (value: string | number): string => {
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(numValue);
    };

    return { format };
}

// Hook untuk format date
export function useDateFormat() {
    const format = (date: string, includeTime: boolean = false): string => {
        const d = new Date(date);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        
        if (includeTime) {
            options.hour = '2-digit';
            options.minute = '2-digit';
        }

        return d.toLocaleDateString('id-ID', options);
    };

    return { format };
}

// Hook untuk status badge color
export function useStatusColor() {
    const getEventStatusColor = (status: string): string => {
        const colors: Record<string, string> = {
            planning: 'bg-blue-100 text-blue-800',
            ongoing: 'bg-green-100 text-green-800',
            completed: 'bg-gray-100 text-gray-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getTransactionStatusColor = (status: string): string => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getProposalStatusColor = (status: string): string => {
        const colors: Record<string, string> = {
            draft: 'bg-gray-100 text-gray-800',
            sent: 'bg-blue-100 text-blue-800',
            signed: 'bg-green-100 text-green-800',
            expired: 'bg-orange-100 text-orange-800',
            rejected: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getVendorStatusColor = (status: string): string => {
        const colors: Record<string, string> = {
            active: 'bg-green-100 text-green-800',
            inactive: 'bg-gray-100 text-gray-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return {
        getEventStatusColor,
        getTransactionStatusColor,
        getProposalStatusColor,
        getVendorStatusColor,
    };
}
