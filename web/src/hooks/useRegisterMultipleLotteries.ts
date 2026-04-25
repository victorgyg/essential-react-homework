import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiPost } from '../utils/api';
import type { RegisterRequest, RegisterResponse } from '../types/lottery';
import { useNotification } from './useNotification';

interface RegisterMultipleResult {
  succeeded: number;
  failed: number;
  total: number;
}

async function registerForLottery(
  request: RegisterRequest,
): Promise<RegisterResponse> {
  const response = await apiPost<RegisterRequest, RegisterResponse>(
    '/register',
    request,
  );

  if (response.error) {
    throw new Error(response.error);
  }

  if (!response.data) {
    throw new Error('No response from server');
  }

  return response.data;
}

async function registerMultiple(
  lotteryIds: string[],
  name: string,
): Promise<RegisterMultipleResult> {
  const results = await Promise.allSettled(
    lotteryIds.map((id) => registerForLottery({ lotteryId: id, name })),
  );

  const succeeded = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;

  return { succeeded, failed, total: lotteryIds.length };
}

export function useRegisterMultipleLotteries() {
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      lotteryIds,
      name,
    }: {
      lotteryIds: string[];
      name: string;
    }) => registerMultiple(lotteryIds, name),
    onSuccess: (result) => {
      if (result.failed === 0) {
        showNotification(
          `Successfully registered for ${result.succeeded} ${
            result.succeeded === 1 ? 'lottery' : 'lotteries'
          }!`,
          'success',
        );
      } else if (result.succeeded > 0) {
        showNotification(
          `Registered for ${result.succeeded} out of ${result.total} lotteries`,
          'warning',
        );
      } else {
        showNotification(
          `Failed to register for all ${result.total} lotteries`,
          'error',
        );
      }
      queryClient.invalidateQueries({ queryKey: ['lotteries'] });
    },
    onError: (error: Error) => {
      showNotification(
        error.message || 'Failed to register for lotteries',
        'error',
      );
    },
  });

  return {
    registerMultiple: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
