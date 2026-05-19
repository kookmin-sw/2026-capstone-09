'use client';

import { useQuery } from '@tanstack/react-query';

import { privateApi } from '@/api';
import { searchKeys } from './keys/searchKeys';

export function useSearchNodesQuery(projectId: number, query: string) {
  return useQuery({
    queryKey: searchKeys.results(projectId, query),
    queryFn: () =>
      privateApi.node.search(projectId, { query }).then((res) => res.data.data?.nodes ?? []),
    enabled: !!projectId && query.trim().length > 0,
  });
}
