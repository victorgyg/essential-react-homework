import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiPost } from '../utils/api';
import type {
  RegisterRequest,
  RegisterResponse,
  Lottery,
} from '../types/lottery';
import { useNotification } from './useNotification';

interface RegisterMultipleResult {
  succeeded: number;
  failed: number;
  total: number;
  failedLotteries: Array<{ lottery: Lottery; error: string }>;
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
  lotteries: Lottery[],
  name: string,
): Promise<RegisterMultipleResult> {
  const results = await Promise.allSettled(
    lotteries.map((lottery) =>
      registerForLottery({ lotteryId: lottery.id, name }).then(() => lottery),
    ),
  );

  const succeeded = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;

  const failedLotteries = results
    .map((result, index) => {
      if (result.status === 'rejected') {
        return {
          lottery: lotteries[index],
          error: result.reason?.message || 'Unknown error',
        };
      }
      return null;
    })
    .filter(
      (item): item is { lottery: Lottery; error: string } => item !== null,
    );

  return { succeeded, failed, total: lotteries.length, failedLotteries };
}

export function useRegisterMultipleLotteries() {
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ lotteries, name }: { lotteries: Lottery[]; name: string }) =>
      registerMultiple(lotteries, name),
    onSuccess: (result) => {
      // Show individual error toasts for each failed lottery
      result.failedLotteries.forEach(({ lottery, error }) => {
        showNotification(
          `Failed to register for "${lottery.name}": ${error}`,
          'error',
        );
      });

      // Show success summary
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
