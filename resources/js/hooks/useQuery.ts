// Custom hook untuk fetch data dengan loading dan error handling
import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';

interface UseQueryOptions<T> {
    enabled?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: AxiosError) => void;
}

interface UseQueryReturn<T> {
    data: T | null;
    loading: boolean;
    error: AxiosError | null;
    refetch: () => Promise<void>;
}

export function useQuery<T>(
    queryFn: () => Promise<any>,
    options: UseQueryOptions<T> = {}
): UseQueryReturn<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<AxiosError | null>(null);

    const { enabled = true, onSuccess, onError } = options;

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await queryFn();
            const result = response.data;
            setData(result);
            onSuccess?.(result);
        } catch (err) {
            const axiosError = err as AxiosError;
            setError(axiosError);
            onError?.(axiosError);
        } finally {
            setLoading(false);
        }
    }, [queryFn, onSuccess, onError]);

    useEffect(() => {
        if (enabled) {
            fetchData();
        }
    }, [enabled, fetchData]);

    return { data, loading, error, refetch: fetchData };
}

// Hook untuk fetch paginated data
interface UsePaginatedQueryOptions<T> extends UseQueryOptions<T> {
    page?: number;
}

interface UsePaginatedQueryReturn<T> extends UseQueryReturn<T> {
    page: number;
    setPage: (page: number) => void;
    hasMore: boolean;
    total: number;
}

export function usePaginatedQuery<T>(
    queryFn: (page: number) => Promise<any>,
    options: UsePaginatedQueryOptions<T> = {}
): UsePaginatedQueryReturn<T> {
    const [page, setPage] = useState(options.page || 1);
    const [total, setTotal] = useState(0);

    const { data, loading, error, refetch } = useQuery(
        () => queryFn(page),
        {
            enabled: options.enabled,
            onSuccess: (response) => {
                if (response?.meta?.total) {
                    setTotal(response.meta.total);
                }
                options.onSuccess?.(response);
            },
            onError: options.onError,
        }
    );

    const hasMore = data?.meta?.current_page ? 
        data.meta.current_page < data.meta.last_page : false;

    return {
        data: data?.data || null,
        loading,
        error,
        refetch,
        page,
        setPage,
        hasMore,
        total,
    };
}

// Hook untuk mutation (POST, PUT, DELETE)
interface UseMutationOptions<T> {
    onSuccess?: (data: T) => void;
    onError?: (error: AxiosError) => void;
}

interface UseMutationReturn<T> {
    mutate: (payload?: any) => Promise<T | null>;
    loading: boolean;
    error: AxiosError | null;
    data: T | null;
}

export function useMutation<T>(
    mutationFn: (payload?: any) => Promise<any>,
    options: UseMutationOptions<T> = {}
): UseMutationReturn<T> {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<AxiosError | null>(null);
    const [data, setData] = useState<T | null>(null);

    const { onSuccess, onError } = options;

    const mutate = useCallback(
        async (payload?: any): Promise<T | null> => {
            try {
                setLoading(true);
                setError(null);
                const response = await mutationFn(payload);
                const result = response.data;
                setData(result);
                onSuccess?.(result);
                return result;
            } catch (err) {
                const axiosError = err as AxiosError;
                setError(axiosError);
                onError?.(axiosError);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [mutationFn, onSuccess, onError]
    );

    return { mutate, loading, error, data };
}
