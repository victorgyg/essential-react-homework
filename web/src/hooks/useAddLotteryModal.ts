import { useLotteryModalsContext } from '../contexts/LotteryModalsContext';

export function useAddLotteryModal() {
  const { isAddModalOpen, openAddModal, closeAddModal } =
    useLotteryModalsContext();

  return {
    isOpen: isAddModalOpen,
    open: openAddModal,
    close: closeAddModal,
  };
}
