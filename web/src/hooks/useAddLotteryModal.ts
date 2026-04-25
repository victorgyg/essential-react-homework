import { useLotteryModalContext } from '../contexts/LotteryModalContext';

export function useAddLotteryModal() {
  const { isOpen, openModal, closeModal } = useLotteryModalContext();

  return {
    isOpen,
    open: openModal,
    close: closeModal,
  };
}
