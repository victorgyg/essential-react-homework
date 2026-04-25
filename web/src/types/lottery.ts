export type Status = 'running' | 'finished';

export interface Lottery {
  id: string;
  name: string;
  prize: string;
  type: string;
  status: Status;
}

export interface CreateLotteryRequest {
  name: string;
  prize: string;
  type: 'simple';
}

export interface RegisterRequest {
  lotteryId: string;
  name: string;
}

export interface RegisterResponse {
  status: 'Success' | 'Error';
}

export type ApiResponse<T> = {
  data?: T;
  error?: string;
};
