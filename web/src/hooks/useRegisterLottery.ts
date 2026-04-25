import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiPost } from '../utils/api';
import type { RegisterRequest, RegisterResponse } from '../types/lottery';
import { useNotification } from './useNotification';

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

export function useRegisterLottery() {
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: registerForLottery,
    onSuccess: () => {
      showNotification('Successfully registered for lottery!', 'success');
      queryClient.invalidateQueries({ queryKey: ['lotteries'] });
    },
    onError: (error: Error) => {
      showNotification(
        error.message || 'Failed to register for lottery',
        'error',
      );
    },
  });

  return {
    registerLottery: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
