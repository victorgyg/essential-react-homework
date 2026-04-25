import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../utils/api';
import type { Lottery } from '../types/lottery';

async function fetchLotteries(): Promise<Lottery[]> {
  const response = await apiGet<Lottery[]>('/lotteries');

  if (response.error) {
    throw new Error(response.error);
  }

  return response.data || [];
}

export function useGetLotteries() {
  const query = useQuery({
    queryKey: ['lotteries'],
    queryFn: fetchLotteries,
  });

  return {
    lotteries: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
