import React from 'react';
import { ArrowRight } from 'lucide-react';

interface PageHeaderProps {
    category?: string;
    title: string;
    description?: string;
    actionLabel?: string;
    onActionClick?: () => void;
    actionDisabled?: boolean;
}

export function PageHeader({
    category,
    title,
    description,
    actionLabel,
    onActionClick,
    actionDisabled = false,
}: PageHeaderProps) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    {category && (
                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
                            {category}
                        </p>
                    )}
                    <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                        {title}
                    </h1>
                    {description && (
                        <p className="mt-1 text-slate-500">
                            {description}
                        </p>
                    )}
                </div>
                {actionLabel && onActionClick && (
                    <button
                        onClick={onActionClick}
                        disabled={actionDisabled}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:bg-slate-300"
                    >
                        {actionLabel}
                        <ArrowRight className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
