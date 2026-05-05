import React from 'react';

interface LoadingSkeletonProps {
    count?: number;
    height?: string;
}

export function LoadingSkeleton({ count = 5, height = 'h-12' }: LoadingSkeletonProps) {
    return (
        <div className="space-y-3">
            {Array(count)
                .fill(0)
                .map((_, i) => (
                    <div key={i} className={`${height} bg-gray-200 rounded animate-pulse`}></div>
                ))}
        </div>
    );
}

interface ErrorMessageProps {
    message?: string;
    onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
    return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-800 font-medium">Terjadi Kesalahan</div>
            <div className="text-red-700 text-sm mt-1">
                {message || 'Gagal memuat data. Silakan coba lagi.'}
            </div>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                >
                    Coba Lagi
                </button>
            )}
        </div>
    );
}

interface EmptyStateProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
    return (
        <div className="text-center py-12">
            {icon && <div className="text-4xl mb-4">{icon}</div>}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {description && <p className="text-gray-600 text-sm mt-1">{description}</p>}
        </div>
    );
}

interface CurrencyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export function CurrencyInput({
    label,
    error,
    helperText,
    value,
    onChange,
    ...props
}: CurrencyInputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numValue = e.target.value.replace(/[^0-9]/g, '');
        onChange?.({ ...e, target: { ...e.target, value: numValue } } as any);
    };

    const displayValue = value
        ? new Intl.NumberFormat('id-ID').format(Number(value))
        : '';

    return (
        <div className="space-y-2">
            {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                <input
                    type="text"
                    value={displayValue}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        error ? 'border-red-500' : 'border-gray-300'
                    }`}
                    {...props}
                />
            </div>
            {error && <span className="text-sm text-red-600">{error}</span>}
            {helperText && <span className="text-sm text-gray-500">{helperText}</span>}
        </div>
    );
}

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'primary';
    className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
    const variantClasses = {
        default: 'bg-gray-100 text-gray-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        error: 'bg-red-100 text-red-800',
        primary: 'bg-blue-100 text-blue-800',
    };

    return (
        <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${variantClasses[variant]} ${className}`}>
            {children}
        </span>
    );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    children: React.ReactNode;
}

export function Button({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    children,
    className = '',
    ...props
}: ButtonProps) {
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        success: 'bg-green-600 text-white hover:bg-green-700',
    };

    const sizes = {
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button
            className={`${variants[variant]} ${sizes[size]} rounded-lg font-medium transition-colors disabled:opacity-50 ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? 'Loading...' : children}
        </button>
    );
}

interface CardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export function Card({ title, children, className = '' }: CardProps) {
    return (
        <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
            {title && <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>}
            {children}
        </div>
    );
}

interface TableProps {
    headers: string[];
    rows: React.ReactNode[][];
}

export function Table({ headers, rows }: TableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b bg-gray-50">
                        {headers.map((header, i) => (
                            <th key={i} className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                            {row.map((cell, j) => (
                                <td key={j} className="px-6 py-4 text-sm text-gray-900">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

interface ModalProps {
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
}

export function Modal({ onClose, children, className = '' }: ModalProps) {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className={`bg-white rounded-lg max-h-screen overflow-y-auto p-6 ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
    return (
        <div>
            {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
            <input
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    error ? 'border-red-500' : 'border-gray-300'
                } ${className}`}
                {...props}
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="flex justify-center gap-2 mt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                ← Sebelumnya
            </button>

            {startPage > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className="px-3 py-2 border rounded hover:bg-gray-50"
                    >
                        1
                    </button>
                    {startPage > 2 && <span className="px-2 py-2">...</span>}
                </>
            )}

            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-2 border rounded ${
                        page === currentPage
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'hover:bg-gray-50'
                    }`}
                >
                    {page}
                </button>
            ))}

            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && <span className="px-2 py-2">...</span>}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className="px-3 py-2 border rounded hover:bg-gray-50"
                    >
                        {totalPages}
                    </button>
                </>
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Selanjutnya →
            </button>
        </div>
    );
}

export { EventForm } from '../events/EventForm';
export { EventList } from '../events/EventList';
