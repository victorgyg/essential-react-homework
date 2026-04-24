import { useMutation } from '@tanstack/react-query';
import { apiPost } from '../utils/api';
import type {
  CreateLotteryRequest,
  Lottery,
  ApiResponse,
} from '../types/lottery';
import { useNotification } from './useNotification';

async function createLottery(request: CreateLotteryRequest): Promise<Lottery> {
  const response: ApiResponse<Lottery> = await apiPost('/lotteries', {
    ...request,
    type: 'simple',
  });

  if (response.error) {
    throw new Error(response.error);
  }

  if (!response.data) {
    throw new Error('No data returned from server');
  }

  return response.data;
}

export function useCreateLottery() {
  const { showNotification } = useNotification();

  const mutation = useMutation({
    mutationFn: createLottery,
    onSuccess: () => {
      showNotification('Lottery created successfully!', 'success');
    },
    onError: (error: Error) => {
      showNotification(error.message || 'Failed to create lottery', 'error');
    },
  });

  return {
    createLottery: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    data: mutation.data,
  };
}
