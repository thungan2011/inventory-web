import { QueryFunction, QueryKey } from '@tanstack/query-core';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

function useDataFetching<T>(
    queryKey: QueryKey,
    queryFn: QueryFunction<T>,
    options?: Omit<UseQueryOptions<T>, 'queryFn' | 'queryKey'>,
) {
    const [data, setData] = useState<T | null>(null);
    const query = useQuery<T>({
        queryKey,
        queryFn,
        ...options,
    });

    useEffect(() => {
        if (query.data) {
            setData(query.data);
        }
    }, [query.data]);

    return { ...query, data };
}

export default useDataFetching;