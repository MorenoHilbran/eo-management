import React from 'react';

interface PageCardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export function PageCard({ title, children, className = '' }: PageCardProps) {
    return (
        <div className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
            {title && (
                <h2 className="mb-4 text-lg font-semibold text-slate-900">
                    {title}
                </h2>
            )}
            {children}
        </div>
    );
}
