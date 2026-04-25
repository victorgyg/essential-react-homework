import { useLotteryModalsContext } from '../contexts/LotteryModalsContext';
import { useLotterySelectionContext } from '../contexts/LotterySelectionContext';

export function useRegisterModal() {
  const { isRegisterModalOpen, openRegisterModal, closeRegisterModal } =
    useLotteryModalsContext();
  const { selectedLotteryIds, clearSelection } = useLotterySelectionContext();

  return {
    isOpen: isRegisterModalOpen,
    selectedLotteryIds,
    open: openRegisterModal,
    close: closeRegisterModal,
    clearSelection,
  };
}
